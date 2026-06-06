import { z } from 'zod'
import type { ProductListItem, WishlistItem } from '#shared/types/product'
import { resolveProductImageUrl } from '#shared/utils/productImage'

export const addWishlistSchema = z.object({
  productId: z.number().int().positive()
})

export type WishlistProductRecord = {
  id: number
  name: string
  slug: string
  price: number
  images: { url: string, alt: string | null, sortOrder: number }[]
}

export function mapWishlistProduct(product: WishlistProductRecord): WishlistItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: resolveProductImageUrl(product.images, product.slug)
  }
}

export function isInWishlist(items: WishlistItem[], productId: number): boolean {
  return items.some(item => item.productId === productId)
}

export function addWishlistItem(
  items: WishlistItem[],
  product: ProductListItem
): WishlistItem[] {
  if (isInWishlist(items, product.id)) {
    return items
  }

  return [
    ...items,
    {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: resolveProductImageUrl(product.images, product.slug)
    }
  ]
}

export function removeWishlistItem(
  items: WishlistItem[],
  productId: number
): WishlistItem[] {
  return items.filter(item => item.productId !== productId)
}

export function toggleWishlistItem(
  items: WishlistItem[],
  product: ProductListItem
): { items: WishlistItem[], added: boolean } {
  if (isInWishlist(items, product.id)) {
    return {
      items: removeWishlistItem(items, product.id),
      added: false
    }
  }

  return {
    items: addWishlistItem(items, product),
    added: true
  }
}
