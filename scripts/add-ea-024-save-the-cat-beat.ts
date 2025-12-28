import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🎬 Adding save_the_cat_beat to EA-024 scenes...\n');

  const ch = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-024'))
    .limit(1);

  if (ch.length === 0) {
    console.error('❌ EA-024 not found');
    process.exit(1);
  }

  const chapter = ch[0];
  console.log(`✅ Found EA-024: ${chapter.title}\n`);

  const ea024Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  // Save the Cat beats for EA-024 scenes
  // Following the pattern from EA-021 to EA-023, and matching EA-024's theme of "The Integration of Divine Wisdom"
  const saveTheCatBeats = [
    {
      // Scene 1: The Academy Crisis
      saveTheCatBeat: 'B Story - Integration Challenge',
    },
    {
      // Scene 2: The Harmonic Council
      saveTheCatBeat: 'B Story - Integration Through Harmonic Structure',
    },
    {
      // Scene 3: The Unified Academy Accords
      saveTheCatBeat: 'B Story - Successful Integration of Divine Wisdom',
    },
  ];

  for (let i = 0; i < ea024Scenes.length; i++) {
    const scene = ea024Scenes[i];
    const data = saveTheCatBeats[i];

    if (!data) continue;

    await db
      .update(scenes)
      .set({
        saveTheCatBeat: data.saveTheCatBeat,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   Save The Cat Beat: ${data.saveTheCatBeat}`);
    console.log('');
  }

  console.log('🔍 Final Verification:\n');
  console.log('='.repeat(80));

  const updatedScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  for (const scene of updatedScenes) {
    const status = scene.saveTheCatBeat ? '✅' : '❌';
    console.log(`${status} Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ${scene.saveTheCatBeat || 'NULL'}`);
    console.log('-'.repeat(80));
  }

  console.log('\n🎉 EA-024 save_the_cat_beat updated and saved to Neon DB!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
