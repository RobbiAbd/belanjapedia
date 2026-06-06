<script setup lang="ts">
useSeoMeta({
  title: 'Pusat Bantuan',
  description: 'Pusat bantuan BelanjaPedia — jawaban untuk pertanyaan umum seputar belanja, pesanan, dan pembayaran.'
})

const faqs = [
  {
    q: 'Bagaimana cara melacak pesanan?',
    a: 'Masuk ke akunmu, buka menu Pesanan, lalu pilih pesanan yang ingin dilacak. Status pengiriman akan diperbarui secara berkala.'
  },
  {
    q: 'Metode pembayaran apa yang tersedia?',
    a: 'Kami mendukung transfer bank, e-wallet, dan COD (Cash on Delivery) di area tertentu.'
  },
  {
    q: 'Berapa lama proses pengiriman?',
    a: 'Estimasi 2–7 hari kerja tergantung lokasi dan kurir yang dipilih saat checkout.'
  },
  {
    q: 'Bagaimana jika produk rusak atau tidak sesuai?',
    a: 'Ajukan retur melalui halaman detail pesanan dalam 30 hari sejak barang diterima. Lihat Kebijakan Retur untuk detail lengkap.'
  },
  {
    q: 'Apakah ada gratis ongkir?',
    a: 'Ya, pembelian pertama kamu berhak mendapatkan promo gratis ongkir sesuai syarat yang berlaku.'
  }
]
</script>

<template>
  <LayoutInfoPage
    title="Pusat Bantuan"
    description="Temukan jawaban atas pertanyaan umum atau hubungi tim support kami."
  >
    <div class="space-y-4 not-prose">
      <UCard
        v-for="faq in faqs"
        :key="faq.q"
      >
        <h3 class="font-semibold text-neutral-900 mb-2">
          {{ faq.q }}
        </h3>
        <p class="text-sm text-neutral-600">
          {{ faq.a }}
        </p>
      </UCard>
    </div>

    <p class="mt-8">
      Masih butuh bantuan?
      <NuxtLink
        to="/hubungi-kami"
        class="text-brand-600 font-medium hover:underline"
      >
        Hubungi Kami
      </NuxtLink>
      atau baca
      <NuxtLink
        to="/cara-belanja"
        class="text-brand-600 font-medium hover:underline"
      >
        Cara Belanja
      </NuxtLink>.
    </p>
  </LayoutInfoPage>
</template>
