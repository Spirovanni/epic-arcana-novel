/**
 * Resume shadow traits data import into NeonDB (skip already imported records)
 *
 * Usage: npx tsx scripts/import-shadow-resume.ts
 */

import { db } from '../src/lib/db';
import { shadow } from '../src/lib/schema';
import { sql } from 'drizzle-orm';
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

async function importShadowResume() {
  console.log('🚀 Resuming shadow traits data import...\n');

  try {
    // Check current count
    const countResult = await db.select({ count: sql<number>`count(*)::int` }).from(shadow);
    const currentCount = countResult[0]?.count || 0;

    console.log(`📊 Current records in database: ${currentCount}`);
    console.log(`📊 Total records in JSON: ${shadowData.length}`);
    console.log(`📊 Records to import: ${shadowData.length - currentCount}\n`);

    if (currentCount >= shadowData.length) {
      console.log('✅ All records already imported!');
      return;
    }

    // Transform the JSON data to match the database schema
    const allRecords = (shadowData as ShadowRecord[]).map(record => ({
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

    // Skip already imported records
    const recordsToImport = allRecords.slice(currentCount);

    console.log(`⏳ Inserting ${recordsToImport.length} remaining records in batches...\n`);

    // Insert in smaller batches with retry logic
    const batchSize = 50; // Reduced from 100
    let imported = 0;

    for (let i = 0; i < recordsToImport.length; i += batchSize) {
      const batch = recordsToImport.slice(i, i + batchSize);

      // Retry logic for each batch
      let retries = 3;
      while (retries > 0) {
        try {
          await db.insert(shadow).values(batch);
          imported += batch.length;

          // Progress indicator
          const percent = ((imported / recordsToImport.length) * 100).toFixed(1);
          process.stdout.write(`\r✍️  Imported ${imported}/${recordsToImport.length} records (${percent}%)`);
          break; // Success, exit retry loop
        } catch (error) {
          retries--;
          if (retries === 0) {
            console.error(`\n\n❌ Failed to import batch after 3 attempts. Progress: ${currentCount + imported} total records.`);
            throw error;
          }
          console.log(`\n⚠️  Batch failed, retrying... (${retries} attempts left)`);
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    console.log('\n\n✅ Import completed successfully!\n');

    // Verify the final count
    const finalCountResult = await db.select({ count: sql<number>`count(*)::int` }).from(shadow);
    const finalCount = finalCountResult[0]?.count || 0;

    console.log(`📊 Final record count: ${finalCount}`);
    console.log(`✨ All done! Your shadow traits data is now in NeonDB.`);

  } catch (error) {
    console.error('\n❌ Error during import:', error);

    // Show current progress
    const countResult = await db.select({ count: sql<number>`count(*)::int` }).from(shadow);
    const currentCount = countResult[0]?.count || 0;
    console.log(`\n📊 Current progress: ${currentCount}/${shadowData.length} records`);
    console.log('💡 You can run this script again to resume from where it left off.');

    throw error;
  }
}

// Run the import
importShadowResume()
  .then(() => {
    console.log('\n👋 Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Import failed. Run again to resume.');
    process.exit(1);
  });
