import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';
async function main() {
  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 148)).limit(1);
  if (!chapter) { console.log('Chapter 148 not found'); return; }
  await db.delete(scenes).where(eq(scenes.chapterId, chapter.id));
  console.log('✅ Deleted EA-148 scenes');
}
main().then(() => process.exit(0)).catch((error) => { console.error('Error:', error); process.exit(1); });
