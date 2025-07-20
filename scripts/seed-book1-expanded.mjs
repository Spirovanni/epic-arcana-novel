import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { promises as fs } from 'fs';
import path from 'path';
import * as schema from '../src/lib/schema.ts';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const L_OUTLINE_JSON_PATH = path.join(process.cwd(), 'lore', 'l_outline.json');

async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

function safeTruncate(str, maxLength) {
  if (!str) return str;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
}

async function seedBook1Data() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('Loading l_outline data...');
  const outlineData = await loadJSON(L_OUTLINE_JSON_PATH);
  const book1Data = outlineData.SelfImprovementSeries.Books.trilogies['1st_trilogy'].trilogy_books.Book1;

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
      uniqueIdentifier: book1Data.unique_identifier,
      title: book1Data.fiction_novel_title,
      subject: book1Data.subject,
      focus: book1Data.focus,
      description: book1Data.description,
      themes: book1Data.themes,
      enneagramType: book1Data.ennegram_name,
      militaryComponent: book1Data.military_component,
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
        uniqueIdentifier: book1Data.unique_identifier,
        title: book1Data.fiction_novel_title,
        subject: book1Data.subject,
        focus: book1Data.focus,
        description: book1Data.description,
        themes: book1Data.themes,
        enneagramType: book1Data.ennegram_name,
        militaryComponent: book1Data.military_component,
        businessModel: book1Data.business_model_generation,
        personalityType: book1Data.personality_type,
        coveryCoveyHabit: book1Data['9_habits_covey'],
        associatedSin: book1Data.sin,
      })
      .where(eq(schema.books.id, bookId));
  }

  // Clear existing chapters and related data for this book
  const existingChapters = await db.select().from(schema.chapters).where(eq(schema.chapters.bookId, bookId));
  if (existingChapters.length > 0) {
    console.log('Clearing existing chapters, scenes, and pages...');
    
    // Delete in proper order to respect foreign key constraints
    for (const chapter of existingChapters) {
      // First delete chapter_pages
      await db.delete(schema.chapterPages).where(eq(schema.chapterPages.chapterId, chapter.id));
      // Then delete scenes
      await db.delete(schema.scenes).where(eq(schema.scenes.chapterId, chapter.id));
      // Then delete task groups
      await db.delete(schema.taskGroups).where(eq(schema.taskGroups.chapterId, chapter.id));
    }
    // Finally delete chapters
    await db.delete(schema.chapters).where(eq(schema.chapters.bookId, bookId));
  }

  // Process task masters and chapters
  let chapterCount = 0;
  const processedChapters = new Set();

  console.log('Checking book1Data structure...');
  console.log('book1Data keys:', Object.keys(book1Data));
  console.log('task_masters exists:', !!book1Data.task_masters);
  
  if (!book1Data.task_masters) {
    console.log('No task_masters found in book1Data');
    return;
  }

  for (const [taskMasterKey, taskMaster] of Object.entries(book1Data.task_masters)) {
    console.log(`Processing task master: ${taskMasterKey}`);
    
    if (!taskMaster.major_task_groups) {
      console.log(`No major_task_groups found in ${taskMasterKey}`);
      continue;
    }
    
    for (const [majorTaskGroupKey, majorTaskGroup] of Object.entries(taskMaster.major_task_groups)) {
      console.log(`Processing major task group: ${majorTaskGroupKey}`);
      
      // Handle both uppercase and lowercase naming conventions
      const specificTaskGroups = majorTaskGroup.Specific_task_groups || majorTaskGroup.specific_task_groups;
      
      // Process major_activity_theme chapters first
      if (majorTaskGroupKey.startsWith('major_activity_theme')) {
        const chapterMatch = majorTaskGroup.chapter?.match(/Chapter (\d+)/);
        const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : 0;
        
        if (chapterNumber && !processedChapters.has(chapterNumber)) {
          processedChapters.add(chapterNumber);
          chapterCount++;
          
          console.log(`Creating activity theme chapter ${chapterNumber}: ${majorTaskGroup.chapter_title || 'Activity Theme'}...`);
          
          const chapterData = {
            bookId: bookId,
            chapterNumber: chapterNumber,
            uniqueIdentifier: safeTruncate(majorTaskGroup.unique_identifier, 255),
            title: safeTruncate(majorTaskGroup.chapter_title || majorTaskGroup.major_activity_theme_title || 'Activity Theme', 255),
            focus: safeTruncate(majorTaskGroup.focus_area || 'Activity', 255),
            epicNovelPages: safeTruncate(majorTaskGroup.epic_novel_pages, 255),
            epicChapterFocus: safeTruncate(majorTaskGroup.epic_chapter_focus, 255),
            epicNovelChapterFocus: safeTruncate(majorTaskGroup.epic_novel_chapter_focus, 255),
            epicNovelSectionName: safeTruncate(majorTaskGroup.epic_novel_section_name, 255),
            description: safeTruncate(majorTaskGroup.major_activity_theme_description, 255),
            tarotCardLink: safeTruncate(majorTaskGroup.tarot_card_link, 255),
            tarotFamily: safeTruncate(majorTaskGroup.new_tarot_family || majorTaskGroup.tarot_family, 255),
            tarotCardItem: safeTruncate(majorTaskGroup.tarot_card_item, 255),
            colorTheme: {
              name: safeTruncate(majorTaskGroup.color_name, 255),
              hex: safeTruncate(majorTaskGroup.hex_code, 10),
              rgb: {
                red: majorTaskGroup.red,
                green: majorTaskGroup.green,
                blue: majorTaskGroup.blue
              }
            }
          };

          const newChapter = await db.insert(schema.chapters).values(chapterData).returning({ id: schema.chapters.id });
          const chapterId = newChapter[0].id;

          // Create a default scene for activity theme chapter
          const sceneData = {
            chapterId: chapterId,
            sceneNumber: 1,
            title: safeTruncate(majorTaskGroup.chapter_title || 'Activity Theme Scene', 255),
            focus: safeTruncate(majorTaskGroup.focus_area || 'Activity', 255),
            description: safeTruncate(majorTaskGroup.major_activity_theme_tagline, 255),
            heroJourneyStage: safeTruncate(majorTaskGroup.epic_chapter_focus, 255),
            pages: safeTruncate(majorTaskGroup.epic_novel_pages, 255),
            primaryTarotCard: safeTruncate(`${majorTaskGroup.tarot_card_item} of ${majorTaskGroup.new_tarot_family || majorTaskGroup.tarot_family}`, 255),
            tarotNarrativeRole: safeTruncate(majorTaskGroup.major_activity_theme_description, 255),
          };

          await db.insert(schema.scenes).values(sceneData);

          // Create task group for activity theme
          const taskGroupData = {
            chapterId: chapterId,
            uniqueIdentifier: safeTruncate(majorTaskGroup.unique_identifier, 255),
            type: safeTruncate('Major Activity Theme', 255),
            title: safeTruncate(majorTaskGroup.chapter_title || 'Activity Theme', 255),
            description: safeTruncate(majorTaskGroup.major_activity_theme_description, 255),
            tagline: safeTruncate(majorTaskGroup.major_activity_theme_tagline, 255),
            focusArea: safeTruncate(majorTaskGroup.focus_area || 'Activity', 255),
            connectionToMajorTaskGroup: safeTruncate(majorTaskGroup.major_activity_theme_description, 255),
          };

          await db.insert(schema.taskGroups).values(taskGroupData);
        }
        continue; // Skip to next major task group
      }
      
      if (!specificTaskGroups) {
        console.log(`No specific task groups found in ${majorTaskGroupKey}`);
        continue;
      }
      
      for (const [specificTaskGroupKey, specificTaskGroup] of Object.entries(specificTaskGroups)) {
        const chapterMatch = specificTaskGroup.chapter.match(/Chapter (\d+)/);
        const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : 0;
        
        // Skip if we've already processed this chapter
        if (processedChapters.has(chapterNumber)) {
          continue;
        }
        
        processedChapters.add(chapterNumber);
        chapterCount++;

        console.log(`Creating chapter ${chapterNumber}: ${specificTaskGroup.chapter_title}...`);
        
        const chapterData = {
          bookId: bookId,
          chapterNumber: chapterNumber,
          uniqueIdentifier: safeTruncate(specificTaskGroup.unique_identifier, 255),
          title: safeTruncate(specificTaskGroup.chapter_title || specificTaskGroup.specific_task_group_title, 255),
          focus: safeTruncate(specificTaskGroup.focus_area, 255),
          epicNovelPages: safeTruncate(specificTaskGroup.epic_novel_pages, 255),
          epicChapterFocus: safeTruncate(specificTaskGroup.epic_chapter_focus, 255),
          epicNovelChapterFocus: safeTruncate(specificTaskGroup.epic_novel_chapter_focus, 255),
          epicNovelSectionName: safeTruncate(specificTaskGroup.epic_novel_section_name, 255),
          description: safeTruncate(specificTaskGroup.specific_task_group_description, 255),
          tarotCardLink: safeTruncate(specificTaskGroup.tarot_card_link, 255),
          tarotFamily: safeTruncate(specificTaskGroup.new_tarot_family || specificTaskGroup.tarot_family, 255),
          tarotCardItem: safeTruncate(specificTaskGroup.tarot_card_item, 255),
          colorTheme: {
            name: safeTruncate(specificTaskGroup.color_name, 255),
            hex: safeTruncate(specificTaskGroup.hex_code, 10),
            rgb: {
              red: specificTaskGroup.red,
              green: specificTaskGroup.green,
              blue: specificTaskGroup.blue
            }
          }
        };

        const newChapter = await db.insert(schema.chapters).values(chapterData).returning({ id: schema.chapters.id });
        const chapterId = newChapter[0].id;

        // Create scenes for this chapter
        if (specificTaskGroup.scenes && Array.isArray(specificTaskGroup.scenes)) {
          for (const scene of specificTaskGroup.scenes) {
            const sceneData = {
              chapterId: chapterId,
              sceneNumber: scene.scene_number,
              title: safeTruncate(scene.title, 255),
              focus: safeTruncate(specificTaskGroup.focus_area, 255),
              preliminarySceneFocus: safeTruncate(specificTaskGroup.epic_preliminary_scene_focus, 255),
              preliminarySceneDescription: safeTruncate(specificTaskGroup.epic_preliminary_scene_description, 255),
              description: safeTruncate(scene.setup, 255),
              heroJourneyStage: safeTruncate(specificTaskGroup.epic_chapter_focus, 255),
              pages: safeTruncate(specificTaskGroup.epic_novel_pages, 255),
              primaryTarotCard: safeTruncate(`${specificTaskGroup.tarot_card_item} of ${specificTaskGroup.new_tarot_family || specificTaskGroup.tarot_family}`, 255),
              tarotNarrativeRole: safeTruncate(specificTaskGroup.connection_to_the_major_task_group, 255),
              symbolism: safeTruncate(scene.symbolism, 255),
              beatGoal: safeTruncate(scene.beat_goal, 255),
              pointOfView: safeTruncate(scene.pov, 255),
              tense: safeTruncate(scene.tense, 255),
              coreEmotion: safeTruncate(scene.core_emotion, 255),
              sceneTone: safeTruncate(scene.scene_tone, 255),
              timelineDate: safeTruncate(scene.timeline_date, 255),
              timelineVariant: safeTruncate(scene.timeline_variant, 255)
            };

            await db.insert(schema.scenes).values(sceneData);
          }
        } else {
          // Create a default scene if no scenes array exists
          const sceneData = {
            chapterId: chapterId,
            sceneNumber: 1,
            title: safeTruncate(specificTaskGroup.epic_preliminary_scene_focus, 255),
            focus: safeTruncate(specificTaskGroup.focus_area, 255),
            preliminarySceneFocus: safeTruncate(specificTaskGroup.epic_preliminary_scene_focus, 255),
            preliminarySceneDescription: safeTruncate(specificTaskGroup.epic_preliminary_scene_description, 255),
            description: safeTruncate(specificTaskGroup.specific_task_group_tagline, 255),
            heroJourneyStage: safeTruncate(specificTaskGroup.epic_chapter_focus, 255),
            pages: safeTruncate(specificTaskGroup.epic_novel_pages, 255),
            primaryTarotCard: safeTruncate(`${specificTaskGroup.tarot_card_item} of ${specificTaskGroup.new_tarot_family || specificTaskGroup.tarot_family}`, 255),
            tarotNarrativeRole: safeTruncate(specificTaskGroup.connection_to_the_major_task_group, 255),
          };

          await db.insert(schema.scenes).values(sceneData);
        }

        // Create task group
        const taskGroupData = {
          chapterId: chapterId,
          uniqueIdentifier: safeTruncate(specificTaskGroup.unique_identifier, 255),
          type: safeTruncate(specificTaskGroup.type, 255),
          title: safeTruncate(specificTaskGroup.specific_task_group_title, 255),
          description: safeTruncate(specificTaskGroup.specific_task_group_description, 255),
          tagline: safeTruncate(specificTaskGroup.specific_task_group_tagline, 255),
          focusArea: safeTruncate(specificTaskGroup.focus_area, 255),
          connectionToMajorTaskGroup: safeTruncate(specificTaskGroup.connection_to_the_major_task_group, 255),
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