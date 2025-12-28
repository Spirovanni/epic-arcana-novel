import { eq, sql } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';

async function main() {
  console.log('🔍 Checking for EA-023 related data in Neon DB...\n');

  // 1. Check if chapter 23 exists
  console.log('1️⃣ Looking for Chapter 23:');
  const chapter23 = await db
    .select()
    .from(chapters)
    .where(eq(chapters.chapterNumber, 23))
    .limit(1);

  if (chapter23.length > 0) {
    const ch = chapter23[0];
    console.log(`   ✅ Found Chapter 23`);
    console.log(`      ID: ${ch.id}`);
    console.log(`      Title: ${ch.title || 'N/A'}`);
    console.log(`      Unique Identifier: ${ch.uniqueIdentifier || 'N/A'}`);
    console.log(`      Focus: ${ch.focus || 'N/A'}`);
  } else {
    console.log('   ❌ Chapter 23 not found');
  }

  // 2. Check for any chapter with "EA-023" in uniqueIdentifier
  console.log('\n2️⃣ Searching for EA-023 in chapter unique identifiers:');
  const ea023Chapters = await db
    .select()
    .from(chapters)
    .where(sql`${chapters.uniqueIdentifier} LIKE '%EA-023%'`);

  if (ea023Chapters.length > 0) {
    console.log(`   ✅ Found ${ea023Chapters.length} chapter(s) with EA-023 identifier:`);
    for (const ch of ea023Chapters) {
      console.log(`      - Chapter ${ch.chapterNumber}: ${ch.title}`);
      console.log(`        Unique ID: ${ch.uniqueIdentifier}`);
    }
  } else {
    console.log('   ⚠️  No chapters found with EA-023 in uniqueIdentifier field');
  }

  // 3. Check scenes for Chapter 23
  if (chapter23.length > 0) {
    console.log('\n3️⃣ Checking scenes for Chapter 23:');
    const chapterScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapter23[0].id))
      .orderBy(scenes.sceneNumber);

    console.log(`   Found ${chapterScenes.length} scene(s):`);
    for (const scene of chapterScenes) {
      console.log(`      Scene ${scene.sceneNumber}: ${scene.title || 'Untitled'}`);
      console.log(`         ID: ${scene.id}`);
    }
  }

  // 4. Check if scenes have chapterUniqueIdentifier set
  console.log('\n4️⃣ Checking scenes with chapter unique identifiers:');
  const scenesWithId = await db
    .select()
    .from(scenes)
    .where(sql`${scenes.chapterUniqueIdentifier} LIKE '%EA-023%'`);

  if (scenesWithId.length > 0) {
    console.log(`   ✅ Found ${scenesWithId.length} scene(s) with EA-023 identifier`);
  } else {
    console.log('   ⚠️  No scenes found with EA-023 in chapterUniqueIdentifier');
  }

  // 5. Show how to find the data
  console.log('\n📌 HOW TO FIND EA-023 DATA:');
  console.log('   The data is stored under Chapter 23 (chapter_number = 23)');
  console.log('   EA-023 is the outline ID, not stored in the database.');
  console.log('   To find the scenes, query:');
  console.log('   - chapters table WHERE chapter_number = 23');
  console.log('   - scenes table WHERE chapter_id = (the ID from chapter 23)');
  console.log('\n   Or use this SQL:');
  console.log('   SELECT s.* FROM scenes s');
  console.log('   JOIN chapters c ON s.chapter_id = c.id');
  console.log('   WHERE c.chapter_number = 23;');
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
