import { readFileSync } from 'fs';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

// Load environment variables FIRST
import * as dotenv from 'dotenv';

const envPath = resolve(process.cwd(), '.env.local');
const envFallbackPath = resolve(process.cwd(), '.env');

dotenv.config({ path: envPath });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: envFallbackPath });
}

import { sql } from '../src/lib/neon';

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

async function main() {
  try {
    console.log('Uploading single personality profile (EA-361)...\n');

    // Load the JSON
    const jsonPath = resolve(process.cwd(), 'data/dist/new_personality_profile.json');
    const rawData = readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(rawData);

    // Get the specific profile
    const profile = data.families.family_2.personalities.personality_profile_79;
    const familyName = data.families.family_2.family_name;

    if (!profile) {
      throw new Error('Profile not found');
    }

    console.log(`Found profile: ${profile.display_name}`);
    console.log(`Canonical ID: ${profile.canonical_id}`);
    console.log(`Unique ID: ${profile.unique_identifier}\n`);

    // Build the row
    const row: PersonalityRow = {
      id: randomUUID(),
      canonical_id: profile.canonical_id,
      unique_identifier: profile.unique_identifier,
      display_name: profile.display_name ?? null,
      theme: profile.theme ?? null,
      family: profile.family ?? familyName ?? null,
      book_association: profile.book_association ?? {},
      enneagram_link: profile.enneagram_link ?? {},
      color_alignment: profile.color_alignment ?? {},
      scoring_model: profile.scoring_model ?? {},
      specific_task_group_books_influenced_by:
        profile.specific_task_group_books_influenced_by ?? {},
    };

    console.log(`Generated UUID: ${row.id}\n`);

    // Upsert into database
    console.log('Upserting into database...');
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
      throw new Error('No result returned from database');
    }

    const returnedId = result[0].id;
    console.log(`✓ Profile uploaded successfully!`);
    console.log(`  Canonical ID: ${row.canonical_id}`);
    console.log(`  Database ID: ${returnedId}`);
    console.log(`  Display Name: ${row.display_name}`);
    console.log(`  Family: ${row.family}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  process.exit(0);
}

main();
