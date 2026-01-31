import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function updateEA346Fields() {
    console.log('🔧 Updating EA-346 field mappings...\n');

    try {
        // Find the chapter
        const chapters = await sql`
      SELECT id, title FROM chapters WHERE chapter_number = 346 LIMIT 1
    `;

        if (chapters.length === 0) {
            console.log('❌ EA-346 not found');
            return;
        }

        const chapter = chapters[0];
        console.log(`✓ Found chapter: ${chapter.title}\n`);

        // Get all scenes
        const scenes = await sql`
      SELECT id, scene_number, title,
             "beatGoal", "sensoryDetail", "internalConflict"
      FROM scenes
      WHERE chapter_id = ${chapter.id}
      ORDER BY scene_number
    `;

        console.log(`📊 Processing ${scenes.length} scenes...\n`);

        for (const scene of scenes) {
            console.log(`Scene ${scene.scene_number}: ${scene.title}`);

            // Check if we have camelCase fields to map
            const updates: string[] = [];

            if (scene.beatGoal) {
                await sql`
          UPDATE scenes
          SET beat_goal = ${scene.beatGoal}
          WHERE id = ${scene.id}
        `;
                updates.push('beat_goal');
            }

            if (scene.sensoryDetail) {
                await sql`
          UPDATE scenes
          SET sensory_detail = ${scene.sensoryDetail}
          WHERE id = ${scene.id}
        `;
                updates.push('sensory_detail');
            }

            if (scene.internalConflict) {
                await sql`
          UPDATE scenes
          SET internal_conflict = ${scene.internalConflict}
          WHERE id = ${scene.id}
        `;
                updates.push('internal_conflict');
            }

            if (updates.length > 0) {
                console.log(`  ✅ Updated: ${updates.join(', ')}`);
            } else {
                console.log(`  ⚠️  No camelCase fields found to map`);
            }
        }

        console.log(`\n✅ Field mapping complete!\n`);

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

updateEA346Fields();
