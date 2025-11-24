import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';
import fs from 'fs';
import path from 'path';

/**
 * Admin endpoint to populate traits for all personality profiles
 * Loads traits data from the enhanced JSON file and updates the database
 */
export async function POST() {
  console.log('[Setup] Starting traits population...');

  try {
    // Read the enhanced JSON file with traits data
    const filePath = path.join(
      process.cwd(),
      'lsa-assessment/data/epic_arcana_personality_profiles_1-360_enhanced.json'
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`Enhanced profiles file not found at ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    const profiles = Array.isArray(data) ? data : data.profiles || [];

    console.log(`[Setup] Loaded ${profiles.length} profiles from enhanced file`);

    let updatedCount = 0;
    const errors: string[] = [];

    // Update each profile with traits data
    for (const profile of profiles) {
      try {
        const traits = {
          strengths: profile.traits?.strengths || [],
          shadow: profile.traits?.shadow || [],
          growth_focus: profile.traits?.growth_focus || [],
        };

        const result = await sql`
          UPDATE personality_profiles
          SET traits = ${JSON.stringify(traits)}, updated_at = NOW()
          WHERE canonical_id = ${profile.id || profile.canonical_id}
        `;

        if (result) {
          updatedCount++;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        errors.push(
          `Profile ${profile.id || profile.canonical_id}: ${errorMsg}`
        );
      }
    }

    console.log(`[Setup] ✓ Updated ${updatedCount} profiles with traits`);

    return NextResponse.json(
      {
        status: 'success',
        message: 'Traits populated successfully',
        updatedCount,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[Setup] ❌ Error populating traits:', errorMsg);

    return NextResponse.json(
      {
        status: 'error',
        message: errorMsg,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'POST to this endpoint to populate traits for all personality profiles',
      endpoint: 'POST /api/setup/populate-traits',
      note: 'This reads from lsa-assessment/data/epic_arcana_personality_profiles_1-360_enhanced.json',
    },
    { status: 405 }
  );
}
