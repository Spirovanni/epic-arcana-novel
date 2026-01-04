import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 141)).limit(1);
  if (!chapter) { console.log('❌ Chapter 141 not found'); return; }
  console.log(`📖 Found: ${chapter.title}`);
  await db.delete(scenes).where(eq(scenes.chapterId, chapter.id));
  console.log('✅ Deleted existing scenes');
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
