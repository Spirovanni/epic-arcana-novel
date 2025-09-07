// Canonical mapping functions - locked exactly as specified
export function familyFromChapter(chapter: number): number {
  return Math.floor((chapter - 1) / 40) + 1
}

export function idx40FromChapter(chapter: number): number {
  return (chapter - 1) % 40
}

export function wingBinFromIdx40(idx40: number): number {
  return Math.floor(idx40 / 5) // 0..7
}

export function devBinFromIdx40(idx40: number): number {
  return idx40 % 5 // 0..4
}

export function chapterFromAssessment(res: {
  dominant_type: number
  wing_bin: number
  development_bin: number
}): number {
  const idx40 = res.wing_bin * 5 + res.development_bin
  return (res.dominant_type - 1) * 40 + idx40 + 1
}

export function eaIdFromChapter(chapter: number): string {
  return `EA-${String(chapter).padStart(3, "0")}`
}

export const FAMILY_LABELS: Record<number, string> = {
  1: "Order / Systems",
  2: "Belonging / Care",
  3: "Ambition / Mastery",
  4: "Authenticity / Expression",
  5: "Insight / Knowledge",
  6: "Security / Loyalty",
  7: "Freedom / Discovery",
  8: "Sovereignty / Protection",
  9: "Harmony / Integration",
}

// Dimensions for scoring
export const DIMENSIONS = [
  'agency',
  'stability', 
  'empathy',
  'openness',
  'orderliness',
  'novelty_seeking',
  'abstract_reasoning',
  'emotional_intensity',
  'social_dominance',
  'cooperativeness',
  'risk_tolerance',
  'conscientiousness',
  'adaptability',
  'imagination'
] as const

// Color constants
export const S_BASE_BY_INSTINCT = {
  SP: 52,
  SO: 62,
  SX: 72
}

export const L_BY_DEVBIN: Record<number, number> = {
  0: 74,
  1: 68,
  2: 60,
  3: 52,
  4: 46
}

// Development index function
export function DEV_INDEX(dimensions: Record<string, number>): number {
  const score = 0.5 * dimensions.stability + 
                0.3 * dimensions.conscientiousness + 
                0.2 * dimensions.cooperativeness - 
                0.2 * dimensions.emotional_intensity
  return Math.max(0, Math.min(1, score))
}

// HSL to HEX conversion
export function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}