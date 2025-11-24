import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(databaseUrl);

async function createPersonalityProfilesTable() {
  console.log('Creating personality_profiles table in production...');

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

    console.log('✓ personality_profiles table created successfully');

    // Verify table was created
    const result = await sql`SELECT COUNT(*) as count FROM personality_profiles`;
    console.log('✓ Table verified. Current row count:', result[0]?.count || 0);
  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  }
}

createPersonalityProfilesTable().catch((error) => {
  console.error('Failed:', error);
  process.exit(1);
});
