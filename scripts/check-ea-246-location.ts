import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkEA246() {
    console.log('🔍 Checking EA-246 location in database...\n');

    // Method 1: By chapter_number
    console.log('Method 1: Query by chapter_number = 246');
    const byChapterNum = await sql`
        SELECT 
            id, 
            title, 
            unique_identifier, 
            chapter_number,
            book_number
        FROM chapters 
        WHERE chapter_number = 246
    `;
    console.log('Results:', byChapterNum);

    // Method 2: By unique_identifier
    console.log('\nMethod 2: Query by unique_identifier = "STG 7.1.2.3"');
    const byUniqueId = await sql`
        SELECT 
            id, 
            title, 
            unique_identifier, 
            chapter_number,
            book_number
        FROM chapters 
        WHERE unique_identifier = 'STG 7.1.2.3'
    `;
    console.log('Results:', byUniqueId);

    // Method 3: By title
    console.log('\nMethod 3: Query by title = "Purity"');
    const byTitle = await sql`
        SELECT 
            id, 
            title, 
            unique_identifier, 
            chapter_number,
            book_number
        FROM chapters 
        WHERE title = 'Purity'
    `;
    console.log('Results:', byTitle);

    // Get scenes for this chapter
    if (byChapterNum.length > 0) {
        console.log('\n📝 Scenes for EA-246:');
        const scenes = await sql`
            SELECT 
                scene_number,
                title,
                id
            FROM scenes
            WHERE chapter_id = ${byChapterNum[0].id}
            ORDER BY scene_number
        `;
        console.log(scenes);
    }

    // Check Book 7 chapters
    console.log('\n📚 All Book 7 chapters for context:');
    const book7Chapters = await sql`
        SELECT 
            chapter_number,
            title,
            unique_identifier
        FROM chapters
        WHERE book_number = 7
        ORDER BY chapter_number
        LIMIT 10
    `;
    console.log(book7Chapters);
}

checkEA246();
