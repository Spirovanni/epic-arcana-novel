import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

/**
 * Admin endpoint to create the personality_profiles table
 * This should only be called once during initial setup
 *
 * In production, this endpoint should be protected or deleted after use
 */
export async function POST() {
  console.log('[Setup] Creating personality_profiles table...');

  try {
    // Create the table
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

    console.log('[Setup] ✓ Table created successfully');

    // Verify the table was created
    const countResult = await sql`SELECT COUNT(*) as count FROM personality_profiles`;
    const count = (countResult[0] as any)?.count || 0;

    console.log(`[Setup] ✓ Verified: ${count} rows in table`);

    return NextResponse.json(
      {
        status: 'success',
        message: 'personality_profiles table created',
        rowCount: count,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[Setup] ❌ Error creating table:', errorMsg);

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
      message: 'POST to this endpoint to create the personality_profiles table',
      endpoint: 'POST /api/setup/create-table',
    },
    { status: 405 }
  );
}
