import { z } from 'zod'

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating minimal 1 bintang').max(5, 'Rating maksimal 5 bintang'),
  comment: z.string().trim().max(1000, 'Ulasan maksimal 1000 karakter').optional()
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>

export type ProductReviewItem = {
  id: number
  productId: number
  userId: number
  userName: string
  rating: number
  comment: string | null
  createdAt: string
  updatedAt: string
}

export function calcProductRating(reviews: { rating: number }[]): {
  rating: number
  reviewCount: number
} {
  if (reviews.length === 0) {
    return { rating: 0, reviewCount: 0 }
  }

  const sum = reviews.reduce((total, review) => total + review.rating, 0)

  return {
    rating: Math.round((sum / reviews.length) * 10) / 10,
    reviewCount: reviews.length
  }
}

export function roundRating(value: number | null | undefined): number {
  if (!value) return 0
  return Math.round(value * 10) / 10
}

export function formatRatingLabel(rating: number): string {
  return rating > 0 ? rating.toFixed(1) : '0.0'
}
