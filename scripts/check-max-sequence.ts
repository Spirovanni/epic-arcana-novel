import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkMaxSequence() {
    const result = await sql`
    SELECT MAX(chronological_sequence) as max_seq
    FROM scenes
  `;

    console.log(`Max chronological_sequence in DB: ${result[0].max_seq}`);

    // Let's also check the latest chapter's chronological sequence to be sure
    const latestChapterScenes = await sql`
        SELECT chapter_number, chronological_sequence
        FROM scenes
        JOIN chapters ON scenes.chapter_id = chapters.id
        WHERE chronological_sequence IS NOT NULL
        ORDER BY chronological_sequence DESC
        LIMIT 5
    `;
    console.log('Latest chronological sequences:', latestChapterScenes);

}

checkMaxSequence()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
