import { describe, expect, it } from 'vitest'
import { apiError, apiSuccess } from '../../server/utils/response'

describe('apiSuccess', () => {
  it('mengembalikan format response sukses standar', () => {
    const result = apiSuccess({ id: 1 }, 'Data berhasil diambil')
    expect(result).toEqual({
      success: true,
      message: 'Data berhasil diambil',
      data: { id: 1 }
    })
  })

  it('menggunakan pesan default', () => {
    expect(apiSuccess(null).message).toBe('Berhasil')
  })
})

describe('apiError', () => {
  it('mengembalikan format error standar', () => {
    const result = apiError('Validasi gagal', { email: 'Email tidak valid' })
    expect(result).toEqual({
      success: false,
      message: 'Validasi gagal',
      errors: { email: 'Email tidak valid' }
    })
  })
})
