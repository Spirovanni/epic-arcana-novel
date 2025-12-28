import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🧹 Cleaning up EA-043 duplicate scenes...\n');

  // Get EA-043 chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-043'))
    .limit(1);

  if (!chapter) {
    console.error('❌ EA-043 not found');
    process.exit(1);
  }

  // Get all scenes
  const allScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  console.log(`Found ${allScenes.length} scenes total\n`);

  // Group by scene number
  const scenesByNumber = new Map<number, typeof allScenes>();

  for (const scene of allScenes) {
    const num = scene.sceneNumber || 0;
    if (!scenesByNumber.has(num)) {
      scenesByNumber.set(num, []);
    }
    scenesByNumber.get(num)!.push(scene);
  }

  // For each scene number, keep the first one and delete the rest
  for (const [sceneNum, duplicates] of scenesByNumber.entries()) {
    if (duplicates.length > 1) {
      console.log(`Scene ${sceneNum}: Found ${duplicates.length} duplicates`);

      // Keep the first one
      const toKeep = duplicates[0];
      console.log(`  Keeping: ${toKeep.id}`);

      // Delete the rest
      for (let i = 1; i < duplicates.length; i++) {
        const toDelete = duplicates[i];
        console.log(`  Deleting: ${toDelete.id}`);
        await db.delete(scenes).where(eq(scenes.id, toDelete.id));
      }
    }
  }

  // Verify
  const remainingScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  console.log(`\n✅ Cleanup complete! EA-043 now has ${remainingScenes.length} scenes\n`);

  for (const scene of remainingScenes.sort((a, b) => (a.sceneNumber || 0) - (b.sceneNumber || 0))) {
    console.log(`Scene ${scene.sceneNumber}: ${scene.title} (Card ${scene.sceneCardProgression})`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
