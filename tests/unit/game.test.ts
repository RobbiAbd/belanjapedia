import { describe, expect, it } from 'vitest'
import {
  calcEarnedCoins,
  calcEnemySpawnCount,
  calcEnemySpawnIntervalMs,
  calcEnemySpeed,
  calcJoystickVector,
  calcNextXpNeeded,
  calcPlayerSpeed,
  calcProjectileCount,
  calcProjectileSpread,
  calcScore,
  calcShootInterval,
  getLogicalDimensions,
  isMobileViewport,
  isPortraitViewport,
  LOGICAL_HEIGHT_PORTRAIT,
  LOGICAL_WIDTH_PORTRAIT,
  normalizeMovement,
  shouldShowAnalogControls,
  shouldShowTouchControls
} from '#shared/utils/game'

describe('game calculations', () => {
  describe('isPortraitViewport', () => {
    it('should detect portrait orientation', () => {
      expect(isPortraitViewport(375, 812)).toBe(true)
      expect(isPortraitViewport(812, 375)).toBe(false)
    })
  })

  describe('getLogicalDimensions', () => {
    it('should use portrait canvas on vertical mobile screens', () => {
      const dims = getLogicalDimensions(390, 844)
      expect(dims.orientation).toBe('portrait')
      expect(dims.width).toBe(LOGICAL_WIDTH_PORTRAIT)
      expect(dims.height).toBe(LOGICAL_HEIGHT_PORTRAIT)
    })

    it('should use landscape canvas on desktop screens', () => {
      const dims = getLogicalDimensions(1366, 768)
      expect(dims.orientation).toBe('landscape')
      expect(dims.width).toBe(1280)
      expect(dims.height).toBe(720)
    })

    it('should use portrait canvas for narrow widths even in landscape', () => {
      const dims = getLogicalDimensions(600, 400)
      expect(dims.orientation).toBe('portrait')
    })
  })

  describe('calcEarnedCoins', () => {
    it('should return 0 for negative score', () => {
      expect(calcEarnedCoins(-10)).toBe(0)
    })

    it('should convert score to coins (1 coin per 50 score)', () => {
      expect(calcEarnedCoins(0)).toBe(0)
      expect(calcEarnedCoins(49)).toBe(0)
      expect(calcEarnedCoins(50)).toBe(1)
      expect(calcEarnedCoins(120)).toBe(2)
      expect(calcEarnedCoins(2499)).toBe(49)
    })

    it('should cap earned coins at 50', () => {
      expect(calcEarnedCoins(2500)).toBe(50)
      expect(calcEarnedCoins(5000)).toBe(50)
    })
  })

  describe('calcPlayerSpeed', () => {
    it('should return base speed of 2 for level 1', () => {
      expect(calcPlayerSpeed(1)).toBe(2)
    })

    it('should return base speed of 2 for levels below 1', () => {
      expect(calcPlayerSpeed(0)).toBe(2)
      expect(calcPlayerSpeed(-5)).toBe(2)
    })

    it('should increase speed by 15% compound per level', () => {
      expect(calcPlayerSpeed(2)).toBeCloseTo(2.3)
      expect(calcPlayerSpeed(3)).toBeCloseTo(2.645)
    })
  })

  describe('calcEnemySpeed', () => {
    it('should return 1/2 of player speed', () => {
      expect(calcEnemySpeed(2)).toBe(1.0)
      expect(calcEnemySpeed(4)).toBe(2.0)
    })

    it('should return 0 for negative speed', () => {
      expect(calcEnemySpeed(-2)).toBe(0)
    })
  })

  describe('calcEnemySpawnCount', () => {
    it('should spawn 1 enemy at start (0s)', () => {
      expect(calcEnemySpawnCount(0)).toBe(1)
    })

    it('should return 1 for negative timeElapsed', () => {
      expect(calcEnemySpawnCount(-5)).toBe(1)
    })

    it('should increase count by 1 every 7 seconds', () => {
      expect(calcEnemySpawnCount(6.9)).toBe(1)
      expect(calcEnemySpawnCount(7.0)).toBe(2)
      expect(calcEnemySpawnCount(13.9)).toBe(2)
      expect(calcEnemySpawnCount(14.0)).toBe(3)
      expect(calcEnemySpawnCount(35.0)).toBe(6)
    })
  })

  describe('calcProjectileCount', () => {
    it('should return 1 for level 1', () => {
      expect(calcProjectileCount(1)).toBe(1)
    })

    it('should return 1 for levels below 1', () => {
      expect(calcProjectileCount(0)).toBe(1)
      expect(calcProjectileCount(-3)).toBe(1)
    })

    it('should return projectile count equal to level', () => {
      expect(calcProjectileCount(2)).toBe(2)
      expect(calcProjectileCount(5)).toBe(5)
    })
  })

  describe('calcProjectileSpread', () => {
    it('should return fixed spread in radians', () => {
      expect(calcProjectileSpread()).toBe(0.25)
    })
  })

  describe('calcScore', () => {
    it('should combine kills, level, and survival time', () => {
      expect(calcScore(10, 3, 65.8)).toBe(10 * 10 + 3 * 50 + 65)
    })

    it('should clamp invalid values to safe minimums', () => {
      expect(calcScore(-2, 0, -10)).toBe(50)
    })
  })

  describe('calcShootInterval', () => {
    it('should start at 1000ms for level 1', () => {
      expect(calcShootInterval(1)).toBe(1000)
    })

    it('should reduce interval as level increases with 300ms floor', () => {
      expect(calcShootInterval(5)).toBe(760)
      expect(calcShootInterval(20)).toBe(300)
    })
  })

  describe('calcEnemySpawnIntervalMs', () => {
    it('should start at 1500ms', () => {
      expect(calcEnemySpawnIntervalMs(0)).toBe(1500)
    })

    it('should speed up spawns over time with 500ms floor', () => {
      expect(calcEnemySpawnIntervalMs(100)).toBe(1000)
      expect(calcEnemySpawnIntervalMs(200)).toBe(500)
    })
  })

  describe('calcNextXpNeeded', () => {
    it('should scale xp requirement after each level', () => {
      expect(calcNextXpNeeded(10)).toBe(18)
      expect(calcNextXpNeeded(18)).toBe(28)
    })

    it('should return default xp for invalid current value', () => {
      expect(calcNextXpNeeded(0)).toBe(10)
      expect(calcNextXpNeeded(-3)).toBe(10)
    })
  })

  describe('normalizeMovement', () => {
    it('should return zero vector when idle', () => {
      expect(normalizeMovement(0, 0)).toEqual({ dx: 0, dy: 0 })
    })

    it('should keep axis movement unchanged', () => {
      expect(normalizeMovement(1, 0)).toEqual({ dx: 1, dy: 0 })
    })

    it('should normalize diagonal movement', () => {
      const movement = normalizeMovement(1, 1)
      expect(movement.dx).toBeCloseTo(0.7071)
      expect(movement.dy).toBeCloseTo(0.7071)
    })
  })

  describe('isMobileViewport', () => {
    it('should detect mobile widths', () => {
      expect(isMobileViewport(375)).toBe(true)
      expect(isMobileViewport(767)).toBe(true)
      expect(isMobileViewport(768)).toBe(false)
    })
  })

  describe('shouldShowAnalogControls', () => {
    it('should show analog joystick only while game is playing', () => {
      expect(shouldShowAnalogControls(true)).toBe(true)
      expect(shouldShowAnalogControls(false)).toBe(false)
    })
  })

  describe('shouldShowTouchControls', () => {
    it('should remain enabled for backward compatibility', () => {
      expect(shouldShowTouchControls(390, 844, false)).toBe(true)
      expect(shouldShowTouchControls(1200, 800, false)).toBe(true)
    })
  })

  describe('calcJoystickVector', () => {
    it('should return inactive vector inside dead zone', () => {
      expect(calcJoystickVector(2, 2, 40)).toEqual({ dx: 0, dy: 0, active: false })
    })

    it('should return inactive vector for invalid radius', () => {
      expect(calcJoystickVector(20, 10, 0)).toEqual({ dx: 0, dy: 0, active: false })
      expect(calcJoystickVector(20, 10, -5)).toEqual({ dx: 0, dy: 0, active: false })
    })

    it('should normalize joystick movement within max radius', () => {
      const movement = calcJoystickVector(40, 0, 40)
      expect(movement.active).toBe(true)
      expect(movement.dx).toBeCloseTo(1)
      expect(movement.dy).toBe(0)
    })

    it('should clamp movement beyond joystick radius', () => {
      const movement = calcJoystickVector(80, 0, 40)
      expect(movement.dx).toBeCloseTo(1)
    })

    it('should support partial joystick tilt', () => {
      const movement = calcJoystickVector(20, 0, 40)
      expect(movement.active).toBe(true)
      expect(movement.dx).toBeCloseTo(0.5)
      expect(movement.dy).toBe(0)
    })
  })
})
