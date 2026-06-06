<script setup lang="ts">
useSeoMeta({
  title: 'Cara Belanja',
  description: 'Panduan lengkap belanja di BelanjaPedia dari browsing produk hingga checkout.'
})

const steps = [
  {
    icon: 'i-lucide-search',
    title: '1. Cari Produk',
    desc: 'Jelajahi katalog atau gunakan search bar untuk menemukan produk yang kamu inginkan.'
  },
  {
    icon: 'i-lucide-shopping-cart',
    title: '2. Tambah ke Keranjang',
    desc: 'Pilih jumlah produk, lalu klik "+ Keranjang" pada halaman detail produk.'
  },
  {
    icon: 'i-lucide-clipboard-list',
    title: '3. Review Keranjang',
    desc: 'Buka halaman Keranjang, pastikan item dan jumlah sudah benar sebelum checkout.'
  },
  {
    icon: 'i-lucide-truck',
    title: '4. Isi Data Pengiriman',
    desc: 'Masukkan alamat lengkap, pilih metode pembayaran, dan review pesanan.'
  },
  {
    icon: 'i-lucide-check-circle',
    title: '5. Selesaikan Pembayaran',
    desc: 'Konfirmasi pesanan dan lakukan pembayaran. Lacak status di menu Pesanan.'
  }
]
</script>

<template>
  <LayoutInfoPage
    title="Cara Belanja"
    description="Ikuti langkah-langkah sederhana ini untuk berbelanja di BelanjaPedia."
  >
    <div class="space-y-4 not-prose">
      <div
        v-for="step in steps"
        :key="step.title"
        class="flex gap-4 bg-white rounded-2xl border border-neutral-200 p-5"
      >
        <div class="size-12 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
          <UIcon
            :name="step.icon"
            class="size-6 text-brand-600"
          />
        </div>
        <div>
          <h3 class="font-semibold text-neutral-900 mb-1">
            {{ step.title }}
          </h3>
          <p class="text-sm text-neutral-600">
            {{ step.desc }}
          </p>
        </div>
      </div>
    </div>

    <UButton
      to="/products"
      color="primary"
      class="rounded-full mt-8 not-prose"
      trailing-icon="i-lucide-arrow-right"
    >
      Mulai Belanja Sekarang
    </UButton>
  </LayoutInfoPage>
</template>
