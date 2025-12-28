import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🎨 Fixing preliminary fields for EA-023 scenes...\n');

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

  const ea023Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(asc(scenes.sceneNumber));

  const sceneData = [
    {
      // Scene 1: The Divine Revelation
      focus: 'Francisco and Zara encounter La Signora in her divine form, learning that mindful direction is essential to cosmic power',
      preliminarySceneFocus: 'La Signora reveals her divine nature and introduces Francisco and Zara to the principle of conscious cosmic direction',
      preliminarySceneDescription:
        'In the Sacred Grove at dawn, La Signora transforms from mysterious mentor into revealed divinity. Francisco and Zara witness her true form as a goddess embodying mindful direction and conscious will. She teaches them that cosmic power without conscious awareness becomes destructive force, while mindful direction transforms raw ability into purposeful action. Through direct divine instruction, they learn that The Magician archetype requires not just knowledge and skill but moment-to-moment awareness of intention and impact.',
    },
    {
      // Scene 2: The Temple of Present Moment
      focus: 'Francisco and Zara master present-moment awareness and emotional regulation as foundation for cosmic leadership',
      preliminarySceneFocus: 'Training in the crystalline temple where time itself becomes the teacher of mindful presence',
      preliminarySceneDescription:
        'La Signora guides Francisco and Zara into the Temple of Present Moment, a crystalline sanctuary where time flows differently. Here they practice holding awareness in the eternal now, learning to maintain emotional regulation amid cosmic-scale pressures. Zara discovers that her protective instincts become infinitely more powerful when rooted in stillness rather than reaction. Francisco learns to channel his intellectual gifts through present awareness rather than anxious projection. They master the paradox that cosmic action requires cosmic stillness as its foundation.',
    },
    {
      // Scene 3: The Integration of Magician Mastery
      focus: 'Francisco and Zara demonstrate integrated mastery of awareness, will, and purpose, embodying The Magician archetype',
      preliminarySceneFocus: 'The final test requiring seamless integration of all Magician principles in synchronized cosmic working',
      preliminarySceneDescription:
        'As afternoon light fills the Sacred Grove, La Signora presents Francisco and Zara with their integration test. They must demonstrate complete embodiment of The Magician archetype by executing a complex cosmic working that requires simultaneous awareness, will, and purpose alignment. Working in perfect synchronization, they channel immense cosmic forces while maintaining present-moment consciousness and ethical clarity. Their success validates their transformation from tactical practitioners to conscious cosmic leaders, earning La Signora\'s acknowledgment and the cosmic realm\'s recognition of their readiness for greater responsibilities.',
    },
  ];

  for (let i = 0; i < ea023Scenes.length; i++) {
    const scene = ea023Scenes[i];
    const data = sceneData[i];

    if (!data) continue;

    await db
      .update(scenes)
      .set({
        focus: data.focus,
        preliminarySceneFocus: data.preliminarySceneFocus,
        preliminarySceneDescription: data.preliminarySceneDescription,
      })
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   Focus: ${data.focus.substring(0, 60)}...`);
    console.log(`   Prelim Focus: ${data.preliminarySceneFocus.substring(0, 60)}...`);
    console.log(`   Prelim Desc: ${data.preliminarySceneDescription.substring(0, 60)}...`);
    console.log('');
  }

  console.log('🔍 Final Verification:\n');
  console.log('='.repeat(80));

  const updatedScenes = await db
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

  for (const scene of updatedScenes) {
    console.log(`\n📖 Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log('-'.repeat(80));
    console.log(`Focus:\n${scene.focus}`);
    console.log(`\nPreliminary Scene Focus:\n${scene.preliminarySceneFocus}`);
    console.log(`\nPreliminary Scene Description:\n${scene.preliminarySceneDescription?.substring(0, 200)}...`);
    console.log('='.repeat(80));
  }

  console.log('\n🎉 EA-023 preliminary fields updated with unique content for each scene!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
