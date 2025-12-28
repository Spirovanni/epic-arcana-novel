import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🔍 Checking EA-023 fields for duplicates...\n');

  const ch = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-023'))
    .limit(1);

  if (ch.length === 0) {
    console.error('❌ EA-023 not found');
    process.exit(1);
  }

  const chapter = ch[0];

  const ea023Scenes = await db
    .select({
      sceneNumber: scenes.sceneNumber,
      title: scenes.title,
      focus: scenes.focus,
      preliminarySceneFocus: scenes.preliminarySceneFocus,
      preliminarySceneDescription: scenes.preliminarySceneDescription,
    })
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  console.log('='.repeat(80));
  for (const scene of ea023Scenes) {
    console.log(`\n📖 Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log('-'.repeat(80));
    console.log(`\nFocus:\n${scene.focus || '❌ NULL'}`);
    console.log(`\nPreliminary Scene Focus:\n${scene.preliminarySceneFocus || '❌ NULL'}`);
    console.log(`\nPreliminary Scene Description:\n${scene.preliminarySceneDescription || '❌ NULL'}`);
    console.log('\n' + '='.repeat(80));
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
