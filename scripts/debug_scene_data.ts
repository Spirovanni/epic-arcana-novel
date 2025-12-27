import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function debugSceneData() {
    console.log('🔍 Debugging Scene Metadata - Deep Inspection\n');

    // Check for the specific chapter ID from user's screenshot
    const chapterId = '0f5c5387-33ba-43f2-9155-c3d2f81e53df';

    console.log(`Checking chapter ID: ${chapterId}\n`);

    const result = await db.execute(sql`
    SELECT 
      c.unique_identifier,
      c.title as chapter_title,
      s.id as scene_id,
      s.scene_number,
      s.title as scene_title,
      s.sudowrite_metadata,
      s.learning_objectives,
      s.foreshadowing_elements
    FROM chapters c
    JOIN scenes s ON s.chapter_id = c.id
    WHERE c.id = ${chapterId}
    ORDER BY s.scene_number
  `);

    console.log(`Found ${result.rows.length} scenes\n`);

    result.rows.forEach((row: any) => {
        console.log(`Scene ${row.scene_number}: ${row.scene_title}`);
        console.log(`  Scene ID: ${row.scene_id}`);
        console.log(`  sudowrite_metadata:`, row.sudowrite_metadata);
        console.log(`  learning_objectives:`, row.learning_objectives);
        console.log(`  foreshadowing_elements:`, row.foreshadowing_elements);
        console.log('');
    });

    // Now check all three target chapters
    console.log('\n' + '═'.repeat(70));
    console.log('Checking all target chapters by STG ID:\n');

    const allResult = await db.execute(sql`
    SELECT 
      c.unique_identifier,
      c.title as chapter_title,
      s.scene_number,
      s.title as scene_title,
      jsonb_typeof(s.sudowrite_metadata) as sw_type,
      jsonb_typeof(s.learning_objectives) as lo_type,
      jsonb_typeof(s.foreshadowing_elements) as fe_type
    FROM chapters c
    JOIN scenes s ON s.chapter_id = c.id
    WHERE c.unique_identifier IN ('STG 1.1.2.1', 'STG 1.1.2.2', 'STG 1.1.2.3')
    ORDER BY c.unique_identifier, s.scene_number
  `);

    allResult.rows.forEach((row: any) => {
        console.log(`${row.unique_identifier} - Scene ${row.scene_number}: ${row.scene_title}`);
        console.log(`  Types: SW=${row.sw_type}, LO=${row.lo_type}, FE=${row.fe_type}`);
    });
}

debugSceneData();
