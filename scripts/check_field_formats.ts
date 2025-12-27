import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function checkExistingFormat() {
    console.log('🔍 Checking Existing Format for location and chapter_scene_focus\n');
    console.log('═'.repeat(70));

    // Get scenes that have these fields populated from other chapters
    const result = await db.execute(sql`
    SELECT 
      c.unique_identifier,
      s.scene_number,
      s.title,
      s.location,
      s.chapter_scene_focus
    FROM scenes s
    JOIN chapters c ON s.chapter_id = c.id
    WHERE (s.location IS NOT NULL AND s.location != '')
       OR (s.chapter_scene_focus IS NOT NULL AND s.chapter_scene_focus != '')
    LIMIT 10
  `);

    console.log('Sample scenes with location and/or chapter_scene_focus:\n');

    result.rows.forEach((row: any) => {
        console.log(`${row.unique_identifier} - Scene ${row.scene_number}: ${row.title}`);
        console.log(`  location: "${row.location}"`);
        console.log(`  chapter_scene_focus: "${row.chapter_scene_focus}"`);
        console.log('');
    });

    process.exit(0);
}

checkExistingFormat();
