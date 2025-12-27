import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function findChapters011to020() {
    console.log('🔍 Finding EA-011 to EA-020 Chapters\n');
    console.log('═'.repeat(70));

    // Find chapters 11-20 from Book 1
    const result = await db.execute(sql`
    SELECT 
      c.id,
      c.unique_identifier,
      c.title,
      c.chapter_number,
      COUNT(s.id) as scene_count,
      SUM(CASE WHEN s.focus IS NULL OR s.focus = '' THEN 1 ELSE 0 END) as empty_focus,
      SUM(CASE WHEN s.location IS NULL OR s.location = '' THEN 1 ELSE 0 END) as empty_location
    FROM chapters c
    LEFT JOIN scenes s ON s.chapter_id = c.id
    WHERE c.chapter_number BETWEEN 11 AND 20
    GROUP BY c.id, c.unique_identifier, c.title, c.chapter_number
    ORDER BY c.chapter_number
  `);

    console.log(`Found ${result.rows.length} chapters (11-20):\n`);

    result.rows.forEach((row: any) => {
        console.log(`Chapter ${row.chapter_number}: ${row.unique_identifier}`);
        console.log(`  Title: ${row.title}`);
        console.log(`  ID: ${row.id}`);
        console.log(`  Scenes: ${row.scene_count}`);
        console.log(`  Empty focus: ${row.empty_focus}/${row.scene_count}`);
        console.log(`  Empty location: ${row.empty_location}/${row.scene_count}`);
        console.log('');
    });

    // Also check if chapter_scene_focus column exists
    console.log('Checking for chapter_scene_focus column...\n');
    const columnCheck = await db.execute(sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'scenes' 
    AND column_name = 'chapter_scene_focus'
  `);

    if (columnCheck.rows.length > 0) {
        console.log('✓ chapter_scene_focus column exists');
    } else {
        console.log('⚠️  chapter_scene_focus column NOT found');
        console.log('   Checking for similar columns...');

        const similarCols = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'scenes' 
      AND column_name LIKE '%focus%'
    `);

        console.log('   Columns with "focus":', similarCols.rows.map((r: any) => r.column_name).join(', '));
    }

    process.exit(0);
}

findChapters011to020();
