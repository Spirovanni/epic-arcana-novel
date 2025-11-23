import { db } from '../src/lib/db';
import { growthFocus } from '../src/lib/schema';
import { sql } from 'drizzle-orm';

async function verifyImport() {
  try {
    console.log('🔍 Verifying growth_focus import...\n');

    // Count total records
    const countResult = await db.execute(sql`SELECT COUNT(*) as count FROM growth_focus`);
    const totalCount = countResult.rows[0] as any;
    console.log(`📊 Total growth_focus records: ${totalCount.count}\n`);

    // Count unique profiles
    const uniqueProfilesResult = await db.execute(sql`
      SELECT COUNT(DISTINCT canonical_id) as count FROM growth_focus
    `);
    const uniqueProfiles = uniqueProfilesResult.rows[0] as any;
    console.log(`👤 Unique personality profiles: ${uniqueProfiles.count}\n`);

    // Get sample records
    const samples = await db.execute(sql`
      SELECT canonical_id, profile_key, display_name, growth_index, growth_text
      FROM growth_focus
      ORDER BY canonical_id, growth_index
      LIMIT 5
    `);

    console.log('📝 Sample records:\n');
    samples.rows.forEach((row: any, idx: number) => {
      console.log(`--- Record ${idx + 1} ---`);
      console.log(`  Canonical ID: ${row.canonical_id}`);
      console.log(`  Profile Key: ${row.profile_key}`);
      console.log(`  Display Name: ${row.display_name}`);
      console.log(`  Growth Index: ${row.growth_index}`);
      console.log(`  Growth Text: ${row.growth_text.substring(0, 80)}...`);
      console.log('');
    });

    // Check indexes
    const indexesResult = await db.execute(sql`
      SELECT indexname
      FROM pg_indexes
      WHERE tablename = 'growth_focus'
      ORDER BY indexname
    `);

    console.log('📊 Indexes:\n');
    indexesResult.rows.forEach((row: any) => {
      console.log(`  ✓ ${row.indexname}`);
    });

    console.log('\n✅ Verification complete!');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  }
}

verifyImport().then(() => process.exit(0)).catch(() => process.exit(1));
