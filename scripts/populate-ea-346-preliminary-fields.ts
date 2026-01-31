import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Load the JSON with all fields
import scenes from './ea-346-comprehensive-scenes.json' assert { type: 'json' };

async function populatePreliminaryFields() {
    console.log('🔧 Populating EA-346 preliminary fields from JSON...\n');

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
        preliminary_scene_focus = ${sceneData.preliminary_scene_focus},
        preliminary_scene_description = ${sceneData.preliminary_scene_description}
      WHERE id = ${dbScene.id}
    `;

        console.log(`   ✓ Updated preliminary fields:`);
        console.log(`     - focus: ${sceneData.preliminary_scene_focus?.length || 0} chars`);
        console.log(`     - description: ${sceneData.preliminary_scene_description?.length || 0} chars\n`);
    }

    // Verify the update
    console.log('🔍 Verifying updates...\n');
    const verifyScenes = await sql`
    SELECT 
      scene_number,
      preliminary_scene_focus,
      preliminary_scene_description
    FROM scenes 
    WHERE chapter_id = ${chapterId}
    ORDER BY scene_number
  `;

    let allPopulated = true;
    for (const scene of verifyScenes) {
        console.log(`Scene ${scene.scene_number}:`);
        console.log(`  preliminary_scene_focus: ${scene.preliminary_scene_focus ? '✓ ' + scene.preliminary_scene_focus.length + ' chars' : '✗ NULL'}`);
        console.log(`  preliminary_scene_description: ${scene.preliminary_scene_description ? '✓ ' + scene.preliminary_scene_description.length + ' chars' : '✗ NULL'}\n`);

        if (!scene.preliminary_scene_focus || !scene.preliminary_scene_description) {
            allPopulated = false;
        }
    }

    if (allPopulated) {
        console.log('✅ All preliminary fields populated successfully!');
        return 0;
    } else {
        console.log('❌ Some fields still missing!');
        return 1;
    }
}

populatePreliminaryFields()
    .then(code => process.exit(code))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
