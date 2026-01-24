import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log(`🔧 Fixing chapter_unique_identifier format...\n`);

  // Fix EA-284
  const [chapter284] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 284)).limit(1);
  if (chapter284) {
    const scenes284 = await db.select().from(scenes).where(eq(scenes.chapterId, chapter284.id));
    for (const scene of scenes284) {
      await db.update(scenes)
        .set({ chapterUniqueIdentifier: 'EA-284' })
        .where(eq(scenes.id, scene.id));
    }
    console.log(`✅ Fixed ${scenes284.length} EA-284 scenes to use EA-284`);
  }

  // Fix EA-285
  const [chapter285] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 285)).limit(1);
  if (chapter285) {
    const scenes285 = await db.select().from(scenes).where(eq(scenes.chapterId, chapter285.id));
    for (const scene of scenes285) {
      await db.update(scenes)
        .set({ chapterUniqueIdentifier: 'EA-285' })
        .where(eq(scenes.id, scene.id));
    }
    console.log(`✅ Fixed ${scenes285.length} EA-285 scenes to use EA-285`);
  }

  console.log(`\n✅ All scenes updated with correct EA-ID format`);
}

main().then(() => process.exit(0)).catch((e) => { console.error('❌', e); process.exit(1); });
