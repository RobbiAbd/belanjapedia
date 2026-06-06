<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

useSeoMeta({ title: 'Daftar' })

const route = useRoute()
const { fetch: refreshSession } = useUserSession()
const toast = useToast()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const loading = ref(false)
const formError = ref('')
const fieldErrors = ref<Record<string, string>>({})

async function handleSubmit() {
  loading.value = true
  formError.value = ''
  fieldErrors.value = {}

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        phone: phone.value || undefined,
        password: password.value
      }
    })

    await refreshSession()

    toast.add({
      title: 'Registrasi berhasil',
      description: 'Akun Anda telah dibuat. Selamat berbelanja!',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await navigateTo(redirect)
  } catch (error: unknown) {
    const fetchError = error as {
      data?: { message?: string, errors?: Record<string, string> }
    }

    formError.value = fetchError.data?.message ?? 'Registrasi gagal. Coba lagi.'
    fieldErrors.value = fetchError.data?.errors ?? {}
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto px-4 py-12 lg:py-20">
    <div class="flex justify-center mb-6">
      <AppLogo
        variant="vertical"
        :height="80"
      />
    </div>

    <div class="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
      <h1 class="text-2xl font-bold text-neutral-900 mb-2 text-center">
        Daftar
      </h1>
      <p class="text-neutral-600 text-sm text-center mb-6">
        Buat akun baru untuk mulai berbelanja di BelanjaPedia
      </p>

      <UAlert
        v-if="formError"
        color="error"
        variant="subtle"
        :title="formError"
        class="mb-4"
      />

      <form
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <UFormField
          label="Nama Lengkap"
          required
          :error="fieldErrors.name"
        >
          <UInput
            v-model="name"
            placeholder="Nama lengkap"
            autocomplete="name"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Email"
          required
          :error="fieldErrors.email"
        >
          <UInput
            v-model="email"
            type="email"
            placeholder="nama@email.com"
            autocomplete="email"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Nomor Telepon"
          :error="fieldErrors.phone"
        >
          <UInput
            v-model="phone"
            placeholder="08xxxxxxxxxx"
            autocomplete="tel"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Password"
          required
          :error="fieldErrors.password"
        >
          <UInput
            v-model="password"
            type="password"
            placeholder="Minimal 6 karakter"
            autocomplete="new-password"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          color="primary"
          block
          size="lg"
          class="rounded-full font-semibold mt-2"
          :loading="loading"
        >
          Daftar
        </UButton>
      </form>

      <p class="text-center text-sm text-neutral-600 mt-6">
        Sudah punya akun?
        <NuxtLink
          :to="{ path: '/login', query: route.query }"
          class="text-brand-600 font-medium hover:underline"
        >
          Masuk di sini
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
