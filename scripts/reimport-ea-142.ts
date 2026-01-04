import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';
async function main() {
  const [ch] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 142)).limit(1);
  if (!ch) { console.log('❌ Not found'); return; }
  await db.delete(scenes).where(eq(scenes.chapterId, ch.id));
  console.log('✅ Deleted');
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
