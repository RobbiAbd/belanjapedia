<script setup lang="ts">
const slides = [
  {
    title: 'Belanja Seru, Hadiah Melimpah',
    subtitle: 'Kumpulkan coin setiap belanja dan tukarkan dengan reward menarik',
    cta: 'Mulai Belanja',
    to: '/products',
    bgClass: 'bg-brand-500'
  },
  {
    title: 'Flash Sale Spesial',
    subtitle: 'Diskon hingga 50% untuk produk pilihan hari ini',
    cta: 'Lihat Promo',
    to: '/products?featured=true',
    bgClass: 'bg-brand-600'
  },
  {
    title: 'Gratis Ongkir Pertama',
    subtitle: 'Pengiriman cepat ke seluruh Indonesia',
    cta: 'Belanja Sekarang',
    to: '/products',
    bgClass: 'bg-brand-500'
  }
]

const current = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function goTo(index: number) {
  current.value = index
}

function next() {
  current.value = (current.value + 1) % slides.length
}

function prev() {
  current.value = (current.value - 1 + slides.length) % slides.length
}

function startAutoplay() {
  timer = setInterval(next, 4000)
}

function stopAutoplay() {
  if (timer) clearInterval(timer)
}

onMounted(startAutoplay)
onUnmounted(stopAutoplay)
</script>

<template>
  <section
    class="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="absolute inset-0 transition-opacity duration-800"
      :class="index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'"
    >
      <div
        class="absolute inset-0"
        :class="slide.bgClass"
      />

      <div class="relative z-10 h-full max-w-[1400px] mx-auto px-4 lg:px-6 flex items-center">
        <div class="max-w-2xl text-white">
          <h1 class="text-4xl lg:text-5xl xl:text-7xl font-bold mb-4 leading-tight">
            {{ slide.title }}
          </h1>
          <p class="text-lg lg:text-2xl text-white/90 mb-8">
            {{ slide.subtitle }}
          </p>
          <UButton
            :to="slide.to"
            size="xl"
            color="neutral"
            variant="solid"
            class="rounded-full px-8 lg:px-10 font-semibold"
          >
            {{ slide.cta }}
          </UButton>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="absolute left-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-dark-text/20 text-white flex items-center justify-center hover:bg-dark-text/40 transition-colors"
      aria-label="Slide sebelumnya"
      @click="prev"
    >
      <UIcon
        name="i-lucide-chevron-left"
        class="size-6"
      />
    </button>
    <button
      type="button"
      class="absolute right-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-dark-text/20 text-white flex items-center justify-center hover:bg-dark-text/40 transition-colors"
      aria-label="Slide berikutnya"
      @click="next"
    >
      <UIcon
        name="i-lucide-chevron-right"
        class="size-6"
      />
    </button>

    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
      <button
        v-for="(_, index) in slides"
        :key="index"
        type="button"
        class="h-2 rounded-full transition-all duration-300"
        :class="index === current ? 'w-8 bg-white' : 'w-2 bg-white/50'"
        :aria-label="`Slide ${index + 1}`"
        @click="goTo(index)"
      />
    </div>
  </section>
</template>
