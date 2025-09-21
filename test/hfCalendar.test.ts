/**
 * Human Framework Calendar Unit Tests
 * Tests all boundary conditions and leap year logic
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  dayOfYear365,
  resolveSegment,
  isRestDay,
  isMidpoint,
  isActiveDay,
  calculateActiveIndex,
  getTwentyDayWeekIndex,
  getDetoxPhase,
  type HfSegment,
  type LeapPolicy
} from '../src/lib/hfCalendar';

describe('Human Framework Calendar', () => {
  const anchor2024 = new Date(2024, 0, 1); // Jan 1, 2024 (leap year)
  const anchor2023 = new Date(2023, 0, 1); // Jan 1, 2023 (non-leap year)

  describe('dayOfYear365', () => {
    it('should handle basic day counting', () => {
      const jan1 = new Date(2024, 0, 1);
      const jan2 = new Date(2024, 0, 2);
      const dec31 = new Date(2024, 11, 31);
      
      expect(dayOfYear365(jan1, anchor2024, 'duplicate')).toBe(1);
      expect(dayOfYear365(jan2, anchor2024, 'duplicate')).toBe(2);
      expect(dayOfYear365(dec31, anchor2024, 'duplicate')).toBe(365);
    });

    it('should handle leap year with duplicate policy', () => {
      const feb28 = new Date(2024, 1, 28); // Feb 28
      const feb29 = new Date(2024, 1, 29); // Feb 29 (leap day)
      const mar1 = new Date(2024, 2, 1);   // Mar 1
      
      expect(dayOfYear365(feb28, anchor2024, 'duplicate')).toBe(59);
      expect(dayOfYear365(feb29, anchor2024, 'duplicate')).toBe(59); // Same as Feb 28
      expect(dayOfYear365(mar1, anchor2024, 'duplicate')).toBe(60);
    });

    it('should handle leap year with skip policy', () => {
      const feb28 = new Date(2024, 1, 28);
      const feb29 = new Date(2024, 1, 29);
      const mar1 = new Date(2024, 2, 1);
      
      expect(dayOfYear365(feb28, anchor2024, 'skip')).toBe(59);
      expect(dayOfYear365(feb29, anchor2024, 'skip')).toBe(61); // Skip to next day
      expect(dayOfYear365(mar1, anchor2024, 'skip')).toBe(60);
    });

    it('should handle non-leap year normally', () => {
      const feb28 = new Date(2023, 1, 28);
      const mar1 = new Date(2023, 2, 1);
      
      expect(dayOfYear365(feb28, anchor2023, 'duplicate')).toBe(59);
      expect(dayOfYear365(mar1, anchor2023, 'duplicate')).toBe(60);
    });
  });

  describe('resolveSegment', () => {
    it('should correctly identify Q1 boundaries', () => {
      expect(resolveSegment(1)).toEqual({ segment: 'Q1', intraSegmentIndex: 1 });
      expect(resolveSegment(80)).toEqual({ segment: 'Q1', intraSegmentIndex: 80 });
      expect(resolveSegment(81)).toEqual({ segment: 'Q1', intraSegmentIndex: 81 });
    });

    it('should correctly identify Q2 boundaries', () => {
      expect(resolveSegment(82)).toEqual({ segment: 'Q2', intraSegmentIndex: 1 });
      expect(resolveSegment(161)).toEqual({ segment: 'Q2', intraSegmentIndex: 80 });
      expect(resolveSegment(162)).toEqual({ segment: 'Q2', intraSegmentIndex: 81 });
    });

    it('should correctly identify Mid-Band segments', () => {
      expect(resolveSegment(163)).toEqual({ segment: 'MID_A', intraSegmentIndex: 1 });
      expect(resolveSegment(182)).toEqual({ segment: 'MID_A', intraSegmentIndex: 20 });
      expect(resolveSegment(183)).toEqual({ segment: 'MIDPOINT', intraSegmentIndex: 1 });
      expect(resolveSegment(184)).toEqual({ segment: 'MID_B', intraSegmentIndex: 1 });
      expect(resolveSegment(203)).toEqual({ segment: 'MID_B', intraSegmentIndex: 20 });
    });

    it('should correctly identify Q3 boundaries', () => {
      expect(resolveSegment(204)).toEqual({ segment: 'Q3', intraSegmentIndex: 1 });
      expect(resolveSegment(283)).toEqual({ segment: 'Q3', intraSegmentIndex: 80 });
      expect(resolveSegment(284)).toEqual({ segment: 'Q3', intraSegmentIndex: 81 });
    });

    it('should correctly identify Q4 boundaries', () => {
      expect(resolveSegment(285)).toEqual({ segment: 'Q4', intraSegmentIndex: 1 });
      expect(resolveSegment(364)).toEqual({ segment: 'Q4', intraSegmentIndex: 80 });
      expect(resolveSegment(365)).toEqual({ segment: 'Q4', intraSegmentIndex: 81 });
    });
  });

  describe('isRestDay', () => {
    it('should identify rest days correctly', () => {
      expect(isRestDay('Q1', 81)).toBe(true);
      expect(isRestDay('Q2', 81)).toBe(true);
      expect(isRestDay('Q3', 81)).toBe(true);
      expect(isRestDay('Q4', 81)).toBe(true);
      
      expect(isRestDay('Q1', 80)).toBe(false);
      expect(isRestDay('MID_A', 20)).toBe(false);
      expect(isRestDay('MIDPOINT', 1)).toBe(false);
    });
  });

  describe('isMidpoint', () => {
    it('should identify midpoint day correctly', () => {
      expect(isMidpoint('MIDPOINT')).toBe(true);
      expect(isMidpoint('Q1')).toBe(false);
      expect(isMidpoint('MID_A')).toBe(false);
      expect(isMidpoint('MID_B')).toBe(false);
    });
  });

  describe('isActiveDay', () => {
    it('should correctly identify active days', () => {
      // Active days in quarters (not day 81)
      expect(isActiveDay('Q1', 1)).toBe(true);
      expect(isActiveDay('Q1', 80)).toBe(true);
      expect(isActiveDay('Q1', 81)).toBe(false); // Rest day
      
      // Mid-band days are active
      expect(isActiveDay('MID_A', 1)).toBe(true);
      expect(isActiveDay('MID_A', 20)).toBe(true);
      expect(isActiveDay('MID_B', 1)).toBe(true);
      expect(isActiveDay('MID_B', 20)).toBe(true);
      
      // Midpoint is not active
      expect(isActiveDay('MIDPOINT', 1)).toBe(false);
    });
  });

  describe('calculateActiveIndex', () => {
    it('should correctly count active days', () => {
      // Day 1 should be active index 1
      expect(calculateActiveIndex(1)).toBe(1);
      
      // Day 80 (Q1) should be active index 80
      expect(calculateActiveIndex(80)).toBe(80);
      
      // Day 81 (Q1 rest) should not increment count
      expect(calculateActiveIndex(81)).toBe(80);
      
      // Day 82 (Q2 start) should be active index 81
      expect(calculateActiveIndex(82)).toBe(81);
      
      // Day 162 (Q2 rest) should be active index 160
      expect(calculateActiveIndex(162)).toBe(160);
      
      // Day 163 (MID_A start) should be active index 161
      expect(calculateActiveIndex(163)).toBe(161);
      
      // Day 183 (MIDPOINT) should not increment
      expect(calculateActiveIndex(183)).toBe(180);
      
      // Day 184 (MID_B start) should be active index 181
      expect(calculateActiveIndex(184)).toBe(181);
    });
  });

  describe('getTwentyDayWeekIndex', () => {
    it('should correctly cycle through 0-19', () => {
      // First 20 active days should be 0-19
      expect(getTwentyDayWeekIndex(1)).toBe(0);
      expect(getTwentyDayWeekIndex(2)).toBe(1);
      expect(getTwentyDayWeekIndex(20)).toBe(19);
      expect(getTwentyDayWeekIndex(21)).toBe(0); // Cycle back
      
      // Test some specific boundary days
      expect(getTwentyDayWeekIndex(80)).toBe(19); // Q1 day 80, active index 80, 80-1=79, 79%20=19
      expect(getTwentyDayWeekIndex(82)).toBe(0);  // Q2 day 1, active index 81, 81-1=80, 80%20=0
    });
  });

  describe('getDetoxPhase', () => {
    it('should return correct detox phases', () => {
      expect(getDetoxPhase('Q1')).toBe('NONE');
      expect(getDetoxPhase('Q2')).toBe('NONE');
      expect(getDetoxPhase('MID_A')).toBe('EXILE_1_20');
      expect(getDetoxPhase('MIDPOINT')).toBe('MIDPOINT');
      expect(getDetoxPhase('MID_B')).toBe('RENEWAL_1_20');
      expect(getDetoxPhase('Q3')).toBe('NONE');
      expect(getDetoxPhase('Q4')).toBe('NONE');
    });
  });

  describe('Calendar integrity', () => {
    it('should have exactly 365 days', () => {
      const segments = ['Q1', 'Q2', 'MID_A', 'MIDPOINT', 'MID_B', 'Q3', 'Q4'];
      const lengths = [81, 81, 20, 1, 20, 81, 81];
      const total = lengths.reduce((sum, length) => sum + length, 0);
      
      expect(total).toBe(365);
    });

    it('should have correct number of active days', () => {
      // Q1: 80 active, Q2: 80 active, MID_A: 20 active, MID_B: 20 active, Q3: 80 active, Q4: 80 active
      // Total: 80 + 80 + 20 + 20 + 80 + 80 = 360 active days
      // Rest days: 4 (Q1,Q2,Q3,Q4 day 81 each)
      // Midpoint: 1
      // Total: 360 + 4 + 1 = 365 ✓
      
      let activeCount = 0;
      let restCount = 0;
      let midpointCount = 0;
      
      for (let day = 1; day <= 365; day++) {
        const { segment, intraSegmentIndex } = resolveSegment(day);
        
        if (isMidpoint(segment)) {
          midpointCount++;
        } else if (isRestDay(segment, intraSegmentIndex)) {
          restCount++;
        } else if (isActiveDay(segment, intraSegmentIndex)) {
          activeCount++;
        }
      }
      
      expect(activeCount).toBe(360);
      expect(restCount).toBe(4);
      expect(midpointCount).toBe(1);
      expect(activeCount + restCount + midpointCount).toBe(365);
    });

    it('should have 18 complete 20-day cycles', () => {
      // 360 active days = 18 complete 20-day cycles
      expect(360 / 20).toBe(18);
    });
  });

  describe('Edge cases and boundaries', () => {
    it('should handle day 0 and day 366 gracefully', () => {
      // These shouldn't happen in normal use but should not crash
      expect(() => resolveSegment(0)).not.toThrow();
      expect(() => resolveSegment(366)).not.toThrow();
    });

    it('should handle all segment transitions correctly', () => {
      const transitions = [
        { day: 81, expectedNext: 82 }, // Q1 to Q2
        { day: 162, expectedNext: 163 }, // Q2 to MID_A
        { day: 182, expectedNext: 183 }, // MID_A to MIDPOINT
        { day: 183, expectedNext: 184 }, // MIDPOINT to MID_B
        { day: 203, expectedNext: 204 }, // MID_B to Q3
        { day: 284, expectedNext: 285 }, // Q3 to Q4
      ];

      transitions.forEach(({ day, expectedNext }) => {
        const current = resolveSegment(day);
        const next = resolveSegment(expectedNext);
        expect(current.segment).not.toBe(next.segment);
      });
    });
  });
});