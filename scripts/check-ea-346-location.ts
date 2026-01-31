import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkEA346() {
    console.log('🔍 Checking EA-346 in database...\n');

    // Check if chapter exists
    const chapters = await sql`
        SELECT 
            id, 
            title, 
            unique_identifier, 
            chapter_number
        FROM chapters 
        WHERE chapter_number = 346
        LIMIT 1
    `;

    if (chapters.length === 0) {
        console.log('❌ EA-346 (Chapter 346) NOT FOUND in database\n');

        // Check what the highest chapter number is
        const maxChapter = await sql`
            SELECT MAX(chapter_number) as max_chapter
            FROM chapters
        `;
        console.log(`📊 Highest chapter_number in database: ${maxChapter[0].max_chapter}`);

        // Show some nearby chapters
        console.log('\n📚 Chapters around 346:');
        const nearbyChapters = await sql`
            SELECT chapter_number, title, unique_identifier
            FROM chapters
            WHERE chapter_number BETWEEN 340 AND 350
            ORDER BY chapter_number
        `;

        if (nearbyChapters.length > 0) {
            console.log(nearbyChapters);
        } else {
            console.log('No chapters found in range 340-350');
        }

        process.exit(1);
    }

    const chapter = chapters[0];
    console.log(`✅ Found EA-346: ${chapter.title}`);
    console.log(`   Chapter Number: ${chapter.chapter_number}`);
    console.log(`   Unique ID: ${chapter.unique_identifier}`);
    console.log(`   Database ID: ${chapter.id}\n`);

    // Check scenes
    const scenes = await sql`
        SELECT scene_number, title
        FROM scenes
        WHERE chapter_id = ${chapter.id}
        ORDER BY scene_number
    `;

    console.log(`📝 Scenes: ${scenes.length} total`);
    if (scenes.length > 0) {
        scenes.forEach(scene => {
            console.log(`   ${scene.scene_number}. ${scene.title}`);
        });
    }
}

checkEA346();
