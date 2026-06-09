export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const type = query.type || 'global'

  try {
    if (type === 'gameover') {
      // Query top 7 game scores for gameover screen
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
      return apiSuccess({ leaderboard })
    } else {
      // Global ranking: query all users, calculate achievements count, sort by coins & achievements
      const users = await prisma.user.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          name: true,
          coins: true,
          gameScores: {
            select: {
              kills: true,
              level: true,
              timeInSecs: true
            }
          }
        }
      })

      const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      }

      const leaderboard = users.map(user => {
        const scores = user.gameScores
        const maxKills = scores.length > 0 ? Math.max(...scores.map(s => s.kills)) : 0
        const maxLevel = scores.length > 0 ? Math.max(...scores.map(s => s.level)) : 1
        const maxTime = scores.length > 0 ? Math.max(...scores.map(s => s.timeInSecs)) : 0
        const gamesPlayed = scores.length

        // Calculate 5 achievements criteria met
        let achievementsCount = 0
        if (maxKills >= 5) achievementsCount++
        if (maxKills >= 20) achievementsCount++
        if (maxTime >= 60) achievementsCount++
        if (maxLevel >= 5) achievementsCount++
        if (gamesPlayed >= 5) achievementsCount++

        return {
          userId: user.id,
          name: user.name,
          coins: user.coins,
          achievementsCount,
          level: maxLevel,
          kills: maxKills,
          time: formatTime(maxTime)
        }
      })

      // Sort by coins DESC, achievements DESC, name ASC
      leaderboard.sort((a, b) => {
        if (b.coins !== a.coins) {
          return b.coins - a.coins
        }
        if (b.achievementsCount !== a.achievementsCount) {
          return b.achievementsCount - a.achievementsCount
        }
        return a.name.localeCompare(b.name)
      })

      return apiSuccess({ leaderboard })
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return apiSuccess({ leaderboard: [] })
  }
})
