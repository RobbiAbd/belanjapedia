import type { Address, Order, OrderItem, Payment } from '@prisma/client'
import { formatPaymentMethod } from '#shared/utils/order'

type OrderWithRelations = Order & {
  items: OrderItem[]
  payment: Payment | null
  shippingAddress: Address
}

export function formatOrderResponse(order: OrderWithRelations) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    discount: order.discount,
    coinsUsed: order.coinsUsed,
    total: order.total,
    notes: order.notes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    shippingAddress: {
      recipient: order.shippingAddress.recipient,
      phone: order.shippingAddress.phone,
      address: order.shippingAddress.address,
      city: order.shippingAddress.city,
      province: order.shippingAddress.province,
      postalCode: order.shippingAddress.postalCode
    },
    payment: order.payment
      ? {
          status: order.payment.status,
          paymentMethod: order.payment.paymentMethod,
          paymentMethodLabel: order.payment.paymentMethod
            ? formatPaymentMethod(order.payment.paymentMethod)
            : null,
          amount: order.payment.amount,
          paidAt: order.payment.paidAt
        }
      : null,
    items: order.items.map(item => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      productSlug: item.productSlug,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal
    }))
  }
}

export function formatOrderListItem(order: Order & { payment: Payment | null, items: { quantity: number }[] }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    itemCount,
    paymentStatus: order.payment?.status ?? null,
    paymentMethod: order.payment?.paymentMethod ?? null,
    createdAt: order.createdAt
  }
}
