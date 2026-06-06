import { zodFieldErrors } from '#shared/utils/auth'
import {
  buildOrderLines,
  calcOrderAmounts,
  createOrderSchema,
  generateOrderNumber,
  type OrderProductSnapshot
} from '#shared/utils/order'
import {
  calcMaxCoinsForOrder,
  calcOrderTotalAfterCoins,
  coinsToPriceUnits
} from '#shared/utils/coin'
import { CoinTransactionType, OrderStatus, PaymentStatus } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      data: apiError('Sesi tidak valid')
    })
  }

  const body = await readBody(event)
  const parsed = createOrderSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      data: apiError('Validasi gagal', zodFieldErrors(parsed.error))
    })
  }

  const productIds = [...new Set(parsed.data.items.map(item => item.productId))]

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      deletedAt: null,
      isActive: true
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      stock: true,
      isActive: true,
      deletedAt: true
    }
  })

  if (products.length !== productIds.length) {
    throw createError({
      statusCode: 400,
      data: apiError('Beberapa produk tidak tersedia')
    })
  }

  const productMap = new Map<number, OrderProductSnapshot>(
    products.map(product => [product.id, product])
  )

  const lineResult = buildOrderLines(parsed.data.items, productMap)

  if ('error' in lineResult) {
    throw createError({
      statusCode: 400,
      data: apiError(lineResult.error)
    })
  }

  const amounts = calcOrderAmounts(lineResult.lines)
  const orderNumber = generateOrderNumber()
  const coinsToUse = parsed.data.coinsToUse ?? 0

  const dbUser = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null
    },
    select: { coins: true }
  })

  if (!dbUser) {
    throw createError({
      statusCode: 404,
      data: apiError('Pengguna tidak ditemukan')
    })
  }

  const maxCoins = calcMaxCoinsForOrder(amounts.total, dbUser.coins)

  if (coinsToUse > maxCoins) {
    throw createError({
      statusCode: 400,
      data: apiError('Jumlah coin melebihi saldo atau total pesanan', {
        coinsToUse: 'Coin tidak valid'
      })
    })
  }

  const coinDiscount = coinsToPriceUnits(coinsToUse)
  const finalTotal = calcOrderTotalAfterCoins(amounts.total, coinsToUse)

  let order

  try {
    order = await prisma.$transaction(async (tx) => {
    let shippingAddressId: number

    if (parsed.data.addressId) {
      const savedAddress = await tx.address.findFirst({
        where: {
          id: parsed.data.addressId,
          userId
        }
      })

      if (!savedAddress) {
        throw new Error('Alamat tidak ditemukan')
      }

      shippingAddressId = savedAddress.id
    } else {
      const shipping = parsed.data.shipping!
      const saveAddress = parsed.data.saveAddress ?? false
      const label = saveAddress
        ? (parsed.data.addressLabel?.trim() || 'Rumah')
        : 'Checkout'

      const addressCount = await tx.address.count({ where: { userId } })
      const isDefault = saveAddress && addressCount === 0

      if (isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false }
        })
      }

      const shippingAddress = await tx.address.create({
        data: {
          userId,
          label,
          recipient: shipping.name,
          phone: shipping.phone,
          address: shipping.address,
          city: shipping.city,
          province: shipping.province,
          postalCode: shipping.postalCode,
          isDefault
        }
      })

      shippingAddressId = shippingAddress.id
    }

    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        shippingAddressId,
        status: OrderStatus.PENDING,
        subtotal: amounts.subtotal,
        shippingCost: amounts.shippingCost,
        discount: coinDiscount,
        coinsUsed: coinsToUse,
        total: finalTotal,
        notes: parsed.data.notes ?? null,
        items: {
          create: lineResult.lines.map(line => ({
            productId: line.productId,
            productName: line.productName,
            productSlug: line.productSlug,
            price: line.price,
            quantity: line.quantity,
            subtotal: line.subtotal
          }))
        },
        payment: {
          create: {
            amount: finalTotal,
            status: PaymentStatus.PENDING,
            paymentMethod: parsed.data.paymentMethod
          }
        }
      },
      include: {
        items: true,
        payment: true,
        shippingAddress: true
      }
    })

    for (const line of lineResult.lines) {
      const updated = await tx.product.updateMany({
        where: {
          id: line.productId,
          stock: { gte: line.quantity }
        },
        data: {
          stock: { decrement: line.quantity }
        }
      })

      if (updated.count === 0) {
        throw new Error(`Stok ${line.productName} tidak mencukupi`)
      }
    }

    const cart = await tx.cart.findUnique({ where: { userId } })

    if (cart) {
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
    }

    if (coinsToUse > 0) {
      const coinUpdate = await tx.user.updateMany({
        where: {
          id: userId,
          coins: { gte: coinsToUse }
        },
        data: {
          coins: { decrement: coinsToUse }
        }
      })

      if (coinUpdate.count === 0) {
        throw new Error('Saldo coin tidak mencukupi')
      }

      await tx.coinTransaction.create({
        data: {
          userId,
          amount: -coinsToUse,
          type: CoinTransactionType.ORDER_PAYMENT,
          reference: orderNumber
        }
      })
    }

    return createdOrder
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat pesanan'

    if (message.includes('Stok') || message.includes('coin') || message.includes('Alamat')) {
      throw createError({
        statusCode: 400,
        data: apiError(message)
      })
    }

    throw error
  }

  if (coinsToUse > 0) {
    const refreshedUser = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        coins: true,
        role: true
      }
    })

    if (refreshedUser && session.user) {
      await replaceUserSession(event, {
        user: mapUserToSession(refreshedUser),
        loggedInAt: session.loggedInAt
      })
    }
  }

  return apiSuccess(
    { order: formatOrderResponse(order) },
    'Pesanan berhasil dibuat'
  )
})
