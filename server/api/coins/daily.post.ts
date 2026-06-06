import {
  canClaimDailyReward,
  DAILY_LOGIN_REWARD,
  getDailyDateKey
} from '#shared/utils/coin'
import { CoinTransactionType } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id

  if (!userId || !session.user) {
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
      id: true,
      name: true,
      email: true,
      phone: true,
      coins: true,
      role: true,
      lastDailyCoinAt: true
    }
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      data: apiError('Pengguna tidak ditemukan')
    })
  }

  if (!canClaimDailyReward(user.lastDailyCoinAt)) {
    throw createError({
      statusCode: 409,
      data: apiError('Daily login reward hari ini sudah diklaim')
    })
  }

  const now = new Date()

  const updatedUser = await prisma.$transaction(async (tx) => {
    const nextUser = await tx.user.update({
      where: { id: userId },
      data: {
        coins: { increment: DAILY_LOGIN_REWARD },
        lastDailyCoinAt: now
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        coins: true,
        role: true
      }
    })

    await tx.coinTransaction.create({
      data: {
        userId,
        amount: DAILY_LOGIN_REWARD,
        type: CoinTransactionType.DAILY_LOGIN,
        reference: getDailyDateKey(now)
      }
    })

    return nextUser
  })

  const sessionUser = mapUserToSession(updatedUser)

  await replaceUserSession(event, {
    user: sessionUser,
    loggedInAt: session.loggedInAt ?? now
  })

  return apiSuccess({
    balance: updatedUser.coins,
    reward: DAILY_LOGIN_REWARD,
    canClaim: false
  }, `Berhasil klaim ${DAILY_LOGIN_REWARD} coin!`)
})
