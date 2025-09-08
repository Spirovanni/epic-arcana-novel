import { AssessmentResult } from '@/lib/assessment/types'
import { PersonalityContext } from './engine'

export function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

export interface DimensionSummary {
  highs: Array<{ dimension: string; value: number; label: string }>
  lows: Array<{ dimension: string; value: number; label: string }>
  balanced: Array<{ dimension: string; value: number; label: string }>
}

export function summarizeDims(dimensions: Record<string, number>): DimensionSummary {
  const dimensionLabels: Record<string, string> = {
    agency: 'personal agency',
    stability: 'emotional stability', 
    empathy: 'empathic awareness',
    openness: 'openness to experience',
    orderliness: 'systematic organization',
    novelty_seeking: 'novelty exploration',
    abstract_reasoning: 'conceptual thinking',
    emotional_intensity: 'emotional intensity',
    social_dominance: 'social leadership',
    cooperativeness: 'collaborative spirit',
    risk_tolerance: 'risk tolerance',
    conscientiousness: 'methodical planning',
    adaptability: 'flexible adaptation',
    imagination: 'creative imagination'
  }

  const entries = Object.entries(dimensions)
    .map(([dim, value]) => ({
      dimension: dim,
      value,
      label: dimensionLabels[dim] || dim
    }))
    .sort((a, b) => b.value - a.value)

  return {
    highs: entries.filter(e => e.value >= 0.7).slice(0, 4),
    lows: entries.filter(e => e.value <= 0.3).slice(-3).reverse(),
    balanced: entries.filter(e => e.value > 0.3 && e.value < 0.7).slice(0, 3)
  }
}

export function instinctsStackLabel(instincts: { SP: number; SO: number; SX: number }): string {
  const stack = Object.entries(instincts)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value)
    .map(item => item.key)
  
  return stack.join('>')
}

export function getDominantInstinct(instincts: { SP: number; SO: number; SX: number }): 'SP' | 'SO' | 'SX' {
  const entries = Object.entries(instincts) as Array<['SP' | 'SO' | 'SX', number]>
  const sorted = entries.sort((a, b) => b[1] - a[1])
  return sorted[0][0]
}

export function pickExamples(context: PersonalityContext): string[] {
  const { dimensions, family_number, instincts, development_bin } = context
  const examples: string[] = []
  const dominant_instinct = getDominantInstinct(instincts)

  // Decision-making examples based on dimensions
  if (dimensions.risk_tolerance > 0.65) {
    if (dimensions.abstract_reasoning > 0.6) {
      examples.push("explores innovative solutions before consensus forms")
    } else {
      examples.push("acts decisively under pressure and corrects course openly")  
    }
  } else if (dimensions.risk_tolerance < 0.35) {
    examples.push("thoroughly evaluates options and seeks input before committing")
  }

  // Social interaction examples
  if (dimensions.social_dominance > 0.65 && dimensions.empathy > 0.6) {
    examples.push("naturally facilitates group discussions and synthesizes perspectives")
  } else if (dimensions.empathy > 0.7) {
    examples.push("attunes to others' unstated needs and adjusts approach accordingly")
  } else if (dimensions.social_dominance > 0.7) {
    examples.push("sets clear expectations and provides direct feedback")
  }

  // Planning and execution examples
  if (dimensions.orderliness > 0.65 && dimensions.conscientiousness > 0.6) {
    examples.push("creates structured timelines and tracks progress systematically")
  } else if (dimensions.adaptability > 0.65 && dimensions.novelty_seeking > 0.6) {
    examples.push("pivots quickly when new information emerges")
  }

  // Instinct-based behavioral examples
  if (dominant_instinct === 'SP') {
    examples.push("prioritizes sustainable pacing and resource management")
  } else if (dominant_instinct === 'SO') {
    examples.push("monitors group dynamics and builds inclusive environments")
  } else if (dominant_instinct === 'SX') {
    examples.push("intensely focuses on meaningful connections and projects")
  }

  // Family-specific behavioral tendencies
  switch (family_number) {
    case 1: // Order/Systems
      if (dimensions.agency > 0.65) {
        examples.push("addresses systemic issues through principled action")
      }
      break
    case 2: // Belonging/Care  
      if (dimensions.cooperativeness > 0.65) {
        examples.push("anticipates team needs and offers support proactively")
      }
      break
    case 3: // Ambition/Mastery
      if (dimensions.social_dominance > 0.6 && dimensions.conscientiousness > 0.6) {
        examples.push("sets ambitious goals and rallies others toward shared success")
      }
      break
    case 4: // Authenticity/Expression
      if (dimensions.emotional_intensity > 0.65) {
        examples.push("expresses authentic perspectives even when they differ from consensus")
      }
      break
    case 5: // Insight/Knowledge
      if (dimensions.abstract_reasoning > 0.65) {
        examples.push("synthesizes complex information into actionable frameworks")
      }
      break
    case 6: // Security/Loyalty
      if (dimensions.stability > 0.6 && dimensions.cooperativeness > 0.6) {
        examples.push("builds reliable systems and supports team resilience")
      }
      break
    case 7: // Freedom/Discovery
      if (dimensions.novelty_seeking > 0.65 && dimensions.imagination > 0.6) {
        examples.push("generates multiple creative options and maintains optimistic momentum")
      }
      break
    case 8: // Sovereignty/Protection
      if (dimensions.agency > 0.7 && dimensions.risk_tolerance > 0.6) {
        examples.push("takes charge in challenging situations and protects team interests")
      }
      break
    case 9: // Harmony/Integration
      if (dimensions.cooperativeness > 0.65 && dimensions.adaptability > 0.6) {
        examples.push("mediates competing priorities and finds win-win solutions")
      }
      break
  }

  // Development level adjustments
  if (development_bin >= 3) {
    examples.push("recognizes and adjusts patterns that no longer serve growth")
  }

  return examples.slice(0, 5) // Return top 5 most relevant examples
}

export function deriveSignals(result?: AssessmentResult): string[] {
  if (!result?.top_signal_items) return []
  return result.top_signal_items.slice(0, 8) // Top 8 signal items
}

// Family-specific heuristics for micro-adjustments
export function getFamilyHeuristics(family_number: number, dimensions: Record<string, number>): Record<string, string> {
  const heuristics: Record<string, string> = {}

  switch (family_number) {
    case 1: // Order/Systems
      if (dimensions.agency > 0.7 && dimensions.orderliness > 0.6) {
        heuristics.leadership = "leads through principled example and systematic improvement"
      }
      if (dimensions.emotional_intensity > 0.6) {
        heuristics.stress = "may become overly critical when standards aren't met"
      }
      break

    case 2: // Belonging/Care
      if (dimensions.empathy > 0.7 && dimensions.cooperativeness > 0.65) {
        heuristics.relationship = "intuitively senses relationship dynamics and fosters connection"
      }
      if (dimensions.agency < 0.4) {
        heuristics.growth = "benefits from setting clear personal boundaries"
      }
      break

    case 3: // Ambition/Mastery
      if (dimensions.social_dominance > 0.65 && dimensions.conscientiousness > 0.6) {
        heuristics.achievement = "drives results through strategic influence and persistent effort"
      }
      if (dimensions.empathy < 0.4) {
        heuristics.balance = "grows through attending to relationship impact alongside outcomes"
      }
      break

    case 4: // Authenticity/Expression
      if (dimensions.emotional_intensity > 0.7 && dimensions.imagination > 0.6) {
        heuristics.creativity = "transforms personal experience into meaningful creative expression"
      }
      if (dimensions.stability < 0.4) {
        heuristics.regulation = "benefits from grounding practices during emotional intensity"
      }
      break

    case 5: // Insight/Knowledge
      if (dimensions.abstract_reasoning > 0.7 && dimensions.orderliness > 0.6) {
        heuristics.expertise = "develops deep expertise through systematic investigation and synthesis"
      }
      if (dimensions.social_dominance < 0.3) {
        heuristics.sharing = "grows through sharing insights in accessible ways"
      }
      break

    case 6: // Security/Loyalty
      if (dimensions.cooperativeness > 0.7 && dimensions.conscientiousness > 0.6) {
        heuristics.support = "creates reliable structures that enable team success"
      }
      if (dimensions.risk_tolerance < 0.3) {
        heuristics.courage = "builds confidence through small, supported risks"
      }
      break

    case 7: // Freedom/Discovery
      if (dimensions.novelty_seeking > 0.7 && dimensions.adaptability > 0.65) {
        heuristics.innovation = "generates possibilities and adapts quickly to new information"
      }
      if (dimensions.conscientiousness < 0.4) {
        heuristics.follow_through = "benefits from systems that support completion of important projects"
      }
      break

    case 8: // Sovereignty/Protection
      if (dimensions.agency > 0.7 && dimensions.risk_tolerance > 0.65) {
        heuristics.leadership = "takes decisive action and protects team resources and wellbeing"
      }
      if (dimensions.empathy < 0.4) {
        heuristics.influence = "maximizes impact through collaborative rather than dominating approaches"
      }
      break

    case 9: // Harmony/Integration
      if (dimensions.cooperativeness > 0.7 && dimensions.adaptability > 0.65) {
        heuristics.mediation = "naturally sees multiple perspectives and facilitates inclusive solutions"
      }
      if (dimensions.agency < 0.4) {
        heuristics.assertion = "grows through expressing personal priorities and taking initiative"
      }
      break
  }

  return heuristics
}