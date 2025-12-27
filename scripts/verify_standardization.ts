import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function verifyStandardization() {
    console.log('✅ Verifying Standardization: EA-001 to EA-022\n');
    console.log('═'.repeat(70));

    // Check a sample from different chapters
    const sampleChapters = [
        'STG 1.1.1.1', // EA-001
        'STG 1.1.2.1', // EA-004
        'STG 1.1.4.2', // EA-011
        'STG 1.2.2.3', // EA-019
        'STG 1.2.3.3'  // EA-022
    ];

    let totalScenes = 0;
    let withChapterSceneFocus = 0;
    let withLocation = 0;
    let correctFormat = 0;

    for (const stgId of sampleChapters) {
        const result = await db.execute(sql`
      SELECT 
        c.unique_identifier,
        c.title,
        s.scene_number,
        s.title as scene_title,
        s.location,
        s.chapter_scene_focus
      FROM scenes s
      JOIN chapters c ON s.chapter_id = c.id
      WHERE c.unique_identifier = ${stgId}
      ORDER BY s.scene_number
      LIMIT 2
    `);

        if (result.rows.length > 0) {
            const row0 = result.rows[0] as any;
            console.log(`\n${row0.unique_identifier}: ${row0.title}`);
            console.log('─'.repeat(70));

            result.rows.forEach((row: any) => {
                totalScenes++;

                const hasLocation = row.location && row.location !== '';
                const hasChapterFocus = row.chapter_scene_focus && row.chapter_scene_focus !== '';
                const formatCorrect = hasChapterFocus && /^Ch\d+S\d+:/.test(row.chapter_scene_focus);

                if (hasLocation) withLocation++;
                if (hasChapterFocus) withChapterSceneFocus++;
                if (formatCorrect) correctFormat++;

                const lIcon = hasLocation ? '✓' : '○';
                const cIcon = hasChapterFocus ? '✓' : '○';
                const fIcon = formatCorrect ? '✓' : '✗';

                console.log(`Scene ${row.scene_number}: ${row.scene_title || 'Untitled'}`);
                console.log(`  location: ${lIcon} ${hasLocation ? row.location.substring(0, 40) : 'none'}`);
                console.log(`  chapter_scene_focus: ${cIcon} ${hasChapterFocus ? row.chapter_scene_focus.substring(0, 50) : 'none'}`);
                console.log(`  format correct: ${fIcon}`);
            });
        }
    }

    console.log('\n' + '═'.repeat(70));
    console.log('\n📊 Sample Verification (10 scenes):');
    console.log(`  Total scenes checked: ${totalScenes}`);
    console.log(`  With chapter_scene_focus: ${withChapterSceneFocus}/${totalScenes}`);
    console.log(`  With location: ${withLocation}/${totalScenes}`);
    console.log(`  Correct "ChXXSY:" format: ${correctFormat}/${withChapterSceneFocus}`);

    if (correctFormat === withChapterSceneFocus) {
        console.log('\n✅ ALL chapter_scene_focus fields use correct format!\n');
    } else {
        console.log('\n⚠️  Some fields need format correction\n');
    }

    process.exit(0);
}

verifyStandardization();
