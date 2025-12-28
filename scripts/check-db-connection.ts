import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, sql } from 'drizzle-orm';

async function main() {
  console.log('🔍 Checking database connection and EA-043...\n');

  // Check database connection
  try {
    const result = await db.execute(sql`SELECT current_database(), current_user`);
    console.log('✅ Database connected');
    console.log(`   Database: ${result.rows[0].current_database}`);
    console.log(`   User: ${result.rows[0].current_user}\n`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }

  // Check EA-043 chapter
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-043'))
    .limit(1);

  if (!chapter) {
    console.log('❌ EA-043 chapter NOT found in chapters table\n');
    process.exit(1);
  }

  console.log('✅ EA-043 chapter found in chapters table');
  console.log(`   Chapter ID: ${chapter.id}`);
  console.log(`   Title: ${chapter.title}`);
  console.log(`   Chapter Number: ${chapter.chapterNumber}\n`);

  // Check scenes for EA-043
  const chapterScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  console.log(`📊 Scenes in database for EA-043:`);
  console.log(`   Total count: ${chapterScenes.length}\n`);

  if (chapterScenes.length === 0) {
    console.log('❌ NO SCENES FOUND for EA-043 in scenes table');
    process.exit(1);
  }

  const sortedScenes = chapterScenes.sort((a, b) => (a.sceneNumber || 0) - (b.sceneNumber || 0));

  for (const scene of sortedScenes) {
    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`  ID: ${scene.id}`);
    console.log(`  Chapter ID: ${scene.chapterId}`);
    console.log(`  Pages: ${scene.pages || 'NULL'}`);
    console.log(`  Card: ${scene.sceneCardProgression || 'NULL'}`);
    console.log('');
  }

  console.log('\n✅ Verification complete - EA-043 scenes are in the database');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
