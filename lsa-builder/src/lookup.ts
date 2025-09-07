import { AssessmentResult, chapterFromAssessment } from './mapping';
import { PersonalityProfile } from './schema';

// This will be generated after repair runs
let merged: PersonalityProfile[] = [];

try {
  merged = require('../dist/epic_arcana_personality_profiles_1-360_canonical.json');
} catch (error) {
  console.warn('Canonical profiles not found. Run "npm run build" first.');
}

export function resolveProfile(res: AssessmentResult): PersonalityProfile | undefined {
  const ch = chapterFromAssessment(res);
  return merged.find(p => p.chapter === ch);
}

export function getProfileByChapter(chapter: number): PersonalityProfile | undefined {
  return merged.find(p => p.chapter === chapter);
}

export function getAllProfiles(): PersonalityProfile[] {
  return merged;
}