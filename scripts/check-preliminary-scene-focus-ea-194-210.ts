import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, inArray } from 'drizzle-orm';

/**
 * Check "preliminary_scene_focus" column format for EA-194 to EA-210
 */

async function main() {
  console.log(`🔍 Checking "preliminary_scene_focus" column format for EA-194 to EA-210...\n`);

  // Reference chapters to show expected format
  const referenceChapterNumbers = [123, 124, 125, 126, 127];
  const targetChapterNumbers = [194, 195, 198, 199, 205, 206, 207, 208, 209, 210];
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
    console.log(`   EA ID: EA-${chapter.chapterNumber!.toString().padStart(3, '0')}`);

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
      const psf = scene.preliminarySceneFocus || '(null)';
      console.log(`   Scene ${scene.sceneNumber}: "${psf}"`);
    }
    console.log('');
  }

  console.log('\n📊 Format Analysis:\n');
  console.log('Reference chapters (123-127) show the expected format for "preliminary_scene_focus".');
  console.log('Target chapters (194-210) will be checked and fixed if needed.\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
