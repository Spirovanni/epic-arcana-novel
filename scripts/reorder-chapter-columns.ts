#!/usr/bin/env tsx

/**
 * SAFE Migration Script to Reorder chapters table columns
 * This will move chapter_id to appear before unique_identifier
 * 
 * WARNING: This operation recreates the table, so it requires:
 * 1. All foreign key constraints to be temporarily dropped
 * 2. Data to be copied
 * 3. Constraints to be recreated
 * 
 * BACKUP YOUR DATABASE BEFORE RUNNING THIS!
 */

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

async function reorderColumns() {
  console.log('⚠️  WARNING: This will recreate the chapters table to reorder columns.');
  console.log('⚠️  Make sure you have a database backup before proceeding!\n');
  
  try {
    // Check if chapter_id is already before unique_identifier
    const currentOrder = await sql`
      SELECT column_name, ordinal_position
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'chapters'
        AND column_name IN ('chapter_id', 'unique_identifier')
      ORDER BY ordinal_position;
    `;
    
    const chapterIdPos = currentOrder.find((r: any) => r.column_name === 'chapter_id')?.ordinal_position;
    const uniqueIdPos = currentOrder.find((r: any) => r.column_name === 'unique_identifier')?.ordinal_position;
    
    if (chapterIdPos && uniqueIdPos && chapterIdPos < uniqueIdPos) {
      console.log('✅ Column order is already correct! chapter_id appears before unique_identifier.');
      console.log(`   chapter_id position: ${chapterIdPos}`);
      console.log(`   unique_identifier position: ${uniqueIdPos}`);
      await sql.end();
      return;
    }
    
    console.log('📋 Current order:');
    console.log(`   unique_identifier: position ${uniqueIdPos}`);
    console.log(`   chapter_id: position ${chapterIdPos}`);
    console.log('\n🔄 Proceeding with column reordering...\n');
    
    // Step 1: Get all foreign key constraints that reference chapters
    console.log('📋 Step 1: Finding foreign key constraints...');
    const foreignKeys = await sql`
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'chapters';
    `;
    
    console.log(`   Found ${foreignKeys.length} foreign key constraints referencing chapters`);
    
    // Step 2: Drop foreign key constraints
    console.log('\n📋 Step 2: Dropping foreign key constraints...');
    for (const fk of foreignKeys) {
      console.log(`   Dropping constraint: ${fk.constraint_name} on ${fk.table_name}`);
      await sql.unsafe(`ALTER TABLE ${fk.table_name} DROP CONSTRAINT IF EXISTS ${fk.constraint_name};`);
    }
    
    // Step 3: Create new table with correct column order
    console.log('\n📋 Step 3: Creating new table with correct column order...');
    await sql.unsafe(`
      CREATE TABLE chapters_new (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        book_id uuid NOT NULL REFERENCES books(id),
        major_task_group_id uuid REFERENCES major_task_groups(id),
        chapter_number integer NOT NULL,
        chapter_id varchar(50),
        unique_identifier varchar(50),
        title varchar(255),
        focus varchar(255),
        epic_novel_pages varchar(50),
        epic_chapter_focus varchar(255),
        epic_novel_chapter_focus varchar(255),
        epic_novel_section_name varchar(255),
        description text,
        tarot_card_link varchar(100),
        tarot_family varchar(50),
        tarot_card_item varchar(50),
        color_theme jsonb,
        icon_path varchar(255),
        type varchar(50),
        color_name varchar(100),
        hex_code varchar(7),
        red integer,
        green integer,
        blue integer,
        focus_area varchar(100),
        connection_to_major_task_group text,
        specific_task_group_description text,
        specific_task_group_tagline varchar(255),
        specific_task_group_books_influenced_by jsonb,
        terminal_learning_objectives jsonb,
        chapter_title text,
        summary text,
        pov varchar(100),
        tense varchar(100),
        core_emotion varchar(255),
        scene_tone varchar(255),
        scene_number integer,
        hero_journey_beat varchar(255),
        hero_journey_beat_objective text,
        plot_beat varchar(255),
        save_the_cat_beat varchar(255),
        save_the_cat_beat_goal text,
        character_arcs jsonb,
        story_gaps_addressed jsonb,
        location_details jsonb,
        series_connections jsonb,
        task_master_key varchar(255),
        major_task_group_key varchar(255),
        specific_task_group_key varchar(255),
        epic_preliminary_scene_focus varchar(255),
        epic_preliminary_scene_description text,
        new_tarot_family varchar(50),
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      );
    `);
    console.log('   ✅ New table created');
    
    // Step 4: Copy data
    console.log('\n📋 Step 4: Copying data from old table to new table...');
    await sql.unsafe(`
      INSERT INTO chapters_new SELECT * FROM chapters;
    `);
    const rowCount = await sql`SELECT COUNT(*) as count FROM chapters_new`;
    console.log(`   ✅ Copied ${rowCount[0].count} rows`);
    
    // Step 5: Drop old table and rename new one
    console.log('\n📋 Step 5: Replacing old table with new table...');
    await sql.unsafe(`DROP TABLE chapters;`);
    await sql.unsafe(`ALTER TABLE chapters_new RENAME TO chapters;`);
    console.log('   ✅ Table replaced');
    
    // Step 6: Recreate foreign key constraints
    console.log('\n📋 Step 6: Recreating foreign key constraints...');
    for (const fk of foreignKeys) {
      console.log(`   Recreating constraint: ${fk.constraint_name} on ${fk.table_name}`);
      // Recreate the foreign key - you may need to adjust CASCADE settings based on your needs
      await sql.unsafe(`
        ALTER TABLE ${fk.table_name}
        ADD CONSTRAINT ${fk.constraint_name}
        FOREIGN KEY (${fk.column_name})
        REFERENCES chapters(id)
        ${fk.table_name === 'learning_resource_chapters' || 
          fk.table_name === 'connection_points' || 
          fk.table_name === 'terminal_learning_objectives' 
          ? 'ON DELETE CASCADE' : ''};
      `);
    }
    console.log('   ✅ Constraints recreated');
    
    // Step 7: Verify new order
    console.log('\n📋 Step 7: Verifying new column order...');
    const newOrder = await sql`
      SELECT column_name, ordinal_position
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'chapters'
        AND column_name IN ('chapter_id', 'unique_identifier')
      ORDER BY ordinal_position;
    `;
    
    console.log('\n✅ Migration completed successfully!');
    console.log('📋 New column order:');
    for (const col of newOrder) {
      console.log(`   ${col.column_name}: position ${col.ordinal_position}`);
    }
    
    const newChapterIdPos = newOrder.find((r: any) => r.column_name === 'chapter_id')?.ordinal_position;
    const newUniqueIdPos = newOrder.find((r: any) => r.column_name === 'unique_identifier')?.ordinal_position;
    
    if (newChapterIdPos && newUniqueIdPos && newChapterIdPos < newUniqueIdPos) {
      console.log('\n✅ SUCCESS: chapter_id now appears BEFORE unique_identifier!');
    } else {
      console.log('\n⚠️  WARNING: Column order may not be correct. Please verify manually.');
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('\n⚠️  Your database may be in an inconsistent state. Restore from backup if needed.');
    process.exit(1);
  } finally {
    await sql.end();
  }
}

reorderColumns().catch(console.error);

