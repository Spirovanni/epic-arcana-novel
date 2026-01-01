#!/usr/bin/env tsx

import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(connectionString);

async function removeColumns() {
  console.log('🗑️  Removing scene-specific columns from chapters table...\n');
  
  try {
    // Check which columns currently exist
    console.log('📋 Checking existing columns...');
    const existingColumns = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'chapters'
        AND column_name IN (
          'pov', 'tense', 'core_emotion', 'scene_tone', 'scene_number',
          'hero_journey_beat', 'hero_journey_beat_objective', 'plot_beat',
          'save_the_cat_beat', 'save_the_cat_beat_goal', 'location_details',
          'series_connections', 'task_master_key', 'major_task_group_key',
          'specific_task_group_key'
        )
      ORDER BY column_name;
    `;
    
    const columnsToRemove = existingColumns.map((row: any) => row.column_name);
    
    if (columnsToRemove.length === 0) {
      console.log('✅ All scene-specific columns have already been removed from chapters table.');
      await sql.end();
      return;
    }
    
    console.log(`📋 Found ${columnsToRemove.length} columns to remove:`);
    columnsToRemove.forEach(col => console.log(`   - ${col}`));
    console.log('');
    
    // Read and execute the migration
    const migrationPath = resolve(__dirname, '../drizzle/0020_remove_scene_fields_from_chapters.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    console.log('🔄 Executing migration...');
    await sql.unsafe(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log(`   Removed ${columnsToRemove.length} scene-specific columns from chapters table.`);
    
    // Verify columns were removed
    console.log('\n📋 Verifying removal...');
    const remainingColumns = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'chapters'
        AND column_name IN (
          'pov', 'tense', 'core_emotion', 'scene_tone', 'scene_number',
          'hero_journey_beat', 'hero_journey_beat_objective', 'plot_beat',
          'save_the_cat_beat', 'save_the_cat_beat_goal', 'location_details',
          'series_connections', 'task_master_key', 'major_task_group_key',
          'specific_task_group_key'
        );
    `;
    
    if (remainingColumns.length === 0) {
      console.log('✅ All scene-specific columns have been successfully removed!');
    } else {
      console.log(`⚠️  Warning: ${remainingColumns.length} columns still remain:`);
      remainingColumns.forEach((col: any) => console.log(`   - ${col.column_name}`));
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

removeColumns().catch(console.error);

