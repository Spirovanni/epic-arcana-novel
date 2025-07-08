import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { promises as fs } from 'fs';
import path from 'path';
import * as schema from '../src/lib/schema.ts';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const BOOK1_JSON_PATH = path.join(process.cwd(), 'lore', 'book1_expanded_codex.json');

async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function seedBook1Data() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('Loading book1 expanded codex data...');
  const book1Data = await loadJSON(BOOK1_JSON_PATH);

  console.log('Starting book1 expanded codex seeding...');
  
  // First, get the existing series ID
  const existingSeries = await db.select().from(schema.novelSeries).limit(1);
  let seriesId;
  
  if (existingSeries.length === 0) {
    console.log('No existing series found. Creating default series...');
    const newSeries = await db.insert(schema.novelSeries).values({
      title: 'Epic Arcana',
      description: 'A temporal fantasy series exploring the mystical Trionfi cards through history',
    }).returning({ id: schema.novelSeries.id });
    seriesId = newSeries[0].id;
  } else {
    seriesId = existingSeries[0].id;
    console.log(`Using existing series ID: ${seriesId}`);
  }

  // Check if book1 already exists
  const existingBook = await db.select().from(schema.books).where(eq(schema.books.bookNumber, 1));
  let bookId;

  if (existingBook.length === 0) {
    console.log('Creating new book1 record...');
    const newBook = await db.insert(schema.books).values({
      seriesId: seriesId,
      bookNumber: 1,
      uniqueIdentifier: book1Data.book_unique_identifier,
      title: book1Data.fantasy_book_name,
      subject: book1Data.book_subject,
      focus: book1Data.focus_of_book,
      description: book1Data.book_description,
      themes: [book1Data.unique_theme],
      enneagramType: book1Data.enneagram,
      militaryComponent: book1Data.military,
      businessModel: book1Data.business_model_generation,
      personalityType: book1Data.personality_type,
      coveryCoveyHabit: book1Data['9_habits_covey'],
      associatedSin: book1Data.sin,
    }).returning({ id: schema.books.id });
    bookId = newBook[0].id;
  } else {
    bookId = existingBook[0].id;
    console.log(`Using existing book1 ID: ${bookId}`);
    
    // Update the existing book with new data
    await db.update(schema.books)
      .set({
        uniqueIdentifier: book1Data.book_unique_identifier,
        title: book1Data.fantasy_book_name,
        subject: book1Data.book_subject,
        focus: book1Data.focus_of_book,
        description: book1Data.book_description,
        themes: [book1Data.unique_theme],
        enneagramType: book1Data.enneagram,
        militaryComponent: book1Data.military,
        businessModel: book1Data.business_model_generation,
        personalityType: book1Data.personality_type,
        coveryCoveyHabit: book1Data['9_habits_covey'],
        associatedSin: book1Data.sin,
      })
      .where(eq(schema.books.id, bookId));
  }

  // Clear existing chapters and scenes for this book
  const existingChapters = await db.select().from(schema.chapters).where(eq(schema.chapters.bookId, bookId));
  if (existingChapters.length > 0) {
    console.log('Clearing existing chapters and scenes...');
    await db.delete(schema.scenes).where(eq(schema.scenes.chapterId, existingChapters[0].id));
    await db.delete(schema.chapters).where(eq(schema.chapters.bookId, bookId));
  }

  // Process sections and chapters
  let chapterCount = 0;
  const processedChapters = new Set();

  for (const section of book1Data.sections) {
    for (const majorTaskGroup of section.major_task_groups) {
      for (const specificTaskGroup of majorTaskGroup.specific_task_groups) {
        const chapterNumber = specificTaskGroup.chapter;
        
        // Skip if we've already processed this chapter
        if (processedChapters.has(chapterNumber)) {
          continue;
        }
        
        processedChapters.add(chapterNumber);
        chapterCount++;

        console.log(`Creating chapter ${chapterNumber}...`);
        
        const chapterData = {
          bookId: bookId,
          chapterNumber: chapterNumber,
          uniqueIdentifier: specificTaskGroup.unique_identifier,
          title: specificTaskGroup.specific_task_group_title,
          focus: specificTaskGroup.focus_area,
          epicNovelPages: specificTaskGroup.epic_novel_pages,
          epicChapterFocus: specificTaskGroup.epic_chapter_focus,
          epicNovelChapterFocus: specificTaskGroup.epic_novel_chapter_focus,
          epicNovelSectionName: specificTaskGroup.epic_novel_section_name,
          description: specificTaskGroup.specific_task_group_description,
          tarotCardLink: specificTaskGroup.tarot_card_link,
          tarotFamily: specificTaskGroup.new_tarot_family || specificTaskGroup.tarot_family,
          tarotCardItem: specificTaskGroup.tarot_card_item,
          colorTheme: {
            name: specificTaskGroup.color_name,
            hex: specificTaskGroup.hex_code,
            rgb: {
              red: specificTaskGroup.red,
              green: specificTaskGroup.green,
              blue: specificTaskGroup.blue
            }
          }
        };

        const newChapter = await db.insert(schema.chapters).values(chapterData).returning({ id: schema.chapters.id });
        const chapterId = newChapter[0].id;

        // Create a scene for this chapter
        const sceneData = {
          chapterId: chapterId,
          sceneNumber: 1,
          title: specificTaskGroup.epic_preliminary_scene_focus,
          focus: specificTaskGroup.focus_area,
          preliminarySceneFocus: specificTaskGroup.epic_preliminary_scene_focus,
          preliminarySceneDescription: specificTaskGroup.epic_preliminary_scene_description,
          description: specificTaskGroup.specific_task_group_tagline,
          heroJourneyStage: specificTaskGroup.epic_chapter_focus,
          pages: specificTaskGroup.epic_novel_pages,
          primaryTarotCard: `${specificTaskGroup.tarot_card_item} of ${specificTaskGroup.new_tarot_family || specificTaskGroup.tarot_family}`,
          tarotNarrativeRole: specificTaskGroup.connection_to_the_major_task_group,
        };

        await db.insert(schema.scenes).values(sceneData);

        // Create task group
        const taskGroupData = {
          chapterId: chapterId,
          uniqueIdentifier: specificTaskGroup.specific_task_group_description,
          type: specificTaskGroup.type,
          title: specificTaskGroup.specific_task_group_title,
          description: specificTaskGroup.specific_task_group_tagline,
          tagline: section.mt_tagline,
          focusArea: specificTaskGroup.focus_area,
          connectionToMajorTaskGroup: specificTaskGroup.connection_to_the_major_task_group,
          influencedByBooks: specificTaskGroup.specific_task_group_books_influenced_by,
        };

        await db.insert(schema.taskGroups).values(taskGroupData);
      }
    }
  }

  console.log(`Seeding completed! Created ${chapterCount} chapters for book1.`);
  await pool.end();
}

async function main() {
  try {
    await seedBook1Data();
    console.log('Book1 expanded codex seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main();