import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eaId = 'EA-345';
const chapterNumber = 345;

async function main() {
  console.log(`📝 Injecting enhanced scenes for ${eaId}...`);

  const enhancedScenesPath = path.join(__dirname, `ea-${chapterNumber}-enhanced-scenes.json`);
  const enhancedScenes = JSON.parse(fs.readFileSync(enhancedScenesPath, 'utf-8'));
  console.log(`\n✅ Loaded ${enhancedScenes.length} enhanced scenes`);

  const outlinePath = path.join(__dirname, '../data/l_outline.json');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  function findAndUpdate(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return false;

    if (obj.id === eaId) {
      console.log(`\n✅ Found ${eaId}: ${obj.specific_task_group_title || obj.title}`);
      console.log(`   Existing scenes: ${obj.scenes?.length || 0}`);
      obj.scenes = enhancedScenes;
      console.log(`\n✅ Replaced with ${enhancedScenes.length} enhanced scenes`);
      return true;
    }

    for (const key in obj) {
      if (findAndUpdate(obj[key])) return true;
    }
    return false;
  }

  if (!findAndUpdate(outline)) {
    throw new Error(`${eaId} not found in outline`);
  }

  const backupPath = path.join(__dirname, `../data/l_outline.backup-${eaId}.json`);
  fs.copyFileSync(outlinePath, backupPath);
  console.log(`\n💾 Backup: ${backupPath.replace(path.join(__dirname, '..'), 'data')}`);

  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2));
  console.log(`\n✅ Updated data/l_outline.json`);
  console.log(`✨ Complete!`);

  console.log(`📖 Importing scenes for ${eaId} (Chapter ${chapterNumber})...`);

  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, chapterNumber)).limit(1);
  if (!chapter) throw new Error(`Chapter ${chapterNumber} not found in database`);

  console.log(`\n✅ Found existing chapter: ${chapter.title} (ID: ${chapter.id})`);
  console.log(`   Unique Identifier: ${chapter.chapterUniqueIdentifier}`);

  const existingScenes = await db.select().from(scenes).where(eq(scenes.chapterId, chapter.id));
  console.log(`\n✅ Found ${existingScenes.length} scenes in database`);

  if (existingScenes.length > 0) {
    await db.delete(scenes).where(eq(scenes.chapterId, chapter.id));
    console.log(`   🗑️  Deleted existing scenes`);
  }

  console.log(`\n✅ Found ${enhancedScenes.length} scenes in outline`);

  for (const scene of enhancedScenes) {
    const [insertedScene] = await db.insert(scenes).values({
      chapterId: chapter.id,
      sceneNumber: scene.scene_number,
      title: scene.title,
      setup: scene.setup,
      chapterUniqueIdentifier: eaId,
    }).returning();

    console.log(`   ✅ Inserted scene (ID: ${insertedScene.id})`);

    await db.update(scenes)
      .set({
        focus: scene.focus,
        description: scene.description,
        preliminarySceneFocus: scene.preliminary_scene_focus,
        preliminarySceneDescription: scene.preliminary_scene_description,
        chapterSceneFocus: scene.chapter_scene_focus,
        beatGoal: scene.beat_goal,
        symbolism: scene.symbolism,
        location: scene.location,
        timeline_variant: scene.timeline_variant,
        timeline_date: scene.timeline_date,
        realWorldContext: scene.real_world_context,
        timelineSignificance: scene.timeline_significance,
        chronologicalSequence: scene.chronological_sequence,
        sceneCardProgression: scene.sceneCardProgression,
        narrativeFunction: scene.narrative_function,
        saveTheCatBeat: scene.save_the_cat_beat,
        pov: scene.pov,
        tense: scene.tense,
        core_emotion: scene.core_emotion,
        scene_tone: scene.scene_tone,
        sudowrite_metadata: scene.sudowrite_metadata,
        learning_objectives: scene.learning_objectives,
        foreshadowing_elements: scene.foreshadowing_elements,
        characterGrowthElement: scene.character_growth_element,
        seriesConnectionResonance: scene.series_connection_resonance,
      })
      .where(eq(scenes.id, insertedScene.id));

    console.log(`   ✅ Updated with enhanced fields`);
  }

  console.log(`\n✅ Import complete!`);
  console.log(`   📊 Total scenes imported: ${enhancedScenes.length}`);
  console.log(`   📖 Chapter: ${chapter.title}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
