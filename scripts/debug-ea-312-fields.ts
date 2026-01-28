import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const chapterNumber = 312;

  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, chapterNumber)).limit(1);
  if (!chapter) throw new Error(`Chapter ${chapterNumber} not found`);

  console.log(`Chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  const chapterScenes = await db.select().from(scenes).where(eq(scenes.chapterId, chapter.id)).orderBy(scenes.sceneNumber);

  for (const scene of chapterScenes) {
    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`  location: ${scene.location || 'NULL'}`);
    console.log(`  timelineVariant: ${scene.timelineVariant || 'NULL'}`);
    console.log(`  timeline_variant (raw): ${(scene as any).timeline_variant || 'NULL'}`);
    console.log('');
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error('❌', e); process.exit(1); });
