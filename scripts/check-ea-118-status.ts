import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.chapterNumber, 118))
    .limit(1);

  if (!chapter) {
    console.log('❌ Chapter 118 not found in database');
    return;
  }

  const chapterScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(scenes.sceneNumber);

  console.log(`📖 Chapter 118: ${chapter.title}`);
  console.log(`   Unique Identifier: ${chapter.uniqueIdentifier}`);
  console.log(`   Scenes in database: ${chapterScenes.length}\n`);

  if (chapterScenes.length > 0) {
    chapterScenes.forEach(s => {
      console.log(`Scene ${s.sceneNumber}: "${s.title}"`);
      console.log(`   Card: ${s.sceneCardProgression || 'N/A'}`);
      console.log(`   Pages: ${s.pages || 'N/A'}`);
      console.log(`   Location: ${s.location || 'MISSING'}`);
      console.log(`   Timeline: ${s.timeline_date || 'N/A'}`);
      console.log('');
    });
  } else {
    console.log('⚠️  No scenes found in database - needs import');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
