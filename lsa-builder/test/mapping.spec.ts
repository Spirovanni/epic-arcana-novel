import { describe, it, expect } from 'vitest';
import {
  familyFromChapter,
  idx40FromChapter,
  wingBinFromIdx40,
  devBinFromIdx40,
  hueIndexFromChapter,
  idFromChapter,
  chapterFromAssessment,
  eaIdFromAssessment,
  AssessmentResult
} from '../src/mapping';

describe('LSA Canonical Mapping', () => {
  describe('Family boundary mapping', () => {
    it('should map chapter 1 to family 1', () => {
      expect(familyFromChapter(1)).toBe(1);
    });
    
    it('should map chapter 40 to family 1', () => {
      expect(familyFromChapter(40)).toBe(1);
    });
    
    it('should map chapter 41 to family 2', () => {
      expect(familyFromChapter(41)).toBe(2);
    });
    
    it('should map chapter 80 to family 2', () => {
      expect(familyFromChapter(80)).toBe(2);
    });
    
    it('should map chapter 360 to family 9', () => {
      expect(familyFromChapter(360)).toBe(9);
    });
    
    it('should handle all family boundaries correctly', () => {
      const boundaries = [1, 41, 81, 121, 161, 201, 241, 281, 321, 360];
      const expectedFamilies = [1, 2, 3, 4, 5, 6, 7, 8, 9, 9];
      
      boundaries.forEach((chapter, index) => {
        expect(familyFromChapter(chapter)).toBe(expectedFamilies[index]);
      });
    });
  });
  
  describe('idx40 calculation', () => {
    it('should calculate idx40 correctly for first chapter of each family', () => {
      expect(idx40FromChapter(1)).toBe(0);   // Family 1, first chapter
      expect(idx40FromChapter(41)).toBe(0);  // Family 2, first chapter
      expect(idx40FromChapter(81)).toBe(0);  // Family 3, first chapter
      expect(idx40FromChapter(321)).toBe(0); // Family 9, first chapter
    });
    
    it('should calculate idx40 correctly for last chapter of each family', () => {
      expect(idx40FromChapter(40)).toBe(39);  // Family 1, last chapter
      expect(idx40FromChapter(80)).toBe(39);  // Family 2, last chapter
      expect(idx40FromChapter(120)).toBe(39); // Family 3, last chapter
      expect(idx40FromChapter(360)).toBe(39); // Family 9, last chapter
    });
    
    it('should handle middle chapters correctly', () => {
      expect(idx40FromChapter(20)).toBe(19); // Family 1, middle
      expect(idx40FromChapter(60)).toBe(19); // Family 2, middle
      expect(idx40FromChapter(340)).toBe(19); // Family 9, middle
    });
  });
  
  describe('Wing and development bin calculations', () => {
    it('should calculate wing_bin correctly', () => {
      expect(wingBinFromIdx40(0)).toBe(0);  // First wing
      expect(wingBinFromIdx40(4)).toBe(0);  // Still first wing
      expect(wingBinFromIdx40(5)).toBe(1);  // Second wing
      expect(wingBinFromIdx40(39)).toBe(7); // Last wing (39/5 = 7)
    });
    
    it('should calculate development_bin correctly', () => {
      expect(devBinFromIdx40(0)).toBe(0);  // 0 % 5 = 0
      expect(devBinFromIdx40(1)).toBe(1);  // 1 % 5 = 1
      expect(devBinFromIdx40(4)).toBe(4);  // 4 % 5 = 4
      expect(devBinFromIdx40(5)).toBe(0);  // 5 % 5 = 0
      expect(devBinFromIdx40(39)).toBe(4); // 39 % 5 = 4
    });
    
    it('should handle all wing bins (0-7)', () => {
      for (let wing = 0; wing <= 7; wing++) {
        const idx40 = wing * 5; // First idx40 of each wing
        expect(wingBinFromIdx40(idx40)).toBe(wing);
      }
    });
    
    it('should handle all development bins (0-4)', () => {
      for (let dev = 0; dev <= 4; dev++) {
        expect(devBinFromIdx40(dev)).toBe(dev);
      }
    });
  });
  
  describe('Hue index calculation', () => {
    it('should map chapter to hue index (0-based)', () => {
      expect(hueIndexFromChapter(1)).toBe(0);
      expect(hueIndexFromChapter(2)).toBe(1);
      expect(hueIndexFromChapter(360)).toBe(359);
    });
  });
  
  describe('ID generation', () => {
    it('should generate correct EA IDs with zero padding', () => {
      expect(idFromChapter(1)).toBe('EA-001');
      expect(idFromChapter(10)).toBe('EA-010');
      expect(idFromChapter(100)).toBe('EA-100');
      expect(idFromChapter(360)).toBe('EA-360');
    });
  });
  
  describe('Assessment to chapter conversion', () => {
    it('should convert assessment result to correct chapter', () => {
      const assessment: AssessmentResult = {
        dominant_type: 1,
        wing_bin: 0,
        development_bin: 0
      };
      expect(chapterFromAssessment(assessment)).toBe(1);
    });
    
    it('should handle family 9 correctly', () => {
      const assessment: AssessmentResult = {
        dominant_type: 9,
        wing_bin: 7,
        development_bin: 4
      };
      expect(chapterFromAssessment(assessment)).toBe(360);
    });
    
    it('should generate correct EA ID from assessment', () => {
      const assessment: AssessmentResult = {
        dominant_type: 5,
        wing_bin: 3,
        development_bin: 2
      };
      const expectedChapter = chapterFromAssessment(assessment);
      expect(eaIdFromAssessment(assessment)).toBe(idFromChapter(expectedChapter));
    });
  });
  
  describe('Round-trip conversion', () => {
    it('should maintain consistency in round-trip conversions', () => {
      const testCases = [
        { type: 1, wing: 0, dev: 0 }, // Chapter 1
        { type: 1, wing: 7, dev: 4 }, // Chapter 40
        { type: 2, wing: 0, dev: 0 }, // Chapter 41
        { type: 5, wing: 3, dev: 2 }, // Middle chapter
        { type: 9, wing: 7, dev: 4 }  // Chapter 360
      ];
      
      testCases.forEach(({ type, wing, dev }) => {
        const assessment: AssessmentResult = {
          dominant_type: type as any,
          wing_bin: wing,
          development_bin: dev
        };
        
        const chapter = chapterFromAssessment(assessment);
        
        // Back-calculate should match original
        const backCalcFamily = familyFromChapter(chapter);
        const backCalcIdx40 = idx40FromChapter(chapter);
        const backCalcWing = wingBinFromIdx40(backCalcIdx40);
        const backCalcDev = devBinFromIdx40(backCalcIdx40);
        
        expect(backCalcFamily).toBe(type);
        expect(backCalcWing).toBe(wing);
        expect(backCalcDev).toBe(dev);
      });
    });
    
    it('should handle boundary cases correctly', () => {
      // Test all family boundaries
      for (let family = 1; family <= 9; family++) {
        const firstChapter = (family - 1) * 40 + 1;
        const lastChapter = family * 40;
        
        // First chapter of family
        expect(familyFromChapter(firstChapter)).toBe(family);
        expect(idx40FromChapter(firstChapter)).toBe(0);
        
        // Last chapter of family
        expect(familyFromChapter(lastChapter)).toBe(family);
        expect(idx40FromChapter(lastChapter)).toBe(39);
      }
    });
  });
});