import { db } from '../src/lib/db';
import { scenes, chapters } from '../src/lib/schema';
import { eq, lte } from 'drizzle-orm';

async function main() {
  console.log('📅 Checking Book 1 timeline dates...\n');

  // Get all scenes
  const allScenes = await db.select().from(scenes);

  // Filter Book 1 scenes (chapters 1-39)
  const book1Scenes = allScenes.filter(scene =>
    scene.chapterNumber && scene.chapterNumber <= 39
  );

  const sortedBook1 = book1Scenes
    .sort((a, b) => {
      if (a.chapterNumber !== b.chapterNumber) {
        return (a.chapterNumber || 0) - (b.chapterNumber || 0);
      }
      return (a.sceneNumber || 0) - (b.sceneNumber || 0);
    });

  // Show last 20 scenes
  const lastScenes = sortedBook1.slice(-20);
  console.log('Last 20 scenes of Book 1:');
  lastScenes.forEach(scene => {
    console.log(`Ch${scene.chapterNumber}S${scene.sceneNumber}: ${scene.timeline_date}`);
  });

  // Get Book 2 scenes (chapters 40+)
  const book2Scenes = allScenes
    .filter(scene => scene.chapterNumber && scene.chapterNumber >= 40)
    .sort((a, b) => {
      if (a.chapterNumber !== b.chapterNumber) {
        return (a.chapterNumber || 0) - (b.chapterNumber || 0);
      }
      return (a.sceneNumber || 0) - (b.sceneNumber || 0);
    });

  console.log(`\n📊 Total Book 2 scenes to update: ${book2Scenes.length}\n`);
  console.log('Current Book 2 timeline_date values:');
  book2Scenes.forEach(scene => {
    console.log(`Ch${scene.chapterNumber}S${scene.sceneNumber}: ${scene.timelineDate}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
