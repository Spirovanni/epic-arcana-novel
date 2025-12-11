import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function checkChapterScenes() {
    try {
        await client.connect();
        console.log('✓ Connected to database');
        
        const chapterId = 'b600d880-d034-46ce-b753-fe13a4c241f5';
        
        // Get chapter info
        const chapterQuery = await client.query(
            'SELECT id, chapter_number, title FROM chapters WHERE id = $1',
            [chapterId]
        );
        
        if (chapterQuery.rows.length === 0) {
            console.log('❌ Chapter not found');
            return;
        }
        
        const chapter = chapterQuery.rows[0];
        console.log(`\n📚 Chapter ${chapter.chapter_number}: ${chapter.title}`);
        console.log(`   ID: ${chapter.id}\n`);
        
        // Get scenes
        const scenesQuery = await client.query(
            `SELECT scene_number, title, 
             SUBSTRING(setup, 1, 100) as setup_preview,
             timeline_date, location, pov
             FROM scenes 
             WHERE chapter_id = $1 
             ORDER BY scene_number`,
            [chapterId]
        );
        
        console.log(`Found ${scenesQuery.rows.length} scenes:\n`);
        
        scenesQuery.rows.forEach(scene => {
            console.log(`Scene ${scene.scene_number}: ${scene.title}`);
            console.log(`  Setup: ${scene.setup_preview}...`);
            console.log(`  Date: ${scene.timeline_date} | Location: ${scene.location}`);
            console.log(`  POV: ${scene.pov}\n`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

checkChapterScenes();

