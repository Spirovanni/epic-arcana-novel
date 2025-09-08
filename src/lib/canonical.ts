// Canonical mapping (lock this logic exactly)
export function familyFromChapter(ch: number): number { 
  return Math.floor((ch - 1) / 40) + 1; 
}  // 1..9

export function idx40FromChapter(ch: number): number { 
  return (ch - 1) % 40; 
}  // 0..39

export function wingBinFromIdx40(idx40: number): number { 
  return Math.floor(idx40 / 5); 
}  // 0..7

export function devBinFromIdx40(idx40: number): number { 
  return idx40 % 5; 
}  // 0..4

export function chapterFromAssessment(
  dominant_type: number, 
  wing_bin: number, 
  development_bin: number
): number {
  const idx40 = wing_bin * 5 + development_bin;
  return (dominant_type - 1) * 40 + idx40 + 1; // 1..360
}

export function eaIdFromChapter(ch: number): string { 
  return `EA-${String(ch).padStart(3, "0")}`;
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
  9: "Harmony / Integration"
}