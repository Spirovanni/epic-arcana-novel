import { AssessmentAnswers, AssessmentResult, ForcedChoiceItem, LikertItem } from '../schema.js';
import { VERSION } from '../constants.js';
import { calculateDimensions } from './dimensions.js';
import { calculateTypeProbs, calculateWingBin } from './types.js';
import { calculateInstincts } from './instincts.js';
import { calculateDevelopmentBin } from './bins.js';
import { calculateColor } from './color.js';
import { chapterFromAssessment, eaIdFromChapter, getCanonicalProfile } from './resolve.js';

export async function scoreAssessment(
  answers: AssessmentAnswers,
  forcedChoiceItems: ForcedChoiceItem[],
  likertItems: LikertItem[]
): Promise<AssessmentResult> {
  
  // Calculate 14 dimensions
  const dimensions = calculateDimensions(answers, forcedChoiceItems, likertItems);
  
  // Calculate type probabilities and dominant type
  const { type_probs, dominant_type } = calculateTypeProbs(answers, forcedChoiceItems, likertItems, dimensions);
  
  // Calculate wing bin
  const wing_bin = calculateWingBin(type_probs, dominant_type);
  
  // Calculate development bin
  const development_bin = calculateDevelopmentBin(dimensions);
  
  // Calculate instincts
  const instincts = calculateInstincts(answers, forcedChoiceItems, likertItems);
  
  // Calculate chapter and EA ID
  const chapter = chapterFromAssessment({ dominant_type, wing_bin, development_bin });
  const ea_id = eaIdFromChapter(chapter);
  
  // Calculate color
  const color = calculateColor(chapter, instincts, dimensions, development_bin);
  
  // Find top signal items (items with highest absolute contributions)
  const top_signal_items = findTopSignalItems(answers, forcedChoiceItems, likertItems);
  
  // Calculate duration
  const startTime = new Date(answers.meta.startTime);
  const endTime = new Date(answers.meta.endTime);
  const duration_sec = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
  
  const result: AssessmentResult = {
    dimensions,
    type_probs,
    dominant_type,
    wing_bin,
    development_bin,
    instincts,
    chapter,
    ea_id,
    color,
    top_signal_items,
    meta: {
      duration_sec,
      form: 'lsa_assessment',
      version: VERSION
    }
  };
  
  return result;
}

function findTopSignalItems(
  answers: AssessmentAnswers,
  forcedChoiceItems: ForcedChoiceItem[],
  likertItems: LikertItem[],
  topCount: number = 5
): string[] {
  
  const itemContributions: { id: string; contribution: number }[] = [];
  
  // Analyze forced choice contributions
  for (const answer of answers.forcedChoice) {
    const item = forcedChoiceItems.find(i => i.id === answer.itemId);
    if (!item) continue;
    
    const bestOption = item.options[answer.best];
    const worstOption = item.options[answer.worst];
    
    let totalContribution = 0;
    
    // Sum up all dimension and type contributions
    if (bestOption.keys.dimensions) {
      totalContribution += Object.values(bestOption.keys.dimensions).reduce((sum, val) => sum + Math.abs(val), 0);
    }
    if (bestOption.keys.types) {
      totalContribution += Object.values(bestOption.keys.types).reduce((sum, val) => sum + Math.abs(val), 0);
    }
    
    if (worstOption.keys.dimensions) {
      totalContribution += Object.values(worstOption.keys.dimensions).reduce((sum, val) => sum + Math.abs(val) * 0.5, 0);
    }
    if (worstOption.keys.types) {
      totalContribution += Object.values(worstOption.keys.types).reduce((sum, val) => sum + Math.abs(val) * 0.5, 0);
    }
    
    itemContributions.push({ id: answer.itemId, contribution: totalContribution });
  }
  
  // Analyze likert contributions
  for (const answer of answers.likert) {
    const item = likertItems.find(i => i.id === answer.itemId);
    if (!item) continue;
    
    const scaledRating = Math.abs((answer.rating - 3) / 2);
    let totalContribution = 0;
    
    if (item.keys.dimensions) {
      totalContribution += Object.values(item.keys.dimensions).reduce((sum, val) => sum + Math.abs(val) * scaledRating, 0);
    }
    if (item.keys.types) {
      totalContribution += Object.values(item.keys.types).reduce((sum, val) => sum + Math.abs(val) * scaledRating, 0);
    }
    
    itemContributions.push({ id: answer.itemId, contribution: totalContribution });
  }
  
  // Sort by contribution and return top items
  return itemContributions
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, topCount)
    .map(item => item.id);
}