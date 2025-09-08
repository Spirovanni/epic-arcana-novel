import { PersonalityContext } from './engine'

export interface ToneProfile {
  voice: 'warm' | 'crisp' | 'measured' | 'forthright'
  sentenceLength: 'short' | 'mixed' | 'long'
  imagery: 'low' | 'medium' | 'high'
}

export function chooseTone(context: PersonalityContext): ToneProfile {
  const { family_number, dimensions, development_bin } = context

  let voice: ToneProfile['voice'] = 'measured'
  let sentenceLength: ToneProfile['sentenceLength'] = 'mixed'
  let imagery: ToneProfile['imagery'] = 'medium'

  // Voice selection based on family and key dimensions
  if (family_number === 2 || family_number === 9) { // Care/Harmony
    voice = 'warm'
  } else if (family_number === 5 || (family_number === 1 && dimensions.abstract_reasoning > 0.6)) { // Knowledge/Systems+abstract
    voice = 'measured'
  } else if (family_number === 8 || (dimensions.social_dominance > 0.7)) { // Sovereignty/high dominance
    voice = 'forthright'
  } else if (family_number === 3 || family_number === 1) { // Mastery/Order
    voice = 'crisp'
  }

  // Sentence length based on thinking style and development
  if (dimensions.abstract_reasoning > 0.65 && dimensions.imagination > 0.6) {
    sentenceLength = 'long'
  } else if (dimensions.agency > 0.7 && dimensions.risk_tolerance > 0.6) {
    sentenceLength = 'short'
  } else {
    sentenceLength = 'mixed'
  }

  // Imagery level based on creativity and family
  if (family_number === 4 || family_number === 7) { // Expression/Discovery
    imagery = 'high'
  } else if (dimensions.imagination > 0.65 && dimensions.openness > 0.6) {
    imagery = 'high'
  } else if (family_number === 1 || family_number === 3 || family_number === 5) { // Systems/Mastery/Knowledge
    imagery = 'low'
  } else {
    imagery = 'medium'
  }

  // Development level refinements
  if (development_bin >= 3) {
    // More mature development tends toward measured, mixed approach
    if (voice === 'forthright' && dimensions.empathy > 0.5) {
      voice = 'crisp'
    }
  }

  return { voice, sentenceLength, imagery }
}

export function weave(textParts: string[], tone: ToneProfile): string {
  if (textParts.length === 0) return ''
  if (textParts.length === 1) return textParts[0]

  const connectors = getConnectors(tone)
  const result: string[] = [textParts[0]]

  for (let i = 1; i < textParts.length; i++) {
    const connector = connectors[Math.min(i - 1, connectors.length - 1)]
    result.push(connector, textParts[i])
  }

  let woven = result.join(' ')
  
  // Apply sentence length adjustments
  if (tone.sentenceLength === 'short') {
    woven = woven.replace(/,\s+and\s+/g, '. ').replace(/;\s+/g, '. ')
  } else if (tone.sentenceLength === 'long') {
    woven = woven.replace(/\.\s+/g, ', and ').replace(/;\s+/g, ', while ')
  }

  return woven
}

function getConnectors(tone: ToneProfile): string[] {
  const baseConnectors = {
    warm: ['while', 'as', 'and naturally', 'which allows'],
    crisp: ['then', 'so', 'thus', 'hence'],
    measured: ['while', 'given that', 'through which', 'whereby'],
    forthright: ['and', 'so', 'which means', 'resulting in']
  }

  return baseConnectors[tone.voice] || baseConnectors.measured
}

export function applyImagery(text: string, imagery: ToneProfile['imagery']): string {
  if (imagery === 'low') {
    // Remove metaphorical language, keep concrete
    return text
      .replace(/like a compass/g, 'with clear direction')
      .replace(/navigates?\s+/g, 'moves through ')
      .replace(/bridges?\s+/g, 'connects ')
  } else if (imagery === 'high') {
    // Enhance with more vivid language (but don't change meaning)
    return text
      .replace(/\bdecides?\b/g, 'navigates toward')
      .replace(/\bconnects?\b/g, 'bridges')
      .replace(/\borganizes?\b/g, 'orchestrates')
      .replace(/\bbalances?\b/g, 'harmonizes')
  }
  
  // Medium imagery - leave as is
  return text
}