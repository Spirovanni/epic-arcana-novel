import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function findEA001Chapter() {
    try {
        await client.connect();
        console.log('✓ Connected to database');
        
        // Find chapter with unique_identifier STG 1.1.1.1 (EA-001)
        const chapterQuery = await client.query(
            `SELECT id, chapter_number, title, unique_identifier 
             FROM chapters 
             WHERE unique_identifier LIKE '%STG 1.1.1.1%' OR chapter_number = 1
             ORDER BY chapter_number`
        );
        
        console.log(`\nFound ${chapterQuery.rows.length} chapters:\n`);
        
        for (const chapter of chapterQuery.rows) {
            console.log(`Chapter ${chapter.chapter_number}: ${chapter.title}`);
            console.log(`  ID: ${chapter.id}`);
            console.log(`  Unique ID: ${chapter.unique_identifier}\n`);
            
            // Get scenes for this chapter
            const scenesQuery = await client.query(
                `SELECT scene_number, title FROM scenes 
                 WHERE chapter_id = $1 ORDER BY scene_number`,
                [chapter.id]
            );
            
            console.log(`  Scenes (${scenesQuery.rows.length}):`);
            scenesQuery.rows.forEach(scene => {
                console.log(`    ${scene.scene_number}. ${scene.title}`);
            });
            console.log('\n---\n');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

findEA001Chapter();

