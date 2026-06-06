import type { CartItem, ProductListItem } from '~/types/product'
import {
  addCartItem,
  calcItemCount,
  calcSubtotal,
  removeCartItem,
  updateCartItemQuantity
} from '#shared/utils/cart'

export function useCart() {
  const { loggedIn, ready } = useUserSession()
  const items = useState<CartItem[]>('cart-items', () => [])
  const loading = useState('cart-loading', () => false)
  const synced = useState('cart-synced', () => false)

  const itemCount = computed(() => calcItemCount(items.value))
  const subtotal = computed(() => calcSubtotal(items.value))

  async function fetchItems() {
    if (!loggedIn.value) return

    loading.value = true

    try {
      const response = await $fetch<{
        success: boolean
        data: { items: CartItem[] }
      }>('/api/cart')

      items.value = response.data.items
    } catch {
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function syncGuestCart() {
    if (!loggedIn.value || synced.value) return

    const guestItems = items.value.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))

    synced.value = true

    if (guestItems.length === 0) {
      await fetchItems()
      return
    }

    try {
      const response = await $fetch<{
        success: boolean
        data: { items: CartItem[] }
      }>('/api/cart/sync', {
        method: 'POST',
        body: { items: guestItems }
      })

      items.value = response.data.items
    } catch {
      await fetchItems()
    }
  }

  if (import.meta.client) {
    watch([loggedIn, ready], async ([isLoggedIn, isReady]) => {
      if (!isReady) return

      if (isLoggedIn) {
        await syncGuestCart()
      } else {
        synced.value = false
      }
    }, { immediate: true })
  }

  async function addItem(product: ProductListItem, quantity = 1, variant?: string) {
    if (!loggedIn.value) {
      items.value = addCartItem(items.value, product, quantity, variant)
      return
    }

    try {
      const response = await $fetch<{
        success: boolean
        data: { items: CartItem[] }
      }>('/api/cart/items', {
        method: 'POST',
        body: { productId: product.id, quantity }
      })

      items.value = response.data.items
    } catch {
      items.value = addCartItem(items.value, product, quantity, variant)
    }
  }

  async function updateQuantity(productId: number, quantity: number, variant?: string) {
    if (!loggedIn.value) {
      items.value = updateCartItemQuantity(items.value, productId, quantity, variant)
      return
    }

    const item = items.value.find(
      cartItem => cartItem.productId === productId && cartItem.variant === variant
    )

    if (!item?.id) {
      items.value = updateCartItemQuantity(items.value, productId, quantity, variant)
      return
    }

    if (quantity <= 0) {
      await removeItem(productId, variant)
      return
    }

    try {
      const response = await $fetch<{
        success: boolean
        data: { items: CartItem[] }
      }>(`/api/cart/items/${item.id}`, {
        method: 'PUT',
        body: { quantity }
      })

      items.value = response.data.items
    } catch {
      items.value = updateCartItemQuantity(items.value, productId, quantity, variant)
    }
  }

  async function removeItem(productId: number, variant?: string) {
    if (!loggedIn.value) {
      items.value = removeCartItem(items.value, productId, variant)
      return
    }

    const item = items.value.find(
      cartItem => cartItem.productId === productId && cartItem.variant === variant
    )

    if (!item?.id) {
      items.value = removeCartItem(items.value, productId, variant)
      return
    }

    try {
      const response = await $fetch<{
        success: boolean
        data: { items: CartItem[] }
      }>(`/api/cart/items/${item.id}`, { method: 'DELETE' })

      items.value = response.data.items
    } catch {
      items.value = removeCartItem(items.value, productId, variant)
    }
  }

  async function clearCart() {
    if (loggedIn.value) {
      try {
        await $fetch('/api/cart/clear', { method: 'POST' })
      } catch {
        // tetap kosongkan state lokal
      }
    }

    items.value = []
  }

  return {
    items,
    itemCount,
    subtotal,
    loading,
    fetchItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart
  }
}
