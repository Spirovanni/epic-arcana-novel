import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function checkSceneData() {
    console.log('🔍 Checking Scene Metadata - Simple Verification\n');
    console.log('═'.repeat(70));

    const result = await db.execute(sql`
    SELECT 
      c.unique_identifier as chapter_id,
      c.title as chapter_title,
      s.scene_number,
      s.title as scene_title,
      CASE WHEN s.sudowrite_metadata IS NOT NULL THEN 'YES' ELSE 'NO' END as has_sudowrite,
      CASE WHEN s.learning_objectives IS NOT NULL THEN 'YES' ELSE 'NO' END as has_learning,
      CASE WHEN s.foreshadowing_elements IS NOT NULL THEN 'YES' ELSE 'NO' END as has_foreshadowing
    FROM chapters c
    JOIN scenes s ON s.chapter_id = c.id
    WHERE c.unique_identifier IN ('STG 1.1.2.1', 'STG 1.1.2.2', 'STG 1.1.2.3')
    ORDER BY c.unique_identifier, s.scene_number
  `);

    const rows = result.rows as Array<{
        chapter_id: string;
        chapter_title: string;
        scene_number: number;
        scene_title: string;
        has_sudowrite: string;
        has_learning: string;
        has_foreshadowing: string;
    }>;

    if (rows.length === 0) {
        console.log('❌ No scenes found for target chapters!');
        console.log('\nLet me check what scenes exist...\n');

        const allScenes = await db.execute(sql`
      SELECT 
        c.unique_identifier,
        COUNT(s.id) as scene_count
      FROM chapters c
      LEFT JOIN scenes s ON s.chapter_id = c.id
      WHERE c.unique_identifier LIKE 'STG 1.1.2.%'
      GROUP BY c.unique_identifier
      ORDER BY c.unique_identifier
    `);

        console.log('Chapters matching STG 1.1.2.%:');
        console.log(allScenes.rows);
        process.exit(1);
    }

    console.log(`\n✓ Found ${rows.length} scenes total\n`);

    let currentChapter = '';
    let totalVerified = 0;

    rows.forEach(row => {
        if (row.chapter_id !== currentChapter) {
            currentChapter = row.chapter_id;
            console.log(`\n${'─'.repeat(70)}`);
            console.log(`📚 ${row.chapter_id}: ${row.chapter_title}`);
            console.log('─'.repeat(70));
        }

        const allPresent = row.has_sudowrite === 'YES' && row.has_learning === 'YES' && row.has_foreshadowing === 'YES';
        const icon = allPresent ? '✅' : '❌';
        if (allPresent) totalVerified++;

        console.log(`${icon} Scene ${row.scene_number}: ${row.scene_title}`);
        console.log(`   SW: ${row.has_sudowrite}, LO: ${row.has_learning}, FE: ${row.has_foreshadowing}`);
    });

    console.log(`\n${'═'.repeat(70)}`);
    console.log(`\n📊 Results: ${totalVerified}/${rows.length} scenes fully populated`);

    if (totalVerified === rows.length) {
        console.log('\n✅ ALL SCENES SUCCESSFULLY VERIFIED!\n');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some scenes missing data\n');
        process.exit(1);
    }
}

checkSceneData();
