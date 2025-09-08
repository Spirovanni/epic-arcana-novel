import { describe, it, expect, beforeAll } from 'vitest'
import { buildPersonalStyleForChapter, buildPersonalStyleForResult } from '../src/content/personalStyle'
import type { AssessmentResult } from '../src/lib/assessment/types'

describe('Personal Style System', () => {
  describe('buildPersonalStyleForChapter', () => {
    it('should build personal style for all 9 family types', async () => {
      // Test one chapter from each family (1, 41, 81, 121, 161, 201, 241, 281, 321)
      const testChapters = [1, 41, 81, 121, 161, 201, 241, 281, 321]
      
      for (const chapter of testChapters) {
        const result = await buildPersonalStyleForChapter(chapter)
        const familyNumber = Math.floor((chapter - 1) / 40) + 1
        
        // Basic structure validation
        expect(result).toBeDefined()
        expect(result.chapter).toBe(chapter)
        expect(result.ea_id).toMatch(/^EA-\d{3}$/)
        expect(result.family_number).toBe(familyNumber)
        expect(result.version).toBe('PS-1.0.0')
        
        // Content validation
        expect(result.paragraphs).toHaveLength(6) // identity, operating, decisions, collaboration, stress, growth
        expect(result.highlights.length).toBeGreaterThanOrEqual(5)
        expect(result.highlights.length).toBeLessThanOrEqual(8)
        
        // Content quality validation
        const totalContent = result.paragraphs.join(' ')
        expect(totalContent.length).toBeGreaterThan(500)
        
        // No placeholder validation
        result.paragraphs.forEach((paragraph, index) => {
          expect(paragraph).not.toContain('[[')
          expect(paragraph).not.toContain('{{')
          expect(paragraph).not.toContain('placeholder')
          expect(paragraph).toMatch(/[.!?]$/) // Ends with punctuation
          expect(paragraph.length).toBeGreaterThan(50) // Minimum length
          expect(paragraph.length).toBeLessThan(1000) // Maximum length
        }, `Family ${familyNumber} paragraph validation`)
        
        // Highlights validation
        result.highlights.forEach((highlight, index) => {
          expect(highlight.length).toBeGreaterThan(10)
          expect(highlight.length).toBeLessThan(100)
          expect(highlight).toMatch(/^[A-Z]/) // Starts with capital letter
        }, `Family ${familyNumber} highlight validation`)
      }
    }, 30000) // 30 second timeout for all families

    it('should produce deterministic output for same chapter', async () => {
      const chapter = 42
      const result1 = await buildPersonalStyleForChapter(chapter)
      const result2 = await buildPersonalStyleForChapter(chapter)
      
      // Should be identical
      expect(result1.paragraphs).toEqual(result2.paragraphs)
      expect(result1.highlights).toEqual(result2.highlights)
      expect(result1.display_name).toEqual(result2.display_name)
    })

    it('should produce different content for different chapters in same family', async () => {
      // Two chapters from family 3 (Ambition/Mastery)
      const result1 = await buildPersonalStyleForChapter(81) // First chapter of family 3
      const result2 = await buildPersonalStyleForChapter(82) // Second chapter of family 3
      
      expect(result1.family_number).toBe(result2.family_number) // Same family
      
      // Content should be different (at least some variation)
      const differences = result1.paragraphs.filter((p, i) => p !== result2.paragraphs[i])
      expect(differences.length).toBeGreaterThanOrEqual(2) // At least 2 paragraphs should differ
    })

    it('should handle edge cases', async () => {
      // Test first and last chapters
      const firstChapter = await buildPersonalStyleForChapter(1)
      const lastChapter = await buildPersonalStyleForChapter(360)
      
      expect(firstChapter.chapter).toBe(1)
      expect(firstChapter.family_number).toBe(1)
      expect(firstChapter.ea_id).toBe('EA-001')
      
      expect(lastChapter.chapter).toBe(360)
      expect(lastChapter.family_number).toBe(9)
      expect(lastChapter.ea_id).toBe('EA-360')
    })
  })

  describe('buildPersonalStyleForResult', () => {
    // Create a sample assessment result for testing
    const sampleResult: AssessmentResult = {
      dimensions: {
        agency: 0.8,
        stability: 0.6,
        empathy: 0.9,
        openness: 0.7,
        orderliness: 0.4,
        novelty_seeking: 0.8,
        abstract_reasoning: 0.6,
        emotional_intensity: 0.7,
        social_dominance: 0.5,
        cooperativeness: 0.8,
        risk_tolerance: 0.6,
        conscientiousness: 0.5,
        adaptability: 0.9,
        imagination: 0.8
      },
      type_probs: {
        '1': 0.05,
        '2': 0.65, // Dominant type 2
        '3': 0.10,
        '4': 0.15,
        '5': 0.02,
        '6': 0.01,
        '7': 0.01,
        '8': 0.01,
        '9': 0.01
      },
      dominant_type: 2,
      wing_bin: 3,
      development_bin: 2,
      instincts: {
        SP: 0.2,
        SO: 0.7, // Dominant
        SX: 0.1
      },
      chapter: 83,
      ea_id: 'EA-083',
      color: {
        hsl: '210,65%,58%',
        rgb_hex: '#4A90E2',
        hue_index: 210
      },
      profile: {
        id: 'EA-083',
        chapter: 83,
        display_name: 'The Collaborative Helper',
        theme: 'Collaborative Support',
        family: 'Belonging / Care'
      },
      top_signal_items: ['Q1', 'Q5', 'Q12', 'Q18', 'Q23'],
      meta: {
        duration_sec: 1200,
        version: '1.0.0',
        item_pack: 'standard'
      }
    }

    it('should create personalized content based on assessment result', async () => {
      const result = await buildPersonalStyleForResult(sampleResult)
      
      // Should match the assessment result data
      expect(result.chapter).toBe(sampleResult.chapter)
      expect(result.ea_id).toBe(sampleResult.ea_id)
      expect(result.display_name).toBe(sampleResult.profile.display_name)
      expect(result.family_number).toBe(sampleResult.dominant_type)
      expect(result.color_hex).toBe(sampleResult.color.rgb_hex)
      
      // Should have signals
      expect(result.signals_used).toEqual(sampleResult.top_signal_items)
      
      // Content quality checks
      expect(result.paragraphs).toHaveLength(6)
      expect(result.highlights.length).toBeGreaterThanOrEqual(5)
      expect(result.highlights.length).toBeLessThanOrEqual(8)
    })

    it('should produce different content than baseline for same chapter', async () => {
      const baselineResult = await buildPersonalStyleForChapter(sampleResult.chapter)
      const personalizedResult = await buildPersonalStyleForResult(sampleResult)
      
      // Should be different due to personalization
      const differences = baselineResult.paragraphs.filter((p, i) => 
        p !== personalizedResult.paragraphs[i]
      )
      expect(differences.length).toBeGreaterThanOrEqual(2) // At least 2 paragraphs should be personalized
    })

    it('should reflect high dimension values in content', async () => {
      // Create result with high empathy
      const highEmpathyResult: AssessmentResult = {
        ...sampleResult,
        dimensions: {
          ...sampleResult.dimensions,
          empathy: 0.95,
          cooperativeness: 0.9
        }
      }
      
      const result = await buildPersonalStyleForResult(highEmpathyResult)
      const content = result.paragraphs.join(' ').toLowerCase()
      
      // Should contain empathy-related language
      expect(
        content.includes('empathy') || 
        content.includes('empathic') || 
        content.includes('attune') ||
        content.includes('emotional')
      ).toBe(true)
    })
  })

  describe('Content Quality Validation', () => {
    it('should have appropriate reading level', async () => {
      const result = await buildPersonalStyleForChapter(100)
      
      result.paragraphs.forEach(paragraph => {
        // Check for complex sentence structures (rough reading level check)
        const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0)
        const avgWordsPerSentence = sentences.reduce((sum, sentence) => 
          sum + sentence.trim().split(/\s+/).length, 0
        ) / sentences.length
        
        // Should be readable but not overly simple (8-20 words per sentence average)
        expect(avgWordsPerSentence).toBeGreaterThan(8)
        expect(avgWordsPerSentence).toBeLessThan(25)
      })
    })

    it('should avoid repetitive language across paragraphs', async () => {
      const result = await buildPersonalStyleForChapter(150)
      
      // Check for excessive repetition of common words
      const allText = result.paragraphs.join(' ').toLowerCase()
      const words = allText.split(/\s+/)
      
      const wordCounts: Record<string, number> = {}
      words.forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '')
        if (cleanWord.length > 4) { // Only check longer words
          wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1
        }
      })
      
      // No word should appear more than 5 times (except very common ones)
      const commonWords = ['through', 'while', 'often', 'approach', 'others', 'situations']
      Object.entries(wordCounts).forEach(([word, count]) => {
        if (!commonWords.includes(word) && count > 5) {
          console.warn(`Word '${word}' appears ${count} times in chapter 150`)
        }
      })
    })

    it('should include concrete behavioral examples', async () => {
      const result = await buildPersonalStyleForChapter(200)
      
      // Should have specific behavioral language
      const content = result.paragraphs.join(' ')
      const behavioralPatterns = [
        /\w+s early/,
        /time-?boxes? \w+/,
        /names? the \w+/,
        /mediates? \w+/,
        /creates? \w+/,
        /maintains? \w+/,
        /approaches? \w+/,
        /evaluates? \w+/,
        /facilitates? \w+/
      ]
      
      const hasSpecificBehaviors = behavioralPatterns.some(pattern => 
        pattern.test(content)
      )
      
      expect(hasSpecificBehaviors).toBe(true)
    })
  })

  describe('Deterministic Behavior', () => {
    it('should produce identical results for multiple builds of same input', async () => {
      const builds = await Promise.all([
        buildPersonalStyleForChapter(175),
        buildPersonalStyleForChapter(175),
        buildPersonalStyleForChapter(175)
      ])
      
      // All builds should be identical
      expect(builds[0]).toEqual(builds[1])
      expect(builds[1]).toEqual(builds[2])
    })
  })

  describe('Lint Checks', () => {
    it('should pass all lint checks', async () => {
      const samples = [15, 127, 240, 333] // Sample from different families
      
      for (const chapter of samples) {
        const result = await buildPersonalStyleForChapter(chapter)
        
        // All paragraphs should end with punctuation
        result.paragraphs.forEach((paragraph, index) => {
          expect(paragraph).toMatch(/[.!?]$/)
        })
        
        // Highlights should be properly formatted
        result.highlights.forEach((highlight, index) => {
          expect(highlight).toMatch(/^[A-Z]/)
          expect(highlight).not.toMatch(/[.!?]$/) // Highlights shouldn't end with punctuation
        })
        
        // No double spaces or formatting issues
        result.paragraphs.forEach(paragraph => {
          expect(paragraph).not.toContain('  ') // No double spaces
          expect(paragraph).not.toMatch(/\s[.!?]/) // No space before punctuation
        })
      }
    })
  })
})