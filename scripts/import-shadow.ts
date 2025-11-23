/**
 * Import shadow traits data into NeonDB
 *
 * Usage: npx tsx scripts/import-shadow.ts
 */

import { db } from '../src/lib/db';
import { shadow } from '../src/lib/schema';
import shadowData from '../shadow.json';

interface ShadowRecord {
  canonical_id: string;
  profile_key: string;
  unique_identifier: string;
  specific_task_group_title: string;
  chapter_title: string;
  display_name: string;
  theme: string;
  shadow_index: number;
  shadow_text: string;
}

async function importShadow() {
  console.log('🚀 Starting shadow traits data import...\n');

  try {
    // Transform the JSON data to match the database schema
    const records = (shadowData as ShadowRecord[]).map(record => ({
      canonicalId: record.canonical_id,
      profileKey: record.profile_key,
      uniqueIdentifier: record.unique_identifier,
      specificTaskGroupTitle: record.specific_task_group_title,
      chapterTitle: record.chapter_title,
      displayName: record.display_name,
      theme: record.theme,
      shadowIndex: record.shadow_index,
      shadowText: record.shadow_text,
    }));

    console.log(`📊 Total records to import: ${records.length}`);
    console.log('⏳ Inserting records in batches...\n');

    // Insert in batches to avoid overwhelming the database
    const batchSize = 100;
    let imported = 0;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await db.insert(shadow).values(batch);
      imported += batch.length;

      // Progress indicator
      const percent = ((imported / records.length) * 100).toFixed(1);
      process.stdout.write(`\r✍️  Imported ${imported}/${records.length} records (${percent}%)`);
    }

    console.log('\n\n✅ Import completed successfully!\n');

    // Verify the import
    console.log('🔍 Verifying import...\n');

    const result = await db.select().from(shadow).limit(3);

    console.log('📋 Sample records from database:');
    console.log('─'.repeat(80));
    result.forEach((record, idx) => {
      console.log(`\nRecord ${idx + 1}:`);
      console.log(`  Canonical ID: ${record.canonicalId}`);
      console.log(`  Display Name: ${record.displayName}`);
      console.log(`  Shadow #${record.shadowIndex}: ${record.shadowText?.substring(0, 60)}...`);
    });
    console.log('\n' + '─'.repeat(80));

    console.log('\n✨ All done! Your shadow traits data is now in NeonDB.');

  } catch (error) {
    console.error('\n❌ Error during import:', error);
    throw error;
  }
}

// Run the import
importShadow()
  .then(() => {
    console.log('\n👋 Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Import failed:', error);
    process.exit(1);
  });
