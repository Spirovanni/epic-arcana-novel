import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkPreliminaryFields() {
    const scenes = await sql`
    SELECT 
      scene_number,
      preliminary_scene_focus,
      preliminary_scene_description
    FROM scenes 
    WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 346)
    ORDER BY scene_number
  `;

    for (const scene of scenes) {
        console.log(`Scene ${scene.scene_number}:`);
        console.log(`  preliminary_scene_focus: ${scene.preliminary_scene_focus ? 'HAS VALUE (' + scene.preliminary_scene_focus.length + ' chars)' : 'NULL'}`);
        console.log(`  preliminary_scene_description: ${scene.preliminary_scene_description ? 'HAS VALUE (' + scene.preliminary_scene_description.length + ' chars)' : 'NULL'}`);
        console.log();
    }
}

checkPreliminaryFields()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
