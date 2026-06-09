import { describe, expect, it } from 'vitest'
import {
  calcEarnedCoins,
  calcPlayerSpeed,
  calcEnemySpeed,
  calcEnemySpawnCount,
  calcProjectileCount
} from '#shared/utils/game'

describe('game calculations', () => {
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
    it('should return 3/4 of player speed', () => {
      expect(calcEnemySpeed(2)).toBe(1.5)
      expect(calcEnemySpeed(4)).toBe(3.0)
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

    it('should increase count by 1 every 5 seconds', () => {
      expect(calcEnemySpawnCount(4.9)).toBe(1)
      expect(calcEnemySpawnCount(5.0)).toBe(2)
      expect(calcEnemySpawnCount(9.9)).toBe(2)
      expect(calcEnemySpawnCount(10.0)).toBe(3)
      expect(calcEnemySpawnCount(25.0)).toBe(6)
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
})
