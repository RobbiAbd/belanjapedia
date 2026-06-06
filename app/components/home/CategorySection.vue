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
  <section class="max-w-[1400px] mx-auto px-4 lg:px-6 py-12">
    <h2 class="text-2xl lg:text-3xl font-bold text-neutral-900 mb-8">
      Kategori Populer
    </h2>
    <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.id"
        :to="`/products?category=${cat.slug}`"
        class="group bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md hover:scale-105 hover:-translate-y-1 transition-all duration-200"
      >
        <span class="text-4xl block mb-2">{{ getCategoryIcon(cat.slug) }}</span>
        <span class="text-sm font-medium text-neutral-700 group-hover:text-brand-600 transition-colors">
          {{ cat.name }}
        </span>
      </NuxtLink>
    </div>
  </section>
</template>
