import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🔧 Adding EA-023 identifier to Chapter 23...\n');

  // Find Chapter 23
  const chapter23 = await db
    .select()
    .from(chapters)
    .where(eq(chapters.chapterNumber, 23))
    .limit(1);

  if (chapter23.length === 0) {
    console.error('❌ Chapter 23 not found');
    process.exit(1);
  }

  const chapter = chapter23[0];
  console.log(`📖 Found Chapter 23: "${chapter.title}"`);
  console.log(`   Current Unique Identifier: ${chapter.uniqueIdentifier || 'NULL'}`);

  // Update the chapter with EA-023 identifier
  await db
    .update(chapters)
    .set({ uniqueIdentifier: 'EA-023' })
    .where(eq(chapters.id, chapter.id));

  console.log('\n✅ Updated Chapter 23 with unique identifier: EA-023');

  // Also update the scenes to have the chapter identifier
  const scenesUpdated = await db
    .update(scenes)
    .set({ chapterUniqueIdentifier: 'EA-023' })
    .where(eq(scenes.chapterId, chapter.id));

  console.log(`✅ Updated ${scenesUpdated.rowCount || 'all'} scenes with chapter identifier: EA-023`);

  // Verify the update
  const updatedChapter = await db
    .select()
    .from(chapters)
    .where(eq(chapters.chapterNumber, 23))
    .limit(1);

  console.log('\n📌 Verification:');
  console.log(`   Chapter Unique Identifier: ${updatedChapter[0].uniqueIdentifier}`);

  const updatedScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  console.log(`   Scenes with EA-023 identifier: ${updatedScenes.filter(s => s.chapterUniqueIdentifier === 'EA-023').length}`);

  console.log('\n🎯 Now you can find EA-023 data by querying:');
  console.log('   - chapters WHERE unique_identifier = \'EA-023\'');
  console.log('   - scenes WHERE chapter_unique_identifier = \'EA-023\'');
}

main()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
