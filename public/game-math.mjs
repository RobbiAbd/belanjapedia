export const LOGICAL_WIDTH_LANDSCAPE = 1280
export const LOGICAL_HEIGHT_LANDSCAPE = 720
export const LOGICAL_WIDTH_PORTRAIT = 720
export const LOGICAL_HEIGHT_PORTRAIT = 1280
export const LOGICAL_WIDTH = LOGICAL_WIDTH_LANDSCAPE
export const LOGICAL_HEIGHT = LOGICAL_HEIGHT_LANDSCAPE
export const BASE_PLAYER_SPEED = 2
export const SPEED_GROWTH_RATE = 1.15
export const ENEMY_SPEED_RATIO = 0.5
export const SPAWN_COUNT_INTERVAL_SEC = 7
export const PROJECTILE_SPREAD_RAD = 0.25
export const COIN_SCORE_RATIO = 50
export const MAX_COINS_PER_GAME = 50

export function isPortraitViewport(width, height) {
  return height > width
}

export function getLogicalDimensions(width, height) {
  if (isPortraitViewport(width, height) || width < 768) {
    return {
      width: LOGICAL_WIDTH_PORTRAIT,
      height: LOGICAL_HEIGHT_PORTRAIT,
      orientation: 'portrait'
    }
  }

  return {
    width: LOGICAL_WIDTH_LANDSCAPE,
    height: LOGICAL_HEIGHT_LANDSCAPE,
    orientation: 'landscape'
  }
}

export function calcEarnedCoins(score) {
  if (score < 0) return 0
  return Math.min(MAX_COINS_PER_GAME, Math.floor(score / COIN_SCORE_RATIO))
}

export function calcPlayerSpeed(level) {
  if (level < 1) return BASE_PLAYER_SPEED
  return BASE_PLAYER_SPEED * Math.pow(SPEED_GROWTH_RATE, level - 1)
}

export function calcEnemySpeed(playerSpeed) {
  if (playerSpeed < 0) return 0
  return playerSpeed * ENEMY_SPEED_RATIO
}

export function calcEnemySpawnCount(timeElapsed) {
  if (timeElapsed < 0) return 1
  return 1 + Math.floor(timeElapsed / SPAWN_COUNT_INTERVAL_SEC)
}

export function calcProjectileCount(level) {
  if (level < 1) return 1
  return level
}

export function calcProjectileSpread() {
  return PROJECTILE_SPREAD_RAD
}

export function calcScore(kills, level, timeElapsed) {
  const safeKills = Math.max(0, kills)
  const safeLevel = Math.max(1, level)
  const safeTime = Math.max(0, timeElapsed)
  return safeKills * 10 + safeLevel * 50 + Math.floor(safeTime)
}

export function calcShootInterval(level) {
  if (level < 1) return 1000
  return Math.max(300, 1000 - (level - 1) * 60)
}

export function calcEnemySpawnIntervalMs(timeElapsed) {
  const safeTime = Math.max(0, timeElapsed)
  return Math.max(500, 1500 - safeTime * 5)
}

export function calcNextXpNeeded(currentXpNeeded) {
  if (currentXpNeeded < 1) return 10
  return Math.floor(currentXpNeeded * 1.3) + 5
}

export function normalizeMovement(dx, dy) {
  if (dx === 0 && dy === 0) return { dx: 0, dy: 0 }
  if (dx !== 0 && dy !== 0) {
    return { dx: dx * 0.7071, dy: dy * 0.7071 }
  }
  return { dx, dy }
}

export function isMobileViewport(width) {
  return width < 768
}

export function shouldShowAnalogControls(isPlaying) {
  return isPlaying
}

export function shouldShowTouchControls() {
  return true
}

export function calcJoystickVector(offsetX, offsetY, maxRadius) {
  if (maxRadius <= 0) return { dx: 0, dy: 0, active: false }

  const distance = Math.hypot(offsetX, offsetY)
  if (distance < 6) return { dx: 0, dy: 0, active: false }

  const clampedDistance = Math.min(distance, maxRadius)
  const nx = offsetX / distance
  const ny = offsetY / distance

  return {
    dx: (nx * clampedDistance) / maxRadius,
    dy: (ny * clampedDistance) / maxRadius,
    active: true
  }
}
