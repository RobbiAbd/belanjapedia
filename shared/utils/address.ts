import { z } from 'zod'

export const addressSchema = z.object({
  label: z.string().trim().max(50).optional(),
  recipient: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100),
  phone: z.string().trim().min(8, 'Nomor telepon tidak valid').max(20),
  address: z.string().trim().min(5, 'Alamat terlalu pendek'),
  city: z.string().trim().min(2, 'Kota wajib diisi'),
  province: z.string().trim().min(2, 'Provinsi wajib diisi'),
  postalCode: z.string().trim().min(4, 'Kode pos tidak valid').max(10),
  isDefault: z.boolean().optional().default(false)
})

export type AddressInput = z.infer<typeof addressSchema>

export type SavedAddress = AddressInput & {
  id: number
  createdAt: string
  updatedAt: string
}

export function shippingFormToAddressInput(shipping: {
  name: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
}, label = 'Rumah'): AddressInput {
  return {
    label,
    recipient: shipping.name,
    phone: shipping.phone,
    address: shipping.address,
    city: shipping.city,
    province: shipping.province,
    postalCode: shipping.postalCode,
    isDefault: false
  }
}

export function addressToShippingForm(address: {
  recipient: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
}) {
  return {
    name: address.recipient,
    phone: address.phone,
    address: address.address,
    city: address.city,
    province: address.province,
    postalCode: address.postalCode
  }
}
