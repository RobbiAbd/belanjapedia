import { mapWishlistProduct } from '#shared/utils/wishlist'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      data: apiError('Sesi tidak valid')
    })
  }

  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          deletedAt: true,
          isActive: true,
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 1,
            select: { url: true, alt: true, sortOrder: true }
          }
        }
      }
    }
  })

  const mapped = items
    .filter(item => item.product && !item.product.deletedAt && item.product.isActive)
    .map(item => mapWishlistProduct(item.product))

  return apiSuccess({ items: mapped }, 'Wishlist berhasil diambil')
})
