import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';
async function main() {
  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 153)).limit(1);
  if (chapter) await db.delete(scenes).where(eq(scenes.chapterId, chapter.id));
  console.log('✅ Ready for EA-153 import');
}
main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
