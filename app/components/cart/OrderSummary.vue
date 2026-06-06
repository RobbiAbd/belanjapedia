<script setup lang="ts">
import { calcOrderTotal, calcShipping, calcTax } from '#shared/utils/order'

defineProps<{
  showCheckoutButton?: boolean
  showContinueShopping?: boolean
}>()

const { items, subtotal } = useCart()
const { formatPrice } = useFormatPrice()

const shipping = computed(() => calcShipping(items.value.length))
const tax = computed(() => calcTax(subtotal.value))
const total = computed(() => calcOrderTotal(subtotal.value, items.value.length))
</script>

<template>
  <aside class="bg-white rounded-2xl shadow-sm p-6 lg:sticky lg:top-24">
    <h2 class="text-xl font-bold text-neutral-900 mb-6">
      Ringkasan Pesanan
    </h2>

    <div class="space-y-3 text-sm">
      <div class="flex justify-between font-semibold">
        <span>Subtotal ({{ items.length }} item)</span>
        <span>{{ formatPrice(subtotal) }}</span>
      </div>
      <div class="flex justify-between font-semibold">
        <span>Ongkir</span>
        <span>{{ items.length ? formatPrice(shipping) : '—' }}</span>
      </div>
      <div class="flex justify-between font-semibold">
        <span>Pajak (11%)</span>
        <span>{{ items.length ? formatPrice(tax) : '—' }}</span>
      </div>
    </div>

    <div class="border-t border-neutral-200 mt-4 pt-4 flex justify-between text-lg lg:text-2xl font-bold">
      <span>Total</span>
      <span class="text-brand-600">{{ formatPrice(total) }}</span>
    </div>

    <UButton
      v-if="showCheckoutButton"
      to="/checkout"
      block
      color="primary"
      size="lg"
      class="rounded-full mt-6 font-semibold"
      icon="i-lucide-shopping-bag"
      :disabled="items.length === 0"
    >
      Lanjut ke Checkout
    </UButton>

    <NuxtLink
      v-if="showContinueShopping"
      to="/products"
      class="block text-center text-brand-600 text-sm font-medium mt-4 hover:underline"
    >
      Lanjutkan Belanja
    </NuxtLink>

    <div class="border-t border-neutral-200 mt-6 pt-4 space-y-2">
      <div class="flex items-center gap-2 text-xs text-neutral-600">
        <UIcon
          name="i-lucide-shield-check"
          class="size-4 text-green-600"
        />
        Pembayaran aman & terenkripsi
      </div>
      <div class="flex items-center gap-2 text-xs text-neutral-600">
        <UIcon
          name="i-lucide-truck"
          class="size-4 text-green-600"
        />
        Gratis ongkir pembelian pertama
      </div>
    </div>
  </aside>
</template>
