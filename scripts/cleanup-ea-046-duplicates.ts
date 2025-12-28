import { db } from '../src/lib/db';
import { scenes, chapters } from '../src/lib/schema';
import { eq, sql } from 'drizzle-orm';

async function main() {
  console.log('🧹 Cleaning up EA-046 duplicate scenes...\n');

  const [ch46] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-046'))
    .limit(1);

  if (!ch46) {
    console.error('❌ EA-046 not found');
    process.exit(1);
  }

  // Get all scenes for this chapter
  const allScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, ch46.id))
    .orderBy(sql`${scenes.sceneNumber}, ${scenes.createdAt}`);

  console.log(`Found ${allScenes.length} total scenes\n`);

  // Group by scene number
  const scenesByNumber: Record<number, typeof allScenes> = {};
  for (const scene of allScenes) {
    const num = scene.sceneNumber || 0;
    if (!scenesByNumber[num]) scenesByNumber[num] = [];
    scenesByNumber[num].push(scene);
  }

  // Keep the most recent (corrected format) version of each scene
  for (const [sceneNum, duplicates] of Object.entries(scenesByNumber)) {
    if (duplicates.length > 1) {
      console.log(`Scene ${sceneNum}: Found ${duplicates.length} duplicates`);

      // Sort by created_at DESC to get newest first
      duplicates.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });

      const keeper = duplicates[0];
      const toDelete = duplicates.slice(1);

      console.log(`  Keeping: ${keeper.id} (pages: ${keeper.pages})`);

      for (const old of toDelete) {
        console.log(`  Deleting: ${old.id} (pages: ${old.pages})`);
        await db.delete(scenes).where(eq(scenes.id, old.id));
      }
      console.log('');
    }
  }

  // Verify final state
  const finalScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, ch46.id))
    .orderBy(scenes.sceneNumber);

  console.log('✅ Final EA-046 scenes:');
  for (const scene of finalScenes) {
    console.log(`  Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`    pages: ${scene.pages}`);
    console.log(`    chapterSceneFocus: ${scene.chapterSceneFocus?.substring(0, 80)}...`);
    console.log('');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
