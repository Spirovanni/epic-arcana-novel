import { Pool } from 'pg';
import * as fs from 'fs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface SceneMetadata {
  hero_journey_stage?: string;
  save_the_cat_beat?: string;
  preliminary_scene_focus?: string;
  preliminary_scene_description?: string;
  sudowrite_pov_guidance?: string;
  sudowrite_tone_guidance?: string;
  sudowrite_pacing_guidance?: string;
  sudowrite_sensory_focus?: string;
  sudowrite_character_moments?: string[];
  learning_objective_integration?: string;
  sudowrite_target_length?: string;
  sudowrite_key_challenge?: string;
  chapter_scene_focus?: string;
  foreshadowing_elements?: string[];
  narrative_function?: string;
  series_connection_resonance?: string;
}

async function syncScenesMetadata() {
  try {
    // Read the outline file
    const outlineData = JSON.parse(
      fs.readFileSync('/Users/xaviermartinez/dev/cursor/epic-arcana-novel/data/l_outline.json', 'utf-8')
    );

    const client = await pool.connect();
    let updatedCount = 0;

    // Navigate to Book 1, task_master_1 and task_master_2
    const book1 = outlineData.SelfImprovementSeries.Books.trilogies['1st_trilogy'].trilogy_books.Book1;
    
    // Process task_master_1 (Chapters 1-4)
    const taskMaster1 = book1.task_masters.task_master_1.major_task_groups;
    
    // Process task_master_2 (Chapters 5-6 and beyond)
    const taskMaster2 = book1.task_masters.task_master_2.major_task_groups;

    // Helper function to sync a scene
    async function syncScene(chapterNum: number, scene: any, client: any) {
      const sceneNumber = scene.scene_number;
      const sceneTitle = scene.scene_title || scene.title;

      // Get chapter ID from database (Book 1 only)
      const chapterResult = await client.query(
        'SELECT id FROM chapters WHERE chapter_number = $1 AND book_id = (SELECT id FROM books WHERE book_number = 1) LIMIT 1',
        [chapterNum]
      );

      if (chapterResult.rows.length === 0) {
        console.log(`  ⚠ Chapter ${chapterNum} not found in database, skipping`);
        return 0;
      }

      const chapterId = chapterResult.rows[0].id;

      // Check if scene exists
      const sceneResult = await client.query(
        'SELECT id FROM scenes WHERE chapter_id = $1 AND scene_number = $2',
        [chapterId, sceneNumber]
      );

      // Build sudowrite metadata object
      const sudowriteMetadata: SceneMetadata = {
        sudowrite_pov_guidance: scene.sudowrite_pov_guidance,
        sudowrite_tone_guidance: scene.sudowrite_tone_guidance,
        sudowrite_pacing_guidance: scene.sudowrite_pacing_guidance,
        sudowrite_sensory_focus: scene.sudowrite_sensory_focus,
        sudowrite_character_moments: scene.sudowrite_character_moments,
        sudowrite_target_length: scene.sudowrite_target_length,
        sudowrite_key_challenge: scene.sudowrite_key_challenge,
      };

      // Build foreshadowing elements
      const foreshadowing = scene.foreshadowing_elements || [];

      if (sceneResult.rows.length > 0) {
        // Update existing scene
        const sceneId = sceneResult.rows[0].id;
        await client.query(
          `UPDATE scenes SET
            save_the_cat_beat = $1,
            preliminary_scene_focus = $2,
            preliminary_scene_description = $3,
            hero_journey_stage = $4,
            sudowrite_metadata = $5,
            learning_objectives = $6,
            foreshadowing_elements = $7,
            narrative_function = $8,
            series_connection_resonance = $9,
            chapter_scene_focus = $10,
            updated_at = NOW()
          WHERE id = $11`,
          [
            scene.save_the_cat_beat,
            scene.preliminary_scene_focus,
            scene.preliminary_scene_description,
            scene.hero_journey_stage,
            JSON.stringify(sudowriteMetadata),
            JSON.stringify(scene.learning_objectives || { integration: scene.learning_objective_integration }),
            JSON.stringify(foreshadowing),
            scene.narrative_function,
            scene.series_connection_resonance,
            scene.chapter_scene_focus,
            sceneId,
          ]
        );
        console.log(`  ✓ Updated Scene ${sceneNumber}: ${sceneTitle}`);
        return 1;
      } else {
        // Insert new scene if it doesn't exist
        await client.query(
          `INSERT INTO scenes (
            chapter_id, scene_number, title, focus,
            save_the_cat_beat, preliminary_scene_focus, preliminary_scene_description,
            hero_journey_stage, sudowrite_metadata, learning_objectives,
            foreshadowing_elements, narrative_function, series_connection_resonance,
            chapter_scene_focus, pov, tense, core_emotion, scene_tone, setup, symbolism, beat_goal,
            timeline_date, timeline_variant, location
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
          ) RETURNING id`,
          [
            chapterId, sceneNumber, sceneTitle, scene.focus || sceneTitle,
            scene.save_the_cat_beat, scene.preliminary_scene_focus, scene.preliminary_scene_description,
            scene.hero_journey_stage, JSON.stringify(sudowriteMetadata),
            JSON.stringify(scene.learning_objectives || { integration: scene.learning_objective_integration }),
            JSON.stringify(foreshadowing), scene.narrative_function, scene.series_connection_resonance,
            scene.chapter_scene_focus, scene.pov, scene.tense, scene.core_emotion, scene.scene_tone,
            scene.setup, scene.symbolism, scene.beat_goal, scene.timeline_date, scene.timeline_variant, scene.location,
          ]
        );
        console.log(`  ✓ Inserted Scene ${sceneNumber}: ${sceneTitle}`);
        return 1;
      }
    }

    // Process chapters 1-13 from task_master_1
    for (const mtgKey in taskMaster1) {
      // Handle regular major_task_groups (Chapters 1-12)
      if (mtgKey !== 'major_activity_theme_1') {
        const majorGroup = taskMaster1[mtgKey];

        for (const stgKey in majorGroup.Specific_task_groups) {
          const specificGroup = majorGroup.Specific_task_groups[stgKey];
          const chapterNum = specificGroup.all_chapter;
          const title = specificGroup.title;
          const scenesList = specificGroup.scenes || [];

          console.log(`\nProcessing Chapter ${chapterNum} (${title})`);

          for (const scene of scenesList) {
            updatedCount += await syncScene(chapterNum, scene, client);
          }
        }
      } else {
        // Handle Chapter 13 (major_activity_theme_1)
        const chapter13 = taskMaster1[mtgKey];
        const chapterNum = chapter13.all_chapter;
        const title = chapter13.title;
        const scenesList = chapter13.scenes || [];

        console.log(`\nProcessing Chapter ${chapterNum} (${title})`);

        for (const scene of scenesList) {
          updatedCount += await syncScene(chapterNum, scene, client);
        }
      }
    }

    // Process task_master_2 (Chapters 14+)
    for (const mtgKey in taskMaster2) {
      if (mtgKey === 'major_activity_theme_2') continue;

      const majorGroup = taskMaster2[mtgKey];
      for (const stgKey in majorGroup.Specific_task_groups) {
        const specificGroup = majorGroup.Specific_task_groups[stgKey];
        const chapterNum = specificGroup.all_chapter;
        const title = specificGroup.title;
        const scenesList = specificGroup.scenes || [];

        console.log(`\nProcessing Chapter ${chapterNum} (${title})`);

        for (const scene of scenesList) {
          updatedCount += await syncScene(chapterNum, scene, client);
        }
      }
    }

    client.release();

    console.log(`\n✅ Successfully synced ${updatedCount} scenes to database!`);
    process.exit(0);
  } catch (error) {
    console.error('Error syncing scenes:', error);
    process.exit(1);
  }
}

syncScenesMetadata();
