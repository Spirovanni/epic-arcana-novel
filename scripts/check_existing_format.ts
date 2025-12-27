import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function checkExistingFormat() {
    console.log('🔍 Checking Existing sudowrite_metadata Format\n');
    console.log('═'.repeat(70));

    // Get a scene that was NOT in our EA-004/005/006 batch
    // Let's check EA-001, EA-002, EA-003 or EA-007
    const result = await db.execute(sql`
    SELECT 
      c.unique_identifier,
      c.title as chapter_title,
      s.scene_number,
      s.title as scene_title,
      s.sudowrite_metadata,
      s.learning_objectives,
      s.foreshadowing_elements
    FROM scenes s
    JOIN chapters c ON s.chapter_id = c.id
    WHERE c.unique_identifier IN ('STG 1.1.1.1', 'STG 1.1.1.2', 'STG 1.1.1.3')
      AND s.sudowrite_metadata IS NOT NULL
      AND jsonb_typeof(s.sudowrite_metadata) = 'object'
    LIMIT 3
  `);

    if (result.rows.length === 0) {
        console.log('No existing scenes found with sudowrite_metadata.');
        console.log('Checking EA-007, EA-008, EA-009 instead...\n');

        const result2 = await db.execute(sql`
      SELECT 
        c.unique_identifier,
        c.title as chapter_title,
        s.scene_number,
        s.title as scene_title,
        s.sudowrite_metadata
      FROM scenes s
      JOIN chapters c ON s.chapter_id = c.id
      WHERE s.sudowrite_metadata IS NOT NULL
        AND jsonb_typeof(s.sudowrite_metadata) = 'object'
        AND c.unique_identifier NOT IN ('STG 1.1.2.1', 'STG 1.1.2.2', 'STG 1.1.2.3')
      LIMIT 3
    `);

        result2.rows.forEach((row: any) => {
            console.log(`\n${'─'.repeat(70)}`);
            console.log(`${row.unique_identifier} - Scene ${row.scene_number}: ${row.scene_title}`);
            console.log('─'.repeat(70));
            console.log('\nsudowrite_metadata structure:');
            console.log(JSON.stringify(row.sudowrite_metadata, null, 2));
        });
    } else {
        result.rows.forEach((row: any) => {
            console.log(`\n${'─'.repeat(70)}`);
            console.log(`${row.unique_identifier} - Scene ${row.scene_number}: ${row.scene_title}`);
            console.log('─'.repeat(70));
            console.log('\nsudowrite_metadata structure:');
            console.log(JSON.stringify(row.sudowrite_metadata, null, 2));
            console.log('\nlearning_objectives structure:');
            console.log(JSON.stringify(row.learning_objectives, null, 2));
            console.log('\nforeshadowing_elements structure:');
            console.log(JSON.stringify(row.foreshadowing_elements, null, 2));
        });
    }

    process.exit(0);
}

checkExistingFormat();
