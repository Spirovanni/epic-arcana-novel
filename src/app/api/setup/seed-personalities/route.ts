import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

/**
 * Admin endpoint to seed the personality_profiles table with 360 profiles
 * This should only be called once during initial setup
 *
 * In production, this endpoint should be protected or deleted after use
 */

// Import the personality data
let personalityData: Record<string, any> | null = null;

async function loadPersonalityData() {
  if (personalityData) return personalityData;

  try {
    const response = await fetch('file:///Users/xaviermartinez/dev/cursor/epic-arcana-novel/data/dist/new_personality_profile.json');
    if (!response.ok) throw new Error('Failed to load JSON');
    personalityData = await response.json();
    return personalityData;
  } catch (error) {
    console.error('Failed to load personality data:', error);
    return null;
  }
}

export async function POST(request: Request) {
  console.log('[Seed] Starting personality profiles seed...');

  try {
    // Check if profiles already exist
    const countResult = await sql`SELECT COUNT(*) as count FROM personality_profiles`;
    const countArray = Array.isArray(countResult) ? countResult : [];
    const existingCount = countArray.length > 0 ? (countArray[0] as any)?.count : 0;

    if (existingCount > 0) {
      return NextResponse.json(
        {
          status: 'skipped',
          message: `Table already has ${existingCount} profiles`,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // For production, we need to send the data in the request body
    const body = await request.json();

    if (!body.profiles || !Array.isArray(body.profiles)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Request body must contain "profiles" array',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    let uploadedCount = 0;
    const errors: string[] = [];

    // Upload profiles in batches
    for (const profile of body.profiles) {
      try {
        await sql`
          INSERT INTO personality_profiles (
            id, canonical_id, unique_identifier, display_name, theme, family,
            book_association, enneagram_link, color_alignment, scoring_model,
            specific_task_group_books_influenced_by
          ) VALUES (
            ${profile.id},
            ${profile.canonical_id},
            ${profile.unique_identifier},
            ${profile.display_name || null},
            ${profile.theme || null},
            ${profile.family || null},
            ${JSON.stringify(profile.book_association || {})},
            ${JSON.stringify(profile.enneagram_link || {})},
            ${JSON.stringify(profile.color_alignment || {})},
            ${JSON.stringify(profile.scoring_model || {})},
            ${JSON.stringify(profile.specific_task_group_books_influenced_by || {})}
          )
          ON CONFLICT (canonical_id) DO UPDATE SET
            updated_at = NOW()
        `;
        uploadedCount++;
      } catch (err) {
        errors.push(`Profile ${profile.canonical_id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    console.log(`[Seed] ✓ Uploaded ${uploadedCount} profiles`);

    return NextResponse.json(
      {
        status: 'success',
        message: 'Profiles seeded successfully',
        uploadedCount,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[Seed] ❌ Error seeding profiles:', errorMsg);

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
      message: 'POST with { profiles: [...] } array in body to seed personality profiles',
      endpoint: 'POST /api/setup/seed-personalities',
      note: 'Send JSON array of profile objects with id, canonical_id, etc.',
    },
    { status: 405 }
  );
}
