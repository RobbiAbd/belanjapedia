import type { ProductListItem, WishlistItem } from '~/types/product'
import {
  addWishlistItem,
  isInWishlist as checkInWishlist,
  removeWishlistItem
} from '#shared/utils/wishlist'

export function useWishlist() {
  const { loggedIn, ready } = useUserSession()
  const items = useState<WishlistItem[]>('wishlist-items', () => [])
  const loading = useState('wishlist-loading', () => false)

  const itemCount = computed(() => items.value.length)

  async function fetchItems() {
    if (!loggedIn.value) {
      items.value = []
      return
    }

    loading.value = true

    try {
      const response = await $fetch<{
        success: boolean
        data: { items: WishlistItem[] }
      }>('/api/wishlist')

      items.value = response.data.items
    } catch {
      items.value = []
    } finally {
      loading.value = false
    }
  }

  if (import.meta.client) {
    watch([loggedIn, ready], ([isLoggedIn, isReady]) => {
      if (!isReady) return
      if (isLoggedIn) {
        fetchItems()
      } else {
        items.value = []
      }
    }, { immediate: true })
  }

  function isInWishlist(productId: number) {
    return checkInWishlist(items.value, productId)
  }

  async function addItem(product: ProductListItem) {
    await $fetch('/api/wishlist', {
      method: 'POST',
      body: { productId: product.id }
    })

    items.value = addWishlistItem(items.value, product)
  }

  async function removeItem(productId: number) {
    await $fetch(`/api/wishlist/${productId}`, { method: 'DELETE' })
    items.value = removeWishlistItem(items.value, productId)
  }

  async function toggleItem(product: ProductListItem): Promise<boolean> {
    if (isInWishlist(product.id)) {
      await removeItem(product.id)
      return false
    }

    await addItem(product)
    return true
  }

  return {
    items,
    itemCount,
    loading,
    isInWishlist,
    fetchItems,
    addItem,
    removeItem,
    toggleItem
  }
}
