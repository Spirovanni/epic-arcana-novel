import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔍 Verifying metadata in Neon database...\n');

  const chapterRange = Array.from({ length: 24 }, (_, i) => 312 + i);

  let allVerified = true;
  let totalScenes = 0;
  let verifiedScenes = 0;

  for (const chapterNumber of chapterRange) {
    const eaId = `EA-${chapterNumber}`;

    const [chapter] = await db.select().from(chapters)
      .where(eq(chapters.chapterNumber, chapterNumber))
      .limit(1);

    if (!chapter) {
      console.log(`❌ ${eaId}: Chapter not found`);
      allVerified = false;
      continue;
    }

    const dbScenes = await db.select().from(scenes)
      .where(eq(scenes.chapterId, chapter.id))
      .orderBy(scenes.sceneNumber);

    if (dbScenes.length === 0) {
      console.log(`❌ ${eaId}: No scenes found`);
      allVerified = false;
      continue;
    }

    totalScenes += dbScenes.length;
    let chapterVerified = true;

    for (const scene of dbScenes) {
      const hasPov = scene.pov !== null && scene.pov !== '';
      const hasTense = scene.tense !== null && scene.tense !== '';
      const hasEmotion = scene.core_emotion !== null && scene.core_emotion !== '';
      const hasTone = scene.scene_tone !== null && scene.scene_tone !== '';

      if (hasPov && hasTense && hasEmotion && hasTone) {
        verifiedScenes++;
      } else {
        console.log(`❌ ${eaId} Scene ${scene.sceneNumber}: Missing fields`);
        if (!hasPov) console.log(`   - pov missing`);
        if (!hasTense) console.log(`   - tense missing`);
        if (!hasEmotion) console.log(`   - core_emotion missing`);
        if (!hasTone) console.log(`   - scene_tone missing`);
        chapterVerified = false;
        allVerified = false;
      }
    }

    if (chapterVerified) {
      console.log(`✅ ${eaId}: ${chapter.title} - All ${dbScenes.length} scenes verified`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Verification Summary:`);
  console.log(`   Total chapters: 24`);
  console.log(`   Total scenes: ${totalScenes}`);
  console.log(`   Verified scenes: ${verifiedScenes}/${totalScenes}`);

  if (allVerified) {
    console.log(`\n✨ All metadata successfully uploaded and verified!`);
  } else {
    console.log(`\n⚠️  Some scenes missing metadata`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
