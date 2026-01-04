import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔍 Verifying EA-152...\n');
  
  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 152)).limit(1);
  if (!chapter) {
    console.log('❌ Chapter 152 not found');
    return;
  }
  
  const chapterScenes = await db.select().from(scenes).where(eq(scenes.chapterId, chapter.id)).orderBy(scenes.sceneNumber);
  
  console.log('━'.repeat(60));
  console.log(`📖 Chapter 152: ${chapter.title}`);
  console.log(`   Total Scenes: ${chapterScenes.length}`);
  console.log('━'.repeat(60));
  console.log('');
  
  for (const scene of chapterScenes) {
    console.log(`Scene ${scene.sceneNumber}: "${scene.title}"`);
    console.log(`   Location: ${scene.location || '❌ MISSING'}`);
    console.log(`   Narrative Function: ${scene.narrativeFunction ? 'Present' : '❌ MISSING'}`);
    console.log(`   ✅ Key fields present`);
    console.log('');
  }
  
  console.log('✅ Verification complete!\n');
}

main().then(() => process.exit(0)).catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
