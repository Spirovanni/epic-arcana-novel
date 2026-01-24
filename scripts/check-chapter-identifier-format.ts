import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, sql } from 'drizzle-orm';

async function main() {
  console.log(`🔍 Checking chapter_unique_identifier format...\n`);

  // Check EA-284
  const [chapter284] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 284)).limit(1);
  if (chapter284) {
    const scenes284 = await db.select().from(scenes).where(eq(scenes.chapterId, chapter284.id)).limit(1);
    if (scenes284.length > 0) {
      console.log(`EA-284 scene chapter_unique_identifier: ${scenes284[0].chapterUniqueIdentifier}`);
      console.log(`Expected: EA-284\n`);
    }
  }

  // Check EA-285
  const [chapter285] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 285)).limit(1);
  if (chapter285) {
    const scenes285 = await db.select().from(scenes).where(eq(scenes.chapterId, chapter285.id)).limit(1);
    if (scenes285.length > 0) {
      console.log(`EA-285 scene chapter_unique_identifier: ${scenes285[0].chapterUniqueIdentifier}`);
      console.log(`Expected: EA-285\n`);
    }
  }

  // Get max scene_card_progression
  const maxResult = await db.execute(sql`SELECT MAX(scene_card_progression) as max_prog FROM scenes`);
  console.log(`Max scene_card_progression: ${maxResult.rows[0]?.max_prog || 0}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error('❌', e.message); process.exit(1); });
