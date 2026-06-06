<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

useSeoMeta({ title: 'Masuk' })

const route = useRoute()
const { fetch: refreshSession } = useUserSession()
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)
const formError = ref('')
const fieldErrors = ref<Record<string, string>>({})

async function handleSubmit() {
  loading.value = true
  formError.value = ''
  fieldErrors.value = {}

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    await refreshSession()

    toast.add({
      title: 'Login berhasil',
      description: 'Selamat datang kembali di BelanjaPedia!',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await navigateTo(redirect)
  } catch (error: unknown) {
    const fetchError = error as {
      data?: { message?: string, errors?: Record<string, string> }
    }

    formError.value = fetchError.data?.message ?? 'Login gagal. Coba lagi.'
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
        Masuk
      </h1>
      <p class="text-neutral-600 text-sm text-center mb-6">
        Masuk ke akun BelanjaPedia untuk melanjutkan checkout
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
          label="Password"
          required
          :error="fieldErrors.password"
        >
          <UInput
            v-model="password"
            type="password"
            placeholder="Masukkan password"
            autocomplete="current-password"
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
          Masuk
        </UButton>
      </form>

      <p class="text-center text-sm text-neutral-600 mt-6">
        Belum punya akun?
        <NuxtLink
          :to="{ path: '/register', query: route.query }"
          class="text-brand-600 font-medium hover:underline"
        >
          Daftar sekarang
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
