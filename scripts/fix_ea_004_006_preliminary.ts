import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';

interface SceneData {
    scene_number: number;
    scene_title?: string;
    preliminary_scene_focus?: string;
    [key: string]: any;
}

interface ChapterData {
    id: string;
    unique_identifier: string;
    all_chapter: number;
    specific_task_group_title: string;
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

async function fixEA004to006WithPreliminary() {
    console.log('🔧 Fixing chapter_scene_focus for EA-004, EA-005, EA-006\n');
    console.log('   Using preliminary_scene_focus field\n');
    console.log('═'.repeat(70));

    try {
        const outline = JSON.parse(fs.readFileSync('./data/l_outline.json', 'utf-8'));

        const targets = [
            { eaId: 'EA-004', dbId: 'STG 1.1.2.1', title: 'Explosive' },
            { eaId: 'EA-005', dbId: 'STG 1.1.2.2', title: 'Implementation' },
            { eaId: 'EA-006', dbId: 'STG 1.1.2.3', title: 'Ownership' }
        ];

        let totalUpdated = 0;

        for (const target of targets) {
            console.log(`\n${'─'.repeat(70)}`);
            console.log(`📚 ${target.eaId}: ${target.title} (${target.dbId})`);
            console.log('─'.repeat(70));

            const chapterData = findChapterInOutline(outline, target.eaId);
            if (!chapterData) {
                console.log(`⚠️  Not found in outline`);
                continue;
            }

            const chapterNum = chapterData.all_chapter;
            console.log(`Chapter ${chapterNum}\n`);

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

            for (const scene of scenes) {
                const sceneNum = scene.scene_number;
                const preliminaryFocus = scene.preliminary_scene_focus || '';

                if (preliminaryFocus) {
                    // Format as "ChXSY: [preliminary_scene_focus]"
                    const chapterSceneFocus = `Ch${chapterNum}S${sceneNum}: ${preliminaryFocus}`;

                    await db.execute(sql`
            UPDATE scenes
            SET 
              chapter_scene_focus = ${chapterSceneFocus},
              updated_at = NOW()
            WHERE chapter_id = ${chapterDbId}
            AND scene_number = ${scene.scene_number}
          `);

                    console.log(`  ✓ Scene ${sceneNum}: ${scene.scene_title || 'Untitled'}`);
                    console.log(`    → "${chapterSceneFocus}"`);
                    totalUpdated++;
                } else {
                    console.log(`  ⚠️  Scene ${sceneNum}: No preliminary_scene_focus`);
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

fixEA004to006WithPreliminary();
