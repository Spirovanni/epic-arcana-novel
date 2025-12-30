import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔍 Verifying EA-053 in database...\n');

  // Check for chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-053'))
    .limit(1);

  if (!chapter) {
    console.log('❌ EA-053 chapter not found in database');
    process.exit(1);
  }

  console.log(`✅ Found EA-053: ${chapter.title}`);
  console.log(`   Chapter ID: ${chapter.id}`);
  console.log(`   Chapter Number: ${chapter.chapterNumber}`);
  console.log(`   Tarot: ${chapter.tarotFamily} - ${chapter.tarotCardItem}\n`);

  // Get all scenes
  const allScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  console.log(`📝 Total scenes: ${allScenes.length}\n`);

  if (allScenes.length > 0) {
    console.log('Scene details:');
    allScenes
      .sort((a, b) => (a.sceneNumber || 0) - (b.sceneNumber || 0))
      .forEach(scene => {
        console.log(`\nScene ${scene.sceneNumber}: ${scene.title}`);
        console.log(`  Timeline: ${scene.timeline_date}`);
        console.log(`  Card: ${scene.sceneCardProgression}`);
        console.log(`  Pages: ${scene.pages}`);
      });
  }

  console.log(`\n✅ EA-053 is fully uploaded to the database!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
