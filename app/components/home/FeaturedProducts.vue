<script setup lang="ts">
import type { ProductListItem } from '~/types/product'

defineProps<{
  products: ProductListItem[]
  loading?: boolean
}>()
</script>

<template>
  <section class="max-w-[1400px] mx-auto px-4 lg:px-6 py-12">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl lg:text-3xl font-bold text-neutral-900">
        Produk Unggulan
      </h2>
      <NuxtLink
        to="/products"
        class="text-brand-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
      >
        Lihat Semua
        <UIcon
          name="i-lucide-arrow-right"
          class="size-4"
        />
      </NuxtLink>
    </div>

    <div
      v-if="loading"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="bg-neutral-200 rounded-2xl aspect-[3/4] animate-pulse"
      />
    </div>

    <div
      v-else
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>
