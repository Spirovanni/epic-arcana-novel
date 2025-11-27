import { sql } from '@/lib/neon';

/**
 * Add icon_path column to personality_chapter_mappings table
 */
async function addIconPathColumn() {
  try {
    console.log('Adding icon_path column to personality_chapter_mappings...\n');

    // Add the column if it doesn't exist
    await sql`
      ALTER TABLE personality_chapter_mappings
      ADD COLUMN IF NOT EXISTS icon_path VARCHAR(255)
    `;

    console.log('✓ icon_path column added successfully\n');

    // Now populate it with the correct values
    console.log('Populating icon paths based on book and chapter numbers...\n');

    // Update all personality mappings with correct icon paths
    // Formula: chapter_within_book = ((all_chapter - 1) % 40) + 1
    const result = await sql`
      UPDATE personality_chapter_mappings
      SET icon_path = '/icons/chapters/book' || novel_book || '/chapter' || (((all_chapter - 1) % 40) + 1) || '.png'
      WHERE icon_path IS NULL
      RETURNING canonical_id, all_chapter, novel_book, icon_path
    `;

    const updatedCount = result.length;
    console.log(`✓ Updated ${updatedCount} personality icon paths\n`);

    if (updatedCount > 0) {
      console.log('Sample updates:');
      result.slice(0, 10).forEach((row: any) => {
        console.log(
          `  ${row.canonical_id} (ch ${row.all_chapter}, book ${row.novel_book}): ${row.icon_path}`
        );
      });
      if (updatedCount > 10) {
        console.log(`  ... and ${updatedCount - 10} more`);
      }
    }

    // Verify the fix
    console.log('\nVerification - personalities at book boundaries:');
    const verification = await sql`
      SELECT canonical_id, all_chapter, novel_book, icon_path
      FROM personality_chapter_mappings
      WHERE all_chapter IN (1, 40, 41, 80, 81, 120, 121)
      ORDER BY all_chapter
    `;

    for (const row of verification) {
      console.log(
        `  ${row.canonical_id} (ch ${row.all_chapter}, book ${row.novel_book}): ${row.icon_path}`
      );
    }

    console.log('\n✓ Icon path column added and populated successfully!\n');
  } catch (error) {
    console.error('Error adding icon_path column:', error);
    throw error;
  }
}

addIconPathColumn()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
