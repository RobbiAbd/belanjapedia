import { DAILY_LOGIN_REWARD } from '#shared/utils/coin'

export function useCoins() {
  const { loggedIn, ready } = useUserSession()

  const balance = useState('coin-balance', () => 0)
  const canClaimDaily = useState('coin-can-claim-daily', () => false)
  const dailyReward = useState('coin-daily-reward', () => DAILY_LOGIN_REWARD)
  const loading = useState('coin-loading', () => false)
  const claiming = useState('coin-claiming', () => false)

  async function fetchStatus() {
    if (!loggedIn.value) {
      balance.value = 0
      canClaimDaily.value = false
      return
    }

    loading.value = true

    try {
      const response = await $fetch<{
        success: boolean
        data: {
          balance: number
          canClaim: boolean
          dailyReward: number
        }
      }>('/api/coins/daily')

      balance.value = response.data.balance
      canClaimDaily.value = response.data.canClaim
      dailyReward.value = response.data.dailyReward
    } finally {
      loading.value = false
    }
  }

  async function claimDaily() {
    claiming.value = true

    try {
      const response = await $fetch<{
        success: boolean
        data: {
          balance: number
          reward: number
          canClaim: boolean
        }
      }>('/api/coins/daily', { method: 'POST' })

      balance.value = response.data.balance
      canClaimDaily.value = response.data.canClaim

      return response.data
    } finally {
      claiming.value = false
    }
  }

  if (import.meta.client) {
    watch([loggedIn, ready], ([isLoggedIn, isReady]) => {
      if (!isReady) return
      if (isLoggedIn) {
        fetchStatus()
      } else {
        balance.value = 0
        canClaimDaily.value = false
      }
    }, { immediate: true })
  }

  return {
    balance,
    canClaimDaily,
    dailyReward,
    loading,
    claiming,
    fetchStatus,
    claimDaily
  }
}
