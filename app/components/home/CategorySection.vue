<script setup lang="ts">
interface Category {
  id: number
  name: string
  slug: string
}

defineProps<{
  categories: Category[]
}>()
</script>

<template>
  <section class="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 sm:py-12">
    <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 mb-6 sm:mb-8">
      Kategori Populer
    </h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.id"
        :to="`/products?category=${cat.slug}`"
        class="group bg-white rounded-2xl p-3 sm:p-4 text-center shadow-sm hover:shadow-md sm:hover:scale-105 sm:hover:-translate-y-1 transition-all duration-200 min-h-24 sm:min-h-0 flex flex-col items-center justify-center"
      >
        <span class="text-3xl sm:text-4xl block mb-1.5 sm:mb-2">{{ getCategoryIcon(cat.slug) }}</span>
        <span class="text-xs sm:text-sm font-medium text-neutral-700 group-hover:text-brand-600 transition-colors leading-tight">
          {{ cat.name }}
        </span>
      </NuxtLink>
    </div>
  </section>
</template>
