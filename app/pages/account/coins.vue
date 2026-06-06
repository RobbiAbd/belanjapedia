<script setup lang="ts">
import { formatCoinTransactionType } from '#shared/utils/coin'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Riwayat Coin',
  description: 'Lihat riwayat transaksi coin BelanjaPedia Anda.'
})

const { balance, fetchStatus } = useCoins()
const { user } = useUserSession()

type CoinHistoryItem = {
  id: number
  amount: number
  type: string
  reference: string | null
  createdAt: string
}

const transactions = ref<CoinHistoryItem[]>([])
const loading = ref(true)
const page = ref(1)
const totalPages = ref(1)

async function fetchHistory() {
  loading.value = true

  try {
    const response = await $fetch<{
      success: boolean
      data: {
        transactions: CoinHistoryItem[]
        pagination: { page: number, totalPages: number }
      }
    }>('/api/coins/history', {
      query: { page: page.value, limit: 20 }
    })

    transactions.value = response.data.transactions
    totalPages.value = response.data.pagination.totalPages
  } catch {
    transactions.value = []
  } finally {
    loading.value = false
  }
}

watch(page, fetchHistory)

onMounted(() => {
  fetchStatus()
  fetchHistory()
})

function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
    <div class="flex items-center gap-3 mb-8">
      <UButton
        to="/account"
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-left"
        class="rounded-full"
      />
      <h1 class="text-3xl font-bold text-neutral-900">
        Riwayat Coin
      </h1>
    </div>

    <div class="max-w-3xl bg-white rounded-2xl shadow-sm p-6 mb-6">
      <p class="text-sm text-neutral-600">
        Saldo saat ini
      </p>
      <p class="text-2xl font-bold text-brand-600">
        {{ (user?.coins ?? balance).toLocaleString('id-ID') }} coin
      </p>
    </div>

    <div class="max-w-3xl bg-white rounded-2xl shadow-sm overflow-hidden">
      <div
        v-if="loading"
        class="p-6 text-sm text-neutral-500"
      >
        Memuat riwayat...
      </div>

      <div
        v-else-if="transactions.length === 0"
        class="p-6 text-sm text-neutral-600"
      >
        Belum ada riwayat transaksi coin.
      </div>

      <div
        v-else
        class="divide-y divide-neutral-100"
      >
        <div
          v-for="tx in transactions"
          :key="tx.id"
          class="flex items-center justify-between gap-4 p-4"
        >
          <div>
            <p class="font-medium text-neutral-900">
              {{ formatCoinTransactionType(tx.type) }}
            </p>
            <p class="text-xs text-neutral-500 mt-1">
              {{ formatDate(tx.createdAt) }}
              <span v-if="tx.reference"> · {{ tx.reference }}</span>
            </p>
          </div>
          <p
            class="font-bold shrink-0"
            :class="tx.amount >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ tx.amount >= 0 ? '+' : '' }}{{ tx.amount.toLocaleString('id-ID') }} coin
          </p>
        </div>
      </div>

      <div
        v-if="totalPages > 1"
        class="flex justify-center gap-2 p-4 border-t border-neutral-100"
      >
        <UButton
          variant="outline"
          class="rounded-full"
          :disabled="page <= 1"
          @click="page--"
        >
          Sebelumnya
        </UButton>
        <span class="text-sm text-neutral-600 self-center">
          Halaman {{ page }} / {{ totalPages }}
        </span>
        <UButton
          variant="outline"
          class="rounded-full"
          :disabled="page >= totalPages"
          @click="page++"
        >
          Berikutnya
        </UButton>
      </div>
    </div>
  </div>
</template>
