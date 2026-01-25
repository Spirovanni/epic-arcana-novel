import * as fs from 'fs';
import * as path from 'path';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const eaId = 'EA-294';
  const chapterNumber = 294;
  console.log(`📝 Injecting enhanced scenes for ${eaId}...\n`);

  const enhancedScenesPath = path.join(process.cwd(), 'scripts', `ea-${chapterNumber}-enhanced-scenes.json`);
  const enhancedScenes = JSON.parse(fs.readFileSync(enhancedScenesPath, 'utf-8'));
  console.log(`✅ Loaded ${enhancedScenes.length} enhanced scenes\n`);

  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  function findAndUpdate(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;
    if (obj.id === eaId) {
      console.log(`✅ Found ${eaId}: ${obj.chapter} - ${obj.specific_task_group_title}`);
      console.log(`   Existing scenes: ${obj.scenes ? obj.scenes.length : 0}\n`);
      obj.scenes = enhancedScenes;
      console.log(`✅ Replaced with ${enhancedScenes.length} enhanced scenes\n`);
      return true;
    }
    for (const key of Object.keys(obj)) {
      if (findAndUpdate(obj[key])) return true;
    }
    return false;
  }

  if (!findAndUpdate(outline)) throw new Error(`${eaId} not found`);

  const backupPath = path.join(process.cwd(), 'data', `l_outline.backup-${eaId}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`💾 Backup: data/l_outline.backup-${eaId}.json\n`);

  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`✅ Updated data/l_outline.json\n✨ Complete!`);

  console.log(`📖 Importing scenes for ${eaId} (Chapter ${chapterNumber})...\n`);

  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, chapterNumber)).limit(1);
  if (!chapter) throw new Error(`Chapter ${chapterNumber} not found`);

  console.log(`✅ Found existing chapter: ${chapter.title} (ID: ${chapter.id})`);
  console.log(`   Unique Identifier: ${chapter.uniqueIdentifier}\n`);

  const existingScenes = await db.select().from(scenes).where(eq(scenes.chapterId, chapter.id));
  console.log(`✅ Found ${existingScenes.length} scenes in database\n`);

  if (existingScenes.length > 0) {
    console.log(`⚠️ Scenes already exist for ${eaId}. Updating existing scenes.`);
    for (const newScene of enhancedScenes) {
      const existingScene = existingScenes.find(s => s.sceneNumber === newScene.scene_number);
      if (existingScene) {
        await db.update(scenes)
          .set({
            title: newScene.title,
            setup: newScene.setup,
            symbolism: newScene.symbolism,
            beatGoal: newScene.beat_goal,
            pov: newScene.pov,
            tense: newScene.tense,
            core_emotion: newScene.core_emotion,
            scene_tone: newScene.scene_tone,
            pages: newScene.pages,
            description: newScene.description,
            sensoryDetail: newScene.sensoryDetail,
            location: newScene.location,
            timeline_variant: newScene.timeline_variant,
            timeline_date: newScene.timeline_date,
            sceneCardProgression: newScene.sceneCardProgression,
            focus: newScene.focus,
            chapterSceneFocus: newScene.chapterSceneFocus,
            preliminarySceneFocus: newScene.preliminarySceneFocus,
            preliminarySceneDescription: newScene.preliminarySceneDescription,
            internalConflict: newScene.internalConflict,
            characterGrowthElement: newScene.characterGrowthElement,
            seriesConnectionResonance: newScene.seriesConnectionResonance,
            saveTheCatBeat: newScene.saveTheCatBeat,
            narrativeFunction: newScene.narrativeFunction,
            realWorldContext: newScene.realWorldContext,
            timelineSignificance: newScene.timelineSignificance,
            sudowrite_metadata: newScene.sudowrite_metadata,
            learning_objectives: newScene.learning_objectives,
            foreshadowing_elements: newScene.foreshadowing_elements,
            chapterUniqueIdentifier: 'EA-294',
          })
          .where(eq(scenes.id, existingScene.id));
        console.log(`   ✅ Updated scene (ID: ${existingScene.id})`);
      } else {
        const [insertedScene] = await db.insert(scenes).values({
          chapterId: chapter.id,
          chapterUniqueIdentifier: 'EA-294',
          sceneNumber: newScene.scene_number,
          title: newScene.title,
          setup: newScene.setup,
          symbolism: newScene.symbolism,
          beatGoal: newScene.beat_goal,
          pov: newScene.pov,
          tense: newScene.tense,
          core_emotion: newScene.core_emotion,
          scene_tone: newScene.scene_tone,
          pages: newScene.pages,
          description: newScene.description,
          sensoryDetail: newScene.sensoryDetail,
          location: newScene.location,
          timeline_variant: newScene.timeline_variant,
          timeline_date: newScene.timeline_date,
          sceneCardProgression: newScene.sceneCardProgression,
          focus: newScene.focus,
          chapterSceneFocus: newScene.chapterSceneFocus,
          preliminarySceneFocus: newScene.preliminarySceneFocus,
          preliminarySceneDescription: newScene.preliminarySceneDescription,
          internalConflict: newScene.internalConflict,
          characterGrowthElement: newScene.characterGrowthElement,
          seriesConnectionResonance: newScene.seriesConnectionResonance,
          saveTheCatBeat: newScene.saveTheCatBeat,
          narrativeFunction: newScene.narrativeFunction,
          realWorldContext: newScene.realWorldContext,
          timelineSignificance: newScene.timelineSignificance,
          sudowrite_metadata: newScene.sudowrite_metadata,
          learning_objectives: newScene.learning_objectives,
          foreshadowing_elements: newScene.foreshadowing_elements,
        }).returning();
        console.log(`   ✅ Inserted new scene (ID: ${insertedScene.id})`);
      }
    }
  } else {
    console.log(`✅ Found ${enhancedScenes.length} scenes in outline`);
    for (const newScene of enhancedScenes) {
      const [insertedScene] = await db.insert(scenes).values({
        chapterId: chapter.id,
        chapterUniqueIdentifier: 'EA-294',
        sceneNumber: newScene.scene_number,
        title: newScene.title,
        setup: newScene.setup,
        symbolism: newScene.symbolism,
        beatGoal: newScene.beat_goal,
        pov: newScene.pov,
        tense: newScene.tense,
        core_emotion: newScene.core_emotion,
        scene_tone: newScene.scene_tone,
        pages: newScene.pages,
        description: newScene.description,
        sensoryDetail: newScene.sensoryDetail,
        location: newScene.location,
        timeline_variant: newScene.timeline_variant,
        timeline_date: newScene.timeline_date,
        sceneCardProgression: newScene.sceneCardProgression,
        focus: newScene.focus,
        chapterSceneFocus: newScene.chapterSceneFocus,
        preliminarySceneFocus: newScene.preliminarySceneFocus,
        preliminarySceneDescription: newScene.preliminarySceneDescription,
        internalConflict: newScene.internalConflict,
        characterGrowthElement: newScene.characterGrowthElement,
        seriesConnectionResonance: newScene.seriesConnectionResonance,
        saveTheCatBeat: newScene.saveTheCatBeat,
        narrativeFunction: newScene.narrativeFunction,
        realWorldContext: newScene.realWorldContext,
        timelineSignificance: newScene.timelineSignificance,
        sudowrite_metadata: newScene.sudowrite_metadata,
        learning_objectives: newScene.learning_objectives,
        foreshadowing_elements: newScene.foreshadowing_elements,
      }).returning();
      console.log(`   ✅ Inserted scene (ID: ${insertedScene.id})`);
      console.log(`   ✅ Updated with enhanced fields`);
    }
  }

  console.log(`\n✅ Import complete!`);
  console.log(`   📊 Total scenes imported: ${enhancedScenes.length}`);
  console.log(`   📖 Chapter: ${chapter.title}\n`);
}

main().then(() => process.exit(0)).catch((e) => { console.error('❌', e); process.exit(1); });
