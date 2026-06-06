<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const minVal = computed(() => props.min ?? 1)
const maxVal = computed(() => props.max ?? 99)

function decrease() {
  if (props.modelValue > minVal.value) {
    emit('update:modelValue', props.modelValue - 1)
  }
}

function increase() {
  if (props.modelValue < maxVal.value) {
    emit('update:modelValue', props.modelValue + 1)
  }
}
</script>

<template>
  <div class="inline-flex items-center border-2 border-neutral-200 rounded-full overflow-hidden">
    <button
      type="button"
      class="p-3 hover:bg-neutral-100 transition-colors disabled:opacity-40"
      :disabled="modelValue <= minVal"
      @click="decrease"
    >
      <UIcon
        name="i-lucide-minus"
        class="size-4"
      />
    </button>
    <span class="w-12 text-center font-bold text-sm">{{ modelValue }}</span>
    <button
      type="button"
      class="p-3 hover:bg-neutral-100 transition-colors disabled:opacity-40"
      :disabled="modelValue >= maxVal"
      @click="increase"
    >
      <UIcon
        name="i-lucide-plus"
        class="size-4"
      />
    </button>
  </div>
</template>
