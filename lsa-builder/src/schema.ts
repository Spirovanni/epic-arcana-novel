import { z } from 'zod';

export const ProfileSchema = z.object({
  position: z.object({
    family_number: z.number().int().min(1).max(9),
    idx40: z.number().int().min(0).max(39),
    wing_bin: z.number().int().min(0).max(7),
    development_bin: z.number().int().min(0).max(4),
    global_index: z.number().int().min(1).max(360)
  }),
  id: z.string().regex(/^EA-\d{3}$/),
  chapter: z.number().int().min(1).max(360),
  display_name: z.string().min(2),
  theme: z.string().min(1),
  family: z.string().min(1),
  summary: z.string().min(10),
  traits: z.object({
    strengths: z.array(z.string()).min(3),
    shadow: z.array(z.string()).min(3),
    growth_focus: z.array(z.string()).min(3)
  }),
  book_association: z.object({
    nonfiction_series: z.literal("The Human Framework"),
    fiction_series: z.literal("Laurasia"),
    chapter_theme: z.string().min(1)
  }),
  enneagram_link: z.object({
    family_number: z.number().int().min(1).max(9),
    note: z.string()
  }),
  color_alignment: z.object({
    hue_index: z.number().int().min(0).max(359),
    hsl: z.string().regex(/^\d{1,3},\d{1,3}%,\d{1,3}%$/),
    rgb_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    palette_locked: z.boolean().optional(),
    palette_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
    name: z.string().optional()
  }),
  scoring_model: z.object({
    dimensions: z.object({
      agency: z.number(),
      stability: z.number(),
      empathy: z.number(),
      openness: z.number(),
      orderliness: z.number(),
      novelty_seeking: z.number(),
      abstract_reasoning: z.number(),
      emotional_intensity: z.number(),
      social_dominance: z.number(),
      cooperativeness: z.number(),
      risk_tolerance: z.number(),
      conscientiousness: z.number(),
      adaptability: z.number(),
      imagination: z.number()
    }),
    match_weights: z.object({
      agency: z.number(),
      stability: z.number(),
      conscientiousness: z.number()
    }),
    threshold: z.number(),
    top_signal_items: z.array(z.string()).min(2)
  }),
  signals_map: z.record(z.string(), z.object({
    dimension: z.string(),
    polarity: z.number()
  })),
  daily_prompt: z.string().min(5),
  story_hook: z.string().min(10)
});

export type PersonalityProfile = z.infer<typeof ProfileSchema>;