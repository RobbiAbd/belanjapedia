import { z } from 'zod'
import { mapApiFieldErrors, zodFieldErrors } from '#shared/utils/auth'

export const SHIPPING_COST = 1_500_000
export const TAX_RATE = 0.11

export const PAYMENT_METHODS = ['transfer', 'ewallet', 'cod'] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export const checkoutItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(99)
})

export const shippingSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100),
  phone: z.string().trim().min(8, 'Nomor telepon tidak valid').max(20),
  address: z.string().trim().min(5, 'Alamat terlalu pendek'),
  city: z.string().trim().min(2, 'Kota wajib diisi'),
  province: z.string().trim().min(2, 'Provinsi wajib diisi'),
  postalCode: z.string().trim().min(4, 'Kode pos tidak valid').max(10)
})

export const createOrderSchema = z.object({
  addressId: z.number().int().positive().optional(),
  shipping: shippingSchema.optional(),
  saveAddress: z.boolean().optional().default(false),
  addressLabel: z.string().trim().max(50).optional(),
  paymentMethod: z.enum(PAYMENT_METHODS, {
    error: 'Metode pembayaran tidak valid'
  }),
  items: z.array(checkoutItemSchema).min(1, 'Keranjang tidak boleh kosong'),
  coinsToUse: z.number().int().min(0).optional().default(0),
  notes: z.string().trim().max(500).optional()
}).superRefine((data, ctx) => {
  if (!data.addressId && !data.shipping) {
    ctx.addIssue({
      code: 'custom',
      message: 'Alamat pengiriman wajib diisi',
      path: ['shipping']
    })
  }
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export type ShippingFormInput = z.infer<typeof shippingSchema>

export function validateShippingFields(shipping: ShippingFormInput): Record<string, string> {
  const parsed = shippingSchema.safeParse(shipping)

  if (parsed.success) {
    return {}
  }

  return zodFieldErrors(parsed.error)
}

export function mapOrderApiErrors(apiErrors: Record<string, string>): {
  shipping: Record<string, string>
  general: Record<string, string>
} {
  const shipping = mapApiFieldErrors(apiErrors)
  const general: Record<string, string> = {}

  for (const [key, message] of Object.entries(apiErrors)) {
    if (!key.startsWith('shipping.') && key !== 'items' && !key.startsWith('items.')) {
      general[key] = message
    }
  }

  return { shipping, general }
}

export type OrderProductSnapshot = {
  id: number
  name: string
  slug: string
  price: number
  stock: number
  isActive: boolean
  deletedAt: Date | null
}

export type ValidatedOrderLine = {
  productId: number
  productName: string
  productSlug: string
  price: number
  quantity: number
  subtotal: number
}

export function calcShipping(itemCount: number): number {
  return itemCount > 0 ? SHIPPING_COST : 0
}

export function calcTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE)
}

export function calcOrderTotal(subtotal: number, itemCount: number): number {
  const shipping = calcShipping(itemCount)
  const tax = calcTax(subtotal)
  return subtotal + shipping + tax
}

export function calcLineSubtotal(price: number, quantity: number): number {
  return price * quantity
}

export function generateOrderNumber(date = new Date()): string {
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `BP-${ymd}-${random}`
}

export function formatPaymentMethod(method: PaymentMethod | string): string {
  switch (method) {
    case 'transfer':
      return 'Transfer Bank'
    case 'ewallet':
      return 'E-Wallet'
    case 'cod':
      return 'COD (Bayar di Tempat)'
    default:
      return method
  }
}

export function buildOrderLines(
  items: { productId: number, quantity: number }[],
  products: Map<number, OrderProductSnapshot>
): { lines: ValidatedOrderLine[] } | { error: string } {
  const lines: ValidatedOrderLine[] = []

  for (const item of items) {
    const product = products.get(item.productId)

    if (!product || product.deletedAt || !product.isActive) {
      return { error: 'Produk tidak tersedia' }
    }

    if (item.quantity > product.stock) {
      return { error: `Stok ${product.name} tidak mencukupi` }
    }

    lines.push({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      price: product.price,
      quantity: item.quantity,
      subtotal: calcLineSubtotal(product.price, item.quantity)
    })
  }

  return { lines }
}

export function calcOrderAmounts(lines: ValidatedOrderLine[]) {
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0)
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const shippingCost = calcShipping(itemCount)
  const tax = calcTax(subtotal)
  const total = subtotal + shippingCost + tax

  return {
    subtotal,
    itemCount,
    shippingCost,
    tax,
    total
  }
}
