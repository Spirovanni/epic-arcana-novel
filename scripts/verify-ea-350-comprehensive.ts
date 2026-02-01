import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const chapterNumber = 350;
  const eaId = 'EA-350';
  const expectedSceneCount = 4;

  console.log(`🔍 Verifying ${eaId} comprehensive enhanced scenes...\n`);

  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, chapterNumber)).limit(1);
  if (!chapter) throw new Error(`Chapter ${chapterNumber} not found`);

  console.log(`✅ Chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  const chapterScenes = await db.select().from(scenes).where(eq(scenes.chapterId, chapter.id)).orderBy(scenes.sceneNumber);
  console.log(`✅ Found ${chapterScenes.length} scenes\n`);

  if (chapterScenes.length !== expectedSceneCount) throw new Error(`Expected ${expectedSceneCount}, found ${chapterScenes.length}`);

  for (const scene of chapterScenes) {
    console.log(`📝 Scene ${scene.sceneNumber}: ${scene.title}`);

    // Required fields check
    const requiredFields = [
      'location',
      'timeline_variant',
      'pov',
      'tense',
      'core_emotion',
      'scene_tone',
      'focus',
      'setup',
      'description',
      'chapterSceneFocus',
      'beatGoal',
      'symbolism',
      'timeline_date',
      'realWorldContext',
      'timelineSignificance',
      'chronologicalSequence',
      'sceneCardProgression',
      'narrativeFunction',
      'saveTheCatBeat',
      'characterGrowthElement',
      'seriesConnectionResonance',
      'sensoryDetail',
      'internalConflict',
      'pages'
    ];

    const missingFields: string[] = [];
    for (const field of requiredFields) {
      const value = (scene as any)[field];
      if (value === null || value === undefined || value === '') {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      console.log(`   ❌ Missing required fields: ${missingFields.join(', ')}`);
      throw new Error(`Scene ${scene.sceneNumber} missing required fields`);
    }

    // Validate JSONB fields (already parsed as objects by ORM)
    const jsonFields = ['sudowrite_metadata', 'learning_objectives', 'foreshadowing_elements'];
    for (const field of jsonFields) {
      const value = (scene as any)[field];
      if (value) {
        // JSONB fields are already parsed objects, not strings
        if (typeof value === 'object') {
          console.log(`   ✅ ${field}: Valid object`);
        } else {
          console.log(`   ❌ ${field}: Not an object (${typeof value})`);
          throw new Error(`Scene ${scene.sceneNumber} has invalid type for ${field}`);
        }
      }
    }

    // Field-specific validations
    const timelineVariant = (scene as any).timeline_variant;
    if (!scene.location || !timelineVariant) {
      throw new Error(`Scene ${scene.sceneNumber} missing location or timeline_variant`);
    }

    console.log(`   ✅ Location: ${scene.location}`);
    console.log(`   ✅ Timeline Variant: ${timelineVariant}`);
    console.log(`   ✅ Timeline Date: ${(scene as any).timeline_date}`);
    console.log(`   ✅ Focus: ${scene.focus?.length || 0} chars`);

    if (scene.focus && scene.focus.length > 255) {
      throw new Error(`Scene ${scene.sceneNumber} focus exceeds 255 characters: ${scene.focus.length}`);
    }

    console.log(`   ✅ CSF: ${scene.chapterSceneFocus?.startsWith(`Ch${chapterNumber}S`) ? 'Valid' : 'Check'}`);
    console.log(`   ✅ beatGoal: ${scene.beatGoal ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ✅ pov: ${scene.pov ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ✅ tense: ${scene.tense ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ✅ core_emotion: ${scene.core_emotion ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ✅ scene_tone: ${scene.scene_tone ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ✅ sensoryDetail: ${scene.sensoryDetail ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ✅ internalConflict: ${scene.internalConflict ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ✅ realWorldContext: ${scene.realWorldContext ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ✅ timelineSignificance: ${scene.timelineSignificance ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ✅ chronologicalSequence: ${scene.chronologicalSequence || 'Missing'}`);
    console.log(`   ✅ sceneCardProgression: ${scene.sceneCardProgression || 'Missing'}`);
    console.log(`   ✅ narrativeFunction: ${scene.narrativeFunction ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ✅ saveTheCatBeat: ${scene.saveTheCatBeat ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ✅ characterGrowthElement: ${scene.characterGrowthElement ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ✅ seriesConnectionResonance: ${scene.seriesConnectionResonance ? '✅ Set' : '❌ Missing'}`);
    console.log(`   ✅ pages: ${scene.pages ? '✅ Set' : '❌ Missing'}`);

    // Check nullable fields
    console.log(`   ℹ️  temporalPowerManifested: ${(scene as any).temporal_power_manifested !== undefined ? ((scene as any).temporal_power_manifested || 'null') : 'undefined'}`);
    console.log(`   ℹ️  storySequence: ${(scene as any).story_sequence !== undefined ? ((scene as any).story_sequence || 'null') : 'undefined'}`);

    console.log('');
  }

  console.log(`✨ Comprehensive Verification Complete!`);
  console.log(`   ✅ All ${expectedSceneCount} scenes verified`);
  console.log(`   ✅ All required fields populated`);
  console.log(`   ✅ All JSON fields valid\n`);

  chapterScenes.forEach((s) => console.log(`  ${s.sceneNumber}. ${s.title}`));
}

main().then(() => process.exit(0)).catch((e) => { console.error('❌', e.message); process.exit(1); });
