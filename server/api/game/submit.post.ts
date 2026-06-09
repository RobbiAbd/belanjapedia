import fs from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import { calcEarnedCoins } from '#shared/utils/game'

const submitSchema = z.object({
  score: z.number().int().min(0),
  level: z.number().int().min(1),
  time: z.string(),
  kills: z.number().int().min(0)
})

interface LeaderboardEntry {
  userId?: number
  name: string
  score: number
  level: number
  time: string
  kills: number
  date: string
}

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

  let earnedCoins = 0
  let newBalance = 0

  // 1. If user is logged in, calculate and award coins
  if (loggedIn && userId) {
    // Reward calculation: 1 coin per 50 game points, maximum 50 coins per play session
    earnedCoins = calcEarnedCoins(score)

    if (earnedCoins > 0) {
      const dbUser = await prisma.user.findFirst({
        where: { id: userId, deletedAt: null }
      })

      if (dbUser) {
        const updatedUser = await prisma.user.update({
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

        newBalance = updatedUser.coins

        // Update the active session
        const sessionUser = mapUserToSession(updatedUser)
        await replaceUserSession(event, {
          user: sessionUser,
          loggedInAt: session.loggedInAt ?? new Date()
        })
      }
    } else {
      const dbUser = await prisma.user.findFirst({
        where: { id: userId, deletedAt: null },
        select: { coins: true }
      })
      newBalance = dbUser?.coins ?? 0
    }
  }

  // 2. Save to global leaderboard JSON
  const dataDir = path.join(process.cwd(), 'server/data')
  const filePath = path.join(dataDir, 'leaderboard.json')

  // Ensure directory exists
  await fs.mkdir(dataDir, { recursive: true })

  let leaderboard: LeaderboardEntry[] = []
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    leaderboard = JSON.parse(data)
  } catch (error) {
    // File doesn't exist yet, start with empty array
  }

  // Create new entry
  const newEntry: LeaderboardEntry = {
    userId,
    name: session.user?.name || 'Guest Player',
    score,
    level,
    time,
    kills,
    date: new Date().toISOString()
  }

  leaderboard.push(newEntry)
  leaderboard.sort((a, b) => b.score - a.score)
  leaderboard = leaderboard.slice(0, 10) // Keep top 10

  await fs.writeFile(filePath, JSON.stringify(leaderboard, null, 2), 'utf-8')

  return apiSuccess({
    score,
    earnedCoins,
    newBalance,
    loggedIn,
    leaderboard
  }, earnedCoins > 0 
    ? `Skor dikirim! Selamat, Anda mendapatkan +${earnedCoins} koin BelanjaPedia!` 
    : 'Skor berhasil dikirim ke leaderboard!'
  )
})
