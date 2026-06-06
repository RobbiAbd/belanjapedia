<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 lg:py-12">
    <nav class="text-sm text-neutral-600 mb-6 flex items-center gap-2 flex-wrap">
      <NuxtLink
        to="/"
        class="hover:text-brand-600 transition-colors"
      >
        Beranda
      </NuxtLink>
      <span>/</span>
      <span class="text-neutral-900 font-medium">{{ title }}</span>
    </nav>

    <div class="max-w-3xl">
      <h1 class="text-3xl lg:text-4xl font-bold text-neutral-900 mb-3">
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="text-lg text-neutral-600 mb-8"
      >
        {{ description }}
      </p>

      <div class="prose prose-neutral max-w-none text-neutral-700 space-y-4">
        <slot />
      </div>
    </div>
  </div>
</template>
