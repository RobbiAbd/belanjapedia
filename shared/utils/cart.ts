import type { CartItem, ProductListItem } from '#shared/types/product'
import { resolveProductImageUrl } from '#shared/utils/productImage'


export function calcItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function addCartItem(
  items: CartItem[],
  product: ProductListItem,
  quantity = 1,
  variant?: string
): CartItem[] {
  const image = resolveProductImageUrl(product.images, product.slug)
  const existing = items.find(
    item => item.productId === product.id && item.variant === variant
  )

  if (existing) {
    return items.map(item =>
      item === existing
        ? { ...item, quantity: item.quantity + quantity }
        : item
    )
  }

  return [
    ...items,
    {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image,
      quantity,
      variant
    }
  ]
}

export function updateCartItemQuantity(
  items: CartItem[],
  productId: number,
  quantity: number,
  variant?: string
): CartItem[] {
  if (quantity <= 0) {
    return removeCartItem(items, productId, variant)
  }

  return items.map(item =>
    item.productId === productId && item.variant === variant
      ? { ...item, quantity }
      : item
  )
}

export function removeCartItem(
  items: CartItem[],
  productId: number,
  variant?: string
): CartItem[] {
  return items.filter(
    item => !(item.productId === productId && item.variant === variant)
  )
}
