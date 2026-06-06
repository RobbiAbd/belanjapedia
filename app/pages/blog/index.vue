<script setup lang="ts">
useSeoMeta({
  title: 'Blog',
  description: 'Tips belanja, promo, dan berita terbaru dari BelanjaPedia.'
})

const posts = [
  {
    slug: 'tips-belanja-hemat',
    title: '5 Tips Belanja Hemat di BelanjaPedia',
    excerpt: 'Maksimalkan coin, flash sale, dan gratis ongkir untuk belanja lebih hemat setiap bulan.',
    date: '1 Juni 2026',
    tag: 'Tips'
  },
  {
    slug: 'kenalan-maskot-belanjapedia',
    title: 'Kenalan dengan Maskot Kucing BelanjaPedia',
    excerpt: 'Cerita di balik maskot tas belanja berbentuk kucing yang menjadi identitas brand kami.',
    date: '28 Mei 2026',
    tag: 'Brand'
  },
  {
    slug: 'panduan-bayar-aman',
    title: 'Panduan Pembayaran Aman di Marketplace',
    excerpt: 'Cara memastikan transaksimu aman dan terhindar dari penipuan saat belanja online.',
    date: '20 Mei 2026',
    tag: 'Keamanan'
  }
]
</script>

<template>
  <LayoutInfoPage
    title="Blog"
    description="Artikel, tips belanja, dan update terbaru dari BelanjaPedia."
  >
    <div class="grid gap-6 not-prose">
      <NuxtLink
        v-for="post in posts"
        :key="post.slug"
        :to="`/blog/${post.slug}`"
        class="block bg-white rounded-2xl border border-neutral-200 p-6 hover:border-brand-300 hover:shadow-md transition-all"
      >
        <div class="flex items-center gap-2 mb-3">
          <UBadge
            color="primary"
            variant="subtle"
          >
            {{ post.tag }}
          </UBadge>
          <span class="text-sm text-neutral-500">{{ post.date }}</span>
        </div>
        <h2 class="text-xl font-bold text-neutral-900 mb-2 group-hover:text-brand-600">
          {{ post.title }}
        </h2>
        <p class="text-neutral-600 text-sm">
          {{ post.excerpt }}
        </p>
        <span class="inline-flex items-center gap-1 text-brand-600 text-sm font-medium mt-4">
          Baca selengkapnya
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4"
          />
        </span>
      </NuxtLink>
    </div>
  </LayoutInfoPage>
</template>
