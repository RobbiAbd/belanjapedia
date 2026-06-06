import {
  canClaimDailyReward,
  DAILY_LOGIN_REWARD
} from '#shared/utils/coin'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      data: apiError('Sesi tidak valid')
    })
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null
    },
    select: {
      coins: true,
      lastDailyCoinAt: true
    }
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      data: apiError('Pengguna tidak ditemukan')
    })
  }

  const canClaim = canClaimDailyReward(user.lastDailyCoinAt)

  return apiSuccess({
    balance: user.coins,
    canClaim,
    dailyReward: DAILY_LOGIN_REWARD,
    coinValue: '1 coin = Rp1'
  }, 'Status coin berhasil diambil')
})
