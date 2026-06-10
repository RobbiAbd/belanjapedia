/**
 * Bypass halaman peringatan ngrok (free tier) untuk semua request API di browser.
 * Ngrok menerima salah satu dari:
 * 1. Header `ngrok-skip-browser-warning` (nilai bebas) — dipakai di sini
 * 2. Custom User-Agent non-standar — tidak bisa diset dari fetch browser (lihat README)
 *
 * @see https://ngrok.com/docs/guides/how-to-disable-browser-warning
 */
const NGROK_HEADER = 'ngrok-skip-browser-warning'

function shouldUseNgrokHeader(appUrl: string, ngrokDemo: boolean) {  if (ngrokDemo) return true
  if (appUrl.includes('ngrok')) return true
  if (import.meta.client && typeof window !== 'undefined') {
    return window.location.hostname.includes('ngrok')
  }
  return false
}

export default defineNuxtPlugin({
  name: 'ngrok-headers',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig()
    const appUrl = config.public.appUrl || ''

    if (!shouldUseNgrokHeader(appUrl, config.public.ngrokDemo)) return

    const ngrokFetch = $fetch.create({
      onRequest({ options }) {
        const headers = new Headers(options.headers as HeadersInit | undefined)
        headers.set(NGROK_HEADER, 'true')
        options.headers = headers
      }
    })

    globalThis.$fetch = ngrokFetch
  }
})
