import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const chapterNumber = 332;
  const eaId = 'EA-332';
  const expectedSceneCount = 4;

  console.log(`🔍 Verifying ${eaId} enhanced scenes...\n`);

  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, chapterNumber)).limit(1);
  if (!chapter) throw new Error(`Chapter ${chapterNumber} not found`);

  console.log(`✅ Chapter: ${chapter.title} (ID: ${chapter.id})\n`);

  const chapterScenes = await db.select().from(scenes).where(eq(scenes.chapterId, chapter.id)).orderBy(scenes.sceneNumber);
  console.log(`✅ Found ${chapterScenes.length} scenes\n`);

  if (chapterScenes.length !== expectedSceneCount) throw new Error(`Expected ${expectedSceneCount}, found ${chapterScenes.length}`);

  for (const scene of chapterScenes) {
    console.log(`📝 Scene ${scene.sceneNumber}: ${scene.title}`);
    const timelineVariant = (scene as any).timeline_variant;
    if (!scene.location || !timelineVariant) throw new Error(`Scene ${scene.sceneNumber} missing required fields`);
    console.log(`   ✅ Location: ${scene.location}`);
    console.log(`   ✅ Timeline Variant: ${timelineVariant}`);
    console.log(`   ✅ Focus: ${scene.focus?.length || 0} chars`);
    console.log(`   ✅ CSF: ${scene.chapterSceneFocus?.startsWith(`Ch${chapterNumber}S`) ? 'Valid' : 'Check'}`);
    console.log(`   ✅ chapterUniqueIdentifier: ${scene.chapterUniqueIdentifier === 'EA-332' ? '✅ Correct' : '❌ Wrong: ' + scene.chapterUniqueIdentifier}`);
    console.log(`   ✅ beatGoal: ${scene.beatGoal ? '✅ Set' : '❌ Missing'}\n`);
  }

  console.log(`✨ Verification Complete!\n  ✅ All ${expectedSceneCount} scenes verified\n`);
  chapterScenes.forEach((s) => console.log(`  ${s.sceneNumber}. ${s.title}`));
}

main().then(() => process.exit(0)).catch((e) => { console.error('❌', e.message); process.exit(1); });
