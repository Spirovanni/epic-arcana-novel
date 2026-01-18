import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, inArray } from 'drizzle-orm';

/**
 * Check chapter_scene_focus format for EA-210
 */

async function main() {
  console.log(`🔍 Checking chapter_scene_focus format for EA-210...\n`);

  // Reference chapters to show expected format
  const referenceChapterNumbers = [123, 199];
  const targetChapterNumbers = [210];
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
      const csf = scene.chapterSceneFocus || '(null)';
      const hasPrefix = csf.startsWith(`Ch${chapter.chapterNumber}S${scene.sceneNumber}:`);
      const status = hasPrefix ? '✅' : '❌';
      console.log(`   ${status} Scene ${scene.sceneNumber}: "${csf}"`);
    }
    console.log('');
  }

  console.log('\n📊 Format Analysis:\n');
  console.log('Expected format: Ch[NUM]S[SCENE]: [Description]—[Framework details]');
  console.log('Reference chapters show the correct format.');
  console.log('Target chapter (210) will be checked and fixed if needed.\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
