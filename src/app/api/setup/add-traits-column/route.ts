import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

/**
 * Admin endpoint to add traits column to personality_profiles table
 * This should only be called once
 */
export async function POST() {
  console.log('[Setup] Adding traits column to personality_profiles table...');

  try {
    // Add the traits column if it doesn't exist
    await sql`
      ALTER TABLE personality_profiles
      ADD COLUMN IF NOT EXISTS traits JSONB
    `;

    console.log('[Setup] ✓ Traits column added successfully');

    return NextResponse.json(
      {
        status: 'success',
        message: 'traits column added to personality_profiles table',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[Setup] ❌ Error adding traits column:', errorMsg);

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
      message: 'POST to this endpoint to add traits column to personality_profiles table',
      endpoint: 'POST /api/setup/add-traits-column',
    },
    { status: 405 }
  );
}
