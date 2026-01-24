import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Imports scenes from outline to existing chapters
 * Usage: npx tsx scripts/import-scenes-to-existing-chapters.ts <chapter-number>
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
  const chapterNumber = parseInt(process.argv[2]);
  if (!chapterNumber) {
    console.error('Usage: npx tsx scripts/import-scenes-to-existing-chapters.ts <chapter-number>');
    process.exit(1);
  }

  const eaId = `EA-${chapterNumber.toString().padStart(3, '0')}`;

  console.log(`📖 Importing scenes for ${eaId} (Chapter ${chapterNumber})...\n`);

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

  let sceneCount = 0;

  for (const outlineScene of chapterData.scenes) {
    console.log(`📝 Processing Scene ${outlineScene.scene_number}: ${outlineScene.scene_title || outlineScene.title}`);

    // Check if scene already exists
    const existingScene = await db
      .select()
      .from(scenes)
      .where(
        and(
          eq(scenes.chapterId, chapter.id),
          eq(scenes.sceneNumber, outlineScene.scene_number)
        )
      )
      .limit(1);

    if (existingScene.length > 0) {
      console.log(`   ⚠️  Scene ${outlineScene.scene_number} already exists. Skipping.\n`);
      continue;
    }

    // Insert base scene data
    const baseSceneData = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: chapter.uniqueIdentifier,
      sceneNumber: outlineScene.scene_number,
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
    };

    const [insertedScene] = await db.insert(scenes).values(baseSceneData).returning();
    console.log(`   ✅ Inserted scene (ID: ${insertedScene.id})`);

    // Update with enhanced fields
    const enhancedData: any = {
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
      enhancedData.sudowrite_metadata =
        typeof outlineScene.sudowrite_metadata === 'string'
          ? outlineScene.sudowrite_metadata
          : JSON.stringify(outlineScene.sudowrite_metadata);
    }

    if (outlineScene.learning_objectives) {
      enhancedData.learning_objectives =
        typeof outlineScene.learning_objectives === 'string'
          ? outlineScene.learning_objectives
          : JSON.stringify(outlineScene.learning_objectives);
    }

    if (outlineScene.foreshadowing_elements) {
      enhancedData.foreshadowing_elements =
        typeof outlineScene.foreshadowing_elements === 'string'
          ? outlineScene.foreshadowing_elements
          : JSON.stringify(outlineScene.foreshadowing_elements);
    }

    await db.update(scenes).set(enhancedData).where(eq(scenes.id, insertedScene.id));
    console.log(`   ✅ Updated with enhanced fields\n`);
    sceneCount++;
  }

  console.log(`✅ Import complete!`);
  console.log(`   📊 Total scenes imported: ${sceneCount}`);
  console.log(`   📖 Chapter: ${chapter.title}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
