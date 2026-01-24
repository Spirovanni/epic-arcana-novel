import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log(`🔍 Verifying EA-284 and EA-285 fields...\n`);

  // Check EA-284
  const [chapter284] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 284)).limit(1);
  if (!chapter284) {
    console.log('❌ EA-284 chapter not found');
  } else {
    console.log(`✅ EA-284: ${chapter284.title}`);
    console.log(`   Unique Identifier: ${chapter284.uniqueIdentifier}\n`);
    
    const scenes284 = await db.select().from(scenes).where(eq(scenes.chapterId, chapter284.id)).orderBy(scenes.sceneNumber);
    console.log(`   Found ${scenes284.length} scenes:`);
    for (const scene of scenes284) {
      const hasIdentifier = scene.chapterUniqueIdentifier === chapter284.uniqueIdentifier;
      const hasBeatGoal = !!scene.beatGoal;
      console.log(`   Scene ${scene.sceneNumber}: ${scene.title}`);
      console.log(`     chapterUniqueIdentifier: ${hasIdentifier ? '✅' : '❌'} ${scene.chapterUniqueIdentifier || 'MISSING'} (expected: ${chapter284.uniqueIdentifier})`);
      console.log(`     beatGoal: ${hasBeatGoal ? '✅' : '❌'} ${hasBeatGoal ? 'SET' : 'MISSING'}\n`);
    }
  }

  console.log('');

  // Check EA-285
  const [chapter285] = await db.select().from(chapters).where(eq(chapters.chapterNumber, 285)).limit(1);
  if (!chapter285) {
    console.log('❌ EA-285 chapter not found');
  } else {
    console.log(`✅ EA-285: ${chapter285.title}`);
    console.log(`   Unique Identifier: ${chapter285.uniqueIdentifier}\n`);
    
    const scenes285 = await db.select().from(scenes).where(eq(scenes.chapterId, chapter285.id)).orderBy(scenes.sceneNumber);
    console.log(`   Found ${scenes285.length} scenes:`);
    for (const scene of scenes285) {
      const hasIdentifier = scene.chapterUniqueIdentifier === chapter285.uniqueIdentifier;
      const hasBeatGoal = !!scene.beatGoal;
      console.log(`   Scene ${scene.sceneNumber}: ${scene.title}`);
      console.log(`     chapterUniqueIdentifier: ${hasIdentifier ? '✅' : '❌'} ${scene.chapterUniqueIdentifier || 'MISSING'} (expected: ${chapter285.uniqueIdentifier})`);
      console.log(`     beatGoal: ${hasBeatGoal ? '✅' : '❌'} ${hasBeatGoal ? 'SET' : 'MISSING'}\n`);
    }
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error('❌', e.message); process.exit(1); });
