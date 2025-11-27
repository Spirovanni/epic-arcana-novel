#!/usr/bin/env ts-node
/**
 * Update personalities table with novel_book and chapter data from new_personality_profile.json
 *
 * This script:
 * 1. Reads ./data/new_personality_profile.json
 * 2. Adds novel_book and chapter columns to personalities table if they don't exist
 * 3. Updates each personality row with the corresponding data from the JSON file
 *
 * Run with: npx tsx ./scripts/update_personalities_novel_chapter.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { sql } from '../src/lib/neon';

// ============================================================================
// Type Definitions
// ============================================================================

interface RawPersonalityProfile {
  canonical_id?: string;
  novel_book?: number;
  chapter?: string;
  [key: string]: unknown;
}

interface FamilyData {
  personalities: Record<string, RawPersonalityProfile>;
}

interface PersonalitiesJson {
  families: Record<string, FamilyData>;
}

interface NovelChapterUpdate {
  canonical_id: string;
  novel_book: number | null;
  chapter: string | null;
}

// ============================================================================
// Main Script
// ============================================================================

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Starting personalities table novel_book/chapter update...');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // ========================================================================
    // Step 1: Read and parse JSON file
    // ========================================================================
    console.log('Step 1: Reading new_personality_profile.json...');

    const jsonPath = path.join(process.cwd(), 'data/dist/new_personality_profile.json');

    if (!fs.existsSync(jsonPath)) {
      throw new Error(`JSON file not found at: ${jsonPath}`);
    }

    let jsonData: PersonalitiesJson;
    try {
      const fileContent = fs.readFileSync(jsonPath, 'utf-8');
      jsonData = JSON.parse(fileContent);
    } catch (parseError) {
      throw new Error(
        `Failed to parse JSON file: ${parseError instanceof Error ? parseError.message : String(parseError)}`
      );
    }

    if (!jsonData.families || typeof jsonData.families !== 'object') {
      throw new Error('Invalid JSON structure: families object not found');
    }

    console.log(`✓ Successfully loaded JSON file\n`);

    // ========================================================================
    // Step 2: Prepare data mapping
    // ========================================================================
    console.log('Step 2: Extracting personality data from JSON...');

    const personalityUpdates: NovelChapterUpdate[] = [];
    const missingCanonicalIds: string[] = [];
    let totalProfiles = 0;

    // Iterate through families and their personalities
    for (const [familyKey, familyData] of Object.entries(jsonData.families)) {
      const family = familyData as any;
      if (!family.personalities || typeof family.personalities !== 'object') {
        continue;
      }

      for (const [profileKey, profile] of Object.entries(family.personalities)) {
        const prof = profile as any;
        totalProfiles++;

        const canonicalId = prof.canonical_id;

        if (!canonicalId) {
          missingCanonicalIds.push(profileKey);
          console.warn(`  ⚠ Profile ${profileKey} (family: ${familyKey}) has no canonical_id, skipping`);
          continue;
        }

        personalityUpdates.push({
          canonical_id: canonicalId,
          novel_book: prof.novel_book ?? null,
          chapter: prof.chapter ?? null,
        });
      }
    }
    const validProfiles = personalityUpdates.length;

    console.log(`✓ Extracted ${validProfiles} valid personality profiles`);
    if (missingCanonicalIds.length > 0) {
      console.log(`⚠ Skipped ${missingCanonicalIds.length} profiles without canonical_id`);
    }
    console.log();

    // ========================================================================
    // Step 3: Ensure table columns exist
    // ========================================================================
    console.log('Step 3: Ensuring personalities table has novel_book and chapter columns...');

    try {
      await sql`
        ALTER TABLE personalities
        ADD COLUMN IF NOT EXISTS novel_book INTEGER;
      `;
      console.log('  ✓ novel_book column ensured');

      await sql`
        ALTER TABLE personalities
        ADD COLUMN IF NOT EXISTS chapter TEXT;
      `;
      console.log('  ✓ chapter column ensured');

      console.log();
    } catch (alterError) {
      const errorMsg = alterError instanceof Error ? alterError.message : String(alterError);

      // Check if table doesn't exist
      if (errorMsg.includes('does not exist') || errorMsg.includes('relation')) {
        throw new Error(
          `The 'personalities' table does not exist in your database.\n` +
          `Please create the personalities table first and populate it with personality profiles.\n` +
          `Error: ${errorMsg}`
        );
      }

      throw new Error(
        `Failed to alter personalities table: ${errorMsg}`
      );
    }

    // ========================================================================
    // Step 4: Update rows
    // ========================================================================
    console.log('Step 4: Updating personality rows...');

    let successCount = 0;
    let failureCount = 0;
    const missingInDb: string[] = [];

    for (const update of personalityUpdates) {
      try {
        // Use RETURNING to check if the row was actually updated
        const result = await sql`
          UPDATE personalities
          SET novel_book = ${update.novel_book},
              chapter = ${update.chapter}
          WHERE canonical_id = ${update.canonical_id}
          RETURNING canonical_id;
        `;

        // Check if any row was actually updated
        // The result from Neon sql is an array; if empty, no rows matched
        const resultArray = Array.isArray(result) ? result : [];

        if (resultArray.length === 0) {
          missingInDb.push(update.canonical_id);
          console.warn(
            `  ⚠ No personality row found for canonical_id: ${update.canonical_id}`
          );
        } else {
          successCount++;
          if (successCount % 50 === 0) {
            console.log(`  ... updated ${successCount} personalities`);
          }
        }
      } catch (updateError) {
        failureCount++;
        console.error(
          `  ✗ Error updating ${update.canonical_id}: ${
            updateError instanceof Error ? updateError.message : String(updateError)
          }`
        );
      }
    }

    console.log();

    // ========================================================================
    // Step 5: Summary
    // ========================================================================
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Update Summary');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total profiles in JSON:          ${totalProfiles}`);
    console.log(`Valid profiles processed:        ${validProfiles}`);
    console.log(`Successfully updated rows:       ${successCount}`);
    console.log(`Failed updates:                  ${failureCount}`);
    console.log(`Profiles not found in DB:        ${missingInDb.length}`);
    console.log();

    if (successCount === validProfiles && failureCount === 0 && missingInDb.length === 0) {
      console.log('✓ All personalities successfully updated!');
      console.log('═══════════════════════════════════════════════════════════\n');
    } else {
      console.log('⚠ Some updates did not complete successfully.');
      if (missingInDb.length > 0 && missingInDb.length <= 10) {
        console.log('\nMissing in database:');
        missingInDb.forEach((id) => console.log(`  - ${id}`));
      }
      console.log('═══════════════════════════════════════════════════════════\n');
    }

    process.exit(successCount > 0 ? 0 : 1);
  } catch (error) {
    console.error('\n✗ Error updating personalities novel_book/chapter:');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('\n═══════════════════════════════════════════════════════════\n');
    process.exit(1);
  }
}

// ============================================================================
// Run Script
// ============================================================================

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
