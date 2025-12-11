/**
 * Batch Sync EA-001 to EA-020 Scene Updates to Neon DB
 * 
 * This script iterates through EA-001 to EA-020 in data/l_outline.json
 * and upserts the enhanced scene data into the Neon database.
 * 
 * SCOPE:
 * - Chapters 1 to 20 (Book 1)
 * 
 * Usage: node scripts/sync-ea-001-to-020-scenes.mjs
 */

import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function syncBatchScenes() {
    try {
        await client.connect();
        console.log('✓ Connected to Neon database');

        // Load the l_outline.json file
        console.log('📖 Loading data/l_outline.json...');
        const outlineData = JSON.parse(
            readFileSync(path.join(process.cwd(), 'data/l_outline.json'), 'utf8')
        );

        console.log('\n🎯 Batch Syncing EA-001 to EA-020 scenes to database\n');

        // Helper to find chapter by ID
        function findChapterById(obj, targetId) {
            if (obj.id === targetId && (obj.scenes || obj.type === 'Specific Task Group')) {
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

        // Cache for Book IDs to avoid repeated verification queries
        const bookIdCache = {};

        async function getBookId(bookNumber) {
            if (bookIdCache[bookNumber]) return bookIdCache[bookNumber];

            const bookQuery = await client.query(
                'SELECT id FROM books WHERE book_number = $1 LIMIT 1',
                [bookNumber]
            );

            if (bookQuery.rows.length > 0) {
                bookIdCache[bookNumber] = bookQuery.rows[0].id;
                return bookIdCache[bookNumber];
            } else {
                throw new Error(`Book ${bookNumber} not found in database.`);
            }
        }

        let totalScenesUpdated = 0;
        let totalScenesInserted = 0;

        // Iterate through IDs
        for (let i = 1; i <= 20; i++) {
            const eaId = `EA-${String(i).padStart(3, '0')}`;
            console.log(`\n--------------------------------------------------`);
            console.log(`Processing ${eaId}...`);

            const eaData = findChapterById(outlineData, eaId);

            if (!eaData) {
                console.warn(`⚠️  ${eaId} not found in outline data. Skipping.`);
                continue;
            }

            const chapterTitle = eaData.specific_task_group_title || eaData.chapter_title || eaData.title;
            console.log(`📚 Found: ${chapterTitle}`);
            console.log(`   all_chapter: ${eaData.all_chapter}`);

            // Resolve Book ID
            const bookNumber = eaData.novel_book ? parseInt(eaData.novel_book) : 1;
            let bookId;
            try {
                bookId = await getBookId(bookNumber);
            } catch (e) {
                console.error(`   ❌ Error resolving Book ID for ${eaId}: ${e.message}`);
                continue;
            }

            // Upsert Chapter
            let chapterId = null;
            const chapterQuery = await client.query(
                `SELECT id, chapter_number, title FROM chapters WHERE chapter_number = $1 LIMIT 1`,
                [eaData.all_chapter]
            );

            if (chapterQuery.rows.length === 0) {
                console.log(`   Creating Chapter ${eaData.all_chapter}...`);
                const insertChapter = await client.query(
                    `INSERT INTO chapters (
                   book_id, chapter_number, unique_identifier, title, 
                   focus, specific_task_group_description, specific_task_group_tagline,
                   created_at, updated_at
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
                 RETURNING id`,
                    [
                        bookId,
                        eaData.all_chapter,
                        eaData.unique_identifier,
                        chapterTitle,
                        eaData.focus_area || eaData.focus,
                        eaData.specific_task_group_description,
                        eaData.specific_task_group_tagline
                    ]
                );
                chapterId = insertChapter.rows[0].id;
            } else {
                const chapter = chapterQuery.rows[0];
                chapterId = chapter.id;
                console.log(`   ✓ Linked to existing Chapter ID: ${chapterId}`);

                // Optional: Update title if it changed
                if (chapterTitle && chapter.title !== chapterTitle) {
                    await client.query('UPDATE chapters SET title = $1, updated_at = NOW() WHERE id = $2', [chapterTitle, chapterId]);
                    console.log(`   Updated title to: ${chapterTitle}`);
                }
            }

            // Process Scenes
            if (!eaData.scenes || eaData.scenes.length === 0) {
                console.log(`   ⚠️  No scenes found for ${eaId}.`);
                continue;
            }

            for (const scene of eaData.scenes) {
                const sceneNumber = scene.scene_number;
                const intendedTitle = scene.scene_title || scene.title || `Scene ${sceneNumber}`;

                const existingScene = await client.query(
                    'SELECT id FROM scenes WHERE chapter_id = $1 AND scene_number = $2',
                    [chapterId, sceneNumber]
                );

                // Construct Scene Data
                const sceneData = [
                    intendedTitle,
                    scene.setup || null,
                    scene.description || scene.setup || null,
                    scene.symbolism || null,
                    scene.beat_goal || null,
                    scene.pov || null,
                    scene.tense || null,
                    scene.core_emotion || null,
                    scene.scene_tone || null,
                    scene.timeline_date || null,
                    scene.timeline_variant || null,
                    scene.location || null,
                    scene.symbolism || scene.tarot_symbolism || null,
                    new Date()
                ];

                if (existingScene.rows.length > 0) {
                    // UPDATE
                    await client.query(`
                    UPDATE scenes SET
                        title = $1, setup = $2, description = $3, symbolism = $4, beat_goal = $5,
                        pov = $6, tense = $7, core_emotion = $8, scene_tone = $9,
                        timeline_date = $10, timeline_variant = $11, location = $12, tarot_symbolism = $13,
                        updated_at = $14
                    WHERE id = $15
                `, [...sceneData, existingScene.rows[0].id]);
                    totalScenesUpdated++;
                } else {
                    // INSERT
                    await client.query(`
                    INSERT INTO scenes (
                        chapter_id, scene_number, title, setup, description, symbolism, beat_goal,
                        pov, tense, core_emotion, scene_tone, timeline_date, timeline_variant, location, tarot_symbolism,
                        created_at, updated_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), $16)
                `, [chapterId, sceneNumber, ...sceneData]);
                    totalScenesInserted++;
                }
            }
            console.log(`   ✓ Synced ${eaData.scenes.length} scenes.`);
        }

        // Summary
        console.log('\n' + '='.repeat(70));
        console.log('✅ BATCH SYNC COMPLETE');
        console.log('='.repeat(70));
        console.log(`📊 Scenes updated: ${totalScenesUpdated}`);
        console.log(`📊 Scenes inserted: ${totalScenesInserted}`);
        console.log(`📝 Total processed: ${totalScenesUpdated + totalScenesInserted}`);
        console.log('='.repeat(70));

    } catch (error) {
        console.error('\n❌ Batch Sync failed:', error.message);
        if (error.detail) console.error('Detail:', error.detail);
        process.exit(1);
    } finally {
        await client.end();
        console.log('\n✓ Database connection closed');
    }
}

syncBatchScenes();
