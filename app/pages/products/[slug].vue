<script setup lang="ts">
import type { ProductDetail } from '~/types/product'

const route = useRoute()
const slug = route.params.slug as string

const { data: res, error } = await useFetch(`/api/products/${slug}`)

if (error.value) {
  throw createError({ statusCode: 404, message: 'Produk tidak ditemukan' })
}

const product = computed(() => res.value?.data as ProductDetail)
const { formatPrice, discountPercent } = useFormatPrice()
const { addItem } = useCart()
const { loggedIn } = useUserSession()
const { isInWishlist, toggleItem } = useWishlist()
const toast = useToast()

const quantity = ref(1)
const selectedImage = ref(0)
const adding = ref(false)

const images = computed(() => {
  if (!product.value) return []
  if (product.value.images.length > 0) return product.value.images
  return [{
    id: 0,
    url: resolveProductImageUrl([], product.value.slug),
    alt: product.value.name,
    sortOrder: 0
  }]
})

const discount = computed(() =>
  product.value ? discountPercent(product.value.price, product.value.comparePrice) : 0
)

const stockStatus = computed(() => {
  const stock = product.value?.stock ?? 0
  if (stock <= 0) return { label: 'Stok habis', color: 'text-red-600', icon: 'i-lucide-alert-circle' }
  if (stock < 10) return { label: `Stok terbatas (${stock})`, color: 'text-orange-600', icon: 'i-lucide-alert-triangle' }
  return { label: 'Tersedia', color: 'text-green-600', icon: 'i-lucide-check-circle' }
})

useSeoMeta({
  title: () => product.value?.name ?? 'Detail Produk',
  description: () => product.value?.description ?? ''
})

const inWishlist = computed(() =>
  product.value ? isInWishlist(product.value.id) : false
)

async function handleAddToCart() {
  if (!product.value) return
  adding.value = true
  await new Promise(r => setTimeout(r, 400))
  addItem(product.value, quantity.value)
  adding.value = false
  toast.add({
    title: 'Ditambahkan ke keranjang',
    description: product.value.name,
    color: 'success'
  })
}

const togglingWishlist = ref(false)

async function handleWishlist() {
  if (!product.value) return

  if (!loggedIn.value) {
    await navigateTo({
      path: '/login',
      query: { redirect: route.fullPath }
    })
    return
  }

  togglingWishlist.value = true

  try {
    const added = await toggleItem(product.value)

    toast.add({
      title: added ? 'Ditambahkan ke wishlist' : 'Dihapus dari wishlist',
      description: product.value.name,
      color: added ? 'success' : 'neutral',
      icon: added ? 'i-lucide-heart' : 'i-lucide-heart-off'
    })
  } catch {
    toast.add({
      title: 'Gagal memperbarui wishlist',
      description: 'Coba lagi dalam beberapa saat.',
      color: 'error'
    })
  } finally {
    togglingWishlist.value = false
  }
}

async function handleShare() {
  if (!product.value || !import.meta.client) return

  const url = window.location.href
  const shareData = {
    title: product.value.name,
    text: `Lihat ${product.value.name} di BelanjaPedia`,
    url
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
      return
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
    }
  }

  try {
    await navigator.clipboard.writeText(url)
    toast.add({
      title: 'Link disalin',
      description: 'Bagikan link produk ini ke temanmu.',
      color: 'success',
      icon: 'i-lucide-link'
    })
  } catch {
    toast.add({
      title: 'Gagal membagikan',
      description: url,
      color: 'warning'
    })
  }
}
</script>

<template>
  <div
    v-if="product"
    class="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 sm:py-8 pb-28 lg:pb-8"
  >
    <nav class="text-sm text-neutral-600 mb-8 flex items-center gap-2 flex-wrap">
      <NuxtLink
        to="/"
        class="hover:text-brand-600"
      >
        Beranda
      </NuxtLink>
      <span>/</span>
      <NuxtLink
        to="/products"
        class="hover:text-brand-600"
      >
        Produk
      </NuxtLink>
      <span>/</span>
      <span class="text-neutral-900 font-medium line-clamp-1">{{ product.name }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <div class="aspect-square rounded-3xl bg-neutral-100 overflow-hidden mb-4">
          <img
            :src="images[selectedImage]?.url"
            :alt="product.name"
            class="w-full h-full object-cover"
          >
        </div>
        <div
          v-if="images.length > 1"
          class="grid grid-cols-4 gap-3"
        >
          <button
            v-for="(img, idx) in images"
            :key="img.id"
            type="button"
            class="aspect-square rounded-xl overflow-hidden border-2 transition-all"
            :class="idx === selectedImage ? 'border-brand-600 ring-2 ring-brand-600/20' : 'border-transparent opacity-60 hover:opacity-100'"
            @click="selectedImage = idx"
          >
            <img
              :src="img.url"
              :alt="img.alt ?? ''"
              class="w-full h-full object-cover"
            >
          </button>
        </div>
      </div>

      <div>
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
          {{ product.name }}
        </h1>

        <div class="flex flex-wrap items-center gap-4 mb-6 text-sm">
          <div class="flex items-center gap-1">
            <UIcon
              name="i-lucide-star"
              class="size-5 text-yellow-400 fill-yellow-400"
            />
            <span class="font-semibold">{{ product.reviewCount ? product.rating?.toFixed(1) : '—' }}</span>
            <span class="text-neutral-500">({{ product.reviewCount ?? 0 }} ulasan)</span>
          </div>
          <span class="text-neutral-400">|</span>
          <span class="text-neutral-600">{{ product.soldCount ?? 0 }} terjual</span>
        </div>

        <div class="flex items-baseline gap-3 mb-4">
          <span class="text-3xl sm:text-4xl font-bold text-neutral-900">{{ formatPrice(product.price) }}</span>
          <span
            v-if="product.comparePrice"
            class="text-lg sm:text-xl text-neutral-400 line-through"
          >
            {{ formatPrice(product.comparePrice) }}
          </span>
          <span
            v-if="discount > 0"
            class="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded-full"
          >
            -{{ discount }}%
          </span>
        </div>

        <div
          class="flex items-center gap-2 mb-8 text-sm font-medium"
          :class="stockStatus.color"
        >
          <UIcon
            :name="stockStatus.icon"
            class="size-5"
          />
          {{ stockStatus.label }}
        </div>

        <div class="mb-8">
          <label class="text-sm font-semibold text-neutral-700 block mb-3">Jumlah</label>
          <UiQuantitySelector
            v-model="quantity"
            :max="product.stock"
          />
        </div>

        <div class="hidden lg:flex gap-3 mb-8">
          <UButton
            color="primary"
            size="xl"
            class="flex-1 rounded-full font-semibold h-14"
            icon="i-lucide-shopping-cart"
            :loading="adding"
            :disabled="product.stock <= 0"
            @click="handleAddToCart"
          >
            {{ adding ? 'Menambahkan...' : '+ Keranjang' }}
          </UButton>
          <UButton
            variant="outline"
            size="xl"
            class="size-14 rounded-full"
            :color="inWishlist ? 'primary' : 'neutral'"
            icon="i-lucide-heart"
            :class="inWishlist ? '[&_svg]:fill-current' : ''"
            :loading="togglingWishlist"
            :aria-label="inWishlist ? 'Hapus dari wishlist' : 'Tambah ke wishlist'"
            @click="handleWishlist"
          />
          <UButton
            variant="outline"
            size="xl"
            class="size-14 rounded-full"
            icon="i-lucide-share-2"
            aria-label="Bagikan"
            @click="handleShare"
          />
        </div>

        <div class="border-t border-neutral-200 pt-6">
          <h3 class="font-semibold text-neutral-900 mb-3">
            Deskripsi Produk
          </h3>
          <p class="text-neutral-700 leading-relaxed">
            {{ product.description || 'Deskripsi produk belum tersedia.' }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-6">
          <div class="flex items-center gap-2 text-sm text-neutral-700">
            <UIcon
              name="i-lucide-check"
              class="size-4 text-green-600"
            />
            Garansi resmi
          </div>
          <div class="flex items-center gap-2 text-sm text-neutral-700">
            <UIcon
              name="i-lucide-check"
              class="size-4 text-green-600"
            />
            Pengiriman cepat
          </div>
          <div class="flex items-center gap-2 text-sm text-neutral-700">
            <UIcon
              name="i-lucide-check"
              class="size-4 text-green-600"
            />
            Pembayaran aman
          </div>
          <div class="flex items-center gap-2 text-sm text-neutral-700">
            <UIcon
              name="i-lucide-check"
              class="size-4 text-green-600"
            />
            Retur 30 hari
          </div>
        </div>
      </div>
    </div>

    <ProductReviews
      :slug="product.slug"
      class="mt-4"
    />

    <div class="lg:hidden fixed bottom-[4.75rem] inset-x-0 z-40 bg-white border-t border-neutral-200 px-4 py-3 safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div class="flex items-center gap-3 max-w-[1400px] mx-auto">
        <div class="min-w-0 flex-1">
          <p class="text-xs text-neutral-500 truncate">{{ product.name }}</p>
          <p class="text-lg font-bold text-brand-600">{{ formatPrice(product.price) }}</p>
        </div>
        <UButton
          variant="outline"
          size="lg"
          class="rounded-full shrink-0"
          :color="inWishlist ? 'primary' : 'neutral'"
          icon="i-lucide-heart"
          :class="inWishlist ? '[&_svg]:fill-current' : ''"
          :loading="togglingWishlist"
          aria-label="Wishlist"
          @click="handleWishlist"
        />
        <UButton
          color="primary"
          size="lg"
          class="rounded-full font-semibold shrink-0"
          icon="i-lucide-shopping-cart"
          :loading="adding"
          :disabled="product.stock <= 0"
          @click="handleAddToCart"
        >
          Keranjang
        </UButton>
      </div>
    </div>
  </div>
</template>
