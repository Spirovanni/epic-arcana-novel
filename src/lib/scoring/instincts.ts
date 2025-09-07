import { AssessmentAnswers, ForcedChoiceItem, LikertItem } from '../assessment/types'

export function calculateInstincts(
  answers: AssessmentAnswers,
  forcedChoiceItems: ForcedChoiceItem[],
  likertItems: LikertItem[]
): { SP: number; SO: number; SX: number } {
  
  const instinctScores = { SP: 0, SO: 0, SX: 0 }

  // Process forced choice answers
  for (const answer of answers.forcedChoice) {
    const item = forcedChoiceItems.find(i => i.id === answer.itemId)
    if (!item) continue

    const bestOption = item.options[answer.best]
    const worstOption = item.options[answer.worst]

    // Best choice contributes full weight
    if (bestOption.keys.instincts) {
      Object.entries(bestOption.keys.instincts).forEach(([instinct, weight]) => {
        if (weight !== undefined && instinctScores[instinct as keyof typeof instinctScores] !== undefined) {
          instinctScores[instinct as keyof typeof instinctScores] += weight
        }
      })
    }

    // Worst choice contributes negative half weight
    if (worstOption.keys.instincts) {
      Object.entries(worstOption.keys.instincts).forEach(([instinct, weight]) => {
        if (weight !== undefined && instinctScores[instinct as keyof typeof instinctScores] !== undefined) {
          instinctScores[instinct as keyof typeof instinctScores] -= weight * 0.5
        }
      })
    }
  }

  // Process likert answers
  for (const answer of answers.likert) {
    const item = likertItems.find(i => i.id === answer.itemId)
    if (!item) continue

    // Convert 1-5 scale to -1 to +1 range
    const scaledRating = (answer.rating - 3) / 2

    if (item.keys.instincts) {
      Object.entries(item.keys.instincts).forEach(([instinct, weight]) => {
        if (weight !== undefined && instinctScores[instinct as keyof typeof instinctScores] !== undefined) {
          instinctScores[instinct as keyof typeof instinctScores] += weight * scaledRating
        }
      })
    }
  }

  // Normalize to [0,1] range
  const totalScore = Math.max(0.001, instinctScores.SP + instinctScores.SO + instinctScores.SX)
  
  // Ensure all scores are non-negative before normalizing
  const minScore = Math.min(instinctScores.SP, instinctScores.SO, instinctScores.SX)
  if (minScore < 0) {
    instinctScores.SP -= minScore
    instinctScores.SO -= minScore 
    instinctScores.SX -= minScore
  }

  const adjustedTotal = instinctScores.SP + instinctScores.SO + instinctScores.SX
  if (adjustedTotal > 0) {
    return {
      SP: instinctScores.SP / adjustedTotal,
      SO: instinctScores.SO / adjustedTotal,
      SX: instinctScores.SX / adjustedTotal
    }
  }

  // Fallback to equal distribution if all scores are zero
  return { SP: 1/3, SO: 1/3, SX: 1/3 }
}

export function getDominantInstinct(instincts: { SP: number; SO: number; SX: number }): 'SP' | 'SO' | 'SX' {
  if (instincts.SP >= instincts.SO && instincts.SP >= instincts.SX) return 'SP'
  if (instincts.SO >= instincts.SX) return 'SO'
  return 'SX'
}