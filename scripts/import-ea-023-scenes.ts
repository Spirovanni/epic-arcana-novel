import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import outlineData from '../data/l_outline.json';

interface OutlineScene {
  scene_number: number;
  scene_title: string;
  setup: string;
  symbolism: string;
  beat_goal: string;
  pov: string;
  tense: string;
  core_emotion: string;
  scene_tone: string;
  timeline_date: string;
  timeline_variant: string;
  location: string;
}

interface EA023Data {
  id: string;
  all_chapter: number;
  title: string;
  summary: string;
  hero_journey_beat: string;
  save_the_cat_beat: string;
  plot: string;
  epic_chapter_focus: string;
  epic_preliminary_scene_focus: string;
  epic_preliminary_scene_description: string;
  epic_novel_pages: string;
  historical_date?: string;
  tarot_card_item: string;
  scenes: OutlineScene[];
}

function findEA023Data(): EA023Data | null {
  // Recursively search for EA-023 in the outline structure
  const search = (obj: any): EA023Data | null => {
    if (!obj || typeof obj !== 'object') return null;

    // Check if this object is EA-023
    if (obj.id === 'EA-023') {
      return obj as EA023Data;
    }

    // Recursively search all properties
    for (const key of Object.keys(obj)) {
      const result = search(obj[key]);
      if (result) return result;
    }

    return null;
  };

  return search(outlineData);
}

async function main() {
  console.log('🔍 Searching for EA-023 in outline...');

  const ea023Data = findEA023Data();

  if (!ea023Data) {
    console.error('❌ EA-023 not found in outline data');
    process.exit(1);
  }

  console.log(`✅ Found EA-023: "${ea023Data.title}"`);
  console.log(`   Chapter: ${ea023Data.all_chapter}`);
  console.log(`   Scenes: ${ea023Data.scenes?.length || 0}`);

  // Find the chapter in the database
  console.log('\n🔍 Looking for Chapter 23 in database...');

  const chapterRecords = await db
    .select()
    .from(chapters)
    .where(eq(chapters.chapterNumber, 23))
    .limit(1);

  if (chapterRecords.length === 0) {
    console.error('❌ Chapter 23 not found in database');
    console.log('   Please create Chapter 23 first before importing scenes');
    process.exit(1);
  }

  const chapter = chapterRecords[0];
  console.log(`✅ Found Chapter 23: ${chapter.title || 'Untitled'}`);
  console.log(`   ID: ${chapter.id}`);

  if (!ea023Data.scenes || ea023Data.scenes.length === 0) {
    console.warn('⚠️  No scenes found in EA-023 data');
    process.exit(0);
  }

  // Check if scenes already exist for this chapter
  const existingScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  if (existingScenes.length > 0) {
    console.warn(`⚠️  Chapter 23 already has ${existingScenes.length} scenes`);
    console.log('   Deleting existing scenes...');

    for (const existingScene of existingScenes) {
      await db.delete(scenes).where(eq(scenes.id, existingScene.id));
    }

    console.log('   ✅ Deleted existing scenes');
  }

  // Insert scenes
  console.log(`\n📝 Inserting ${ea023Data.scenes.length} scenes...`);

  for (const sceneData of ea023Data.scenes) {
    // Extract all the fields from the scene and chapter data
    // Using correct field names from the schema
    const sceneInsert = {
      chapterId: chapter.id,
      sceneNumber: sceneData.scene_number,
      title: sceneData.scene_title?.substring(0, 255) || null,
      focus: ea023Data.epic_chapter_focus?.substring(0, 255) || null,
      preliminarySceneFocus: ea023Data.epic_preliminary_scene_focus?.substring(0, 255) || null,
      preliminarySceneDescription: ea023Data.epic_preliminary_scene_description || null,
      description: sceneData.setup || null,
      setup: sceneData.setup || null,
      symbolism: sceneData.symbolism || null,
      beatGoal: sceneData.beat_goal || null,
      saveTheCatBeat: ea023Data.save_the_cat_beat?.substring(0, 255) || null,
      pages: ea023Data.epic_novel_pages?.substring(0, 50) || null,
      timeline_date: sceneData.timeline_date?.substring(0, 50) || null,
      timeline_variant: sceneData.timeline_variant?.substring(0, 100) || null,
      location: sceneData.location?.substring(0, 255) || null,
      pov: sceneData.pov?.substring(0, 100) || null,
      tense: sceneData.tense?.substring(0, 100) || null,
      core_emotion: sceneData.core_emotion?.substring(0, 255) || null,
      scene_tone: sceneData.scene_tone?.substring(0, 255) || null,
      storySequence: sceneData.scene_number,
      chronologicalSequence: sceneData.scene_number,
    };

    await db.insert(scenes).values(sceneInsert);

    console.log(`   ✓ Scene ${sceneData.scene_number}: ${sceneData.scene_title}`);
    console.log(`      POV: ${sceneData.pov || 'N/A'}, Tense: ${sceneData.tense || 'N/A'}`);
    console.log(`      Location: ${sceneData.location || 'N/A'}, Date: ${sceneData.timeline_date || 'N/A'}`);
  }

  console.log(`\n✅ Successfully imported ${ea023Data.scenes.length} scenes for EA-023`);
  console.log(`   Chapter: ${ea023Data.title}`);

  // Verify insertion
  const verifyScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  console.log(`\n✨ Verification: Found ${verifyScenes.length} scenes in database for Chapter 23`);
}

main()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
