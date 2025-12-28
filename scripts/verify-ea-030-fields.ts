import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';

async function main() {
  console.log('📊 Verifying EA-030 scene fields...\n');

  const ea030Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterUniqueIdentifier, 'EA-030'))
    .orderBy(scenes.sceneNumber);

  const allFields = [
    'title',
    'setup',
    'symbolism',
    'beatGoal',
    'pov',
    'tense',
    'coreEmotion',
    'sceneTone',
    'timelineDate',
    'timelineVariant',
    'location',
    'pages',
    'description',
    'focus',
    'chapterSceneFocus',
    'preliminarySceneFocus',
    'preliminarySceneDescription',
    'narrativeFunction',
    'sensoryDetail',
    'internalConflict',
    'characterGrowthElement',
    'seriesConnectionResonance',
    'sceneCardProgression',
    'realWorldContext',
    'timelineSignificance',
    'saveTheCatBeat',
    'sudowriteMetadata',
    'learningObjectives',
    'foreshadowingElements',
  ];

  for (const scene of ea030Scenes) {
    console.log(`\nScene ${scene.sceneNumber}: ${scene.title}`);
    console.log('='.repeat(50));

    const missingFields: string[] = [];
    const presentFields: string[] = [];

    for (const field of allFields) {
      const value = (scene as any)[field];
      if (value === null || value === undefined) {
        missingFields.push(field);
      } else {
        presentFields.push(field);
      }
    }

    console.log(`✅ Present fields (${presentFields.length}/${allFields.length}):`);
    presentFields.forEach((f) => console.log(`   - ${f}`));

    if (missingFields.length > 0) {
      console.log(`\n❌ Missing fields (${missingFields.length}):`);
      missingFields.forEach((f) => console.log(`   - ${f}`));
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
