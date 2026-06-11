import { describe, expect, it } from 'vitest'
import {
  buildGameRewardReference,
  buildGameRewardTransaction,
  calcEarnedCoins,
  calcEnemySpawnCount,
  calcEnemySpeed,
  calcGameRewardCoins,
  calcPlayerSpeed,
  calcProjectileCount,
  parseGameTimeToSeconds
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

  describe('parseGameTimeToSeconds', () => {
    it('should parse mm:ss format to seconds', () => {
      expect(parseGameTimeToSeconds('01:30')).toBe(90)
      expect(parseGameTimeToSeconds('02:05')).toBe(125)
      expect(parseGameTimeToSeconds('00:49')).toBe(49)
    })

    it('should return 0 for invalid format', () => {
      expect(parseGameTimeToSeconds('invalid')).toBe(0)
      expect(parseGameTimeToSeconds('')).toBe(0)
    })
  })

  describe('calcGameRewardCoins', () => {
    it('should return 0 when user is not logged in', () => {
      expect(calcGameRewardCoins(false, undefined, 500)).toBe(0)
      expect(calcGameRewardCoins(false, 3, 500)).toBe(0)
    })

    it('should return 0 when user id is missing', () => {
      expect(calcGameRewardCoins(true, null, 500)).toBe(0)
      expect(calcGameRewardCoins(true, undefined, 500)).toBe(0)
    })

    it('should calculate reward coins for logged in user', () => {
      expect(calcGameRewardCoins(true, 3, 49)).toBe(0)
      expect(calcGameRewardCoins(true, 3, 500)).toBe(10)
      expect(calcGameRewardCoins(true, 3, 2500)).toBe(50)
    })
  })

  describe('buildGameRewardReference', () => {
    it('should build stable reference from game score id', () => {
      expect(buildGameRewardReference(12)).toBe('game-score-12')
    })
  })

  describe('buildGameRewardTransaction', () => {
    it('should return null when amount is zero or negative', () => {
      expect(buildGameRewardTransaction(3, 0, 10)).toBeNull()
      expect(buildGameRewardTransaction(3, -5, 10)).toBeNull()
    })

    it('should build coin transaction payload for game reward', () => {
      expect(buildGameRewardTransaction(3, 10, 42)).toEqual({
        userId: 3,
        amount: 10,
        type: 'GAME_REWARD',
        reference: 'game-score-42'
      })
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
