import { describe, expect, it } from 'vitest'
import type { ProductListItem } from '#shared/types/product'
import {
  addWishlistItem,
  addWishlistSchema,
  isInWishlist,
  mapWishlistProduct,
  removeWishlistItem,
  toggleWishlistItem
} from '#shared/utils/wishlist'

const sampleProduct: ProductListItem = {
  id: 1,
  name: 'Headphone Bluetooth',
  slug: 'headphone-bluetooth',
  price: 3_500_000,
  comparePrice: null,
  stock: 10,
  isFeatured: true,
  category: null,
  images: []
}

describe('addWishlistSchema', () => {
  it('menerima productId valid', () => {
    const result = addWishlistSchema.safeParse({ productId: 1 })
    expect(result.success).toBe(true)
  })

  it('menolak productId tidak valid', () => {
    const result = addWishlistSchema.safeParse({ productId: 0 })
    expect(result.success).toBe(false)
  })
})

describe('mapWishlistProduct', () => {
  it('memetakan produk ke format wishlist', () => {
    const item = mapWishlistProduct({
      id: 1,
      name: 'Headphone',
      slug: 'headphone-bluetooth',
      price: 3_500_000,
      images: []
    })

    expect(item.productId).toBe(1)
    expect(item.slug).toBe('headphone-bluetooth')
    expect(item.image).toContain('headphone-bluetooth')
  })
})

describe('wishlist utils', () => {
  it('menambahkan produk ke wishlist', () => {
    const items = addWishlistItem([], sampleProduct)

    expect(items).toHaveLength(1)
    expect(items[0]?.productId).toBe(1)
    expect(items[0]?.slug).toBe('headphone-bluetooth')
  })

  it('tidak menambahkan produk duplikat', () => {
    const first = addWishlistItem([], sampleProduct)
    const second = addWishlistItem(first, sampleProduct)

    expect(second).toHaveLength(1)
  })

  it('menghapus produk dari wishlist', () => {
    const items = removeWishlistItem(addWishlistItem([], sampleProduct), 1)

    expect(items).toHaveLength(0)
    expect(isInWishlist(items, 1)).toBe(false)
  })

  it('toggle menambah lalu menghapus produk', () => {
    const added = toggleWishlistItem([], sampleProduct)
    expect(added.added).toBe(true)
    expect(added.items).toHaveLength(1)

    const removed = toggleWishlistItem(added.items, sampleProduct)
    expect(removed.added).toBe(false)
    expect(removed.items).toHaveLength(0)
  })
})
