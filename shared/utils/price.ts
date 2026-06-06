export function formatPrice(value: number): string {
  const rupiah = Math.round(value / 100)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(rupiah)
}

export function discountPercent(price: number, comparePrice: number | null): number {
  if (!comparePrice || comparePrice <= price) return 0
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}
