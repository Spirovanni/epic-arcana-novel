import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkSequenceFields() {
    const scenes = await sql`
    SELECT 
      scene_number,
      save_the_cat_beat,
      chronological_sequence
    FROM scenes 
    WHERE chapter_id = (SELECT id FROM chapters WHERE chapter_number = 346)
    ORDER BY scene_number
  `;

    for (const scene of scenes) {
        console.log(`Scene ${scene.scene_number}:`);
        console.log(`  save_the_cat_beat: ${scene.save_the_cat_beat ? 'HAS VALUE (' + scene.save_the_cat_beat + ')' : 'NULL'}`);
        console.log(`  chronological_sequence: ${scene.chronological_sequence ?? 'NULL'}`);
        console.log();
    }
}

checkSequenceFields()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
