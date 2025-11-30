import { db } from '@/lib/db';
import { scenes, chapters, books } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

interface SceneData {
  scene_number: number;
  title: string;
  setup?: string;
  symbolism?: string;
  beat_goal?: string;
  focus?: string;
  description?: string;
  sensoryDetail?: string;
  internalConflict?: string;
  tarotSymbolism?: string;
  heroJourneyStage?: string;
  pages?: string;
  primaryTarotCard?: string;
  timeline_date?: string;
  timeline_variant?: string;
  location?: string;
  pov?: string;
  tense?: string;
  core_emotion?: string;
  scene_tone?: string;
  [key: string]: any;
}

interface ChapterData {
  id?: string;
  chapter_number: number;
  title: string;
  pov?: string;
  tense?: string;
  core_emotion?: string;
  scene_tone?: string;
  scenes: SceneData[];
  [key: string]: any;
}

interface BookData {
  book_id?: string;
  title: string;
  chapters: ChapterData[];
}

async function seedScenesToDatabase() {
  try {
    console.log('🌱 Starting scene database seed...\n');

    // Find all book outline JSON files (both _Outline and _Database_Ready variants)
    const storylineDir = path.join(process.cwd(), 'lore', 'json', 'storyline');
    const allFiles = fs.readdirSync(storylineDir);
    const bookFiles = allFiles
      .filter(file =>
        (file.startsWith('Book_') && file.endsWith('.json')) ||
        (file.includes('Database_Ready') && file.endsWith('.json'))
      )
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });

    console.log(`📚 Found ${bookFiles.length} book files to process`);

    let totalScenesAdded = 0;
    let totalScenesUpdated = 0;

    for (const bookFile of bookFiles) {
      const filePath = path.join(storylineDir, bookFile);
      console.log(`\n📖 Processing: ${bookFile}`);

      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Try to parse the JSON - it might have nested structure
        let bookData: BookData | null = null;
        try {
          bookData = JSON.parse(fileContent);
        } catch (parseError) {
          console.warn(`  ⚠️  Could not parse ${bookFile}, skipping...`);
          continue;
        }

        // Check if file has chapters and scenes
        if (!bookData.chapters || bookData.chapters.length === 0) {
          console.warn(`  ⚠️  No chapters found in ${bookFile}, skipping...`);
          continue;
        }

        // Get or create book
        const bookTitle = bookData.title || `Book ${bookFile.match(/\d+/)?.[0]}`;
        const bookNumber = parseInt(bookFile.match(/\d+/)?.[0] || '0');

        let bookRecord = await db
          .select({ id: books.id, title: books.title })
          .from(books)
          .where(eq(books.bookNumber, bookNumber))
          .limit(1);

        let bookId: string;
        if (bookRecord.length === 0) {
          console.log(`  ➕ Creating book: ${bookTitle}`);
          const newBook = await db
            .insert(books)
            .values({
              id: randomUUID(),
              title: bookTitle,
              bookNumber: bookNumber,
              description: bookData.title || '',
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .returning();
          bookId = newBook[0].id;
        } else {
          bookId = bookRecord[0].id;
          console.log(`  ✓ Book exists: ${bookTitle}`);
        }

        // Process chapters and scenes
        for (const chapterData of bookData.chapters) {
          const chapterNumber = chapterData.chapter_number;
          const chapterTitle = chapterData.title;

          // Get or create chapter - query by book and chapter number
          let chapterRecord = await db
            .select({ id: chapters.id, title: chapters.title })
            .from(chapters)
            .where(
              and(
                eq(chapters.bookId, bookId),
                eq(chapters.chapterNumber, chapterNumber)
              )
            )
            .limit(1);

          let chapterId: string;
          if (chapterRecord.length === 0) {
            const newChapter = await db
              .insert(chapters)
              .values({
                id: randomUUID(),
                bookId: bookId,
                chapterNumber: chapterNumber,
                title: chapterTitle,
                pov: chapterData.pov || null,
                tense: chapterData.tense || null,
                coreEmotion: chapterData.core_emotion || null,
                sceneTone: chapterData.scene_tone || null,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
              .returning();
            chapterId = newChapter[0].id;
            console.log(`    ➕ Created chapter ${chapterNumber}: ${chapterTitle}`);
          } else {
            chapterId = chapterRecord[0].id;
            console.log(`    ✓ Chapter ${chapterNumber} exists`);
          }

          // Process scenes in this chapter
          if (chapterData.scenes && Array.isArray(chapterData.scenes)) {
            console.log(`      📝 Processing ${chapterData.scenes.length} scenes...`);

            for (const sceneData of chapterData.scenes) {
              const sceneNumber = sceneData.scene_number;

              // Check if scene already exists
              const existingScene = await db
                .select({ id: scenes.id })
                .from(scenes)
                .where(and(
                  eq(scenes.chapterId, chapterId),
                  eq(scenes.sceneNumber, sceneNumber)
                ))
                .limit(1);

              const sceneId = randomUUID();
              const now = new Date();

              // Prepare scene data with all available fields
              const sceneInsertData = {
                id: sceneId,
                chapterId: chapterId,
                sceneNumber: sceneNumber,
                title: sceneData.title || `Scene ${sceneNumber}`,
                focus: sceneData.focus || null,
                description: sceneData.description || null,
                setup: sceneData.setup || null,
                sensoryDetail: sceneData.sensoryDetail || null,
                internalConflict: sceneData.internalConflict || null,
                beatGoal: sceneData.beat_goal || sceneData.beatGoal || null,
                symbolism: sceneData.symbolism || null,
                tarotSymbolism: sceneData.tarotSymbolism || null,
                heroJourneyStage: sceneData.heroJourneyStage || null,
                pages: sceneData.pages || null,
                primaryTarotCard: sceneData.primaryTarotCard || null,
                // Timeline and context fields
                timeline_date: sceneData.timeline_date || null,
                timeline_variant: sceneData.timeline_variant || null,
                location: sceneData.location || null,
                pov: sceneData.pov || chapterData.pov || null,
                tense: sceneData.tense || chapterData.tense || null,
                core_emotion: sceneData.core_emotion || chapterData.core_emotion || null,
                scene_tone: sceneData.scene_tone || chapterData.scene_tone || null,
                createdAt: now,
                updatedAt: now,
              };

              if (existingScene.length === 0) {
                try {
                  // Only include fields that have values
                  const cleanedData: any = {};
                  for (const [key, value] of Object.entries(sceneInsertData)) {
                    if (value !== null && value !== undefined && value !== '') {
                      cleanedData[key] = value;
                    }
                  }

                  await db
                    .insert(scenes)
                    .values(cleanedData as typeof scenes.$inferInsert);
                  totalScenesAdded++;
                  console.log(`        ✓ Added scene ${sceneNumber}: ${sceneData.title || `Scene ${sceneNumber}`}`);
                } catch (insertError: any) {
                  console.error(`        ✗ Failed to add scene ${sceneNumber}:`, insertError.message.substring(0, 200));
                }
              } else {
                try {
                  await db
                    .update(scenes)
                    .set(sceneInsertData)
                    .where(eq(scenes.id, existingScene[0].id));
                  totalScenesUpdated++;
                  console.log(`        ↻ Updated scene ${sceneNumber}: ${sceneData.title || `Scene ${sceneNumber}`}`);
                } catch (updateError: any) {
                  console.error(`        ✗ Failed to update scene ${sceneNumber}:`, updateError.message);
                }
              }
            }
          }
        }
      } catch (error: any) {
        console.error(`  ✗ Error processing ${bookFile}:`, error.message);
      }
    }

    console.log('\n✅ Scene seeding complete!');
    console.log(`   📊 Scenes added: ${totalScenesAdded}`);
    console.log(`   📊 Scenes updated: ${totalScenesUpdated}`);
    console.log(`   📊 Total scenes processed: ${totalScenesAdded + totalScenesUpdated}`);

  } catch (error: any) {
    console.error('❌ Fatal error during scene seeding:', error);
    process.exit(1);
  }
}

// Run the seed
seedScenesToDatabase().then(() => {
  process.exit(0);
});
