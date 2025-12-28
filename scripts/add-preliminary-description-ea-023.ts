import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('📝 Adding preliminary description to EA-023 scenes...\n');

  const ch = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-023'))
    .limit(1);

  if (ch.length === 0) {
    console.error('❌ EA-023 chapter not found');
    process.exit(1);
  }

  const prelimDesc = ch[0].epicPreliminarySceneDescription;

  if (prelimDesc) {
    await db
      .update(scenes)
      .set({ preliminarySceneDescription: prelimDesc })
      .where(eq(scenes.chapterId, ch[0].id));

    console.log('✅ Added preliminary scene description to all EA-023 scenes');
    console.log(`   Description: ${prelimDesc.substring(0, 100)}...`);
  } else {
    console.log('❌ No preliminary description found in chapter');
  }

  // Verify
  const scns = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, ch[0].id));

  console.log(`\n✅ Scenes with preliminary description: ${scns.filter((s) => s.preliminarySceneDescription).length}/${scns.length}`);

  // Check all fields now
  console.log('\n🔍 Final verification:');
  for (const scene of scns) {
    const complete =
      scene.preliminarySceneDescription &&
      scene.narrativeFunction &&
      scene.sensoryDetail &&
      scene.internalConflict &&
      scene.characterGrowthElement &&
      scene.seriesConnectionResonance;

    const status = complete ? '✅ COMPLETE' : '⚠️  MISSING FIELDS';
    console.log(`${status} Scene ${scene.sceneNumber}: ${scene.title}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
