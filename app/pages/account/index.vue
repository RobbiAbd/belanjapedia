<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Akun Saya',
  description: 'Kelola profil akun BelanjaPedia Anda.'
})

const { user } = useUserSession()
const { balance, canClaimDaily, dailyReward, claimDaily, claiming, fetchStatus } = useCoins()
const { fetch: refreshSession } = useUserSession()
const toast = useToast()

const accountLinks = [
  { to: '/orders', label: 'Pesanan Saya', icon: 'i-lucide-package' },
  { to: '/account/addresses', label: 'Alamat Tersimpan', icon: 'i-lucide-map-pin' },
  { to: '/account/coins', label: 'Riwayat Coin', icon: 'i-lucide-coins' }
]

async function handleClaimDaily() {
  try {
    const result = await claimDaily()
    await refreshSession()
    toast.add({
      title: 'Daily reward diklaim!',
      description: `+${result.reward} coin`,
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Gagal klaim reward',
      color: 'error'
    })
  }
}

onMounted(() => {
  fetchStatus()
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
    <h1 class="text-3xl font-bold text-neutral-900 mb-8">
      Akun Saya
    </h1>

    <div class="max-w-xl bg-white rounded-2xl shadow-sm p-6 lg:p-8">
      <div class="flex items-center gap-4 mb-6">
        <div class="size-14 rounded-full bg-brand-100 flex items-center justify-center">
          <UIcon
            name="i-lucide-user"
            class="size-7 text-brand-600"
          />
        </div>
        <div>
          <h2 class="text-xl font-bold text-neutral-900">
            {{ user?.name }}
          </h2>
          <p class="text-sm text-neutral-600">
            {{ user?.email }}
          </p>
        </div>
      </div>

      <dl class="space-y-4 text-sm">
        <div class="flex justify-between gap-4 py-3 border-b border-neutral-100">
          <dt class="text-neutral-600">
            Nama
          </dt>
          <dd class="font-medium text-neutral-900 text-right">
            {{ user?.name }}
          </dd>
        </div>
        <div class="flex justify-between gap-4 py-3 border-b border-neutral-100">
          <dt class="text-neutral-600">
            Email
          </dt>
          <dd class="font-medium text-neutral-900 text-right">
            {{ user?.email }}
          </dd>
        </div>
        <div class="flex justify-between gap-4 py-3 border-b border-neutral-100">
          <dt class="text-neutral-600">
            Telepon
          </dt>
          <dd class="font-medium text-neutral-900 text-right">
            {{ user?.phone || '—' }}
          </dd>
        </div>
        <div class="flex justify-between gap-4 py-3 border-b border-neutral-100">
          <dt class="text-neutral-600">
            Tipe Akun
          </dt>
          <dd class="font-medium text-neutral-900 text-right capitalize">
            {{ user?.role?.toLowerCase() }}
          </dd>
        </div>
        <div class="flex justify-between gap-4 py-3">
          <dt class="text-neutral-600">
            Saldo Coin
          </dt>
          <dd class="font-bold text-brand-600 text-right">
            {{ (user?.coins ?? balance).toLocaleString('id-ID') }} coin
          </dd>
        </div>
      </dl>

      <div
        v-if="canClaimDaily"
        class="mt-6 p-4 bg-brand-50 rounded-xl"
      >
        <p class="text-sm font-medium text-neutral-800 mb-3">
          Daily login reward tersedia: {{ dailyReward.toLocaleString('id-ID') }} coin
        </p>
        <UButton
          color="primary"
          class="rounded-full font-semibold"
          icon="i-lucide-gift"
          :loading="claiming"
          @click="handleClaimDaily"
        >
          Klaim Sekarang
        </UButton>
      </div>

      <div class="flex flex-col sm:flex-row flex-wrap gap-3 mt-6">
        <NuxtLink
          v-for="link in accountLinks"
          :key="link.to"
          :to="link.to"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-brand-600 text-brand-600 font-medium text-sm hover:bg-brand-50 transition-colors"
        >
          {{ link.label }}
          <UIcon
            :name="link.icon"
            class="size-4"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
