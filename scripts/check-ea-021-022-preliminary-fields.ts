import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { inArray } from 'drizzle-orm';

async function main() {
  console.log('🔍 Checking preliminary fields format from EA-021 and EA-022...\n');

  const sampleScenes = await db
    .select({
      chapterUniqueIdentifier: scenes.chapterUniqueIdentifier,
      sceneNumber: scenes.sceneNumber,
      title: scenes.title,
      focus: scenes.focus,
      preliminarySceneFocus: scenes.preliminarySceneFocus,
      preliminarySceneDescription: scenes.preliminarySceneDescription,
    })
    .from(scenes)
    .where(inArray(scenes.chapterUniqueIdentifier, ['EA-021', 'EA-022']));

  for (const scene of sampleScenes) {
    console.log('='.repeat(80));
    console.log(`\n${scene.chapterUniqueIdentifier} - Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log('-'.repeat(80));
    console.log(`\nFocus:\n${scene.focus || '❌ NULL'}`);
    console.log(`\nPreliminary Scene Focus:\n${scene.preliminarySceneFocus || '❌ NULL'}`);
    console.log(`\nPreliminary Scene Description:\n${scene.preliminarySceneDescription?.substring(0, 300) || '❌ NULL'}...`);
    console.log('\n');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
