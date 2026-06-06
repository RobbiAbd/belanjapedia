<script setup lang="ts">
import type { AddressInput } from '#shared/utils/address'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Alamat Tersimpan',
  description: 'Kelola alamat pengiriman BelanjaPedia Anda.'
})

const {
  addresses,
  loading,
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} = useAddresses()

const toast = useToast()
const editingId = ref<number | null>(null)
const saving = ref(false)
const deletingId = ref<number | null>(null)

const emptyForm = (): AddressInput => ({
  label: 'Rumah',
  recipient: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  isDefault: false
})

const form = reactive(emptyForm())
const errors = reactive<Record<string, string>>({})

onMounted(() => {
  fetchAddresses()
})

function resetForm() {
  Object.assign(form, emptyForm())
  editingId.value = null
  Object.keys(errors).forEach(key => delete errors[key])
}

function fillForm(address: typeof addresses.value[number]) {
  editingId.value = address.id
  form.label = address.label ?? 'Rumah'
  form.recipient = address.recipient
  form.phone = address.phone
  form.address = address.address
  form.city = address.city
  form.province = address.province
  form.postalCode = address.postalCode
  form.isDefault = address.isDefault
}

async function handleSubmit() {
  saving.value = true
  Object.keys(errors).forEach(key => delete errors[key])

  try {
    if (editingId.value) {
      await updateAddress(editingId.value, { ...form })
      toast.add({ title: 'Alamat diperbarui', color: 'success' })
    } else {
      await createAddress({ ...form })
      toast.add({ title: 'Alamat ditambahkan', color: 'success' })
    }

    resetForm()
  } catch (error: unknown) {
    const fetchError = error as {
      data?: { errors?: Record<string, string>, message?: string }
    }

    Object.assign(errors, fetchError.data?.errors ?? {})
    toast.add({
      title: 'Gagal menyimpan alamat',
      description: fetchError.data?.message ?? 'Periksa data yang diisi',
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}

async function handleDelete(id: number) {
  deletingId.value = id

  try {
    await deleteAddress(id)
    if (editingId.value === id) resetForm()
    toast.add({ title: 'Alamat dihapus', color: 'success' })
  } catch {
    toast.add({ title: 'Gagal menghapus alamat', color: 'error' })
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
    <div class="flex items-center gap-3 mb-8">
      <UButton
        to="/account"
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-left"
        class="rounded-full"
      />
      <h1 class="text-3xl font-bold text-neutral-900">
        Alamat Tersimpan
      </h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-4">
        <div
          v-if="loading"
          class="text-sm text-neutral-500"
        >
          Memuat alamat...
        </div>

        <div
          v-else-if="addresses.length === 0"
          class="bg-white rounded-2xl shadow-sm p-6 text-sm text-neutral-600"
        >
          Belum ada alamat tersimpan.
        </div>

        <div
          v-for="address in addresses"
          :key="address.id"
          class="bg-white rounded-2xl shadow-sm p-5"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-bold text-neutral-900">
                  {{ address.label || 'Alamat' }}
                </h3>
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
                {{ address.address }}, {{ address.city }}, {{ address.province }} {{ address.postalCode }}
              </p>
            </div>
            <div class="flex gap-2 shrink-0">
              <UButton
                variant="outline"
                size="sm"
                class="rounded-full"
                @click="fillForm(address)"
              >
                Edit
              </UButton>
              <UButton
                variant="outline"
                color="error"
                size="sm"
                class="rounded-full"
                :loading="deletingId === address.id"
                @click="handleDelete(address.id)"
              >
                Hapus
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-6 lg:sticky lg:top-24 h-fit">
        <h2 class="text-xl font-bold mb-6">
          {{ editingId ? 'Edit Alamat' : 'Tambah Alamat' }}
        </h2>

        <form
          class="space-y-4"
          @submit.prevent="handleSubmit"
        >
          <UFormField
            label="Label"
            :error="errors.label"
          >
            <UInput
              v-model="form.label"
              placeholder="Rumah, Kantor, dll."
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Nama Penerima"
            required
            :error="errors.recipient"
          >
            <UInput
              v-model="form.recipient"
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
              <UInput v-model="form.city" />
            </UFormField>
            <UFormField
              label="Provinsi"
              required
              :error="errors.province"
            >
              <UInput v-model="form.province" />
            </UFormField>
          </div>

          <UFormField
            label="Kode Pos"
            required
            :error="errors.postalCode"
          >
            <UInput
              v-model="form.postalCode"
              class="max-w-xs"
            />
          </UFormField>

          <UCheckbox
            v-model="form.isDefault"
            label="Jadikan alamat utama"
          />

          <div class="flex gap-3 pt-2">
            <UButton
              v-if="editingId"
              variant="outline"
              class="rounded-full"
              @click="resetForm"
            >
              Batal
            </UButton>
            <UButton
              type="submit"
              color="primary"
              class="rounded-full font-semibold"
              :loading="saving"
            >
              {{ editingId ? 'Simpan Perubahan' : 'Tambah Alamat' }}
            </UButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
