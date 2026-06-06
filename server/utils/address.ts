import type { Address } from '@prisma/client'

export function formatAddressResponse(address: Address) {
  return {
    id: address.id,
    label: address.label,
    recipient: address.recipient,
    phone: address.phone,
    address: address.address,
    city: address.city,
    province: address.province,
    postalCode: address.postalCode,
    isDefault: address.isDefault,
    createdAt: address.createdAt,
    updatedAt: address.updatedAt
  }
}
