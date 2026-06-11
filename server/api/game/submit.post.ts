import { z } from 'zod'
import {
  buildGameRewardTransaction,
  calcGameRewardCoins,
  parseGameTimeToSeconds
} from '#shared/utils/game'

const submitSchema = z.object({
  score: z.number().int().min(0),
  level: z.number().int().min(1),
  time: z.string(),
  kills: z.number().int().min(0)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validation = submitSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      data: apiError('Data submit game tidak valid')
    })
  }

  const { score, level, time, kills } = validation.data
  const session = await getUserSession(event)
  const loggedIn = !!session.user
  const userId = session.user?.id
  const timeInSecs = parseGameTimeToSeconds(time)
  const earnedCoins = calcGameRewardCoins(loggedIn, userId, score)

  let newBalance = 0
  let updatedSessionUser: ReturnType<typeof mapUserToSession> | null = null

  const newScore = await prisma.$transaction(async (tx) => {
    const gameScore = await tx.gameScore.create({
      data: {
        userId: loggedIn && userId ? userId : null,
        name: session.user?.name || 'Guest Player',
        score,
        level,
        time,
        timeInSecs,
        kills
      }
    })

    if (loggedIn && userId) {
      const dbUser = await tx.user.findFirst({
        where: { id: userId, deletedAt: null },
        select: { coins: true }
      })

      if (!dbUser) {
        newBalance = 0
        return gameScore
      }

      if (earnedCoins > 0) {
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            coins: { increment: earnedCoins }
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

        const rewardTransaction = buildGameRewardTransaction(userId, earnedCoins, gameScore.id)
        if (rewardTransaction) {
          await tx.coinTransaction.create({ data: rewardTransaction })
        }

        newBalance = updatedUser.coins
        updatedSessionUser = mapUserToSession(updatedUser)
      } else {
        newBalance = dbUser.coins
      }
    }

    return gameScore
  })

  if (updatedSessionUser) {
    await replaceUserSession(event, {
      user: updatedSessionUser,
      loggedInAt: session.loggedInAt ?? new Date()
    })
  }

  const leaderboard = await prisma.gameScore.findMany({
    take: 7,
    orderBy: [
      { score: 'desc' },
      { timeInSecs: 'desc' }
    ],
    select: {
      name: true,
      score: true,
      level: true,
      time: true,
      kills: true,
      userId: true
    }
  })

  return apiSuccess({
    score,
    earnedCoins,
    newBalance,
    loggedIn,
    gameScoreId: newScore.id,
    leaderboard
  }, earnedCoins > 0
    ? `Skor dikirim! Selamat, Anda mendapatkan +${earnedCoins} koin BelanjaPedia!`
    : 'Skor berhasil dikirim ke database!'
  )
})
