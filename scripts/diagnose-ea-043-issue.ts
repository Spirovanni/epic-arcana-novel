import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, sql } from 'drizzle-orm';

async function main() {
  console.log('🔍 Diagnosing EA-043 issue...\n');

  // Check the chapter record
  const [chapter] = await db
    .select()
    .from(chapters)
    .where(eq(chapters.uniqueIdentifier, 'EA-043'))
    .limit(1);

  if (!chapter) {
    console.log('❌ EA-043 chapter does NOT exist in chapters table');

    // Check chapter 43
    const [ch43] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 43))
      .limit(1);

    if (ch43) {
      console.log('\n📋 Chapter 43 exists but has different unique_identifier:');
      console.log(`   ID: ${ch43.id}`);
      console.log(`   unique_identifier: ${ch43.uniqueIdentifier || 'NULL'}`);
      console.log(`   title: ${ch43.title}`);
    }
    return;
  }

  console.log('✅ Chapter EA-043 exists:');
  console.log(`   ID: ${chapter.id}`);
  console.log(`   unique_identifier: ${chapter.uniqueIdentifier}`);
  console.log(`   title: ${chapter.title}`);
  console.log(`   chapter_number: ${chapter.chapterNumber}\n`);

  // Check scenes for this chapter
  const chapterScenes = await db
    .select()
    .from(scenes)
    .where(eq(scenes.chapterId, chapter.id));

  console.log(`📊 Scenes with chapter_id = ${chapter.id}:`);
  console.log(`   Count: ${chapterScenes.length}\n`);

  if (chapterScenes.length === 0) {
    console.log('❌ NO SCENES found with this chapter_id');
    console.log('\nThis means the scenes were not properly linked to the chapter.');
    return;
  }

  // Now check what the Neon UI would show - join to get chapter unique_identifier
  const joinedScenes = await db.execute(sql`
    SELECT
      s.id as scene_id,
      s.scene_number,
      s.title as scene_title,
      s.chapter_id,
      c.unique_identifier as chapter_unique_identifier,
      c.title as chapter_title
    FROM scenes s
    LEFT JOIN chapters c ON s.chapter_id = c.id
    WHERE c.unique_identifier = 'EA-043'
    ORDER BY s.scene_number
  `);

  console.log('📋 Joined view (what Neon UI should show):');
  console.log(`   Rows: ${joinedScenes.rows.length}\n`);

  if (joinedScenes.rows.length === 0) {
    console.log('❌ No rows returned from join - this is the problem!');
  } else {
    for (const row of joinedScenes.rows) {
      console.log(`Scene ${row.scene_number}: ${row.scene_title}`);
      console.log(`  scene_id: ${row.scene_id}`);
      console.log(`  chapter_id: ${row.chapter_id}`);
      console.log(`  chapter_unique_identifier: ${row.chapter_unique_identifier}`);
      console.log('');
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
