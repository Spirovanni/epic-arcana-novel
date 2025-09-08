#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { familyFromChapter, idx40FromChapter, wingBinFromIdx40, devBinFromIdx40 } from '../lib/canonical'

interface PersonalityProfile {
  position: {
    family_number: number
    idx40: number
    wing_bin: number
    development_bin: number
    global_index: number
  }
  id: string
  chapter: number
  display_name: string
  theme: string
  family: string
  color_alignment: {
    hue_index: number
    hsl: string
    rgb_hex: string
    color_name: string
    rgb_values: {
      red: number
      green: number
      blue: number
    }
  }
  scoring_model?: {
    dimensions: Record<string, number>
  }
  thematic_essence?: {
    tagline?: string
    core_theme?: string
    focus_area?: string
    archetypal_family?: string
  }
  book_association?: {
    tarot_connection?: {
      family?: string
      card?: string
    }
  }
  [key: string]: any
}

interface StyleDefinition {
  visual_theme: string
  typography: {
    primary_font: string
    accent_font: string
    reading_level: string
  }
  color_palette: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  design_elements: {
    geometric_style: string
    pattern_type: string
    border_style: string
    icon_style: string
  }
  layout_preferences: {
    structure: string
    spacing: string
    alignment: string
    emphasis_style: string
  }
  content_tone: {
    formality: string
    warmth: string
    directness: string
    complexity: string
  }
}

function generateStyleForPersonality(profile: PersonalityProfile): StyleDefinition {
  const familyNumber = profile.position.family_number
  const wingBin = profile.position.wing_bin
  const devBin = profile.position.development_bin
  const dimensions = profile.scoring_model?.dimensions || {}
  const primaryColor = profile.color_alignment.rgb_hex
  const colorName = profile.color_alignment.color_name
  const theme = profile.theme
  const tarotFamily = profile.book_association?.tarot_connection?.family
  
  // Normalize dimensions to 0-1 if they're in 0-10 range
  const normDims: Record<string, number> = {}
  Object.entries(dimensions).forEach(([key, value]) => {
    normDims[key] = value > 1 ? value / 10 : value
  })

  // Generate color palette based on primary color and family
  const colorPalette = generateColorPalette(primaryColor, familyNumber)
  
  // Typography based on family and development level
  const typography = generateTypography(familyNumber, devBin, normDims)
  
  // Design elements based on family, wing, and archetypal associations
  const designElements = generateDesignElements(familyNumber, wingBin, tarotFamily)
  
  // Layout preferences based on dimensions and development
  const layoutPreferences = generateLayoutPreferences(normDims, devBin, wingBin)
  
  // Content tone based on personality characteristics
  const contentTone = generateContentTone(familyNumber, normDims, theme)
  
  // Visual theme combining all elements
  const visualTheme = generateVisualTheme(familyNumber, theme, colorName, devBin)

  return {
    visual_theme: visualTheme,
    typography,
    color_palette: colorPalette,
    design_elements: designElements,
    layout_preferences: layoutPreferences,
    content_tone: contentTone
  }
}

function generateColorPalette(primaryColor: string, familyNumber: number): StyleDefinition['color_palette'] {
  // Convert hex to RGB for calculations
  const hex = primaryColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Generate complementary and analogous colors
  const secondary = generateComplementaryColor(r, g, b)
  const accent = generateAnalogousColor(r, g, b, familyNumber)
  const background = generateBackgroundColor(r, g, b, familyNumber)
  const textColor = getOptimalTextColor(r, g, b)
  
  return {
    primary: primaryColor,
    secondary: secondary,
    accent: accent,
    background: background,
    text: textColor
  }
}

function generateComplementaryColor(r: number, g: number, b: number): string {
  // Generate a complementary color by rotating hue 180 degrees
  const complement_r = 255 - r
  const complement_g = 255 - g
  const complement_b = 255 - b
  
  // Adjust saturation to be harmonious
  const avg = (complement_r + complement_g + complement_b) / 3
  const adjusted_r = Math.round(avg + (complement_r - avg) * 0.7)
  const adjusted_g = Math.round(avg + (complement_g - avg) * 0.7)
  const adjusted_b = Math.round(avg + (complement_b - avg) * 0.7)
  
  return `#${adjusted_r.toString(16).padStart(2, '0')}${adjusted_g.toString(16).padStart(2, '0')}${adjusted_b.toString(16).padStart(2, '0')}`
}

function generateAnalogousColor(r: number, g: number, b: number, familyNumber: number): string {
  // Generate analogous color based on family characteristics
  const shift = familyNumber * 30 // 30-degree shifts
  const factor = 0.8
  
  const shifted_r = Math.round(Math.min(255, Math.max(0, r + (shift % 3 === 0 ? 40 : -20) * factor)))
  const shifted_g = Math.round(Math.min(255, Math.max(0, g + (shift % 3 === 1 ? 40 : -20) * factor)))
  const shifted_b = Math.round(Math.min(255, Math.max(0, b + (shift % 3 === 2 ? 40 : -20) * factor)))
  
  return `#${shifted_r.toString(16).padStart(2, '0')}${shifted_g.toString(16).padStart(2, '0')}${shifted_b.toString(16).padStart(2, '0')}`
}

function generateBackgroundColor(r: number, g: number, b: number, familyNumber: number): string {
  // Generate a very light version of the primary color for backgrounds
  const lightness = familyNumber <= 5 ? 0.95 : 0.92 // Subtle variation by family
  const bg_r = Math.round(255 - (255 - r) * (1 - lightness))
  const bg_g = Math.round(255 - (255 - g) * (1 - lightness))
  const bg_b = Math.round(255 - (255 - b) * (1 - lightness))
  
  return `#${bg_r.toString(16).padStart(2, '0')}${bg_g.toString(16).padStart(2, '0')}${bg_b.toString(16).padStart(2, '0')}`
}

function getOptimalTextColor(r: number, g: number, b: number): string {
  // Calculate luminance to determine optimal text color
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#2D3748' : '#F7FAFC' // Dark or light text
}

function generateTypography(familyNumber: number, devBin: number, dimensions: Record<string, number>): StyleDefinition['typography'] {
  const families = [
    { primary: 'Crimson Text', accent: 'Montserrat', level: 'formal' }, // Order/Systems
    { primary: 'Source Sans Pro', accent: 'Merriweather', level: 'warm' }, // Belonging/Care
    { primary: 'Roboto', accent: 'Oswald', level: 'dynamic' }, // Ambition/Mastery
    { primary: 'Playfair Display', accent: 'Source Sans Pro', level: 'expressive' }, // Authenticity/Expression
    { primary: 'Fira Sans', accent: 'Crimson Text', level: 'analytical' }, // Insight/Knowledge
    { primary: 'Open Sans', accent: 'Roboto Slab', level: 'reliable' }, // Security/Loyalty
    { primary: 'Nunito', accent: 'Quicksand', level: 'energetic' }, // Freedom/Discovery
    { primary: 'Rubik', accent: 'Merriweather', level: 'bold' }, // Sovereignty/Protection
    { primary: 'Lato', accent: 'Crimson Text', level: 'harmonious' } // Harmony/Integration
  ]
  
  const familyIndex = Math.max(0, Math.min(8, familyNumber - 1))
  const family = families[familyIndex]
  
  // Adjust reading level based on development and abstract_reasoning
  let readingLevel = family.level
  const abstractReasoning = dimensions.abstract_reasoning || 0.5
  const devLevel = devBin
  
  if (abstractReasoning > 0.7 && devLevel >= 3) {
    readingLevel = 'sophisticated'
  } else if (abstractReasoning < 0.3 || devLevel <= 1) {
    readingLevel = 'accessible'
  }
  
  return {
    primary_font: family.primary,
    accent_font: family.accent,
    reading_level: readingLevel
  }
}

function generateDesignElements(familyNumber: number, wingBin: number, tarotFamily?: string): StyleDefinition['design_elements'] {
  const geometricStyles = [
    'structured-grid', 'flowing-curves', 'dynamic-angles', 'organic-shapes',
    'minimal-lines', 'protective-borders', 'radiating-patterns', 'strong-blocks', 'circular-harmony'
  ]
  
  const patternTypes = [
    'systematic-grid', 'interwoven-lines', 'ascending-triangles', 'fluid-abstracts',
    'connection-nodes', 'fortress-shields', 'burst-rays', 'mountain-peaks', 'mandala-circles'
  ]
  
  const borderStyles = [
    'precise-lines', 'gentle-curves', 'sharp-edges', 'artistic-flourishes',
    'minimal-clean', 'layered-protection', 'energetic-breaks', 'bold-frames', 'soft-embrace'
  ]
  
  // Icon style based on tarot family if available
  let iconStyle = 'modern-minimal'
  if (tarotFamily) {
    switch (tarotFamily.toLowerCase()) {
      case 'swords': iconStyle = 'sharp-linear'; break
      case 'wands': iconStyle = 'dynamic-strokes'; break
      case 'cups': iconStyle = 'flowing-curves'; break
      case 'pentacles': iconStyle = 'grounded-solid'; break
      default: iconStyle = 'balanced-forms'
    }
  }
  
  // Wing influences create subtle variations
  const wingInfluence = wingBin / 7 // 0 to 1
  const styleIndex = Math.max(0, Math.min(8, familyNumber - 1))
  
  return {
    geometric_style: geometricStyles[styleIndex],
    pattern_type: patternTypes[styleIndex],
    border_style: borderStyles[styleIndex],
    icon_style: iconStyle
  }
}

function generateLayoutPreferences(dimensions: Record<string, number>, devBin: number, wingBin: number): StyleDefinition['layout_preferences'] {
  const orderliness = dimensions.orderliness || 0.5
  const openness = dimensions.openness || 0.5
  const adaptability = dimensions.adaptability || 0.5
  const socialDominance = dimensions.social_dominance || 0.5
  
  // Structure based on orderliness and development
  let structure = 'balanced-hierarchy'
  if (orderliness > 0.7) {
    structure = 'strict-grid'
  } else if (orderliness < 0.3 && openness > 0.6) {
    structure = 'fluid-organic'
  } else if (adaptability > 0.7) {
    structure = 'flexible-modules'
  }
  
  // Spacing based on wing and openness
  let spacing = 'medium-balanced'
  if (wingBin <= 2 && orderliness > 0.6) {
    spacing = 'tight-efficient'
  } else if (wingBin >= 6 && openness > 0.6) {
    spacing = 'generous-flowing'
  }
  
  // Alignment based on development and social dominance
  let alignment = 'center-balanced'
  if (socialDominance > 0.7) {
    alignment = 'left-strong'
  } else if (devBin >= 3 && openness > 0.6) {
    alignment = 'dynamic-varied'
  }
  
  // Emphasis style based on personality characteristics
  let emphasisStyle = 'subtle-highlights'
  if (socialDominance > 0.7) {
    emphasisStyle = 'bold-statements'
  } else if (dimensions.emotional_intensity > 0.7) {
    emphasisStyle = 'expressive-accents'
  } else if (orderliness > 0.7) {
    emphasisStyle = 'structured-emphasis'
  }
  
  return {
    structure,
    spacing,
    alignment,
    emphasis_style: emphasisStyle
  }
}

function generateContentTone(familyNumber: number, dimensions: Record<string, number>, theme: string): StyleDefinition['content_tone'] {
  const empathy = dimensions.empathy || 0.5
  const socialDominance = dimensions.social_dominance || 0.5
  const abstractReasoning = dimensions.abstract_reasoning || 0.5
  const emotionalIntensity = dimensions.emotional_intensity || 0.5
  
  // Formality based on family and abstract reasoning
  let formality = 'professional'
  if (familyNumber === 1 || familyNumber === 5) { // Order/Knowledge families
    formality = abstractReasoning > 0.6 ? 'academic' : 'structured'
  } else if (familyNumber === 2 || familyNumber === 9) { // Care/Harmony families
    formality = 'conversational'
  } else if (familyNumber === 7) { // Discovery family
    formality = 'casual-energetic'
  }
  
  // Warmth based on empathy and family
  let warmth = 'neutral-professional'
  if (empathy > 0.7) {
    warmth = 'warm-personal'
  } else if (empathy < 0.3 || familyNumber === 5) {
    warmth = 'cool-objective'
  } else if (familyNumber === 2 || familyNumber === 9) {
    warmth = 'gentle-supportive'
  }
  
  // Directness based on social dominance and family
  let directness = 'balanced-clear'
  if (socialDominance > 0.7 || familyNumber === 8) {
    directness = 'direct-assertive'
  } else if (familyNumber === 4 && emotionalIntensity > 0.6) {
    directness = 'nuanced-layered'
  } else if (familyNumber === 6) {
    directness = 'careful-considerate'
  }
  
  // Complexity based on abstract reasoning and development
  let complexity = 'moderate-accessible'
  if (abstractReasoning > 0.7) {
    complexity = 'sophisticated-nuanced'
  } else if (abstractReasoning < 0.4) {
    complexity = 'simple-clear'
  }
  
  return {
    formality,
    warmth,
    directness,
    complexity
  }
}

function generateVisualTheme(familyNumber: number, theme: string, colorName: string, devBin: number): string {
  const familyNames = [
    'Order', 'Care', 'Mastery', 'Expression', 'Knowledge', 'Loyalty', 'Discovery', 'Protection', 'Harmony'
  ]
  
  const familyName = familyNames[familyNumber - 1] || 'Balanced'
  const devLabels = ['Emerging', 'Developing', 'Applied', 'Refined', 'Transcendent']
  const devLabel = devLabels[devBin] || 'Applied'
  
  return `${devLabel} ${familyName} in ${colorName} - ${theme} Essence`
}

async function addStyleDataToProfiles() {
  console.log('🎨 Adding Style data points to all 360 personality profiles...')
  
  const filePath = path.join(process.cwd(), 'lsa-assessment/data/epic_arcana_personality_profiles_1-360_canonical.json')
  
  // Read the existing file
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    process.exit(1)
  }
  
  console.log('📖 Reading existing profiles...')
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const profiles: PersonalityProfile[] = JSON.parse(fileContent)
  
  console.log(`Found ${profiles.length} profiles to process`)
  
  // Create backup
  const backupPath = filePath.replace('.json', `_backup_${Date.now()}.json`)
  fs.writeFileSync(backupPath, fileContent)
  console.log(`💾 Backup created: ${backupPath}`)
  
  // Process each profile
  let processed = 0
  const errors: Array<{ chapter: number; error: string }> = []
  
  for (const profile of profiles) {
    try {
      // Generate style for this personality
      const style = generateStyleForPersonality(profile)
      
      // Add style to profile
      profile.style = style
      
      processed++
      
      if (processed % 50 === 0) {
        console.log(`✅ Processed ${processed}/${profiles.length} profiles`)
      }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      errors.push({ chapter: profile.chapter, error: errorMsg })
      console.error(`❌ Error processing chapter ${profile.chapter}: ${errorMsg}`)
    }
  }
  
  // Write updated profiles back to file
  console.log('💾 Writing updated profiles to file...')
  fs.writeFileSync(filePath, JSON.stringify(profiles, null, 2))
  
  console.log('\n📊 Style Addition Summary:')
  console.log(`✅ Successfully processed: ${processed}/360 profiles`)
  console.log(`❌ Errors: ${errors.length}`)
  
  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:')
    errors.forEach(({ chapter, error }) => {
      console.log(`  Chapter ${chapter}: ${error}`)
    })
  }
  
  // Generate sample report
  if (processed > 0) {
    generateStyleSampleReport(profiles.slice(0, 3))
  }
  
  console.log('\n🎉 Style data addition completed!')
  console.log(`📁 Updated file: ${filePath}`)
  console.log(`📁 Backup available: ${backupPath}`)
}

function generateStyleSampleReport(samples: PersonalityProfile[]) {
  let report = '# Personality Style Sample Report\n\n'
  
  samples.forEach(profile => {
    const style = (profile as any).style
    if (!style) return
    
    report += `## ${profile.display_name} (${profile.id})\n\n`
    report += `**Visual Theme:** ${style.visual_theme}\n\n`
    
    report += `**Typography:**\n`
    report += `- Primary Font: ${style.typography.primary_font}\n`
    report += `- Accent Font: ${style.typography.accent_font}\n`
    report += `- Reading Level: ${style.typography.reading_level}\n\n`
    
    report += `**Color Palette:**\n`
    report += `- Primary: ${style.color_palette.primary}\n`
    report += `- Secondary: ${style.color_palette.secondary}\n`
    report += `- Accent: ${style.color_palette.accent}\n`
    report += `- Background: ${style.color_palette.background}\n\n`
    
    report += `**Design Elements:**\n`
    report += `- Geometric Style: ${style.design_elements.geometric_style}\n`
    report += `- Pattern Type: ${style.design_elements.pattern_type}\n`
    report += `- Icon Style: ${style.design_elements.icon_style}\n\n`
    
    report += `**Content Tone:**\n`
    report += `- Formality: ${style.content_tone.formality}\n`
    report += `- Warmth: ${style.content_tone.warmth}\n`
    report += `- Directness: ${style.content_tone.directness}\n\n`
    
    report += '---\n\n'
  })
  
  const reportPath = './personality_style_samples.md'
  fs.writeFileSync(reportPath, report)
  console.log(`📄 Style sample report generated: ${reportPath}`)
}

// Run the script if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addStyleDataToProfiles().catch(error => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })
}

export { addStyleDataToProfiles, generateStyleForPersonality }