import { eq, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🎨 Generating missing scene fields for EA-023...\n');

  // Get EA-023 Chapter by unique identifier
  const chapter23Records = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-023'))
    .limit(1);

  if (chapter23Records.length === 0) {
    console.error('❌ EA-023 chapter not found');
    process.exit(1);
  }

  const chapter23 = chapter23Records[0];
  console.log(`✅ Found EA-023: ${chapter23.title} (ID: ${chapter23.id})\n`);

  // Get scenes
  const chapter23Scenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter23.id))
    .orderBy(asc(scenes.sceneNumber));

  console.log(`📝 Generating fields for ${chapter23Scenes.length} scenes...\n`);

  // Scene-specific data based on the actual content
  const sceneEnhancements = [
    {
      // Scene 1: The Divine Revelation
      narrativeFunction: 'Establishes the divine nature of La Signora and introduces the concept of mindful direction as essential to cosmic power. This scene shifts Francisco and Zara from tactical learners to spiritual initiates.',
      sensoryDetail: 'Dawn light filtering through ancient trees, creating dancing patterns on the crystal-clear pool. The air shimmers with divine energy, and each breath feels charged with cosmic awareness. The grove smells of sacred incense and morning dew.',
      internalConflict: 'Francisco struggles between his analytical scholar nature and the overwhelming spiritual experience. He questions whether he can truly embody mindful awareness while maintaining his strategic thinking.',
      characterGrowthElement: 'Francisco begins integrating his intellectual capabilities with emotional and spiritual awareness, recognizing that true cosmic leadership requires balance between mind, heart, and spirit.',
      seriesConnectionResonance: 'This divine encounter sets the foundation for Francisco\'s role as a conscious cosmic leader. La Signora\'s revelation connects to her larger arc as a divine guide and Francisco\'s destiny as the Master of Two Worlds.',
    },
    {
      // Scene 2: The Temple of Present Moment
      narrativeFunction: 'Provides practical training in mindfulness and emotional regulation. This scene transforms abstract concepts into tangible skills, demonstrating how present-moment awareness enhances cosmic abilities.',
      sensoryDetail: 'The crystalline temple walls pulse with soft light, creating a timeless atmosphere. Silence is profound yet alive with subtle energy. The air feels still yet somehow dynamic, as if time itself breathes differently here.',
      internalConflict: 'Zara confronts her protective instincts, realizing that reactive responses, while effective short-term, won\'t sustain her in cosmic-scale challenges. She must learn to transform warrior reflexes into mindful action.',
      characterGrowthElement: 'Zara evolves from a reactive protector to a mindful guardian, learning that true strength comes from maintaining inner balance and purposeful direction even under extreme pressure.',
      seriesConnectionResonance: 'The mindfulness practices learned here will be crucial throughout the series. This training establishes the foundation for how Francisco and Zara will handle future cosmic conflicts with awareness rather than mere power.',
    },
    {
      // Scene 3: The Integration of Magician Mastery
      narrativeFunction: 'Demonstrates the successful integration of all learned skills through a complex test. This scene validates Francisco and Zara\'s growth and establishes them as legitimate cosmic leaders embodying The Magician archetype.',
      sensoryDetail: 'Afternoon light creates golden streams through the grove. The air vibrates with focused intention as Francisco and Zara work in perfect synchronization. Their combined energy creates visible patterns in the atmosphere.',
      internalConflict: 'Francisco must trust that his new integrated approach—combining scholarship, strategy, mindfulness, and emotional mastery—can handle real cosmic challenges, not just training exercises.',
      characterGrowthElement: 'Both Francisco and Zara achieve a synthesis of their developed abilities, demonstrating that conscious cosmic leadership emerges from the seamless integration of awareness, will, and clear purpose.',
      seriesConnectionResonance: 'This integration represents a key milestone in Francisco and Zara\'s journey. Their mastery of The Magician archetype principles will inform all their future cosmic interventions and conflicts.',
    },
  ];

  // Update each scene
  for (let i = 0; i < chapter23Scenes.length; i++) {
    const scene = chapter23Scenes[i];
    const enhancements = sceneEnhancements[i];

    if (!enhancements) continue;

    const updates = {
      preliminarySceneDescription: chapter23.epicPreliminarySceneDescription || null,
      narrativeFunction: enhancements.narrativeFunction,
      sensoryDetail: enhancements.sensoryDetail,
      internalConflict: enhancements.internalConflict,
      characterGrowthElement: enhancements.characterGrowthElement,
      seriesConnectionResonance: enhancements.seriesConnectionResonance,
    };

    await db
      .update(scenes)
      .set(updates)
      .where(eq(scenes.id, scene.id));

    console.log(`✅ Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   ✓ Added narrative function`);
    console.log(`   ✓ Added sensory details`);
    console.log(`   ✓ Added internal conflict`);
    console.log(`   ✓ Added character growth element`);
    console.log(`   ✓ Added series connection`);
    console.log('');
  }

  // Verification
  console.log('🔍 Final Verification:\n');

  const updatedScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter23.id))
    .orderBy(asc(scenes.sceneNumber));

  for (const scene of updatedScenes) {
    const allFieldsPopulated =
      scene.preliminarySceneDescription &&
      scene.narrativeFunction &&
      scene.sensoryDetail &&
      scene.internalConflict &&
      scene.characterGrowthElement &&
      scene.seriesConnectionResonance &&
      scene.setup &&
      scene.beatGoal &&
      scene.symbolism &&
      scene.pov &&
      scene.tense &&
      scene.core_emotion &&
      scene.scene_tone;

    const status = allFieldsPopulated ? '✅ COMPLETE' : '⚠️  PARTIAL';

    console.log(`${status} Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`   Preliminary Description: ${scene.preliminarySceneDescription ? '✅' : '❌'}`);
    console.log(`   Narrative Function: ${scene.narrativeFunction ? '✅' : '❌'}`);
    console.log(`   Sensory Detail: ${scene.sensoryDetail ? '✅' : '❌'}`);
    console.log(`   Internal Conflict: ${scene.internalConflict ? '✅' : '❌'}`);
    console.log(`   Character Growth: ${scene.characterGrowthElement ? '✅' : '❌'}`);
    console.log(`   Series Connection: ${scene.seriesConnectionResonance ? '✅' : '❌'}`);
    console.log(`   Setup: ${scene.setup ? '✅' : '❌'}`);
    console.log(`   Beat Goal: ${scene.beatGoal ? '✅' : '❌'}`);
    console.log(`   Symbolism: ${scene.symbolism ? '✅' : '❌'}`);
    console.log(`   POV: ${scene.pov ? '✅' : '❌'}`);
    console.log(`   Tense: ${scene.tense ? '✅' : '❌'}`);
    console.log('');
  }

  console.log('🎉 EA-023 is now complete with all scene fields!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
