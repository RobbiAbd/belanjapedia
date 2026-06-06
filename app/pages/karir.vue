<script setup lang="ts">
useSeoMeta({
  title: 'Karir',
  description: 'Bergabung dengan tim BelanjaPedia dan bantu kami membangun marketplace masa depan.'
})

const openings = [
  {
    title: 'Frontend Developer (Nuxt/Vue)',
    type: 'Full-time · Remote/Hybrid',
    desc: 'Membangun pengalaman belanja yang cepat dan responsif di web BelanjaPedia.'
  },
  {
    title: 'Customer Support Specialist',
    type: 'Full-time · Jakarta',
    desc: 'Membantu pelanggan menyelesaikan kendala pesanan, pembayaran, dan pengiriman.'
  },
  {
    title: 'Digital Marketing',
    type: 'Kontrak · Remote',
    desc: 'Mengelola kampanye promo, konten sosial media, dan pertumbuhan pengguna.'
  }
]
</script>

<template>
  <LayoutInfoPage
    title="Karir"
    description="Bergabunglah dengan tim BelanjaPedia. Kami mencari orang-orang yang passionate tentang teknologi dan e-commerce."
  >
    <p>
      Di BelanjaPedia, kami membangun budaya kerja kolaboratif, inovatif, dan berorientasi pada pengguna.
      Jika kamu suka menyelesaikan masalah nyata dan ingin berkontribusi pada produk yang dipakai ribuan orang,
      kami ingin mendengar dari kamu.
    </p>

    <h2 class="text-xl font-bold text-neutral-900 mt-8 mb-4">
      Lowongan Terbuka
    </h2>
    <div class="space-y-4 not-prose">
      <UCard
        v-for="job in openings"
        :key="job.title"
      >
        <h3 class="font-semibold text-neutral-900 mb-1">
          {{ job.title }}
        </h3>
        <p class="text-sm text-brand-600 font-medium mb-2">
          {{ job.type }}
        </p>
        <p class="text-sm text-neutral-600">
          {{ job.desc }}
        </p>
      </UCard>
    </div>

    <p class="mt-8">
      Kirim CV dan portofolio ke
      <NuxtLink
        to="/hubungi-kami"
        class="text-brand-600 font-medium hover:underline"
      >
        halaman Hubungi Kami
      </NuxtLink>
      dengan subjek <strong>Lamaran Karir — [Posisi]</strong>.
    </p>
  </LayoutInfoPage>
</template>
