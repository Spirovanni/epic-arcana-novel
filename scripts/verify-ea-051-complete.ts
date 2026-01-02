import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

async function main() {
  console.log('🔍 Verifying EA-051 complete field coverage...\n');

  // Check all scenes
  for (let sceneNum = 1; sceneNum <= 4; sceneNum++) {
    console.log(`📖 EA-051 Scene ${sceneNum} - Complete Field Check:\n`);

    const [scene] = await db
      .select()
      .from(scenes)
      .where(
        and(
          eq(scenes.chapterUniqueIdentifier, 'EA-051'),
          eq(scenes.sceneNumber, sceneNum)
        )
      )
      .limit(1);

    if (scene) {
      console.log(`✅ Scene Found: ${scene.title}`);
      console.log(`   POV: ${scene.pov}`);
      console.log(`   Location: ${scene.location}`);
      console.log(`   Timeline Date: ${scene.timeline_date}`);
      console.log(`   Timeline Variant: ${scene.timeline_variant}`);
      console.log(`   Narrative Function: ${scene.narrativeFunction?.substring(0, 80)}...`);
      console.log(`   Core Emotion: ${scene.core_emotion}`);
      console.log(`   Scene Tone: ${scene.scene_tone}`);
      console.log(`   Pages: ${scene.pages}`);
      console.log(`   Scene Card Progression: ${scene.sceneCardProgression}`);
      console.log(`   Focus: ${scene.focus?.substring(0, 60)}...`);
      console.log('');
    } else {
      console.log(`❌ Scene ${sceneNum} not found!\n`);
    }
  }

  console.log('✅ Verification complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
