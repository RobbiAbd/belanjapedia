<script setup lang="ts">
import type { ProductListItem } from '~/types/product'

useSeoMeta({
  title: 'Beranda',
  description: 'Temukan produk terbaik dengan harga terjangkau di BelanjaPedia.'
})

const { data: categoriesRes } = await useFetch('/api/categories')
const { data: productsRes, pending } = await useFetch('/api/products', {
  query: { featured: 'true', limit: 8 }
})

const categories = computed(() => categoriesRes.value?.data ?? [])
const products = computed<ProductListItem[]>(() => productsRes.value?.data?.items ?? [])
</script>

<template>
  <div>
    <HomeHeroCarousel />
    <HomeCategorySection :categories="categories" />
    <HomeFlashSaleBanner />
    <HomeFeaturedProducts
      :products="products"
      :loading="pending"
    />
    <HomeTrustBadges />
  </div>
</template>
