import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🔍 Verifying EA-023 focus data in Neon DB...\n');

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
  console.log(`📖 Chapter: ${chapter.title} (${chapter.uniqueIdentifier})\n`);

  const ea023Scenes = await db
    .select({
      id: scenes.id,
      sceneNumber: scenes.sceneNumber,
      title: scenes.title,
      focus: scenes.focus,
    })
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  console.log('🎬 Scenes from Neon DB:\n');
  console.log('='.repeat(80));

  for (const scene of ea023Scenes) {
    console.log(`\nScene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`ID: ${scene.id}`);
    console.log(`Focus: ${scene.focus || '❌ NULL'}`);
    console.log('-'.repeat(80));
  }

  const allHaveFocus = ea023Scenes.every(s => s.focus !== null && s.focus !== undefined);

  console.log('\n📊 Status:');
  console.log(`Total scenes: ${ea023Scenes.length}`);
  console.log(`Scenes with focus: ${ea023Scenes.filter(s => s.focus).length}`);
  console.log(`All scenes have focus: ${allHaveFocus ? '✅ YES' : '❌ NO'}`);

  if (allHaveFocus) {
    console.log('\n🎉 EA-023 focus data is LIVE in Neon DB!');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
