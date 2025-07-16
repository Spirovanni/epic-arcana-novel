#!/usr/bin/env tsx

/**
 * Comprehensive sync script to populate database with ALL data from l_outline.json
 * This script ensures that l_outline.json is the authoritative source of truth
 * for all Epic Arcana novel data, including books, task masters, major task groups, and chapters
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { 
  novelSeries, 
  books, 
  taskMasters, 
  majorTaskGroups, 
  chapters
} from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface TaskMaster {
  unique_identifier: string;
  type: string;
  color_name: string;
  hex_code: string;
  red: number;
  green: number;
  blue: number;
  title: string;
  tagline: string;
  description: string;
  fiction_novel_section_title: string;
  fiction_novel_section_description: string;
  fiction_novel_section_tagline: string;
  fiction_novel_section_books_influenced_by: Record<string, string>;
  major_task_groups: Record<string, any>;
}

interface Book {
  unique_identifier: string;
  title: string;
  fiction_novel_title: string;
  subject: string;
  focus: string;
  epic_novel_plot: string;
  unique_theme: string;
  military_component: string;
  business_model_generation: string;
  personality_type: string;
  enneagram_type: string;
  enneagram_description: string;
  covey_habit: string;
  associated_sin: string;
  business_model_you: string;
  type: string;
  tagline: string;
  logline: string;
  description: string;
  themes: string[];
  key_themes: Record<string, string[]>;
  triumph: string;
  color_name: string;
  hex_code: string;
  red: number;
  green: number;
  blue: number;
  task_masters: Record<string, TaskMaster>;
}

interface OutlineData {
  SelfImprovementSeries: {
    title: string;
    tagline: string;
    logline: string;
    synopsis: string;
    description: string;
    genres: string[];
    themes: string[];
    keythemes: Record<string, string[]>;
    Books: Record<string, Book>;
  };
}

function sanitizeJsonData(data: any): any {
  if (typeof data === 'string') {
    return data.replace(/\0/g, '');
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeJsonData);
  }
  if (typeof data === 'object' && data !== null) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      cleaned[key] = sanitizeJsonData(value);
    }
    return cleaned;
  }
  return data;
}

function extractBookNumber(identifier: string): number {
  if (!identifier) return 0;
  const match = identifier.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

async function syncNovelSeries(novelData: OutlineData['SelfImprovementSeries']): Promise<string> {
  console.log('🔄 Syncing novel series data...');
  
  // Check if series exists
  const existingSeries = await db
    .select()
    .from(novelSeries)
    .where(eq(novelSeries.title, novelData.title))
    .limit(1);
  
  const seriesData = {
    title: novelData.title,
    tagline: novelData.tagline,
    logline: novelData.logline,
    synopsis: novelData.synopsis,
    description: novelData.description,
    genres: sanitizeJsonData(novelData.genres),
    themes: sanitizeJsonData(novelData.themes),
    keyThemes: sanitizeJsonData(novelData.keythemes),
    updatedAt: new Date()
  };
  
  let seriesId: string;
  
  if (existingSeries.length > 0) {
    // Update existing series
    await db
      .update(novelSeries)
      .set(seriesData)
      .where(eq(novelSeries.id, existingSeries[0].id));
    
    seriesId = existingSeries[0].id;
    console.log(`✅ Updated existing series: ${novelData.title}`);
  } else {
    // Create new series
    const newSeries = await db
      .insert(novelSeries)
      .values(seriesData)
      .returning();
    
    seriesId = newSeries[0].id;
    console.log(`✅ Created new series: ${novelData.title}`);
  }
  
  return seriesId;
}

async function syncBooks(seriesId: string, booksData: Record<string, Book>): Promise<Record<string, string>> {
  console.log('🔄 Syncing books data...');
  
  const bookIdMap: Record<string, string> = {};
  
  for (const [bookKey, bookData] of Object.entries(booksData)) {
    const bookNumber = extractBookNumber(bookData.unique_identifier);
    
    // Check if book exists
    const existingBook = await db
      .select()
      .from(books)
      .where(eq(books.bookNumber, bookNumber))
      .limit(1);
    
    const bookDbData = {
      seriesId,
      bookNumber,
      uniqueIdentifier: bookData.unique_identifier,
      title: bookData.title,
      fictionNovelTitle: bookData.fiction_novel_title,
      subject: bookData.subject,
      focus: bookData.focus,
      epicNovelPlot: bookData.epic_novel_plot,
      uniqueTheme: bookData.unique_theme,
      militaryComponent: bookData.military_component,
      businessModelGeneration: bookData.business_model_generation,
      personalityType: bookData.personality_type,
      enneagramType: bookData.enneagram_type,
      enneagramDescription: bookData.enneagram_description,
      coveryCoveyHabit: bookData.covey_habit,
      associatedSin: bookData.associated_sin,
      businessModelYou: bookData.business_model_you,
      type: bookData.type,
      tagline: bookData.tagline,
      logline: bookData.logline,
      description: bookData.description,
      themes: sanitizeJsonData(bookData.themes),
      keyThemes: sanitizeJsonData(bookData.key_themes),
      triumph: bookData.triumph,
      updatedAt: new Date()
    };
    
    let bookId: string;
    
    if (existingBook.length > 0) {
      // Update existing book
      await db
        .update(books)
        .set(bookDbData)
        .where(eq(books.id, existingBook[0].id));
      
      bookId = existingBook[0].id;
      console.log(`✅ Updated book ${bookNumber}: ${bookData.fiction_novel_title}`);
    } else {
      // Create new book
      const newBook = await db
        .insert(books)
        .values(bookDbData)
        .returning();
      
      bookId = newBook[0].id;
      console.log(`✅ Created book ${bookNumber}: ${bookData.fiction_novel_title}`);
    }
    
    bookIdMap[bookKey] = bookId;
  }
  
  return bookIdMap;
}

async function syncTaskMasters(bookIdMap: Record<string, string>, booksData: Record<string, Book>): Promise<Record<string, string>> {
  console.log('🔄 Syncing task masters data...');
  
  const taskMasterIdMap: Record<string, string> = {};
  
  for (const [bookKey, bookData] of Object.entries(booksData)) {
    const bookId = bookIdMap[bookKey];
    
    if (!bookId || !bookData.task_masters) continue;
    
    for (const [taskMasterKey, taskMasterData] of Object.entries(bookData.task_masters)) {
      // Check if task master exists
      const existingTaskMaster = await db
        .select()
        .from(taskMasters)
        .where(eq(taskMasters.uniqueIdentifier, taskMasterData.unique_identifier))
        .limit(1);
      
      const taskMasterDbData = {
        bookId,
        uniqueIdentifier: taskMasterData.unique_identifier,
        type: taskMasterData.type,
        colorName: taskMasterData.color_name,
        hexCode: taskMasterData.hex_code,
        red: taskMasterData.red,
        green: taskMasterData.green,
        blue: taskMasterData.blue,
        title: taskMasterData.title,
        tagline: taskMasterData.tagline,
        description: taskMasterData.description,
        fictionNovelSectionTitle: taskMasterData.fiction_novel_section_title,
        fictionNovelSectionDescription: taskMasterData.fiction_novel_section_description,
        fictionNovelSectionTagline: taskMasterData.fiction_novel_section_tagline,
        fictionNovelSectionBooksInfluencedBy: sanitizeJsonData(taskMasterData.fiction_novel_section_books_influenced_by),
        updatedAt: new Date()
      };
      
      let taskMasterId: string;
      
      if (existingTaskMaster.length > 0) {
        // Update existing task master
        await db
          .update(taskMasters)
          .set(taskMasterDbData)
          .where(eq(taskMasters.id, existingTaskMaster[0].id));
        
        taskMasterId = existingTaskMaster[0].id;
        console.log(`✅ Updated task master: ${taskMasterData.title}`);
      } else {
        // Create new task master
        const newTaskMaster = await db
          .insert(taskMasters)
          .values(taskMasterDbData)
          .returning();
        
        taskMasterId = newTaskMaster[0].id;
        console.log(`✅ Created task master: ${taskMasterData.title}`);
      }
      
      taskMasterIdMap[`${bookKey}_${taskMasterKey}`] = taskMasterId;
    }
  }
  
  return taskMasterIdMap;
}

async function syncMajorTaskGroups(
  taskMasterIdMap: Record<string, string>, 
  booksData: Record<string, Book>
): Promise<Record<string, string>> {
  console.log('🔄 Syncing major task groups data...');
  
  const majorTaskGroupIdMap: Record<string, string> = {};
  
  for (const [bookKey, bookData] of Object.entries(booksData)) {
    if (!bookData.task_masters) continue;
    
    for (const [taskMasterKey, taskMasterData] of Object.entries(bookData.task_masters)) {
      const taskMasterId = taskMasterIdMap[`${bookKey}_${taskMasterKey}`];
      
      if (!taskMasterId || !taskMasterData.major_task_groups) continue;
      
      for (const [majorTaskGroupKey, majorTaskGroupData] of Object.entries(taskMasterData.major_task_groups)) {
        // Check if major task group exists
        const existingMajorTaskGroup = await db
          .select()
          .from(majorTaskGroups)
          .where(eq(majorTaskGroups.uniqueIdentifier, majorTaskGroupData.unique_identifier))
          .limit(1);
        
        const majorTaskGroupDbData = {
          taskMasterId,
          uniqueIdentifier: majorTaskGroupData.unique_identifier,
          type: majorTaskGroupData.type,
          colorName: majorTaskGroupData.color_name,
          hexCode: majorTaskGroupData.hex_code,
          red: majorTaskGroupData.red,
          green: majorTaskGroupData.green,
          blue: majorTaskGroupData.blue,
          title: majorTaskGroupData.major_task_group_title,
          description: majorTaskGroupData.major_task_group_description,
          tagline: majorTaskGroupData.major_task_group_tagline,
          booksInfluencedBy: sanitizeJsonData(majorTaskGroupData.major_task_group_books_influenced_by),
          updatedAt: new Date()
        };
        
        let majorTaskGroupId: string;
        
        if (existingMajorTaskGroup.length > 0) {
          // Update existing major task group
          await db
            .update(majorTaskGroups)
            .set(majorTaskGroupDbData)
            .where(eq(majorTaskGroups.id, existingMajorTaskGroup[0].id));
          
          majorTaskGroupId = existingMajorTaskGroup[0].id;
          console.log(`✅ Updated major task group: ${majorTaskGroupData.major_task_group_title}`);
        } else {
          // Create new major task group
          const newMajorTaskGroup = await db
            .insert(majorTaskGroups)
            .values(majorTaskGroupDbData)
            .returning();
          
          majorTaskGroupId = newMajorTaskGroup[0].id;
          console.log(`✅ Created major task group: ${majorTaskGroupData.major_task_group_title}`);
        }
        
        majorTaskGroupIdMap[`${bookKey}_${taskMasterKey}_${majorTaskGroupKey}`] = majorTaskGroupId;
      }
    }
  }
  
  return majorTaskGroupIdMap;
}

async function syncChapters(
  bookIdMap: Record<string, string>,
  majorTaskGroupIdMap: Record<string, string>,
  booksData: Record<string, Book>
): Promise<void> {
  console.log('🔄 Syncing chapters data...');
  
  for (const [bookKey, bookData] of Object.entries(booksData)) {
    const bookId = bookIdMap[bookKey];
    
    if (!bookId || !bookData.task_masters) continue;
    
    for (const [taskMasterKey, taskMasterData] of Object.entries(bookData.task_masters)) {
      if (!taskMasterData.major_task_groups) continue;
      
      for (const [majorTaskGroupKey, majorTaskGroupData] of Object.entries(taskMasterData.major_task_groups)) {
        const majorTaskGroupId = majorTaskGroupIdMap[`${bookKey}_${taskMasterKey}_${majorTaskGroupKey}`];
        
        if (!majorTaskGroupId || !majorTaskGroupData.specific_task_groups) continue;
        
        for (const [specificTaskGroupKey, specificTaskGroupData] of Object.entries(majorTaskGroupData.specific_task_groups)) {
          // Extract chapter number from the chapter field
          const chapterMatch = specificTaskGroupData.chapter?.match(/(\d+)/);
          const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : 0;
          
          if (chapterNumber === 0) continue;
          
          // Check if chapter exists
          const existingChapter = await db
            .select()
            .from(chapters)
            .where(eq(chapters.uniqueIdentifier, specificTaskGroupData.unique_identifier))
            .limit(1);
          
          const chapterDbData = {
            bookId,
            majorTaskGroupId,
            chapterNumber,
            uniqueIdentifier: specificTaskGroupData.unique_identifier,
            title: specificTaskGroupData.specific_task_group_title,
            focus: specificTaskGroupData.focus_area,
            epicNovelPages: specificTaskGroupData.epic_novel_pages,
            epicChapterFocus: specificTaskGroupData.epic_chapter_focus,
            epicNovelChapterFocus: specificTaskGroupData.epic_novel_chapter_focus,
            epicNovelSectionName: specificTaskGroupData.epic_novel_section_name,
            description: specificTaskGroupData.specific_task_group_description,
            tarotCardLink: specificTaskGroupData.tarot_card_link,
            tarotFamily: specificTaskGroupData.tarot_family,
            tarotCardItem: specificTaskGroupData.tarot_card_item,
            colorTheme: {
              name: specificTaskGroupData.color_name,
              hex: specificTaskGroupData.hex_code,
              rgb: {
                red: specificTaskGroupData.red,
                green: specificTaskGroupData.green,
                blue: specificTaskGroupData.blue
              }
            },
            type: specificTaskGroupData.type,
            colorName: specificTaskGroupData.color_name,
            hexCode: specificTaskGroupData.hex_code,
            red: specificTaskGroupData.red,
            green: specificTaskGroupData.green,
            blue: specificTaskGroupData.blue,
            focusArea: specificTaskGroupData.focus_area,
            connectionToMajorTaskGroup: specificTaskGroupData.connection_to_major_task_group,
            specificTaskGroupDescription: specificTaskGroupData.specific_task_group_description,
            specificTaskGroupTagline: specificTaskGroupData.specific_task_group_tagline,
            specificTaskGroupBooksInfluencedBy: sanitizeJsonData(specificTaskGroupData.specific_task_group_books_influenced_by),
            terminalLearningObjectives: sanitizeJsonData(specificTaskGroupData.terminal_learning_objectives),
            updatedAt: new Date()
          };
          
          if (existingChapter.length > 0) {
            // Update existing chapter
            await db
              .update(chapters)
              .set(chapterDbData)
              .where(eq(chapters.id, existingChapter[0].id));
            
            console.log(`✅ Updated chapter ${chapterNumber}: ${specificTaskGroupData.specific_task_group_title}`);
          } else {
            // Create new chapter
            await db
              .insert(chapters)
              .values(chapterDbData);
            
            console.log(`✅ Created chapter ${chapterNumber}: ${specificTaskGroupData.specific_task_group_title}`);
          }
        }
      }
    }
  }
}

async function main() {
  console.log('🚀 Starting comprehensive sync from l_outline.json');
  console.log('📋 This will populate the database with ALL Epic Arcana data');
  console.log('⚠️  Any conflicting data in the database will be overwritten');
  
  try {
    // Load the l_outline.json file
    const outlineFilePath = resolve(__dirname, '../lore/l_outline.json');
    const rawData = readFileSync(outlineFilePath, 'utf-8');
    const outlineData: OutlineData = JSON.parse(rawData);
    
    if (!outlineData.SelfImprovementSeries) {
      throw new Error('SelfImprovementSeries not found in l_outline.json');
    }
    
    // Sync in order of dependencies
    const seriesId = await syncNovelSeries(outlineData.SelfImprovementSeries);
    const bookIdMap = await syncBooks(seriesId, outlineData.SelfImprovementSeries.Books);
    const taskMasterIdMap = await syncTaskMasters(bookIdMap, outlineData.SelfImprovementSeries.Books);
    const majorTaskGroupIdMap = await syncMajorTaskGroups(taskMasterIdMap, outlineData.SelfImprovementSeries.Books);
    await syncChapters(bookIdMap, majorTaskGroupIdMap, outlineData.SelfImprovementSeries.Books);
    
    console.log('\n🎉 Comprehensive sync completed successfully!');
    console.log('📊 Database has been populated with all Epic Arcana data');
    console.log('🔄 l_outline.json is now the authoritative source of truth');
    
  } catch (error) {
    console.error('\n💥 Sync operation failed:', error);
    process.exit(1);
  }
}

// Run the sync
main().catch(console.error);