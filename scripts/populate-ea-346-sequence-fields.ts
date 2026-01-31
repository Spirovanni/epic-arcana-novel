import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Load the JSON with save_the_cat_beat values
import scenes from './ea-346-comprehensive-scenes.json' assert { type: 'json' };

async function populateSequenceFields() {
    console.log('🔧 Populating EA-346 sequence fields...\n');

    // Get chapter
    const chapters = await sql`
    SELECT id FROM chapters WHERE chapter_number = 346
  `;

    if (chapters.length === 0) {
        console.error('✗ EA-346 not found!');
        return 1;
    }

    const chapterId = chapters[0].id;

    // Get existing scenes  
    const dbScenes = await sql`
    SELECT id, scene_number
    FROM scenes 
    WHERE chapter_id = ${chapterId}
    ORDER BY scene_number
  `;

    console.log(`✓ Found ${dbScenes.length} scenes in database\n`);

    let currentSequence = 1038; // Starting after max 1037

    // Update each scene
    for (const dbScene of dbScenes) {
        const sceneData = scenes.find((s: any) => s.scene_number === dbScene.scene_number);

        if (!sceneData) {
            console.log(`⚠️  No matching JSON data for scene ${dbScene.scene_number}`);
            continue;
        }

        console.log(`📝 Updating Scene ${dbScene.scene_number}...`);

        await sql`
      UPDATE scenes
      SET 
        save_the_cat_beat = ${sceneData.save_the_cat_beat},
        chronological_sequence = ${currentSequence}
      WHERE id = ${dbScene.id}
    `;

        console.log(`   ✓ Updated fields:`);
        console.log(`     - save_the_cat_beat: ${sceneData.save_the_cat_beat}`);
        console.log(`     - chronological_sequence: ${currentSequence}\n`);

        currentSequence++;
    }

    // Verify the update
    console.log('🔍 Verifying updates...\n');
    const verifyScenes = await sql`
    SELECT 
      scene_number,
      save_the_cat_beat,
      chronological_sequence
    FROM scenes 
    WHERE chapter_id = ${chapterId}
    ORDER BY scene_number
  `;

    let allPopulated = true;
    for (const scene of verifyScenes) {
        console.log(`Scene ${scene.scene_number}:`);
        console.log(`  save_the_cat_beat: ${scene.save_the_cat_beat ? '✓ HAS VALUE' : '✗ NULL'}`);
        console.log(`  chronological_sequence: ${scene.chronological_sequence ?? '✗ NULL'}\n`);

        if (!scene.save_the_cat_beat || !scene.chronological_sequence) {
            allPopulated = false;
        }
    }

    if (allPopulated) {
        console.log('✅ All sequence fields populated successfully!');
        return 0;
    } else {
        console.log('❌ Some fields still missing!');
        return 1;
    }
}

populateSequenceFields()
    .then(code => process.exit(code))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
