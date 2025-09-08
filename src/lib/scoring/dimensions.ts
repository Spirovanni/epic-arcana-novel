import { AssessmentAnswers, ForcedChoiceItem, LikertItem } from '../assessment/types'
import { DIMENSIONS } from '../assessment/mapping'

export function calculateDimensions(
  answers: AssessmentAnswers,
  forcedChoiceItems: ForcedChoiceItem[],
  likertItems: LikertItem[]
): Record<string, number> {
  const dimensionScores: Record<string, number> = {}
  
  // Initialize all dimensions to 0
  DIMENSIONS.forEach(dim => {
    dimensionScores[dim] = 0
  })

  // Process forced choice answers
  for (const answer of answers.forced) {
    const item = forcedChoiceItems.find(i => i.id === answer.itemId)
    if (!item) continue

    const bestOption = item.options[answer.best]
    const worstOption = item.options[answer.worst]

    // Best choice contributes full weight
    if (bestOption.keys.dimensions) {
      Object.entries(bestOption.keys.dimensions).forEach(([dim, weight]) => {
        if (dimensionScores[dim] !== undefined) {
          dimensionScores[dim] += weight
        }
      })
    }

    // Worst choice contributes negative half weight
    if (worstOption.keys.dimensions) {
      Object.entries(worstOption.keys.dimensions).forEach(([dim, weight]) => {
        if (dimensionScores[dim] !== undefined) {
          dimensionScores[dim] -= weight * 0.5
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

    if (item.keys.dimensions) {
      Object.entries(item.keys.dimensions).forEach(([dim, weight]) => {
        if (dimensionScores[dim] !== undefined) {
          dimensionScores[dim] += weight * scaledRating
        }
      })
    }
  }

  // Normalize to [0,1] range
  const minScore = Math.min(...Object.values(dimensionScores))
  const maxScore = Math.max(...Object.values(dimensionScores))
  const scoreRange = maxScore - minScore

  if (scoreRange === 0) {
    // If all scores are equal, set to 0.5
    Object.keys(dimensionScores).forEach(dim => {
      dimensionScores[dim] = 0.5
    })
  } else {
    Object.keys(dimensionScores).forEach(dim => {
      dimensionScores[dim] = (dimensionScores[dim] - minScore) / scoreRange
    })
  }

  return dimensionScores
}