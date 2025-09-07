export const FAMILY_LABELS: Record<number, string> = {
  1: "Order / Systems",
  2: "Belonging / Care", 
  3: "Ambition / Mastery",
  4: "Authenticity / Expression",
  5: "Insight / Knowledge",
  6: "Security / Loyalty",
  7: "Freedom / Discovery",
  8: "Sovereignty / Protection",
  9: "Harmony / Integration"
};

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
] as const;

export const W_DIM_TO_TYPE: Record<string, Record<string, number>> = {
  agency: { '1': 0.15, '2': 0.05, '3': 0.20, '4': 0.10, '5': 0.08, '6': 0.07, '7': 0.12, '8': 0.25, '9': 0.03 },
  stability: { '1': 0.18, '2': 0.12, '3': 0.08, '4': 0.05, '5': 0.15, '6': 0.20, '7': 0.02, '8': 0.10, '9': 0.25 },
  empathy: { '1': 0.08, '2': 0.25, '3': 0.05, '4': 0.20, '5': 0.03, '6': 0.15, '7': 0.10, '8': 0.05, '9': 0.22 },
  openness: { '1': 0.05, '2': 0.12, '3': 0.10, '4': 0.25, '5': 0.22, '6': 0.08, '7': 0.25, '8': 0.15, '9': 0.10 },
  orderliness: { '1': 0.25, '2': 0.15, '3': 0.18, '4': 0.05, '5': 0.20, '6': 0.18, '7': 0.03, '8': 0.12, '9': 0.15 },
  novelty_seeking: { '1': 0.03, '2': 0.08, '3': 0.15, '4': 0.20, '5': 0.12, '6': 0.05, '7': 0.25, '8': 0.18, '9': 0.05 },
  abstract_reasoning: { '1': 0.12, '2': 0.05, '3': 0.15, '4': 0.18, '5': 0.25, '6': 0.10, '7': 0.20, '8': 0.08, '9': 0.10 },
  emotional_intensity: { '1': 0.15, '2': 0.18, '3': 0.12, '4': 0.25, '5': 0.08, '6': 0.20, '7': 0.22, '8': 0.25, '9': 0.05 },
  social_dominance: { '1': 0.12, '2': 0.10, '3': 0.25, '4': 0.08, '5': 0.03, '6': 0.05, '7': 0.15, '8': 0.25, '9': 0.08 },
  cooperativeness: { '1': 0.10, '2': 0.25, '3': 0.08, '4': 0.12, '5': 0.05, '6': 0.18, '7': 0.10, '8': 0.05, '9': 0.25 },
  risk_tolerance: { '1': 0.05, '2': 0.08, '3': 0.18, '4': 0.15, '5': 0.10, '6': 0.03, '7': 0.25, '8': 0.25, '9': 0.08 },
  conscientiousness: { '1': 0.25, '2': 0.15, '3': 0.20, '4': 0.10, '5': 0.18, '6': 0.15, '7': 0.05, '8': 0.12, '9': 0.18 },
  adaptability: { '1': 0.08, '2': 0.18, '3': 0.15, '4': 0.20, '5': 0.12, '6': 0.10, '7': 0.25, '8': 0.15, '9': 0.22 },
  imagination: { '1': 0.10, '2': 0.15, '3': 0.12, '4': 0.25, '5': 0.20, '6': 0.08, '7': 0.25, '8': 0.10, '9': 0.18 }
};

export function DEV_INDEX(dimensions: Record<string, number>): number {
  const score = 0.5 * dimensions.stability + 
                0.3 * dimensions.conscientiousness + 
                0.2 * dimensions.cooperativeness - 
                0.2 * dimensions.emotional_intensity;
  return Math.max(0, Math.min(1, score));
}

export const S_BASE_BY_INSTINCT = {
  SP: 52,
  SO: 62, 
  SX: 72
};

export const L_BY_DEVBIN: Record<number, number> = {
  0: 74,
  1: 68,
  2: 60,
  3: 52,
  4: 46
};

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export const LAURASIA_LOCATIONS = [
  "Northern Gates of the Winter Citadels",
  "Twilight Bridges of the Ancient Quarter", 
  "Shared Hearths of the Merchant District",
  "Restored Rivers beneath the Commons",
  "Moonlit Commons where paths converge",
  "Archive of Quiet Stars",
  "Tower of Echoing Winds",
  "Garden of Reflecting Pools",
  "Hall of the First Covenant",
  "Sanctuary of the Nine Flames",
  "Observatory of Distant Lights",
  "Workshop of Bound Elements",
  "Library of Living Stories",
  "Council Chamber of the Resonant Voice",
  "Crossroads of the Seven Paths",
  "Temple of the Undivided Light",
  "Harbor of the Returning Tides",
  "Market of Endless Exchange"
];

export const VERSION = "1.0.0";