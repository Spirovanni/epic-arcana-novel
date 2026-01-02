import { db } from '../src/lib/db';
import { chapters } from '../src/lib/schema';
import { readFileSync } from 'fs';
import { join } from 'path';

interface ChapterSummaryAnalysis {
    id: string;
    chapterNumber: number;
    title: string | null;
    dbSummary: string | null;
    jsonSummary: string | null;
    status: 'COMPLETE' | 'DB_MISSING' | 'JSON_MISSING' | 'BOTH_MISSING';
}

async function analyzeChapterSummaries() {
    console.log('=== Chapter Summary Analysis ===\n');

    // Load JSON file
    const jsonPath = join(process.cwd(), 'data', 'l_outline.json');
    const jsonData = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    // Get all chapters from database
    const dbChapters = await db
        .select({
            id: chapters.id,
            chapterNumber: chapters.chapterNumber,
            title: chapters.title,
            summary: chapters.summary,
            description: chapters.description,
        })
        .from(chapters)
        .orderBy(chapters.chapterNumber);

    console.log(`Total chapters in database: ${dbChapters.length}\n`);

    // Build a map of chapter summaries from JSON by chapter ID (EA-XXX)
    const jsonSummaryMap = new Map<string, string>();

    // Navigate the JSON structure to find chapter summaries
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

    console.log(`Found ${jsonSummaryMap.size} chapter summaries in JSON file\n`);

    // Analyze each chapter
    const analysis: ChapterSummaryAnalysis[] = [];
    let dbMissingCount = 0;
    let jsonMissingCount = 0;
    let bothMissingCount = 0;
    let completeCount = 0;

    for (const chapter of dbChapters) {
        const jsonSummary = jsonSummaryMap.get(chapter.id) || null;
        const dbSummary = chapter.summary || null;

        let status: ChapterSummaryAnalysis['status'];
        if (dbSummary && jsonSummary) {
            status = 'COMPLETE';
            completeCount++;
        } else if (!dbSummary && jsonSummary) {
            status = 'DB_MISSING';
            dbMissingCount++;
        } else if (dbSummary && !jsonSummary) {
            status = 'JSON_MISSING';
            jsonMissingCount++;
        } else {
            status = 'BOTH_MISSING';
            bothMissingCount++;
        }

        analysis.push({
            id: chapter.id,
            chapterNumber: chapter.chapterNumber,
            title: chapter.title,
            dbSummary,
            jsonSummary,
            status,
        });
    }

    // Print summary statistics
    console.log('=== Summary Statistics ===');
    console.log(`✓ Complete (both DB and JSON): ${completeCount}`);
    console.log(`⚠ DB Missing (JSON has it): ${dbMissingCount}`);
    console.log(`⚠ JSON Missing (DB has it): ${jsonMissingCount}`);
    console.log(`✗ Both Missing: ${bothMissingCount}`);
    console.log();

    // Show first few chapters with issues
    if (dbMissingCount > 0) {
        console.log('=== Chapters Missing DB Summary (first 5) ===');
        analysis
            .filter(a => a.status === 'DB_MISSING')
            .slice(0, 5)
            .forEach(a => {
                console.log(`${a.id} - Ch${a.chapterNumber}: ${a.title}`);
                console.log(`  JSON: ${a.jsonSummary?.substring(0, 100)}...`);
                console.log();
            });
    }

    if (bothMissingCount > 0) {
        console.log('=== Chapters Missing Both (first 10) ===');
        analysis
            .filter(a => a.status === 'BOTH_MISSING')
            .slice(0, 10)
            .forEach(a => {
                console.log(`${a.id} - Ch${a.chapterNumber}: ${a.title}`);
                console.log(`  Description: ${a.dbSummary || 'N/A'}`);
                console.log();
            });
    }

    // Save full analysis to file
    const analysisPath = join(process.cwd(), 'scripts', 'chapter_summary_analysis.json');
    const fs = await import('fs/promises');
    await fs.writeFile(analysisPath, JSON.stringify(analysis, null, 2));
    console.log(`\nFull analysis saved to: ${analysisPath}`);

    process.exit(0);
}

analyzeChapterSummaries().catch(console.error);
