import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

// Load environment variables FIRST before importing anything else
// that might depend on them
import * as dotenv from 'dotenv';

const envPath = resolve(process.cwd(), '.env.local');
const envFallbackPath = resolve(process.cwd(), '.env');

// Try .env.local first, then .env
dotenv.config({ path: envPath });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: envFallbackPath });
}

// Now import after env vars are loaded
import { sql } from '../src/lib/neon';

// Types
type RawProfile = Record<string, any>;

interface PersonalityRow {
  id: string;
  canonical_id: string;
  unique_identifier: string;
  display_name: string | null;
  theme: string | null;
  family: string | null;
  book_association: any;
  enneagram_link: any;
  color_alignment: any;
  scoring_model: any;
  specific_task_group_books_influenced_by: any;
}

interface IdMapEntry {
  id: string;
  unique_identifier: string;
  display_name: string | null;
  family: string | null;
  theme: string | null;
}

// Generator to iterate through personality profiles
function* iterPersonalityProfiles(data: any): Generator<RawProfile> {
  const families = data.families ?? {};
  for (const familyKey of Object.keys(families)) {
    const familyNode = families[familyKey];
    const familyName = familyNode?.family_name ?? null;
    // The structure is families[familyKey].personalities, not personalities.personalities
    const personalitiesRoot = familyNode?.personalities ?? {};
    for (const profileKey of Object.keys(personalitiesRoot)) {
      const profile = personalitiesRoot[profileKey];
      yield { ...profile, __familyName: familyName };
    }
  }
}

// Build PersonalityRow from raw profile
function buildPersonalityRow(profile: RawProfile): PersonalityRow | null {
  const canonical_id = profile.canonical_id;
  const unique_identifier = profile.unique_identifier;

  // Skip if required fields are missing
  if (!canonical_id) {
    console.warn('Skipping profile: missing canonical_id');
    return null;
  }

  if (!unique_identifier) {
    console.warn(`Skipping profile ${canonical_id}: missing unique_identifier`);
    return null;
  }

  return {
    id: randomUUID(),
    canonical_id,
    unique_identifier,
    display_name: profile.display_name ?? null,
    theme: profile.theme ?? null,
    family: profile.family ?? profile.__familyName ?? null,
    book_association: profile.book_association ?? {},
    enneagram_link: profile.enneagram_link ?? {},
    color_alignment: profile.color_alignment ?? {},
    scoring_model: profile.scoring_model ?? {},
    specific_task_group_books_influenced_by:
      profile.specific_task_group_books_influenced_by ?? {},
  };
}

async function ensureTableExists() {
  console.log('Ensuring personality_profiles table exists...');
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS personality_profiles (
        id UUID PRIMARY KEY,
        canonical_id TEXT UNIQUE NOT NULL,
        unique_identifier TEXT NOT NULL,
        display_name TEXT,
        theme TEXT,
        family TEXT,
        book_association JSONB,
        enneagram_link JSONB,
        color_alignment JSONB,
        scoring_model JSONB,
        specific_task_group_books_influenced_by JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log('✓ Table ready');
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
}

async function upsertProfile(row: PersonalityRow): Promise<string> {
  try {
    const result = await sql<{ id: string }[]>`
      INSERT INTO personality_profiles (
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
      )
      VALUES (
        ${row.id}::uuid,
        ${row.canonical_id},
        ${row.unique_identifier},
        ${row.display_name},
        ${row.theme},
        ${row.family},
        ${JSON.stringify(row.book_association)},
        ${JSON.stringify(row.enneagram_link)},
        ${JSON.stringify(row.color_alignment)},
        ${JSON.stringify(row.scoring_model)},
        ${JSON.stringify(row.specific_task_group_books_influenced_by)},
        NOW(),
        NOW()
      )
      ON CONFLICT (canonical_id) DO UPDATE
      SET
        unique_identifier = EXCLUDED.unique_identifier,
        display_name = EXCLUDED.display_name,
        theme = EXCLUDED.theme,
        family = EXCLUDED.family,
        book_association = EXCLUDED.book_association,
        enneagram_link = EXCLUDED.enneagram_link,
        color_alignment = EXCLUDED.color_alignment,
        scoring_model = EXCLUDED.scoring_model,
        specific_task_group_books_influenced_by = EXCLUDED.specific_task_group_books_influenced_by,
        updated_at = NOW()
      RETURNING id
    `;

    if (result.length === 0) {
      throw new Error(`No result returned for ${row.canonical_id}`);
    }

    return result[0].id;
  } catch (error) {
    console.error(`Error upserting profile ${row.canonical_id}:`, error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting personality profiles upload...\n');

    // Validate DATABASE_URL
    if (!process.env.DATABASE_URL) {
      throw new Error(
        'DATABASE_URL is not set. Please set it in .env.local or pass it as an environment variable.'
      );
    }

    // Load JSON file
    const jsonPath = resolve(process.cwd(), 'data/dist/new_personality_profile.json');
    console.log(`Loading profiles from: ${jsonPath}`);
    const rawData = readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(rawData);

    // Count profiles
    let totalProfiles = 0;
    for (const _ of iterPersonalityProfiles(data)) {
      totalProfiles++;
    }
    console.log(`Found ${totalProfiles} personality profiles\n`);

    // Ensure table exists
    await ensureTableExists();

    // Upsert profiles and build map
    const idMap: Record<string, IdMapEntry> = {};
    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    console.log('Upserting profiles...');
    for (const rawProfile of iterPersonalityProfiles(data)) {
      const row = buildPersonalityRow(rawProfile);

      if (!row) {
        skippedCount++;
        continue;
      }

      try {
        const returnedId = await upsertProfile(row);
        const id = returnedId || row.id;

        // Track for the ID map
        idMap[row.canonical_id] = {
          id,
          unique_identifier: row.unique_identifier,
          display_name: row.display_name,
          family: row.family,
          theme: row.theme,
        };

        // Determine if it was inserted or updated
        // For this simple version, we'll just count as inserted
        insertedCount++;

        if (insertedCount % 10 === 0) {
          console.log(`  ✓ Processed ${insertedCount} profiles...`);
        }
      } catch (error) {
        console.error(`Failed to upsert ${row.canonical_id}:`, error);
        throw error;
      }
    }

    console.log(
      `\n✓ Upload complete: ${insertedCount} inserted/updated, ${skippedCount} skipped`
    );

    // Write ID map file
    const mapPath = resolve(process.cwd(), 'personality_profile_id_map.json');
    writeFileSync(mapPath, JSON.stringify(idMap, null, 2), 'utf8');
    console.log(`✓ ID map written to: ${mapPath}`);
    console.log(`✓ Map contains ${Object.keys(idMap).length} entries`);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }

  process.exit(0);
}

main();
