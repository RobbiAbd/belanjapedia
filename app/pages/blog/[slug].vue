<script setup lang="ts">
const posts: Record<string, { title: string, date: string, tag: string, content: string[] }> = {
  'tips-belanja-hemat': {
    title: '5 Tips Belanja Hemat di BelanjaPedia',
    date: '1 Juni 2026',
    tag: 'Tips',
    content: [
      'Manfaatkan flash sale harian untuk produk unggulan dengan diskon terbatas.',
      'Kumpulkan coin setiap transaksi dan tukarkan dengan voucher belanja.',
      'Gunakan gratis ongkir pada pembelian pertamamu.',
      'Bandingkan harga dan baca ulasan sebelum checkout.',
      'Buat wishlist agar kamu bisa memantau produk saat harganya turun.'
    ]
  },
  'kenalan-maskot-belanjapedia': {
    title: 'Kenalan dengan Maskot Kucing BelanjaPedia',
    date: '28 Mei 2026',
    tag: 'Brand',
    content: [
      'Maskot BelanjaPedia adalah kucing lucu yang menyatu dengan bentuk tas belanja — melambangkan belanja yang fun dan friendly.',
      'Warna orange dipilih karena hangat, mudah diingat, dan cocok untuk gamifikasi coin & reward.',
      'Kamu akan melihat maskot ini di promo, notifikasi, dan merchandise resmi BelanjaPedia ke depannya.'
    ]
  },
  'panduan-bayar-aman': {
    title: 'Panduan Pembayaran Aman di Marketplace',
    date: '20 Mei 2026',
    tag: 'Keamanan',
    content: [
      'Selalu belanja melalui website atau aplikasi resmi BelanjaPedia.',
      'Jangan transfer ke rekening di luar instruksi checkout resmi.',
      'Periksa detail pesanan sebelum konfirmasi pembayaran.',
      'Simpan bukti transaksi hingga pesanan diterima.',
      'Laporkan aktivitas mencurigakan melalui Pusat Bantuan.'
    ]
  }
}

const route = useRoute()
const slug = route.params.slug as string
const post = posts[slug]

if (!post) {
  throw createError({ statusCode: 404, message: 'Artikel tidak ditemukan' })
}

useSeoMeta({
  title: post.title,
  description: post.content[0]
})
</script>

<template>
  <LayoutInfoPage :title="post.title">
    <div class="flex items-center gap-2 mb-6 not-prose">
      <UBadge
        color="primary"
        variant="subtle"
      >
        {{ post.tag }}
      </UBadge>
      <span class="text-sm text-neutral-500">{{ post.date }}</span>
    </div>

    <ul class="list-disc pl-6 space-y-3">
      <li
        v-for="(paragraph, index) in post.content"
        :key="index"
      >
        {{ paragraph }}
      </li>
    </ul>

    <NuxtLink
      to="/blog"
      class="inline-flex items-center gap-1 text-brand-600 font-medium mt-8 hover:underline not-prose"
    >
      <UIcon
        name="i-lucide-arrow-left"
        class="size-4"
      />
      Kembali ke Blog
    </NuxtLink>
  </LayoutInfoPage>
</template>
