import { CanonicalProfile } from '../schema.js';
import { FAMILY_LABELS } from '../constants.js';
import * as fs from 'fs';
import * as path from 'path';

export function chapterFromAssessment(params: {
  dominant_type: number;
  wing_bin: number;
  development_bin: number;
}): number {
  const { dominant_type, wing_bin, development_bin } = params;
  const idx40 = wing_bin * 5 + development_bin;
  return (dominant_type - 1) * 40 + idx40 + 1;
}

export function eaIdFromChapter(chapter: number): string {
  return `EA-${chapter.toString().padStart(3, '0')}`;
}

export function parseChapterComponents(chapter: number): {
  family_number: number;
  wing_bin: number;
  development_bin: number;
  global_index: number;
  hue_index: number;
} {
  const idx40 = (chapter - 1) % 40;
  const wing_bin = Math.floor(idx40 / 5);
  const development_bin = idx40 % 5;
  const family_number = Math.floor((chapter - 1) / 40) + 1;
  const global_index = chapter;
  const hue_index = chapter - 1;

  return {
    family_number,
    wing_bin,
    development_bin,
    global_index,
    hue_index
  };
}

export async function getCanonicalProfile(chapter: number): Promise<CanonicalProfile | null> {
  try {
    // Try to load from the canonical file first
    const canonicalPath = path.join(process.cwd(), 'data', 'epic_arcana_personality_profiles_1-360_canonical.json');
    
    if (fs.existsSync(canonicalPath)) {
      const canonicalData = JSON.parse(fs.readFileSync(canonicalPath, 'utf-8'));
      const profile = canonicalData.find((p: any) => p.chapter === chapter);
      if (profile) {
        return profile as CanonicalProfile;
      }
    }
  } catch (error) {
    console.warn('Could not load canonical profiles, computing basic profile:', error);
  }

  // Fallback: compute basic canonical profile
  return computeBasicCanonicalProfile(chapter);
}

function computeBasicCanonicalProfile(chapter: number): CanonicalProfile {
  const components = parseChapterComponents(chapter);
  const ea_id = eaIdFromChapter(chapter);
  const family = FAMILY_LABELS[components.family_number];
  
  // Generate basic display name and theme
  const display_name = `${family} Explorer ${components.wing_bin + 1}.${components.development_bin + 1}`;
  const theme = `Exploring ${family.toLowerCase()} through ${getThemeVariation(components.wing_bin, components.development_bin)}`;
  
  // Basic color calculation (will be overridden by actual color calculation)
  const hsl = `hsl(${components.hue_index}, 60%, 60%)`;
  const rgb_hex = '#888888'; // placeholder
  
  return {
    chapter,
    ea_id,
    display_name,
    theme,
    family,
    family_number: components.family_number,
    wing_bin: components.wing_bin,
    development_bin: components.development_bin,
    color: {
      hsl,
      rgb_hex,
      hue_index: components.hue_index
    },
    strengths: [`Strong ${family.split(' ')[0].toLowerCase()}`, 'Adaptive approach', 'Balanced perspective'],
    shadows: ['Over-emphasis on strengths', 'Potential blind spots', 'Growth opportunities'],
    growth_focus: ['Develop complementary skills', 'Integrate different perspectives', 'Balance core strengths']
  };
}

function getThemeVariation(wing_bin: number, development_bin: number): string {
  const wingVariations = [
    'structured foundation',
    'adaptive integration', 
    'dynamic expression',
    'innovative synthesis',
    'balanced harmony',
    'creative transformation',
    'purposeful evolution',
    'mastered integration'
  ];
  
  const devVariations = [
    'emerging awareness',
    'developing skills',
    'applied competence', 
    'refined mastery',
    'transcendent wisdom'
  ];
  
  return `${wingVariations[wing_bin]} with ${devVariations[development_bin]}`;
}