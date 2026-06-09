<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Wishlist',
  description: 'Produk favorit yang Anda simpan di BelanjaPedia.'
})

const { items, loading, removeItem } = useWishlist()
const { formatPrice } = useFormatPrice()
const toast = useToast()

async function handleRemove(productId: number, name: string) {
  try {
    await removeItem(productId)
    toast.add({
      title: 'Dihapus dari wishlist',
      description: name,
      color: 'neutral'
    })
  } catch {
    toast.add({
      title: 'Gagal menghapus',
      description: 'Coba lagi dalam beberapa saat.',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
    <h1 class="text-3xl font-bold text-neutral-900 mb-8">
      Wishlist
    </h1>

    <div
      v-if="loading"
      class="text-center py-16 text-neutral-600"
    >
      Memuat wishlist...
    </div>

    <div
      v-else-if="items.length === 0"
      class="text-center py-20"
    >
      <p class="text-8xl mb-6">
        ❤️
      </p>
      <h2 class="text-3xl font-bold mb-3">
        Wishlist masih kosong
      </h2>
      <p class="text-neutral-600 mb-8">
        Simpan produk favoritmu agar mudah ditemukan nanti.
      </p>
      <UButton
        to="/products"
        color="primary"
        size="lg"
        class="rounded-full font-semibold"
        trailing-icon="i-lucide-arrow-right"
      >
        Jelajahi Produk
      </UButton>
    </div>

    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
    >
      <article
        v-for="item in items"
        :key="item.productId"
        class="bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        <NuxtLink
          :to="`/products/${item.slug}`"
          class="block aspect-square bg-neutral-100 overflow-hidden"
        >
          <img
            :src="item.image"
            :alt="item.name"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
        </NuxtLink>

        <div class="p-4">
          <NuxtLink
            :to="`/products/${item.slug}`"
            class="font-semibold text-neutral-900 line-clamp-2 hover:text-brand-600 transition-colors"
          >
            {{ item.name }}
          </NuxtLink>
          <p class="text-lg font-bold mt-2 mb-4">
            {{ formatPrice(item.price) }}
          </p>

          <div class="flex gap-2">
            <UButton
              :to="`/products/${item.slug}`"
              color="primary"
              class="flex-1 rounded-full font-semibold"
              size="sm"
            >
              Lihat Produk
            </UButton>
            <UButton
              variant="outline"
              color="neutral"
              icon="i-lucide-trash-2"
              class="rounded-full"
              aria-label="Hapus dari wishlist"
              @click="handleRemove(item.productId, item.name)"
            />
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
