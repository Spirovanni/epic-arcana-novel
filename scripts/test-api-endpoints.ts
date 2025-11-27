import { sql } from '@/lib/neon';

/**
 * Test the API endpoints to verify icon paths are correct
 */
async function testAPIEndpoints() {
  try {
    console.log('Testing personality chapter mappings...\n');

    // Test specific personalities around book boundaries
    const testProfiles = ['EA-001', 'EA-040', 'EA-041', 'EA-080', 'EA-081', 'EA-100', 'EA-120', 'EA-121'];

    for (const profileId of testProfiles) {
      const result = await sql`
        SELECT
          canonical_id,
          all_chapter,
          novel_book,
          chapter_title,
          icon_path,
          rgb_hex,
          color_name
        FROM personality_chapter_mappings
        WHERE canonical_id = ${profileId}
      `;

      if (result.length > 0) {
        const row = result[0] as any;
        const chapterWithinBook = ((row.all_chapter - 1) % 40) + 1;
        console.log(`${profileId}:`);
        console.log(`  Chapter: ${row.all_chapter} (Book ${row.novel_book}, Chapter ${chapterWithinBook})`);
        console.log(`  Title: ${row.chapter_title}`);
        console.log(`  Icon Path: ${row.icon_path}`);
        console.log(`  Color: ${row.color_name} (${row.rgb_hex})`);
        console.log();
      }
    }

    console.log('\n✓ API endpoint test complete!\n');
  } catch (error) {
    console.error('Error testing endpoints:', error);
    throw error;
  }
}

testAPIEndpoints()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
