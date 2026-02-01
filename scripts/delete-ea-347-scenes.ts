import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function deleteScenes() {
    console.log('🗑️  Deleting existing EA-347 scenes...\n');

    // Verify chapter exists by NUMBER
    const chapters = await sql`
    SELECT id FROM chapters WHERE chapter_number = 347
  `;

    if (chapters.length === 0) {
        console.error('✗ EA-347 (Chapter 347) not found in DB!');
        return 1;
    }

    const chapterId = chapters[0].id;

    // Delete scenes
    const result = await sql`
    DELETE FROM scenes 
    WHERE chapter_id = ${chapterId}
    RETURNING id
  `;

    console.log(`✓ Deleted ${result.length} scenes for Chapter 347`);
    return 0;
}

deleteScenes()
    .then(code => process.exit(code))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
