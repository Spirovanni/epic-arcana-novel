import { db } from '../db.js';
import { books, chapters, chapterWritingGuidance, novelSeries } from '../schema.js';
import { eq, and } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

interface ChapterGuidanceData {
  chapter_number: number;
  title: string;
  pov_type: string;
  pov_character: string;
  tense: string;
  why_this_pov_and_tense: string;
  summary: string;
  key_plot_developments: string[];
  narrative_function: string[];
  tone_and_visual_prompts: string[];
  tips_for_writing: string[];
  full_text: string;
}

export async function seedBook1ChapterGuidance() {
  console.log('🌱 Seeding Book 1 Chapter Writing Guidance...');

  try {
    // Read the JSON data
    const jsonPath = path.join(process.cwd(), 'lore/json/books/Book_1_Enhanced_Filled_Chapter_Data.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as ChapterGuidanceData[];

    // First, ensure we have a series and book to work with
    let series = await db.select().from(novelSeries).where(eq(novelSeries.title, 'Epic Arcana')).limit(1);
    
    if (series.length === 0) {
      // Create the series
      const [newSeries] = await db.insert(novelSeries).values({
        title: 'Epic Arcana',
        tagline: 'A temporal fantasy epic spanning nine books',
        description: 'An epic fantasy series about time travel, ancient mysteries, and the power of choice across multiple timelines.',
        summary: 'When Francisco Petrarch discovers the mystical Trionfi cards, he becomes embroiled in a cosmic game that spans centuries and determines the fate of reality itself.',
        genres: ['Fantasy', 'Historical Fiction', 'Time Travel', 'Literary Fiction'],
        themes: ['Power', 'Time', 'Choice', 'Destiny', 'Knowledge'],
        keyThemes: ['Temporal Manipulation', 'Free Will vs Destiny', 'The Nature of Reality'],
      }).returning();
      series = [newSeries];
    }

    // Check for Book 1
    let book1 = await db.select().from(books).where(eq(books.bookNumber, 1)).limit(1);
    
    if (book1.length === 0) {
      // Create Book 1
      const [newBook] = await db.insert(books).values({
        seriesId: series[0].id,
        bookNumber: 1,
        title: 'The Fool\'s Journey',
        fictionNovelTitle: 'Book 1: The Fool\'s Journey',
        subject: 'Introduction to Francisco Petrarch and the Trionfi',
        focus: 'Character development and world-building',
        description: 'Francisco Petrarch begins his transformative journey aboard the mysterious Zanetti Train, discovering the power and peril of the Trionfi cards.',
        triumph: 'Knowledge',
        militaryComponent: 'Grand Catalan Company',
        businessModel: 'Quest and Discovery',
        type: 'Major Task',
      }).returning();
      book1 = [newBook];
    }

    const bookId = book1[0].id;

    // Process each chapter from the JSON data
    let successCount = 0;
    let errorCount = 0;

    for (const chapterData of jsonData) {
      try {
        // Check if chapter exists, if not create it
        let chapter = await db.select().from(chapters)
          .where(and(
            eq(chapters.chapterNumber, chapterData.chapter_number),
            eq(chapters.bookId, bookId)
          ))
          .limit(1);

        if (chapter.length === 0) {
          // Create basic chapter record
          const [newChapter] = await db.insert(chapters).values({
            bookId: bookId,
            chapterNumber: chapterData.chapter_number,
            title: chapterData.title,
            description: chapterData.summary,
            iconPath: `chapters/book1/chapter${chapterData.chapter_number}.png`,
          }).returning();
          chapter = [newChapter];
        }

        const chapterId = chapter[0].id;

        // Check if writing guidance already exists
        const existingGuidance = await db.select().from(chapterWritingGuidance)
          .where(eq(chapterWritingGuidance.chapterId, chapterId))
          .limit(1);

        if (existingGuidance.length === 0) {
          // Insert chapter writing guidance
          await db.insert(chapterWritingGuidance).values({
            chapterId: chapterId,
            bookId: bookId,
            chapterNumber: chapterData.chapter_number,
            title: chapterData.title,
            povType: chapterData.pov_type || null,
            povCharacter: chapterData.pov_character || null,
            tense: chapterData.tense || null,
            whyThisPovAndTense: chapterData.why_this_pov_and_tense || null,
            summary: chapterData.summary || null,
            keyPlotDevelopments: chapterData.key_plot_developments || [],
            narrativeFunction: chapterData.narrative_function || [],
            toneAndVisualPrompts: chapterData.tone_and_visual_prompts || [],
            tipsForWriting: chapterData.tips_for_writing || [],
            fullText: chapterData.full_text || null,
          });

          successCount++;
          console.log(`✅ Seeded Chapter ${chapterData.chapter_number}: ${chapterData.title}`);
        } else {
          console.log(`⏭️  Skipped Chapter ${chapterData.chapter_number}: ${chapterData.title} (already exists)`);
        }

      } catch (chapterError) {
        errorCount++;
        console.error(`❌ Error seeding Chapter ${chapterData.chapter_number}:`, chapterError);
      }
    }

    console.log(`🌱 Book 1 Chapter Guidance seeding completed!`);
    console.log(`✅ Successfully seeded: ${successCount} chapters`);
    console.log(`❌ Errors: ${errorCount} chapters`);
    
    return { success: successCount, errors: errorCount };

  } catch (error) {
    console.error('❌ Error seeding Book 1 Chapter Guidance:', error);
    throw error;
  }
}

// Allow running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedBook1ChapterGuidance()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
} 