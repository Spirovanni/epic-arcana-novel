import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🔍 Verifying EA-023 scenes in database...\n');

  // Find Chapter 23
  const chapterRecords = await db
    .select()
    .from(chapters)
    .where(eq(chapters.chapterNumber, 23))
    .limit(1);

  if (chapterRecords.length === 0) {
    console.error('❌ Chapter 23 not found');
    process.exit(1);
  }

  const chapter = chapterRecords[0];
  console.log('📖 Chapter Information:');
  console.log(`   ID: ${chapter.id}`);
  console.log(`   Number: ${chapter.chapterNumber}`);
  console.log(`   Title: ${chapter.title || 'Untitled'}`);
  console.log(`   Focus: ${chapter.focus || 'N/A'}`);
  console.log('');

  // Get all scenes for this chapter
  const chapterScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id))
    .orderBy(scenes.sceneNumber);

  console.log(`🎬 Scenes (${chapterScenes.length} total):\n`);

  for (const scene of chapterScenes) {
    console.log(`Scene ${scene.sceneNumber}: ${scene.title || 'Untitled'}`);
    console.log(`  ID: ${scene.id}`);
    console.log(`  Description: ${scene.description?.substring(0, 100)}...`);
    console.log(`  Setup: ${scene.setup?.substring(0, 100) || 'N/A'}...`);
    console.log(`  Focus: ${scene.focus || 'N/A'}`);
    console.log(`  Preliminary Scene Focus: ${scene.preliminarySceneFocus || 'N/A'}`);
    console.log(`  Symbolism: ${scene.symbolism?.substring(0, 80) || 'N/A'}...`);
    console.log(`  Beat Goal: ${scene.beatGoal?.substring(0, 80) || 'N/A'}...`);
    console.log(`  Save The Cat Beat: ${scene.saveTheCatBeat || 'N/A'}`);
    console.log(`  Timeline Date: ${scene.timeline_date || 'N/A'}`);
    console.log(`  Timeline Variant: ${scene.timeline_variant || 'N/A'}`);
    console.log(`  Location: ${scene.location || 'N/A'}`);
    console.log(`  POV: ${scene.pov || 'N/A'}`);
    console.log(`  Tense: ${scene.tense || 'N/A'}`);
    console.log(`  Core Emotion: ${scene.core_emotion || 'N/A'}`);
    console.log(`  Scene Tone: ${scene.scene_tone || 'N/A'}`);
    console.log(`  Pages: ${scene.pages || 'N/A'}`);
    console.log(`  Story Sequence: ${scene.storySequence || 'N/A'}`);
    console.log('');
  }

  console.log('✅ Verification complete!');
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
