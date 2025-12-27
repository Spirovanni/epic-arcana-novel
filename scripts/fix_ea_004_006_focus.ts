import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';

interface SceneData {
    scene_number: number;
    [key: string]: any;
}

interface ChapterData {
    id: string;
    unique_identifier: string;
    all_chapter: number;
    scenes: SceneData[];
}

function findChapterInOutline(outline: any, chapterId: string): ChapterData | null {
    const series = outline.SelfImprovementSeries?.Books;
    if (!series) return null;

    for (const trilogyKey of Object.keys(series.trilogies || {})) {
        const trilogy = series.trilogies[trilogyKey];
        for (const bookKey of Object.keys(trilogy.trilogy_books || {})) {
            const book = trilogy.trilogy_books[bookKey];
            for (const tmKey of Object.keys(book.task_masters || {})) {
                const taskMaster = book.task_masters[tmKey];
                for (const mtgKey of Object.keys(taskMaster.major_task_groups || {})) {
                    const majorTaskGroup = taskMaster.major_task_groups[mtgKey];
                    for (const stgKey of Object.keys(majorTaskGroup.Specific_task_groups || {})) {
                        const stg = majorTaskGroup.Specific_task_groups[stgKey];
                        if (stg.id === chapterId) {
                            return stg as ChapterData;
                        }
                    }
                }
            }
        }
    }

    return null;
}

async function fixEA004to006() {
    console.log('🔧 Fixing chapter_scene_focus for EA-004, EA-005, EA-006\n');
    console.log('═'.repeat(70));

    try {
        const outline = JSON.parse(fs.readFileSync('./data/l_outline.json', 'utf-8'));

        const targets = [
            { eaId: 'EA-004', dbId: 'STG 1.1.2.1' },
            { eaId: 'EA-005', dbId: 'STG 1.1.2.2' },
            { eaId: 'EA-006', dbId: 'STG 1.1.2.3' }
        ];

        let totalUpdated = 0;

        for (const target of targets) {
            console.log(`\n📚 ${target.eaId} (${target.dbId})`);
            console.log('─'.repeat(70));

            const chapterData = findChapterInOutline(outline, target.eaId);
            if (!chapterData) {
                console.log(`⚠️  Not found in outline`);
                continue;
            }

            const chapterNum = chapterData.all_chapter;
            console.log(`Chapter ${chapterNum}: ${chapterData.specific_task_group_title || 'Untitled'}`);

            // Get DB chapter
            const chapterResult = await db.execute(sql`
        SELECT id FROM chapters WHERE unique_identifier = ${target.dbId}
      `);

            if (chapterResult.rows.length === 0) {
                console.log(`⚠️  Not in database`);
                continue;
            }

            const chapterDbId = (chapterResult.rows[0] as any).id;
            const scenes = chapterData.scenes || [];

            console.log(`Scenes: ${scenes.length}\n`);

            for (const scene of scenes) {
                const sceneNum = scene.scene_number;

                // Look for the focus field
                const focusKey = `chapter_${chapterNum}_scene_${sceneNum}_focus`;
                const focusDescription = scene[focusKey] || scene.preliminary_scene_focus || '';

                if (focusDescription) {
                    const chapterSceneFocus = `Ch${chapterNum}S${sceneNum}: ${focusDescription}`;

                    await db.execute(sql`
            UPDATE scenes
            SET 
              chapter_scene_focus = ${chapterSceneFocus},
              updated_at = NOW()
            WHERE chapter_id = ${chapterDbId}
            AND scene_number = ${scene.scene_number}
          `);

                    console.log(`  ✓ Scene ${sceneNum}: ${scene.scene_title || 'Untitled'}`);
                    console.log(`    → "${chapterSceneFocus.substring(0, 60)}..."`);
                    totalUpdated++;
                } else {
                    console.log(`  ⚠️  Scene ${sceneNum}: No focus data in JSON`);
                }
            }
        }

        console.log('\n' + '═'.repeat(70));
        console.log(`\n✅ Fixed chapter_scene_focus for ${totalUpdated} scenes!\n`);

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

fixEA004to006();
