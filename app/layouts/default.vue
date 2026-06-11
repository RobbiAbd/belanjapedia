<script setup lang="ts">
const { itemCount } = useCart()
const { itemCount: wishlistCount } = useWishlist()
const { loggedIn, user, clear: clearSession, fetch: refreshSession, ready } = useUserSession()
const {
  balance: coinBalance,
  canClaimDaily,
  dailyReward,
  claiming: claimingCoins,
  claimDaily
} = useCoins()
const toast = useToast()

const searchQuery = ref('')
const loggingOut = ref(false)
const showDailyModal = ref(false)
const showGameModal = useState('show-game-modal', () => false)

function handleSearch() {
  if (!searchQuery.value.trim()) return
  navigateTo(`/products?search=${encodeURIComponent(searchQuery.value.trim())}`)
}

async function handleLogout() {
  loggingOut.value = true
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await clearSession()
    showDailyModal.value = false
    showGameModal.value = false
    await navigateTo('/')
  } finally {
    loggingOut.value = false
  }
}

watch([loggedIn, ready, canClaimDaily], ([isLoggedIn, isReady, canClaim]) => {
  if (isReady && isLoggedIn && canClaim) {
    showDailyModal.value = true
  }
})

async function handleClaimDaily() {
  try {
    const result = await claimDaily()
    await refreshSession()
    showDailyModal.value = false
    toast.add({
      title: 'Daily reward diklaim!',
      description: `+${result.reward} coin. Saldo: ${result.balance} coin`,
      color: 'success',
      icon: 'i-lucide-gift'
    })
  } catch {
    toast.add({
      title: 'Gagal klaim reward',
      description: 'Coba lagi dalam beberapa saat.',
      color: 'error'
    })
  }
}

const displayCoins = computed(() => user.value?.coins ?? coinBalance.value)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-neutral-50 text-dark-text">
    <div class="bg-brand-500 text-white text-center text-xs sm:text-sm py-1.5 px-3 sm:px-4 truncate">
      Gratis Ongkir + Banyak Promo — belanja di BelanjaPedia
    </div>

    <header class="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div class="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2 sm:gap-4">
          <NuxtLink
            to="/"
            class="shrink-0 min-w-0"
          >
            <AppLogo
              variant="horizontal"
              :height="44"
            />
          </NuxtLink>

          <form
            class="hidden md:flex flex-1 max-w-xl min-w-0"
            @submit.prevent="handleSearch"
          >
            <UInput
              v-model="searchQuery"
              placeholder="Cari produk di BelanjaPedia..."
              icon="i-lucide-search"
              size="lg"
              class="w-full rounded-full"
            />
          </form>

          <nav class="flex items-center gap-0.5 sm:gap-2 shrink-0">
            <UButton
              to="/products"
              variant="ghost"
              color="neutral"
              icon="i-lucide-layout-grid"
              class="hidden lg:inline-flex"
              aria-label="Kategori"
            />
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-gamepad-2"
              class="hidden lg:inline-flex"
              aria-label="Main Game"
              @click="showGameModal = true"
            />
            <div class="relative hidden md:block">
              <UButton
                to="/wishlist"
                variant="ghost"
                color="neutral"
                icon="i-lucide-heart"
                aria-label="Wishlist"
              />
              <span
                v-if="loggedIn && wishlistCount > 0"
                class="absolute -top-1 -right-1 size-5 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
              >
                {{ wishlistCount > 9 ? '9+' : wishlistCount }}
              </span>
            </div>
            <UButton
              v-if="loggedIn"
              to="/account"
              variant="ghost"
              color="neutral"
              icon="i-lucide-user"
              class="hidden md:inline-flex"
              :aria-label="user?.name ?? 'Akun'"
            />
            <UButton
              v-else
              to="/login"
              variant="ghost"
              color="neutral"
              icon="i-lucide-user"
              class="hidden md:inline-flex"
              aria-label="Masuk"
            />
            <div class="relative hidden lg:block">
              <UButton
                to="/cart"
                variant="ghost"
                color="neutral"
                icon="i-lucide-shopping-cart"
                aria-label="Keranjang"
              />
              <span
                v-if="itemCount > 0"
                class="absolute -top-1 -right-1 size-5 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
              >
                {{ itemCount > 9 ? '9+' : itemCount }}
              </span>
            </div>
            <template v-if="loggedIn">
              <NuxtLink
                to="/account"
                class="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full"
              >
                <UIcon
                  name="i-lucide-coins"
                  class="size-4"
                />
                {{ displayCoins.toLocaleString('id-ID') }}
              </NuxtLink>
              <span class="hidden lg:inline text-sm font-medium text-neutral-700 max-w-28 truncate">
                {{ user?.name }}
              </span>
              <UButton
                variant="outline"
                color="neutral"
                size="sm"
                class="hidden lg:inline-flex rounded-full"
                :loading="loggingOut"
                @click="handleLogout"
              >
                Keluar
              </UButton>
            </template>
            <template v-else>
              <UButton
                to="/login"
                variant="outline"
                color="primary"
                size="sm"
                class="hidden md:inline-flex rounded-full"
              >
                Masuk
              </UButton>
              <UButton
                to="/register"
                color="primary"
                size="sm"
                class="hidden lg:inline-flex rounded-full"
              >
                Daftar
              </UButton>
            </template>
          </nav>
        </div>

        <form
          class="md:hidden pb-3"
          @submit.prevent="handleSearch"
        >
          <UInput
            v-model="searchQuery"
            placeholder="Cari produk..."
            icon="i-lucide-search"
            size="md"
            class="w-full rounded-full"
          />
        </form>
      </div>
    </header>

    <main class="flex-1 pb-[4.75rem] lg:pb-0">
      <slot />
    </main>

    <LayoutAppFooter />

    <RewardDailyLoginModal
      v-if="loggedIn"
      v-model:open="showDailyModal"
      :reward="dailyReward"
      :balance="displayCoins"
      :claiming="claimingCoins"
      @claim="handleClaimDaily"
    />

    <RewardGameModal
      v-model:open="showGameModal"
    />

    <SupportFloatingSupportChat />

    <LayoutMobileBottomNav />
  </div>
</template>
