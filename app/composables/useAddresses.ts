import type { AddressInput, SavedAddress } from '#shared/utils/address'

export function useAddresses() {
  const addresses = useState<SavedAddress[]>('user-addresses', () => [])
  const loading = useState('addresses-loading', () => false)

  async function fetchAddresses() {
    loading.value = true

    try {
      const response = await $fetch<{
        success: boolean
        data: { addresses: SavedAddress[] }
      }>('/api/addresses')

      addresses.value = response.data.addresses
    } catch {
      addresses.value = []
    } finally {
      loading.value = false
    }
  }

  async function createAddress(input: AddressInput) {
    const response = await $fetch<{
      success: boolean
      data: { address: SavedAddress }
    }>('/api/addresses', {
      method: 'POST',
      body: input
    })

    await fetchAddresses()
    return response.data.address
  }

  async function updateAddress(id: number, input: AddressInput) {
    const response = await $fetch<{
      success: boolean
      data: { address: SavedAddress }
    }>(`/api/addresses/${id}`, {
      method: 'PUT',
      body: input
    })

    await fetchAddresses()
    return response.data.address
  }

  async function deleteAddress(id: number) {
    await $fetch(`/api/addresses/${id}`, { method: 'DELETE' })
    await fetchAddresses()
  }

  const defaultAddress = computed(() =>
    addresses.value.find(address => address.isDefault) ?? addresses.value[0] ?? null
  )

  return {
    addresses,
    loading,
    defaultAddress,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress
  }
}
