// Server-side only - do not import in client components
import { CanonicalProfile } from './assessment/types'
import { FAMILY_LABELS, eaIdFromChapter } from './canonical'
import fs from 'fs'
import path from 'path'

let canonicalProfiles: CanonicalProfile[] | null = null
let chapterOutlines: any[] | null = null

export async function loadCanonicalProfiles(): Promise<CanonicalProfile[]> {
  if (canonicalProfiles) return canonicalProfiles

  try {
    const canonicalPath = path.join(process.cwd(), 'data', 'dist', 'epic_arcana_personality_profiles_1-360_canonical.json')
    
    if (fs.existsSync(canonicalPath)) {
      const data = JSON.parse(fs.readFileSync(canonicalPath, 'utf-8'))
      canonicalProfiles = Array.isArray(data) ? data : Object.values(data)
      return canonicalProfiles
    }
  } catch (error) {
    console.warn('Could not load canonical profiles, computing fallback:', error)
  }

  // Fallback: generate basic canonical profiles
  canonicalProfiles = generateFallbackProfiles()
  return canonicalProfiles
}

function generateFallbackProfiles(): CanonicalProfile[] {
  const profiles: CanonicalProfile[] = []
  
  for (let chapter = 1; chapter <= 360; chapter++) {
    const family_number = Math.floor((chapter - 1) / 40) + 1
    const idx40 = (chapter - 1) % 40
    const wing_bin = Math.floor(idx40 / 5)
    const development_bin = idx40 % 5
    
    const family = FAMILY_LABELS[family_number]
    const ea_id = eaIdFromChapter(chapter)
    const display_name = `${family} Explorer ${wing_bin + 1}.${development_bin + 1}`
    const theme = `Exploring ${family.toLowerCase()} through ${getThemeVariation(wing_bin, development_bin)}`
    
    profiles.push({
      chapter,
      ea_id,
      display_name,
      theme,
      family,
      family_number,
      wing_bin,
      development_bin,
      color: {
        hsl: `hsl(${chapter - 1}, 60%, 60%)`,
        rgb_hex: '#888888',
        hue_index: chapter - 1
      },
      strengths: [`Strong ${family.split(' ')[0].toLowerCase()}`, 'Adaptive approach', 'Balanced perspective'],
      shadows: ['Over-emphasis on strengths', 'Potential blind spots', 'Growth opportunities'],
      growth_focus: ['Develop complementary skills', 'Integrate different perspectives', 'Balance core strengths']
    })
  }
  
  return profiles
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
  ]
  
  const devVariations = [
    'emerging awareness',
    'developing skills',
    'applied competence', 
    'refined mastery',
    'transcendent wisdom'
  ]
  
  return `${wingVariations[wing_bin]} with ${devVariations[development_bin]}`
}

// Lazy loader for chapter outlines with graceful fallback
export async function loadChapterOutlines(): Promise<any[]> {
  if (chapterOutlines) return chapterOutlines

  try {
    const outlinesPath = path.join(process.cwd(), 'data', 'l_outline.json')
    
    if (fs.existsSync(outlinesPath)) {
      const data = JSON.parse(fs.readFileSync(outlinesPath, 'utf-8'))
      chapterOutlines = Array.isArray(data) ? data : Object.values(data)
      return chapterOutlines
    }
  } catch (error) {
    console.warn('Could not load chapter outlines, using fallback:', error)
  }

  // Fallback: generate basic chapter outlines
  chapterOutlines = generateFallbackOutlines()
  return chapterOutlines
}

// Get a specific canonical profile by chapter
export async function getCanonicalProfile(chapter: number): Promise<CanonicalProfile | null> {
  const profiles = await loadCanonicalProfiles()
  return profiles.find(p => p.chapter === chapter) || null
}

// Get chapter theme by chapter number
export async function getChapterTheme(chapter: number): Promise<string> {
  const outlines = await loadChapterOutlines()
  const outline = outlines.find(o => o.chapter === chapter)
  return outline?.theme || `Chapter ${chapter} Theme`
}

function generateFallbackOutlines(): any[] {
  const outlines = []
  
  for (let chapter = 1; chapter <= 360; chapter++) {
    const family_number = Math.floor((chapter - 1) / 40) + 1
    const familyName = FAMILY_LABELS[family_number].split(' / ')[0]
    
    outlines.push({
      chapter,
      theme: `${familyName} Journey ${((chapter - 1) % 40) + 1}`,
      description: `A narrative exploration of ${familyName.toLowerCase()} through personality development.`
    })
  }
  
  return outlines
}