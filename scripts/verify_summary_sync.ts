import { db } from '../src/lib/db';
import { chapters } from '../src/lib/schema';
import { readFileSync } from 'fs';
import { join } from 'path';

async function verifyChapterSummariesSync() {
    console.log('=== Final Chapter Summary Verification ===\n');

    // Step 1: Get all chapters from database
    const dbChapters = await db
        .select({
            id: chapters.id,
            chapterId: chapters.chapterId,
            chapterNumber: chapters.chapterNumber,
            title: chapters.title,
            summary: chapters.summary,
        })
        .from(chapters)
        .orderBy(chapters.chapterNumber);

    // Step 2: Load JSON summaries
    const jsonPath = join(process.cwd(), 'data', 'l_outline.json');
    const jsonData = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    const jsonSummaryMap = new Map();
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
                                        if (stg.id) {
                                            jsonSummaryMap.set(stg.id, stg.summary || null);
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

    // Step 3: Analyze coverage
    let dbCompletedCount = 0;
    let jsonCompletedCount = 0;
    let syncedCount = 0;
    let dbMissingCount = 0;
    let jsonMissingCount = 0;
    let notInJsonCount = 0;

    const issues: string[] = [];

    for (const chapter of dbChapters) {
        const hasDbSummary = chapter.summary && chapter.summary.trim() !== '';
        const jsonSummary = chapter.chapterId ? jsonSummaryMap.get(chapter.chapterId) : null;
        const hasJsonSummary = jsonSummary && jsonSummary.trim() !== '';

        if (hasDbSummary) dbCompletedCount++;
        if (hasJsonSummary) jsonCompletedCount++;

        if (!chapter.chapterId) {
            notInJsonCount++;
            if (!hasDbSummary) {
                issues.push(`Ch${chapter.chapterNumber} (no EA-id): Missing DB summary`);
            }
            continue;
        }

        if (!hasDbSummary && !hasJsonSummary) {
            issues.push(`Ch${chapter.chapterNumber} (${chapter.chapterId}): Missing in BOTH`);
            dbMissingCount++;
            jsonMissingCount++;
        } else if (!hasDbSummary) {
            issues.push(`Ch${chapter.chapterNumber} (${chapter.chapterId}): Missing in DB`);
            dbMissingCount++;
        } else if (!hasJsonSummary) {
            issues.push(`Ch${chapter.chapterNumber} (${chapter.chapterId}): Missing in JSON`);
            jsonMissingCount++;
        } else if (hasDbSummary && hasJsonSummary) {
            syncedCount++;
        }
    }

    // Step 4: Print results
    console.log('=== Database Summary Coverage ===');
    console.log(`Total chapters: ${dbChapters.length}`);
    console.log(`✓ Chapters with summaries: ${dbCompletedCount}`);
    console.log(`✗ Chapters missing summaries: ${dbChapters.length - dbCompletedCount}`);
    console.log(`Coverage: ${((dbCompletedCount / dbChapters.length) * 100).toFixed(1)}%\n`);

    console.log('=== JSON Summary Coverage ===');
    console.log(`Total chapters in JSON: ${jsonSummaryMap.size}`);
    console.log(`✓ Chapters with summaries: ${jsonCompletedCount}`);
    console.log(`✗ Chapters missing summaries: ${jsonSummaryMap.size - jsonCompletedCount}`);
    console.log(`Coverage: ${((jsonCompletedCount / jsonSummaryMap.size) * 100).toFixed(1)}%\n`);

    console.log('=== Sync Status ===');
    console.log(`✓ Synced (both have summary): ${syncedCount}`);
    console.log(`⚠ Chapters not in JSON structure: ${notInJsonCount}`);
    console.log(`✗ Missing in DB only: ${dbMissingCount}`);
    console.log(`✗ Missing in JSON only: ${jsonMissingCount}`);
    console.log(`✗ Missing in both: ${issues.filter(i => i.includes('BOTH')).length}\n`);

    if (issues.length > 0 && issues.length <= 20) {
        console.log('=== Issues Found ===');
        issues.forEach(issue => console.log(`  ${issue}`));
    } else if (issues.length > 20) {
        console.log(`=== Issues Found (showing first 20 of ${issues.length}) ===`);
        issues.slice(0, 20).forEach(issue => console.log(`  ${issue}`));
    }

    if (issues.length === 0) {
        console.log('✓✓✓ SUCCESS! All chapters have summaries in both locations! ✓✓✓');
    } else {
        console.log(`\n⚠ Found ${issues.length} chapters with missing summaries`);
    }

    process.exit(0);
}

verifyChapterSummariesSync().catch(console.error);
