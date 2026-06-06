/** URL dummy eksternal jika produk tidak punya gambar di database */
export const DEFAULT_PRODUCT_IMAGE =
  'https://picsum.photos/seed/belanjapedia-default/600/600'

export function dummyProductImageUrl(slug: string, width = 600, height = 600): string {
  return `https://picsum.photos/seed/${slug}/${width}/${height}`
}

export function resolveProductImageUrl(
  images: Array<{ url: string }> | undefined,
  fallbackSlug = 'belanjapedia-default'
): string {
  const url = images?.[0]?.url?.trim()
  if (!url) return dummyProductImageUrl(fallbackSlug)
  return url
}

export function isExternalImageUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}
