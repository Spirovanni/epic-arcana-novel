import { eq, or, asc } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import outlineData from '../data/l_outline.json';

function findEAData(eaId: string): any {
  const search = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === eaId) return obj;
    for (const key of Object.keys(obj)) {
      const result = search(obj[key]);
      if (result) return result;
    }
    return null;
  };
  return search(outlineData);
}

async function main() {
  console.log('🔧 Setting up EA-021 and EA-022...\n');

  // Get chapters 21 and 22
  const targetChapters = await db
    .select()
    .from(chapters)
    .where(or(eq(chapters.chapterNumber, 21), eq(chapters.chapterNumber, 22)))
    .orderBy(asc(chapters.chapterNumber));

  console.log(`Found ${targetChapters.length} chapters\n`);

  for (const chapter of targetChapters) {
    const eaId = `EA-${String(chapter.chapterNumber).padStart(3, '0')}`;
    console.log(`\n${'='.repeat(80)}`);
    console.log(`\n📖 Processing Chapter ${chapter.chapterNumber} → ${eaId}`);
    console.log(`   Current Title: ${chapter.title}`);
    console.log(`   Current Unique ID: ${chapter.uniqueIdentifier || 'NULL'}`);

    // Get outline data
    const outlineChapter = findEAData(eaId);

    if (!outlineChapter) {
      console.warn(`   ⚠️  ${eaId} not found in outline, skipping...`);
      continue;
    }

    console.log(`   ✅ Found ${eaId} in outline`);
    console.log(`   Outline Title: ${outlineChapter.title || outlineChapter.chapter_title || 'N/A'}`);
    console.log(`   Scenes in outline: ${outlineChapter.scenes?.length || 0}`);

    // Update chapter unique identifier
    await db
      .update(chapters)
      .set({ uniqueIdentifier: eaId })
      .where(eq(chapters.id, chapter.id));

    console.log(`   ✅ Updated unique identifier to ${eaId}`);

    // Get existing scenes
    const existingScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, chapter.id))
      .orderBy(asc(scenes.sceneNumber));

    console.log(`   Current scenes in database: ${existingScenes.length}`);

    // Update scene chapter_unique_identifier
    if (existingScenes.length > 0) {
      for (const scene of existingScenes) {
        await db
          .update(scenes)
          .set({ chapterUniqueIdentifier: eaId })
          .where(eq(scenes.id, scene.id));
      }
      console.log(`   ✅ Updated ${existingScenes.length} scenes with chapter unique identifier`);
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('\n✅ Setup complete!\n');

  // Verify
  const updatedChapters = await db
    .select()
    .from(chapters)
    .where(
      or(
        eq(chapters.uniqueIdentifier, 'EA-021'),
        eq(chapters.uniqueIdentifier, 'EA-022')
      )
    );

  console.log('🔍 Verification:');
  for (const ch of updatedChapters) {
    const sceneCount = await db
      .select()
      .from(scenes)
      .where(eq(scenes.chapterId, ch.id));

    console.log(`   ${ch.uniqueIdentifier}: ${ch.title} (${sceneCount.length} scenes)`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
