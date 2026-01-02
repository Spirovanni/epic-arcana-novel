import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

async function applyJsonSummaryUpdates() {
    console.log('=== Applying Summary Updates to JSON ===\n');

    // Step 1: Load the updates file  
    const updatesPath = join(process.cwd(), 'scripts');
    const files = readdirSync(updatesPath);
    const updateFile = files
        .filter((f: string) => f.startsWith('json_summary_updates_'))
        .sort()
        .reverse()[0];

    if (!updateFile) {
        console.log('No update file found!');
        process.exit(1);
    }

    const updatesFilePath = join(updatesPath, updateFile);
    console.log(`Loading updates from: ${updateFile}\n`);

    const updates: Array<{ chapterId: string; summary: string }> = JSON.parse(
        readFileSync(updatesFilePath, 'utf-8')
    );

    console.log(`Found ${updates.length} summaries to apply\n`);

    // Step 2: Load JSON file
    const jsonPath = join(process.cwd(), 'data', 'l_outline.json');
    const jsonData = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    // Step 3: Create backup
    const backupPath = join(process.cwd(), 'data', `l_outline_backup_${Date.now()}.json`);
    writeFileSync(backupPath, JSON.stringify(jsonData, null, 2));
    console.log(`Created backup: ${backupPath}\n`);

    // Step 4: Apply updates
    let appliedCount = 0;
    const updateMap = new Map(updates.map(u => [u.chapterId, u.summary]));

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
                                        if (stg.id && updateMap.has(stg.id)) {
                                            const newSummary = updateMap.get(stg.id);
                                            stg.summary = newSummary;
                                            appliedCount++;
                                            console.log(`✓ Updated ${stg.id}: ${stg.title || 'Untitled'}`);
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

    // Step 5: Save updated JSON
    writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));

    console.log(`\n=== Complete ===`);
    console.log(`Summaries applied: ${appliedCount} / ${updates.length}`);
    console.log(`Backup saved: ${backupPath}`);
    console.log(`Updated file: ${jsonPath}`);

    process.exit(0);
}

applyJsonSummaryUpdates().catch(console.error);
