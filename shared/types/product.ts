export interface ProductImage {
  id: number
  url: string
  alt: string | null
  sortOrder: number
}

export interface ProductCategory {
  id: number
  name: string
  slug: string
  description: string | null
}

export interface ProductListItem {
  id: number
  name: string
  slug: string
  price: number
  comparePrice: number | null
  stock: number
  isFeatured: boolean
  category: ProductCategory | null
  images: ProductImage[]
  rating?: number
  reviewCount?: number
  soldCount?: number
}

export interface ProductDetail extends ProductListItem {
  description: string | null
  sku: string | null
}

export interface CartItem {
  id?: number
  productId: number
  slug: string
  name: string
  price: number
  image: string
  quantity: number
  variant?: string
}

export interface WishlistItem {
  productId: number
  slug: string
  name: string
  price: number
  image: string
}
