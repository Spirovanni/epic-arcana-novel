import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { eq } from 'drizzle-orm';

interface ChapterContext {
    id: string;
    chapterId: string | null;
    chapterNumber: number;
    title: string | null;
    description: string | null;
    focusArea: string | null;
    tarotFamily: string | null;
    sceneCount: number;
    sampleSceneDescriptions: string[];
}

async function generateMissingSummaries() {
    console.log('=== Generating Missing Chapter Summaries ===\n');

    // Step 1: Load JSON to find chapters without summaries
    const jsonPath = join(process.cwd(), 'data', 'l_outline.json');
    const jsonData = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    const jsonSummaryMap = new Map<string, string>();
    const books = jsonData.SelfImprovementSeries?.Books?.trilogies || {};

    for (const trilogyKey of Object.keys(books)) {
        const trilogy = books[trilogyKey];
        if (trilogy.trilogy_books) {
            for (const bookKey of Object.keys(trilogy.trilogy_books)) {
                const book = trilogy.trilogy_books[bookKey];
                if (book.task_masters) {
                    for (const tmKey of Object.keys(book.task_masters)) {
                        const taskMaster = book.task_masters[tmKey];
                        if (taskMaster.major_task_groups) {
                            for (const mtgKey of Object.keys(taskMaster.major_task_groups)) {
                                const mtg = taskMaster.major_task_groups[mtgKey];
                                if (mtg.Specific_task_groups) {
                                    for (const stgKey of Object.keys(mtg.Specific_task_groups)) {
                                        const stg = mtg.Specific_task_groups[stgKey];
                                        if (stg.id && stg.summary) {
                                            jsonSummaryMap.set(stg.id, stg.summary);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Step 2: Get chapters from database
    const dbChapters = await db
        .select({
            id: chapters.id,
            chapterId: chapters.chapterId,
            chapterNumber: chapters.chapterNumber,
            title: chapters.title,
            description: chapters.description,
            summary: chapters.summary,
            focusArea: chapters.focusArea,
            tarotFamily: chapters.tarotFamily,
        })
        .from(chapters)
        .orderBy(chapters.chapterNumber);

    // Step 3: Identify chapters missing summaries
    const chaptersNeedingSummaries: ChapterContext[] = [];

    for (const chapter of dbChapters) {
        const hasJsonSummary = chapter.chapterId && jsonSummaryMap.has(chapter.chapterId);
        const hasDbSummary = chapter.summary && chapter.summary.trim() !== '';

        if (!hasJsonSummary && !hasDbSummary) {
            // Get scenes for context
            const chapterScenes = chapter.id ? await db
                .select({
                    title: scenes.title,
                    description: scenes.description,
                    setup: scenes.setup,
                })
                .from(scenes)
                .where(eq(scenes.chapterId, chapter.id))
                .limit(3) : [];

            chaptersNeedingSummaries.push({
                id: chapter.id,
                chapterId: chapter.chapterId,
                chapterNumber: chapter.chapterNumber,
                title: chapter.title,
                description: chapter.description,
                focusArea: chapter.focusArea,
                tarotFamily: chapter.tarotFamily,
                sceneCount: chapterScenes.length,
                sampleSceneDescriptions: chapterScenes
                    .map(s => s.description || s.setup || s.title || '')
                    .filter(Boolean)
                    .slice(0, 2),
            });
        }
    }

    console.log(`Found ${chaptersNeedingSummaries.length} chapters needing summaries\n`);

    if (chaptersNeedingSummaries.length === 0) {
        console.log('✓ All chapters have summaries!');
        process.exit(0);
    }

    // Step 4: Generate summaries for each chapter
    console.log('Generating summaries using context...\n');

    const generatedSummaries = new Map<string, string>();

    for (const chapter of chaptersNeedingSummaries) {
        // Generate a contextual summary based on available information
        let summary = '';

        if (chapter.description) {
            // If we have a description, use it as the base
            summary = chapter.description.length > 300
                ? chapter.description.substring(0, 297) + '...'
                : chapter.description;
        } else if (chapter.sampleSceneDescriptions.length > 0) {
            // Use scene descriptions to infer chapter summary
            const sceneContext = chapter.sampleSceneDescriptions.join(' ');
            summary = `This chapter focuses on ${chapter.title || 'key narrative developments'}. ${sceneContext.substring(0, 200)}...`;
        } else {
            // Minimal summary based on metadata
            const parts = [];
            if (chapter.title) parts.push(`This chapter, titled "${chapter.title}",`);
            if (chapter.focusArea) parts.push(`focuses on ${chapter.focusArea}`);
            if (chapter.tarotFamily) parts.push(`and is associated with the ${chapter.tarotFamily} tarot family`);
            summary = parts.join(' ') + '.';
        }

        generatedSummaries.set(chapter.id, summary);

        console.log(`✓ Ch${chapter.chapterNumber} (${chapter.chapterId || 'no EA-id'}): Generated summary`);
        console.log(`  "${summary.substring(0, 100)}..."\n`);
    }

    // Step 5: Update database
    console.log('\nUpdating database...');
    let dbUpdateCount = 0;

    for (const [chapterId, summary] of generatedSummaries) {
        await db
            .update(chapters)
            .set({ summary })
            .where(eq(chapters.id, chapterId));
        dbUpdateCount++;
    }

    console.log(`✓ Updated ${dbUpdateCount} database records\n`);

    // Step 6: Update JSON file for chapters that have EA-IDs
    console.log('Preparing JSON updates...');
    let jsonUpdateCount = 0;
    const jsonUpdates: Array<{ chapterId: string; summary: string }> = [];

    for (const chapter of chaptersNeedingSummaries) {
        if (chapter.chapterId) {
            const summary = generatedSummaries.get(chapter.id);
            if (summary) {
                jsonUpdates.push({ chapterId: chapter.chapterId, summary });
                jsonUpdateCount++;
            }
        }
    }

    // Save the list of JSON updates for manual application
    const jsonUpdatesPath = join(process.cwd(), 'scripts', `json_summary_updates_${Date.now()}.json`);
    writeFileSync(jsonUpdatesPath, JSON.stringify(jsonUpdates, null, 2));

    console.log(`\n=== Summary ===`);
    console.log(`Total chapters needing summaries: ${chaptersNeedingSummaries.length}`);
    console.log(`Database updated: ${dbUpdateCount}`);
    console.log(`JSON updates prepared: ${jsonUpdateCount}`);
    console.log(`\nJSON updates saved to: ${jsonUpdatesPath}`);
    console.log('\nNote: JSON file updates should be applied using a separate script');
    console.log('to preserve the complex nested structure of l_outline.json');

    process.exit(0);
}

generateMissingSummaries().catch(console.error);
