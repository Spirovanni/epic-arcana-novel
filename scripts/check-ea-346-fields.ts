import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkEA346Fields() {
    console.log('🔍 Checking EA-346 field values...\n');

    try {
        const chapters = await sql`
      SELECT id FROM chapters WHERE chapter_number = 346 LIMIT 1
    `;

        const chapter = chapters[0];

        // Select all field names explicitly
        const scenes = await sql`
      SELECT 
        scene_number, title,
        beat_goal,
        sensory_detail,
        internal_conflict
      FROM scenes
      WHERE chapter_id = ${chapter.id}
      ORDER BY scene_number
    `;

        for (const scene of scenes) {
            console.log(`Scene ${scene.scene_number}: ${scene.title}`);
            console.log(`  beat_goal: ${scene.beat_goal ? 'HAS VALUE' : 'NULL/EMPTY'}`);
            console.log(`  sensory_detail: ${scene.sensory_detail ? 'HAS VALUE' : 'NULL/EMPTY'}`);
            console.log(`  internal_conflict: ${scene.internal_conflict ? 'HAS VALUE' : 'NULL/EMPTY'}\n`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

checkEA346Fields();
