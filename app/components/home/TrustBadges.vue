<script setup lang="ts">
const badges = [
  { icon: '🚚', title: 'Pengiriman Cepat', desc: 'Ke seluruh Indonesia' },
  { icon: '🔒', title: 'Pembayaran Aman', desc: 'Transaksi terlindungi' },
  { icon: '↩️', title: 'Garansi Retur', desc: '30 hari pengembalian' },
  { icon: '💬', title: 'Support 24/7', desc: 'Siap membantu kapan saja' }
]
</script>

<template>
  <section class="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 sm:py-12">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="badge in badges"
        :key="badge.title"
        class="text-center"
      >
        <span class="text-5xl block mb-3">{{ badge.icon }}</span>
        <h3 class="font-semibold text-neutral-900 mb-1">
          {{ badge.title }}
        </h3>
        <p class="text-sm text-neutral-600">
          {{ badge.desc }}
        </p>
      </div>
    </div>
  </section>
</template>
