import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔍 Verifying chapters 77, 78, 80, 93 with scenes...\n');

  const chapterNumbers = [77, 78, 80, 93];

  for (const chapterNum of chapterNumbers) {
    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, chapterNum))
      .limit(1);

    if (!chapter) {
      console.log(`❌ Chapter ${chapterNum} not found`);
      continue;
    }

    const chapterScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapter.id))
      .orderBy(scenes.sceneNumber);

    console.log(`📖 Chapter ${chapterNum}: ${chapter.title}`);
    console.log(`   Unique Identifier: ${chapter.uniqueIdentifier}`);
    console.log(`   Scenes: ${chapterScenes.length}`);

    for (const scene of chapterScenes) {
      console.log(`      Scene ${scene.sceneNumber}: ${scene.title}`);
      console.log(`         POV: ${scene.pov || 'N/A'}`);
      console.log(`         Location: ${scene.location || 'N/A'}`);
      console.log(`         Card: ${scene.sceneCardProgression || 'N/A'}`);
    }
    console.log('');
  }

  console.log('✅ Verification complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
