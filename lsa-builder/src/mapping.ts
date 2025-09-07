export function familyFromChapter(chapter: number): number {
  return Math.floor((chapter - 1) / 40) + 1;
}

export function idx40FromChapter(chapter: number): number {
  return (chapter - 1) % 40;
}

export function wingBinFromIdx40(idx40: number): number {
  return Math.floor(idx40 / 5); // 0..7
}

export function devBinFromIdx40(idx40: number): number {
  return idx40 % 5; // 0..4
}

export function hueIndexFromChapter(chapter: number): number {
  return chapter - 1; // 0..359
}

export function idFromChapter(chapter: number): string {
  return `EA-${String(chapter).padStart(3, "0")}`;
}

export type AssessmentResult = {
  dominant_type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  wing_bin: number; // 0..7
  development_bin: number; // 0..4
};

export function chapterFromAssessment(res: AssessmentResult): number {
  const idx40 = res.wing_bin * 5 + res.development_bin; // 0..39
  return (res.dominant_type - 1) * 40 + idx40 + 1;
}

export function eaIdFromAssessment(res: AssessmentResult): string {
  return idFromChapter(chapterFromAssessment(res));
}