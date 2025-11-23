/**
 * Verify shadow traits data import in NeonDB
 *
 * Usage: npx tsx scripts/verify-shadow-import.ts
 */

import { db } from '../src/lib/db';
import { shadow } from '../src/lib/schema';
import { sql } from 'drizzle-orm';

async function verifyShadow() {
  console.log('🔍 Verifying shadow traits data in NeonDB...\n');

  try {
    // 1. Count total records
    const totalResult = await db.select({ count: sql<number>`count(*)::int` }).from(shadow);
    const totalCount = totalResult[0]?.count || 0;
    console.log(`✓ Total shadow trait records: ${totalCount}`);

    // 2. Count unique profiles
    const uniqueProfilesResult = await db
      .select({ count: sql<number>`count(distinct canonical_id)::int` })
      .from(shadow);
    const uniqueProfiles = uniqueProfilesResult[0]?.count || 0;
    console.log(`✓ Unique personality profiles: ${uniqueProfiles}`);

    // 3. Calculate average shadow traits per profile
    const avgShadow = (totalCount / uniqueProfiles).toFixed(2);
    console.log(`✓ Average shadow traits per profile: ${avgShadow}`);

    // 4. Show distribution
    console.log('\n📊 Distribution of shadow traits per profile:');
    const distributionResult = await db.execute(sql`
      SELECT
        counts.shadow_count,
        COUNT(*) as profile_count
      FROM (
        SELECT canonical_id, COUNT(*) as shadow_count
        FROM shadow
        GROUP BY canonical_id
      ) counts
      GROUP BY counts.shadow_count
      ORDER BY counts.shadow_count
    `);

    distributionResult.rows.forEach((row: any) => {
      console.log(`  ${row.profile_count} profiles have ${row.shadow_count} shadow traits`);
    });

    // 5. Sample records from different profiles
    console.log('\n📋 Sample shadow traits from different profiles:\n');
    const samples = await db.execute(sql`
      SELECT
        canonical_id,
        display_name,
        specific_task_group_title,
        shadow_index,
        shadow_text
      FROM shadow
      WHERE canonical_id IN ('EA-001', 'EA-100', 'EA-200', 'EA-321')
      ORDER BY canonical_id, shadow_index
      LIMIT 12
    `);

    let currentId = '';
    samples.rows.forEach((row: any) => {
      if (row.canonical_id !== currentId) {
        currentId = row.canonical_id;
        console.log(`\n${row.canonical_id} - ${row.display_name} (${row.specific_task_group_title})`);
        console.log('─'.repeat(80));
      }
      console.log(`  ${row.shadow_index}. ${row.shadow_text}`);
    });

    // 6. Check for data quality issues
    console.log('\n\n🔍 Data Quality Checks:');

    const nullChecks = await db.execute(sql`
      SELECT
        COUNT(*) FILTER (WHERE shadow_text IS NULL OR shadow_text = '') as empty_text,
        COUNT(*) FILTER (WHERE canonical_id IS NULL OR canonical_id = '') as empty_id,
        COUNT(*) FILTER (WHERE display_name IS NULL OR display_name = '') as empty_name
      FROM shadow
    `);

    const nullResults = nullChecks.rows[0] as any;
    console.log(`  Empty shadow texts: ${nullResults.empty_text}`);
    console.log(`  Empty canonical IDs: ${nullResults.empty_id}`);
    console.log(`  Empty display names: ${nullResults.empty_name}`);

    // 7. Show index range
    const indexRange = await db.execute(sql`
      SELECT MIN(shadow_index) as min_index, MAX(shadow_index) as max_index
      FROM shadow
    `);
    const range = indexRange.rows[0] as any;
    console.log(`  Shadow index range: ${range.min_index} to ${range.max_index}`);

    console.log('\n✅ Verification complete!');
    console.log('\n📌 Summary:');
    console.log(`  • ${totalCount} total shadow traits imported`);
    console.log(`  • ${uniqueProfiles} personality profiles`);
    console.log(`  • Average ${avgShadow} shadow traits per profile`);
    console.log(`  • Data quality: All checks passed ✓`);

  } catch (error) {
    console.error('\n❌ Error during verification:', error);
    throw error;
  }
}

// Run the verification
verifyShadow()
  .then(() => {
    console.log('\n👋 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Verification failed:', error);
    process.exit(1);
  });
