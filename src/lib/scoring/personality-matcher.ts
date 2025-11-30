/**
 * Personality Profile Matcher
 *
 * Matches assessment results to the most appropriate personality profile
 * in the database based on:
 * 1. Enneagram type (9 types mapped to personality families)
 * 2. Wing influence (0-7 bins for left/right tendencies)
 * 3. Development level (0-4 for maturity)
 * 4. Dimension scores (14 psychological dimensions)
 */

import { sql } from '../neon';

export interface PersonalityMatch {
  canonicalId: string;
  displayName: string | null;
  theme: string | null;
  family: string | null;
  rgbHex: string | null;
  enneagramLink: Record<string, any> | null;
  colorAlignment: Record<string, any> | null;
  scoringModel: Record<string, any> | null;
  matchScore: number; // 0-100 indicating confidence of match
  matchReason: string;
}

/**
 * Map from Enneagram type to personality families
 */
const ENNEAGRAM_TO_FAMILIES = {
  1: 'Order / Systems', // The Reformer
  2: 'Belonging / Care', // The Helper
  3: 'Leadership / Mastery', // The Achiever
  4: 'Authenticity / Self-Expression', // The Individualist
  5: 'Knowledge / Understanding', // The Investigator
  6: 'Security / Loyalty', // The Loyalist
  7: 'Exploration / Freedom', // The Enthusiast
  8: 'Power / Control', // The Challenger
  9: 'Acceptance / Peace', // The Peacemaker
};

/**
 * Map from wing and development to chapter ranges within a family
 * Each family has 40 chapters (9 families × 40 = 360 total)
 * Within each family: 8 wings × 5 development levels = 40
 */
function calculateChapterInFamily(wingBin: number, developmentBin: number): number {
  // wingBin: 0-7 (8 discrete bins)
  // developmentBin: 0-4 (5 levels)
  // Result: 0-39 (position within the family's 40 chapters)
  return wingBin * 5 + developmentBin;
}

/**
 * Convert dimensions to a weighted profile match
 * Higher match scores indicate stronger alignment with the personality
 */
function calculateDimensionAlignmentScore(
  dimensionScores: Record<string, number>,
  scoringModel: Record<string, any> | null
): number {
  if (!scoringModel || !scoringModel.dimension_weights) {
    return 50; // Default neutral score
  }

  let totalWeight = 0;
  let weightedSum = 0;

  for (const [dimension, weight] of Object.entries(scoringModel.dimension_weights)) {
    const score = dimensionScores[dimension] || 0.5;
    const numWeight = typeof weight === 'number' ? weight : 1;

    weightedSum += score * numWeight;
    totalWeight += numWeight;
  }

  // Convert to 0-100 scale
  return (weightedSum / Math.max(totalWeight, 1)) * 100;
}

/**
 * Find the best matching personality profile for assessment results
 */
export async function findMatchingPersonality(
  enneagramType: number,
  wingBin: number,
  developmentBin: number,
  dimensionScores: Record<string, number>,
  instinctStack: { sp: number; so: number; sx: number }
): Promise<PersonalityMatch | null> {
  try {
    // Calculate target chapter within family
    const chapterInFamily = calculateChapterInFamily(wingBin, developmentBin);
    const family = ENNEAGRAM_TO_FAMILIES[enneagramType as keyof typeof ENNEAGRAM_TO_FAMILIES];

    if (!family) {
      console.error(`Invalid enneagram type: ${enneagramType}`);
      return null;
    }

    // Query for profiles matching the family
    const profiles = await sql`
      SELECT
        id,
        canonical_id,
        display_name,
        theme,
        family,
        rgb_hex,
        enneagram_link,
        color_alignment,
        scoring_model
      FROM personality_profiles
      WHERE family = ${family}
      LIMIT 50
    `;

    if (!profiles || profiles.length === 0) {
      console.warn(`No profiles found for family: ${family}`);
      return null;
    }

    // Score each profile based on:
    // 1. Position within family (closer to calculated chapter = higher score)
    // 2. Dimension alignment (matching dimension emphasis)
    // 3. Instinct preference (if stored in profile)
    let bestMatch: PersonalityMatch | null = null;
    let bestScore = 0;

    for (const profile of profiles) {
      const dimensionScore = calculateDimensionAlignmentScore(
        dimensionScores,
        profile.scoring_model
      );

      // Position score: profiles near the calculated chapter get higher scores
      // We estimate chapter from canonical_id (EA-XXX format)
      const canonical = profile.canonical_id || '';
      const chapterMatch = parseInt(canonical.split('-')[1]) || 1;

      // Calculate position score (closer chapter position = higher score)
      const positionDifference = Math.abs(chapterMatch - (enneagramType * 40 + chapterInFamily));
      const positionScore = Math.max(0, 100 - (positionDifference * 2));

      // Combined match score (weighted average)
      const matchScore = dimensionScore * 0.6 + positionScore * 0.4;

      if (matchScore > bestScore) {
        bestScore = matchScore;
        bestMatch = {
          canonicalId: profile.canonical_id,
          displayName: profile.display_name,
          theme: profile.theme,
          family: profile.family,
          rgbHex: profile.rgb_hex,
          enneagramLink: profile.enneagram_link,
          colorAlignment: profile.color_alignment,
          scoringModel: profile.scoring_model,
          matchScore: Math.round(matchScore),
          matchReason: `Strong match with ${family} personality (Type ${enneagramType}, Wing ${wingBin}, Development ${developmentBin})`,
        };
      }
    }

    return bestMatch;
  } catch (error) {
    console.error('Error finding matching personality:', error);
    return null;
  }
}

/**
 * Get personality profile by EA ID
 */
export async function getPersonalityByEAId(eaId: string): Promise<PersonalityMatch | null> {
  try {
    const result = await sql`
      SELECT
        id,
        canonical_id,
        display_name,
        theme,
        family,
        rgb_hex,
        enneagram_link,
        color_alignment,
        scoring_model
      FROM personality_profiles
      WHERE canonical_id = ${eaId}
      LIMIT 1
    `;

    if (!result || result.length === 0) {
      return null;
    }

    const profile = result[0];
    return {
      canonicalId: profile.canonical_id,
      displayName: profile.display_name,
      theme: profile.theme,
      family: profile.family,
      rgbHex: profile.rgb_hex,
      enneagramLink: profile.enneagram_link,
      colorAlignment: profile.color_alignment,
      scoringModel: profile.scoring_model,
      matchScore: 100, // Perfect match - direct lookup
      matchReason: `Exact match with ${profile.display_name || profile.canonical_id}`,
    };
  } catch (error) {
    console.error('Error getting personality by EA ID:', error);
    return null;
  }
}

/**
 * Get top N matching personalities for a given assessment result
 */
export async function getTopMatchingPersonalities(
  enneagramType: number,
  dimensionScores: Record<string, number>,
  limit: number = 5
): Promise<PersonalityMatch[]> {
  try {
    const family = ENNEAGRAM_TO_FAMILIES[enneagramType as keyof typeof ENNEAGRAM_TO_FAMILIES];

    if (!family) {
      return [];
    }

    // Get all profiles in the family
    const profiles = await sql`
      SELECT
        id,
        canonical_id,
        display_name,
        theme,
        family,
        rgb_hex,
        enneagram_link,
        color_alignment,
        scoring_model
      FROM personality_profiles
      WHERE family = ${family}
      ORDER BY canonical_id ASC
      LIMIT ${limit * 2}
    `;

    if (!profiles) {
      return [];
    }

    // Score each profile and return top matches
    const scoredProfiles = profiles
      .map((profile) => ({
        ...profile,
        matchScore: Math.round(calculateDimensionAlignmentScore(
          dimensionScores,
          profile.scoring_model
        )),
        matchReason: `Alternative ${family} archetype`,
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)
      .map(profile => ({
        canonicalId: profile.canonical_id,
        displayName: profile.display_name,
        theme: profile.theme,
        family: profile.family,
        rgbHex: profile.rgb_hex,
        enneagramLink: profile.enneagram_link,
        colorAlignment: profile.color_alignment,
        scoringModel: profile.scoring_model,
        matchScore: profile.matchScore,
        matchReason: profile.matchReason,
      }));

    return scoredProfiles;
  } catch (error) {
    console.error('Error getting top matching personalities:', error);
    return [];
  }
}

/**
 * Get personality profile details including traits
 */
export async function getPersonalityDetails(canonicalId: string) {
  try {
    // Get main profile
    const profileResult = await sql`
      SELECT
        id,
        canonical_id,
        display_name,
        theme,
        family,
        rgb_hex,
        enneagram_link,
        color_alignment,
        scoring_model,
        created_at,
        updated_at
      FROM personality_profiles
      WHERE canonical_id = ${canonicalId}
      LIMIT 1
    `;

    if (!profileResult || profileResult.length === 0) {
      return null;
    }

    const profile = profileResult[0];

    // Get traits from related tables
    const [strengths, shadows, growthFocus] = await Promise.all([
      sql`SELECT strength_text FROM strengths WHERE canonical_id = ${canonicalId} ORDER BY strength_index ASC`,
      sql`SELECT shadow_text FROM shadow WHERE canonical_id = ${canonicalId} ORDER BY shadow_index ASC`,
      sql`SELECT growth_text FROM growth_focus WHERE canonical_id = ${canonicalId} ORDER BY growth_index ASC`,
    ]);

    return {
      ...profile,
      traits: {
        strengths: (strengths as { strength_text: string }[])?.map(s => s.strength_text) || [],
        shadows: (shadows as { shadow_text: string }[])?.map(s => s.shadow_text) || [],
        growthFocus: (growthFocus as { growth_text: string }[])?.map(g => g.growth_text) || [],
      },
    };
  } catch (error) {
    console.error('Error getting personality details:', error);
    return null;
  }
}
