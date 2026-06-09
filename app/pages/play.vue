<script setup lang="ts">
const showGameModal = useState('show-game-modal', () => false)
onMounted(async () => {
  showGameModal.value = true
  await navigateTo('/')
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-extrabold text-neutral-900 flex items-center gap-2">
          <span>🐈</span> Feline Frenzy <span class="text-sm font-semibold px-2.5 py-0.5 bg-brand-100 text-brand-700 rounded-full">Mini-Game</span>
        </h1>
        <p class="text-neutral-600 mt-1">
          Bantu si Kucing membasmi tikus nakal di rumah dan kumpulkan Catnip!
        </p>
      </div>
      
      <UButton
        to="/account"
        variant="outline"
        color="neutral"
        icon="i-lucide-arrow-left"
        class="self-start md:self-auto rounded-full"
      >
        Kembali ke Akun
      </UButton>
    </div>

    <!-- Game Container with Premium Layout (Full Width 720p) -->
    <div class="bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 p-4 mb-8">
      <!-- Responsive Iframe Container -->
      <div class="w-full h-[720px] rounded-2xl overflow-hidden bg-[#0f172a] border border-neutral-700">
        <iframe
          src="/feline-frenzy.html?v=720p"
          class="w-full h-full border-none"
          allow="autoplay"
        />
      </div>
    </div>

    <!-- Instructions & Details Card (Grid underneath) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
        <h2 class="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <UIcon name="i-lucide-gamepad" class="text-brand-500 size-5" />
          Cara Bermain
        </h2>
        <ul class="space-y-4 text-sm text-neutral-700">
          <li class="flex gap-3">
            <span class="flex-shrink-0 size-6 bg-brand-50 text-brand-600 font-bold rounded-full flex items-center justify-center">1</span>
            <span>Gunakan tombol <kbd class="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded font-mono text-xs">W</kbd> <kbd class="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded font-mono text-xs">A</kbd> <kbd class="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded font-mono text-xs">S</kbd> <kbd class="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded font-mono text-xs">D</kbd> atau tombol <span class="font-semibold text-brand-600">Arah</span> untuk menggerakkan kucing.</span>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 size-6 bg-brand-50 text-brand-600 font-bold rounded-full flex items-center justify-center">2</span>
            <span>Kucing akan otomatis menembakkan bola benang ke tikus terdekat.</span>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 size-6 bg-brand-50 text-brand-600 font-bold rounded-full flex items-center justify-center">3</span>
            <span>Kumpulkan bulatan hijau (Catnip) untuk meningkatkan level dan memperkuat senjata bola benang Anda!</span>
          </li>
        </ul>
      </div>

      <div class="bg-brand-50 border border-brand-100 rounded-3xl p-6 flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-brand-900 flex items-center gap-1.5 mb-2 text-lg">
            <UIcon name="i-lucide-award" class="size-5" />
            Fun Fact
          </h3>
          <p class="text-brand-800 leading-relaxed text-sm">
            Game ini terinspirasi dari maskot kucing oranye resmi BelanjaPedia yang super lucu dan bersemangat! Mainkan kapan saja untuk menyegarkan pikiran Anda.
          </p>
        </div>
        <div class="mt-4 pt-4 border-t border-brand-200/50 text-xs text-brand-700 flex items-center gap-2">
          <UIcon name="i-lucide-info" class="size-4" />
          <span>Tips: Klik area game terlebih dahulu agar tombol navigasi keyboard Anda dapat berfungsi mendeteksi gerakan kucing.</span>
        </div>
      </div>
    </div>
  </div>
</template>
