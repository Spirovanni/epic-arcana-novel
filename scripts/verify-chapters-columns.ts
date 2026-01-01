#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function verifyColumns() {
  console.log('🔍 Verifying chapters table columns in Neon DB...\n');
  
  try {
    // Check for removed columns
    const removedColumns = [
      'pov', 'tense', 'core_emotion', 'scene_tone', 'scene_number',
      'hero_journey_beat', 'hero_journey_beat_objective', 'plot_beat',
      'save_the_cat_beat', 'save_the_cat_beat_goal', 'location_details',
      'series_connections', 'task_master_key', 'major_task_group_key',
      'specific_task_group_key'
    ];
    
    // Check each column individually
    let found: string[] = [];
    for (const col of removedColumns) {
      const result = await db.execute(sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'chapters'
          AND column_name = ${col}
        LIMIT 1;
      `);
      if (result.rows.length > 0) {
        found.push(col);
      }
    }
    
    if (found.length === 0) {
      console.log('✅ SUCCESS: All scene-specific columns have been removed from the chapters table!');
      console.log(`   Verified removal of ${removedColumns.length} columns.\n`);
    } else {
      console.log(`⚠️  WARNING: ${found.length} columns still exist that should have been removed:`);
      found.forEach(col => console.log(`   - ${col}`));
      console.log('');
    }
    
    // List current columns to show what remains
    const allColumns = await db.execute(sql`
      SELECT column_name, data_type, ordinal_position
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'chapters'
      ORDER BY ordinal_position;
    `);
    
    console.log(`📋 Current chapters table columns (${allColumns.rows.length} total):`);
    console.log('─'.repeat(80));
    
    allColumns.rows.forEach((col: any) => {
      const marker = col.column_name === 'chapter_id' ? ' 👈' : 
                    col.column_name === 'unique_identifier' ? ' 👈' : '';
      console.log(`${String(col.ordinal_position).padStart(3)}. ${col.column_name.padEnd(35)} (${col.data_type})${marker}`);
    });
    
    console.log('─'.repeat(80));
    
    // Verify chapter_id and unique_identifier positions
    const chapterIdCol = allColumns.rows.find((c: any) => c.column_name === 'chapter_id');
    const uniqueIdCol = allColumns.rows.find((c: any) => c.column_name === 'unique_identifier');
    
    if (chapterIdCol && uniqueIdCol) {
      console.log(`\n📊 Column Positions:`);
      console.log(`   chapter_id: position ${chapterIdCol.ordinal_position}`);
      console.log(`   unique_identifier: position ${uniqueIdCol.ordinal_position}`);
      
      if (chapterIdCol.ordinal_position < uniqueIdCol.ordinal_position) {
        console.log(`   ✅ chapter_id appears BEFORE unique_identifier in schema definition`);
        console.log(`   ℹ️  Note: Physical DB order may differ, but schema order is what matters`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error verifying columns:', error);
    process.exit(1);
  }
}

verifyColumns().catch(console.error);

