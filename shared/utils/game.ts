export function calcEarnedCoins(score: number): number {
  if (score < 0) return 0
  return Math.min(50, Math.floor(score / 50))
}

export function parseGameTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':')
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
  }
  return 0
}

export function calcGameRewardCoins(
  loggedIn: boolean,
  userId: number | undefined | null,
  score: number
): number {
  if (!loggedIn || userId == null) return 0
  return calcEarnedCoins(score)
}

export function buildGameRewardReference(gameScoreId: number): string {
  return `game-score-${gameScoreId}`
}

export type GameRewardTransactionData = {
  userId: number
  amount: number
  type: 'GAME_REWARD'
  reference: string
}

export function buildGameRewardTransaction(
  userId: number,
  amount: number,
  gameScoreId: number
): GameRewardTransactionData | null {
  if (amount <= 0) return null

  return {
    userId,
    amount,
    type: 'GAME_REWARD',
    reference: buildGameRewardReference(gameScoreId)
  }
}

export function calcPlayerSpeed(level: number): number {
  const baseSpeed = 2
  if (level < 1) return baseSpeed
  return baseSpeed * Math.pow(1.15, level - 1)
}

export function calcEnemySpeed(playerSpeed: number): number {
  if (playerSpeed < 0) return 0
  return playerSpeed * 0.5
}

export function calcEnemySpawnCount(timeElapsed: number): number {
  if (timeElapsed < 0) return 1
  return 1 + Math.floor(timeElapsed / 7)
}

export function calcProjectileCount(level: number): number {
  if (level < 1) return 1
  return level
}
