import { db } from '../src/lib/db';
import { scenes, chapters } from '../src/lib/schema';

async function main() {
  // Get a few sample chapters to see their structure
  const allChapters = await db.select().from(chapters);
  
  console.log('First 3 chapters:');
  allChapters.slice(0, 3).forEach(ch => {
    console.log(`\n${ch.uniqueIdentifier}: Ch${ch.chapterNumber} - ${ch.title}`);
    console.log(`  novelBook: ${ch.novelBook}`);
    console.log(`  bookId: ${ch.bookId}`);
  });

  console.log('\n\nChapters 40-45 (Book 2 start):');
  const book2StartChapters = allChapters.filter(ch =>
    ch.chapterNumber && ch.chapterNumber >= 40 && ch.chapterNumber <= 45
  );
  book2StartChapters.forEach(ch => {
    console.log(`\n${ch.uniqueIdentifier}: Ch${ch.chapterNumber} - ${ch.title}`);
    console.log(`  novelBook: ${ch.novelBook}`);
    console.log(`  bookId: ${ch.bookId}`);
  });

  // Get scenes from chapters 40-52
  const allScenes = await db.select().from(scenes);
  const book2Scenes = allScenes.filter(scene =>
    scene.chapterNumber && scene.chapterNumber >= 40 && scene.chapterNumber <= 52
  );

  console.log(`\n\nScenes in chapters 40-52: ${book2Scenes.length}`);
  if (book2Scenes.length > 0) {
    console.log('\nFirst 10 scenes:');
    book2Scenes.slice(0, 10).forEach(scene => {
      console.log(`  Ch${scene.chapterNumber}S${scene.sceneNumber}: ${scene.title}`);
      console.log(`    Timeline: ${scene.timeline_date}`);
    });
  }

  // Get some Book 1 scenes (chapters 1-39)
  const book1Scenes = allScenes.filter(scene =>
    scene.chapterNumber && scene.chapterNumber >= 1 && scene.chapterNumber <= 39
  );

  console.log(`\n\nBook 1 scenes (Ch1-39): ${book1Scenes.length}`);
  if (book1Scenes.length > 0) {
    console.log('\nLast 10 Book 1 scenes:');
    book1Scenes.slice(-10).forEach(scene => {
      console.log(`  Ch${scene.chapterNumber}S${scene.sceneNumber}: ${scene.title}`);
      console.log(`    Timeline: ${scene.timeline_date}`);
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
