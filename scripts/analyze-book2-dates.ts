import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';

async function main() {
  const allScenes = await db.select().from(scenes);
  
  // Extract chapter number from EA identifier
  const getChapterNum = (id: string | null) => {
    if (!id) return 0;
    const match = id.match(/EA-0?(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Get Book 1 scenes (EA-001 to EA-039)
  const book1Scenes = allScenes
    .filter(scene => {
      const num = getChapterNum(scene.chapterUniqueIdentifier);
      return num >= 1 && num <= 39;
    })
    .sort((a, b) => {
      const numA = getChapterNum(a.chapterUniqueIdentifier);
      const numB = getChapterNum(b.chapterUniqueIdentifier);
      if (numA !== numB) return numA - numB;
      return (a.sceneNumber || 0) - (b.sceneNumber || 0);
    });

  console.log(`📖 Book 1 scenes: ${book1Scenes.length}\n`);

  if (book1Scenes.length > 0) {
    console.log('Last 10 Book 1 scenes with timeline_date:');
    book1Scenes.slice(-10).forEach(scene => {
      console.log(`  ${scene.chapterUniqueIdentifier}-S${scene.sceneNumber}: ${scene.title}`);
      console.log(`    ${scene.timeline_date}`);
    });
  }

  // Get Book 2 scenes (EA-040 to EA-052)
  const book2Scenes = allScenes
    .filter(scene => {
      const num = getChapterNum(scene.chapterUniqueIdentifier);
      return num >= 40 && num <= 52;
    })
    .sort((a, b) => {
      const numA = getChapterNum(a.chapterUniqueIdentifier);
      const numB = getChapterNum(b.chapterUniqueIdentifier);
      if (numA !== numB) return numA - numB;
      return (a.sceneNumber || 0) - (b.sceneNumber || 0);
    });

  console.log(`\n\n📖 Book 2 scenes: ${book2Scenes.length}\n`);

  if (book2Scenes.length > 0) {
    console.log('All Book 2 scenes with current timeline_date:');
    book2Scenes.forEach(scene => {
      console.log(`  ${scene.chapterUniqueIdentifier}-S${scene.sceneNumber}: ${scene.title}`);
      console.log(`    ${scene.timeline_date}`);
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
