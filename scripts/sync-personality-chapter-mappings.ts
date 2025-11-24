import * as fs from 'fs';
import * as path from 'path';
import { Client } from '@neondatabase/serverless';

interface PersonalityData {
  canonical_id: string;
  all_chapter: number;
  novel_book: number;
  chapter_title: string;
  specific_task_group_title?: string;
}

/**
 * Sync personality profile chapter and book mappings from new_personality_profile.json
 * This creates a new table to store the direct mapping between personality IDs and chapters
 */
async function syncPersonalityChapterMappings() {
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();

  try {
    console.log('Starting personality chapter mapping sync...\n');

    // Read the personality profile file
    const profilePath = path.join(
      process.cwd(),
      'data/dist/new_personality_profile.json'
    );
    const profileData = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));

    // Extract all personality data
    const personalities: PersonalityData[] = [];
    for (const [, family] of Object.entries(profileData.families)) {
      const familyData = family as any;
      for (const [, personality] of Object.entries(familyData.personalities)) {
        const personData = personality as any;
        personalities.push({
          canonical_id: personData.canonical_id,
          all_chapter: personData.all_chapter,
          novel_book: personData.novel_book,
          chapter_title: personData.chapter_title || personData.specific_task_group_title,
          specific_task_group_title: personData.specific_task_group_title,
        });
      }
    }

    console.log(`Extracted ${personalities.length} personalities from profile file\n`);

    // Create the mapping table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS personality_chapter_mappings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        canonical_id VARCHAR(20) UNIQUE NOT NULL,
        all_chapter INTEGER NOT NULL,
        novel_book INTEGER NOT NULL,
        chapter_title TEXT,
        specific_task_group_title TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✓ Created personality_chapter_mappings table\n');

    // Batch insert the data
    let insertedCount = 0;
    let updatedCount = 0;

    for (const personality of personalities) {
      try {
        const result = await client.query(
          `
          INSERT INTO personality_chapter_mappings (
            canonical_id,
            all_chapter,
            novel_book,
            chapter_title,
            specific_task_group_title
          ) VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (canonical_id) DO UPDATE SET
            all_chapter = $2,
            novel_book = $3,
            chapter_title = $4,
            specific_task_group_title = $5,
            updated_at = NOW()
          `,
          [
            personality.canonical_id,
            personality.all_chapter,
            personality.novel_book,
            personality.chapter_title,
            personality.specific_task_group_title,
          ]
        );

        // Check if it was inserted or updated
        if (result.rows && result.rows.length > 0) {
          if (result.command === 'INSERT') {
            insertedCount++;
          } else {
            updatedCount++;
          }
        }
      } catch (error) {
        console.error(`Error syncing ${personality.canonical_id}:`, error);
      }
    }

    console.log('════════════════════════════════════════');
    console.log(`Total processed: ${personalities.length}`);
    console.log(`Inserted: ${insertedCount}`);
    console.log(`Updated: ${updatedCount}`);
    console.log('════════════════════════════════════════\n');

    // Verify the data
    const verification = await client.query(
      'SELECT COUNT(*) as count FROM personality_chapter_mappings'
    );
    const totalRows = (verification.rows[0] as any).count;
    console.log(`✓ Total rows in personality_chapter_mappings: ${totalRows}\n`);

    // Show sample data
    const samples = await client.query(
      'SELECT canonical_id, all_chapter, novel_book, chapter_title FROM personality_chapter_mappings LIMIT 5'
    );

    console.log('Sample mappings:');
    (samples.rows as any[]).forEach((row) => {
      console.log(
        `  ${row.canonical_id} → Book ${row.novel_book}, Chapter ${row.all_chapter}: ${row.chapter_title}`
      );
    });

    console.log('\n✓ Personality chapter mapping sync complete!\n');

  } catch (error) {
    console.error('Error syncing personality chapter mappings:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the script
syncPersonalityChapterMappings()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
