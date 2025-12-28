import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import outlineData from '../data/l_outline.json';

interface EA023Data {
  id: string;
  all_chapter: number;
  title: string;
  summary: string;
  hero_journey_beat: string;
  save_the_cat_beat: string;
  save_the_cat_beat_goal: string;
  plot: string;
  epic_chapter_focus: string;
  epic_preliminary_scene_focus: string;
  epic_preliminary_scene_description: string;
  epic_novel_pages: string;
  epic_novel_chapter_focus: string;
  epic_novel_section_name: string;
  tarot_card_link: string;
  tarot_family: string;
  new_tarot_family: string;
  tarot_card_item: string;
  focus_area: string;
  connection_to_the_major_task_group?: string;
  major_activity_theme_books_influenced_by?: any;
  character_arcs?: any;
  story_gaps_addressed?: any;
  location_details?: any;
  series_connections?: any;
  scenes: any[];
}

function findEA023Data(): EA023Data | null {
  const search = (obj: any): EA023Data | null => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === 'EA-023') return obj as EA023Data;

    for (const key of Object.keys(obj)) {
      const result = search(obj[key]);
      if (result) return result;
    }
    return null;
  };

  return search(outlineData);
}

async function main() {
  console.log('🔧 Completing EA-023 data from outline...\n');

  const ea023Data = findEA023Data();
  if (!ea023Data) {
    console.error('❌ EA-023 not found in outline');
    process.exit(1);
  }

  console.log(`✅ Found EA-023 data in outline`);

  // Get Chapter 23 from database
  const chapter23Records = await db
    .select()
    .from(chapters)
    .where(eq(chapters.chapterNumber, 23))
    .limit(1);

  if (chapter23Records.length === 0) {
    console.error('❌ Chapter 23 not found in database');
    process.exit(1);
  }

  const chapter23 = chapter23Records[0];
  console.log(`✅ Found Chapter 23 in database\n`);

  // Update Chapter with missing fields (respecting varchar limits)
  console.log('📝 Updating Chapter 23 fields...');

  const truncate = (value: string | null | undefined, maxLength: number): string | null => {
    if (!value) return null;
    if (value.length <= maxLength) return value;
    return value.substring(0, maxLength - 3) + '...';
  };

  const chapterUpdates = {
    epicNovelPages: truncate(ea023Data.epic_novel_pages, 50),
    epicChapterFocus: truncate(ea023Data.epic_chapter_focus, 255),
    epicNovelChapterFocus: truncate(ea023Data.epic_novel_chapter_focus, 255),
    epicNovelSectionName: truncate(ea023Data.epic_novel_section_name, 255),
    tarotCardLink: truncate(ea023Data.tarot_card_link, 100),
    tarotFamily: truncate(ea023Data.tarot_family, 50),
    tarotCardItem: truncate(ea023Data.tarot_card_item, 50),
    newTarotFamily: truncate(ea023Data.new_tarot_family, 50),
    connectionToMajorTaskGroup: ea023Data.connection_to_the_major_task_group || null,
    specificTaskGroupBooksInfluencedBy: ea023Data.major_activity_theme_books_influenced_by || null,
    epicPreliminarySceneFocus: truncate(ea023Data.epic_preliminary_scene_focus, 255),
    epicPreliminarySceneDescription: ea023Data.epic_preliminary_scene_description || null,
    summary: ea023Data.summary || null,
    heroJourneyBeat: truncate(ea023Data.hero_journey_beat, 100),
    saveTheCatBeat: truncate(ea023Data.save_the_cat_beat, 100),
    saveTheCatBeatGoal: ea023Data.save_the_cat_beat_goal || null,
    plotBeat: truncate(ea023Data.plot, 100),
    characterArcs: ea023Data.character_arcs || null,
    storyGapsAddressed: ea023Data.story_gaps_addressed || null,
    locationDetails: ea023Data.location_details || null,
    seriesConnections: ea023Data.series_connections || null,
  };

  await db
    .update(chapters)
    .set(chapterUpdates)
    .where(eq(chapters.id, chapter23.id));

  console.log('✅ Chapter 23 updated with complete data');

  // Log what was added
  let addedFields = 0;
  for (const [key, value] of Object.entries(chapterUpdates)) {
    if (value !== null && value !== undefined) {
      console.log(`   ✓ ${key}`);
      addedFields++;
    }
  }
  console.log(`\n   Total fields added to chapter: ${addedFields}`);

  // Update Scenes with missing fields
  console.log('\n📝 Updating Scene fields...');

  const chapter23Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter23.id))
    .orderBy(scenes.sceneNumber);

  if (ea023Data.scenes && ea023Data.scenes.length > 0) {
    for (let i = 0; i < chapter23Scenes.length; i++) {
      const dbScene = chapter23Scenes[i];
      const outlineScene = ea023Data.scenes[i];

      if (!outlineScene) continue;

      const sceneUpdates = {
        preliminarySceneDescription: ea023Data.epic_preliminary_scene_description || null,
        narrativeFunction: outlineScene.narrative_function || null,
        sensoryDetail: outlineScene.sensory_detail || null,
        internalConflict: outlineScene.internal_conflict || null,
        characterGrowthElement: outlineScene.character_growth_element || null,
        seriesConnectionResonance: outlineScene.series_connection_resonance || null,
        sudowrite_metadata: outlineScene.sudowrite_metadata || null,
        learning_objectives: outlineScene.learning_objectives || null,
        foreshadowing_elements: outlineScene.foreshadowing_elements || null,
      };

      await db
        .update(scenes)
        .set(sceneUpdates)
        .where(eq(scenes.id, dbScene.id));

      console.log(`   ✓ Updated Scene ${dbScene.sceneNumber}: ${dbScene.title}`);
    }
  }

  console.log('\n✅ All scenes updated');

  // Verification
  console.log('\n🔍 Verification:');
  console.log('='.repeat(80));

  const updatedChapter = await db
    .select()
    .from(chapters)
    .where(eq(chapters.id, chapter23.id))
    .limit(1);

  const ch = updatedChapter[0];
  const chapterFieldsNow = {
    epicNovelPages: ch.epicNovelPages,
    epicChapterFocus: ch.epicChapterFocus,
    epicNovelChapterFocus: ch.epicNovelChapterFocus,
    epicNovelSectionName: ch.epicNovelSectionName,
    tarotCardLink: ch.tarotCardLink,
    tarotFamily: ch.tarotFamily,
    tarotCardItem: ch.tarotCardItem,
    summary: ch.summary,
    heroJourneyBeat: ch.heroJourneyBeat,
    saveTheCatBeat: ch.saveTheCatBeat,
  };

  console.log('\nChapter 23 Key Fields:');
  for (const [key, value] of Object.entries(chapterFieldsNow)) {
    const status = value ? '✅' : '❌';
    const preview = value ? String(value).substring(0, 60) + '...' : 'NULL';
    console.log(`${status} ${key.padEnd(30)} ${preview}`);
  }

  const updatedScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter23.id))
    .orderBy(scenes.sceneNumber);

  console.log(`\nScenes (${updatedScenes.length} total):`);
  for (const scene of updatedScenes) {
    const hasAllData =
      scene.preliminarySceneDescription &&
      scene.setup &&
      scene.beatGoal &&
      scene.symbolism &&
      scene.pov &&
      scene.tense &&
      scene.core_emotion &&
      scene.scene_tone;

    const status = hasAllData ? '✅' : '⚠️ ';
    console.log(`${status} Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`     Preliminary Description: ${scene.preliminarySceneDescription ? '✅' : '❌'}`);
    console.log(`     Narrative Function: ${scene.narrativeFunction ? '✅' : '❌'}`);
    console.log(`     Sensory Detail: ${scene.sensoryDetail ? '✅' : '❌'}`);
    console.log(`     Internal Conflict: ${scene.internalConflict ? '✅' : '❌'}`);
    console.log(`     Character Growth: ${scene.characterGrowthElement ? '✅' : '❌'}`);
  }

  console.log('\n🎉 EA-023 data completion finished!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
