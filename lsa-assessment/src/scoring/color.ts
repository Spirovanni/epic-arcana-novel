import { hslToHex, S_BASE_BY_INSTINCT, L_BY_DEVBIN } from '../constants.js';
import { getDominantInstinct } from './instincts.js';

export function calculateColor(
  chapter: number,
  instincts: { SP: number; SO: number; SX: number },
  dimensions: Record<string, number>,
  development_bin: number
): { hsl: string; rgb_hex: string; hue_index: number } {
  
  const hue_index = chapter - 1; // 0-359
  const h = hue_index;
  
  // Calculate saturation based on dominant instinct
  const dominantInstinct = getDominantInstinct(instincts);
  let s = S_BASE_BY_INSTINCT[dominantInstinct];
  
  // Add small adjustments based on dimensions
  const noveltyAdjust = (dimensions.novelty_seeking - 0.5) * 10; // ±5%
  const emotionAdjust = (dimensions.emotional_intensity - 0.5) * 10; // ±5%
  
  s = Math.max(20, Math.min(80, s + noveltyAdjust + emotionAdjust));
  
  // Get lightness from development bin
  const l = L_BY_DEVBIN[development_bin];
  
  const rgb_hex = hslToHex(h, s, l);
  const hsl = `hsl(${h}, ${s}%, ${l}%)`;
  
  return { hsl, rgb_hex, hue_index };
}