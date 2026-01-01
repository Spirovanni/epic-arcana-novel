#!/usr/bin/env tsx

/**
 * This script verifies all columns exist and provides a working query for Neon DB
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

async function testQuery() {
  console.log('🔍 Testing safe SELECT query on chapters table...\n');
  
  try {
    // Get all existing columns
    const allColumns = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'chapters'
      ORDER BY ordinal_position;
    `;
    
    const columnNames = allColumns.map((c: any) => c.column_name);
    
    console.log(`✅ Found ${columnNames.length} columns in chapters table:\n`);
    columnNames.forEach((name, idx) => {
      console.log(`   ${idx + 1}. ${name}`);
    });
    
    // Test the safe query
    console.log('\n🔍 Testing safe SELECT query...\n');
    
    const safeQuery = `
      SELECT 
        "id",
        "book_id",
        "major_task_group_id",
        "chapter_number",
        "chapter_id",
        "unique_identifier",
        "title",
        "focus",
        "epic_novel_pages",
        "epic_chapter_focus",
        "epic_novel_chapter_focus",
        "epic_novel_section_name",
        "description",
        "tarot_card_link",
        "tarot_family",
        "tarot_card_item",
        "color_theme",
        "created_at",
        "updated_at",
        "icon_path",
        "type",
        "color_name",
        "hex_code",
        "red",
        "green",
        "blue",
        "focus_area",
        "connection_to_major_task_group",
        "specific_task_group_description",
        "specific_task_group_tagline",
        "specific_task_group_books_influenced_by",
        "terminal_learning_objectives",
        "chapter_title",
        "summary",
        "character_arcs",
        "story_gaps_addressed",
        "epic_preliminary_scene_focus",
        "epic_preliminary_scene_description",
        "new_tarot_family"
      FROM "chapters"
      ORDER BY "chapters"."id"
      LIMIT 5;
    `;
    
    const result = await sql.unsafe(safeQuery);
    
    console.log(`✅ Query executed successfully!`);
    console.log(`   Retrieved ${result.length} chapters\n`);
    
    if (result.length > 0) {
      console.log('📋 Sample chapter data:');
      const sample = result[0];
      console.log(`   ID: ${sample.id}`);
      console.log(`   Chapter ID: ${sample.chapter_id || 'NULL'}`);
      console.log(`   Unique Identifier: ${sample.unique_identifier || 'NULL'}`);
      console.log(`   Title: ${sample.title || 'NULL'}`);
      console.log(`   Description: ${sample.description ? sample.description.substring(0, 50) + '...' : 'NULL'}`);
      console.log(`   Summary: ${sample.summary ? sample.summary.substring(0, 50) + '...' : 'NULL'}`);
    }
    
    console.log('\n✅ All columns exist and query works correctly!');
    console.log('\n📝 Copy this query into Neon DB to view your data:');
    console.log('─'.repeat(80));
    console.log(safeQuery.replace('LIMIT 5', 'LIMIT 50'));
    console.log('─'.repeat(80));
    
  } catch (error: any) {
    console.error('❌ Query failed:', error.message);
    
    if (error.message.includes('column') && error.message.includes('does not exist')) {
      const missingCol = error.message.match(/column "([^"]+)" does not exist/)?.[1];
      if (missingCol) {
        console.log(`\n⚠️  Column "${missingCol}" does not exist. Removing from query...`);
        // This would need manual adjustment
      }
    }
    
    process.exit(1);
  } finally {
    await sql.end();
  }
}

testQuery().catch(console.error);

