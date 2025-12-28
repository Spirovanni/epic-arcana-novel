import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { inArray } from 'drizzle-orm';

async function main() {
  console.log('🔍 Checking focus field format in EA-001 to EA-022...\n');

  // Get some sample scenes
  const sampleScenes = await db
    .select({
      chapterUniqueIdentifier: scenes.chapterUniqueIdentifier,
      sceneNumber: scenes.sceneNumber,
      title: scenes.title,
      focus: scenes.focus,
    })
    .from(scenes)
    .where(inArray(scenes.chapterUniqueIdentifier, ['EA-001', 'EA-002', 'EA-003', 'EA-020', 'EA-021', 'EA-022']))
    .limit(15);

  for (const scene of sampleScenes) {
    console.log(`${scene.chapterUniqueIdentifier} - Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`Focus: ${scene.focus || '❌ NULL'}`);
    console.log('-'.repeat(80));
  }

  // Check EA-023
  console.log('\n📖 EA-023 Current Status:\n');
  const ea023Scenes = await db
    .select({
      sceneNumber: scenes.sceneNumber,
      title: scenes.title,
      focus: scenes.focus,
    })
    .from(scenes)
    .where(inArray(scenes.chapterUniqueIdentifier, ['EA-023']));

  for (const scene of ea023Scenes) {
    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`Focus: ${scene.focus || '❌ NULL (needs to be filled)'}`);
    console.log('');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
