import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';

interface SceneData {
    scene_number: number;
    scene_title?: string;
    focus?: string;
    preliminary_scene_focus?: string;
    location?: string;
    chapter_scene_focus?: string;
    [key: string]: any;
}

interface ChapterData {
    id: string;
    unique_identifier: string;
    specific_task_group_title: string;
    focus_area: string;
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

async function populateSceneFields() {
    console.log('📝 Populating Scene Fields (focus, location, chapter_scene_focus)\n');
    console.log('   Chapters: EA-011 to EA-020\n');
    console.log('═'.repeat(70));

    try {
        const outline = JSON.parse(fs.readFileSync('./data/l_outline.json', 'utf-8'));

        const eaChapters = [
            'EA-011', 'EA-012', 'EA-013', 'EA-014', 'EA-015',
            'EA-016', 'EA-017', 'EA-018', 'EA-019', 'EA-020'
        ];

        const mappings: Array<{ eaId: string, dbId: string, title: string }> = [];

        for (const eaId of eaChapters) {
            const chapterData = findChapterInOutline(outline, eaId);
            if (chapterData) {
                mappings.push({
                    eaId: eaId,
                    dbId: chapterData.unique_identifier,
                    title: chapterData.specific_task_group_title
                });
            }
        }

        console.log(`Found ${mappings.length} chapters:\n`);
        mappings.forEach((m, idx) => {
            console.log(`  ${idx + 1}. ${m.eaId} → ${m.dbId} (${m.title})`);
        });
        console.log('');

        let totalUpdated = 0;

        for (const mapping of mappings) {
            console.log(`\n${'─'.repeat(70)}`);
            console.log(`📚 ${mapping.eaId}: ${mapping.title} (${mapping.dbId})`);
            console.log('─'.repeat(70));

            const chapterData = findChapterInOutline(outline, mapping.eaId);
            if (!chapterData) continue;

            const chapterResult = await db.execute(sql`
        SELECT id FROM chapters WHERE unique_identifier = ${mapping.dbId}
      `);

            if (chapterResult.rows.length === 0) {
                console.log(`⚠️  Not in database`);
                continue;
            }

            const chapterDbId = (chapterResult.rows[0] as any).id;
            const scenes = chapterData.scenes || [];

            console.log(`  Scenes: ${scenes.length}\n`);

            for (const scene of scenes) {
                try {
                    const focus = scene.focus || scene.preliminary_scene_focus || '';
                    const location = scene.location || '';

                    let chapterSceneFocus = '';
                    if (scene.chapter_scene_focus) {
                        chapterSceneFocus = scene.chapter_scene_focus;
                    } else {
                        const sceneNum = scene.scene_number;
                        const chapterNum = parseInt(mapping.eaId.replace('EA-0', '').replace('EA-', ''));
                        const focusKey = `chapter_${chapterNum}_scene_${sceneNum}_focus`;

                        if (scene[focusKey]) {
                            chapterSceneFocus = scene[focusKey];
                        } else if (scene.preliminary_scene_focus) {
                            chapterSceneFocus = scene.preliminary_scene_focus;
                        }
                    }

                    await db.execute(sql`
            UPDATE scenes
            SET 
              focus = ${focus},
              location = ${location},
              chapter_scene_focus = ${chapterSceneFocus},
              updated_at = NOW()
            WHERE chapter_id = ${chapterDbId}
            AND scene_number = ${scene.scene_number}
          `);

                    const focusCheck = focus ? '✓' : '○';
                    const locationCheck = location ? '✓' : '○';
                    const chapterFocusCheck = chapterSceneFocus ? '✓' : '○';

                    console.log(`  ✓ Scene ${scene.scene_number}: ${scene.scene_title || 'Untitled'}`);
                    console.log(`    focus: ${focusCheck}, location: ${locationCheck}, chapter_scene_focus: ${chapterFocusCheck}`);
                    totalUpdated++;

                } catch (err) {
                    console.error(`  ✗ Scene ${scene.scene_number}: Error`, err);
                }
            }
        }

        console.log('\n' + '═'.repeat(70));
        console.log(`\n✅ Updated ${totalUpdated} scenes!\n`);

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

populateSceneFields();
