#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function checkColumnOrder() {
  console.log('🔍 Checking chapters table column order...\n');
  
  try {
    const result = await db.execute(sql`
      SELECT column_name, ordinal_position, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'chapters'
      ORDER BY ordinal_position;
    `);
    
    const columns = result.rows as Array<{ column_name: string; ordinal_position: number; data_type: string }>;
    
    console.log('📋 Chapters table columns (in order):');
    console.log('─'.repeat(80));
    
    let chapterIdPosition = -1;
    let uniqueIdentifierPosition = -1;
    
    columns.forEach((col, index) => {
      const marker = col.column_name === 'chapter_id' ? ' 👈' : 
                    col.column_name === 'unique_identifier' ? ' 👈' : '';
      console.log(`${String(index + 1).padStart(3)}. ${col.column_name.padEnd(30)} (${col.data_type})${marker}`);
      
      if (col.column_name === 'chapter_id') {
        chapterIdPosition = col.ordinal_position;
      }
      if (col.column_name === 'unique_identifier') {
        uniqueIdentifierPosition = col.ordinal_position;
      }
    });
    
    console.log('─'.repeat(80));
    
    if (chapterIdPosition !== -1 && uniqueIdentifierPosition !== -1) {
      if (chapterIdPosition < uniqueIdentifierPosition) {
        console.log('\n✅ Column order is CORRECT: `chapter_id` appears BEFORE `unique_identifier`');
        console.log(`   chapter_id position: ${chapterIdPosition}`);
        console.log(`   unique_identifier position: ${uniqueIdentifierPosition}`);
      } else {
        console.log('\n⚠️  Column order issue: `chapter_id` appears AFTER `unique_identifier`');
        console.log(`   chapter_id position: ${chapterIdPosition}`);
        console.log(`   unique_identifier position: ${uniqueIdentifierPosition}`);
        console.log('\n📝 To fix this, you would need to create a migration to reorder columns.');
        console.log('   However, column order in PostgreSQL doesn\'t affect functionality.');
      }
    } else {
      console.log('\n⚠️  Could not find both columns in the table.');
    }
    
  } catch (error) {
    console.error('❌ Error checking column order:', error);
    process.exit(1);
  }
}

checkColumnOrder().catch(console.error);

