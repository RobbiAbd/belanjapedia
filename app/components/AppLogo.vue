<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'horizontal' | 'vertical' | 'icon'
  height?: number
}>(), {
  variant: 'horizontal',
  height: 40
})

const sources = {
  horizontal: '/images/belanjapedia_secondary.png',
  vertical: '/images/belanjapedia_primary.png',
  icon: '/images/belanjapedia_icon.png'
}
</script>

<template>
  <img
    :src="sources[variant]"
    alt="BelanjaPedia"
    :style="{ height: `${height}px` }"
    class="w-auto object-contain"
  >
</template>
