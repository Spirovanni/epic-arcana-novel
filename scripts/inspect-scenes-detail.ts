import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';

async function main() {
  const allScenes = await db.select().from(scenes);
  
  console.log(`Total scenes: ${allScenes.length}\n`);

  console.log('First 5 scenes:');
  allScenes.slice(0, 5).forEach(scene => {
    console.log(`\nScene ID: ${scene.id}`);
    console.log(`  Title: ${scene.title}`);
    console.log(`  chapterNumber: ${scene.chapterNumber}`);
    console.log(`  sceneNumber: ${scene.sceneNumber}`);
    console.log(`  chapterId: ${scene.chapterId}`);
    console.log(`  chapterUniqueIdentifier: ${scene.chapterUniqueIdentifier}`);
    console.log(`  timeline_date: ${scene.timeline_date}`);
  });

  // Look for scenes with EA chapter identifiers
  const eaScenes = allScenes.filter(scene =>
    scene.chapterUniqueIdentifier && scene.chapterUniqueIdentifier.startsWith('EA-')
  );

  console.log(`\n\nEA scenes: ${eaScenes.length}`);
  console.log('\nFirst 10 EA scenes:');
  eaScenes.slice(0, 10).forEach(scene => {
    console.log(`\n  ${scene.chapterUniqueIdentifier} - S${scene.sceneNumber}: ${scene.title}`);
    console.log(`    Timeline: ${scene.timeline_date}`);
  });

  console.log('\n\nLast 10 EA scenes:');
  eaScenes.slice(-10).forEach(scene => {
    console.log(`\n  ${scene.chapterUniqueIdentifier} - S${scene.sceneNumber}: ${scene.title}`);
    console.log(`    Timeline: ${scene.timeline_date}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
