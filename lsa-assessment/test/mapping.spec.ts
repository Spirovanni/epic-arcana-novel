import { describe, it, expect } from 'vitest';
import { chapterFromAssessment, eaIdFromChapter, parseChapterComponents } from '../src/scoring/resolve.js';

describe('Chapter Mapping', () => {
  it('should correctly map type/wing/dev to chapter', () => {
    // Test first chapter of each type
    expect(chapterFromAssessment({ dominant_type: 1, wing_bin: 0, development_bin: 0 })).toBe(1);
    expect(chapterFromAssessment({ dominant_type: 2, wing_bin: 0, development_bin: 0 })).toBe(41);
    expect(chapterFromAssessment({ dominant_type: 9, wing_bin: 0, development_bin: 0 })).toBe(321);
    
    // Test last chapter of each type
    expect(chapterFromAssessment({ dominant_type: 1, wing_bin: 7, development_bin: 4 })).toBe(40);
    expect(chapterFromAssessment({ dominant_type: 2, wing_bin: 7, development_bin: 4 })).toBe(80);
    expect(chapterFromAssessment({ dominant_type: 9, wing_bin: 7, development_bin: 4 })).toBe(360);
  });

  it('should generate correct EA IDs', () => {
    expect(eaIdFromChapter(1)).toBe('EA-001');
    expect(eaIdFromChapter(40)).toBe('EA-040');
    expect(eaIdFromChapter(360)).toBe('EA-360');
  });

  it('should correctly parse chapter components', () => {
    // Test chapter 1
    const comp1 = parseChapterComponents(1);
    expect(comp1.family_number).toBe(1);
    expect(comp1.wing_bin).toBe(0);
    expect(comp1.development_bin).toBe(0);
    expect(comp1.hue_index).toBe(0);

    // Test chapter 360
    const comp360 = parseChapterComponents(360);
    expect(comp360.family_number).toBe(9);
    expect(comp360.wing_bin).toBe(7);
    expect(comp360.development_bin).toBe(4);
    expect(comp360.hue_index).toBe(359);

    // Test middle chapter
    const comp180 = parseChapterComponents(180);
    expect(comp180.family_number).toBe(5);
    expect(comp180.wing_bin).toBe(3);
    expect(comp180.development_bin).toBe(4);
  });

  it('should maintain round-trip consistency', () => {
    // Test all boundary cases
    for (let type = 1; type <= 9; type++) {
      for (let wing = 0; wing <= 7; wing++) {
        for (let dev = 0; dev <= 4; dev++) {
          const chapter = chapterFromAssessment({ 
            dominant_type: type, 
            wing_bin: wing, 
            development_bin: dev 
          });
          
          const components = parseChapterComponents(chapter);
          expect(components.family_number).toBe(type);
          expect(components.wing_bin).toBe(wing);
          expect(components.development_bin).toBe(dev);
        }
      }
    }
  });

  it('should maintain chapter boundaries', () => {
    // Each type should have exactly 40 chapters
    for (let type = 1; type <= 9; type++) {
      const firstChapter = chapterFromAssessment({ dominant_type: type, wing_bin: 0, development_bin: 0 });
      const lastChapter = chapterFromAssessment({ dominant_type: type, wing_bin: 7, development_bin: 4 });
      
      expect(lastChapter - firstChapter + 1).toBe(40);
      expect(firstChapter).toBe((type - 1) * 40 + 1);
      expect(lastChapter).toBe(type * 40);
    }
  });
});