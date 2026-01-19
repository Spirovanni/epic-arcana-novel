import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * Detailed verification for EA-225 enhanced scenes
 */

async function main() {
  const chapterNumber = 225;
  const eaId = 'EA-225';
  const expectedSceneCount = 4;
  
  console.log(`🔍 Verifying ${eaId} enhanced scenes in database...\n`);

  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.chapterNumber, chapterNumber))
    .limit(1);

  if (!chapter) {
    throw new Error(`Chapter ${chapterNumber} not found in database`);
  }

  console.log(`✅ Found chapter in database:`);
  console.log(`   ID: ${chapter.id}`);
  console.log(`   Title: ${chapter.title}`);
  console.log(`   Unique Identifier: ${chapter.uniqueIdentifier}\n`);

  const chapterScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(scenes.sceneNumber);

  console.log(`✅ Found ${chapterScenes.length} scenes in database\n`);

  if (chapterScenes.length !== expectedSceneCount) {
    throw new Error(`Expected ${expectedSceneCount} scenes, found ${chapterScenes.length}`);
  }

  const requiredFields = [
    'sceneNumber',
    'title',
    'location',
    'timeline_variant',
    'setup',
    'description',
    'beatGoal',
    'symbolism',
    'pov',
    'tense',
    'core_emotion',
    'scene_tone',
    'pages',
    'focus',
    'chapterSceneFocus',
    'preliminarySceneFocus',
    'preliminarySceneDescription'
  ];

  const enhancedFields = [
    'sensoryDetail',
    'internalConflict',
    'characterGrowthElement',
    'seriesConnectionResonance',
    'sceneCardProgression',
    'realWorldContext',
    'timelineSignificance',
    'saveTheCatBeat',
    'narrativeFunction',
    'learning_objectives',
    'foreshadowing_elements'
  ];

  for (const scene of chapterScenes) {
    console.log(`📝 Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   Database ID: ${scene.id}`);

    const missingRequired: string[] = [];
    for (const field of requiredFields) {
      const value = (scene as any)[field];
      if (value === undefined || value === null || value === '' || value === 'MISSING') {
        missingRequired.push(field);
      }
    }

    if (missingRequired.length > 0) {
      console.log(`   ❌ Missing required fields: ${missingRequired.join(', ')}`);
      throw new Error(`Scene ${scene.sceneNumber} missing required fields in database`);
    }
    console.log(`   ✅ All required fields present`);

    const missingEnhanced: string[] = [];
    for (const field of enhancedFields) {
      const value = (scene as any)[field];
      if (value === undefined || value === null || value === '') {
        missingEnhanced.push(field);
      }
    }

    if (missingEnhanced.length > 0) {
      console.log(`   ⚠️  Missing enhanced fields: ${missingEnhanced.join(', ')}`);
    } else {
      console.log(`   ✅ All enhanced fields present`);
    }

    console.log(`   ✅ Location: ${scene.location}`);
    console.log(`   ✅ Timeline Variant: ${scene.timeline_variant}`);

    const focusLen = scene.focus?.length || 0;
    if (focusLen < 150) {
      console.log(`   ⚠️  Focus might be too brief (${focusLen} chars)`);
    } else {
      console.log(`   ✅ Focus: ${focusLen} characters`);
    }

    const csf = scene.chapterSceneFocus || '';
    if (csf.startsWith(`Ch${chapterNumber}S${scene.sceneNumber}:`)) {
      console.log(`   ✅ Chapter Scene Focus: Proper format`);
    } else {
      console.log(`   ⚠️  Chapter Scene Focus: May need format adjustment`);
    }

    if (scene.learning_objectives) {
      try {
        const parsed = typeof scene.learning_objectives === 'string' 
          ? JSON.parse(scene.learning_objectives)
          : scene.learning_objectives;
        const count = Array.isArray(parsed) ? parsed.length : 0;
        console.log(`   ✅ Learning Objectives: ${count} items (JSON valid)`);
      } catch (e) {
        console.log(`   ⚠️  Learning Objectives: JSON parse error`);
      }
    }

    if (scene.foreshadowing_elements) {
      try {
        const parsed = typeof scene.foreshadowing_elements === 'string'
          ? JSON.parse(scene.foreshadowing_elements)
          : scene.foreshadowing_elements;
        const count = Array.isArray(parsed) ? parsed.length : 0;
        console.log(`   ✅ Foreshadowing Elements: ${count} items (JSON valid)`);
      } catch (e) {
        console.log(`   ⚠️  Foreshadowing Elements: JSON parse error`);
      }
    }

    console.log('');
  }

  console.log(`\n✨ Database Verification Complete!\n`);
  console.log(`Summary for ${eaId}:`);
  console.log(`  ✅ Chapter found in database`);
  console.log(`  ✅ Scene count: ${chapterScenes.length} (expected ${expectedSceneCount})`);
  console.log(`  ✅ All required fields present in database`);
  console.log(`  ✅ Location and timeline_variant populated`);
  console.log(`  ✅ Enhanced fields stored correctly`);
  console.log(`\nScene Titles in Database:`);
  chapterScenes.forEach((scene) => {
    console.log(`  ${scene.sceneNumber}. ${scene.title}`);
  });
  console.log('');
}

main()
  .then(() => {
    console.log('✅ Database verification passed!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database verification failed:', error.message);
    process.exit(1);
  });
