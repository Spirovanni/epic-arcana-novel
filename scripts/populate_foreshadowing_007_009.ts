import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';

// Type definitions
interface SceneData {
    scene_number: number;
    scene_title: string;
    setup?: string;
    symbolism?: string;
    beat_goal?: string;
    foreshadowing_series?: string;
    narrative_function?: string;
    series_connections?: string;
}

interface ChapterData {
    id: string;
    specific_task_group_title: string;
    focus_area: string;
    scenes: SceneData[];
}

/**
 * Generate foreshadowing_elements as array of strings
 */
function generateForeshadowingElements(scene: SceneData, chapter: ChapterData): string[] {
    const elements: string[] = [];

    // 1. Add foreshadowing_series if present (primary source)
    if (scene.foreshadowing_series) {
        elements.push(scene.foreshadowing_series);
    }

    // 2. Extract from symbolism (symbolic statements become foreshadowing)
    if (scene.symbolism) {
        const sentences = scene.symbolism
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 30 && s.length < 250);

        // Take up to 3 symbolic foreshadowing elements
        elements.push(...sentences.slice(0, 3));
    }

    // 3. Extract from beat_goal if we need more
    if (elements.length < 3 && scene.beat_goal) {
        const goalSentences = scene.beat_goal
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 30 && s.length < 250)
            .filter(s =>
                s.toLowerCase().includes('foreshadow') ||
                s.toLowerCase().includes('hint') ||
                s.toLowerCase().includes('introduce') ||
                s.toLowerCase().includes('establish') ||
                s.toLowerCase().includes('set up') ||
                s.toLowerCase().includes('plant')
            );

        elements.push(...goalSentences.slice(0, Math.max(0, 3 - elements.length)));
    }

    // 4. Extract from narrative_function
    if (elements.length < 3 && scene.narrative_function) {
        const funcSentences = scene.narrative_function
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 30 && s.length < 250);

        elements.push(...funcSentences.slice(0, Math.max(0, 3 - elements.length)));
    }

    // 5. Extract from series_connections if available
    if (elements.length < 3 && scene.series_connections) {
        if (typeof scene.series_connections === 'string') {
            const connSentences = scene.series_connections
                .split(/[.!?]+/)
                .map(s => s.trim())
                .filter(s => s.length > 30 && s.length < 250);

            elements.push(...connSentences.slice(0, Math.max(0, 3 - elements.length)));
        }
    }

    // Return 3-5 elements, removing duplicates
    const uniqueElements = Array.from(new Set(elements));
    return uniqueElements.slice(0, 5);
}

/**
 * Find chapter data by ID in outline
 */
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

/**
 * Main execution
 */
async function populateForeshadowing() {
    console.log('🔮 Populating Foreshadowing Elements: EA-007, EA-008, EA-009\n');
    console.log('═'.repeat(70));

    try {
        // Load outline
        const outline = JSON.parse(fs.readFileSync('./data/l_outline.json', 'utf-8'));

        // Target chapters
        const targetChapters = [
            { eaId: 'EA-007', dbId: 'STG 1.1.3.1', title: 'Dominion' },
            { eaId: 'EA-008', dbId: 'STG 1.1.3.2', title: 'Transformation' },
            { eaId: 'EA-009', dbId: 'STG 1.1.3.3', title: 'Determination' }
        ];

        let totalUpdated = 0;

        for (const target of targetChapters) {
            console.log(`\n${'─'.repeat(70)}`);
            console.log(`📚 ${target.eaId}: ${target.title} (${target.dbId})`);
            console.log('─'.repeat(70));

            // Find in outline
            const chapterData = findChapterInOutline(outline, target.eaId);
            if (!chapterData) {
                console.log(`⚠️  Not found in outline`);
                continue;
            }

            console.log(`✓ Found: ${chapterData.specific_task_group_title}`);
            console.log(`  Scenes: ${chapterData.scenes?.length || 0}`);

            // Get DB chapter ID
            const chapterResult = await db.execute(sql`
        SELECT id FROM chapters WHERE unique_identifier = ${target.dbId}
      `);

            if (chapterResult.rows.length === 0) {
                console.log(`⚠️  Not in database`);
                continue;
            }

            const chapterDbId = (chapterResult.rows[0] as any).id;

            // Process scenes
            const scenes = chapterData.scenes || [];
            console.log('');

            for (const scene of scenes) {
                try {
                    // Generate foreshadowing elements
                    const foreshadowing = generateForeshadowingElements(scene, chapterData);
                    const feJSON = JSON.stringify(foreshadowing);

                    // Update ONLY foreshadowing_elements
                    await db.execute(sql`
            UPDATE scenes
            SET 
              foreshadowing_elements = ${feJSON}::jsonb,
              updated_at = NOW()
            WHERE chapter_id = ${chapterDbId}
            AND scene_number = ${scene.scene_number}
          `);

                    console.log(`  ✓ Scene ${scene.scene_number}: ${scene.scene_title}`);
                    console.log(`    → ${foreshadowing.length} foreshadowing elements`);
                    totalUpdated++;

                } catch (err) {
                    console.error(`  ✗ Scene ${scene.scene_number}: Error`, err);
                }
            }
        }

        console.log('\n' + '═'.repeat(70));
        console.log(`\n✅ Populated foreshadowing_elements for ${totalUpdated} scenes!\n`);

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

populateForeshadowing();
