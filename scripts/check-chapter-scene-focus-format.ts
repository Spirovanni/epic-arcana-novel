import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { inArray } from 'drizzle-orm';

async function main() {
  console.log('🔍 Checking chapter_scene_focus format from EA-021 and EA-022...\n');

  const sampleScenes = await db
    .select({
      chapterUniqueIdentifier: scenes.chapterUniqueIdentifier,
      sceneNumber: scenes.sceneNumber,
      title: scenes.title,
      chapterSceneFocus: scenes.chapterSceneFocus,
    })
    .from(scenes)
    .where(inArray(scenes.chapterUniqueIdentifier, ['EA-021', 'EA-022']));

  console.log('='.repeat(80));
  for (const scene of sampleScenes) {
    console.log(`${scene.chapterUniqueIdentifier} - Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`chapter_scene_focus: ${scene.chapterSceneFocus || '❌ NULL'}`);
    console.log('-'.repeat(80));
  }

  // Check EA-023
  console.log('\n📖 EA-023 Current Status:\n');
  const ea023Scenes = await db
    .select({
      sceneNumber: scenes.sceneNumber,
      title: scenes.title,
      chapterSceneFocus: scenes.chapterSceneFocus,
    })
    .from(scenes)
    .where(inArray(scenes.chapterUniqueIdentifier, ['EA-023']));

  for (const scene of ea023Scenes) {
    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`chapter_scene_focus: ${scene.chapterSceneFocus || '❌ NULL (needs to be filled)'}`);
    console.log('');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
