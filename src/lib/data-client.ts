// Client-side data utilities - no fs imports
import { CanonicalProfile } from './assessment/types'

export async function fetchProfileByChapter(chapter: number): Promise<CanonicalProfile | null> {
  try {
    const response = await fetch(`/api/profiles/${chapter}`)
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

// Fallback profile generator for client-side use
export function generateFallbackProfile(chapter: number): CanonicalProfile {
  const family_number = Math.floor((chapter - 1) / 40) + 1
  const idx40 = (chapter - 1) % 40
  const wing_bin = Math.floor(idx40 / 5)
  const development_bin = idx40 % 5
  
  const families = [
    'Challenger', 'Peacemaker', 'Perfectionist', 'Helper', 'Achiever',
    'Individualist', 'Investigator', 'Loyalist', 'Enthusiast'
  ]
  
  const family = families[family_number - 1] || 'Explorer'
  const ea_id = `EA${String(chapter).padStart(3, '0')}`
  const display_name = `${family} ${wing_bin + 1}.${development_bin + 1}`
  const theme = `Exploring ${family.toLowerCase()} dynamics`
  
  return {
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
    strengths: [`Strong ${family.toLowerCase()} traits`, 'Adaptive approach', 'Balanced perspective'],
    shadows: ['Over-emphasis on core pattern', 'Potential blind spots', 'Growth opportunities'],
    growth_focus: ['Develop complementary skills', 'Integrate different perspectives', 'Balance core strengths']
  }
}