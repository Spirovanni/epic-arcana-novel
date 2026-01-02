import { db } from '../src/lib/db';
import { chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface SyncResult {
    chapterId: string;
    chapterNumber: number;
    title: string | null;
    oldSummary: string | null;
    newSummary: string;
    action: 'updated' | 'no_change';
}

async function syncChapterSummaries() {
    console.log('=== Chapter Summary Synchronization ===\n');

    // Step 1: Load JSON file
    console.log('Loading l_outline.json...');
    const jsonPath = join(process.cwd(), 'data', 'l_outline.json');
    const jsonData = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    // Step 2: Extract chapter summaries from JSON
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

    console.log(`Found ${jsonSummaryMap.size} chapter summaries in JSON\n`);

    // Step 3: Get all chapters from database
    const dbChapters = await db
        .select({
            id: chapters.id,
            chapterId: chapters.chapterId, // EA-XXX format
            chapterNumber: chapters.chapterNumber,
            title: chapters.title,
            summary: chapters.summary,
        })
        .from(chapters)
        .orderBy(chapters.chapterNumber);

    console.log(`Found ${dbChapters.length} chapters in database\n`);

    // Step 4: Create backup of current database state
    const backupPath = join(process.cwd(), 'scripts', `chapter_summaries_backup_${Date.now()}.json`);
    writeFileSync(backupPath, JSON.stringify(dbChapters, null, 2));
    console.log(`Created backup at: ${backupPath}\n`);

    // Step 5: Sync summaries
    const syncResults: SyncResult[] = [];
    let updatedCount = 0;
    let noChangeCount = 0;
    let notInJsonCount = 0;

    for (const chapter of dbChapters) {
        // Use chapterId (EA-XXX) to look up in JSON map
        const jsonSummary = chapter.chapterId ? jsonSummaryMap.get(chapter.chapterId) : null;

        if (!jsonSummary) {
            notInJsonCount++;
            continue;
        }

        // Check if update is needed
        if (chapter.summary === jsonSummary) {
            noChangeCount++;
            syncResults.push({
                chapterId: chapter.id,
                chapterNumber: chapter.chapterNumber,
                title: chapter.title,
                oldSummary: chapter.summary,
                newSummary: jsonSummary,
                action: 'no_change',
            });
            continue;
        }

        // Update the database
        await db
            .update(chapters)
            .set({ summary: jsonSummary })
            .where(eq(chapters.id, chapter.id));

        updatedCount++;
        syncResults.push({
            chapterId: chapter.id,
            chapterNumber: chapter.chapterNumber,
            title: chapter.title,
            oldSummary: chapter.summary,
            newSummary: jsonSummary,
            action: 'updated',
        });

        console.log(`✓ Ch${chapter.chapterNumber} (${chapter.id}): Updated summary`);
    }

    // Step 6: Save audit log
    const auditPath = join(process.cwd(), 'scripts', `sync_audit_${Date.now()}.json`);
    writeFileSync(auditPath, JSON.stringify(syncResults, null, 2));

    // Step 7: Print summary
    console.log('\n=== Synchronization Complete ===');
    console.log(`Total chapters in database: ${dbChapters.length}`);
    console.log(`Summaries in JSON: ${jsonSummaryMap.size}`);
    console.log(`\nResults:`);
    console.log(`  ✓ Updated: ${updatedCount}`);
    console.log(`  - No change needed: ${noChangeCount}`);
    console.log(`  ⚠ Not in JSON: ${notInJsonCount}`);
    console.log(`\nBackup saved: ${backupPath}`);
    console.log(`Audit log saved: ${auditPath}`);

    // Show a few examples of updates
    if (updatedCount > 0) {
        console.log('\n=== Sample Updates (first 3) ===');
        syncResults
            .filter(r => r.action === 'updated')
            .slice(0, 3)
            .forEach(r => {
                console.log(`\nChapter ${r.chapterNumber} - ${r.title}`);
                console.log(`Old: ${r.oldSummary?.substring(0, 100)}...`);
                console.log(`New: ${r.newSummary.substring(0, 100)}...`);
            });
    }

    process.exit(0);
}

syncChapterSummaries().catch(console.error);
