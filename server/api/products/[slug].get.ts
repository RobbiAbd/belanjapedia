export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug produk wajib diisi' })
  }

  const product = await prisma.product.findFirst({
    where: {
      slug,
      isActive: true,
      deletedAt: null
    },
    include: {
      category: {
        select: { id: true, name: true, slug: true, description: true }
      },
      images: { orderBy: { sortOrder: 'asc' } }
    }
  })

  if (!product) {
    throw createError({ statusCode: 404, message: 'Produk tidak ditemukan' })
  }

  const [stats, soldCount] = await Promise.all([
    getProductRatingStats(product.id),
    getProductsSoldCounts([product.id])
  ])

  return apiSuccess({
    ...product,
    rating: stats.rating,
    reviewCount: stats.reviewCount,
    soldCount: soldCount.get(product.id) ?? 0
  }, 'Detail produk berhasil diambil')
})
