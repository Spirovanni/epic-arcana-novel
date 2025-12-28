import { db } from '../src/lib/db';
import { scenes, chapters } from '../src/lib/schema';

async function main() {
  console.log('📚 Checking chapters and scenes...\n');

  // Get all chapters
  const allChapters = await db.select().from(chapters);
  console.log(`Total chapters: ${allChapters.length}\n`);

  // Show chapters by book
  const book1Chapters = allChapters.filter(ch => ch.novelBook === 1);
  const book2Chapters = allChapters.filter(ch => ch.novelBook === 2);

  console.log(`Book 1 chapters: ${book1Chapters.length}`);
  console.log(`Book 2 chapters: ${book2Chapters.length}\n`);

  // Show first few Book 2 chapters
  console.log('First 5 Book 2 chapters:');
  book2Chapters.slice(0, 5).forEach(ch => {
    console.log(`  ${ch.uniqueIdentifier}: Ch${ch.chapterNumber} - ${ch.title}`);
  });

  // Get all scenes
  const allScenes = await db.select().from(scenes);
  console.log(`\nTotal scenes: ${allScenes.length}\n`);

  // Check which scenes belong to Book 2
  const book2ChapterIds = book2Chapters.map(ch => ch.id);
  const book2Scenes = allScenes.filter(scene => book2ChapterIds.includes(scene.chapterId));

  console.log(`Book 2 scenes: ${book2Scenes.length}\n`);

  if (book2Scenes.length > 0) {
    console.log('First 10 Book 2 scenes:');
    book2Scenes.slice(0, 10).forEach(scene => {
      const chapter = book2Chapters.find(ch => ch.id === scene.chapterId);
      console.log(`  Ch${scene.chapterNumber}S${scene.sceneNumber}: ${scene.title}`);
      console.log(`    Timeline: ${scene.timeline_date}`);
    });
  }

  // Check for Book 1 scenes to see date format
  const book1ChapterIds = book1Chapters.map(ch => ch.id);
  const book1Scenes = allScenes.filter(scene => book1ChapterIds.includes(scene.chapterId));

  console.log(`\nBook 1 scenes: ${book1Scenes.length}\n`);

  if (book1Scenes.length > 0) {
    console.log('Last 10 Book 1 scenes:');
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
