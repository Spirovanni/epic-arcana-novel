import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, inArray } from 'drizzle-orm';

/**
 * Check "focus" and "preliminary_scene_description" columns for EA-211 to EA-213
 */

async function main() {
  console.log(`🔍 Checking "focus" and "preliminary_scene_description" for EA-211 to EA-213...\n`);

  // Reference chapters to show expected format
  const referenceChapterNumbers = [123, 199];
  const targetChapterNumbers = [211, 212, 213];
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
      console.log(`\n   Scene ${scene.sceneNumber}: ${scene.title}`);
      
      const focus = scene.focus || '(null)';
      const focusStatus = focus.length > 150 ? '✅' : '❌';
      console.log(`   ${focusStatus} Focus (${focus.length} chars): "${focus.substring(0, 120)}..."`);
      
      const psd = scene.preliminarySceneDescription || '(null)';
      const psdStatus = psd.length > 200 ? '✅' : '❌';
      console.log(`   ${psdStatus} Prelim Desc (${psd.length} chars): "${psd.substring(0, 120)}..."`);
    }
    console.log('');
  }

  console.log('\n📊 Format Analysis:\n');
  console.log('Focus format: [Character] [action/framework]—[detailed mechanism and implications]');
  console.log('Prelim Desc format: [Beat/Phase] where [context]—[framework details]. [Development].');
  console.log('Reference chapters show the expected format.');
  console.log('Target chapters (211-213) will be fixed if needed.\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
