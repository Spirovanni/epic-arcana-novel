import { AssessmentAnswers, ForcedChoiceItem, LikertItem } from '../assessment/types'

// Dimension to type weighting matrix
const W_DIM_TO_TYPE: Record<string, Record<string, number>> = {
  agency: { '1': 0.15, '2': 0.05, '3': 0.20, '4': 0.10, '5': 0.08, '6': 0.07, '7': 0.12, '8': 0.25, '9': 0.03 },
  stability: { '1': 0.18, '2': 0.12, '3': 0.08, '4': 0.05, '5': 0.15, '6': 0.20, '7': 0.02, '8': 0.10, '9': 0.25 },
  empathy: { '1': 0.08, '2': 0.25, '3': 0.05, '4': 0.20, '5': 0.03, '6': 0.15, '7': 0.10, '8': 0.05, '9': 0.22 },
  openness: { '1': 0.05, '2': 0.12, '3': 0.10, '4': 0.25, '5': 0.22, '6': 0.08, '7': 0.25, '8': 0.15, '9': 0.10 },
  orderliness: { '1': 0.25, '2': 0.15, '3': 0.18, '4': 0.05, '5': 0.20, '6': 0.18, '7': 0.03, '8': 0.12, '9': 0.15 },
  novelty_seeking: { '1': 0.03, '2': 0.08, '3': 0.15, '4': 0.20, '5': 0.12, '6': 0.05, '7': 0.25, '8': 0.18, '9': 0.05 },
  abstract_reasoning: { '1': 0.12, '2': 0.05, '3': 0.15, '4': 0.18, '5': 0.25, '6': 0.10, '7': 0.20, '8': 0.08, '9': 0.10 },
  emotional_intensity: { '1': 0.15, '2': 0.18, '3': 0.12, '4': 0.25, '5': 0.08, '6': 0.20, '7': 0.22, '8': 0.25, '9': 0.05 },
  social_dominance: { '1': 0.12, '2': 0.10, '3': 0.25, '4': 0.08, '5': 0.03, '6': 0.05, '7': 0.15, '8': 0.25, '9': 0.08 },
  cooperativeness: { '1': 0.10, '2': 0.25, '3': 0.08, '4': 0.12, '5': 0.05, '6': 0.18, '7': 0.10, '8': 0.05, '9': 0.25 },
  risk_tolerance: { '1': 0.05, '2': 0.08, '3': 0.18, '4': 0.15, '5': 0.10, '6': 0.03, '7': 0.25, '8': 0.25, '9': 0.08 },
  conscientiousness: { '1': 0.25, '2': 0.15, '3': 0.20, '4': 0.10, '5': 0.18, '6': 0.15, '7': 0.05, '8': 0.12, '9': 0.18 },
  adaptability: { '1': 0.08, '2': 0.18, '3': 0.15, '4': 0.20, '5': 0.12, '6': 0.10, '7': 0.25, '8': 0.15, '9': 0.22 },
  imagination: { '1': 0.10, '2': 0.15, '3': 0.12, '4': 0.25, '5': 0.20, '6': 0.08, '7': 0.25, '8': 0.10, '9': 0.18 }
}

export function calculateTypeProbs(
  answers: AssessmentAnswers,
  forcedChoiceItems: ForcedChoiceItem[],
  likertItems: LikertItem[],
  dimensions: Record<string, number>
): { type_probs: Record<string, number>; dominant_type: number } {
  
  const typeLogits: Record<string, number> = {
    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0
  }

  // Add direct type contributions from answers
  for (const answer of answers.forcedChoice) {
    const item = forcedChoiceItems.find(i => i.id === answer.itemId)
    if (!item) continue

    const bestOption = item.options[answer.best]
    const worstOption = item.options[answer.worst]

    // Best choice contributes full weight
    if (bestOption.keys.types) {
      Object.entries(bestOption.keys.types).forEach(([type, weight]) => {
        typeLogits[type] += weight
      })
    }

    // Worst choice contributes negative half weight  
    if (worstOption.keys.types) {
      Object.entries(worstOption.keys.types).forEach(([type, weight]) => {
        typeLogits[type] -= weight * 0.5
      })
    }
  }

  for (const answer of answers.likert) {
    const item = likertItems.find(i => i.id === answer.itemId)
    if (!item) continue

    // Convert 1-5 scale to -1 to +1 range
    const scaledRating = (answer.rating - 3) / 2

    if (item.keys.types) {
      Object.entries(item.keys.types).forEach(([type, weight]) => {
        typeLogits[type] += weight * scaledRating
      })
    }
  }

  // Add dimension-to-type contributions using W_DIM_TO_TYPE matrix
  Object.entries(dimensions).forEach(([dim, dimScore]) => {
    if (W_DIM_TO_TYPE[dim]) {
      Object.entries(W_DIM_TO_TYPE[dim]).forEach(([type, weight]) => {
        typeLogits[type] += weight * dimScore
      })
    }
  })

  // Apply softmax to get probabilities
  const maxLogit = Math.max(...Object.values(typeLogits))
  const expLogits: Record<string, number> = {}
  let sumExp = 0

  Object.entries(typeLogits).forEach(([type, logit]) => {
    expLogits[type] = Math.exp(logit - maxLogit)
    sumExp += expLogits[type]
  })

  const type_probs: Record<string, number> = {}
  Object.entries(expLogits).forEach(([type, exp]) => {
    type_probs[type] = exp / sumExp
  })

  // Find dominant type
  let dominant_type = 1
  let maxProb = type_probs['1']
  
  Object.entries(type_probs).forEach(([type, prob]) => {
    if (prob > maxProb) {
      maxProb = prob
      dominant_type = parseInt(type)
    }
  })

  return { type_probs, dominant_type }
}

export function calculateWingBin(type_probs: Record<string, number>, dominant_type: number): number {
  // Calculate wing scalar based on adjacent types
  const left_type = dominant_type === 1 ? 9 : dominant_type - 1
  const right_type = dominant_type === 9 ? 1 : dominant_type + 1
  
  const T_left = type_probs[left_type.toString()]
  const T_right = type_probs[right_type.toString()]
  
  // Wing scalar: w = (T_right - T_left) / (T_right + T_left + epsilon)
  const epsilon = 1e-6
  const w = (T_right - T_left) / (T_right + T_left + epsilon)
  
  // Map to 8 discrete bins [-1, 1] -> [0, 7]
  const wing_bin = Math.floor((w + 1) * 4)
  return Math.max(0, Math.min(7, wing_bin))
}