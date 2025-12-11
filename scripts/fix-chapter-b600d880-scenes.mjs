import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function fixChapterScenes() {
    try {
        await client.connect();
        console.log('✓ Connected to database\n');
        
        const chapterId = 'b600d880-d034-46ce-b753-fe13a4c241f5';
        
        // Load l_outline.json
        const outlineData = JSON.parse(
            readFileSync(path.join(process.cwd(), 'data/l_outline.json'), 'utf8')
        );
        
        // Find EA-001 in the outline
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
        
        const ea001Data = findChapterById(outlineData, 'EA-001');
        
        if (!ea001Data || !ea001Data.scenes) {
            throw new Error('EA-001 or its scenes not found in l_outline.json');
        }
        
        console.log(`📚 Found EA-001: ${ea001Data.specific_task_group_title}`);
        console.log(`   Scenes: ${ea001Data.scenes.length}\n`);
        
        // Delete existing scenes for this chapter
        await client.query('DELETE FROM scenes WHERE chapter_id = $1', [chapterId]);
        console.log(`🗑️  Deleted old scenes from chapter ${chapterId}\n`);
        
        // Insert new scenes
        for (const scene of ea001Data.scenes) {
            const sceneData = {
                chapter_id: chapterId,
                scene_number: scene.scene_number,
                title: scene.scene_title || scene.title,
                setup: scene.setup,
                symbolism: scene.symbolism,
                beat_goal: scene.beat_goal,
                pov: scene.pov,
                tense: scene.tense,
                core_emotion: scene.core_emotion,
                scene_tone: scene.scene_tone,
                timeline_date: scene.timeline_date,
                timeline_variant: scene.timeline_variant,
                location: scene.location,
                hero_journey_stage: scene.hero_journey_stage,
                preliminary_scene_focus: scene.preliminary_scene_focus,
                preliminary_scene_description: scene.preliminary_scene_description,
                focus: scene.focus,
                description: scene.description
            };
            
            await client.query(
                `INSERT INTO scenes (
                    chapter_id, scene_number, title, setup, symbolism, beat_goal,
                    pov, tense, core_emotion, scene_tone, timeline_date, timeline_variant,
                    location, hero_journey_stage, preliminary_scene_focus,
                    preliminary_scene_description, focus, description,
                    created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())`,
                [
                    sceneData.chapter_id,
                    sceneData.scene_number,
                    sceneData.title,
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
                    sceneData.hero_journey_stage,
                    sceneData.preliminary_scene_focus,
                    sceneData.preliminary_scene_description,
                    sceneData.focus,
                    sceneData.description
                ]
            );
            
            console.log(`✅ Inserted Scene ${scene.scene_number}: ${scene.scene_title || scene.title}`);
        }
        
        console.log(`\n✅ Successfully updated chapter ${chapterId} with ${ea001Data.scenes.length} scenes from l_outline.json!`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await client.end();
    }
}

fixChapterScenes();

