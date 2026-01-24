import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const chapterNumber = 284;
  console.log(`🔧 Fixing chapterUniqueIdentifier for EA-284...\n`);

  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, chapterNumber)).limit(1);
  if (!chapter) throw new Error(`Chapter ${chapterNumber} not found`);

  console.log(`✅ Found chapter: ${chapter.title}`);
  console.log(`   Unique Identifier: ${chapter.uniqueIdentifier}\n`);

  const chapterScenes = await db.select().from(scenes).where(eq(scenes.chapterId, chapter.id));
  console.log(`✅ Found ${chapterScenes.length} scenes to update\n`);

  for (const scene of chapterScenes) {
    await db.update(scenes)
      .set({
        chapterUniqueIdentifier: chapter.uniqueIdentifier,
        beatGoal: scene.beatGoal || 'Advance the narrative', // Ensure beatGoal is set
      })
      .where(eq(scenes.id, scene.id));
    console.log(`   ✅ Updated scene ${scene.sceneNumber}: ${scene.title}`);
  }

  console.log(`\n✅ All scenes updated with correct chapterUniqueIdentifier: ${chapter.uniqueIdentifier}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error('❌', e); process.exit(1); });
