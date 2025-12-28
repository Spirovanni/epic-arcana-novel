import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🎨 Updating focus field for EA-023 scenes...\n');

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

  console.log(`📝 Updating focus for ${ea023Scenes.length} scenes...\n`);

  // Focus data matching EA-021/EA-022 style
  const focusData = [
    {
      // Scene 1: The Divine Revelation
      focus: 'Francisco and Zara encounter La Signora in her divine form, learning that mindful direction is essential to cosmic power',
    },
    {
      // Scene 2: The Temple of Present Moment
      focus: 'Francisco and Zara master present-moment awareness and emotional regulation as foundation for cosmic leadership',
    },
    {
      // Scene 3: The Integration of Magician Mastery
      focus: 'Francisco and Zara demonstrate integrated mastery of awareness, will, and purpose, embodying The Magician archetype',
    },
  ];

  // Update each scene
  for (let i = 0; i < ea023Scenes.length; i++) {
    const scene = ea023Scenes[i];
    const data = focusData[i];

    if (!data) continue;

    await db
      .update(scenes)
      .set({
        focus: data.focus,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   Focus: ${data.focus}`);
    console.log('');
  }

  console.log('🔍 Final Verification:\n');

  const updatedScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  for (const scene of updatedScenes) {
    const status = scene.focus ? '✅' : '❌';
    console.log(`${status} Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ${scene.focus}`);
    console.log('');
  }

  console.log('🎉 EA-023 focus field updated!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
