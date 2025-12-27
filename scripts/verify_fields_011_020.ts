import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function verifyPopulatedFields() {
    console.log('✅ Verifying Populated Fields: EA-011 to EA-020\n');
    console.log('═'.repeat(70));

    const chapters = [
        'STG 1.1.4.2', // EA-011
        'STG 1.1.4.3', // EA-012
        'STG 1.2.1.1', // EA-014
        'STG 1.2.1.2', // EA-015
        'STG 1.2.1.3', // EA-016
        'STG 1.2.2.2', // EA-018
        'STG 1.2.2.3'  // EA-019
    ];

    let totalScenes = 0;
    let populatedFocus = 0;
    let populatedLocation = 0;
    let populatedChapterSceneFocus = 0;

    for (const stgId of chapters) {
        const result = await db.execute(sql`
      SELECT 
        c.unique_identifier,
        c.title,
        s.scene_number,
        s.title as scene_title,
        s.focus,
        s.location,
        s.chapter_scene_focus
      FROM scenes s
      JOIN chapters c ON s.chapter_id = c.id
      WHERE c.unique_identifier = ${stgId}
      ORDER BY s.scene_number
    `);

        if (result.rows.length > 0) {
            const row0 = result.rows[0] as any;
            console.log(`\n${row0.unique_identifier}: ${row0.title}`);
            console.log('─'.repeat(70));

            result.rows.forEach((row: any) => {
                totalScenes++;
                if (row.focus) populatedFocus++;
                if (row.location) populatedLocation++;
                if (row.chapter_scene_focus) populatedChapterSceneFocus++;

                const fIcon = row.focus ? '✓' : '○';
                const lIcon = row.location ? '✓' : '○';
                const cIcon = row.chapter_scene_focus ? '✓' : '○';

                console.log(`Scene ${row.scene_number}: ${row.scene_title || 'Untitled'}`);
                console.log(`  focus: ${fIcon}, location: ${lIcon}, chapter_scene_focus: ${cIcon}`);
            });
        }
    }

    console.log('\n' + '═'.repeat(70));
    console.log('\n📊 Summary:');
    console.log(`  Total scenes: ${totalScenes}`);
    console.log(`  focus populated: ${populatedFocus}/${totalScenes}`);
    console.log(`  location populated: ${populatedLocation}/${totalScenes}`);
    console.log(`  chapter_scene_focus populated: ${populatedChapterSceneFocus}/${totalScenes}`);

    console.log('\n✅ Verification complete!\n');
    process.exit(0);
}

verifyPopulatedFields();
