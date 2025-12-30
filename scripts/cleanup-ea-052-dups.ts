import { db } from '../src/lib/db';
import { scenes, chapters } from '../src/lib/schema';
import { eq, sql } from 'drizzle-orm';

async function main() {
  console.log('🧹 Cleaning up EA-052 duplicate scenes...\n');

  const [ch52] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-052'))
    .limit(1);

  if (!ch52) {
    console.error('❌ EA-052 not found');
    process.exit(1);
  }

  // Get all scenes for this chapter
  const allScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, ch52.id))
    .orderBy(sql`${scenes.sceneNumber}, ${scenes.createdAt}`);

  console.log(`Found ${allScenes.length} total scenes\n`);

  // Group by scene number
  const scenesByNumber: Record<number, typeof allScenes> = {};
  for (const scene of allScenes) {
    const num = scene.sceneNumber || 0;
    if (!scenesByNumber[num]) scenesByNumber[num] = [];
    scenesByNumber[num].push(scene);
  }

  // Keep the version with the updated date format (MM/DD/YYYY - Time)
  for (const [sceneNum, duplicates] of Object.entries(scenesByNumber)) {
    if (duplicates.length > 1) {
      console.log(`Scene ${sceneNum}: Found ${duplicates.length} duplicates`);

      // Find the one with the new date format
      const keeper = duplicates.find(s => s.timeline_date?.match(/^\d+\/\d+\/\d+ - /));
      const toDelete = duplicates.filter(s => s.id !== keeper?.id);

      if (keeper) {
        console.log(`  Keeping: ${keeper.id} (timeline_date: ${keeper.timeline_date})`);

        for (const old of toDelete) {
          console.log(`  Deleting: ${old.id} (timeline_date: ${old.timeline_date})`);
          await db.delete(scenes).where(eq(scenes.id, old.id));
        }
      } else {
        console.log(`  ⚠️ No scene with updated date format found!`);
      }
      console.log('');
    }
  }

  // Verify final state
  const finalScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, ch52.id))
    .orderBy(scenes.sceneNumber);

  console.log('✅ Final EA-052 scenes:');
  for (const scene of finalScenes) {
    console.log(`  Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`    timeline_date: ${scene.timeline_date}`);
    console.log('');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
