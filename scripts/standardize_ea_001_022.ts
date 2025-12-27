import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';

interface SceneData {
    scene_number: number;
    scene_title?: string;
    location?: string;
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

async function standardizeAllScenes() {
    console.log('🔧 STANDARDIZING Scene Fields: EA-001 to EA-022\n');
    console.log('   Format: chapter_scene_focus = "ChXXSY: Description"');
    console.log('           location = from JSON\n');
    console.log('═'.repeat(70));

    try {
        const outline = JSON.parse(fs.readFileSync('./data/l_outline.json', 'utf-8'));

        // Generate EA-001 through EA-022
        const eaChapters: string[] = [];
        for (let i = 1; i <= 22; i++) {
            eaChapters.push(`EA-${i.toString().padStart(3, '0')}`);
        }

        const mappings: Array<{ eaId: string, dbId: string, title: string, chapterNum: number }> = [];

        // Find all chapters in JSON
        for (const eaId of eaChapters) {
            const chapterData = findChapterInOutline(outline, eaId);
            if (chapterData) {
                mappings.push({
                    eaId: eaId,
                    dbId: chapterData.unique_identifier,
                    title: chapterData.specific_task_group_title,
                    chapterNum: chapterData.all_chapter
                });
            }
        }

        console.log(`\nFound ${mappings.length} chapters in EA-001 to EA-022:\n`);
        mappings.forEach((m, idx) => {
            console.log(`  ${String(idx + 1).padStart(2)}. ${m.eaId} → Ch${m.chapterNum} ${m.dbId} (${m.title})`);
        });
        console.log('\n' + '═'.repeat(70));

        let totalUpdated = 0;
        let totalScenes = 0;

        for (const mapping of mappings) {
            console.log(`\n📚 ${mapping.eaId}: ${mapping.title}`);

            const chapterData = findChapterInOutline(outline, mapping.eaId);
            if (!chapterData) continue;

            // Get chapter from database
            const chapterResult = await db.execute(sql`
        SELECT id FROM chapters WHERE unique_identifier = ${mapping.dbId}
      `);

            if (chapterResult.rows.length === 0) {
                console.log(`   ⚠️  Not in database`);
                continue;
            }

            const chapterDbId = (chapterResult.rows[0] as any).id;
            const scenes = chapterData.scenes || [];
            totalScenes += scenes.length;

            for (const scene of scenes) {
                try {
                    const location = scene.location || '';
                    const sceneNum = scene.scene_number;
                    const chapterNum = mapping.chapterNum;

                    // Build chapter_scene_focus with format "ChXXSY: Description"
                    const focusKey = `chapter_${chapterNum}_scene_${sceneNum}_focus`;
                    const focusDescription = scene[focusKey] || scene.preliminary_scene_focus || '';
                    const chapterSceneFocus = focusDescription ? `Ch${chapterNum}S${sceneNum}: ${focusDescription}` : '';

                    // Update
                    await db.execute(sql`
            UPDATE scenes
            SET 
              location = ${location},
              chapter_scene_focus = ${chapterSceneFocus},
              updated_at = NOW()
            WHERE chapter_id = ${chapterDbId}
            AND scene_number = ${scene.scene_number}
          `);

                    totalUpdated++;

                } catch (err) {
                    console.error(`   ✗ Scene ${scene.scene_number}: Error`, err);
                }
            }

            console.log(`   ✓ ${scenes.length} scenes updated`);
        }

        console.log('\n' + '═'.repeat(70));
        console.log(`\n✅ Updated ${totalUpdated} scenes across ${mappings.length} chapters!`);
        console.log(`\n📊 Coverage: ${mappings.length} out of 22 chapters found in outline\n`);

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

standardizeAllScenes();
