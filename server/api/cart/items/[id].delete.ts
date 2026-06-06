import { z } from 'zod'

const paramsSchema = z.object({
  id: z.coerce.number().int().positive()
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

  const params = paramsSchema.safeParse(getRouterParams(event))

  if (!params.success) {
    throw createError({
      statusCode: 400,
      data: apiError('ID item tidak valid')
    })
  }

  const cart = await getOrCreateCart(userId)

  const deleted = await prisma.cartItem.deleteMany({
    where: {
      id: params.data.id,
      cartId: cart.id
    }
  })

  if (deleted.count === 0) {
    throw createError({
      statusCode: 404,
      data: apiError('Item keranjang tidak ditemukan')
    })
  }

  const refreshed = await getOrCreateCart(userId)

  return apiSuccess(
    { items: mapDbCartItems(refreshed.items) },
    'Item dihapus dari keranjang'
  )
})
