import { sql } from '@/lib/neon';

/**
 * Fix icon paths for personalities in book 2 and beyond
 * Book 1: chapters 1-40 (all_chapter 1-40)
 * Book 2: chapters 1-40 (all_chapter 41-80)
 * Book 3: chapters 1-40 (all_chapter 81-120)
 * etc.
 */
async function fixBook2Icons() {
  try {
    console.log('Starting book 2+ icon path fix...\n');

    // Get all personalities and calculate correct icon paths
    const personalities = await sql`
      SELECT canonical_id, all_chapter, novel_book, color_name, rgb_hex
      FROM personality_chapter_mappings
      ORDER BY all_chapter
    `;

    console.log(`Found ${personalities.length} personalities\n`);

    // Calculate the correct chapter number within the book
    // all_chapter 1-40 -> book 1, chapter 1-40
    // all_chapter 41-80 -> book 2, chapter 1-40
    // all_chapter 81-120 -> book 3, chapter 1-40
    // Formula: chapter_within_book = ((all_chapter - 1) % 40) + 1

    let updateCount = 0;
    for (const personality of personalities) {
      const allChapter = personality.all_chapter as number;
      const book = personality.novel_book as number;
      const chapterWithinBook = ((allChapter - 1) % 40) + 1;
      
      const iconPath = `/icons/chapters/book${book}/chapter${chapterWithinBook}.png`;

      try {
        await sql`
          UPDATE personality_chapter_mappings
          SET icon_path = ${iconPath}
          WHERE canonical_id = ${personality.canonical_id}
        `;
        updateCount++;

        // Log sample updates
        if (allChapter <= 5 || allChapter === 41 || allChapter === 81) {
          console.log(
            `✓ ${personality.canonical_id} (all_chapter: ${allChapter}, book: ${book}) → ${iconPath}`
          );
        }
      } catch (error) {
        console.error(
          `Error updating ${personality.canonical_id}:`,
          error
        );
      }
    }

    console.log(`\n✓ Updated ${updateCount} personality icon paths\n`);

    // Verify the fix
    const bookBoundary = await sql`
      SELECT canonical_id, all_chapter, novel_book, icon_path, color_name
      FROM personality_chapter_mappings
      WHERE all_chapter IN (40, 41, 80, 81, 120, 121)
      ORDER BY all_chapter
    `;

    console.log('Verification - personalities at book boundaries:');
    for (const row of bookBoundary) {
      console.log(
        `  ${row.canonical_id} (ch ${row.all_chapter}, book ${row.novel_book}): ${row.icon_path}`
      );
    }

    console.log('\n✓ Book 2+ icon path fix complete!\n');
  } catch (error) {
    console.error('Error fixing book 2+ icons:', error);
    throw error;
  }
}

fixBook2Icons()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
