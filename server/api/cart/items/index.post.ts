import { z } from 'zod'
import { zodFieldErrors } from '#shared/utils/auth'

const bodySchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(99).default(1)
})

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
  const parsed = bodySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      data: apiError('Validasi gagal', zodFieldErrors(parsed.error))
    })
  }

  const product = await prisma.product.findFirst({
    where: {
      id: parsed.data.productId,
      deletedAt: null,
      isActive: true
    }
  })

  if (!product) {
    throw createError({
      statusCode: 404,
      data: apiError('Produk tidak ditemukan')
    })
  }

  const cart = await getOrCreateCart(userId)

  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: product.id
      }
    }
  })

  if (existing) {
    const nextQuantity = Math.min(existing.quantity + parsed.data.quantity, 99)
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: nextQuantity }
    })
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        quantity: parsed.data.quantity
      }
    })
  }

  const refreshed = await getOrCreateCart(userId)

  return apiSuccess(
    { items: mapDbCartItems(refreshed.items) },
    'Produk ditambahkan ke keranjang'
  )
})
