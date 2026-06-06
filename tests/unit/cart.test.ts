import { describe, expect, it } from 'vitest'
import type { CartItem, ProductListItem } from '#shared/types/product'
import {
  addCartItem,
  calcItemCount,
  calcSubtotal,
  removeCartItem,
  updateCartItemQuantity
} from '#shared/utils/cart'

const sampleProduct: ProductListItem = {
  id: 1,
  name: 'Headphone Bluetooth',
  slug: 'headphone-bluetooth',
  price: 3_500_000,
  comparePrice: 4_500_000,
  stock: 50,
  isFeatured: true,
  category: null,
  images: [{ id: 1, url: '/img/test.svg', alt: 'test', sortOrder: 0 }]
}

describe('addCartItem', () => {
  it('menambah item baru ke keranjang', () => {
    const items = addCartItem([], sampleProduct, 2)
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({
      productId: 1,
      quantity: 2,
      price: 3_500_000
    })
  })

  it('menambah qty jika produk sama sudah ada', () => {
    const first = addCartItem([], sampleProduct, 1)
    const second = addCartItem(first, sampleProduct, 2)
    expect(second).toHaveLength(1)
    expect(second[0]?.quantity).toBe(3)
  })

  it('memisahkan item dengan varian berbeda', () => {
    const withVariant = addCartItem([], sampleProduct, 1, 'Putih')
    const another = addCartItem(withVariant, sampleProduct, 1, 'Hitam')
    expect(another).toHaveLength(2)
  })

  it('menggunakan URL dummy berbasis slug jika produk tanpa gambar', () => {
    const noImage = { ...sampleProduct, images: [] }
    const items = addCartItem([], noImage)
    expect(items[0]?.image).toContain('picsum.photos/seed/headphone-bluetooth')
  })
})

describe('updateCartItemQuantity', () => {
  const items: CartItem[] = [{
    productId: 1,
    slug: 'headphone-bluetooth',
    name: 'Headphone',
    price: 3_500_000,
    image: '/img/test.svg',
    quantity: 2
  }]

  it('mengupdate jumlah item', () => {
    const updated = updateCartItemQuantity(items, 1, 5)
    expect(updated[0]?.quantity).toBe(5)
  })

  it('menghapus item jika qty 0', () => {
    const updated = updateCartItemQuantity(items, 1, 0)
    expect(updated).toHaveLength(0)
  })
})

describe('removeCartItem', () => {
  it('menghapus item berdasarkan productId', () => {
    const items: CartItem[] = [
      { productId: 1, slug: 'a', name: 'A', price: 100, image: '', quantity: 1 },
      { productId: 2, slug: 'b', name: 'B', price: 200, image: '', quantity: 1 }
    ]
    const result = removeCartItem(items, 1)
    expect(result).toHaveLength(1)
    expect(result[0]?.productId).toBe(2)
  })
})

describe('calcItemCount & calcSubtotal', () => {
  it('menghitung total item dan subtotal', () => {
    const items: CartItem[] = [
      { productId: 1, slug: 'a', name: 'A', price: 1_000_000, image: '', quantity: 2 },
      { productId: 2, slug: 'b', name: 'B', price: 500_000, image: '', quantity: 1 }
    ]
    expect(calcItemCount(items)).toBe(3)
    expect(calcSubtotal(items)).toBe(2_500_000)
  })
})
