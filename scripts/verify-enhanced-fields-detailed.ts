import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔍 Detailed verification of enhanced fields for chapters 101, 102, 103, 104...\n');

  const chapterNumbers = [101, 102, 103, 104];

  for (const chapterNum of chapterNumbers) {
    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, chapterNum))
      .limit(1);

    if (!chapter) {
      console.log(`❌ Chapter ${chapterNum} not found\n`);
      continue;
    }

    const chapterScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapter.id))
      .orderBy(scenes.sceneNumber);

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📖 Chapter ${chapterNum}: ${chapter.title}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    for (const scene of chapterScenes) {
      console.log(`\n   Scene ${scene.sceneNumber}: "${scene.title}"`);
      console.log(`   📍 Location: ${scene.location || 'MISSING'}`);
      console.log(`   🌍 Timeline Variant: ${scene.timeline_variant || 'MISSING'}`);
      console.log(`   📚 Narrative Function: ${scene.narrativeFunction || 'MISSING'}`);
      console.log(`   📅 Timeline Date: ${scene.timeline_date || 'N/A'}`);
      console.log(`   🎭 Scene Card: ${scene.sceneCardProgression || 'N/A'}`);

      // Check for missing enhanced fields
      const missing = [];
      if (!scene.location) missing.push('location');
      if (!scene.timeline_variant) missing.push('timeline_variant');
      if (!scene.narrativeFunction) missing.push('narrativeFunction');

      if (missing.length > 0) {
        console.log(`   ⚠️  Missing fields: ${missing.join(', ')}`);
      } else {
        console.log(`   ✅ All enhanced fields present`);
      }
    }

    console.log('');
  }

  console.log('✅ Detailed verification complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
