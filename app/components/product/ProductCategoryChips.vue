<script setup lang="ts">
interface Category {
  id: number
  name: string
  slug: string
}

defineProps<{
  categories: Category[]
  activeCategory?: string
}>()

const emit = defineEmits<{
  'update:category': [slug: string | undefined]
}>()
</script>

<template>
  <div class="lg:hidden -mx-1 mb-6">
    <div class="flex gap-2 overflow-x-auto scrollbar-none px-1 pb-1">
      <button
        type="button"
        class="shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors"
        :class="!activeCategory
          ? 'bg-brand-500 text-white border-brand-500'
          : 'bg-white text-neutral-700 border-neutral-200'"
        @click="emit('update:category', undefined)"
      >
        Semua
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        class="shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap"
        :class="activeCategory === cat.slug
          ? 'bg-brand-500 text-white border-brand-500'
          : 'bg-white text-neutral-700 border-neutral-200'"
        @click="emit('update:category', cat.slug)"
      >
        {{ getCategoryIcon(cat.slug) }} {{ cat.name }}
      </button>
    </div>
  </div>
</template>
