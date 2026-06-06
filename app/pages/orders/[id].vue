<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { formatPrice } = useFormatPrice()

const orderId = computed(() => Number(route.params.id))

const { data, pending, error } = await useFetch(
  () => `/api/orders/${orderId.value}`,
  { watch: [orderId] }
)

const order = computed(() => data.value?.data?.order)

useSeoMeta({
  title: () => order.value ? `Pesanan ${order.value.orderNumber}` : 'Detail Pesanan'
})

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: 'Menunggu Pembayaran',
    PAID: 'Sudah Dibayar',
    PROCESSING: 'Sedang Diproses',
    SHIPPED: 'Sedang Dikirim',
    DELIVERED: 'Selesai',
    CANCELLED: 'Dibatalkan'
  }
  return labels[status] ?? status
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
    <div
      v-if="pending"
      class="text-center py-16 text-neutral-600"
    >
      Memuat detail pesanan...
    </div>

    <UAlert
      v-else-if="error || !order"
      color="error"
      variant="subtle"
      title="Pesanan tidak ditemukan"
      class="max-w-xl"
    />

    <template v-else>
      <nav class="text-sm text-neutral-600 mb-6 flex items-center gap-2">
        <NuxtLink
          to="/orders"
          class="hover:text-brand-600 transition-colors"
        >
          Pesanan Saya
        </NuxtLink>
        <span>/</span>
        <span class="text-neutral-900 font-medium">{{ order.orderNumber }}</span>
      </nav>

      <div class="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900">
            {{ order.orderNumber }}
          </h1>
          <p class="text-neutral-600 mt-1">
            {{ new Date(order.createdAt).toLocaleString('id-ID') }}
          </p>
        </div>
        <UBadge
          color="warning"
          variant="subtle"
          size="lg"
        >
          {{ statusLabel(order.status) }}
        </UBadge>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <section class="bg-white rounded-2xl shadow-sm p-6">
            <h2 class="text-xl font-bold mb-4">
              Item Pesanan
            </h2>
            <div class="space-y-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex justify-between gap-4 text-sm"
              >
                <div>
                  <NuxtLink
                    :to="`/products/${item.productSlug}`"
                    class="font-medium text-neutral-900 hover:text-brand-600"
                  >
                    {{ item.productName }}
                  </NuxtLink>
                  <p class="text-neutral-600 mt-1">
                    {{ item.quantity }} × {{ formatPrice(item.price) }}
                  </p>
                </div>
                <p class="font-semibold shrink-0">
                  {{ formatPrice(item.subtotal) }}
                </p>
              </div>
            </div>
          </section>

          <section class="bg-white rounded-2xl shadow-sm p-6">
            <h2 class="text-xl font-bold mb-4">
              Alamat Pengiriman
            </h2>
            <p class="text-neutral-700 leading-relaxed">
              <strong>{{ order.shippingAddress.recipient }}</strong><br>
              {{ order.shippingAddress.phone }}<br>
              {{ order.shippingAddress.address }}<br>
              {{ order.shippingAddress.city }}, {{ order.shippingAddress.province }} {{ order.shippingAddress.postalCode }}
            </p>
          </section>
        </div>

        <aside class="bg-white rounded-2xl shadow-sm p-6 h-fit lg:sticky lg:top-24">
          <h2 class="text-xl font-bold mb-4">
            Ringkasan
          </h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>{{ formatPrice(order.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Ongkir</span>
              <span>{{ formatPrice(order.shippingCost) }}</span>
            </div>
            <div
              v-if="order.coinsUsed > 0"
              class="flex justify-between text-green-600"
            >
              <span>Coin ({{ order.coinsUsed.toLocaleString('id-ID') }})</span>
              <span>-{{ formatPrice(order.discount) }}</span>
            </div>
          </div>
          <div class="border-t border-neutral-200 mt-4 pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span class="text-brand-600">{{ formatPrice(order.total) }}</span>
          </div>

          <div
            v-if="order.payment"
            class="mt-6 p-4 bg-brand-50 rounded-xl text-sm"
          >
            <p>
              <strong>Pembayaran:</strong>
              {{ order.payment.paymentMethodLabel }}
            </p>
            <p class="mt-1">
              <strong>Status:</strong> {{ order.payment.status }}
            </p>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>
