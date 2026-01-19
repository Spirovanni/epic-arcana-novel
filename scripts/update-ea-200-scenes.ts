import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Update existing scenes for EA-200 with new enhanced content
 * Usage: bun run scripts/update-ea-200-scenes.ts
 */

function findChapterData(outline: any, eaId: string): any {
  const search = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === eaId) return obj;

    for (const key of Object.keys(obj)) {
      const result = search(obj[key]);
      if (result) return result;
    }
    return null;
  };

  return search(outline);
}

function truncate(str: string | undefined, maxLength: number): string | null {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
}

async function main() {
  const chapterNumber = 200;
  const eaId = 'EA-200';

  console.log(`📖 Updating scenes for ${eaId} (Chapter ${chapterNumber})...\n`);

  // Find the existing chapter by chapter number
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.chapterNumber, chapterNumber))
    .limit(1);

  if (!chapter) {
    throw new Error(`Chapter ${chapterNumber} not found in database`);
  }

  console.log(`✅ Found existing chapter: ${chapter.title} (ID: ${chapter.id})`);
  console.log(`   Unique Identifier: ${chapter.uniqueIdentifier}\n`);

  // Read outline
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  // Find chapter data in outline
  const chapterData = findChapterData(outline, eaId);
  if (!chapterData || !chapterData.scenes) {
    throw new Error(`${eaId} or scenes not found in outline`);
  }

  console.log(`✅ Found ${chapterData.scenes.length} scenes in outline\n`);

  let updateCount = 0;

  for (const outlineScene of chapterData.scenes) {
    console.log(`📝 Updating Scene ${outlineScene.scene_number}: ${outlineScene.scene_title || outlineScene.title}`);

    // Find existing scene
    const [existingScene] = await db
      .select()
      .from(scenes)
      .where(
        and(
          eq(scenes.chapterId, chapter.id),
          eq(scenes.sceneNumber, outlineScene.scene_number)
        )
      )
      .limit(1);

    if (!existingScene) {
      console.log(`   ⚠️  Scene ${outlineScene.scene_number} not found. Skipping.\n`);
      continue;
    }

    // Update with all scene data
    const updateData: any = {
      title: truncate(outlineScene.scene_title || outlineScene.title, 255),
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
      pages: truncate(outlineScene.pages, 50),
      description: truncate(outlineScene.description, 500),
      focus: truncate(outlineScene.focus, 255),
      chapterSceneFocus: truncate(outlineScene.chapterSceneFocus, 255),
      preliminarySceneFocus: truncate(outlineScene.preliminarySceneFocus, 255),
      preliminarySceneDescription: truncate(outlineScene.preliminarySceneDescription, 500),
      narrativeFunction: outlineScene.narrative_function || outlineScene.narrativeFunction || null,
      sensoryDetail: truncate(outlineScene.sensoryDetail, 500),
      internalConflict: truncate(outlineScene.internalConflict, 255),
      characterGrowthElement: truncate(outlineScene.characterGrowthElement, 255),
      seriesConnectionResonance: truncate(outlineScene.seriesConnectionResonance, 255),
      sceneCardProgression: outlineScene.sceneCardProgression || null,
      realWorldContext: truncate(outlineScene.realWorldContext, 255),
      timelineSignificance: truncate(outlineScene.timelineSignificance, 255),
      saveTheCatBeat: truncate(outlineScene.saveTheCatBeat, 100),
    };

    // Handle JSON fields
    if (outlineScene.sudowrite_metadata) {
      updateData.sudowrite_metadata =
        typeof outlineScene.sudowrite_metadata === 'string'
          ? outlineScene.sudowrite_metadata
          : JSON.stringify(outlineScene.sudowrite_metadata);
    }

    if (outlineScene.learning_objectives) {
      updateData.learning_objectives =
        typeof outlineScene.learning_objectives === 'string'
          ? outlineScene.learning_objectives
          : JSON.stringify(outlineScene.learning_objectives);
    }

    if (outlineScene.foreshadowing_elements) {
      updateData.foreshadowing_elements =
        typeof outlineScene.foreshadowing_elements === 'string'
          ? outlineScene.foreshadowing_elements
          : JSON.stringify(outlineScene.foreshadowing_elements);
    }

    await db.update(scenes).set(updateData).where(eq(scenes.id, existingScene.id));
    console.log(`   ✅ Updated scene (ID: ${existingScene.id})\n`);
    updateCount++;
  }

  console.log(`✅ Update complete!`);
  console.log(`   📊 Total scenes updated: ${updateCount}`);
  console.log(`   📖 Chapter: ${chapter.title}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
