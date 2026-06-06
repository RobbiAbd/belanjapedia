<script setup lang="ts">
import type { ProductReviewItem } from '#shared/utils/review'
import { formatRatingLabel } from '#shared/utils/review'

const props = defineProps<{
  slug: string
}>()

const { loggedIn } = useUserSession()
const toast = useToast()

type ReviewsResponse = {
  success: boolean
  data: {
    stats: { rating: number, reviewCount: number }
    reviews: ProductReviewItem[]
    myReview: ProductReviewItem | null
    canReview: boolean
    pagination: { page: number, totalPages: number }
  }
}

const page = ref(1)
const loading = ref(true)
const submitting = ref(false)
const stats = ref({ rating: 0, reviewCount: 0 })
const reviews = ref<ProductReviewItem[]>([])
const myReview = ref<ProductReviewItem | null>(null)
const canReview = ref(false)
const totalPages = ref(1)

const form = reactive({
  rating: 5,
  comment: ''
})

const errors = reactive<Record<string, string>>({})

async function fetchReviews() {
  loading.value = true

  try {
    const response = await $fetch<ReviewsResponse>(`/api/products/${props.slug}/reviews`, {
      query: { page: page.value, limit: 10 }
    })

    stats.value = response.data.stats
    reviews.value = response.data.reviews
    myReview.value = response.data.myReview
    canReview.value = response.data.canReview
    totalPages.value = response.data.pagination.totalPages

    if (myReview.value) {
      form.rating = myReview.value.rating
      form.comment = myReview.value.comment ?? ''
    }
  } catch {
    reviews.value = []
  } finally {
    loading.value = false
  }
}

watch(page, fetchReviews)

onMounted(fetchReviews)

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => index < rating)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium'
  }).format(new Date(value))
}

async function handleSubmit() {
  if (!loggedIn.value) {
    await navigateTo({
      path: '/login',
      query: { redirect: useRoute().fullPath }
    })
    return
  }

  submitting.value = true
  Object.keys(errors).forEach(key => delete errors[key])

  try {
    const response = await $fetch<{
      success: boolean
      data: {
        review: ProductReviewItem
        stats: { rating: number, reviewCount: number }
      }
    }>(`/api/products/${props.slug}/reviews`, {
      method: 'POST',
      body: {
        rating: form.rating,
        comment: form.comment.trim() || undefined
      }
    })

    stats.value = response.data.stats
    myReview.value = response.data.review
    canReview.value = false
    page.value = 1
    await fetchReviews()

    toast.add({
      title: 'Ulasan disimpan',
      color: 'success',
      icon: 'i-lucide-star'
    })
  } catch (error: unknown) {
    const fetchError = error as {
      data?: { message?: string, errors?: Record<string, string> }
      statusCode?: number
    }

    Object.assign(errors, fetchError.data?.errors ?? {})

    toast.add({
      title: 'Gagal menyimpan ulasan',
      description: fetchError.data?.message ?? 'Coba lagi dalam beberapa saat.',
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="mt-12 bg-white rounded-2xl shadow-sm p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold text-neutral-900">
          Ulasan Pembeli
        </h2>
        <p class="text-sm text-neutral-600 mt-1">
          {{ stats.reviewCount }} ulasan
        </p>
      </div>

      <div
        v-if="stats.reviewCount > 0"
        class="flex items-center gap-2"
      >
        <UIcon
          name="i-lucide-star"
          class="size-6 text-yellow-400 fill-yellow-400"
        />
        <span class="text-2xl font-bold text-neutral-900">{{ formatRatingLabel(stats.rating) }}</span>
        <span class="text-sm text-neutral-500">/ 5</span>
      </div>
    </div>

    <div
      v-if="loggedIn && (canReview || myReview)"
      class="mb-8 p-4 lg:p-5 bg-neutral-50 rounded-xl border border-neutral-200"
    >
      <h3 class="font-semibold text-neutral-900 mb-4">
        {{ myReview ? 'Ulasan Kamu' : 'Tulis Ulasan' }}
      </h3>

      <div class="space-y-4">
        <div>
          <p class="text-sm font-medium text-neutral-700 mb-2">
            Rating
          </p>
          <div class="flex gap-1">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="p-1 transition-colors"
              :aria-label="`${star} bintang`"
              @click="form.rating = star"
            >
              <UIcon
                name="i-lucide-star"
                class="size-7"
                :class="star <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300'"
              />
            </button>
          </div>
          <p
            v-if="errors.rating"
            class="text-sm text-red-600 mt-1"
          >
            {{ errors.rating }}
          </p>
        </div>

        <UFormField
          label="Komentar (opsional)"
          :error="errors.comment"
        >
          <UTextarea
            v-model="form.comment"
            :rows="3"
            placeholder="Bagikan pengalamanmu dengan produk ini..."
            class="w-full"
          />
        </UFormField>

        <UButton
          color="primary"
          class="rounded-full font-semibold"
          icon="i-lucide-send"
          :loading="submitting"
          @click="handleSubmit"
        >
          {{ myReview ? 'Perbarui Ulasan' : 'Kirim Ulasan' }}
        </UButton>
      </div>
    </div>

    <div
      v-else-if="!loggedIn"
      class="mb-8 p-4 bg-brand-50 rounded-xl text-sm text-neutral-700"
    >
      <NuxtLink
        to="/login"
        class="font-semibold text-brand-600 hover:underline"
      >
        Masuk
      </NuxtLink>
      untuk menulis ulasan setelah pesanan selesai.
    </div>

    <div
      v-else-if="loggedIn && !canReview && !myReview"
      class="mb-8 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-600"
    >
      Belum bisa memberi ulasan. Selesaikan pembelian produk ini terlebih dahulu (status pesanan: delivered).
    </div>

    <div
      v-if="loading"
      class="text-sm text-neutral-500 py-6"
    >
      Memuat ulasan...
    </div>

    <div
      v-else-if="reviews.length === 0"
      class="text-sm text-neutral-600 py-6"
    >
      Belum ada ulasan untuk produk ini.
    </div>

    <div
      v-else
      class="divide-y divide-neutral-100"
    >
      <article
        v-for="review in reviews"
        :key="review.id"
        class="py-5 first:pt-0"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-semibold text-neutral-900">
              {{ review.userName }}
            </p>
            <p class="text-xs text-neutral-500 mt-1">
              {{ formatDate(review.createdAt) }}
            </p>
          </div>
          <div class="flex gap-0.5 shrink-0">
            <UIcon
              v-for="(filled, index) in renderStars(review.rating)"
              :key="index"
              name="i-lucide-star"
              class="size-4"
              :class="filled ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300'"
            />
          </div>
        </div>
        <p
          v-if="review.comment"
          class="text-sm text-neutral-700 mt-3 leading-relaxed"
        >
          {{ review.comment }}
        </p>
      </article>
    </div>

    <div
      v-if="totalPages > 1"
      class="flex justify-center gap-2 mt-6 pt-4 border-t border-neutral-100"
    >
      <UButton
        variant="outline"
        class="rounded-full"
        :disabled="page <= 1"
        @click="page--"
      >
        Sebelumnya
      </UButton>
      <span class="text-sm text-neutral-600 self-center">
        {{ page }} / {{ totalPages }}
      </span>
      <UButton
        variant="outline"
        class="rounded-full"
        :disabled="page >= totalPages"
        @click="page++"
      >
        Berikutnya
      </UButton>
    </div>
  </section>
</template>
