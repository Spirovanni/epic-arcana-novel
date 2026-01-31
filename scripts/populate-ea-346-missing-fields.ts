import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Load the JSON with all fields
import scenes from './ea-346-comprehensive-scenes.json' assert { type: 'json' };

async function populateMissingFields() {
    console.log('🔧 Populating missing EA-346 fields...\n');

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
    SELECT id, scene_number FROM scenes 
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
        internal_conflict = ${sceneData.internal_conflict}
      WHERE id = ${dbScene.id}
    `;

        console.log(`   ✓ Updated sensory_detail and internal_conflict\n`);
    }

    console.log('✅ Field population complete!');
    return 0;
}

populateMissingFields()
    .then(code => process.exit(code))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
