import { z } from 'zod'
import { zodFieldErrors } from '#shared/utils/auth'

const bodySchema = z.object({
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().min(1).max(99)
  })).default([])
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

  if (parsed.data.items.length === 0) {
    const cart = await getOrCreateCart(userId)
    return apiSuccess({ items: mapDbCartItems(cart.items) }, 'Keranjang disinkronkan')
  }

  const productIds = [...new Set(parsed.data.items.map(item => item.productId))]

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      deletedAt: null,
      isActive: true
    },
    select: { id: true }
  })

  const validIds = new Set(products.map(product => product.id))
  const cart = await getOrCreateCart(userId)

  for (const item of parsed.data.items) {
    if (!validIds.has(item.productId)) continue

    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: item.productId
        }
      }
    })

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: Math.min(existing.quantity + item.quantity, 99)
        }
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity
        }
      })
    }
  }

  const refreshed = await getOrCreateCart(userId)

  return apiSuccess(
    { items: mapDbCartItems(refreshed.items) },
    'Keranjang disinkronkan'
  )
})
