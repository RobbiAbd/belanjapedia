<script setup lang="ts">
const route = useRoute()
const { loggedIn } = useUserSession()
const { itemCount } = useCart()
const showGameModal = useState('show-game-modal', () => false)

const items = computed(() => [
  { label: 'Beranda', to: '/', icon: 'i-lucide-home', match: (path: string) => path === '/' },
  { label: 'Produk', to: '/products', icon: 'i-lucide-layout-grid', match: (path: string) => path.startsWith('/products') },
  { label: 'Game', to: null, icon: 'i-lucide-gamepad-2', action: () => { showGameModal.value = true } },
  { label: 'Keranjang', to: '/cart', icon: 'i-lucide-shopping-cart', badge: itemCount.value, match: (path: string) => path === '/cart' },
  {
    label: loggedIn.value ? 'Akun' : 'Masuk',
    to: loggedIn.value ? '/account' : '/login',
    icon: 'i-lucide-user',
    match: (path: string) => path.startsWith('/account') || path === '/login'
  }
])

function isActive(item: typeof items.value[number]) {
  if (!item.match) return false
  return item.match(route.path)
}
</script>

<template>
  <nav
    class="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] safe-bottom"
    aria-label="Navigasi utama"
  >
    <div class="flex items-stretch justify-around px-1 pt-1.5 pb-1">
      <template
        v-for="item in items"
        :key="item.label"
      >
        <button
          v-if="item.action"
          type="button"
          class="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 min-h-14 min-w-0 text-neutral-500 hover:text-brand-600 transition-colors"
          @click="item.action"
        >
          <UIcon
            :name="item.icon"
            class="size-5 shrink-0"
          />
          <span class="text-[10px] font-medium truncate max-w-full px-1">{{ item.label }}</span>
        </button>
        <NuxtLink
          v-else
          :to="item.to!"
          class="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 min-h-14 min-w-0 transition-colors"
          :class="isActive(item) ? 'text-brand-600' : 'text-neutral-500 hover:text-brand-600'"
        >
          <UIcon
            :name="item.icon"
            class="size-5 shrink-0"
          />
          <span class="text-[10px] font-medium truncate max-w-full px-1">{{ item.label }}</span>
          <span
            v-if="item.badge && item.badge > 0"
            class="absolute top-1 right-[calc(50%-18px)] size-4 bg-brand-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
          >
            {{ item.badge > 9 ? '9+' : item.badge }}
          </span>
        </NuxtLink>
      </template>
    </div>
  </nav>
</template>
