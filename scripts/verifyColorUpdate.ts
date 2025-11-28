import * as dotenv from 'dotenv';
import * as path from 'path';
import { neon } from '@neondatabase/serverless';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sql = neon(process.env.NEON_DATABASE_URL || process.env.DATABASE_URL!);

async function verify() {
  const samples = await sql`
    SELECT canonical_id, rgb_hex, hue_index, hsl
    FROM personality_profiles
    WHERE canonical_id IN ('EA-001', 'EA-041', 'EA-100')
    ORDER BY canonical_id;
  `;

  console.log('Sample color data from personality_profiles:\n');
  for (const row of samples) {
    console.log(`${row.canonical_id}:`);
    console.log(`  rgb_hex: ${row.rgb_hex}`);
    console.log(`  hue_index: ${row.hue_index}`);
    console.log(`  hsl: ${row.hsl}`);
    console.log();
  }

  process.exit(0);
}

verify().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
