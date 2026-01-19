import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, inArray } from 'drizzle-orm';

/**
 * Check "preliminary_scene_description" column format for EA-153 to EA-168
 */

async function main() {
  console.log(`🔍 Checking "preliminary_scene_description" column format for EA-153 to EA-168...\n`);

  // Reference chapters to show expected format
  const referenceChapterNumbers = [123, 124, 125];
  const targetChapterNumbers = [153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168];
  const allChapterNumbers = [...referenceChapterNumbers, ...targetChapterNumbers];

  const allChapters = await db
    .select()
    .from(chapters)
    .where(inArray(chapters.chapterNumber, allChapterNumbers))
    .orderBy(chapters.chapterNumber);

  console.log(`✅ Found ${allChapters.length} chapters\n`);

  // Examine scenes for each chapter
  for (const chapter of allChapters) {
    const isTarget = targetChapterNumbers.includes(chapter.chapterNumber!);
    const prefix = isTarget ? '🎯' : '📖';
    
    console.log(`${prefix} Chapter ${chapter.chapterNumber}: ${chapter.title}`);

    const chapterScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapter.id))
      .orderBy(scenes.sceneNumber);

    if (chapterScenes.length === 0) {
      console.log(`   ⚠️  No scenes found\n`);
      continue;
    }

    console.log(`   Scenes: ${chapterScenes.length}`);
    
    for (const scene of chapterScenes) {
      const psd = scene.preliminarySceneDescription || '(null)';
      const length = psd === '(null)' ? 0 : psd.length;
      console.log(`   Scene ${scene.sceneNumber}: ${length} chars - "${psd.substring(0, 100)}..."`);
    }
    console.log('');
  }

  console.log('\n📊 Format Analysis:\n');
  console.log('Reference chapters (123-125) show the expected format.');
  console.log('Target chapters (153-168) will be checked and fixed if needed.\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
