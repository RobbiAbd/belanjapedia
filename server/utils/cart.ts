import type { CartItem } from '#shared/types/product'
import { resolveProductImageUrl } from '#shared/utils/productImage'

export async function getOrCreateCart(userId: number) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      items: {
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              stock: true,
              isActive: true,
              deletedAt: true,
              images: {
                orderBy: { sortOrder: 'asc' },
                take: 1,
                select: { url: true, alt: true, sortOrder: true }
              }
            }
          }
        }
      }
    }
  })
}

export function mapDbCartItems(
  items: {
    id: number
    productId: number
    quantity: number
    product: {
      id: number
      name: string
      slug: string
      price: number
      stock: number
      isActive: boolean
      deletedAt: Date | null
      images: { url: string, alt: string | null, sortOrder: number }[]
    }
  }[]
): CartItem[] {
  return items
    .filter(item => item.product && !item.product.deletedAt && item.product.isActive)
    .map(item => ({
      id: item.id,
      productId: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      price: item.product.price,
      image: resolveProductImageUrl(item.product.images, item.product.slug),
      quantity: item.quantity
    }))
}
