import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';

interface SceneData {
    scene_number: number;
    scene_title?: string;
    focus?: string;
    preliminary_scene_focus?: string;
    location?: string;
    [key: string]: any;
}

interface ChapterData {
    id: string;
    unique_identifier: string;
    all_chapter: number;
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

async function repopulateFieldsCorrected() {
    console.log('🔧 RE-POPULATING Scene Fields with CORRECT FORMAT\n');
    console.log('   fixing: location and chapter_scene_focus\n');
    console.log('═'.repeat(70));

    try {
        const outline = JSON.parse(fs.readFileSync('./data/l_outline.json', 'utf-8'));

        const eaChapters = [
            'EA-011', 'EA-012', 'EA-014', 'EA-015', 'EA-016', 'EA-018', 'EA-019'
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

        console.log(`Found ${mappings.length} chapters\n`);

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
            const chapterNum = chapterData.all_chapter;
            const scenes = chapterData.scenes || [];

            console.log(`  Chapter ${chapterNum}, Scenes: ${scenes.length}\n`);

            for (const scene of scenes) {
                try {
                    // Extract location correctly
                    const location = scene.location || '';

                    // Build chapter_scene_focus with correct format: "ChXXSY: Description"
                    let chapterSceneFocus = '';
                    const sceneNum = scene.scene_number;

                    // Look for chapter_N_scene_M_focus in JSON
                    const focusKey = `chapter_${chapterNum}_scene_${sceneNum}_focus`;
                    const focusDescription = scene[focusKey] || scene.preliminary_scene_focus || '';

                    if (focusDescription) {
                        // Format as "Ch11S1: Description"
                        chapterSceneFocus = `Ch${chapterNum}S${sceneNum}: ${focusDescription}`;
                    }

                    // Update with CORRECT formatting
                    await db.execute(sql`
            UPDATE scenes
            SET 
              location = ${location},
              chapter_scene_focus = ${chapterSceneFocus},
              updated_at = NOW()
            WHERE chapter_id = ${chapterDbId}
            AND scene_number = ${scene.scene_number}
          `);

                    const lIcon = location ? '✓' : '○';
                    const cIcon = chapterSceneFocus ? '✓' : '○';

                    console.log(`  ✓ Scene ${scene.scene_number}: ${scene.scene_title || 'Untitled'}`);
                    console.log(`    location: ${lIcon} "${location.substring(0, 40)}${location.length > 40 ? '...' : ''}"`);
                    console.log(`    chapter_scene_focus: ${cIcon} "${chapterSceneFocus.substring(0, 50)}${chapterSceneFocus.length > 50 ? '...' : ''}"`);
                    totalUpdated++;

                } catch (err) {
                    console.error(`  ✗ Scene ${scene.scene_number}: Error`, err);
                }
            }
        }

        console.log('\n' + '═'.repeat(70));
        console.log(`\n✅ Re-populated ${totalUpdated} scenes with CORRECT format!`);
        console.log('\nFormat applied:');
        console.log('  • location: exact value from JSON');
        console.log('  • chapter_scene_focus: "ChXXSY: description" format\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

repopulateFieldsCorrected();
