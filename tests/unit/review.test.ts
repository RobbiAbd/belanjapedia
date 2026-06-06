import { describe, expect, it } from 'vitest'
import {
  calcProductRating,
  createReviewSchema,
  formatRatingLabel,
  roundRating
} from '#shared/utils/review'

describe('createReviewSchema', () => {
  it('menerima ulasan valid', () => {
    const result = createReviewSchema.safeParse({
      rating: 5,
      comment: 'Produk bagus dan sesuai deskripsi.'
    })

    expect(result.success).toBe(true)
  })

  it('menolak rating di luar 1-5', () => {
    const result = createReviewSchema.safeParse({ rating: 0 })

    expect(result.success).toBe(false)
  })

  it('menolak komentar terlalu panjang', () => {
    const result = createReviewSchema.safeParse({
      rating: 4,
      comment: 'a'.repeat(1001)
    })

    expect(result.success).toBe(false)
  })
})

describe('calcProductRating', () => {
  it('menghitung rata-rata rating', () => {
    const result = calcProductRating([
      { rating: 5 },
      { rating: 4 },
      { rating: 3 }
    ])

    expect(result).toEqual({ rating: 4, reviewCount: 3 })
  })

  it('mengembalikan 0 jika belum ada ulasan', () => {
    expect(calcProductRating([])).toEqual({ rating: 0, reviewCount: 0 })
  })
})

describe('rating helpers', () => {
  it('membulatkan rating ke 1 desimal', () => {
    expect(roundRating(4.3333)).toBe(4.3)
    expect(roundRating(null)).toBe(0)
  })

  it('memformat label rating', () => {
    expect(formatRatingLabel(4.2)).toBe('4.2')
    expect(formatRatingLabel(0)).toBe('0.0')
  })
})
