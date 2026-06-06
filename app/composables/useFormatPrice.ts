import { discountPercent, formatPrice } from '#shared/utils/price'

export function useFormatPrice() {
  return { formatPrice, discountPercent }
}
