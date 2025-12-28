import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🎨 Adding chapter_scene_focus to EA-023 scenes...\n');

  // Get EA-023 Chapter
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
  console.log(`✅ Found EA-023: ${chapter.title}\n`);

  // Get scenes in order
  const ea023Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  console.log(`📝 Adding chapter_scene_focus to ${ea023Scenes.length} scenes...\n`);

  // chapter_scene_focus data in Ch##S## format
  const chapterSceneFocusData = [
    {
      // Scene 1: The Divine Revelation
      chapterSceneFocus:
        'Ch23S1: Understanding that conscious direction and mindful awareness are prerequisites for wielding cosmic power effectively',
    },
    {
      // Scene 2: The Temple of Present Moment
      chapterSceneFocus:
        'Ch23S2: Learning that present-moment awareness and emotional regulation form the foundation for all cosmic leadership',
    },
    {
      // Scene 3: The Integration of Magician Mastery
      chapterSceneFocus:
        'Ch23S3: Demonstrating complete integration of awareness, will, and purpose as embodiment of The Magician archetype',
    },
  ];

  // Update each scene
  for (let i = 0; i < ea023Scenes.length; i++) {
    const scene = ea023Scenes[i];
    const data = chapterSceneFocusData[i];

    if (!data) continue;

    await db
      .update(scenes)
      .set({
        chapterSceneFocus: data.chapterSceneFocus,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ${data.chapterSceneFocus}`);
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
    const status = scene.chapterSceneFocus ? '✅' : '❌';
    console.log(`${status} Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ${scene.chapterSceneFocus || 'NULL'}`);
    console.log('-'.repeat(80));
  }

  console.log('\n🎉 EA-023 chapter_scene_focus updated and saved to Neon DB!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
