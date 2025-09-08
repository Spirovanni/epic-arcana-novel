import { describe, it, expect } from 'vitest'
import { 
  familyFromChapter, 
  idx40FromChapter, 
  wingBinFromIdx40, 
  devBinFromIdx40, 
  chapterFromAssessment, 
  eaIdFromChapter 
} from '../src/lib/canonical'

describe('Canonical Mapping Functions', () => {
  
  describe('familyFromChapter', () => {
    it('should map chapters 1-40 to family 1', () => {
      expect(familyFromChapter(1)).toBe(1)
      expect(familyFromChapter(40)).toBe(1)
    })
    
    it('should map chapters 41-80 to family 2', () => {
      expect(familyFromChapter(41)).toBe(2)
      expect(familyFromChapter(80)).toBe(2)
    })
    
    it('should map chapters 321-360 to family 9', () => {
      expect(familyFromChapter(321)).toBe(9)
      expect(familyFromChapter(360)).toBe(9)
    })
  })

  describe('idx40FromChapter', () => {
    it('should map chapters to 0-39 indices correctly', () => {
      expect(idx40FromChapter(1)).toBe(0)
      expect(idx40FromChapter(40)).toBe(39)
      expect(idx40FromChapter(41)).toBe(0)
      expect(idx40FromChapter(80)).toBe(39)
      expect(idx40FromChapter(360)).toBe(39)
    })
  })

  describe('wingBinFromIdx40', () => {
    it('should map idx40 to wing bins 0-7', () => {
      expect(wingBinFromIdx40(0)).toBe(0)  // 0/5 = 0
      expect(wingBinFromIdx40(4)).toBe(0)  // 4/5 = 0
      expect(wingBinFromIdx40(5)).toBe(1)  // 5/5 = 1
      expect(wingBinFromIdx40(39)).toBe(7) // 39/5 = 7
    })
  })

  describe('devBinFromIdx40', () => {
    it('should map idx40 to development bins 0-4', () => {
      expect(devBinFromIdx40(0)).toBe(0)   // 0 % 5 = 0
      expect(devBinFromIdx40(4)).toBe(4)   // 4 % 5 = 4
      expect(devBinFromIdx40(5)).toBe(0)   // 5 % 5 = 0
      expect(devBinFromIdx40(39)).toBe(4)  // 39 % 5 = 4
    })
  })

  describe('chapterFromAssessment', () => {
    it('should round-trip correctly', () => {
      // Test type 1, wing 0, dev 0 -> chapter 1
      expect(chapterFromAssessment(1, 0, 0)).toBe(1)
      
      // Test type 1, wing 7, dev 4 -> chapter 40  
      expect(chapterFromAssessment(1, 7, 4)).toBe(40)
      
      // Test type 2, wing 0, dev 0 -> chapter 41
      expect(chapterFromAssessment(2, 0, 0)).toBe(41)
      
      // Test type 9, wing 7, dev 4 -> chapter 360
      expect(chapterFromAssessment(9, 7, 4)).toBe(360)
    })

    it('should maintain consistency with family mapping', () => {
      const testCases = [
        { type: 1, wing: 3, dev: 2 },
        { type: 5, wing: 1, dev: 4 },
        { type: 9, wing: 6, dev: 0 }
      ]

      testCases.forEach(({ type, wing, dev }) => {
        const chapter = chapterFromAssessment(type, wing, dev)
        const derivedFamily = familyFromChapter(chapter)
        expect(derivedFamily).toBe(type)
      })
    })
  })

  describe('eaIdFromChapter', () => {
    it('should format EA IDs correctly', () => {
      expect(eaIdFromChapter(1)).toBe('EA-001')
      expect(eaIdFromChapter(42)).toBe('EA-042')
      expect(eaIdFromChapter(360)).toBe('EA-360')
    })
  })

  describe('Round-trip consistency', () => {
    it('should maintain consistency for all valid combinations', () => {
      for (let type = 1; type <= 9; type++) {
        for (let wing = 0; wing <= 7; wing++) {
          for (let dev = 0; dev <= 4; dev++) {
            const chapter = chapterFromAssessment(type, wing, dev)
            const idx40 = idx40FromChapter(chapter)
            const derivedWing = wingBinFromIdx40(idx40)
            const derivedDev = devBinFromIdx40(idx40)
            const derivedFamily = familyFromChapter(chapter)
            
            expect(derivedFamily).toBe(type)
            expect(derivedWing).toBe(wing)
            expect(derivedDev).toBe(dev)
            expect(chapter).toBeGreaterThanOrEqual(1)
            expect(chapter).toBeLessThanOrEqual(360)
          }
        }
      }
    })
  })

})