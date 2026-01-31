import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Load the JSON with all fields
import scenes from './ea-346-comprehensive-scenes.json' assert { type: 'json' };

async function populateRemainingFields() {
    console.log('🔧 Populating remaining EA-346 fields from JSON...\n');

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
        character_growth_element = ${sceneData.character_growth_element},
        scene_card_progression = ${sceneData.scene_card_progression},
        real_world_context = ${sceneData.real_world_context},
        chronological_sequence = ${sceneData.chronological_sequence},
        story_sequence = ${sceneData.story_sequence},
        timeline_significance = ${sceneData.timeline_significance}
      WHERE id = ${dbScene.id}
    `;

        console.log(`   ✓ Updated 6 fields:`);
        console.log(`     - character_growth_element: ${sceneData.character_growth_element?.length || 0} chars`);
        console.log(`     - scene_card_progression: ${sceneData.scene_card_progression}`);
        console.log(`     - real_world_context: ${sceneData.real_world_context?.length || 0} chars`);
        console.log(`     - chronological_sequence: ${sceneData.chronological_sequence ?? 'null'}`);
        console.log(`     - story_sequence: ${sceneData.story_sequence ?? 'null'}`);
        console.log(`     - timeline_significance: ${sceneData.timeline_significance?.length || 0} chars\n`);
    }

    // Verify the update
    console.log('🔍 Verifying updates...\n');
    const verifyScenes = await sql`
    SELECT 
      scene_number,
      character_growth_element,
      scene_card_progression,
      real_world_context,
      chronological_sequence,
      story_sequence,
      timeline_significance
    FROM scenes 
    WHERE chapter_id = ${chapterId}
    ORDER BY scene_number
  `;

    let allPopulated = true;
    for (const scene of verifyScenes) {
        console.log(`Scene ${scene.scene_number}:`);
        console.log(`  character_growth_element: ${scene.character_growth_element ? '✓ ' + scene.character_growth_element.length + ' chars' : '✗ NULL'}`);
        console.log(`  scene_card_progression: ${scene.scene_card_progression ?? '✗ NULL'}`);
        console.log(`  real_world_context: ${scene.real_world_context ? '✓ HAS VALUE' : '✗ NULL'}`);
        console.log(`  chronological_sequence: ${scene.chronological_sequence ?? 'null (expected)'}`);
        console.log(`  story_sequence: ${scene.story_sequence ?? 'null (expected)'}`);
        console.log(`  timeline_significance: ${scene.timeline_significance ? '✓ ' + scene.timeline_significance.length + ' chars' : '✗ NULL'}\n`);

        if (!scene.character_growth_element || !scene.scene_card_progression || !scene.real_world_context || !scene.timeline_significance) {
            allPopulated = false;
        }
    }

    if (allPopulated) {
        console.log('✅ All remaining fields populated successfully!');
        return 0;
    } else {
        console.log('❌ Some fields still missing!');
        return 1;
    }
}

populateRemainingFields()
    .then(code => process.exit(code))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
