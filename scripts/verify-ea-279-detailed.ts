import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const chapterNumber = 279;
  const eaId = 'EA-279';
  const expectedSceneCount = 3;
  
  console.log(`🔍 Verifying ${eaId} enhanced scenes...\n`);

  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, chapterNumber)).limit(1);
  if (!chapter) throw new Error(`Chapter ${chapterNumber} not found`);

  console.log(`✅ Chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  const chapterScenes = await db.select().from(scenes).where(eq(scenes.chapterId, chapter.id)).orderBy(scenes.sceneNumber);
  console.log(`✅ Found ${chapterScenes.length} scenes\n`);

  if (chapterScenes.length !== expectedSceneCount) throw new Error(`Expected ${expectedSceneCount}, found ${chapterScenes.length}`);

  for (const scene of chapterScenes) {
    console.log(`📝 Scene ${scene.sceneNumber}: ${scene.title}`);
    if (!scene.location || !scene.timeline_variant) throw new Error(`Scene ${scene.sceneNumber} missing required fields`);
    console.log(`   ✅ Location: ${scene.location}`);
    console.log(`   ✅ Timeline Variant: ${scene.timeline_variant}`);
    console.log(`   ✅ Focus: ${scene.focus?.length || 0} chars`);
    console.log(`   ✅ CSF: ${scene.chapterSceneFocus?.startsWith(`Ch${chapterNumber}S`) ? 'Valid' : 'Check'}\n`);
  }

  console.log(`✨ Verification Complete!\n  ✅ All ${expectedSceneCount} scenes verified\n`);
  chapterScenes.forEach((s) => console.log(`  ${s.sceneNumber}. ${s.title}`));
}

main().then(() => process.exit(0)).catch((e) => { console.error('❌', e.message); process.exit(1); });
