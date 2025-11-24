import { sql } from './neon';

export interface PersonalityProfile {
  id: string;
  canonical_id: string;
  unique_identifier: string;
  display_name: string | null;
  theme: string | null;
  family: string | null;
  traits?: {
    strengths?: string[];
    shadow?: string[];
    growth_focus?: string[];
  } | null;
  book_association: Record<string, any> | null;
  enneagram_link: Record<string, any> | null;
  color_alignment: Record<string, any> | null;
  scoring_model: Record<string, any> | null;
  specific_task_group_books_influenced_by: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all personality profiles from the database
 */
export async function getAllPersonalityProfiles(): Promise<PersonalityProfile[]> {
  try {
    const result = await sql`
      SELECT
        id,
        canonical_id,
        unique_identifier,
        display_name,
        theme,
        family,
        book_association,
        enneagram_link,
        color_alignment,
        scoring_model,
        specific_task_group_books_influenced_by,
        created_at,
        updated_at
      FROM personality_profiles
      ORDER BY canonical_id ASC
    `;

    return (result as PersonalityProfile[]) || [];
  } catch (error) {
    console.error('Error fetching all personality profiles:', error);
    throw error;
  }
}

/**
 * Get a single personality profile by canonical ID
 */
export async function getPersonalityByCanonicalId(
  canonicalId: string
): Promise<PersonalityProfile | null> {
  try {
    const result = await sql`
      SELECT
        id,
        canonical_id,
        unique_identifier,
        display_name,
        theme,
        family,
        book_association,
        enneagram_link,
        color_alignment,
        scoring_model,
        specific_task_group_books_influenced_by,
        created_at,
        updated_at
      FROM personality_profiles
      WHERE canonical_id = ${canonicalId}
      LIMIT 1
    `;

    const profiles = result as PersonalityProfile[];
    return profiles && profiles.length > 0 ? profiles[0] : null;
  } catch (error) {
    console.error('Error fetching personality profile:', error);
    throw error;
  }
}

/**
 * Get personality profiles by family
 */
export async function getPersonalitiesByFamily(
  family: string
): Promise<PersonalityProfile[]> {
  try {
    const result = await sql`
      SELECT
        id,
        canonical_id,
        unique_identifier,
        display_name,
        theme,
        family,
        book_association,
        enneagram_link,
        color_alignment,
        scoring_model,
        specific_task_group_books_influenced_by,
        created_at,
        updated_at
      FROM personality_profiles
      WHERE family = ${family}
      ORDER BY canonical_id ASC
    `;

    return (result as PersonalityProfile[]) || [];
  } catch (error) {
    console.error('Error fetching personalities by family:', error);
    throw error;
  }
}

/**
 * Search personality profiles by display name or theme
 */
export async function searchPersonalities(
  query: string
): Promise<PersonalityProfile[]> {
  try {
    const searchQuery = `%${query}%`;
    const result = await sql`
      SELECT
        id,
        canonical_id,
        unique_identifier,
        display_name,
        theme,
        family,
        book_association,
        enneagram_link,
        color_alignment,
        scoring_model,
        specific_task_group_books_influenced_by,
        created_at,
        updated_at
      FROM personality_profiles
      WHERE
        display_name ILIKE ${searchQuery}
        OR theme ILIKE ${searchQuery}
        OR family ILIKE ${searchQuery}
        OR canonical_id ILIKE ${searchQuery}
      ORDER BY canonical_id ASC
    `;

    return (result as PersonalityProfile[]) || [];
  } catch (error) {
    console.error('Error searching personalities:', error);
    throw error;
  }
}

/**
 * Get count of all personality profiles
 */
export async function getPersonalityCount(): Promise<number> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM personality_profiles
    `;

    const rows = result as { count: number }[];
    return rows && rows.length > 0 ? rows[0].count : 0;
  } catch (error) {
    console.error('Error getting personality count:', error);
    throw error;
  }
}

/**
 * Get distinct families
 */
export async function getDistinctFamilies(): Promise<string[]> {
  try {
    const result = await sql`
      SELECT DISTINCT family FROM personality_profiles
      WHERE family IS NOT NULL
      ORDER BY family ASC
    `;

    const rows = result as { family: string }[];
    return rows ? rows.map(r => r.family) : [];
  } catch (error) {
    console.error('Error getting distinct families:', error);
    throw error;
  }
}
