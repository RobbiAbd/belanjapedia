<script setup lang="ts">
interface Category {
  id: number
  name: string
  slug: string
}

const props = defineProps<{
  categories: Category[]
  activeCategory?: string
}>()

const emit = defineEmits<{
  'update:category': [slug: string | undefined]
  'update:priceRange': [range: string | undefined]
}>()

const priceRanges = [
  { label: 'Di bawah Rp 100.000', value: '0-10000000' },
  { label: 'Rp 100.000 - Rp 500.000', value: '10000000-50000000' },
  { label: 'Rp 500.000 - Rp 1.000.000', value: '50000000-100000000' },
  { label: 'Di atas Rp 1.000.000', value: '100000000-' }
]

const selectedPrice = ref<string>()

function selectCategory(slug?: string) {
  emit('update:category', slug)
}

function selectPrice(value: string) {
  selectedPrice.value = selectedPrice.value === value ? undefined : value
  emit('update:priceRange', selectedPrice.value)
}
</script>

<template>
  <aside class="bg-white rounded-2xl shadow-sm p-6 lg:sticky lg:top-24">
    <h3 class="font-bold text-neutral-900 mb-4">
      Filter
    </h3>

    <div class="mb-6">
      <h4 class="text-sm font-semibold text-neutral-700 mb-3">
        Kategori
      </h4>
      <div class="space-y-2">
        <button
          type="button"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="!activeCategory ? 'bg-brand-50 text-brand-600' : 'text-neutral-600 hover:bg-neutral-50'"
          @click="selectCategory(undefined)"
        >
          Semua Produk
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          :class="activeCategory === cat.slug ? 'bg-brand-50 text-brand-600' : 'text-neutral-600 hover:bg-neutral-50'"
          @click="selectCategory(cat.slug)"
        >
          <span>{{ getCategoryIcon(cat.slug) }}</span>
          {{ cat.name }}
        </button>
      </div>
    </div>

    <div>
      <h4 class="text-sm font-semibold text-neutral-700 mb-3">
        Rentang Harga
      </h4>
      <div class="space-y-2">
        <label
          v-for="range in priceRanges"
          :key="range.value"
          class="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer"
        >
          <input
            type="checkbox"
            class="rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
            :checked="selectedPrice === range.value"
            @change="selectPrice(range.value)"
          >
          {{ range.label }}
        </label>
      </div>
    </div>
  </aside>
</template>
