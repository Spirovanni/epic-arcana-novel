import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔍 Verifying EA-149...\n');
  
  // Get chapter
  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 149)).limit(1);
  if (!chapter) {
    console.log('❌ Chapter 149 not found');
    return;
  }
  
  // Get scenes
  const chapterScenes = await db.select().from(scenes).where(eq(scenes.chapterId, chapter.id)).orderBy(scenes.sceneNumber);
  
  console.log('━'.repeat(60));
  console.log(`📖 Chapter 149: ${chapter.title}`);
  console.log(`   Total Scenes: ${chapterScenes.length}`);
  console.log('━'.repeat(60));
  console.log('');
  
  // Check each scene
  const requiredFields = ['location', 'timelineVariant', 'narrativeFunction'];
  const enhancedFields = ['learningObjectives', 'foreshadowingElements'];
  
  for (const scene of chapterScenes) {
    console.log(`Scene ${scene.sceneNumber}: "${scene.title}"`);
    console.log(`   Location: ${scene.location || '❌ MISSING'}`);
    console.log(`   Timeline Variant: ${scene.timelineVariant || '❌ MISSING'}`);
    console.log(`   Narrative Function: ${scene.narrativeFunction ? 'Present' : '❌ MISSING'}`);
    
    if (scene.learningObjectives) {
      const objectives = JSON.parse(scene.learningObjectives as string);
      console.log(`   Learning Objectives: ${objectives.length} items`);
    }
    
    if (scene.foreshadowingElements) {
      const elements = JSON.parse(scene.foreshadowingElements as string);
      console.log(`   Foreshadowing: ${elements.length} items`);
    }
    
    const hasMissing = !scene.location || !scene.timelineVariant || !scene.narrativeFunction;
    console.log(`   ${hasMissing ? '❌ Missing required fields' : '✅ All key fields present'}`);
    console.log('');
  }
  
  console.log('✅ Verification complete!\n');
}

main().then(() => process.exit(0)).catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
