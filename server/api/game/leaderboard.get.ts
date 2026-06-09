import fs from 'node:fs/promises'
import path from 'node:path'

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
  const dataDir = path.join(process.cwd(), 'server/data')
  const filePath = path.join(dataDir, 'leaderboard.json')

  try {
    const data = await fs.readFile(filePath, 'utf-8')
    const leaderboard: LeaderboardEntry[] = JSON.parse(data)
    
    // Sort just in case
    leaderboard.sort((a, b) => b.score - a.score)
    
    return apiSuccess({ leaderboard: leaderboard.slice(0, 10) })
  } catch (error) {
    // If file doesn't exist, return empty array
    return apiSuccess({ leaderboard: [] })
  }
})
