import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

async function main() {
  console.log('🔍 Verifying EA-100 and EA-101 complete field coverage...\n');

  // Check EA-100 Scene 1 in detail
  console.log('📖 EA-100 Scene 1 - Complete Field Check:\n');
  const [ea100s1] = await db
    .select()
    .from(scenes)
    .where(
      and(
        eq(scenes.chapterUniqueIdentifier, 'EA-100'),
        eq(scenes.sceneNumber, 1)
      )
    )
    .limit(1);

  if (ea100s1) {
    console.log(`✅ Scene Found: ${ea100s1.title}`);
    console.log(`   POV: ${ea100s1.pov}`);
    console.log(`   Location: ${ea100s1.location}`);
    console.log(`   Timeline Date: ${ea100s1.timeline_date}`);
    console.log(`   Timeline Variant: ${ea100s1.timeline_variant}`);
    console.log(`   Narrative Function: ${ea100s1.narrativeFunction}`);
    console.log(`   Core Emotion: ${ea100s1.core_emotion}`);
    console.log(`   Scene Tone: ${ea100s1.scene_tone}`);
    console.log(`   Pages: ${ea100s1.pages}`);
    console.log(`   Scene Card Progression: ${ea100s1.sceneCardProgression}`);
  }

  // Check EA-101 Scene 2 (Zara POV)
  console.log('\n\n📖 EA-101 Scene 2 - Complete Field Check (Zara POV):\n');
  const [ea101s2] = await db
    .select()
    .from(scenes)
    .where(
      and(
        eq(scenes.chapterUniqueIdentifier, 'EA-101'),
        eq(scenes.sceneNumber, 2)
      )
    )
    .limit(1);

  if (ea101s2) {
    console.log(`✅ Scene Found: ${ea101s2.title}`);
    console.log(`   POV: ${ea101s2.pov}`);
    console.log(`   Location: ${ea101s2.location}`);
    console.log(`   Timeline Date: ${ea101s2.timeline_date}`);
    console.log(`   Timeline Variant: ${ea101s2.timeline_variant}`);
    console.log(`   Narrative Function: ${ea101s2.narrativeFunction}`);
    console.log(`   Core Emotion: ${ea101s2.core_emotion}`);
    console.log(`   Scene Tone: ${ea101s2.scene_tone}`);
    console.log(`   Pages: ${ea101s2.pages}`);
    console.log(`   Scene Card Progression: ${ea101s2.sceneCardProgression}`);
  }

  console.log('\n✅ Verification complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
