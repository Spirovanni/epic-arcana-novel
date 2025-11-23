/**
 * Remove duplicate strengths records from the database
 * Keeps only the first record for each (canonical_id, strength_index) pair
 *
 * Usage: npx tsx scripts/deduplicate-strengths.ts
 */

import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function deduplicateStrengths() {
  console.log('🧹 Removing duplicate strengths records...\n');

  try {
    // Count current records
    const beforeResult = await db.execute(sql`SELECT COUNT(*)::int as count FROM strengths`);
    const beforeCount = beforeResult.rows[0]?.count || 0;
    console.log(`📊 Records before deduplication: ${beforeCount}`);

    // Delete duplicates, keeping only the earliest ID for each (canonical_id, strength_index) pair
    const deleteResult = await db.execute(sql`
      DELETE FROM strengths
      WHERE id IN (
        SELECT id
        FROM (
          SELECT id,
                 ROW_NUMBER() OVER (
                   PARTITION BY canonical_id, strength_index
                   ORDER BY created_at, id
                 ) AS rn
          FROM strengths
        ) t
        WHERE rn > 1
      )
    `);

    // Count after
    const afterResult = await db.execute(sql`SELECT COUNT(*)::int as count FROM strengths`);
    const afterCount = afterResult.rows[0]?.count || 0;

    console.log(`📊 Records after deduplication: ${afterCount}`);
    console.log(`🗑️  Deleted ${beforeCount - afterCount} duplicate records`);

    console.log('\n✅ Deduplication complete!');

  } catch (error) {
    console.error('\n❌ Error during deduplication:', error);
    throw error;
  }
}

// Run the deduplication
deduplicateStrengths()
  .then(() => {
    console.log('\n👋 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Deduplication failed:', error);
    process.exit(1);
  });
