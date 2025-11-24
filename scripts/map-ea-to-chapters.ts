import { Client } from '@neondatabase/serverless';

/**
 * Map personality profiles (EAs) to chapters in sequential order
 * EA-001 → Book 1 Chapter 1
 * EA-002 → Book 1 Chapter 2
 * etc.
 */
async function mapEAsToChapters() {
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();

  try {
    console.log('Starting EA to Chapter mapping...\n');

    // Get all personality profiles ordered by canonical_id (EA-001, EA-002, etc.)
    const personalitiesResult = await client.query(
      'SELECT id, canonical_id FROM personality_profiles ORDER BY canonical_id ASC'
    );
    const personalities = personalitiesResult.rows as any[];

    console.log(`Found ${personalities.length} personality profiles\n`);

    // Get all chapters ordered by book then chapter number
    const chaptersResult = await client.query(`
      SELECT c.id, c.unique_identifier, c.title, c.chapter_number, b.book_number, c.icon_path, c.hex_code
      FROM chapters c
      JOIN books b ON c.book_id = b.id
      ORDER BY b.id ASC, c.chapter_number ASC
    `);
    const allChapters = chaptersResult.rows as any[];

    console.log(`Found ${allChapters.length} chapters\n`);

    // Create mapping
    const updates: any[] = [];
    for (let i = 0; i < personalities.length && i < allChapters.length; i++) {
      const personality = personalities[i];
      const chapter = allChapters[i];

      updates.push({
        ea: personality.canonical_id,
        chapter_title: chapter.title,
        chapter_num: chapter.chapter_number,
        book_num: chapter.book_number,
        icon_path: chapter.icon_path,
        hex_code: chapter.hex_code,
      });
    }

    console.log('First 10 mappings:');
    updates.slice(0, 10).forEach((mapping) => {
      console.log(
        `  ${mapping.ea} → Book ${mapping.book_num} Chapter ${mapping.chapter_num}: ${mapping.chapter_title}`
      );
      console.log(`    Icon: ${mapping.icon_path}`);
      console.log(`    Color: ${mapping.hex_code}`);
    });

    console.log('\n════════════════════════════════════════');
    console.log(`Total mapped: ${updates.length}`);
    console.log('════════════════════════════════════════\n');

    if (updates.length > 0) {
      console.log('This mapping shows which chapter image should display for each EA.');
      console.log('Chapters are mapped in sequential order across all books.');
    }

  } catch (error) {
    console.error('Error mapping EAs to chapters:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the script
mapEAsToChapters().then(() => {
  console.log('Script completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
