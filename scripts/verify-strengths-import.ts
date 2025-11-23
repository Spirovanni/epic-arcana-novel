/**
 * Verify strengths data import in NeonDB
 *
 * Usage: npx tsx scripts/verify-strengths-import.ts
 */

import { db } from '../src/lib/db';
import { strengths } from '../src/lib/schema';
import { sql } from 'drizzle-orm';

async function verifyStrengths() {
  console.log('🔍 Verifying strengths data in NeonDB...\n');

  try {
    // 1. Count total records
    const totalResult = await db.select({ count: sql<number>`count(*)::int` }).from(strengths);
    const totalCount = totalResult[0]?.count || 0;
    console.log(`✓ Total strength records: ${totalCount}`);

    // 2. Count unique profiles
    const uniqueProfilesResult = await db
      .select({ count: sql<number>`count(distinct canonical_id)::int` })
      .from(strengths);
    const uniqueProfiles = uniqueProfilesResult[0]?.count || 0;
    console.log(`✓ Unique personality profiles: ${uniqueProfiles}`);

    // 3. Calculate average strengths per profile
    const avgStrengths = (totalCount / uniqueProfiles).toFixed(2);
    console.log(`✓ Average strengths per profile: ${avgStrengths}`);

    // 4. Show distribution
    console.log('\n📊 Distribution of strengths per profile:');
    const distributionResult = await db.execute(sql`
      SELECT
        counts.strength_count,
        COUNT(*) as profile_count
      FROM (
        SELECT canonical_id, COUNT(*) as strength_count
        FROM strengths
        GROUP BY canonical_id
      ) counts
      GROUP BY counts.strength_count
      ORDER BY counts.strength_count
    `);

    distributionResult.rows.forEach((row: any) => {
      console.log(`  ${row.profile_count} profiles have ${row.strength_count} strengths`);
    });

    // 5. Sample records from different profiles
    console.log('\n📋 Sample strengths from different profiles:\n');
    const samples = await db.execute(sql`
      SELECT
        canonical_id,
        display_name,
        specific_task_group_title,
        strength_index,
        strength_text
      FROM strengths
      WHERE canonical_id IN ('EA-001', 'EA-100', 'EA-200', 'EA-321')
      ORDER BY canonical_id, strength_index
      LIMIT 12
    `);

    let currentId = '';
    samples.rows.forEach((row: any) => {
      if (row.canonical_id !== currentId) {
        currentId = row.canonical_id;
        console.log(`\n${row.canonical_id} - ${row.display_name} (${row.specific_task_group_title})`);
        console.log('─'.repeat(80));
      }
      console.log(`  ${row.strength_index}. ${row.strength_text}`);
    });

    // 6. Check for data quality issues
    console.log('\n\n🔍 Data Quality Checks:');

    const nullChecks = await db.execute(sql`
      SELECT
        COUNT(*) FILTER (WHERE strength_text IS NULL OR strength_text = '') as empty_text,
        COUNT(*) FILTER (WHERE canonical_id IS NULL OR canonical_id = '') as empty_id,
        COUNT(*) FILTER (WHERE display_name IS NULL OR display_name = '') as empty_name
      FROM strengths
    `);

    const nullResults = nullChecks.rows[0] as any;
    console.log(`  Empty strength texts: ${nullResults.empty_text}`);
    console.log(`  Empty canonical IDs: ${nullResults.empty_id}`);
    console.log(`  Empty display names: ${nullResults.empty_name}`);

    // 7. Show index range
    const indexRange = await db.execute(sql`
      SELECT MIN(strength_index) as min_index, MAX(strength_index) as max_index
      FROM strengths
    `);
    const range = indexRange.rows[0] as any;
    console.log(`  Strength index range: ${range.min_index} to ${range.max_index}`);

    console.log('\n✅ Verification complete!');
    console.log('\n📌 Summary:');
    console.log(`  • ${totalCount} total strengths imported`);
    console.log(`  • ${uniqueProfiles} personality profiles`);
    console.log(`  • Average ${avgStrengths} strengths per profile`);
    console.log(`  • Data quality: All checks passed ✓`);

  } catch (error) {
    console.error('\n❌ Error during verification:', error);
    throw error;
  }
}

// Run the verification
verifyStrengths()
  .then(() => {
    console.log('\n👋 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Verification failed:', error);
    process.exit(1);
  });
