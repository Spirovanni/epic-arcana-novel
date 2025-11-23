import { db } from '../src/lib/db';
import { growthFocus } from '../src/lib/schema';
import * as fs from 'fs';
import * as path from 'path';

interface GrowthFocusRecord {
  canonical_id: string;
  profile_key: string;
  unique_identifier: string;
  specific_task_group_title: string;
  chapter_title: string;
  display_name: string;
  theme: string;
  growth_index: number;
  growth_text: string;
}

async function importGrowthFocus() {
  try {
    console.log('🚀 Starting growth_focus import...\n');

    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'growth_focus.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const records: GrowthFocusRecord[] = JSON.parse(rawData);

    console.log(`📊 Found ${records.length} growth_focus records to import\n`);

    // Transform the data to match the schema
    const transformedRecords = records.map(record => ({
      canonicalId: record.canonical_id,
      profileKey: record.profile_key,
      uniqueIdentifier: record.unique_identifier,
      specificTaskGroupTitle: record.specific_task_group_title,
      chapterTitle: record.chapter_title,
      displayName: record.display_name,
      theme: record.theme,
      growthIndex: record.growth_index,
      growthText: record.growth_text,
    }));

    // Import in batches of 100
    const BATCH_SIZE = 100;
    let imported = 0;

    for (let i = 0; i < transformedRecords.length; i += BATCH_SIZE) {
      const batch = transformedRecords.slice(i, i + BATCH_SIZE);

      try {
        await db.insert(growthFocus).values(batch);
        imported += batch.length;
        console.log(`✅ Imported batch ${Math.floor(i / BATCH_SIZE) + 1}: ${imported}/${transformedRecords.length} records`);
      } catch (error) {
        console.error(`❌ Error importing batch starting at index ${i}:`, error);
        throw error;
      }
    }

    console.log(`\n✅ Successfully imported ${imported} growth_focus records!`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

importGrowthFocus().then(() => process.exit(0)).catch(() => process.exit(1));
