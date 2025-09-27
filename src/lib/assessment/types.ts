import { z } from 'zod'

// Assessment Item Types
export const ForcedChoiceOptionSchema = z.object({
  label: z.string(),
  keys: z.object({
    dimensions: z.record(z.string(), z.number()),
    types: z.object({
      '1': z.number().optional(),
      '2': z.number().optional(),
      '3': z.number().optional(),
      '4': z.number().optional(),
      '5': z.number().optional(),
      '6': z.number().optional(),
      '7': z.number().optional(),
      '8': z.number().optional(),
      '9': z.number().optional(),
    }),
    instincts: z.object({
      SP: z.number().optional(),
      SO: z.number().optional(),
      SX: z.number().optional(),
    }).optional(),
  }),
})

export const ForcedChoiceItemSchema = z.object({
  id: z.string(),
  center: z.enum(['Body', 'Heart', 'Head']),
  location: z.string(),
  vignette: z.string(),
  format: z.literal('forced_choice_best_worst'),
  options: z.array(ForcedChoiceOptionSchema).length(3),
})

export const LikertItemSchema = z.object({
  id: z.string(),
  center: z.enum(['Body', 'Heart', 'Head']),
  location: z.string(),
  statement: z.string(),
  scale: z.tuple([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  keys: z.object({
    dimensions: z.record(z.string(), z.number()),
    types: z.object({
      '1': z.number().optional(),
      '2': z.number().optional(),
      '3': z.number().optional(),
      '4': z.number().optional(),
      '5': z.number().optional(),
      '6': z.number().optional(),
      '7': z.number().optional(),
      '8': z.number().optional(),
      '9': z.number().optional(),
    }),
    instincts: z.object({
      SP: z.number().optional(),
      SO: z.number().optional(),
      SX: z.number().optional(),
    }).optional(),
  }),
})

// Answer Types
export const ForcedChoiceAnswerSchema = z.object({
  itemId: z.string(),
  best: z.number().int().min(0).max(2),
  worst: z.number().int().min(0).max(2),
})

export const LikertAnswerSchema = z.object({
  itemId: z.string(),
  rating: z.number().int().min(1).max(5),
})

export const AssessmentAnswersSchema = z.object({
  forced: z.array(ForcedChoiceAnswerSchema),
  likert: z.array(LikertAnswerSchema),
  meta: z.object({
    startTime: z.string(),
    endTime: z.string().optional(),
    userAgent: z.string().optional(),
    duration_sec: z.number().optional(),
  }).optional(),
})

// Result Types
export const AssessmentResultSchema = z.object({
  dimensions: z.record(
    z.enum([
      'agency', 'stability', 'empathy', 'openness', 'orderliness', 'novelty_seeking',
      'abstract_reasoning', 'emotional_intensity', 'social_dominance', 'cooperativeness',
      'risk_tolerance', 'conscientiousness', 'adaptability', 'imagination'
    ]),
    z.number().min(0).max(1)
  ),
  type_probs: z.record(z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9']), z.number().min(0).max(1)),
  dominant_type: z.number().int().min(1).max(9),
  wing_bin: z.number().int().min(0).max(7),
  development_bin: z.number().int().min(0).max(4),
  instincts: z.object({
    SP: z.number().min(0).max(1),
    SO: z.number().min(0).max(1),
    SX: z.number().min(0).max(1),
  }),
  chapter: z.number().int().min(1).max(360),
  ea_id: z.string().regex(/^EA-\d{3}$/),
  color: z.object({
    hsl: z.string(),
    rgb_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    hue_index: z.number().int().min(0).max(359),
  }),
  profile: z.object({
    id: z.string(),
    chapter: z.number(),
    display_name: z.string(),
    theme: z.string(),
    family: z.string(),
  }),
  top_signal_items: z.array(z.string()),
  meta: z.object({
    duration_sec: z.number(),
    version: z.string(),
    item_pack: z.string(),
  }),
})

// TypeScript types
export type ForcedChoiceOption = z.infer<typeof ForcedChoiceOptionSchema>
export type ForcedChoiceItem = z.infer<typeof ForcedChoiceItemSchema>
export type LikertItem = z.infer<typeof LikertItemSchema>
export type ForcedChoiceAnswer = z.infer<typeof ForcedChoiceAnswerSchema>
export type LikertAnswer = z.infer<typeof LikertAnswerSchema>
export type AssessmentAnswers = z.infer<typeof AssessmentAnswersSchema>
export type AssessmentResult = z.infer<typeof AssessmentResultSchema>

// Canonical Profile Type
export type CanonicalProfile = {
  chapter: number
  ea_id: string
  display_name: string
  theme: string
  family: string
  family_number: number
  wing_bin: number
  development_bin: number
  color: {
    hsl: string
    rgb_hex: string
    hue_index: number
  }
  strengths?: string[]
  shadows?: string[]
  growth_focus?: string[]
}