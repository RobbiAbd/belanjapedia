<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Keranjang Belanja',
  description: 'Review dan kelola produk di keranjang belanja Anda.'
})

const { items, updateQuantity, removeItem } = useCart()
const { formatPrice } = useFormatPrice()
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
    <h1 class="text-3xl font-bold text-neutral-900 mb-8">
      Keranjang Belanja
    </h1>

    <div
      v-if="items.length === 0"
      class="text-center py-20"
    >
      <p class="text-8xl mb-6">
        🛒
      </p>
      <h2 class="text-3xl font-bold mb-3">
        Keranjang masih kosong
      </h2>
      <p class="text-neutral-600 mb-8">
        Yuk, mulai belanja dan temukan produk favoritmu!
      </p>
      <UButton
        to="/products"
        color="primary"
        size="lg"
        class="rounded-full font-semibold"
        trailing-icon="i-lucide-arrow-right"
      >
        Mulai Belanja
      </UButton>
    </div>

    <div
      v-else
      class="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div class="lg:col-span-2 space-y-4">
        <article
          v-for="item in items"
          :key="`${item.productId}-${item.variant}`"
          class="bg-white rounded-2xl shadow-sm p-4 lg:p-6 flex gap-4"
        >
          <NuxtLink
            :to="`/products/${item.slug}`"
            class="shrink-0"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="size-24 lg:size-32 rounded-xl object-cover bg-neutral-100"
            >
          </NuxtLink>

          <div class="flex-1 min-w-0">
            <NuxtLink
              :to="`/products/${item.slug}`"
              class="font-semibold text-neutral-900 line-clamp-2 hover:text-brand-600 transition-colors"
            >
              {{ item.name }}
            </NuxtLink>
            <p
              v-if="item.variant"
              class="text-sm text-neutral-600 mt-1"
            >
              Varian: {{ item.variant }}
            </p>
            <p class="text-lg font-bold mt-2">
              {{ formatPrice(item.price) }}
            </p>

            <div class="flex items-center gap-4 mt-4 flex-wrap">
              <UiQuantitySelector
                :model-value="item.quantity"
                @update:model-value="updateQuantity(item.productId, $event, item.variant)"
              />
              <button
                type="button"
                class="text-red-600 text-sm font-medium flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                @click="removeItem(item.productId, item.variant)"
              >
                <UIcon
                  name="i-lucide-trash-2"
                  class="size-4"
                />
                Hapus
              </button>
            </div>
          </div>

          <div class="hidden sm:block text-right font-bold text-neutral-900 shrink-0">
            {{ formatPrice(item.price * item.quantity) }}
          </div>
        </article>
      </div>

      <div>
        <CartOrderSummary
          show-checkout-button
          show-continue-shopping
        />
      </div>
    </div>
  </div>
</template>
