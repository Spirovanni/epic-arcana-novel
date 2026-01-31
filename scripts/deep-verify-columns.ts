import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function deepVerify() {
    console.log('🔍 Deep verifiction of sequence columns...\n');

    // 1. Check if columns exist in information_schema
    const columns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'scenes' 
    AND column_name IN ('save_the_cat_beat', 'chronological_sequence');
  `;

    console.log('📋 Schema check:');
    if (columns.length === 0) {
        console.error('❌ Columns DO NOT EXIST in the schema!');
    } else {
        columns.forEach(c => console.log(`   ✓ ${c.column_name} (${c.data_type}) exists`));
    }
    console.log();

    // 2. Check values for EA-346
    const rows = await sql`
    SELECT scene_number, save_the_cat_beat, chronological_sequence 
    FROM scenes 
    JOIN chapters ON scenes.chapter_id = chapters.id
    WHERE chapters.chapter_number = 346
    ORDER BY scene_number;
  `;

    console.log('📊 Value check for EA-346:');
    rows.forEach(r => {
        console.log(`   Scene ${r.scene_number}:`);
        console.log(`     save_the_cat_beat: ${r.save_the_cat_beat}`);
        console.log(`     chronological_sequence: ${r.chronological_sequence}`);
    });
}

deepVerify()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
