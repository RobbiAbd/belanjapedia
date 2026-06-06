<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Checkout',
  description: 'Selesaikan pesanan Anda di BelanjaPedia.'
})

import {
  calcMaxCoinsForOrder,
  calcOrderTotalAfterCoins,
  coinsToPriceUnits
} from '#shared/utils/coin'
import { addressToShippingForm } from '#shared/utils/address'
import {
  calcOrderTotal,
  calcShipping,
  calcTax,
  mapOrderApiErrors,
  validateShippingFields
} from '#shared/utils/order'

const { items, clearCart, subtotal } = useCart()
const { addresses, defaultAddress, fetchAddresses } = useAddresses()
const { user, fetch: refreshSession } = useUserSession()
const { balance, fetchStatus } = useCoins()
const { formatPrice } = useFormatPrice()
const router = useRouter()

const coinsToUse = ref(0)

const shipping = computed(() => calcShipping(items.value.length))
const tax = computed(() => calcTax(subtotal.value))
const grossTotal = computed(() => calcOrderTotal(subtotal.value, items.value.length))
const maxCoins = computed(() => calcMaxCoinsForOrder(grossTotal.value, balance.value))
const coinDiscount = computed(() => coinsToPriceUnits(coinsToUse.value))
const finalTotal = computed(() => calcOrderTotalAfterCoins(grossTotal.value, coinsToUse.value))

const currentStep = ref(0)
const processing = ref(false)
const progress = ref(0)

const addressMode = ref<'saved' | 'new'>('new')
const selectedAddressId = ref<number | null>(null)
const saveAddress = ref(false)
const addressLabel = ref('Rumah')

const form = reactive({
  name: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  paymentMethod: 'transfer'
})

const selectedAddress = computed(() =>
  addresses.value.find(address => address.id === selectedAddressId.value) ?? null
)

const reviewShipping = computed(() => {
  if (addressMode.value === 'saved' && selectedAddress.value) {
    return addressToShippingForm(selectedAddress.value)
  }

  return getShippingPayload()
})

const errors = reactive<Record<string, string>>({})
const formError = ref('')

watch(maxCoins, (max) => {
  if (coinsToUse.value > max) {
    coinsToUse.value = max
  }
})

onMounted(async () => {
  if (items.value.length === 0) {
    router.replace('/cart')
    return
  }

  fetchStatus()
  await fetchAddresses()

  if (defaultAddress.value) {
    addressMode.value = 'saved'
    selectedAddressId.value = defaultAddress.value.id
  }

  if (user.value) {
    if (!form.name) form.name = user.value.name
    if (!form.phone && user.value.phone) form.phone = user.value.phone
  }
})

function selectSavedAddress(id: number) {
  addressMode.value = 'saved'
  selectedAddressId.value = id
  clearErrors()
}

function useNewAddress() {
  addressMode.value = 'new'
  selectedAddressId.value = null
  clearErrors()
}

function useMaxCoins() {
  coinsToUse.value = maxCoins.value
}

function clearErrors() {
  Object.keys(errors).forEach(k => delete errors[k])
  formError.value = ''
}

function getShippingPayload() {
  return {
    name: form.name.trim(),
    phone: form.phone.trim(),
    address: form.address.trim(),
    city: form.city.trim(),
    province: form.province.trim(),
    postalCode: form.postalCode.trim()
  }
}

function applyShippingErrors(fieldErrors: Record<string, string>) {
  clearErrors()
  Object.assign(errors, fieldErrors)
  if (Object.keys(fieldErrors).length > 0) {
    currentStep.value = 0
    formError.value = 'Periksa kembali data alamat pengiriman.'
  }
}

function validateAddressStep(): boolean {
  if (addressMode.value === 'saved') {
    if (!selectedAddressId.value) {
      formError.value = 'Pilih alamat pengiriman.'
      errors.addressId = 'Pilih alamat pengiriman'
      return false
    }

    return true
  }

  const fieldErrors = validateShippingFields(getShippingPayload())
  Object.assign(errors, fieldErrors)

  if (Object.keys(fieldErrors).length > 0) {
    formError.value = 'Periksa kembali data alamat pengiriman.'
    return false
  }

  return true
}

function validateStep(): boolean {
  clearErrors()

  if (currentStep.value === 0 && !validateAddressStep()) {
    return false
  }

  return Object.keys(errors).length === 0
}

function validateAllBeforeSubmit(): boolean {
  clearErrors()

  if (!validateAddressStep()) {
    currentStep.value = 0
    return false
  }

  return true
}

function nextStep() {
  if (!validateStep()) return
  if (currentStep.value < 2) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) currentStep.value--
}

async function submitOrder() {
  if (!validateAllBeforeSubmit()) return

  processing.value = true
  progress.value = 10
  const toast = useToast()

  const interval = setInterval(() => {
    if (progress.value < 85) progress.value += 5
  }, 150)

  try {
    const orderBody: Record<string, unknown> = {
      paymentMethod: form.paymentMethod,
      items: items.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      coinsToUse: coinsToUse.value
    }

    if (addressMode.value === 'saved' && selectedAddressId.value) {
      orderBody.addressId = selectedAddressId.value
    } else {
      orderBody.shipping = getShippingPayload()
      orderBody.saveAddress = saveAddress.value
      if (saveAddress.value) {
        orderBody.addressLabel = addressLabel.value.trim() || 'Rumah'
      }
    }

    const response = await $fetch<{
      success: boolean
      message: string
      data: { order: { id: number, orderNumber: string } }
    }>('/api/orders', {
      method: 'POST',
      body: orderBody
    })

    progress.value = 100
    await clearCart()
    await refreshSession()
    await fetchStatus()

    toast.add({
      title: 'Pesanan berhasil!',
      description: `Nomor pesanan: ${response.data.order.orderNumber}`,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    await router.push(`/orders/${response.data.order.id}`)
  } catch (error: unknown) {
    const fetchError = error as {
      data?: { message?: string, errors?: Record<string, string> }
      response?: { _data?: { message?: string, errors?: Record<string, string> } }
    }

    const payload = fetchError.data ?? fetchError.response?._data
    const apiErrors = payload?.errors ?? {}
    const { shipping: shippingErrors, general } = mapOrderApiErrors(apiErrors)

    if (Object.keys(shippingErrors).length > 0) {
      applyShippingErrors(shippingErrors)
    } else {
      formError.value = payload?.message ?? 'Terjadi kesalahan. Coba lagi.'
    }

    const firstFieldError = Object.values(shippingErrors)[0] ?? Object.values(general)[0]
    const description = firstFieldError ?? payload?.message ?? 'Terjadi kesalahan. Coba lagi.'

    toast.add({
      title: 'Gagal membuat pesanan',
      description,
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    clearInterval(interval)
    processing.value = false
    progress.value = 0
  }
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
    <h1 class="text-3xl font-bold text-neutral-900 mb-2">
      Checkout
    </h1>
    <p class="text-neutral-600 mb-8">
      Lengkapi data untuk menyelesaikan pesanan
    </p>

    <CheckoutCheckoutSteps :current-step="currentStep" />

    <UAlert
      v-if="formError && !processing"
      color="error"
      variant="subtle"
      :title="formError"
      class="mb-6"
    />

    <div
      v-if="processing"
      class="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8 text-center"
    >
      <UIcon
        name="i-lucide-credit-card"
        class="size-12 text-brand-600 animate-spin mx-auto mb-4"
      />
      <h2 class="text-xl font-bold mb-4">
        Memproses pesanan Anda...
      </h2>
      <div class="h-2 bg-neutral-200 rounded-full overflow-hidden mb-2">
        <div
          class="h-full bg-brand-600 transition-all duration-300"
          :style="{ width: `${progress}%` }"
        />
      </div>
      <p class="text-sm text-neutral-600">
        {{ progress }}%
      </p>
    </div>

    <div
      v-else
      class="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div class="lg:col-span-2">
        <div
          v-if="currentStep === 0"
          class="bg-white rounded-2xl shadow-sm p-6"
        >
          <div class="flex items-center gap-3 mb-6">
            <UIcon
              name="i-lucide-truck"
              class="size-6 text-brand-600"
            />
            <h2 class="text-xl font-bold">
              Alamat Pengiriman
            </h2>
          </div>

          <div
            v-if="addresses.length > 0"
            class="space-y-3 mb-6"
          >
            <p class="text-sm font-medium text-neutral-700">
              Pilih alamat tersimpan atau isi alamat baru
            </p>

            <div class="space-y-2">
              <button
                v-for="address in addresses"
                :key="address.id"
                type="button"
                class="w-full text-left p-4 rounded-xl border transition-colors"
                :class="addressMode === 'saved' && selectedAddressId === address.id
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-neutral-200 hover:border-brand-300'"
                @click="selectSavedAddress(address.id)"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-semibold text-neutral-900">{{ address.label || 'Alamat' }}</span>
                  <UBadge
                    v-if="address.isDefault"
                    color="primary"
                    variant="subtle"
                    size="sm"
                  >
                    Utama
                  </UBadge>
                </div>
                <p class="text-sm text-neutral-700">
                  {{ address.recipient }} · {{ address.phone }}
                </p>
                <p class="text-sm text-neutral-600 mt-1">
                  {{ address.address }}, {{ address.city }}
                </p>
              </button>
            </div>

            <UButton
              variant="outline"
              class="rounded-full"
              :class="addressMode === 'new' ? 'border-brand-600 text-brand-700' : ''"
              @click="useNewAddress"
            >
              Gunakan alamat baru
            </UButton>

            <p
              v-if="errors.addressId"
              class="text-sm text-red-600"
            >
              {{ errors.addressId }}
            </p>
          </div>

          <div
            v-if="addressMode === 'new'"
            class="space-y-4"
          >
            <UFormField
              label="Nama Lengkap"
              required
              :error="errors.name"
            >
              <UInput
                v-model="form.name"
                placeholder="Nama penerima"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Nomor Telepon"
              required
              :error="errors.phone"
            >
              <UInput
                v-model="form.phone"
                placeholder="08xxxxxxxxxx"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Alamat Lengkap"
              required
              :error="errors.address"
            >
              <UTextarea
                v-model="form.address"
                placeholder="Jl. ..., No. ..., RT/RW"
                :rows="3"
                class="w-full"
              />
            </UFormField>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField
                label="Kota"
                required
                :error="errors.city"
              >
                <UInput
                  v-model="form.city"
                  placeholder="Jakarta"
                />
              </UFormField>
              <UFormField
                label="Provinsi"
                required
                :error="errors.province"
              >
                <UInput
                  v-model="form.province"
                  placeholder="DKI Jakarta"
                />
              </UFormField>
            </div>

            <UFormField
              label="Kode Pos"
              required
              :error="errors.postalCode"
            >
              <UInput
                v-model="form.postalCode"
                placeholder="12345"
                class="max-w-xs"
              />
            </UFormField>

            <div class="pt-2 space-y-3">
              <UCheckbox
                v-model="saveAddress"
                label="Simpan alamat ini untuk pesanan berikutnya"
              />
              <UFormField
                v-if="saveAddress"
                label="Label Alamat"
              >
                <UInput
                  v-model="addressLabel"
                  placeholder="Rumah, Kantor, dll."
                  class="max-w-xs"
                />
              </UFormField>
            </div>
          </div>
        </div>

        <div
          v-if="currentStep === 1"
          class="bg-white rounded-2xl shadow-sm p-6"
        >
          <div class="flex items-center gap-3 mb-6">
            <UIcon
              name="i-lucide-credit-card"
              class="size-6 text-brand-600"
            />
            <h2 class="text-xl font-bold">
              Metode Pembayaran
            </h2>
          </div>

          <URadioGroup
            v-model="form.paymentMethod"
            :items="[
              { label: 'Transfer Bank', value: 'transfer' },
              { label: 'E-Wallet', value: 'ewallet' },
              { label: 'COD (Bayar di Tempat)', value: 'cod' }
            ]"
          />

          <div class="mt-8 pt-6 border-t border-neutral-200">
            <div class="flex items-center gap-3 mb-4">
              <UIcon
                name="i-lucide-coins"
                class="size-6 text-brand-600"
              />
              <h3 class="text-lg font-bold">
                Pakai Coin
              </h3>
            </div>
            <p class="text-sm text-neutral-600 mb-4">
              Saldo: <strong>{{ balance.toLocaleString('id-ID') }} coin</strong> (1 coin = Rp1)
            </p>
            <div class="flex gap-2">
              <UInput
                v-model.number="coinsToUse"
                type="number"
                :min="0"
                :max="maxCoins"
                class="flex-1"
                placeholder="0"
              />
              <UButton
                variant="outline"
                color="primary"
                class="rounded-full shrink-0"
                :disabled="maxCoins === 0"
                @click="useMaxCoins"
              >
                Maks
              </UButton>
            </div>
            <p
              v-if="coinsToUse > 0"
              class="text-sm text-green-600 mt-2"
            >
              Diskon {{ formatPrice(coinDiscount) }} dari total pesanan
            </p>
          </div>
        </div>

        <div
          v-if="currentStep === 2"
          class="bg-white rounded-2xl shadow-sm p-6"
        >
          <div class="flex items-center gap-3 mb-6">
            <UIcon
              name="i-lucide-clipboard-check"
              class="size-6 text-brand-600"
            />
            <h2 class="text-xl font-bold">
              Review Pesanan
            </h2>
          </div>

          <div class="space-y-3">
            <div
              v-for="item in items"
              :key="`${item.productId}-${item.variant}`"
              class="flex justify-between text-sm"
            >
              <span class="text-neutral-700">{{ item.name }} × {{ item.quantity }}</span>
            </div>
          </div>

          <div class="mt-6 p-4 bg-brand-50 rounded-xl text-sm">
            <p><strong>Pengiriman ke:</strong> {{ reviewShipping.name }}, {{ reviewShipping.address }}, {{ reviewShipping.city }}</p>
            <p class="mt-1">
              <strong>Pembayaran:</strong> {{ form.paymentMethod === 'transfer' ? 'Transfer Bank' : form.paymentMethod === 'ewallet' ? 'E-Wallet' : 'COD' }}
            </p>
            <p
              v-if="coinsToUse > 0"
              class="mt-1"
            >
              <strong>Coin dipakai:</strong> {{ coinsToUse.toLocaleString('id-ID') }} coin ({{ formatPrice(coinDiscount) }})
            </p>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <UButton
            v-if="currentStep > 0"
            variant="outline"
            class="rounded-full"
            @click="prevStep"
          >
            Kembali
          </UButton>
          <UButton
            v-if="currentStep < 2"
            color="primary"
            class="flex-1 rounded-full font-semibold"
            @click="nextStep"
          >
            Lanjutkan
          </UButton>
          <UButton
            v-else
            color="success"
            class="flex-1 rounded-full font-semibold"
            icon="i-lucide-check"
            @click="submitOrder"
          >
            Buat Pesanan
          </UButton>
        </div>
      </div>

      <div>
        <aside class="bg-white rounded-2xl shadow-sm p-6 lg:sticky lg:top-24">
          <h2 class="text-xl font-bold text-neutral-900 mb-6">
            Ringkasan Pesanan
          </h2>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between font-semibold">
              <span>Subtotal ({{ items.length }} item)</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between font-semibold">
              <span>Ongkir</span>
              <span>{{ formatPrice(shipping) }}</span>
            </div>
            <div class="flex justify-between font-semibold">
              <span>Pajak (11%)</span>
              <span>{{ formatPrice(tax) }}</span>
            </div>
            <div
              v-if="coinsToUse > 0"
              class="flex justify-between font-semibold text-green-600"
            >
              <span>Diskon Coin</span>
              <span>-{{ formatPrice(coinDiscount) }}</span>
            </div>
          </div>

          <div class="border-t border-neutral-200 mt-4 pt-4 flex justify-between text-lg lg:text-2xl font-bold">
            <span>Total Bayar</span>
            <span class="text-brand-600">{{ formatPrice(finalTotal) }}</span>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
