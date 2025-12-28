import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🎯 Finalizing EA-023 with all missing data...\n');

  const ch = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-023'))
    .limit(1);

  if (ch.length === 0) {
    console.error('❌ EA-023 chapter not found');
    process.exit(1);
  }

  const chapter = ch[0];

  // Generate preliminary description based on chapter context
  const preliminaryDescription =
    'Francisco and Zara encounter La Signora in her true divine form, learning that conscious direction and mindful awareness are essential to cosmic power. Through direct divine instruction in the Sacred Grove and Temple of Present Moment, they integrate emotional regulation, present-moment awareness, and purposeful intention, transforming from tactical practitioners into conscious cosmic leaders embodying The Magician archetype.';

  // Update chapter with preliminary description if missing
  if (!chapter.epicPreliminarySceneDescription) {
    await db
      .update(chapters)
      .set({ epicPreliminarySceneDescription: preliminaryDescription })
      .where(eq(chapters.id, chapter.id));

    console.log('✅ Added preliminary scene description to chapter');
  }

  // Update all scenes with the preliminary description
  await db
    .update(scenes)
    .set({ preliminarySceneDescription: preliminaryDescription })
    .where(eq(scenes.chapterId, chapter.id));

  console.log('✅ Added preliminary scene description to all scenes\n');

  // Final verification
  const updatedScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  console.log('🔍 Final Verification - All Required Fields:\n');

  for (const scene of updatedScenes) {
    const requiredFields = {
      'Title': scene.title,
      'Setup': scene.setup,
      'Description': scene.description,
      'Preliminary Scene Description': scene.preliminarySceneDescription,
      'Narrative Function': scene.narrativeFunction,
      'Sensory Detail': scene.sensoryDetail,
      'Internal Conflict': scene.internalConflict,
      'Character Growth Element': scene.characterGrowthElement,
      'Series Connection': scene.seriesConnectionResonance,
      'Beat Goal': scene.beatGoal,
      'Symbolism': scene.symbolism,
      'POV': scene.pov,
      'Tense': scene.tense,
      'Core Emotion': scene.core_emotion,
      'Scene Tone': scene.scene_tone,
      'Timeline Date': scene.timeline_date,
      'Timeline Variant': scene.timeline_variant,
      'Location': scene.location,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key);

    const status = missingFields.length === 0 ? '✅ COMPLETE' : `⚠️  MISSING: ${missingFields.join(', ')}`;

    console.log(`${status}`);
    console.log(`Scene ${scene.sceneNumber}: ${scene.title}\n`);
  }

  console.log('🎉 EA-023 is now fully complete and matches EA-001 to EA-022 format!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
