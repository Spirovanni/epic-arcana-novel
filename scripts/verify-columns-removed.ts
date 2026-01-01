#!/usr/bin/env tsx

import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(connectionString);

async function verifyColumns() {
  console.log('🔍 Verifying removed columns do NOT exist in Neon DB...\n');
  
  const removedColumns = [
    'pov', 'tense', 'core_emotion', 'scene_tone', 'scene_number',
    'hero_journey_beat', 'hero_journey_beat_objective', 'plot_beat',
    'save_the_cat_beat', 'save_the_cat_beat_goal', 'location_details',
    'series_connections', 'task_master_key', 'major_task_group_key',
    'specific_task_group_key'
  ];
  
  const existingColumns = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'chapters'
      AND column_name = ANY(${removedColumns})
    ORDER BY column_name;
  `;
  
  if (existingColumns.length === 0) {
    console.log('✅ SUCCESS: All scene-specific columns have been removed from the database!');
    console.log(`   Verified that ${removedColumns.length} columns do NOT exist.\n`);
  } else {
    console.log(`⚠️  WARNING: ${existingColumns.length} columns still exist that should have been removed:`);
    existingColumns.forEach(col => console.log(`   - ${col.column_name}`));
    console.log('\n🔄 Re-running migration to remove these columns...\n');
    
    // Re-run the migration
    const migrationSQL = `
      ALTER TABLE chapters 
        DROP COLUMN IF EXISTS pov,
        DROP COLUMN IF EXISTS tense,
        DROP COLUMN IF EXISTS core_emotion,
        DROP COLUMN IF EXISTS scene_tone,
        DROP COLUMN IF EXISTS scene_number,
        DROP COLUMN IF EXISTS hero_journey_beat,
        DROP COLUMN IF EXISTS hero_journey_beat_objective,
        DROP COLUMN IF EXISTS plot_beat,
        DROP COLUMN IF EXISTS save_the_cat_beat,
        DROP COLUMN IF EXISTS save_the_cat_beat_goal,
        DROP COLUMN IF EXISTS location_details,
        DROP COLUMN IF EXISTS series_connections,
        DROP COLUMN IF EXISTS task_master_key,
        DROP COLUMN IF EXISTS major_task_group_key,
        DROP COLUMN IF EXISTS specific_task_group_key;
    `;
    
    await sql.unsafe(migrationSQL);
    console.log('✅ Migration re-run completed.\n');
    
    // Verify again
    const stillExisting = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'chapters'
        AND column_name = ANY(${removedColumns});
    `;
    
    if (stillExisting.length === 0) {
      console.log('✅ All columns have been successfully removed!');
    } else {
      console.log(`⚠️  ${stillExisting.length} columns still exist after migration.`);
    }
  }
  
  // Show current columns
  const allColumns = await sql`
    SELECT column_name, ordinal_position
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'chapters'
    ORDER BY ordinal_position;
  `;
  
  console.log(`\n📋 Current chapters table has ${allColumns.length} columns:`);
  allColumns.forEach(col => {
    console.log(`   ${col.ordinal_position}. ${col.column_name}`);
  });
  
  await sql.end();
  process.exit(0);
}

verifyColumns().catch(console.error);

