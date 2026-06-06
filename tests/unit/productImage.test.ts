import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PRODUCT_IMAGE,
  dummyProductImageUrl,
  isExternalImageUrl,
  resolveProductImageUrl
} from '#shared/utils/productImage'

describe('productImage utils', () => {
  it('membuat URL dummy berbasis slug', () => {
    expect(dummyProductImageUrl('headphone-bluetooth')).toBe(
      'https://picsum.photos/seed/headphone-bluetooth/600/600'
    )
  })

  it('menggunakan URL dari database jika ada', () => {
    const url = 'https://example.com/produk.jpg'
    expect(resolveProductImageUrl([{ url }], 'produk-a')).toBe(url)
  })

  it('fallback ke dummy URL jika gambar kosong', () => {
    expect(resolveProductImageUrl([], 'produk-b')).toContain('picsum.photos')
    expect(resolveProductImageUrl(undefined, 'produk-c')).toContain('produk-c')
  })

  it('mendeteksi URL eksternal', () => {
    expect(isExternalImageUrl('https://cdn.example.com/a.jpg')).toBe(true)
    expect(isExternalImageUrl('/images/local.png')).toBe(false)
  })

  it('default image adalah URL eksternal', () => {
    expect(DEFAULT_PRODUCT_IMAGE).toMatch(/^https:\/\//)
  })
})
