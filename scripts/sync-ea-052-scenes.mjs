/**
 * Sync EA-052 Scene Updates to Neon DB
 * 
 * This script reads EA-052 from data/l_outline.json and upserts
 * the enhanced scene data into the Neon database.
 * 
 * CHAPTER NUMBERING:
 * - all_chapter (52) → DB chapter_number (52) [absolute chapter in series]
 * - novel_book (2) → DB book_id (Book 2) [book association]
 * - chapter ("Chapter 12") → Book 2's 12th chapter
 * 
 * Usage: node scripts/sync-ea-052-scenes.mjs
 */

import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function syncEA052Scenes() {
  try {
    await client.connect();
    console.log('✓ Connected to Neon database');
    
    // Load the l_outline.json file
    console.log('📖 Loading data/l_outline.json...');
    const outlineData = JSON.parse(
      readFileSync(path.join(process.cwd(), 'data/l_outline.json'), 'utf8')
    );
    
    console.log('\n🎯 Syncing EA-052 scenes to database\n');
    
    // Find EA-052 in the outline structure
    function findChapterById(obj, targetId) {
      if (obj.id === targetId && obj.scenes) {
        return obj;
      }
      
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          const result = findChapterById(obj[key], targetId);
          if (result) return result;
        }
      }
      return null;
    }
    
    const ea052Data = findChapterById(outlineData, 'EA-052');
    
    if (!ea052Data) {
      throw new Error('EA-052 not found in data/l_outline.json');
    }
    
    console.log(`📚 Found EA-052: ${ea052Data.specific_task_group_title || ea052Data.title}`);
    console.log(`   all_chapter (absolute): ${ea052Data.all_chapter}`);
    console.log(`   novel_book: ${ea052Data.novel_book}`);
    console.log(`   chapter (book-relative): ${ea052Data.chapter}`);
    console.log(`   unique_identifier: ${ea052Data.unique_identifier}`);
    console.log(`   Scenes: ${ea052Data.scenes?.length || 0}`);
    
    if (!ea052Data.scenes || ea052Data.scenes.length === 0) {
      throw new Error('No scenes found in EA-052');
    }
    
    // Find the corresponding chapter in the database
    // Search by chapter_number (which should equal all_chapter = 52)
    console.log(`\n🔍 Searching for chapter in database...`);
    console.log(`   Looking for chapter_number = ${ea052Data.all_chapter} (from all_chapter field)`);
    
    let chapterQuery = await client.query(
      `SELECT id, chapter_number, book_id, title, unique_identifier 
       FROM chapters 
       WHERE chapter_number = $1 
       LIMIT 1`,
      [ea052Data.all_chapter]
    );
    
    // If not found by chapter_number, try by unique_identifier as fallback
    if (chapterQuery.rows.length === 0 && ea052Data.unique_identifier) {
      console.log(`   Not found by chapter_number, trying unique_identifier: ${ea052Data.unique_identifier}`);
      chapterQuery = await client.query(
        `SELECT id, chapter_number, book_id, title, unique_identifier 
         FROM chapters 
         WHERE unique_identifier = $1 
         LIMIT 1`,
        [ea052Data.unique_identifier]
      );
    }
    
    if (chapterQuery.rows.length === 0) {
      throw new Error(
        `Chapter not found in database.\n` +
        `  Expected: chapter_number = ${ea052Data.all_chapter} (from all_chapter)\n` +
        `  Or: unique_identifier = '${ea052Data.unique_identifier}'\n` +
        `  Please ensure the chapter exists before syncing scenes.`
      );
    }
    
    const chapter = chapterQuery.rows[0];
    console.log(`\n✓ Found chapter in database:`);
    console.log(`   DB chapter_number: ${chapter.chapter_number} ${chapter.chapter_number === ea052Data.all_chapter ? '✓' : '⚠️ MISMATCH'}`);
    console.log(`   DB unique_identifier: ${chapter.unique_identifier || 'N/A'}`);
    console.log(`   DB title: ${chapter.title || 'Untitled'}`);
    console.log(`   DB id: ${chapter.id}`);
    
    // Verify chapter_number matches all_chapter
    if (chapter.chapter_number !== ea052Data.all_chapter) {
      console.log(`\n⚠️  WARNING: Database chapter_number (${chapter.chapter_number}) doesn't match all_chapter (${ea052Data.all_chapter})`);
      console.log(`   The chapter may need to be updated with the correct absolute chapter number.`);
    }
    
    // Get Book 2 ID to verify book association
    const book2Query = await client.query(
      'SELECT id, book_number FROM books WHERE book_number = 2 LIMIT 1'
    );
    
    if (book2Query.rows.length > 0) {
      const book2Id = book2Query.rows[0].id;
      console.log(`\n📖 Book 2 ID: ${book2Id}`);
      if (chapter.book_id !== book2Id) {
        console.log(`   ⚠️  WARNING: Chapter's book_id doesn't match Book 2`);
      } else {
        console.log(`   ✓ Chapter correctly associated with Book 2`);
      }
    }
    
    // Upsert each scene
    let scenesUpdated = 0;
    let scenesInserted = 0;
    
    console.log(`\n📝 Processing ${ea052Data.scenes.length} scenes...\n`);
    
    for (const scene of ea052Data.scenes) {
      const sceneNumber = scene.scene_number;
      const sceneTitle = scene.scene_title || scene.title || `Scene ${sceneNumber}`;
      
      console.log(`   Scene ${sceneNumber}: ${sceneTitle}`);
      
      // Check if scene exists
      const existingScene = await client.query(
        'SELECT id FROM scenes WHERE chapter_id = $1 AND scene_number = $2',
        [chapter.id, sceneNumber]
      );
      
      const sceneData = {
        chapter_id: chapter.id,
        scene_number: sceneNumber,
        title: scene.title || scene.scene_title || `Scene ${sceneNumber}`,
        scene_title: scene.scene_title || scene.title || null,
        setup: scene.setup || null,
        symbolism: scene.symbolism || null,
        beat_goal: scene.beat_goal || null,
        pov: scene.pov || null,
        tense: scene.tense || null,
        core_emotion: scene.core_emotion || null,
        scene_tone: scene.scene_tone || null,
        timeline_date: scene.timeline_date || null,
        timeline_variant: scene.timeline_variant || null,
        location: scene.location || null,
        description: scene.setup || scene.description || null,
        tarot_symbolism: scene.symbolism || null,
        updated_at: new Date()
      };
      
      if (existingScene.rows.length > 0) {
        // UPDATE existing scene
        const sceneId = existingScene.rows[0].id;
        
        await client.query(`
          UPDATE scenes SET
            title = $1,
            scene_title = $2,
            setup = $3,
            symbolism = $4,
            beat_goal = $5,
            pov = $6,
            tense = $7,
            core_emotion = $8,
            scene_tone = $9,
            timeline_date = $10,
            timeline_variant = $11,
            location = $12,
            description = $13,
            tarot_symbolism = $14,
            updated_at = $15
          WHERE id = $16
        `, [
          sceneData.title,
          sceneData.scene_title,
          sceneData.setup,
          sceneData.symbolism,
          sceneData.beat_goal,
          sceneData.pov,
          sceneData.tense,
          sceneData.core_emotion,
          sceneData.scene_tone,
          sceneData.timeline_date,
          sceneData.timeline_variant,
          sceneData.location,
          sceneData.description,
          sceneData.tarot_symbolism,
          sceneData.updated_at,
          sceneId
        ]);
        
        scenesUpdated++;
        console.log(`      ✓ Updated`);
        
      } else {
        // INSERT new scene
        await client.query(`
          INSERT INTO scenes (
            chapter_id, scene_number, title, scene_title, setup, symbolism,
            beat_goal, pov, tense, core_emotion, scene_tone, timeline_date,
            timeline_variant, location, description, tarot_symbolism,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        `, [
          sceneData.chapter_id,
          sceneData.scene_number,
          sceneData.title,
          sceneData.scene_title,
          sceneData.setup,
          sceneData.symbolism,
          sceneData.beat_goal,
          sceneData.pov,
          sceneData.tense,
          sceneData.core_emotion,
          sceneData.scene_tone,
          sceneData.timeline_date,
          sceneData.timeline_variant,
          sceneData.location,
          sceneData.description,
          sceneData.tarot_symbolism,
          new Date(),
          sceneData.updated_at
        ]);
        
        scenesInserted++;
        console.log(`      ✓ Inserted`);
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('✅ SYNC COMPLETE');
    console.log('='.repeat(70));
    console.log(`📊 Scenes updated: ${scenesUpdated}`);
    console.log(`📊 Scenes inserted: ${scenesInserted}`);
    console.log(`📝 Total scenes synced: ${scenesUpdated + scenesInserted}`);
    console.log(`🎯 Chapter: ${chapter.chapter_number} (Book 2, Ch 12) - ${ea052Data.specific_task_group_title}`);
    console.log(`   Absolute chapter: ${ea052Data.all_chapter}`);
    console.log(`   Book-relative: ${ea052Data.novel_book}, ${ea052Data.chapter}`);
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✓ Database connection closed');
  }
}

// Run the sync
syncEA052Scenes();

