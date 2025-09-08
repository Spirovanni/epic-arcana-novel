import { AssessmentResult } from '@/lib/assessment/types'
import { loadExtendedCanonicalProfiles, ExtendedCanonicalProfile } from '@/lib/data'
import { familyFromChapter, idx40FromChapter, wingBinFromIdx40, devBinFromIdx40, eaIdFromChapter } from '@/lib/canonical'
import { chooseTone, weave, applyImagery } from './tone'
import { FAMILY_TEMPLATES, PARAGRAPH_ORDER, MUTATIONS, ParagraphType } from './templates'
import { deriveSignals, pickExamples, summarizeDims, getDominantInstinct } from './rules'

export interface PersonalityContext {
  chapter: number
  ea_id: string
  display_name: string
  family_number: 1|2|3|4|5|6|7|8|9
  family: string
  theme: string
  color_hex: string
  wing_bin: number
  development_bin: number
  dimensions: Record<string, number>
  type_probs: Record<string, number>
  instincts: { SP: number; SO: number; SX: number }
  dominant_instinct: 'SP'|'SO'|'SX'
  top_signal_items: string[]
}

export interface PersonalStyleSection {
  chapter: number
  ea_id: string
  display_name: string
  family_number: 1|2|3|4|5|6|7|8|9
  theme: string
  color_hex: string
  paragraphs: string[]         // 5–7 paragraphs
  highlights: string[]         // 5–8 short bullets (behavior summaries)
  signals_used: string[]       // item IDs
  version: string              // "PS-1.0.0"
}

export async function buildPersonalStyleForChapter(chapter: number): Promise<PersonalStyleSection> {
  // Static baseline Personal Style for that profile
  const profiles = await loadExtendedCanonicalProfiles()
  const profile = profiles.find(p => p.chapter === chapter)
  
  if (!profile) {
    throw new Error(`Profile not found for chapter ${chapter}`)
  }

  // Create baseline context with default values
  const context = createBaselineContext(profile)
  
  return generatePersonalStyle(context, chapter)
}

export async function buildPersonalStyleForResult(result: AssessmentResult): Promise<PersonalStyleSection> {
  // Personalized — blends baseline + scoring adjustments from result
  const profiles = await loadExtendedCanonicalProfiles()
  const profile = profiles.find(p => p.chapter === result.chapter)
  
  if (!profile) {
    throw new Error(`Profile not found for chapter ${result.chapter}`)
  }

  // Create personalized context from assessment result
  const context = createPersonalizedContext(profile, result)
  
  return generatePersonalStyle(context, result.chapter)
}

function createBaselineContext(profile: ExtendedCanonicalProfile): PersonalityContext {
  const familyNumber = familyFromChapter(profile.chapter) as 1|2|3|4|5|6|7|8|9
  const idx40 = idx40FromChapter(profile.chapter)
  const wingBin = wingBinFromIdx40(idx40)
  const devBin = devBinFromIdx40(idx40)

  // Default baseline dimensions (moderate values)
  const baselineDimensions = {
    agency: 0.5,
    stability: 0.5,
    empathy: 0.5,
    openness: 0.5,
    orderliness: 0.5,
    novelty_seeking: 0.5,
    abstract_reasoning: 0.5,
    emotional_intensity: 0.5,
    social_dominance: 0.5,
    cooperativeness: 0.5,
    risk_tolerance: 0.5,
    conscientiousness: 0.5,
    adaptability: 0.5,
    imagination: 0.5
  }

  // Apply family-based adjustments to baseline
  const familyAdjustments = getFamilyDimensionAdjustments(familyNumber)
  const dimensions = { ...baselineDimensions }
  
  Object.entries(familyAdjustments).forEach(([dim, adjustment]) => {
    dimensions[dim] = Math.max(0, Math.min(1, baselineDimensions[dim] + adjustment))
  })

  // Use scoring model if available from profile
  if (profile.scoring_model?.dimensions) {
    Object.entries(profile.scoring_model.dimensions).forEach(([dim, value]) => {
      if (dimensions.hasOwnProperty(dim)) {
        // Normalize to 0-1 range if needed (assuming input might be 0-10)
        dimensions[dim] = value > 1 ? value / 10 : value
      }
    })
  }

  return {
    chapter: profile.chapter,
    ea_id: profile.ea_id || eaIdFromChapter(profile.chapter),
    display_name: profile.display_name,
    family_number: familyNumber,
    family: profile.family,
    theme: profile.theme,
    color_hex: profile.color_alignment?.rgb_hex || profile.color?.rgb_hex || '#6B7280',
    wing_bin: wingBin,
    development_bin: devBin,
    dimensions,
    type_probs: createBaselineTypeProbs(familyNumber),
    instincts: { SP: 0.33, SO: 0.33, SX: 0.34 }, // Balanced baseline
    dominant_instinct: 'SX', // Default
    top_signal_items: []
  }
}

function createPersonalizedContext(profile: ExtendedCanonicalProfile, result: AssessmentResult): PersonalityContext {
  const familyNumber = result.dominant_type as 1|2|3|4|5|6|7|8|9
  
  return {
    chapter: result.chapter,
    ea_id: result.ea_id,
    display_name: result.profile.display_name,
    family_number: familyNumber,
    family: result.profile.family,
    theme: result.profile.theme,
    color_hex: result.color.rgb_hex,
    wing_bin: result.wing_bin,
    development_bin: result.development_bin,
    dimensions: result.dimensions,
    type_probs: result.type_probs,
    instincts: result.instincts,
    dominant_instinct: getDominantInstinct(result.instincts),
    top_signal_items: result.top_signal_items
  }
}

function createBaselineTypeProbs(familyNumber: number): Record<string, number> {
  // Create baseline type probabilities with dominant type having highest probability
  const probs: Record<string, number> = {
    '1': 0.05, '2': 0.05, '3': 0.05, '4': 0.05, '5': 0.05,
    '6': 0.05, '7': 0.05, '8': 0.05, '9': 0.05
  }
  
  // Dominant type gets higher probability
  probs[familyNumber.toString()] = 0.65
  
  // Adjacent types get moderate probabilities
  const leftType = familyNumber === 1 ? 9 : familyNumber - 1
  const rightType = familyNumber === 9 ? 1 : familyNumber + 1
  probs[leftType.toString()] = 0.15
  probs[rightType.toString()] = 0.15
  
  return probs
}

function getFamilyDimensionAdjustments(familyNumber: number): Record<string, number> {
  // Adjustments to baseline dimensions based on family characteristics
  const adjustments: Record<number, Record<string, number>> = {
    1: { orderliness: 0.3, conscientiousness: 0.2, agency: 0.2 },
    2: { empathy: 0.3, cooperativeness: 0.25, social_dominance: -0.1 },
    3: { social_dominance: 0.25, conscientiousness: 0.2, agency: 0.2 },
    4: { emotional_intensity: 0.3, imagination: 0.25, empathy: 0.15 },
    5: { abstract_reasoning: 0.3, orderliness: 0.15, social_dominance: -0.2 },
    6: { stability: 0.2, cooperativeness: 0.2, risk_tolerance: -0.25 },
    7: { novelty_seeking: 0.3, adaptability: 0.25, imagination: 0.2 },
    8: { agency: 0.3, social_dominance: 0.25, risk_tolerance: 0.2 },
    9: { cooperativeness: 0.3, adaptability: 0.2, social_dominance: -0.15 }
  }

  return adjustments[familyNumber] || {}
}

async function generatePersonalStyle(context: PersonalityContext, seed: number): Promise<PersonalStyleSection> {
  const familyTemplate = FAMILY_TEMPLATES[context.family_number]
  if (!familyTemplate) {
    throw new Error(`No template found for family ${context.family_number}`)
  }

  // Choose tone based on context
  const tone = chooseTone(context)

  // Generate paragraphs
  const paragraphs: string[] = []
  for (const paragraphType of PARAGRAPH_ORDER) {
    let paragraph = familyTemplate(context, paragraphType, seed)
    
    // Apply tone adjustments
    paragraph = applyImagery(paragraph, tone.imagery)
    
    // Apply mutations based on wing, development, and instincts
    paragraph = applyMutations(paragraph, context)
    
    paragraphs.push(paragraph)
  }

  // Generate highlights (behavioral bullets)
  const highlights = generateHighlights(context, seed)

  // Get signals used
  const signals_used = context.top_signal_items

  return {
    chapter: context.chapter,
    ea_id: context.ea_id,
    display_name: context.display_name,
    family_number: context.family_number,
    theme: context.theme,
    color_hex: context.color_hex,
    paragraphs,
    highlights,
    signals_used,
    version: "PS-1.0.0"
  }
}

function applyMutations(text: string, context: PersonalityContext): string {
  let modified = text

  // Apply wing mutations
  const wingMutations = MUTATIONS.wingBin(context.wing_bin)
  Object.entries(wingMutations).forEach(([from, to]) => {
    modified = modified.replace(new RegExp(`\\b${from}\\b`, 'gi'), to)
  })

  // Apply development mutations
  const devMutations = MUTATIONS.devBin(context.development_bin)
  Object.entries(devMutations).forEach(([from, to]) => {
    modified = modified.replace(new RegExp(`\\b${from}\\b`, 'gi'), to)
  })

  // Apply instinct mutations
  const instinctMutations = MUTATIONS.instincts(context.dominant_instinct)
  Object.entries(instinctMutations).forEach(([from, to]) => {
    modified = modified.replace(new RegExp(`\\b${from}\\b`, 'gi'), to)
  })

  return modified
}

function generateHighlights(context: PersonalityContext, seed: number): string[] {
  const examples = pickExamples(context)
  const dimSummary = summarizeDims(context.dimensions)
  const highlights: string[] = []

  // Convert examples to action-oriented bullets
  examples.forEach(example => {
    // Extract action verb and create highlight
    if (example.includes('explores')) {
      highlights.push('Explores innovative solutions and creative alternatives')
    } else if (example.includes('acts decisively')) {
      highlights.push('Acts decisively under pressure and adapts course')
    } else if (example.includes('evaluates')) {
      highlights.push('Evaluates options thoroughly before committing')
    } else if (example.includes('facilitates')) {
      highlights.push('Facilitates group discussions and synthesizes perspectives')
    } else if (example.includes('attunes')) {
      highlights.push('Attunes to others\' needs and adjusts approach accordingly')
    } else if (example.includes('sets clear')) {
      highlights.push('Sets clear expectations and provides direct feedback')
    } else if (example.includes('creates structured')) {
      highlights.push('Creates structured timelines and tracks progress systematically')
    } else if (example.includes('pivots quickly')) {
      highlights.push('Pivots quickly when new information emerges')
    } else if (example.includes('prioritizes sustainable')) {
      highlights.push('Prioritizes sustainable pacing and resource management')
    } else if (example.includes('monitors group')) {
      highlights.push('Monitors group dynamics and builds inclusive environments')
    } else if (example.includes('intensely focuses')) {
      highlights.push('Intensely focuses on meaningful connections and projects')
    } else {
      // Generic conversion - extract key action
      const actionMatch = example.match(/(\w+s)\s+/)
      if (actionMatch) {
        const action = actionMatch[1].charAt(0).toUpperCase() + actionMatch[1].slice(1)
        const rest = example.split(' ').slice(1, 6).join(' ')
        highlights.push(`${action} ${rest}`)
      } else {
        // Fallback: create generic highlight from example
        const words = example.split(' ')
        if (words.length > 0) {
          const capitalized = words[0].charAt(0).toUpperCase() + words[0].slice(1)
          highlights.push(`${capitalized} ${words.slice(1, 6).join(' ')}`)
        }
      }
    }
  })

  // Add dimension-based highlights
  dimSummary.highs.slice(0, 3).forEach(high => {
    switch (high.dimension) {
      case 'empathy':
        highlights.push('Demonstrates natural empathy and emotional attunement')
        break
      case 'agency':
        highlights.push('Takes initiative and drives meaningful change')
        break
      case 'orderliness':
        highlights.push('Organizes systems and maintains quality standards')
        break
      case 'social_dominance':
        highlights.push('Provides leadership and influences positive outcomes')
        break
      case 'imagination':
        highlights.push('Generates creative ideas and innovative solutions')
        break
      case 'risk_tolerance':
        highlights.push('Embraces calculated risks and adapts to change')
        break
      case 'cooperativeness':
        highlights.push('Collaborates effectively and supports team success')
        break
    }
  })

  // Add family-specific highlights (guaranteed)
  switch (context.family_number) {
    case 1:
      highlights.push('Maintains principled standards and systematic improvement')
      highlights.push('Addresses problems through structured analysis and ethical action')
      break
    case 2:
      highlights.push('Provides caring support and fosters genuine connection')
      highlights.push('Anticipates others\' needs and offers proactive assistance')
      break
    case 3:
      highlights.push('Drives results through strategic action and influence')
      highlights.push('Adapts approach to achieve successful outcomes efficiently')
      break
    case 4:
      highlights.push('Expresses authentic perspective and creative insight')
      highlights.push('Transforms personal experience into meaningful contribution')
      break
    case 5:
      highlights.push('Develops expertise through systematic investigation')
      highlights.push('Synthesizes complex information into clear frameworks')
      break
    case 6:
      highlights.push('Builds reliable systems and supports team resilience')
      highlights.push('Anticipates risks and prepares contingency approaches')
      break
    case 7:
      highlights.push('Generates possibilities and maintains optimistic momentum')
      highlights.push('Connects diverse ideas and creates innovative solutions')
      break
    case 8:
      highlights.push('Takes charge in challenging situations and protects interests')
      highlights.push('Makes tough decisions and advocates for important values')
      break
    case 9:
      highlights.push('Mediates competing priorities and finds win-win solutions')
      highlights.push('Creates inclusive environments where everyone can contribute')
      break
  }

  // Add more guaranteed highlights if needed
  while (highlights.length < 5) {
    highlights.push('Demonstrates consistent reliability in important commitments')
    highlights.push('Adapts communication style to different audiences and contexts')
    highlights.push('Balances individual goals with collective well-being')
    highlights.push('Maintains perspective during challenging situations')
    highlights.push('Seeks continuous improvement through feedback and reflection')
  }

  // Return 5-8 unique highlights
  const unique = [...new Set(highlights)]
  return unique.slice(0, 8)
}