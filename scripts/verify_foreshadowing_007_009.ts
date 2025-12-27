import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function verifyForeshadowing() {
    console.log('✅ Verifying Foreshadowing Elements: EA-007 to EA-009\n');
    console.log('═'.repeat(70));

    const result = await db.execute(sql`
    SELECT 
      c.unique_identifier,
      c.title as chapter_title,
      s.scene_number,
      s.title as scene_title,
      s.foreshadowing_elements
    FROM scenes s
    JOIN chapters c ON s.chapter_id = c.id
    WHERE c.unique_identifier IN ('STG 1.1.3.1', 'STG 1.1.3.2', 'STG 1.1.3.3')
    ORDER BY c.unique_identifier, s.scene_number
  `);

    let currentChapter = '';
    let totalScenes = 0;
    let totalWithData = 0;

    result.rows.forEach((row: any) => {
        if (row.unique_identifier !== currentChapter) {
            currentChapter = row.unique_identifier;
            console.log(`\n${'─'.repeat(70)}`);
            console.log(`${row.unique_identifier}: ${row.chapter_title}`);
            console.log('─'.repeat(70));
        }

        totalScenes++;
        const hasData = Array.isArray(row.foreshadowing_elements) && row.foreshadowing_elements.length > 0;
        if (hasData) totalWithData++;

        const icon = hasData ? '✅' : '❌';
        console.log(`${icon} Scene ${row.scene_number}: ${row.scene_title}`);

        if (hasData) {
            console.log(`   Elements: ${row.foreshadowing_elements.length}`);
            row.foreshadowing_elements.slice(0, 2).forEach((el: string, idx: number) => {
                const preview = el.length > 70 ? el.substring(0, 70) + '...' : el;
                console.log(`   ${idx + 1}. ${preview}`);
            });
        } else {
            console.log(`   ⚠️  Empty or missing`);
        }
        console.log('');
    });

    console.log('═'.repeat(70));
    console.log(`\n📊 Results: ${totalWithData}/${totalScenes} scenes populated`);

    if (totalWithData === totalScenes) {
        console.log('\n✅ ALL FORESHADOWING ELEMENTS POPULATED!\n');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some scenes missing data\n');
        process.exit(1);
    }
}

verifyForeshadowing();
