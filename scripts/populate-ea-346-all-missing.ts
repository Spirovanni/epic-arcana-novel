import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Load the JSON with all fields
import scenes from './ea-346-comprehensive-scenes.json' assert { type: 'json' };

async function populateAllMissingFields() {
    console.log('🔧 Populating ALL missing EA-346 fields from JSON...\n');

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
    SELECT id, scene_number, 
           series_connection_resonance, 
           chapter_scene_focus, 
           chapter_unique_identifier
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
        console.log(`   Current DB values:`);
        console.log(`     series_connection_resonance: ${dbScene.series_connection_resonance ? 'HAS VALUE' : 'NULL'}`);
        console.log(`     chapter_scene_focus: ${dbScene.chapter_scene_focus ? 'HAS VALUE' : 'NULL'}`);
        console.log(`     chapter_unique_identifier: ${dbScene.chapter_unique_identifier}`);

        await sql`
      UPDATE scenes
      SET 
        series_connection_resonance = ${sceneData.series_connection_resonance},
        chapter_scene_focus = ${sceneData.chapter_scene_focus},
        chapter_unique_identifier = ${sceneData.chapter_unique_identifier}
      WHERE id = ${dbScene.id}
    `;

        console.log(`   ✓ Updated all three fields\n`);
    }

    // Verify the update
    console.log('🔍 Verifying updates...\n');
    const verifyScenes = await sql`
    SELECT scene_number, 
           chapter_scene_focus, 
           chapter_unique_identifier,
           LENGTH(series_connection_resonance) as resonance_length
    FROM scenes 
    WHERE chapter_id = ${chapterId}
    ORDER BY scene_number
  `;

    for (const scene of verifyScenes) {
        console.log(`Scene ${scene.scene_number}:`);
        console.log(`  chapter_scene_focus: ${scene.chapter_scene_focus}`);
        console.log(`  chapter_unique_identifier: ${scene.chapter_unique_identifier}`);
        console.log(`  series_connection_resonance: ${scene.resonance_length} chars\n`);
    }

    console.log('✅ All missing fields populated!');
    return 0;
}

populateAllMissingFields()
    .then(code => process.exit(code))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
