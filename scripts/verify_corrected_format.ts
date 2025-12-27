import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function verifyCorrectFormat() {
    console.log('✅ Verifying Corrected Format\n');
    console.log('═'.repeat(70));

    // Check one scene from each chapter
    const result = await db.execute(sql`
    SELECT 
      c.unique_identifier,
      s.scene_number,
      s.title,
      s.sudowrite_metadata,
      s.learning_objectives,
      s.foreshadowing_elements
    FROM scenes s
    JOIN chapters c ON s.chapter_id = c.id
    WHERE c.unique_identifier IN ('STG 1.1.2.1', 'STG 1.1.2.2', 'STG 1.1.2.3')
      AND s.scene_number = 1
    ORDER BY c.unique_identifier
  `);

    result.rows.forEach((row: any) => {
        console.log(`\n${'─'.repeat(70)}`);
        console.log(`${row.unique_identifier} - Scene ${row.scene_number}: ${row.title}`);
        console.log('─'.repeat(70));

        console.log('\n📝 sudowrite_metadata keys:');
        if (row.sudowrite_metadata && typeof row.sudowrite_metadata === 'object') {
            const keys = Object.keys(row.sudowrite_metadata);
            keys.forEach(key => {
                console.log(`  ✓ ${key}`);
            });

            // Check for correct prefixes
            const hasCorrected = keys.every(k => k.startsWith('sudowrite_'));
            if (hasCorrected) {
                console.log('\n  ✅ All keys have sudowrite_ prefix');
            } else {
                console.log('\n  ⚠️  Some keys missing sudowrite_ prefix');
            }
        }

        console.log('\n📚 learning_objectives structure:');
        console.log(JSON.stringify(row.learning_objectives, null, 2));

        console.log('\n🔮 foreshadowing_elements type:');
        if (Array.isArray(row.foreshadowing_elements)) {
            console.log(`  ✅ Array with ${row.foreshadowing_elements.length} elements`);
            row.foreshadowing_elements.slice(0, 2).forEach((el: string, idx: number) => {
                console.log(`  ${idx + 1}. ${el.substring(0, 80)}...`);
            });
        } else {
            console.log(`  ⚠️  Not an array: ${typeof row.foreshadowing_elements}`);
        }
    });

    console.log('\n' + '═'.repeat(70));
    console.log('\n✅ Format verification complete!\n');
    process.exit(0);
}

verifyCorrectFormat();
