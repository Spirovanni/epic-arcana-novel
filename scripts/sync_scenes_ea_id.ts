import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('Reading outline...');
    const outlinePath = path.resolve(process.cwd(), 'data/l_outline.json');
    const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));

    // Iterate to build a map of STG Identifier -> EA ID
    const stgToEaId = new Map<string, string>();

    function traverse(node: any) {
        if (typeof node !== 'object' || node === null) return;

        // Check if this node is a specific task group with ID and unique_identifier
        // l_outline.json structure: Book -> Task Masters -> Task Groups -> Specific Task Group
        // We look for objects that have 'unique_identifier' starting with 'STG' and 'id' starting with 'EA-'
        if (node.unique_identifier && typeof node.unique_identifier === 'string' &&
            node.id && typeof node.id === 'string' && node.id.startsWith('EA-')) {
            stgToEaId.set(node.unique_identifier, node.id);
        }

        for (const key in node) {
            traverse(node[key]);
        }
    }
    traverse(outline);

    console.log(`Found ${stgToEaId.size} EA-IDs mapping.`);

    // Get all chapters from DB
    console.log('Fetching chapters...');
    const chaptersResult = await db.execute(sql`SELECT id, unique_identifier FROM chapters`);

    let updatedCount = 0;
    for (const ch of chaptersResult.rows) {
        const stgId = ch.unique_identifier as string;
        if (stgId && stgToEaId.has(stgId)) {
            const eaId = stgToEaId.get(stgId);
            await db.execute(sql`
        UPDATE scenes 
        SET chapter_unique_identifier = ${eaId}
        WHERE chapter_id = ${ch.id}
      `);
            updatedCount++;
        }
    }

    console.log(`Updated scenes for ${updatedCount} chapters.`);
    process.exit(0);
}

main();
