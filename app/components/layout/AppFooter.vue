<script setup lang="ts">
const config = useRuntimeConfig()

const footerLinks = {
  about: [
    { label: 'Tentang Kami', to: '/tentang-kami' },
    { label: 'Karir', to: '/karir' },
    { label: 'Blog', to: '/blog' }
  ],
  support: [
    { label: 'Pusat Bantuan', to: '/bantuan' },
    { label: 'Cara Belanja', to: '/cara-belanja' },
    { label: 'Hubungi Kami', to: '/hubungi-kami' }
  ],
  legal: [
    { label: 'Syarat & Ketentuan', to: '/syarat-ketentuan' },
    { label: 'Kebijakan Privasi', to: '/kebijakan-privasi' },
    { label: 'Kebijakan Retur', to: '/kebijakan-retur' }
  ]
}
</script>

<template>
  <footer class="bg-neutral-100 border-t border-neutral-200 text-neutral-600 py-12">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div class="col-span-2 md:col-span-1">
          <NuxtLink
            to="/"
            class="inline-block mb-4"
          >
            <AppLogo
              variant="horizontal"
              :height="32"
            />
          </NuxtLink>
          <p class="text-sm text-neutral-500">
            Modern e-commerce for everyone. Belanja mudah, aman, dan menyenangkan.
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-neutral-900 mb-4">
            Tentang
          </h4>
          <ul class="space-y-2 text-sm">
            <li
              v-for="link in footerLinks.about"
              :key="link.label"
            >
              <NuxtLink
                :to="link.to"
                class="hover:text-brand-600 transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-neutral-900 mb-4">
            Bantuan
          </h4>
          <ul class="space-y-2 text-sm">
            <li
              v-for="link in footerLinks.support"
              :key="link.label"
            >
              <NuxtLink
                :to="link.to"
                class="hover:text-brand-600 transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-neutral-900 mb-4">
            Legal
          </h4>
          <ul class="space-y-2 text-sm">
            <li
              v-for="link in footerLinks.legal"
              :key="link.label"
            >
              <NuxtLink
                :to="link.to"
                class="hover:text-brand-600 transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-neutral-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
        <p>&copy; {{ new Date().getFullYear() }} {{ config.public.appName }}. Semua hak dilindungi.</p>
        <div class="flex gap-4">
          <a
            href="#"
            class="hover:text-brand-600 transition-colors"
            aria-label="Instagram"
          >
            <UIcon
              name="i-simple-icons-instagram"
              class="size-5"
            />
          </a>
          <a
            href="#"
            class="hover:text-brand-600 transition-colors"
            aria-label="Twitter"
          >
            <UIcon
              name="i-simple-icons-x"
              class="size-5"
            />
          </a>
          <a
            href="#"
            class="hover:text-brand-600 transition-colors"
            aria-label="Facebook"
          >
            <UIcon
              name="i-simple-icons-facebook"
              class="size-5"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
