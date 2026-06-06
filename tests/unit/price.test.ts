import { describe, expect, it } from 'vitest'
import { discountPercent, formatPrice } from '#shared/utils/price'

describe('formatPrice', () => {
  it('memformat harga integer (sen) ke Rupiah IDR', () => {
    expect(formatPrice(3_500_000)).toContain('35')
    expect(formatPrice(3_500_000)).toMatch(/Rp/)
  })

  it('membulatkan nilai desimal', () => {
    expect(formatPrice(3_500_050)).toBe(formatPrice(3_500_100))
  })
})

describe('discountPercent', () => {
  it('menghitung persentase diskon', () => {
    expect(discountPercent(3_500_000, 4_500_000)).toBe(22)
  })

  it('mengembalikan 0 jika tidak ada harga coret', () => {
    expect(discountPercent(3_500_000, null)).toBe(0)
  })

  it('mengembalikan 0 jika harga coret lebih rendah', () => {
    expect(discountPercent(4_500_000, 3_500_000)).toBe(0)
  })
})
