<script setup lang="ts">
import type { ProductListItem } from '~/types/product'

const props = defineProps<{
  product: ProductListItem
}>()

const { formatPrice, discountPercent } = useFormatPrice()
const { addItem } = useCart()
const toast = useToast()

const imageUrl = computed(() =>
  resolveProductImageUrl(props.product.images, props.product.slug)
)
const discount = computed(() =>
  discountPercent(props.product.price, props.product.comparePrice)
)

function handleAddToCart() {
  addItem(props.product)
  toast.add({
    title: 'Ditambahkan ke keranjang',
    description: props.product.name,
    color: 'success',
    icon: 'i-lucide-shopping-cart'
  })
}
</script>

<template>
  <article
    class="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-200 overflow-hidden"
  >
    <NuxtLink
      :to="`/products/${product.slug}`"
      class="block relative aspect-square bg-neutral-100 overflow-hidden"
    >
      <img
        :src="imageUrl"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      >
      <span
        v-if="discount > 0"
        class="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full"
      >
        -{{ discount }}%
      </span>
    </NuxtLink>

    <div class="p-4">
      <NuxtLink :to="`/products/${product.slug}`">
        <h3 class="font-semibold text-neutral-900 line-clamp-2 group-hover:text-brand-600 transition-colors mb-2">
          {{ product.name }}
        </h3>
      </NuxtLink>

      <div class="flex items-center gap-1 mb-2">
        <UIcon
          name="i-lucide-star"
          class="size-4 text-yellow-400 fill-yellow-400"
        />
        <span class="text-sm font-semibold">{{ product.reviewCount ? (product.rating?.toFixed(1) ?? '0.0') : '—' }}</span>
        <span class="text-xs text-neutral-500">({{ product.reviewCount ?? 0 }})</span>
      </div>

      <div class="flex items-baseline gap-2 mb-4">
        <span class="text-lg font-bold text-neutral-900">{{ formatPrice(product.price) }}</span>
        <span
          v-if="product.comparePrice"
          class="text-sm text-neutral-400 line-through"
        >
          {{ formatPrice(product.comparePrice) }}
        </span>
      </div>

      <UButton
        block
        color="primary"
        class="rounded-full font-semibold"
        icon="i-lucide-shopping-cart"
        @click="handleAddToCart"
      >
        + Keranjang
      </UButton>
    </div>
  </article>
</template>
