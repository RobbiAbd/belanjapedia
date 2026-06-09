<script setup lang="ts">
import type { ProductListItem } from '~/types/product'

useSeoMeta({
  title: 'Katalog Produk',
  description: 'Jelajahi semua produk yang tersedia di BelanjaPedia.'
})

const route = useRoute()
const router = useRouter()

const category = computed(() => route.query.category as string | undefined)
const search = computed(() => route.query.search as string | undefined)
const featured = computed(() => route.query.featured as string | undefined)
const sort = ref('popular')

const { data: categoriesRes } = await useFetch('/api/categories')
const categories = computed(() => categoriesRes.value?.data ?? [])

const { data: productsRes, pending, refresh } = await useFetch('/api/products', {
  query: computed(() => ({
    category: category.value,
    search: search.value,
    featured: featured.value,
    limit: 12
  }))
})

const products = computed<ProductListItem[]>(() => productsRes.value?.data?.items ?? [])
const total = computed(() => productsRes.value?.data?.pagination?.total ?? 0)

function onCategoryChange(slug?: string) {
  router.push({
    path: '/products',
    query: {
      ...route.query,
      category: slug || undefined
    }
  })
}

watch([category, search, featured], () => refresh())
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 sm:py-8">
    <nav class="text-sm text-neutral-600 mb-4 sm:mb-8 flex items-center gap-2">
      <NuxtLink
        to="/"
        class="hover:text-brand-600 transition-colors"
      >
        Beranda
      </NuxtLink>
      <span>/</span>
      <span class="text-neutral-900 font-medium">Produk</span>
    </nav>

    <ProductCategoryChips
      :categories="categories"
      :active-category="category"
      @update:category="onCategoryChange"
    />

    <div class="flex flex-col lg:flex-row gap-8">
      <div class="hidden lg:block lg:w-64 shrink-0">
        <ProductFilters
          :categories="categories"
          :active-category="category"
          @update:category="onCategoryChange"
        />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p class="text-neutral-600">
            <span class="font-semibold text-neutral-900">{{ total }}</span> produk ditemukan
          </p>
          <USelect
            v-model="sort"
            :items="[
              { label: 'Terpopuler', value: 'popular' },
              { label: 'Harga Terendah', value: 'price-asc' },
              { label: 'Harga Tertinggi', value: 'price-desc' },
              { label: 'Rating Tertinggi', value: 'rating' }
            ]"
            class="w-full sm:w-48"
          />
        </div>

        <div
          v-if="pending"
          class="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6"
        >
          <div
            v-for="i in 6"
            :key="i"
            class="bg-neutral-200 rounded-2xl aspect-[3/4] animate-pulse"
          />
        </div>

        <div
          v-else-if="products.length === 0"
          class="text-center py-20"
        >
          <p class="text-6xl mb-4">
            🔍
          </p>
          <h2 class="text-2xl font-bold mb-2">
            Produk tidak ditemukan
          </h2>
          <p class="text-neutral-600 mb-6">
            Coba ubah filter atau kata kunci pencarian
          </p>
          <UButton
            to="/products"
            color="primary"
            class="rounded-full"
          >
            Lihat Semua Produk
          </UButton>
        </div>

        <div
          v-else
          class="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6"
        >
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </div>
  </div>
</template>
