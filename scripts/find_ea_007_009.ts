import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function findChapters007to009() {
    console.log('🔍 Finding EA-007, EA-008, EA-009 Chapters\n');
    console.log('═'.repeat(70));

    // First, find chapters from Book 1 that are likely EA-007/008/009
    // Based on pattern, these should be STG 1.1.2.4, 1.1.2.5, 1.1.2.6 or similar

    const result = await db.execute(sql`
    SELECT 
      c.id,
      c.unique_identifier,
      c.title,
      c.chapter_number,
      COUNT(s.id) as scene_count,
      SUM(CASE WHEN s.foreshadowing_elements IS NULL OR 
                       s.foreshadowing_elements::text = '[]' OR
                       s.foreshadowing_elements::text = '{}' 
          THEN 1 ELSE 0 END) as empty_foreshadowing
    FROM chapters c
    LEFT JOIN scenes s ON s.chapter_id = c.id
    WHERE c.unique_identifier LIKE 'STG 1.1.%'
      AND c.chapter_number IN (7, 8, 9)
    GROUP BY c.id, c.unique_identifier, c.title, c.chapter_number
    ORDER BY c.chapter_number
  `);

    console.log(`Found ${result.rows.length} chapters for Book 1, Chapters 7-9:\n`);

    result.rows.forEach((row: any) => {
        console.log(`Chapter ${row.chapter_number}: ${row.unique_identifier}`);
        console.log(`  Title: ${row.title}`);
        console.log(`  Chapter ID: ${row.id}`);
        console.log(`  Scenes: ${row.scene_count}`);
        console.log(`  Empty foreshadowing: ${row.empty_foreshadowing}/${row.scene_count}`);
        console.log('');
    });

    process.exit(0);
}

findChapters007to009();
