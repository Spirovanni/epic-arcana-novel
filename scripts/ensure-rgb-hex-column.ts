import * as dotenv from 'dotenv';
import * as path from 'path';
import { neon } from '@neondatabase/serverless';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sql = neon(process.env.DATABASE_URL!);

async function ensureColumn() {
  try {
    console.log('Ensuring rgb_hex column exists on personality_profiles...\n');

    await sql`
      ALTER TABLE personality_profiles
      ADD COLUMN IF NOT EXISTS rgb_hex TEXT;
    `;

    console.log('✓ rgb_hex column ensured\n');

    // Check if rgb_hex is populated, if not populate from color_alignment
    const result = await sql`
      UPDATE personality_profiles
      SET rgb_hex = color_alignment->>'rgb_hex'
      WHERE rgb_hex IS NULL
        AND color_alignment IS NOT NULL
      RETURNING canonical_id, rgb_hex;
    `;

    console.log(`✓ Updated ${result.length} personalities with rgb_hex from color_alignment\n`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

ensureColumn();
