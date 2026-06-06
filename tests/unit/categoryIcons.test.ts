import { describe, expect, it } from 'vitest'
import { getCategoryIcon } from '../../app/utils/categoryIcons'

describe('getCategoryIcon', () => {
  it('mengembalikan emoji untuk slug yang dikenal', () => {
    expect(getCategoryIcon('elektronik')).toBe('📱')
    expect(getCategoryIcon('fashion')).toBe('👕')
  })

  it('mengembalikan default untuk slug tidak dikenal', () => {
    expect(getCategoryIcon('kategori-baru')).toBe('🛍️')
  })
})
