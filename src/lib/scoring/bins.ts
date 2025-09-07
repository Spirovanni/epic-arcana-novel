import { DEV_INDEX } from '../assessment/mapping'

export function calculateDevelopmentBin(dimensions: Record<string, number>): number {
  const devScore = DEV_INDEX(dimensions)
  
  // Map [0,1] to [0,4] bins
  const bin = Math.floor(devScore * 5)
  return Math.max(0, Math.min(4, bin))
}