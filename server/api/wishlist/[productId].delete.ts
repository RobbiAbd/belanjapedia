import { z } from 'zod'

const paramsSchema = z.object({
  productId: z.coerce.number().int().positive()
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
      data: apiError('ID produk tidak valid')
    })
  }

  const deleted = await prisma.wishlistItem.deleteMany({
    where: {
      userId,
      productId: params.data.productId
    }
  })

  if (deleted.count === 0) {
    throw createError({
      statusCode: 404,
      data: apiError('Produk tidak ada di wishlist')
    })
  }

  return apiSuccess(null, 'Dihapus dari wishlist')
})
