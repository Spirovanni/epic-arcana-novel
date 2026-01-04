import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🗑️  Deleting existing EA-143 scenes...\n');
  
  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 143)).limit(1);
  if (!chapter) {
    console.log('❌ Chapter 143 not found');
    return;
  }
  
  // Delete existing scenes
  const deleted = await db.delete(scenes).where(eq(scenes.chapterId, chapter.id));
  console.log(`✅ Deleted existing scenes for Chapter 143\n`);
  
  console.log('Now run: npx tsx scripts/import-scenes-to-existing-chapters.ts 143');
}

main().then(() => process.exit(0)).catch((error) => { console.error('❌ Error:', error); process.exit(1); });
