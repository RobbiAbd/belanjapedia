import { describe, expect, it } from 'vitest'
import { zodFieldErrors } from '#shared/utils/auth'
import {
  buildOrderLines,
  calcLineSubtotal,
  calcOrderAmounts,
  calcOrderTotal,
  calcShipping,
  calcTax,
  createOrderSchema,
  generateOrderNumber,
  mapOrderApiErrors,
  SHIPPING_COST,
  TAX_RATE,
  validateShippingFields,
  type OrderProductSnapshot
} from '#shared/utils/order'

describe('order calculations', () => {
  it('ongkir 0 jika keranjang kosong', () => {
    expect(calcShipping(0)).toBe(0)
  })

  it('ongkir flat jika ada item', () => {
    expect(calcShipping(3)).toBe(SHIPPING_COST)
  })

  it('menghitung pajak 11%', () => {
    expect(calcTax(1_000_000)).toBe(Math.round(1_000_000 * TAX_RATE))
  })

  it('menghitung total pesanan lengkap', () => {
    const subtotal = 10_000_000
    const total = calcOrderTotal(subtotal, 2)
    expect(total).toBe(subtotal + SHIPPING_COST + calcTax(subtotal))
  })

  it('menghitung subtotal per item', () => {
    expect(calcLineSubtotal(3_500_000, 2)).toBe(7_000_000)
  })
})

describe('generateOrderNumber', () => {
  it('memiliki format BP-YYYYMMDD-XXXXXX', () => {
    const number = generateOrderNumber(new Date('2026-06-06T10:00:00.000Z'))
    expect(number).toMatch(/^BP-\d{8}-[A-Z0-9]{6}$/)
    expect(number.startsWith('BP-20260606-')).toBe(true)
  })
})

describe('validateShippingFields', () => {
  it('menolak alamat kurang dari 5 karakter', () => {
    const errors = validateShippingFields({
      name: 'Budi Santoso',
      phone: '081234567890',
      address: 'Jl.',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '12345'
    })

    expect(errors.address).toBe('Alamat terlalu pendek')
  })

  it('menerima alamat valid', () => {
    const errors = validateShippingFields({
      name: 'Budi Santoso',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 1',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '12345'
    })

    expect(errors).toEqual({})
  })
})

describe('mapOrderApiErrors', () => {
  it('memetakan error nested shipping ke field form', () => {
    const parsed = createOrderSchema.safeParse({
      shipping: {
        name: 'Budi',
        phone: '081234567890',
        address: 'Jl.',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postalCode: '12345'
      },
      paymentMethod: 'transfer',
      items: [{ productId: 1, quantity: 1 }]
    })

    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      const mapped = mapOrderApiErrors(zodFieldErrors(parsed.error))
      expect(mapped.shipping.address).toBe('Alamat terlalu pendek')
    }
  })
})

describe('createOrderSchema', () => {
  it('menerima payload checkout valid', () => {
    const result = createOrderSchema.safeParse({
      shipping: {
        name: 'Budi',
        phone: '081234567890',
        address: 'Jl. Merdeka No. 1',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postalCode: '12345'
      },
      paymentMethod: 'transfer',
      items: [{ productId: 1, quantity: 2 }]
    })

    expect(result.success).toBe(true)
  })

  it('menolak keranjang kosong', () => {
    const result = createOrderSchema.safeParse({
      shipping: {
        name: 'Budi',
        phone: '081234567890',
        address: 'Jl. Merdeka No. 1',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postalCode: '12345'
      },
      paymentMethod: 'transfer',
      items: []
    })

    expect(result.success).toBe(false)
  })

  it('menerima addressId tanpa shipping', () => {
    const result = createOrderSchema.safeParse({
      addressId: 5,
      paymentMethod: 'transfer',
      items: [{ productId: 1, quantity: 1 }]
    })

    expect(result.success).toBe(true)
  })

  it('menolak jika tidak ada addressId maupun shipping', () => {
    const result = createOrderSchema.safeParse({
      paymentMethod: 'transfer',
      items: [{ productId: 1, quantity: 1 }]
    })

    expect(result.success).toBe(false)
  })
})

describe('buildOrderLines', () => {
  const products = new Map<number, OrderProductSnapshot>([
    [
      1,
      {
        id: 1,
        name: 'Headphone',
        slug: 'headphone-bluetooth',
        price: 3_500_000,
        stock: 5,
        isActive: true,
        deletedAt: null
      }
    ]
  ])

  it('membangun baris pesanan dari produk valid', () => {
    const result = buildOrderLines([{ productId: 1, quantity: 2 }], products)

    expect('lines' in result).toBe(true)
    if ('lines' in result) {
      expect(result.lines).toHaveLength(1)
      expect(result.lines[0]).toMatchObject({
        productId: 1,
        quantity: 2,
        subtotal: 7_000_000
      })
    }
  })

  it('menolak jika stok tidak cukup', () => {
    const result = buildOrderLines([{ productId: 1, quantity: 99 }], products)

    expect('error' in result).toBe(true)
    if ('error' in result) {
      expect(result.error).toContain('Stok')
    }
  })

  it('menolak produk yang tidak ada', () => {
    const result = buildOrderLines([{ productId: 999, quantity: 1 }], products)

    expect('error' in result).toBe(true)
  })
})

describe('calcOrderAmounts', () => {
  it('menghitung subtotal, ongkir, dan total dari baris pesanan', () => {
    const amounts = calcOrderAmounts([
      {
        productId: 1,
        productName: 'Headphone',
        productSlug: 'headphone-bluetooth',
        price: 3_500_000,
        quantity: 2,
        subtotal: 7_000_000
      }
    ])

    expect(amounts.subtotal).toBe(7_000_000)
    expect(amounts.shippingCost).toBe(SHIPPING_COST)
    expect(amounts.total).toBe(7_000_000 + SHIPPING_COST + calcTax(7_000_000))
  })
})
