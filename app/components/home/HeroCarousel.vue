<script setup lang="ts">
const slides = [
  {
    image: '/images/hero-banner-promo.png',
    alt: 'Belanja Hemat, Dapetin Serunya — Diskon hingga 70% dan Gratis Ongkir',
    to: '/products',
    width: 1024,
    height: 200,
    bg: 'bg-orange-50'
  },
  {
    image: '/images/hero-banner-pastipedia.png',
    alt: 'Belanja Apapun #PastiPedia — Fashion, Elektronik, Home Living, dan Kecantikan',
    to: '/products',
    width: 1024,
    height: 164,
    bg: 'bg-purple-50'
  },
  {
    image: '/images/hero-banner-coins.png',
    alt: 'Kumpulkan Koin, Dapatkan Keuntungan — Setiap belanja dan aktivitas menambah koinmu',
    to: '/account/coins',
    width: 1024,
    height: 146,
    bg: 'bg-amber-50'
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
  <section class="max-w-[1400px] mx-auto px-4 lg:px-6 pt-4 sm:pt-6">
    <div
      class="relative w-full overflow-hidden rounded-2xl aspect-[1024/200]"
      @mouseenter="stopAutoplay"
      @mouseleave="startAutoplay"
    >
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="absolute inset-0 transition-opacity duration-800"
        :class="[slide.bg, index === current ? 'opacity-100 z-10' : 'opacity-0 z-0']"
      >
        <NuxtLink
          :to="slide.to"
          class="block w-full h-full"
          :aria-label="slide.alt"
        >
          <img
            :src="slide.image"
            :alt="slide.alt"
            :width="slide.width"
            :height="slide.height"
            class="w-full h-full object-contain"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            decoding="async"
          >
        </NuxtLink>
      </div>

      <button
        type="button"
        class="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-8 sm:size-10 rounded-full bg-black/25 text-white flex items-center justify-center hover:bg-black/40 transition-colors"
        aria-label="Slide sebelumnya"
        @click="prev"
      >
        <UIcon
          name="i-lucide-chevron-left"
          class="size-5 sm:size-6"
        />
      </button>
      <button
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-8 sm:size-10 rounded-full bg-black/25 text-white flex items-center justify-center hover:bg-black/40 transition-colors"
        aria-label="Slide berikutnya"
        @click="next"
      >
        <UIcon
          name="i-lucide-chevron-right"
          class="size-5 sm:size-6"
        />
      </button>

      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        <button
          v-for="(_, index) in slides"
          :key="index"
          type="button"
          class="h-2 rounded-full transition-all duration-300 shadow-sm"
          :class="index === current ? 'w-8 bg-white' : 'w-2 bg-white/70'"
          :aria-label="`Slide ${index + 1}`"
          @click="goTo(index)"
        />
      </div>
    </div>
  </section>
</template>
