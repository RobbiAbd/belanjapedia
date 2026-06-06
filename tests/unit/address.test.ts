import { describe, expect, it } from 'vitest'
import {
  addressSchema,
  addressToShippingForm,
  shippingFormToAddressInput
} from '#shared/utils/address'

describe('addressSchema', () => {
  it('menerima alamat valid', () => {
    const result = addressSchema.safeParse({
      label: 'Rumah',
      recipient: 'Budi Santoso',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 1',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '12345',
      isDefault: true
    })

    expect(result.success).toBe(true)
  })

  it('menolak alamat terlalu pendek', () => {
    const result = addressSchema.safeParse({
      recipient: 'Budi',
      phone: '081234567890',
      address: 'Jl.',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '12345'
    })

    expect(result.success).toBe(false)
  })
})

describe('address mappers', () => {
  it('memetakan shipping form ke address input', () => {
    const mapped = shippingFormToAddressInput({
      name: 'Budi',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 1',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '12345'
    }, 'Kantor')

    expect(mapped).toMatchObject({
      label: 'Kantor',
      recipient: 'Budi',
      phone: '081234567890'
    })
  })

  it('memetakan address ke shipping form', () => {
    const mapped = addressToShippingForm({
      recipient: 'Budi',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 1',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '12345'
    })

    expect(mapped.name).toBe('Budi')
    expect(mapped.city).toBe('Jakarta')
  })
})
