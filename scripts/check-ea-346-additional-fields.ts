import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkFields() {
    const scenes = await sql`
    SELECT 
      scene_number,
      character_growth_element,
      scene_card_progression,
      real_world_context,
      chronological_sequence,
      story_sequence,
      timeline_significance
    FROM scenes 
    WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 346)
    ORDER BY scene_number
  `;

    for (const scene of scenes) {
        console.log(`Scene ${scene.scene_number}:`);
        console.log(`  character_growth_element: ${scene.character_growth_element ? 'HAS VALUE (' + scene.character_growth_element.length + ' chars)' : 'NULL'}`);
        console.log(`  scene_card_progression: ${scene.scene_card_progression ?? 'NULL'}`);
        console.log(`  real_world_context: ${scene.real_world_context ? 'HAS VALUE' : 'NULL'}`);
        console.log(`  chronological_sequence: ${scene.chronological_sequence ?? 'NULL'}`);
        console.log(`  story_sequence: ${scene.story_sequence ?? 'NULL'}`);
        console.log(`  timeline_significance: ${scene.timeline_significance ? 'HAS VALUE (' + scene.timeline_significance.length + ' chars)' : 'NULL'}`);
        console.log();
    }
}

checkFields()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
