import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';
import scenes from './ea-347-comprehensive-scenes.json' assert { type: 'json' };

const sql = neon(process.env.DATABASE_URL!);

async function populateAll() {
    console.log('🔧 Populating ALL EA-347 fields...\n');

    // Get chapter
    const chapters = await sql`
    SELECT id FROM chapters WHERE chapter_number = 347
  `;

    if (chapters.length === 0) {
        console.error('✗ EA-347 (Chapter 347) not found in DB!');
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
        sensory_detail = ${sceneData.sensory_detail},
        internal_conflict = ${sceneData.internal_conflict},
        series_connection_resonance = ${sceneData.series_connection_resonance},
        chapter_scene_focus = ${sceneData.chapter_scene_focus},
        chapter_unique_identifier = ${sceneData.chapter_unique_identifier},
        save_the_cat_beat = ${sceneData.save_the_cat_beat},
        chronological_sequence = ${sceneData.chronological_sequence},
        character_growth_element = ${sceneData.character_growth_element},
        scene_card_progression = ${sceneData.scene_card_progression},
        real_world_context = ${sceneData.real_world_context},
        timeline_significance = ${sceneData.timeline_significance},
        preliminary_scene_focus = ${sceneData.preliminary_scene_focus},
        preliminary_scene_description = ${sceneData.preliminary_scene_description},
        location = ${sceneData.location}
      WHERE id = ${dbScene.id}
    `;

        console.log(`   ✓ Updated all comprehensive fields`);
    }

    console.log('\n✅ All fields populated successfully!');
    return 0;
}

populateAll()
    .then(code => process.exit(code))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
