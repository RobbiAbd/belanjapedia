<script setup lang="ts">
import { formatCoins } from '#shared/utils/coin'

const open = defineModel<boolean>('open', { default: false })

defineProps<{
  reward: number
  balance: number
  claiming?: boolean
}>()

const emit = defineEmits<{
  claim: []
}>()
</script>

<template>
  <UModal
    v-model:open="open"
    title="Daily Login Reward!"
    :ui="{ content: 'sm:max-w-md' }"
  >
    <template #body>
      <div class="text-center py-2">
        <div class="text-6xl mb-4">
          🪙
        </div>
        <p class="text-lg font-semibold text-neutral-900 mb-2">
          Klaim {{ formatCoins(reward) }} hari ini!
        </p>
        <p class="text-sm text-neutral-600 mb-1">
          1 coin = Rp1 — kumpulkan dan pakai saat checkout.
        </p>
        <p class="text-sm text-brand-600 font-medium">
          Saldo saat ini: {{ formatCoins(balance) }}
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full gap-3">
        <UButton
          variant="outline"
          color="neutral"
          class="flex-1 rounded-full"
          @click="open = false"
        >
          Nanti Saja
        </UButton>
        <UButton
          color="primary"
          class="flex-1 rounded-full font-semibold"
          :loading="claiming"
          icon="i-lucide-gift"
          @click="emit('claim')"
        >
          Klaim Sekarang
        </UButton>
      </div>
    </template>
  </UModal>
</template>
