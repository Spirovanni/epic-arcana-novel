import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { inArray } from 'drizzle-orm';

async function main() {
  console.log('🔍 Checking save_the_cat_beat format from EA-021 to EA-023...\n');

  const sampleScenes = await db
    .select({
      chapterUniqueIdentifier: scenes.chapterUniqueIdentifier,
      sceneNumber: scenes.sceneNumber,
      title: scenes.title,
      saveTheCatBeat: scenes.saveTheCatBeat,
    })
    .from(scenes)
    .where(inArray(scenes.chapterUniqueIdentifier, ['EA-021', 'EA-022', 'EA-023']));

  console.log('='.repeat(80));
  for (const scene of sampleScenes) {
    console.log(`${scene.chapterUniqueIdentifier} - Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`save_the_cat_beat: ${scene.saveTheCatBeat || '❌ NULL'}`);
    console.log('-'.repeat(80));
  }

  // Check EA-024
  console.log('\n📖 EA-024 Current Status:\n');
  const ea024Scenes = await db
    .select({
      sceneNumber: scenes.sceneNumber,
      title: scenes.title,
      saveTheCatBeat: scenes.saveTheCatBeat,
    })
    .from(scenes)
    .where(inArray(scenes.chapterUniqueIdentifier, ['EA-024']));

  for (const scene of ea024Scenes) {
    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`save_the_cat_beat: ${scene.saveTheCatBeat || '❌ NULL (needs to be filled)'}`);
    console.log('');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
