<template>
  <section class="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
    <div class="rounded-3xl bg-brand-500 px-8 py-8 lg:px-12 lg:py-12">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="text-white">
          <h2 class="text-3xl lg:text-4xl font-bold mb-2">
            ⚡ Flash Sale Hari Ini
          </h2>
          <p class="text-lg text-white/90">
            Hemat lebih banyak dengan diskon spesial terbatas waktu
          </p>
        </div>
        <UButton
          to="/products?featured=true"
          size="lg"
          class="rounded-full bg-white text-brand-600 hover:bg-cream font-semibold shrink-0"
        >
          Belanja Sekarang
        </UButton>
      </div>
    </div>
  </section>
</template>
