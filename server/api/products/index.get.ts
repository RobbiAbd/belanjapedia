import { z } from 'zod'

const querySchema = z.object({
  category: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12)
})

export default defineEventHandler(async (event) => {
  const query = querySchema.parse(getQuery(event))
  const skip = (query.page - 1) * query.limit

  const where = {
    isActive: true,
    deletedAt: null,
    ...(query.category ? { category: { slug: query.category } } : {}),
    ...(query.featured === 'true' ? { isFeatured: true } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search } },
            { description: { contains: query.search } }
          ]
        }
      : {})
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: query.limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { id: true, name: true, slug: true, description: true }
        },
        images: { orderBy: { sortOrder: 'asc' }, take: 1 }
      }
    }),
    prisma.product.count({ where })
  ])

  const productIds = products.map(product => product.id)

  const [ratingStats, soldCounts] = await Promise.all([
    getProductsRatingStats(productIds),
    getProductsSoldCounts(productIds)
  ])

  const data = products.map(product => {
    const stats = ratingStats.get(product.id)

    return {
      ...product,
      rating: stats?.rating ?? 0,
      reviewCount: stats?.reviewCount ?? 0,
      soldCount: soldCounts.get(product.id) ?? 0
    }
  })

  return apiSuccess({
    items: data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit)
    }
  }, 'Produk berhasil diambil')
})
