import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔍 Checking EA-100 and EA-101 scenes...\n');

  // Check EA-100 scenes
  console.log('📖 EA-100 Scenes:');
  const ea100Scenes = await db
    .select({
      id: scenes.id,
      sceneNumber: scenes.sceneNumber,
      title: scenes.title,
      pages: scenes.pages,
      description: scenes.description,
      focus: scenes.focus,
      sceneCardProgression: scenes.sceneCardProgression,
    })
    .from(scenes)
    .where(eq(scenes.chapterUniqueIdentifier, 'EA-100'))
    .orderBy(scenes.sceneNumber);

  for (const scene of ea100Scenes) {
    console.log(`\nScene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`  Pages: ${scene.pages || 'NULL'}`);
    console.log(`  Description: ${scene.description ? scene.description.substring(0, 80) + '...' : 'NULL'}`);
    console.log(`  Focus: ${scene.focus ? scene.focus.substring(0, 80) + '...' : 'NULL'}`);
    console.log(`  Scene Card: ${scene.sceneCardProgression || 'NULL'}`);
  }

  // Check EA-101 scenes
  console.log('\n\n📖 EA-101 Scenes:');
  const ea101Scenes = await db
    .select({
      id: scenes.id,
      sceneNumber: scenes.sceneNumber,
      title: scenes.title,
      pages: scenes.pages,
      description: scenes.description,
      focus: scenes.focus,
      sceneCardProgression: scenes.sceneCardProgression,
    })
    .from(scenes)
    .where(eq(scenes.chapterUniqueIdentifier, 'EA-101'))
    .orderBy(scenes.sceneNumber);

  for (const scene of ea101Scenes) {
    console.log(`\nScene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`  Pages: ${scene.pages || 'NULL'}`);
    console.log(`  Description: ${scene.description ? scene.description.substring(0, 80) + '...' : 'NULL'}`);
    console.log(`  Focus: ${scene.focus ? scene.focus.substring(0, 80) + '...' : 'NULL'}`);
    console.log(`  Scene Card: ${scene.sceneCardProgression || 'NULL'}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
