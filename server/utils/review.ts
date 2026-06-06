import { OrderStatus } from '@prisma/client'
import { roundRating } from '#shared/utils/review'

type ReviewWithUser = {
  id: number
  productId: number
  userId: number
  rating: number
  comment: string | null
  createdAt: Date
  updatedAt: Date
  user: { name: string }
}

export function formatReviewResponse(review: ReviewWithUser) {
  return {
    id: review.id,
    productId: review.productId,
    userId: review.userId,
    userName: review.user.name,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt
  }
}

export async function getProductRatingStats(productId: number) {
  const aggregate = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { _all: true }
  })

  return {
    rating: roundRating(aggregate._avg.rating),
    reviewCount: aggregate._count._all
  }
}

export async function getProductsRatingStats(productIds: number[]) {
  if (productIds.length === 0) return new Map<number, { rating: number, reviewCount: number }>()

  const aggregates = await prisma.review.groupBy({
    by: ['productId'],
    where: { productId: { in: productIds } },
    _avg: { rating: true },
    _count: { _all: true }
  })

  return new Map(
    aggregates.map(item => [
      item.productId,
      {
        rating: roundRating(item._avg.rating),
        reviewCount: item._count._all
      }
    ])
  )
}

export async function getProductsSoldCounts(productIds: number[]) {
  if (productIds.length === 0) return new Map<number, number>()

  const aggregates = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: {
      productId: { in: productIds },
      order: { status: { not: OrderStatus.CANCELLED } }
    },
    _sum: { quantity: true }
  })

  return new Map(
    aggregates.map(item => [item.productId, item._sum.quantity ?? 0])
  )
}

export async function userCanReviewProduct(userId: number, productId: number) {
  const purchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: OrderStatus.DELIVERED
      }
    },
    select: { id: true }
  })

  return !!purchased
}
