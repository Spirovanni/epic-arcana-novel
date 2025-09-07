import { describe, it, expect } from 'vitest';
import { calculateDimensions } from '../src/scoring/dimensions.js';
import { calculateTypeProbs, calculateWingBin } from '../src/scoring/types.js';
import { calculateInstincts } from '../src/scoring/instincts.js';
import { calculateDevelopmentBin } from '../src/scoring/bins.js';
import { AssessmentAnswers } from '../src/schema.js';

describe('Scoring Engine', () => {
  const mockForcedChoiceItems = [
    {
      id: 'FC-001',
      center: 'Body',
      location: 'Test Location',
      vignette: 'Test vignette',
      format: 'forced_choice_best_worst' as const,
      options: [
        {
          label: 'Option A',
          keys: {
            dimensions: { agency: 0.2, stability: 0.1 },
            types: { '8': 0.3, '1': 0.1 }
          }
        },
        {
          label: 'Option B', 
          keys: {
            dimensions: { empathy: 0.25, cooperativeness: 0.15 },
            types: { '2': 0.3, '9': 0.1 }
          }
        },
        {
          label: 'Option C',
          keys: {
            dimensions: { abstract_reasoning: 0.2, orderliness: 0.15 },
            types: { '5': 0.25, '1': 0.1 }
          }
        }
      ]
    }
  ];

  const mockLikertItems = [
    {
      id: 'LK-001',
      center: 'Heart',
      location: 'Test Location',
      statement: 'Test statement',
      scale: [1, 2, 3, 4, 5] as [1, 2, 3, 4, 5],
      keys: {
        dimensions: { empathy: 0.3 },
        types: { '2': 0.25 }
      }
    }
  ];

  const mockAnswers: AssessmentAnswers = {
    forcedChoice: [
      { itemId: 'FC-001', best: 0, worst: 1 }
    ],
    likert: [
      { itemId: 'LK-001', rating: 5 }
    ],
    meta: {
      startTime: '2024-01-01T00:00:00Z',
      endTime: '2024-01-01T00:10:00Z'
    }
  };

  it('should calculate dimensions correctly', () => {
    const dimensions = calculateDimensions(mockAnswers, mockForcedChoiceItems, mockLikertItems);
    
    // Should be normalized to [0,1]
    Object.values(dimensions).forEach(value => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    });

    // Agency should be higher (best choice) than empathy (worst choice)
    expect(dimensions.agency).toBeGreaterThan(dimensions.empathy);
  });

  it('should calculate type probabilities with valid softmax', () => {
    const dimensions = calculateDimensions(mockAnswers, mockForcedChoiceItems, mockLikertItems);
    const { type_probs, dominant_type } = calculateTypeProbs(
      mockAnswers, 
      mockForcedChoiceItems, 
      mockLikertItems, 
      dimensions
    );

    // Probabilities should sum to 1
    const sum = Object.values(type_probs).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);

    // All probabilities should be between 0 and 1
    Object.values(type_probs).forEach(prob => {
      expect(prob).toBeGreaterThan(0);
      expect(prob).toBeLessThan(1);
    });

    // Dominant type should have highest probability
    expect(type_probs[dominant_type.toString()]).toBe(
      Math.max(...Object.values(type_probs))
    );
  });

  it('should calculate wing bins within valid range', () => {
    const type_probs = {
      '1': 0.1, '2': 0.1, '3': 0.1, '4': 0.1, '5': 0.4,
      '6': 0.1, '7': 0.1, '8': 0.05, '9': 0.05
    };

    const wing_bin = calculateWingBin(type_probs, 5);
    expect(wing_bin).toBeGreaterThanOrEqual(0);
    expect(wing_bin).toBeLessThanOrEqual(7);
  });

  it('should calculate instincts that sum to 1', () => {
    const instincts = calculateInstincts(mockAnswers, mockForcedChoiceItems, mockLikertItems);
    
    const sum = instincts.SP + instincts.SO + instincts.SX;
    expect(sum).toBeCloseTo(1, 5);

    // All instincts should be non-negative
    expect(instincts.SP).toBeGreaterThanOrEqual(0);
    expect(instincts.SO).toBeGreaterThanOrEqual(0);
    expect(instincts.SX).toBeGreaterThanOrEqual(0);
  });

  it('should calculate development bin within valid range', () => {
    const dimensions = {
      stability: 0.7,
      conscientiousness: 0.8,
      cooperativeness: 0.6,
      emotional_intensity: 0.3,
      agency: 0.5,
      empathy: 0.5,
      openness: 0.5,
      orderliness: 0.5,
      novelty_seeking: 0.5,
      abstract_reasoning: 0.5,
      social_dominance: 0.5,
      risk_tolerance: 0.5,
      adaptability: 0.5,
      imagination: 0.5
    };

    const dev_bin = calculateDevelopmentBin(dimensions);
    expect(dev_bin).toBeGreaterThanOrEqual(0);
    expect(dev_bin).toBeLessThanOrEqual(4);
  });

  it('should handle edge cases gracefully', () => {
    const emptyAnswers: AssessmentAnswers = {
      forcedChoice: [],
      likert: [],
      meta: {
        startTime: '2024-01-01T00:00:00Z',
        endTime: '2024-01-01T00:10:00Z'
      }
    };

    // Should not crash with empty answers
    expect(() => {
      calculateDimensions(emptyAnswers, [], []);
    }).not.toThrow();

    expect(() => {
      calculateInstincts(emptyAnswers, [], []);
    }).not.toThrow();
  });
});