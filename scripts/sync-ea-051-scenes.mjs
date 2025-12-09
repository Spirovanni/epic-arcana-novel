/**
 * Sync EA-051 Scene Updates to Neon DB
 * 
 * This script reads EA-051 from data/l_outline.json and upserts
 * the enhanced scene data into the Neon database.
 * 
 * Usage: node scripts/sync-ea-051-scenes.mjs
 */

import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function syncEA051Scenes() {
  try {
    await client.connect();
    console.log('✓ Connected to Neon database');
    
    // Load the l_outline.json file
    console.log('📖 Loading data/l_outline.json...');
    const outlineData = JSON.parse(
      readFileSync(path.join(process.cwd(), 'data/l_outline.json'), 'utf8')
    );
    
    console.log('\n🎯 Syncing EA-051 scenes to database\n');
    
    // Find EA-051 in the outline structure
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
    
    const ea051Data = findChapterById(outlineData, 'EA-051');
    
    if (!ea051Data) {
      throw new Error('EA-051 not found in data/l_outline.json');
    }
    
    console.log(`📚 Found EA-051: ${ea051Data.specific_task_group_title || ea051Data.title}`);
    console.log(`   Chapter Number: ${ea051Data.all_chapter}`);
    console.log(`   Novel Book: ${ea051Data.novel_book}`);
    console.log(`   Unique ID: ${ea051Data.unique_identifier}`);
    console.log(`   Scenes: ${ea051Data.scenes?.length || 0}`);
    
    if (!ea051Data.scenes || ea051Data.scenes.length === 0) {
      throw new Error('No scenes found in EA-051');
    }
    
    // Find the corresponding chapter in the database
    // Try by unique_identifier first, then by chapter_number
    let chapterQuery = await client.query(
      `SELECT id, chapter_number, title, unique_identifier 
       FROM chapters 
       WHERE unique_identifier = $1 
       LIMIT 1`,
      [ea051Data.unique_identifier]
    );
    
    if (chapterQuery.rows.length === 0) {
      console.log(`   Trying to find by chapter_number: ${ea051Data.all_chapter}`);
      chapterQuery = await client.query(
        `SELECT id, chapter_number, title, unique_identifier 
         FROM chapters 
         WHERE chapter_number = $1 
         LIMIT 1`,
        [ea051Data.all_chapter]
      );
    }
    
    if (chapterQuery.rows.length === 0) {
      throw new Error(
        `Chapter not found in database. Please create chapter ${ea051Data.all_chapter} ` +
        `(unique_id: ${ea051Data.unique_identifier}) before syncing scenes.`
      );
    }
    
    const chapter = chapterQuery.rows[0];
    console.log(`\n✓ Found chapter in database:`);
    console.log(`   DB ID: ${chapter.id}`);
    console.log(`   Chapter Number: ${chapter.chapter_number}`);
    console.log(`   Title: ${chapter.title || 'Untitled'}`);
    
    // Upsert each scene
    let scenesUpdated = 0;
    let scenesInserted = 0;
    
    console.log(`\n📝 Processing ${ea051Data.scenes.length} scenes...\n`);
    
    for (const scene of ea051Data.scenes) {
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
    console.log('\n' + '='.repeat(60));
    console.log('✅ SYNC COMPLETE');
    console.log('='.repeat(60));
    console.log(`📊 Scenes updated: ${scenesUpdated}`);
    console.log(`📊 Scenes inserted: ${scenesInserted}`);
    console.log(`📝 Total scenes synced: ${scenesUpdated + scenesInserted}`);
    console.log(`🎯 Chapter: ${chapter.chapter_number} - ${ea051Data.specific_task_group_title}`);
    console.log('='.repeat(60));
    
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
syncEA051Scenes();

