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
 * Generate sudowrite_metadata from scene data
 */
function generateSudowriteMetadata(scene: SceneData, chapter: ChapterData): object {
    return {
        pov_guidance: scene.sudowrite_pov_guidance || scene.pov || 'Third Person Limited',
        tone_guidance: scene.sudowrite_tone_guidance || scene.scene_tone || '',
        pacing_guidance: scene.sudowrite_pacing_guidance || '',
        sensory_focus: scene.sudowrite_sensory_focus || '',
        character_moments: scene.sudowrite_character_moments || [],
        target_length: scene.sudowrite_target_length || '1500-2000 words',
        key_challenge: scene.sudowrite_key_challenge || '',
        narrative_function: scene.narrative_function || '',
        stylistic_notes: `This scene embodies the chapter theme of "${chapter.specific_task_group_title}" (${chapter.focus_area}), requiring careful attention to ${scene.core_emotion || 'emotional authenticity'}.`,
        beat_goal: scene.beat_goal || '',
        symbolism_integration: scene.symbolism || ''
    };
}

/**
 * Generate learning_objectives from scene and chapter data
 */
function generateLearningObjectives(scene: SceneData, chapter: ChapterData): object {
    const objectives: string[] = [];

    // Extract learning objectives from books
    const books = chapter.specific_task_group_books_influenced_by;
    if (books) {
        [books.book1, books.book2, books.book3].forEach((book, index) => {
            if (book) {
                const tlo = book.terminal_learning_objectives;
                if (tlo) {
                    if (tlo.objective1) objectives.push(`[${book.title}] ${tlo.objective1}`);
                    if (tlo.objective2) objectives.push(`[${book.title}] ${tlo.objective2}`);
                    if (tlo.objective3) objectives.push(`[${book.title}] ${tlo.objective3}`);
                }
            }
        });
    }

    return {
        primary_objective: `Master the principles of ${chapter.specific_task_group_title} through narrative exploration`,
        focus_area: chapter.focus_area,
        integration_notes: scene.learning_objective_integration || '',
        bloom_taxonomy_level: determineBloomLevel(scene),
        connection_to_books: objectives,
        reader_takeaways: generateReaderTakeaways(scene, chapter),
        thematic_alignment: chapter.specific_task_group_description
    };
}

/**
 * Determine Bloom's Taxonomy level based on scene content
 */
function determineBloomLevel(scene: SceneData): string {
    const content = (scene.beat_goal || '') + (scene.learning_objective_integration || '');
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('create') || lowerContent.includes('design') || lowerContent.includes('construct')) {
        return 'CREATE';
    } else if (lowerContent.includes('evaluate') || lowerContent.includes('judge') || lowerContent.includes('critique')) {
        return 'EVALUATE';
    } else if (lowerContent.includes('analyze') || lowerContent.includes('examine') || lowerContent.includes('compare')) {
        return 'ANALYZE';
    } else if (lowerContent.includes('apply') || lowerContent.includes('implement') || lowerContent.includes('execute')) {
        return 'APPLY';
    } else if (lowerContent.includes('understand') || lowerContent.includes('comprehend') || lowerContent.includes('interpret')) {
        return 'UNDERSTAND';
    } else {
        return 'REMEMBER';
    }
}

/**
 * Generate reader takeaways from scene  
 */
function generateReaderTakeaways(scene: SceneData, chapter: ChapterData): string[] {
    const takeaways: string[] = [];

    // Extract from beat goal
    if (scene.beat_goal) {
        const sentences = scene.beat_goal.split(/[.!?]+/).filter(s => s.trim().length > 20);
        takeaways.push(...sentences.slice(0, 2).map(s => s.trim()));
    }

    // Extract from learning objective integration
    if (scene.learning_objective_integration) {
        const sentences = scene.learning_objective_integration.split(/[.!?]+/).filter(s => s.trim().length > 20);
        takeaways.push(...sentences.slice(0, 2).map(s => s.trim()));
    }

    // Add thematic takeaway
    takeaways.push(`Understanding ${chapter.specific_task_group_title} as demonstrated through Francisco's journey`);

    return takeaways.slice(0, 5); // Limit to 5 takeaways
}

/**
 * Generate foreshadowing_elements from scene data
 */
function generateForeshadowingElements(scene: SceneData, chapter: ChapterData): object {
    return {
        immediate_payoff: extractImmediatePayoff(scene),
        book_series_setup: scene.foreshadowing_series ? [scene.foreshadowing_series] : [],
        character_arc_hints: extractCharacterHints(scene),
        symbolic_threads: scene.symbolism ? extractSymbolicThreads(scene.symbolism) : [],
        temporal_seeds: extractTemporalSeeds(scene),
        thematic_echoes: [chapter.specific_task_group_title, chapter.focus_area]
    };
}

/**
 * Extract immediate payoff from scene
 */
function extractImmediatePayoff(scene: SceneData): string[] {
    const payoffs: string[] = [];

    if (scene.beat_goal) {
        // Look for setup/payoff language
        const setupMatches = scene.beat_goal.match(/(?:sets? up|establishes?|introduces?|plants?)[^.!?]*[.!?]/gi);
        if (setupMatches) {
            payoffs.push(...setupMatches.map(m => m.trim()));
        }
    }

    return payoffs.slice(0, 3);
}

/**
 * Extract character development hints
 */
function extractCharacterHints(scene: SceneData): string[] {
    const hints: string[] = [];

    if (scene.beat_goal) {
        const charMatches = scene.beat_goal.match(/(?:character|Francisco|development|transformation|growth)[^.!?]*[.!?]/gi);
        if (charMatches) {
            hints.push(...charMatches.map(m => m.trim()));
        }
    }

    return hints.slice(0, 3);
}

/**
 * Extract symbolic threads from symbolism
 */
function extractSymbolicThreads(symbolism: string): string[] {
    // Split by sentence and find key symbolic statements
    const sentences = symbolism.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.map(s => s.trim()).slice(0, 4);
}

/**
 * Extract temporal/timeline seeds
 */
function extractTemporalSeeds(scene: SceneData): string[] {
    const seeds: string[] = [];

    const allText = [scene.symbolism, scene.beat_goal, scene.setup].join(' ');
    const temporalMatches = allText.match(/(?:timeline|temporal|time|future|past|destiny|fate|prophecy)[^.!?]*[.!?]/gi);

    if (temporalMatches) {
        seeds.push(...temporalMatches.map(m => m.trim()));
    }

    return seeds.slice(0, 3);
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
 * Main execution function using RAW SQL
 */
async function populateSceneMetadataSQL() {
    console.log('🎬 Scene Metadata Population (RAW SQL VERSION)\n');
    console.log('═'.repeat(70));

    try {
        // Load l_outline.json
        const outlinePath = './data/l_outline.json';
        console.log(`📖 Loading outline from: ${outlinePath}`);
        const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

        // Target chapters - mapping EA-IDs to actual DB identifiers
        const targetChapters = [
            { eaId: 'EA-004', dbId: 'STG 1.1.2.1', title: 'Explosive' },
            { eaId: 'EA-005', dbId: 'STG 1.1.2.2', title: 'Implementation' },
            { eaId: 'EA-006', dbId: 'STG 1.1.2.3', title: 'Ownership' }
        ];
        let totalScenesUpdated = 0;

        for (const target of targetChapters) {
            console.log(`\n${'─'.repeat(70)}`);
            console.log(`📚 Processing: ${target.eaId} (${target.title})`);
            console.log(`   Database ID: ${target.dbId}`);
            console.log('─'.repeat(70));

            // Find chapter data in outline using EA-ID
            const chapterData = findChapterInOutline(outline, target.eaId);

            if (!chapterData) {
                console.log(`⚠️  Chapter ${target.eaId} not found in outline, skipping...`);
                continue;
            }

            console.log(`✓ Found chapter: ${chapterData.specific_task_group_title}`);
            console.log(`  Focus: ${chapterData.focus_area}`);
            console.log(`  Scenes: ${chapterData.scenes?.length || 0}`);

            // Get chapter ID from database
            const chapterResult = await db.execute(sql`
        SELECT id FROM chapters WHERE unique_identifier = ${target.dbId}
      `);

            if (chapterResult.rows.length === 0) {
                console.log(`⚠️  Chapter ${target.dbId} not found in database`);
                continue;
            }

            const chapterDbId = (chapterResult.rows[0] as any).id;
            console.log(`✓ DB Chapter ID: ${chapterDbId}\n`);

            // Process each scene using RAW SQL
            const scenesArray = chapterData.scenes || [];
            console.log(`  Processing ${scenesArray.length} scenes...`);

            for (const sceneData of scenesArray) {
                try {
                    // Generate metadata objects
                    const sudowriteMetadata = generateSudowriteMetadata(sceneData, chapterData);
                    const learningObjectives = generateLearningObjectives(sceneData, chapterData);
                    const foreshadowingElements = generateForeshadowingElements(sceneData, chapterData);

                    // Convert to JSON strings for SQL
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
                    console.error(`  ✗ Error updating scene ${sceneData.scene_number}:`, sceneError);
                }
            }
        }

        console.log('\n' + '═'.repeat(70));
        console.log(`\n✅ Successfully updated ${totalScenesUpdated} scenes using RAW SQL!`);
        console.log('\n🎉 Scene metadata population complete!\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error during metadata population:', error);
        process.exit(1);
    }
}

// Execute
populateSceneMetadataSQL();
