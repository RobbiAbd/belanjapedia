<script setup lang="ts">
const props = defineProps<{
  currentStep: number
}>()

const steps = [
  { label: 'Pengiriman', icon: 'i-lucide-truck' },
  { label: 'Pembayaran', icon: 'i-lucide-credit-card' },
  { label: 'Review', icon: 'i-lucide-clipboard-check' }
]
</script>

<template>
  <div class="max-w-3xl mx-auto mb-12">
    <div class="flex items-center justify-between">
      <template
        v-for="(step, index) in steps"
        :key="step.label"
      >
        <div class="flex flex-col items-center gap-2">
          <div
            class="size-12 rounded-full flex items-center justify-center transition-all"
            :class="index <= currentStep
              ? 'bg-brand-600 text-white scale-110'
              : 'bg-neutral-200 text-neutral-400'"
          >
            <UIcon
              :name="step.icon"
              class="size-6"
            />
          </div>
          <span
            class="text-sm font-medium"
            :class="index <= currentStep ? 'text-neutral-900' : 'text-neutral-400'"
          >
            {{ step.label }}
          </span>
        </div>

        <div
          v-if="index < steps.length - 1"
          class="flex-1 h-1 mx-2 rounded-full bg-neutral-200 overflow-hidden -mt-6"
        >
          <div
            class="h-full bg-brand-600 transition-all duration-500"
            :style="{ width: index < currentStep ? '100%' : '0%' }"
          />
        </div>
      </template>
    </div>
  </div>
</template>
