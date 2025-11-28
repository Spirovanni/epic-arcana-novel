import * as dotenv from 'dotenv';
import * as path from 'path';
import { neon } from '@neondatabase/serverless';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sql = neon(process.env.DATABASE_URL!);

async function verify() {
  try {
    console.log('Checking rgb_hex column population...\n');

    const result = await sql`
      SELECT
        COUNT(*) as total,
        COUNT(rgb_hex) as with_rgb_hex,
        COUNT(*) FILTER (WHERE rgb_hex IS NULL) as missing_rgb_hex
      FROM personality_profiles;
    `;

    const row = (result as any[])[0];
    console.log(`Total personalities: ${row.total}`);
    console.log(`With rgb_hex: ${row.with_rgb_hex}`);
    console.log(`Missing rgb_hex: ${row.missing_rgb_hex}\n`);

    // Show a few samples
    const samples = await sql`
      SELECT canonical_id, rgb_hex, display_name
      FROM personality_profiles
      WHERE rgb_hex IS NOT NULL
      ORDER BY canonical_id
      LIMIT 5;
    `;

    console.log('Sample data with rgb_hex:');
    for (const row of samples) {
      console.log(`  ${row.canonical_id}: ${row.rgb_hex} - ${row.display_name}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verify();
