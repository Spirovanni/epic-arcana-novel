/**
 * Sync EA-055 Scene Updates to Neon DB
 * 
 * This script reads EA-055 from data/l_outline.json and upserts
 * the enhanced scene data into the Neon database.
 * 
 * CHAPTER NUMBERING:
 * - all_chapter (55) → DB chapter_number (55) [absolute chapter in series]
 * - novel_book (2) → DB book_id (Book 2) [book association]
 * - chapter ("Chapter 15") → Book 2's 15th chapter
 * 
 * Usage: node scripts/sync-ea-055-scenes.mjs
 */

import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function syncEA055Scenes() {
    try {
        await client.connect();
        console.log('✓ Connected to Neon database');

        // Load the l_outline.json file
        console.log('📖 Loading data/l_outline.json...');
        const outlineData = JSON.parse(
            readFileSync(path.join(process.cwd(), 'data/l_outline.json'), 'utf8')
        );

        console.log('\n🎯 Syncing EA-055 scenes to database\n');

        // Find EA-055 in the outline structure
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

        const ea055Data = findChapterById(outlineData, 'EA-055');

        if (!ea055Data) {
            throw new Error('EA-055 not found in data/l_outline.json');
        }

        console.log(`📚 Found EA-055: ${ea055Data.specific_task_group_title || ea055Data.title}`);
        console.log(`   all_chapter (absolute): ${ea055Data.all_chapter}`);
        console.log(`   novel_book: ${ea055Data.novel_book}`);
        console.log(`   chapter (book-relative): ${ea055Data.chapter}`);
        console.log(`   unique_identifier: ${ea055Data.unique_identifier}`);
        console.log(`   Scenes: ${ea055Data.scenes?.length || 0}`);

        if (!ea055Data.scenes || ea055Data.scenes.length === 0) {
            throw new Error('No scenes found in EA-055');
        }

        // Get Book 2 ID first
        const book2Query = await client.query(
            'SELECT id, book_number FROM books WHERE book_number = 2 LIMIT 1'
        );

        let book2Id = null;
        if (book2Query.rows.length > 0) {
            book2Id = book2Query.rows[0].id;
            console.log(`\n📖 Book 2 ID resolves to: ${book2Id}`);
        } else {
            throw new Error('Book 2 not found in database. Cannot associate chapter.');
        }

        // Upsert Chapter
        console.log(`\n🔍 Ensuring chapter exists in database...`);
        // Attempt to find by chapter_number first
        let chapterQuery = await client.query(
            `SELECT id, chapter_number, book_id, title, unique_identifier 
       FROM chapters 
       WHERE chapter_number = $1 
       LIMIT 1`,
            [ea055Data.all_chapter]
        );

        let chapterId = null;

        if (chapterQuery.rows.length === 0) {
            console.log(`   Chapter ${ea055Data.all_chapter} not found. Creating it...`);
            const insertChapter = await client.query(
                `INSERT INTO chapters (
           book_id, chapter_number, unique_identifier, title, 
           focus, specific_task_group_description, specific_task_group_tagline,
           created_at, updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING id`,
                [
                    book2Id,
                    ea055Data.all_chapter,
                    ea055Data.unique_identifier,
                    ea055Data.specific_task_group_title,
                    ea055Data.focus_area,
                    ea055Data.specific_task_group_description,
                    ea055Data.specific_task_group_tagline
                ]
            );
            chapterId = insertChapter.rows[0].id;
            console.log(`   ✓ Created Chapter ID: ${chapterId}`);
        } else {
            const chapter = chapterQuery.rows[0];
            chapterId = chapter.id;
            console.log(`   ✓ Found existing Chapter ID: ${chapterId}`);

            // Optional: Update chapter metadata if needed (not strictly required by prompt but good for sync)
            if (chapter.title !== ea055Data.specific_task_group_title) {
                console.log(`   Updating chapter title: ${ea055Data.specific_task_group_title}`);
                await client.query(
                    `UPDATE chapters SET 
               title = $1, 
               unique_identifier = $2,
               focus = $3,
               specific_task_group_description = $4,
               updated_at = NOW()
             WHERE id = $5`,
                    [
                        ea055Data.specific_task_group_title,
                        ea055Data.unique_identifier,
                        ea055Data.focus_area,
                        ea055Data.specific_task_group_description,
                        chapterId
                    ]
                );
            }
        }

        // Upsert each scene
        let scenesUpdated = 0;
        let scenesInserted = 0;

        console.log(`\n📝 Processing ${ea055Data.scenes.length} scenes...\n`);

        for (const scene of ea055Data.scenes) {
            const sceneNumber = scene.scene_number;
            // Map 'title' in DB to 'scene_title' from JSON, fallback to 'title'
            const intendedTitle = scene.scene_title || scene.title || `Scene ${sceneNumber}`;

            console.log(`   Scene ${sceneNumber}: ${intendedTitle}`);

            // Check if scene exists
            const existingScene = await client.query(
                'SELECT id FROM scenes WHERE chapter_id = $1 AND scene_number = $2',
                [chapterId, sceneNumber]
            );

            const sceneData = {
                chapter_id: chapterId,
                scene_number: sceneNumber,
                title: intendedTitle,
                // Using 'description' column for setup/description content as per common schema usage or 'setup' if supported
                // Migration 0006 added 'setup', so we use it. We also use 'description' as fallback or mapped to description field.
                setup: scene.setup || null,
                description: scene.description || scene.setup || null, // Fill description with setup if description missing, as setup is main content often
                symbolism: scene.symbolism || null,
                beat_goal: scene.beat_goal || null,
                pov: scene.pov || null,
                tense: scene.tense || null,
                core_emotion: scene.core_emotion || null,
                scene_tone: scene.scene_tone || null,
                timeline_date: scene.timeline_date || null,
                timeline_variant: scene.timeline_variant || null,
                location: scene.location || null,
                tarot_symbolism: scene.symbolism || null, // Map symbolism to tarot_symbolism as well if needed, or keep distinct
                updated_at: new Date()
            };

            if (existingScene.rows.length > 0) {
                // UPDATE existing scene
                const sceneId = existingScene.rows[0].id;

                await client.query(`
          UPDATE scenes SET
            title = $1,
            setup = $2,
            description = $3,
            symbolism = $4,
            beat_goal = $5,
            pov = $6,
            tense = $7,
            core_emotion = $8,
            scene_tone = $9,
            timeline_date = $10,
            timeline_variant = $11,
            location = $12,
            tarot_symbolism = $13,
            updated_at = $14
          WHERE id = $15
        `, [
                    sceneData.title,
                    sceneData.setup,
                    sceneData.description,
                    sceneData.symbolism,
                    sceneData.beat_goal,
                    sceneData.pov,
                    sceneData.tense,
                    sceneData.core_emotion,
                    sceneData.scene_tone,
                    sceneData.timeline_date,
                    sceneData.timeline_variant,
                    sceneData.location,
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
            chapter_id, 
            scene_number, 
            title, 
            setup, 
            description, 
            symbolism,
            beat_goal, 
            pov, 
            tense, 
            core_emotion, 
            scene_tone, 
            timeline_date,
            timeline_variant, 
            location, 
            tarot_symbolism,
            created_at, 
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        `, [
                    sceneData.chapter_id,
                    sceneData.scene_number,
                    sceneData.title,
                    sceneData.setup,
                    sceneData.description,
                    sceneData.symbolism,
                    sceneData.beat_goal,
                    sceneData.pov,
                    sceneData.tense,
                    sceneData.core_emotion,
                    sceneData.scene_tone,
                    sceneData.timeline_date,
                    sceneData.timeline_variant,
                    sceneData.location,
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
        console.log(`🎯 Chapter: ${ea055Data.all_chapter} (Book 2, Ch 15) - ${ea055Data.specific_task_group_title}`);
        console.log('='.repeat(70));

    } catch (error) {
        console.error('\n❌ Sync failed:', error.message);
        if (error.detail) console.error('Detail:', error.detail);
        process.exit(1);
    } finally {
        await client.end();
        console.log('\n✓ Database connection closed');
    }
}

// Run the sync
syncEA055Scenes();
