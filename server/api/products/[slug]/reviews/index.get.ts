import { z } from 'zod'

const paramsSchema = z.object({
  slug: z.string().min(1)
})

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10)
})

export default defineEventHandler(async (event) => {
  const params = paramsSchema.safeParse(getRouterParams(event))

  if (!params.success) {
    throw createError({
      statusCode: 400,
      data: apiError('Slug produk tidak valid')
    })
  }

  const query = querySchema.safeParse(getQuery(event))

  if (!query.success) {
    throw createError({
      statusCode: 400,
      data: apiError('Parameter tidak valid')
    })
  }

  const product = await prisma.product.findFirst({
    where: {
      slug: params.data.slug,
      isActive: true,
      deletedAt: null
    },
    select: { id: true, slug: true, name: true }
  })

  if (!product) {
    throw createError({
      statusCode: 404,
      data: apiError('Produk tidak ditemukan')
    })
  }

  const { page, limit } = query.data
  const skip = (page - 1) * limit

  const [reviews, total, stats] = await Promise.all([
    prisma.review.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: { select: { name: true } }
      }
    }),
    prisma.review.count({ where: { productId: product.id } }),
    getProductRatingStats(product.id)
  ])

  const session = await getUserSession(event)
  const userId = session.user?.id

  let myReview = null
  let canReview = false

  if (userId) {
    const existing = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId: product.id,
          userId
        }
      },
      include: {
        user: { select: { name: true } }
      }
    })

    if (existing) {
      myReview = formatReviewResponse(existing)
    } else {
      canReview = await userCanReviewProduct(userId, product.id)
    }
  }

  return apiSuccess({
    product: {
      id: product.id,
      slug: product.slug,
      name: product.name
    },
    stats,
    reviews: reviews.map(formatReviewResponse),
    myReview,
    canReview,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }, 'Ulasan produk berhasil diambil')
})
