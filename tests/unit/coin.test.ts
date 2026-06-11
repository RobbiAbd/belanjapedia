import { describe, expect, it } from 'vitest'
import {
  calcMaxCoinsForOrder,
  calcOrderTotalAfterCoins,
  canClaimDailyReward,
  coinsToPriceUnits,
  formatCoinTransactionType,
  formatCoins,
  getDailyDateKey,
  priceUnitsToRupiah
} from '#shared/utils/coin'

describe('coin conversions', () => {
  it('1 coin = 1 rupiah = 100 price units', () => {
    expect(coinsToPriceUnits(1)).toBe(100)
    expect(priceUnitsToRupiah(3_500_000)).toBe(35_000)
  })

  it('menghitung maksimum coin untuk pesanan', () => {
    expect(calcMaxCoinsForOrder(3_500_000, 50_000)).toBe(35_000)
    expect(calcMaxCoinsForOrder(3_500_000, 10_000)).toBe(10_000)
  })

  it('menghitung total setelah pemakaian coin', () => {
    expect(calcOrderTotalAfterCoins(3_500_000, 1_000)).toBe(3_400_000)
    expect(calcOrderTotalAfterCoins(500, 10)).toBe(0)
  })

  it('memformat jumlah coin', () => {
    expect(formatCoins(1000)).toContain('1.000')
    expect(formatCoins(1000)).toContain('coin')
  })

  it('memformat tipe transaksi coin', () => {
    expect(formatCoinTransactionType('DAILY_LOGIN')).toBe('Daily Login')
    expect(formatCoinTransactionType('ORDER_PAYMENT')).toBe('Pembayaran Pesanan')
    expect(formatCoinTransactionType('GAME_REWARD')).toBe('Reward Game')
  })

  it('coin reward game bisa dipakai untuk diskon checkout', () => {
    const gameRewardCoins = 10
    const orderTotal = 50_000

    expect(calcMaxCoinsForOrder(orderTotal, gameRewardCoins)).toBe(10)
    expect(calcOrderTotalAfterCoins(orderTotal, gameRewardCoins)).toBe(49_000)
    expect(coinsToPriceUnits(gameRewardCoins)).toBe(1_000)
  })
})

describe('daily login reward', () => {
  it('bisa klaim jika belum pernah klaim', () => {
    expect(canClaimDailyReward(null)).toBe(true)
  })

  it('tidak bisa klaim dua kali di hari yang sama', () => {
    const today = new Date('2026-06-06T08:00:00+07:00')
    const later = new Date('2026-06-06T20:00:00+07:00')

    expect(canClaimDailyReward(today, later)).toBe(false)
  })

  it('bisa klaim lagi di hari berikutnya', () => {
    const yesterday = new Date('2026-06-05T23:00:00+07:00')
    const today = new Date('2026-06-06T08:00:00+07:00')

    expect(getDailyDateKey(yesterday)).not.toBe(getDailyDateKey(today))
    expect(canClaimDailyReward(yesterday, today)).toBe(true)
  })
})
