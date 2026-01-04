import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, asc } from 'drizzle-orm';

async function getFirst50Scenes() {
  console.log('📖 Fetching first 50 scenes...\n');

  // Get all scenes ordered by chapter and scene number
  const allScenes = await db
    .select({
      sceneId: scenes.id,
      sceneNumber: scenes.sceneNumber,
      chapterId: scenes.chapterId,
      title: scenes.title,
      setup: scenes.setup,
      description: scenes.description,
      focus: scenes.focus,
      internalConflict: scenes.internalConflict,
      characterGrowthElement: scenes.characterGrowthElement,
      pov: scenes.pov
    })
    .from(scenes)
    .orderBy(asc(scenes.chapterId), asc(scenes.sceneNumber))
    .limit(50);

  // Get chapter info for each scene
  for (let i = 0; i < Math.min(allScenes.length, 10); i++) {
    const scene = allScenes[i];
    const [chapter] = await db
      .select({ chapterNumber: chapters.chapterNumber, chapterTitle: chapters.title })
      .from(chapters)
      .where(eq(chapters.id, scene.chapterId))
      .limit(1);

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Scene ${i + 1}: Chapter ${chapter.chapterNumber} - ${chapter.chapterTitle}`);
    console.log(`Title: ${scene.title || 'Untitled'}`);
    console.log(`POV: ${scene.pov || 'N/A'}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    console.log(`\n📝 Setup (first 200 chars):`);
    console.log(scene.setup ? scene.setup.substring(0, 200) + '...' : 'N/A');

    console.log(`\n🎯 Focus (first 200 chars):`);
    console.log(scene.focus ? scene.focus.substring(0, 200) + '...' : 'N/A');

    console.log(`\n💭 Current Internal Conflict:`);
    console.log(scene.internalConflict || 'MISSING');
  }

  console.log(`\n\n✅ Displayed first ${Math.min(allScenes.length, 10)} of ${allScenes.length} scenes`);
  console.log(`\nTo see full analysis, review the scene data in the database.`);
}

getFirst50Scenes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
