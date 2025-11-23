import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function deduplicateGrowthFocus() {
  try {
    console.log('🔍 Checking for duplicate growth_focus records...\n');

    // Count total records before deduplication
    const beforeCount = await db.execute(sql`SELECT COUNT(*) as count FROM growth_focus`);
    const totalBefore = (beforeCount.rows[0] as any).count;
    console.log(`📊 Total records before: ${totalBefore}\n`);

    // Find duplicates
    const duplicatesResult = await db.execute(sql`
      SELECT canonical_id, growth_index, COUNT(*) as dup_count
      FROM growth_focus
      GROUP BY canonical_id, growth_index
      HAVING COUNT(*) > 1
      ORDER BY dup_count DESC
      LIMIT 10
    `);

    if (duplicatesResult.rows.length === 0) {
      console.log('✅ No duplicates found!');
      return;
    }

    console.log(`⚠️  Found duplicates for ${duplicatesResult.rows.length} combinations\n`);
    console.log('Sample duplicates:');
    duplicatesResult.rows.slice(0, 5).forEach((row: any) => {
      console.log(`  - canonical_id: ${row.canonical_id || '(empty)'}, growth_index: ${row.growth_index}, count: ${row.dup_count}`);
    });

    console.log('\n🗑️  Removing duplicates (keeping earliest by created_at)...\n');

    // Delete duplicates, keeping only the first occurrence
    const deleteResult = await db.execute(sql`
      DELETE FROM growth_focus
      WHERE id IN (
        SELECT id FROM (
          SELECT id,
            ROW_NUMBER() OVER (
              PARTITION BY canonical_id, growth_index
              ORDER BY created_at, id
            ) AS rn
          FROM growth_focus
        ) t
        WHERE rn > 1
      )
    `);

    // Count total records after deduplication
    const afterCount = await db.execute(sql`SELECT COUNT(*) as count FROM growth_focus`);
    const totalAfter = (afterCount.rows[0] as any).count;

    console.log(`📊 Total records after: ${totalAfter}`);
    console.log(`🗑️  Removed ${totalBefore - totalAfter} duplicate records\n`);
    console.log('✅ Deduplication complete!');

  } catch (error) {
    console.error('❌ Deduplication failed:', error);
    throw error;
  }
}

deduplicateGrowthFocus().then(() => process.exit(0)).catch(() => process.exit(1));
