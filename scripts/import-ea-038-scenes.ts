import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Imports 3 scenes for EA-038 from the outline with all enhanced fields
 */

function findEA038Data() {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-038') return obj;

    for (const key of Object.keys(obj)) {
      const result = search(obj[key]);
      if (result) return result;
    }
    return null;
  };

  return search(outlineData);
}

function truncate(str: string | undefined, maxLength: number): string | null {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
}

async function main() {
  console.log('📖 Importing scenes for EA-038 from outline...\n');

  // Get the chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-038'))
    .limit(1);

  if (!chapter) {
    throw new Error('Chapter EA-038 not found. Run create-ea-038-chapter.ts first.');
  }

  console.log(`✅ Found Chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  // Get EA-038 data from outline
  const ea038Data = findEA038Data();
  if (!ea038Data || !ea038Data.scenes) {
    throw new Error('EA-038 or scenes not found in outline');
  }

  console.log(`✅ Found ${ea038Data.scenes.length} scenes in outline\n`);

  let sceneCount = 0;

  for (const outlineScene of ea038Data.scenes) {
    console.log(`\n📝 Processing Scene ${outlineScene.scene_number}: ${outlineScene.scene_title}`);

    // Check if scene already exists
    const existingScene = await db
      .select()
      .from(scenes)
      .where(
        and(
          eq(scenes.chapterUniqueIdentifier, 'EA-038'),
          eq(scenes.sceneNumber, outlineScene.scene_number)
        )
      )
      .limit(1);

    if (existingScene.length > 0) {
      console.log(`   ⚠️  Scene ${outlineScene.scene_number} already exists. Skipping.`);
      continue;
    }

    // Insert base scene data
    const baseSceneData = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-038',
      sceneNumber: outlineScene.scene_number,
      title: truncate(outlineScene.scene_title, 255),
      setup: outlineScene.setup || null,
      symbolism: outlineScene.symbolism || null,
      beatGoal: outlineScene.beat_goal || null,
      pov: truncate(outlineScene.pov, 100),
      tense: truncate(outlineScene.tense, 100),
      core_emotion: truncate(outlineScene.core_emotion, 255),
      scene_tone: truncate(outlineScene.scene_tone, 255),
      timeline_date: truncate(outlineScene.timeline_date, 50),
      timeline_variant: truncate(outlineScene.timeline_variant, 100),
      location: truncate(outlineScene.location, 255),
    };

    const [insertedScene] = await db.insert(scenes).values(baseSceneData).returning();
    console.log(`   ✅ Base scene inserted (ID: ${insertedScene.id})`);

    // Update with enhanced fields from outline
    const enhancedData = {
      pages: truncate(outlineScene.pages, 50),
      description: truncate(outlineScene.description, 500),
      focus: truncate(outlineScene.focus, 255),
      chapterSceneFocus: truncate(outlineScene.chapterSceneFocus, 255),
      preliminarySceneFocus: truncate(outlineScene.preliminarySceneFocus, 255),
      preliminarySceneDescription: truncate(outlineScene.preliminarySceneDescription, 500),
      narrativeFunction: outlineScene.narrative_function || null,
      sensoryDetail: truncate(outlineScene.sensoryDetail, 500),
      internalConflict: truncate(outlineScene.internalConflict, 255),
      characterGrowthElement: truncate(outlineScene.characterGrowthElement, 255),
      seriesConnectionResonance: truncate(outlineScene.seriesConnectionResonance, 255),
      sceneCardProgression: outlineScene.sceneCardProgression || null,
      realWorldContext: truncate(outlineScene.realWorldContext, 255),
      timelineSignificance: truncate(outlineScene.timelineSignificance, 255),
      saveTheCatBeat: truncate(outlineScene.saveTheCatBeat, 100),
      sudowrite_metadata:
        typeof outlineScene.sudowrite_metadata === 'string'
          ? outlineScene.sudowrite_metadata
          : JSON.stringify(outlineScene.sudowrite_metadata || {}),
      learning_objectives:
        typeof outlineScene.learning_objectives === 'string'
          ? outlineScene.learning_objectives
          : JSON.stringify(outlineScene.learning_objectives || {}),
      foreshadowing_elements:
        typeof outlineScene.foreshadowing_elements === 'string'
          ? outlineScene.foreshadowing_elements
          : JSON.stringify(outlineScene.foreshadowing_elements || []),
    };

    await db.update(scenes).set(enhancedData).where(eq(scenes.id, insertedScene.id));
    console.log(`   ✅ Enhanced fields added`);
    sceneCount++;
  }

  console.log(`\n✅ Import complete!`);
  console.log(`   📊 Total scenes imported: ${sceneCount}`);
  console.log(`   📖 Chapter: EA-038 - ${chapter.title}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
