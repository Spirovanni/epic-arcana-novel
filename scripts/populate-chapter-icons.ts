import { sql } from '@/lib/neon';

/**
 * Populate chapter icon_path field based on book number and chapter number
 * Icon path format: /icons/chapters/bookX/chapterN.png
 */
async function populateChapterIcons() {
  try {
    console.log('Starting chapter icon population...\n');

    // Update all chapters with icon paths based on their book and chapter number
    const result = await sql`
      UPDATE chapters
      SET icon_path = '/icons/chapters/book' || b.book_number || '/chapter' || chapters.chapter_number || '.png'
      FROM books b
      WHERE chapters.book_id = b.id
        AND chapters.chapter_number IS NOT NULL
        AND chapters.icon_path IS NULL
      RETURNING chapters.id, chapters.title, chapters.chapter_number, chapters.icon_path
    `;

    const updatedCount = (result as any[])?.length || 0;
    console.log(`✓ Updated ${updatedCount} chapters with icon paths\n`);

    if (updatedCount > 0) {
      console.log('Sample updated chapters:');
      (result as any[]).slice(0, 5).forEach((chapter: any) => {
        console.log(`  - Chapter ${chapter.chapter_number}: ${chapter.title}`);
        console.log(`    Path: ${chapter.icon_path}`);
      });
      if (updatedCount > 5) {
        console.log(`  ... and ${updatedCount - 5} more chapters`);
      }
    }

    console.log('\n════════════════════════════════════════');
    console.log(`Total chapters updated: ${updatedCount}`);
    console.log('════════════════════════════════════════');
    console.log('✓ Chapter icon population complete!\n');

  } catch (error) {
    console.error('Error populating chapter icons:', error);
    throw error;
  }
}

// Run the script
populateChapterIcons().then(() => {
  console.log('Script completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
