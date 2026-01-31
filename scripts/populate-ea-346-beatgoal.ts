import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

const sql = neon(process.env.DATABASE_URL!);

async function updateBeatGoals() {
    console.log('🔧 Updating beat_goal fields for EA-346...\n');

    try {
        // Load the scenes JSON
        const scenesPath = path.join(process.cwd(), 'scripts', 'ea-346-enhanced-scenes-v2.json');
        const scenesData = JSON.parse(fs.readFileSync(scenesPath, 'utf-8'));

        //Find the chapter
        const chapters = await sql`SELECT id FROM chapters WHERE chapter_number = 346 LIMIT 1`;
        const chapter = chapters[0];

        console.log(`✓ Loaded ${scenesData.length} scenes from JSON\n`);

        // Update each scene
        for (const scene of scenesData) {
            const beatGoal = scene.beatGoal;

            if (!beatGoal) {
                console.log(`⚠️  Scene ${scene.scene_number}: No beatGoal found`);
                continue;
            }

            await sql`
        UPDATE scenes
        SET beat_goal = ${beatGoal}
        WHERE chapter_id = ${chapter.id}
          AND scene_number = ${scene.scene_number}
      `;

            console.log(`✅ Scene ${scene.scene_number}: Updated beat_goal`);
        }

        console.log(`\n✅ All beat_goal fields updated!\n`);

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

updateBeatGoals();
