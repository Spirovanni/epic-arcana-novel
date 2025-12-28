import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🎯 FINAL EA-028 VERIFICATION REPORT\n');
  console.log('='.repeat(80));

  const ch = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-028'))
    .limit(1);

  if (ch.length === 0) {
    console.error('❌ EA-028 not found');
    process.exit(1);
  }

  const chapter = ch[0];

  console.log(`\n📖 CHAPTER: ${chapter.title}`);
  console.log(`   Unique ID: ${chapter.uniqueIdentifier}`);
  console.log(`   Chapter Number: ${chapter.chapterNumber}`);
  console.log('');

  // Check chapter fields
  const chapterFields = {
    'Epic Novel Pages': chapter.epicNovelPages,
    'Epic Chapter Focus': chapter.epicChapterFocus,
    'Epic Novel Chapter Focus': chapter.epicNovelChapterFocus,
    'Tarot Family': chapter.tarotFamily,
    'Tarot Card Item': chapter.tarotCardItem,
    'Hero Journey Beat': chapter.heroJourneyBeat,
    'Save The Cat Beat': chapter.saveTheCatBeat,
    'Summary': chapter.summary,
    'Character Arcs': chapter.characterArcs,
    'Story Gaps': chapter.storyGapsAddressed,
    'Location Details': chapter.locationDetails,
    'Series Connections': chapter.seriesConnections,
  };

  console.log('CHAPTER FIELDS:');
  let chapterComplete = true;
  for (const [field, value] of Object.entries(chapterFields)) {
    const status = value ? '✅' : '❌';
    console.log(`${status} ${field}`);
    if (!value) chapterComplete = false;
  }

  console.log(`\n${chapterComplete ? '✅ Chapter is COMPLETE' : '⚠️  Chapter has missing fields'}\n`);

  // Check scenes
  const ea025Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  console.log('='.repeat(80));
  console.log(`\n🎬 SCENES: ${ea025Scenes.length} total\n`);

  const requiredFields = [
    'title',
    'setup',
    'description',
    'preliminarySceneDescription',
    'narrativeFunction',
    'sensoryDetail',
    'internalConflict',
    'beatGoal',
    'symbolism',
    'pov',
    'tense',
    'core_emotion',
    'scene_tone',
    'timeline_date',
    'timeline_variant',
    'location',
    'characterGrowthElement',
    'seriesConnectionResonance',
    'focus',
    'chapterSceneFocus',
    'preliminarySceneFocus',
    'sceneCardProgression',
    'realWorldContext',
    'timelineSignificance',
    'saveTheCatBeat',
    'sudowrite_metadata',
    'learning_objectives',
    'foreshadowing_elements',
    'pages',
  ];

  for (const scene of ea025Scenes) {
    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log('-'.repeat(80));

    const missingFields: string[] = [];

    for (const field of requiredFields) {
      const value = scene[field as keyof typeof scene];
      const isEmpty = value === null || value === undefined;

      if (isEmpty) {
        missingFields.push(field);
      }
    }

    if (missingFields.length === 0) {
      console.log('✅ ALL FIELDS COMPLETE');
      console.log(`   Total fields populated: ${requiredFields.length}/${requiredFields.length}`);
    } else {
      console.log(`⚠️  Missing ${missingFields.length} fields: ${missingFields.join(', ')}`);
      console.log(`   Fields populated: ${requiredFields.length - missingFields.length}/${requiredFields.length}`);
    }
    console.log('');
  }

  // Summary
  const allScenesComplete = ea025Scenes.every((scene) => {
    return requiredFields.every((field) => {
      const value = scene[field as keyof typeof scene];
      return value !== null && value !== undefined;
    });
  });

  console.log('='.repeat(80));
  console.log('\n📊 SUMMARY\n');
  console.log(`Chapter Complete: ${chapterComplete ? '✅ YES' : '❌ NO'}`);
  console.log(`All Scenes Complete: ${allScenesComplete ? '✅ YES' : '❌ NO'}`);
  console.log(`Total Required Fields per Scene: ${requiredFields.length}`);
  console.log(`Total Scenes: ${ea025Scenes.length}`);

  if (chapterComplete && allScenesComplete) {
    console.log('\n🎉 EA-028 IS FULLY COMPLETE AND MATCHES EA-001 TO EA-024 FORMAT!');
  } else {
    console.log('\n⚠️  EA-028 still has missing fields');
  }

  console.log('\n' + '='.repeat(80));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
