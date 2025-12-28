import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import * as fs from 'fs';
import * as path from 'path';

interface SceneData {
  scene_number: number;
  scene_title: string;
  setup?: string;
  symbolism?: string;
  beat_goal?: string;
  pov?: string;
  tense?: string;
  core_emotion?: string;
  scene_tone?: string;
  timeline_date?: string;
  timeline_variant?: string;
  location?: string;
}

interface EA027Data {
  id: string;
  title: string;
  epic_novel_pages?: string;
  epic_chapter_focus?: string;
  epic_novel_chapter_focus?: string;
  tarot_family?: string;
  tarot_card_item?: string;
  hero_journey_beat?: string;
  save_the_cat_beat?: string;
  summary?: string;
  character_arcs?: string;
  story_gaps_addressed?: string;
  location_details?: string;
  series_connections?: string;
  scenes: SceneData[];
}

function findEA027Data(): EA027Data | null {
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  const search = (obj: any): EA027Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-027') return obj as EA027Data;

    for (const key of Object.keys(obj)) {
      const result = search(obj[key]);
      if (result) return result;
    }
    return null;
  };

  return search(outlineData);
}

async function main() {
  console.log('🔍 Searching for EA-027 in outline...\n');

  const ea027Data = findEA027Data();

  if (!ea027Data) {
    console.error('❌ EA-027 not found in outline');
    process.exit(1);
  }

  console.log(`✅ Found EA-027: ${ea027Data.title}`);
  console.log(`   Scenes: ${ea027Data.scenes?.length || 0}\n`);

  // Find the chapter - it should be chapter 27 in the same book as EA-023
  const ea023 = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-023'))
    .limit(1);

  if (ea023.length === 0) {
    console.error('❌ EA-023 not found - cannot determine book ID');
    process.exit(1);
  }

  const bookId = ea023[0].bookId;

  const existingChapter = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-027'))
    .limit(1);

  let chapter;

  if (existingChapter.length > 0) {
    console.log('✅ EA-027 chapter already exists\n');
    chapter = existingChapter[0];
  } else {
    // Find chapter 27 in the same book
    const ch27 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 27))
      .limit(10);

    const correctChapter = ch27.find((ch) => ch.bookId === bookId);

    if (!correctChapter) {
      console.error('❌ Chapter 27 not found in the same book as EA-023');
      process.exit(1);
    }

    chapter = correctChapter;
    console.log(`✅ Found Chapter 27: ${chapter.title}\n`);

    // Update with unique identifier and outline data
    await db
      .update(chapters)
      .set({
        uniqueIdentifier: 'EA-027',
        title: ea027Data.title,
      })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Updated chapter with EA-027 identifier\n');
  }

  // Check existing scenes
  const existingScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  if (existingScenes.length > 0) {
    console.log(`⚠️  Found ${existingScenes.length} existing scenes. Deleting them first...\n`);
    await db.delete(scenes).where(eq(scenes.chapterId, chapter.id));
  }

  // Import scenes
  console.log('📝 Importing scenes...\n');

  for (const sceneData of ea027Data.scenes || []) {
    const sceneInsert = {
      chapterId: chapter.id,
      chapterUniqueIdentifier: 'EA-027',
      sceneNumber: sceneData.scene_number,
      title: sceneData.scene_title?.substring(0, 255) || null,
      setup: sceneData.setup || null,
      symbolism: sceneData.symbolism || null,
      beatGoal: sceneData.beat_goal || null,
      pov: sceneData.pov?.substring(0, 100) || null,
      tense: sceneData.tense?.substring(0, 100) || null,
      core_emotion: sceneData.core_emotion?.substring(0, 100) || null,
      scene_tone: sceneData.scene_tone?.substring(0, 100) || null,
      timeline_date: sceneData.timeline_date?.substring(0, 50) || null,
      timeline_variant: sceneData.timeline_variant?.substring(0, 100) || null,
      location: sceneData.location?.substring(0, 255) || null,
    };

    await db.insert(scenes).values(sceneInsert);

    console.log(`✅ Scene ${sceneData.scene_number}: ${sceneData.scene_title}`);
  }

  console.log('\n🎉 EA-027 basic import complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
