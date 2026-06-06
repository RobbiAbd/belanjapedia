<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Pesanan Saya',
  description: 'Riwayat pesanan BelanjaPedia Anda.'
})

const { formatPrice } = useFormatPrice()

type OrderListItem = {
  id: number
  orderNumber: string
  status: string
  total: number
  itemCount: number
  paymentStatus: string | null
  createdAt: string
}

const { data, pending, error } = await useFetch<{ success: boolean, data: { items: OrderListItem[] } }>('/api/orders')

const orders = computed(() => data.value?.data?.items ?? [])

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: 'Menunggu',
    PAID: 'Dibayar',
    PROCESSING: 'Diproses',
    SHIPPED: 'Dikirim',
    DELIVERED: 'Selesai',
    CANCELLED: 'Dibatalkan'
  }
  return labels[status] ?? status
}

function statusColor(status: string) {
  switch (status) {
    case 'DELIVERED':
      return 'success'
    case 'CANCELLED':
      return 'error'
    case 'SHIPPED':
    case 'PROCESSING':
      return 'info'
    default:
      return 'warning'
  }
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
    <h1 class="text-3xl font-bold text-neutral-900 mb-8">
      Pesanan Saya
    </h1>

    <div
      v-if="pending"
      class="text-center py-16 text-neutral-600"
    >
      Memuat pesanan...
    </div>

    <UAlert
      v-else-if="error"
      color="error"
      variant="subtle"
      title="Gagal memuat pesanan"
      class="max-w-xl"
    />

    <div
      v-else-if="orders.length === 0"
      class="text-center py-20"
    >
      <p class="text-8xl mb-6">
        📦
      </p>
      <h2 class="text-3xl font-bold mb-3">
        Belum ada pesanan
      </h2>
      <p class="text-neutral-600 mb-8">
        Pesanan Anda akan muncul di sini setelah checkout.
      </p>
      <UButton
        to="/products"
        color="primary"
        size="lg"
        class="rounded-full font-semibold"
      >
        Mulai Belanja
      </UButton>
    </div>

    <div
      v-else
      class="space-y-4"
    >
      <article
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-2xl shadow-sm p-5 lg:p-6"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-sm text-neutral-600">
              {{ new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' }) }}
            </p>
            <h2 class="text-lg font-bold text-neutral-900 mt-1">
              {{ order.orderNumber }}
            </h2>
            <p class="text-sm text-neutral-600 mt-1">
              {{ order.itemCount }} item
            </p>
          </div>

          <div class="text-right">
            <UBadge
              :color="statusColor(order.status)"
              variant="subtle"
            >
              {{ statusLabel(order.status) }}
            </UBadge>
            <p class="text-xl font-bold text-brand-600 mt-2">
              {{ formatPrice(order.total) }}
            </p>
          </div>
        </div>

        <UButton
          :to="`/orders/${order.id}`"
          variant="outline"
          color="primary"
          class="rounded-full mt-4"
          trailing-icon="i-lucide-arrow-right"
        >
          Lihat Detail
        </UButton>
      </article>
    </div>
  </div>
</template>
