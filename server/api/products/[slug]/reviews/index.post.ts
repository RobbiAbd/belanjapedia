import { z } from 'zod'
import { zodFieldErrors } from '#shared/utils/auth'
import { createReviewSchema } from '#shared/utils/review'

const paramsSchema = z.object({
  slug: z.string().min(1)
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
      data: apiError('Slug produk tidak valid')
    })
  }

  const body = await readBody(event)
  const parsed = createReviewSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      data: apiError('Validasi gagal', zodFieldErrors(parsed.error))
    })
  }

  const product = await prisma.product.findFirst({
    where: {
      slug: params.data.slug,
      isActive: true,
      deletedAt: null
    },
    select: { id: true }
  })

  if (!product) {
    throw createError({
      statusCode: 404,
      data: apiError('Produk tidak ditemukan')
    })
  }

  const canReview = await userCanReviewProduct(userId, product.id)

  if (!canReview) {
    throw createError({
      statusCode: 403,
      data: apiError('Hanya pembeli dengan pesanan selesai yang bisa memberi ulasan')
    })
  }

  const review = await prisma.review.upsert({
    where: {
      productId_userId: {
        productId: product.id,
        userId
      }
    },
    update: {
      rating: parsed.data.rating,
      comment: parsed.data.comment?.trim() || null
    },
    create: {
      productId: product.id,
      userId,
      rating: parsed.data.rating,
      comment: parsed.data.comment?.trim() || null
    },
    include: {
      user: { select: { name: true } }
    }
  })

  const stats = await getProductRatingStats(product.id)

  return apiSuccess(
    {
      review: formatReviewResponse(review),
      stats
    },
    'Ulasan berhasil disimpan'
  )
})
