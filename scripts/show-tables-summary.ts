/**
 * Show summary of strengths and shadow tables in NeonDB
 *
 * Usage: npx tsx scripts/show-tables-summary.ts
 */

import { db } from '../src/lib/db';
import { strengths, shadow } from '../src/lib/schema';
import { sql } from 'drizzle-orm';

async function showTablesSummary() {
  console.log('📊 Database Tables Summary\n');
  console.log('═'.repeat(80) + '\n');

  try {
    // Strengths table summary
    console.log('💪 STRENGTHS TABLE');
    console.log('─'.repeat(80));

    const strengthsCount = await db.select({ count: sql<number>`count(*)::int` }).from(strengths);
    const strengthsProfiles = await db.select({ count: sql<number>`count(distinct canonical_id)::int` }).from(strengths);

    console.log(`  Total records: ${strengthsCount[0]?.count || 0}`);
    console.log(`  Unique profiles: ${strengthsProfiles[0]?.count || 0}`);
    console.log(`  Avg per profile: ${((strengthsCount[0]?.count || 0) / (strengthsProfiles[0]?.count || 1)).toFixed(2)}`);

    // Sample strength
    const sampleStrength = await db.select().from(strengths).limit(1);
    if (sampleStrength.length > 0) {
      console.log(`\n  Sample record:`);
      console.log(`    ID: ${sampleStrength[0].canonicalId}`);
      console.log(`    Profile: ${sampleStrength[0].displayName}`);
      console.log(`    Strength: ${sampleStrength[0].strengthText?.substring(0, 60)}...`);
    }

    // Shadow table summary
    console.log('\n\n🌑 SHADOW TABLE');
    console.log('─'.repeat(80));

    const shadowCount = await db.select({ count: sql<number>`count(*)::int` }).from(shadow);
    const shadowProfiles = await db.select({ count: sql<number>`count(distinct canonical_id)::int` }).from(shadow);

    console.log(`  Total records: ${shadowCount[0]?.count || 0}`);
    console.log(`  Unique profiles: ${shadowProfiles[0]?.count || 0}`);
    console.log(`  Avg per profile: ${((shadowCount[0]?.count || 0) / (shadowProfiles[0]?.count || 1)).toFixed(2)}`);

    // Sample shadow
    const sampleShadow = await db.select().from(shadow).limit(1);
    if (sampleShadow.length > 0) {
      console.log(`\n  Sample record:`);
      console.log(`    ID: ${sampleShadow[0].canonicalId}`);
      console.log(`    Profile: ${sampleShadow[0].displayName}`);
      console.log(`    Shadow: ${sampleShadow[0].shadowText?.substring(0, 60)}...`);
    }

    // Combined stats
    console.log('\n\n📈 COMBINED STATISTICS');
    console.log('─'.repeat(80));
    const totalRecords = (strengthsCount[0]?.count || 0) + (shadowCount[0]?.count || 0);
    console.log(`  Total trait records: ${totalRecords}`);
    console.log(`  Strengths: ${strengthsCount[0]?.count || 0} (${(((strengthsCount[0]?.count || 0) / totalRecords) * 100).toFixed(1)}%)`);
    console.log(`  Shadow: ${shadowCount[0]?.count || 0} (${(((shadowCount[0]?.count || 0) / totalRecords) * 100).toFixed(1)}%)`);

    // List all indexes
    console.log('\n\n🔍 INDEXES');
    console.log('─'.repeat(80));

    const indexes = await db.execute(sql`
      SELECT tablename, indexname
      FROM pg_indexes
      WHERE tablename IN ('strengths', 'shadow')
      ORDER BY tablename, indexname
    `);

    let currentTable = '';
    indexes.rows.forEach((row: any) => {
      if (row.tablename !== currentTable) {
        currentTable = row.tablename;
        console.log(`\n  ${row.tablename}:`);
      }
      console.log(`    ✓ ${row.indexname}`);
    });

    console.log('\n\n' + '═'.repeat(80));
    console.log('✅ Both tables are live in NeonDB and ready to use!');
    console.log('\n💡 Access your web-based DB viewer to see these tables.');

  } catch (error) {
    console.error('\n❌ Error:', error);
    throw error;
  }
}

// Run the summary
showTablesSummary()
  .then(() => {
    console.log('\n👋 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed:', error);
    process.exit(1);
  });
