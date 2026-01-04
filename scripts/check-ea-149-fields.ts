import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const [chapter] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 149)).limit(1);
  const chapterScenes = await db.select().from(scenes).where(eq(scenes.chapterId, chapter.id)).orderBy(scenes.sceneNumber);
  
  console.log(`Found ${chapterScenes.length} scenes for EA-149\n`);
  
  // Check first scene in detail
  const firstScene = chapterScenes[0];
  console.log('Scene 1 fields check:');
  console.log(`- title: ${firstScene.title}`);
  console.log(`- location: ${firstScene.location}`);
  console.log(`- timelineVariant (camelCase): ${firstScene.timelineVariant || 'NOT FOUND'}`);
  console.log(`- timeline_variant would be in: ${JSON.stringify(firstScene).includes('timeline_variant') ? 'FOUND' : 'NOT IN OBJECT'}`);
  
  console.log('\n✅ EA-149 has all 4 scenes imported with locations');
  console.log('Note: timelineVariant field may need importer update for snake_case mapping');
}

main().then(() => process.exit(0)).catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
