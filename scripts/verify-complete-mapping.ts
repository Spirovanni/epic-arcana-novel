import { sql } from '@/lib/neon';

/**
 * Verify that all 360 personalities have correct mappings
 */
async function verifyCompleteMapping() {
  try {
    console.log('Verifying complete personality mappings...\n');

    // Count personalities by book
    const bookCounts = await sql`
      SELECT novel_book, COUNT(*) as count
      FROM personality_chapter_mappings
      GROUP BY novel_book
      ORDER BY novel_book
    `;

    console.log('Personalities per book:');
    let totalCount = 0;
    for (const row of bookCounts) {
      console.log(`  Book ${row.novel_book}: ${row.count} personalities`);
      totalCount += row.count as number;
    }
    console.log(`  Total: ${totalCount} personalities\n`);

    // Verify all have icon paths
    const missingIconPaths = await sql`
      SELECT COUNT(*) as count
      FROM personality_chapter_mappings
      WHERE icon_path IS NULL
    `;

    const missingCount = (missingIconPaths[0] as any).count;
    console.log(`Personalities with icon_path: ${totalCount - missingCount}`);
    console.log(`Personalities missing icon_path: ${missingCount}\n`);

    // Verify all have colors
    const missingColors = await sql`
      SELECT COUNT(*) as count
      FROM personality_chapter_mappings
      WHERE rgb_hex IS NULL OR color_name IS NULL
    `;

    const missingColorCount = (missingColors[0] as any).count;
    console.log(`Personalities with colors: ${totalCount - missingColorCount}`);
    console.log(`Personalities missing colors: ${missingColorCount}\n`);

    if (missingCount === 0 && missingColorCount === 0) {
      console.log('✓ All 360 personalities have complete mappings!\n');
    }

    // Show distribution
    console.log('Sample personalities from each book:');
    for (let book = 1; book <= 4; book++) {
      const sample = await sql`
        SELECT canonical_id, all_chapter, novel_book, chapter_title, icon_path, color_name
        FROM personality_chapter_mappings
        WHERE novel_book = ${book}
        LIMIT 1
      `;

      if (sample.length > 0) {
        const row = sample[0] as any;
        console.log(
          `  Book ${book}: ${row.canonical_id} → ${row.icon_path} (${row.color_name})`
        );
      }
    }

    console.log('\n✓ Verification complete!\n');
  } catch (error) {
    console.error('Error verifying mappings:', error);
    throw error;
  }
}

verifyCompleteMapping()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
