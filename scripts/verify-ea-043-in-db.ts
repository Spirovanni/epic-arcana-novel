import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔍 Checking for EA-043 in database...\n');

  // Check if chapter exists
  const chapter = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-043'))
    .limit(1);

  if (chapter.length === 0) {
    console.log('❌ EA-043 chapter NOT found in database');

    // Check what chapter 43 has
    const ch43 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 43))
      .limit(1);

    if (ch43.length > 0) {
      console.log(`\nChapter 43 found with unique_identifier: ${ch43[0].uniqueIdentifier || 'NULL'}`);
      console.log(`Title: ${ch43[0].title}`);
    }

    process.exit(1);
  }

  console.log('✅ EA-043 chapter found!');
  console.log(`   ID: ${chapter[0].id}`);
  console.log(`   Title: ${chapter[0].title}`);
  console.log(`   Chapter Number: ${chapter[0].chapterNumber}\n`);

  // Check scenes
  const chapterScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter[0].id));

  console.log(`📊 Found ${chapterScenes.length} scenes for EA-043:\n`);

  for (const scene of chapterScenes) {
    console.log(`Scene ${scene.sceneNumber}: ${scene.title}`);
    console.log(`  - Pages: ${scene.pages || 'NULL'}`);
    console.log(`  - Focus: ${scene.focus ? 'SET' : 'NULL'}`);
    console.log(`  - Description: ${scene.description ? 'SET' : 'NULL'}`);
    console.log(`  - Scene Card: ${scene.sceneCardProgression || 'NULL'}`);
    console.log('');
  }

  console.log('✅ EA-043 verification complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
