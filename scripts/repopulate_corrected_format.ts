import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';

// Type definitions for JSON structure
interface TerminalLearningObjective {
    objective1: string;
    objective2: string;
    objective3: string;
}

interface BookInfluence {
    title: string;
    author: string;
    section_of_focus: string;
    section_description: string;
    connection_focus_area: string;
    connect_points: {
        point1: string;
        point2: string;
        point3: string;
    };
    terminal_learning_objectives: TerminalLearningObjective;
}

interface SceneData {
    scene_number: number;
    scene_title: string;
    setup?: string;
    symbolism?: string;
    beat_goal?: string;
    pov?: string;
    tense?: string;
    core_emotion?: string;
    scene_tone?: string;
    sudowrite_pov_guidance?: string;
    sudowrite_tone_guidance?: string;
    sudowrite_pacing_guidance?: string;
    sudowrite_sensory_focus?: string;
    sudowrite_character_moments?: string[];
    sudowrite_target_length?: string;
    sudowrite_key_challenge?: string;
    learning_objective_integration?: string;
    foreshadowing_series?: string;
    narrative_function?: string;
    series_connections?: string;
}

interface ChapterData {
    id: string;
    specific_task_group_title: string;
    focus_area: string;
    specific_task_group_description: string;
    specific_task_group_books_influenced_by?: {
        book1?: BookInfluence;
        book2?: BookInfluence;
        book3?: BookInfluence;
    };
    scenes: SceneData[];
}

/**
 * Generate sudowrite_metadata MATCHING ESTABLISHED FORMAT
 */
function generateSudowriteMetadata(scene: SceneData, chapter: ChapterData): object {
    return {
        sudowrite_pov_guidance: scene.sudowrite_pov_guidance || `Third Person Limited (${scene.pov || 'Francisco'})`,
        sudowrite_tone_guidance: scene.sudowrite_tone_guidance || scene.scene_tone || '',
        sudowrite_pacing_guidance: scene.sudowrite_pacing_guidance || '',
        sudowrite_sensory_focus: scene.sudowrite_sensory_focus || '',
        sudowrite_target_length: scene.sudowrite_target_length || '1500-2000 words',
        sudowrite_key_challenge: scene.sudowrite_key_challenge || '',
        sudowrite_character_moments: scene.sudowrite_character_moments || []
    };
}

/**
 * Generate learning_objectives MATCHING ESTABLISHED FORMAT (simpler structure)
 */
function generateLearningObjectives(scene: SceneData, chapter: ChapterData): object {
    // Build integration text
    let integrationText = '';

    if (scene.learning_objective_integration) {
        integrationText = scene.learning_objective_integration;
    } else {
        // Construct from chapter data
        integrationText = `Chapter Theme: ${chapter.specific_task_group_title} (${chapter.focus_area}) - ${scene.beat_goal || 'Scene develops thematic elements through narrative action.'}`;

        // Add connection to books if available
        const books = chapter.specific_task_group_books_influenced_by;
        if (books && books.book1) {
            integrationText += ` Connection to books: ${books.book1.title}`;
            if (books.book2) integrationText += `, ${books.book2.title}`;
            if (books.book3) integrationText += `, ${books.book3.title}`;
        }
    }

    return {
        integration: integrationText
    };
}

/**
 * Generate foreshadowing_elements MATCHING ESTABLISHED FORMAT (array of strings)
 */
function generateForeshadowingElements(scene: SceneData, chapter: ChapterData): string[] {
    const elements: string[] = [];

    // Add foreshadowing_series if present
    if (scene.foreshadowing_series) {
        elements.push(scene.foreshadowing_series);
    }

    // Extract from symbolism
    if (scene.symbolism) {
        const sentences = scene.symbolism
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 30 && s.length < 200);

        // Take up to 3 meaningful symbolic statements
        elements.push(...sentences.slice(0, 3));
    }

    // If we don't have enough, add from beat_goal
    if (elements.length < 3 && scene.beat_goal) {
        const beatSentences = scene.beat_goal
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 30 && s.length < 200);

        elements.push(...beatSentences.slice(0, Math.max(0, 3 - elements.length)));
    }

    return elements.slice(0, 5); // Limit to 5 elements
}

/**
 * Find chapter data by ID in the outline
 */
function findChapterInOutline(outline: any, chapterId: string): ChapterData | null {
    // Navigate the deeply nested structure
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
 * Main execution function using RAW SQL with CORRECTED FORMAT
 */
async function repopulateSceneMetadataCorrected() {
    console.log('🔧 Re-populating Scene Metadata (CORRECTED FORMAT)\n');
    console.log('═'.repeat(70));

    try {
        // Load l_outline.json
        const outlinePath = './data/l_outline.json';
        console.log(`📖 Loading outline from: ${outlinePath}`);
        const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

        // Target chapters
        const targetChapters = [
            { eaId: 'EA-004', dbId: 'STG 1.1.2.1', title: 'Explosive' },
            { eaId: 'EA-005', dbId: 'STG 1.1.2.2', title: 'Implementation' },
            { eaId: 'EA-006', dbId: 'STG 1.1.2.3', title: 'Ownership' }
        ];
        let totalScenesUpdated = 0;

        for (const target of targetChapters) {
            console.log(`\n${'─'.repeat(70)}`);
            console.log(`📚 Processing: ${target.eaId} (${target.title})`);
            console.log('─'.repeat(70));

            // Find chapter data in outline
            const chapterData = findChapterInOutline(outline, target.eaId);

            if (!chapterData) {
                console.log(`⚠️  Chapter ${target.eaId} not found in outline`);
                continue;
            }

            console.log(`✓ Found: ${chapterData.specific_task_group_title}`);
            console.log(`  Focus: ${chapterData.focus_area}`);
            console.log(`  Scenes: ${chapterData.scenes?.length || 0}`);

            // Get chapter ID from database
            const chapterResult = await db.execute(sql`
        SELECT id FROM chapters WHERE unique_identifier = ${target.dbId}
      `);

            if (chapterResult.rows.length === 0) {
                console.log(`⚠️  Chapter ${target.dbId} not in database`);
                continue;
            }

            const chapterDbId = (chapterResult.rows[0] as any).id;
            console.log(`✓ DB ID: ${chapterDbId}\n`);

            // Process each scene
            const scenesArray = chapterData.scenes || [];

            for (const sceneData of scenesArray) {
                try {
                    // Generate metadata using CORRECTED FORMAT
                    const sudowriteMetadata = generateSudowriteMetadata(sceneData, chapterData);
                    const learningObjectives = generateLearningObjectives(sceneData, chapterData);
                    const foreshadowingElements = generateForeshadowingElements(sceneData, chapterData);

                    // Convert to JSON
                    const swJSON = JSON.stringify(sudowriteMetadata);
                    const loJSON = JSON.stringify(learningObjectives);
                    const feJSON = JSON.stringify(foreshadowingElements);

                    // UPDATE using RAW SQL
                    await db.execute(sql`
            UPDATE scenes
            SET 
              sudowrite_metadata = ${swJSON}::jsonb,
              learning_objectives = ${loJSON}::jsonb,
              foreshadowing_elements = ${feJSON}::jsonb,
              updated_at = NOW()
            WHERE chapter_id = ${chapterDbId}
            AND scene_number = ${sceneData.scene_number}
          `);

                    console.log(`  ✓ Scene ${sceneData.scene_number}: ${sceneData.scene_title}`);
                    totalScenesUpdated++;

                } catch (sceneError) {
                    console.error(`  ✗ Error: Scene ${sceneData.scene_number}:`, sceneError);
                }
            }
        }

        console.log('\n' + '═'.repeat(70));
        console.log(`\n✅ Re-populated ${totalScenesUpdated} scenes with CORRECTED FORMAT!`);
        console.log('\nFormat corrections:');
        console.log('  • sudowrite_metadata: Uses sudowrite_* prefix keys');
        console.log('  • learning_objectives: Simple {integration: "..."} format');
        console.log('  • foreshadowing_elements: Array of strings\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

// Execute
repopulateSceneMetadataCorrected();
