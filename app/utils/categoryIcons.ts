const categoryIcons: Record<string, string> = {
  elektronik: '📱',
  fashion: '👕',
  'rumah-tangga': '🏠',
  default: '🛍️'
}

export function getCategoryIcon(slug: string): string {
  return categoryIcons[slug] ?? categoryIcons.default!
}
