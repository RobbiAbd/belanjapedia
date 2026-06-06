import { describe, expect, it } from 'vitest'
import {
  loginSchema,
  registerSchema,
  toPublicUser,
  zodFieldErrors
} from '../../shared/utils/auth'

describe('loginSchema', () => {
  it('menerima email dan password valid', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'secret123'
    })

    expect(result.success).toBe(true)
  })

  it('menolak email tidak valid', () => {
    const result = loginSchema.safeParse({
      email: 'bukan-email',
      password: 'secret123'
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(zodFieldErrors(result.error).email).toBe('Email tidak valid')
    }
  })
})

describe('registerSchema', () => {
  it('menerima data registrasi valid', () => {
    const result = registerSchema.safeParse({
      name: 'Budi Santoso',
      email: 'budi@example.com',
      password: 'password1',
      phone: '081234567890'
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.phone).toBe('081234567890')
    }
  })

  it('menolak password kurang dari 6 karakter', () => {
    const result = registerSchema.safeParse({
      name: 'Budi',
      email: 'budi@example.com',
      password: '12345'
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(zodFieldErrors(result.error).password).toBe('Password minimal 6 karakter')
    }
  })

  it('mengubah phone kosong menjadi undefined', () => {
    const result = registerSchema.safeParse({
      name: 'Budi',
      email: 'budi@example.com',
      password: 'password1',
      phone: ''
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.phone).toBeUndefined()
    }
  })
})

describe('toPublicUser', () => {
  it('menghilangkan field sensitif dari user', () => {
    const publicUser = toPublicUser({
      id: 1,
      name: 'Admin',
      email: 'admin@belanjapedia.com',
      phone: '081234567890',
      coins: 5000,
      role: 'ADMIN'
    })

    expect(publicUser).toEqual({
      id: 1,
      name: 'Admin',
      email: 'admin@belanjapedia.com',
      phone: '081234567890',
      coins: 5000,
      role: 'ADMIN'
    })
    expect(publicUser).not.toHaveProperty('password')
  })
})
