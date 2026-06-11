export const DAILY_LOGIN_REWARD = 1_000
export const PRICE_UNIT_PER_RUPIAH = 100

export function priceUnitsToRupiah(priceUnits: number): number {
  return Math.floor(priceUnits / PRICE_UNIT_PER_RUPIAH)
}

export function coinsToPriceUnits(coins: number): number {
  return coins * PRICE_UNIT_PER_RUPIAH
}

export function getDailyDateKey(date = new Date(), timeZone = 'Asia/Jakarta'): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

export function canClaimDailyReward(
  lastDailyCoinAt: Date | string | null,
  now = new Date()
): boolean {
  if (!lastDailyCoinAt) return true

  return getDailyDateKey(new Date(lastDailyCoinAt), 'Asia/Jakarta')
    !== getDailyDateKey(now, 'Asia/Jakarta')
}

export function calcMaxCoinsForOrder(orderTotalPriceUnits: number, userCoins: number): number {
  const maxByTotal = priceUnitsToRupiah(orderTotalPriceUnits)
  return Math.max(0, Math.min(userCoins, maxByTotal))
}

export function calcOrderTotalAfterCoins(
  orderTotalPriceUnits: number,
  coinsToUse: number
): number {
  return Math.max(0, orderTotalPriceUnits - coinsToPriceUnits(coinsToUse))
}

export function formatCoins(coins: number): string {
  return `${new Intl.NumberFormat('id-ID').format(coins)} coin`
}

export type CoinTransactionTypeLabel = 'DAILY_LOGIN' | 'ORDER_PAYMENT' | 'GAME_REWARD'

export function formatCoinTransactionType(type: CoinTransactionTypeLabel | string): string {
  switch (type) {
    case 'DAILY_LOGIN':
      return 'Daily Login'
    case 'ORDER_PAYMENT':
      return 'Pembayaran Pesanan'
    case 'GAME_REWARD':
      return 'Reward Game'
    default:
      return type
  }
}
