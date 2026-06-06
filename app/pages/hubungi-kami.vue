<script setup lang="ts">
useSeoMeta({
  title: 'Hubungi Kami',
  description: 'Hubungi tim BelanjaPedia untuk pertanyaan, saran, atau kendala pesanan.'
})

const contacts = [
  { icon: 'i-lucide-mail', label: 'Email', value: 'support@belanjapedia.com' },
  { icon: 'i-lucide-phone', label: 'Telepon', value: '+62 812-3456-7890' },
  { icon: 'i-lucide-clock', label: 'Jam Operasional', value: 'Senin – Minggu, 08.00 – 22.00 WIB' },
  { icon: 'i-lucide-map-pin', label: 'Alamat', value: 'Jakarta, Indonesia' }
]
</script>

<template>
  <LayoutInfoPage
    title="Hubungi Kami"
    description="Tim BelanjaPedia siap membantu kamu. Jangan ragu untuk menghubungi kami."
  >
    <div class="grid sm:grid-cols-2 gap-4 not-prose mb-8">
      <UCard
        v-for="item in contacts"
        :key="item.label"
      >
        <div class="flex items-start gap-3">
          <UIcon
            :name="item.icon"
            class="size-5 text-brand-600 mt-0.5"
          />
          <div>
            <p class="text-sm font-semibold text-neutral-900">
              {{ item.label }}
            </p>
            <p class="text-sm text-neutral-600">
              {{ item.value }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <UCard>
      <h2 class="text-lg font-bold text-neutral-900 mb-4">
        Kirim Pesan
      </h2>
      <form
        class="space-y-4"
        @submit.prevent
      >
        <UFormField label="Nama Lengkap">
          <UInput
            placeholder="Nama kamu"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Email">
          <UInput
            type="email"
            placeholder="email@contoh.com"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Subjek">
          <UInput
            placeholder="Topik pesan"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Pesan">
          <UTextarea
            placeholder="Tulis pesanmu di sini..."
            :rows="4"
            class="w-full"
          />
        </UFormField>
        <UButton
          color="primary"
          class="rounded-full"
          type="submit"
        >
          Kirim Pesan
        </UButton>
      </form>
    </UCard>
  </LayoutInfoPage>
</template>
