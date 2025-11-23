/**
 * Import strengths data into NeonDB
 *
 * Usage: npx tsx scripts/import-strengths.ts
 */

import { db } from '../src/lib/db';
import { strengths } from '../src/lib/schema';
import strengthsData from '../strengths.json';

interface StrengthRecord {
  canonical_id: string;
  profile_key: string;
  unique_identifier: string;
  specific_task_group_title: string;
  chapter_title: string;
  display_name: string;
  theme: string;
  strength_index: number;
  strength_text: string;
}

async function importStrengths() {
  console.log('🚀 Starting strengths data import...\n');

  try {
    // Transform the JSON data to match the database schema
    const records = (strengthsData as StrengthRecord[]).map(record => ({
      canonicalId: record.canonical_id,
      profileKey: record.profile_key,
      uniqueIdentifier: record.unique_identifier,
      specificTaskGroupTitle: record.specific_task_group_title,
      chapterTitle: record.chapter_title,
      displayName: record.display_name,
      theme: record.theme,
      strengthIndex: record.strength_index,
      strengthText: record.strength_text,
    }));

    console.log(`📊 Total records to import: ${records.length}`);
    console.log('⏳ Inserting records in batches...\n');

    // Insert in batches to avoid overwhelming the database
    const batchSize = 100;
    let imported = 0;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await db.insert(strengths).values(batch);
      imported += batch.length;

      // Progress indicator
      const percent = ((imported / records.length) * 100).toFixed(1);
      process.stdout.write(`\r✍️  Imported ${imported}/${records.length} records (${percent}%)`);
    }

    console.log('\n\n✅ Import completed successfully!\n');

    // Verify the import
    console.log('🔍 Verifying import...\n');

    const result = await db.select().from(strengths).limit(3);

    console.log('📋 Sample records from database:');
    console.log('─'.repeat(80));
    result.forEach((record, idx) => {
      console.log(`\nRecord ${idx + 1}:`);
      console.log(`  Canonical ID: ${record.canonicalId}`);
      console.log(`  Display Name: ${record.displayName}`);
      console.log(`  Strength #${record.strengthIndex}: ${record.strengthText?.substring(0, 60)}...`);
    });
    console.log('\n' + '─'.repeat(80));

    console.log('\n✨ All done! Your strengths data is now in NeonDB.');

  } catch (error) {
    console.error('\n❌ Error during import:', error);
    throw error;
  }
}

// Run the import
importStrengths()
  .then(() => {
    console.log('\n👋 Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Import failed:', error);
    process.exit(1);
  });
