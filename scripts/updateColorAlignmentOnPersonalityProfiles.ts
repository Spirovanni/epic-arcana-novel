#!/usr/bin/env ts-node
/**
 * Update personality_profiles table with color alignment data from new_personality_profile.json
 *
 * This script:
 * 1. Reads ./data/dist/new_personality_profile.json
 * 2. Ensures rgb_hex, hue_index, hsl, and color_symbolism columns exist
 * 3. Updates each personality row with color data from the JSON file
 * 4. Matches rows by canonical_id
 *
 * Run with: npx tsx ./scripts/updateColorAlignmentOnPersonalityProfiles.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load .env file from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// ============================================================================
// Type Definitions
// ============================================================================

interface ColorAlignment {
  name?: string;
  hsl?: string;
  rgb_hex?: string;
  hue_index?: number;
  color_symbolism?: string;
}

interface RawPersonalityProfile {
  canonical_id?: string;
  color_alignment?: ColorAlignment;
  rgb_hex?: string;
  hex_code?: string;
  red?: number;
  green?: number;
  blue?: number;
  [key: string]: unknown;
}

interface FamilyData {
  personalities: Record<string, RawPersonalityProfile>;
  [key: string]: unknown;
}

interface PersonalitiesJsonWithFamilies {
  families: Record<string, FamilyData>;
}

interface PersonalitiesJsonObject {
  [profileKey: string]: RawPersonalityProfile;
}

interface PersonalitiesJsonArray extends Array<RawPersonalityProfile & { canonical_id: string }> {}

type PersonalitiesJson =
  | PersonalitiesJsonWithFamilies
  | PersonalitiesJsonObject
  | PersonalitiesJsonArray;

interface ColorUpdate {
  canonical_id: string;
  rgb_hex: string | null;
  hue_index: number | null;
  hsl: string | null;
  color_symbolism: string | null;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Extract hue_index from HSL string like "60,20%,50%"
 * Returns the first numeric component or null if parsing fails
 */
function extractHueFromHsl(hslString: string | null | undefined): number | null {
  if (!hslString || typeof hslString !== 'string') {
    return null;
  }

  const trimmed = hslString.trim();
  if (!trimmed) {
    return null;
  }

  // Extract everything before the first comma
  const firstPart = trimmed.split(',')[0];
  const hue = parseInt(firstPart, 10);

  if (Number.isNaN(hue)) {
    return null;
  }

  return Math.round(hue);
}

/**
 * Build color update object from a raw personality profile
 */
function buildColorUpdate(profile: RawPersonalityProfile, canonical_id: string): ColorUpdate {
  const colorAlignment = profile.color_alignment || {};

  // rgb_hex: prefer color_alignment.rgb_hex, then profile.rgb_hex, then profile.hex_code
  const rgb_hex = colorAlignment.rgb_hex || profile.rgb_hex || profile.hex_code || null;

  // hsl: prefer color_alignment.hsl
  const hsl = colorAlignment.hsl || null;

  // color_symbolism: prefer color_alignment.color_symbolism
  const color_symbolism = colorAlignment.color_symbolism || null;

  // hue_index: prefer color_alignment.hue_index if it's a number, otherwise parse from hsl
  let hue_index: number | null = null;
  if (typeof colorAlignment.hue_index === 'number') {
    hue_index = colorAlignment.hue_index;
  } else if (hsl) {
    hue_index = extractHueFromHsl(hsl);
  }

  return {
    canonical_id,
    rgb_hex,
    hue_index,
    hsl,
    color_symbolism,
  };
}

// ============================================================================
// Main Script
// ============================================================================

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Starting personality_profiles color alignment update...');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // ========================================================================
    // Step 1: Initialize Neon client
    // ========================================================================
    console.log('Step 1: Initializing database connection...');

    const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        'NEON_DATABASE_URL or DATABASE_URL environment variable is not set. ' +
        'Please configure it in your .env file.'
      );
    }

    const sql = neon(databaseUrl);
    console.log('✓ Database connection initialized\n');

    // ========================================================================
    // Step 2: Read and parse JSON file
    // ========================================================================
    console.log('Step 2: Reading new_personality_profile.json...');

    const jsonPath = path.resolve(process.cwd(), 'data/dist/new_personality_profile.json');

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

    console.log('✓ Successfully loaded JSON file\n');

    // ========================================================================
    // Step 3: Extract profiles (handle families wrapper, object, or array formats)
    // ========================================================================
    console.log('Step 3: Extracting personality profiles...');

    let profiles: Array<[string, RawPersonalityProfile]> = [];

    const data = jsonData as any;

    // Check if it has a "families" wrapper (new structure)
    if (data.families && typeof data.families === 'object') {
      // Iterate through families and extract personalities
      for (const [familyKey, familyData] of Object.entries(data.families)) {
        const family = familyData as any;
        if (family.personalities && typeof family.personalities === 'object') {
          profiles = profiles.concat(Object.entries(family.personalities));
        }
      }
    } else if (Array.isArray(jsonData)) {
      // If it's an array, convert to [key, value] pairs
      profiles = jsonData.map((profile, index) => [
        profile.canonical_id || `profile_${index}`,
        profile,
      ]);
    } else if (typeof jsonData === 'object' && jsonData !== null) {
      // If it's a plain object, use Object.entries
      profiles = Object.entries(jsonData);
    } else {
      throw new Error('Invalid JSON structure: expected families wrapper, object, or array of profiles');
    }

    const totalProfiles = profiles.length;
    console.log(`✓ Found ${totalProfiles} personality profiles\n`);

    // ========================================================================
    // Step 4: Ensure table columns exist
    // ========================================================================
    console.log('Step 4: Ensuring personality_profiles table has color columns...');

    try {
      await sql`
        ALTER TABLE personality_profiles
        ADD COLUMN IF NOT EXISTS rgb_hex TEXT,
        ADD COLUMN IF NOT EXISTS hue_index INTEGER,
        ADD COLUMN IF NOT EXISTS hsl TEXT,
        ADD COLUMN IF NOT EXISTS color_symbolism TEXT;
      `;

      console.log('  ✓ rgb_hex column ensured');
      console.log('  ✓ hue_index column ensured');
      console.log('  ✓ hsl column ensured');
      console.log('  ✓ color_symbolism column ensured');
      console.log();
    } catch (alterError) {
      const errorMsg = alterError instanceof Error ? alterError.message : String(alterError);

      if (errorMsg.includes('does not exist') || errorMsg.includes('relation')) {
        throw new Error(
          `The 'personality_profiles' table does not exist in your database.\n` +
          `Please ensure the table exists before running this script.\n` +
          `Error: ${errorMsg}`
        );
      }

      throw new Error(`Failed to alter personality_profiles table: ${errorMsg}`);
    }

    // ========================================================================
    // Step 5: Build color updates and validate
    // ========================================================================
    console.log('Step 5: Building color update data...');

    const colorUpdates: ColorUpdate[] = [];
    const missingCanonicalIds: string[] = [];

    for (const [profileKey, profile] of profiles) {
      const prof = profile as any;
      const canonicalId = prof.canonical_id;

      if (!canonicalId) {
        missingCanonicalIds.push(profileKey);
        console.warn(`  ⚠ Profile ${profileKey} has no canonical_id, skipping`);
        continue;
      }

      const update = buildColorUpdate(prof, canonicalId);
      colorUpdates.push(update);
    }

    console.log(`✓ Built ${colorUpdates.length} color updates`);
    if (missingCanonicalIds.length > 0) {
      console.log(`⚠ Skipped ${missingCanonicalIds.length} profiles without canonical_id`);
    }
    console.log();

    // ========================================================================
    // Step 6: Apply updates
    // ========================================================================
    console.log('Step 6: Applying color updates to personality_profiles...');

    let successCount = 0;
    let failureCount = 0;
    const missingInDb: string[] = [];

    for (const update of colorUpdates) {
      try {
        const result = await sql`
          UPDATE personality_profiles
          SET
            rgb_hex = ${update.rgb_hex},
            hue_index = ${update.hue_index},
            hsl = ${update.hsl},
            color_symbolism = ${update.color_symbolism}
          WHERE canonical_id = ${update.canonical_id}
          RETURNING canonical_id;
        `;

        const resultArray = Array.isArray(result) ? result : [];

        if (resultArray.length === 0) {
          missingInDb.push(update.canonical_id);
          console.warn(`  ⚠ No row found for canonical_id: ${update.canonical_id}`);
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
    // Step 7: Summary
    // ========================================================================
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Update Summary');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total profiles in JSON:          ${totalProfiles}`);
    console.log(`Valid profiles processed:        ${colorUpdates.length}`);
    console.log(`Successfully updated rows:       ${successCount}`);
    console.log(`Failed updates:                  ${failureCount}`);
    console.log(`Profiles not found in DB:        ${missingInDb.length}`);
    console.log();

    if (successCount === colorUpdates.length && failureCount === 0 && missingInDb.length === 0) {
      console.log('✓ All personality profiles successfully updated with color data!');
      console.log('═══════════════════════════════════════════════════════════\n');
      process.exit(0);
    } else {
      console.log('⚠ Some updates did not complete successfully.');
      if (missingInDb.length > 0 && missingInDb.length <= 10) {
        console.log('\nProfiles not found in database:');
        missingInDb.forEach((id) => console.log(`  - ${id}`));
      }
      console.log('═══════════════════════════════════════════════════════════\n');
      process.exit(successCount > 0 ? 0 : 1);
    }
  } catch (error) {
    console.error('\n✗ Error updating personality_profiles color alignment:');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('\n═══════════════════════════════════════════════════════════\n');
    process.exit(1);
  }
}

// ============================================================================
// Run Script
// ============================================================================

main().catch((err) => {
  console.error('Fatal error updating color alignment:', err);
  process.exit(1);
});
