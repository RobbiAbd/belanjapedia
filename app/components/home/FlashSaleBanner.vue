<template>
  <section class="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
    <div class="relative overflow-hidden rounded-3xl">
      <img
        src="/images/flash-sale-bg.jpg"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      >

      <div class="absolute inset-0 bg-gradient-to-r from-brand-600/92 via-brand-500/88 to-pink-600/85" />

      <div class="pointer-events-none absolute -top-10 -right-10 size-48 rounded-full bg-white/10 blur-2xl" />
      <div class="pointer-events-none absolute -bottom-12 left-1/4 size-56 rounded-full bg-white/10 blur-3xl" />

      <div class="relative z-10 px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
          <div class="text-white min-w-0">
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1.5 sm:mb-2 drop-shadow-sm">
              ⚡ Flash Sale Hari Ini
            </h2>
            <p class="text-sm sm:text-lg text-white/90 drop-shadow-sm">
              Hemat lebih banyak dengan diskon spesial terbatas waktu
            </p>
          </div>
          <UButton
            to="/products?featured=true"
            size="lg"
            class="rounded-full bg-white text-brand-600 hover:bg-cream font-semibold shrink-0 shadow-lg"
          >
            Belanja Sekarang
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>
