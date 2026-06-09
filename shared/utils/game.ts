export function calcEarnedCoins(score: number): number {
  if (score < 0) return 0
  return Math.min(50, Math.floor(score / 50))
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
