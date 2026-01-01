#!/usr/bin/env tsx

/**
 * Upload missing chapters from l_outline.json to the database
 * Creates chapters that don't exist yet, including their chapter_id and unique_identifier
 * Processes in batches for review
 * 
 * Usage:
 *   tsx scripts/upload-missing-chapters.ts [startIndex] [count]
 *   tsx scripts/upload-missing-chapters.ts 0 10  (first 10 missing chapters)
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, books, taskMasters, majorTaskGroups } from '../src/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

interface ChapterSourceData {
  id: string; // EA-001, etc.
  unique_identifier: string; // STG 1.1.1.1, etc.
  chapter: string; // "Chapter 1"
  novel_book: number;
  all_chapter: number;
  specific_task_group_title?: string;
  focus_area?: string;
  epic_novel_pages?: string;
  epic_chapter_focus?: string;
  epic_novel_chapter_focus?: string;
  epic_novel_section_name?: string;
  specific_task_group_description?: string;
  tarot_card_link?: string;
  tarot_family?: string;
  new_tarot_family?: string;
  tarot_card_item?: string;
  color_name?: string;
  hex_code?: string;
  red?: number;
  green?: number;
  blue?: number;
  connection_to_the_major_task_group?: string;
  specific_task_group_tagline?: string;
  specific_task_group_books_influenced_by?: any;
  terminal_learning_objectives?: any;
  summary?: string;
  type?: string;
  // Context needed for hierarchy
  bookKey?: string;
  taskMasterKey?: string;
  majorTaskGroupKey?: string;
  specificTaskGroupKey?: string;
}

/**
 * Recursively find all chapter data from l_outline.json
 */
function findAllChaptersRecursive(obj: any, path: string = '', context: any = {}): ChapterSourceData[] {
  const chapters: ChapterSourceData[] = [];
  
  if (typeof obj !== 'object' || obj === null) {
    return chapters;
  }
  
  // Track context as we traverse
  let newContext = { ...context };
  if (obj.unique_identifier && typeof obj.unique_identifier === 'string') {
    if (obj.unique_identifier.startsWith('MT ')) {
      newContext.taskMasterKey = obj.unique_identifier;
    } else if (obj.unique_identifier.startsWith('MAT ')) {
      newContext.majorTaskGroupKey = obj.unique_identifier;
    }
  }
  
  // Check if this object is a chapter with EA- ID
  if (obj.id && typeof obj.id === 'string' && obj.id.startsWith('EA-')) {
    const chapterMatch = obj.chapter?.match(/(\d+)/);
    const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : null;
    
    // Extract EA- number to help determine book
    const eaMatch = obj.id.match(/EA-(\d+)/);
    const eaNumber = eaMatch ? parseInt(eaMatch[1], 10) : null;
    
    // Determine book number
    let novelBook = obj.novel_book;
    if (!novelBook && eaNumber) {
      novelBook = Math.ceil(eaNumber / 40);
      if (novelBook > 9) novelBook = 9;
    }
    
    // Use all_chapter or infer from EA number
    let allChapter = obj.all_chapter;
    if (!allChapter && novelBook && eaNumber) {
      allChapter = eaNumber - ((novelBook - 1) * 40);
      if (allChapter < 1 || allChapter > 40) {
        allChapter = chapterNumber || eaNumber;
      }
    }
    if (!allChapter) {
      allChapter = chapterNumber || eaNumber || 0;
    }
    
    chapters.push({
      id: obj.id,
      unique_identifier: obj.unique_identifier || '',
      chapter: obj.chapter || '',
      novel_book: novelBook || 1,
      all_chapter: allChapter,
      specific_task_group_title: obj.specific_task_group_title,
      focus_area: obj.focus_area,
      epic_novel_pages: obj.epic_novel_pages,
      epic_chapter_focus: obj.epic_chapter_focus,
      epic_novel_chapter_focus: obj.epic_novel_chapter_focus,
      epic_novel_section_name: obj.epic_novel_section_name,
      specific_task_group_description: obj.specific_task_group_description,
      tarot_card_link: obj.tarot_card_link,
      tarot_family: obj.tarot_family,
      new_tarot_family: obj.new_tarot_family,
      tarot_card_item: obj.tarot_card_item,
      color_name: obj.color_name,
      hex_code: obj.hex_code,
      red: obj.red,
      green: obj.green,
      blue: obj.blue,
      connection_to_the_major_task_group: obj.connection_to_the_major_task_group || obj.connection_to_the_major_task_group,
      specific_task_group_tagline: obj.specific_task_group_tagline,
      specific_task_group_books_influenced_by: obj.specific_task_group_books_influenced_by,
      terminal_learning_objectives: obj.terminal_learning_objectives,
      summary: obj.summary,
      type: obj.type,
      bookKey: context.bookKey,
      taskMasterKey: newContext.taskMasterKey || context.taskMasterKey,
      majorTaskGroupKey: newContext.majorTaskGroupKey || context.majorTaskGroupKey,
    });
  }
  
  // Recursively search
  for (const key in obj) {
    let keyContext = newContext;
    if (key.startsWith('Book') || key === 'Book1' || key === 'Book2' || key === 'Book3' || 
        key === 'Book4' || key === 'Book5' || key === 'Book6' || key === 'Book7' || 
        key === 'Book8' || key === 'Book9') {
      keyContext = { ...newContext, bookKey: key };
    }
    
    if (Array.isArray(obj[key])) {
      for (const item of obj[key]) {
        chapters.push(...findAllChaptersRecursive(item, `${path}.${key}[]`, keyContext));
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      chapters.push(...findAllChaptersRecursive(obj[key], `${path}.${key}`, keyContext));
    }
  }
  
  return chapters;
}

async function uploadMissingChapters(startIndex: number = 0, count: number = 10) {
  console.log(`🚀 Starting missing chapter upload (chapters ${startIndex} to ${startIndex + count - 1})`);
  
  try {
    // Load the l_outline.json file
    const outlineFilePath = resolve(__dirname, '../data/l_outline.json');
    const rawData = readFileSync(outlineFilePath, 'utf-8');
    const outlineData = JSON.parse(rawData);
    
    // Extract all chapters from outline
    const allSourceChapters = findAllChaptersRecursive(outlineData);
    console.log(`📚 Found ${allSourceChapters.length} total chapters in l_outline.json`);
    
    // Get all existing chapters from database
    const existingChapters = await db
      .select({
        id: chapters.id,
        bookId: chapters.bookId,
        chapterNumber: chapters.chapterNumber,
      })
      .from(chapters);
    
    // Create a set of existing chapter keys (bookId + chapterNumber)
    const existingChapterKeys = new Set<string>();
    for (const chapter of existingChapters) {
      existingChapterKeys.add(`${chapter.bookId}-${chapter.chapterNumber}`);
    }
    
    // Get all books to map book numbers to IDs
    const allBooks = await db.select({
      id: books.id,
      bookNumber: books.bookNumber,
    }).from(books);
    
    const bookNumberToId = new Map<number, string>();
    for (const book of allBooks) {
      bookNumberToId.set(book.bookNumber, book.id);
    }
    
    // Filter to only missing chapters
    const missingChapters: ChapterSourceData[] = [];
    for (const sourceChapter of allSourceChapters) {
      const bookId = bookNumberToId.get(sourceChapter.novel_book);
      if (!bookId) {
        // Skip if book doesn't exist
        continue;
      }
      
      const key = `${bookId}-${sourceChapter.all_chapter}`;
      if (!existingChapterKeys.has(key)) {
        missingChapters.push(sourceChapter);
      }
    }
    
    console.log(`📋 Found ${missingChapters.length} missing chapters in database`);
    console.log(`📝 Processing batch of ${Math.min(count, missingChapters.length - startIndex)} chapters:\n`);
    
    // Sort missing chapters by book and chapter number
    missingChapters.sort((a, b) => {
      if (a.novel_book !== b.novel_book) {
        return a.novel_book - b.novel_book;
      }
      return a.all_chapter - b.all_chapter;
    });
    
    const batch = missingChapters.slice(startIndex, startIndex + count);
    
    if (batch.length === 0) {
      console.log('✅ No missing chapters to process in this range');
      return;
    }
    
    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const sourceChapter of batch) {
      try {
        const bookId = bookNumberToId.get(sourceChapter.novel_book);
        
        if (!bookId) {
          console.log(`⚠️  Skipped: Book ${sourceChapter.novel_book} not found in database`);
          skippedCount++;
          continue;
        }
        
        // Try to find majorTaskGroupId - may not exist for all chapters
        let majorTaskGroupId: string | null = null;
        if (sourceChapter.majorTaskGroupKey) {
          const majorTaskGroupsFound = await db
            .select({ id: majorTaskGroups.id })
            .from(majorTaskGroups)
            .where(eq(majorTaskGroups.uniqueIdentifier, sourceChapter.majorTaskGroupKey))
            .limit(1);
          if (majorTaskGroupsFound.length > 0) {
            majorTaskGroupId = majorTaskGroupsFound[0].id;
          }
        }
        
        // Validate unique_identifier doesn't start with EA-
        const uniqueIdentifier = sourceChapter.unique_identifier && !sourceChapter.unique_identifier.startsWith('EA-')
          ? sourceChapter.unique_identifier
          : null;
        
        // Prepare chapter data
        const chapterDbData: any = {
          bookId,
          majorTaskGroupId: majorTaskGroupId || undefined,
          chapterNumber: sourceChapter.all_chapter,
          chapterId: sourceChapter.id, // EA-001, etc.
          uniqueIdentifier: uniqueIdentifier,
          title: sourceChapter.specific_task_group_title || `Chapter ${sourceChapter.all_chapter}`,
          focus: sourceChapter.focus_area,
          epicNovelPages: sourceChapter.epic_novel_pages,
          epicChapterFocus: sourceChapter.epic_chapter_focus,
          epicNovelChapterFocus: sourceChapter.epic_novel_chapter_focus,
          epicNovelSectionName: sourceChapter.epic_novel_section_name,
          description: sourceChapter.specific_task_group_description,
          tarotCardLink: sourceChapter.tarot_card_link,
          tarotFamily: sourceChapter.tarot_family || sourceChapter.new_tarot_family,
          newTarotFamily: sourceChapter.new_tarot_family,
          tarotCardItem: sourceChapter.tarot_card_item,
          colorTheme: sourceChapter.color_name || sourceChapter.hex_code ? {
            name: sourceChapter.color_name,
            hex: sourceChapter.hex_code,
            rgb: {
              red: sourceChapter.red || 0,
              green: sourceChapter.green || 0,
              blue: sourceChapter.blue || 0,
            }
          } : undefined,
          type: sourceChapter.type,
          colorName: sourceChapter.color_name,
          hexCode: sourceChapter.hex_code,
          red: sourceChapter.red || 0,
          green: sourceChapter.green || 0,
          blue: sourceChapter.blue || 0,
          focusArea: sourceChapter.focus_area,
          connectionToMajorTaskGroup: sourceChapter.connection_to_the_major_task_group,
          specificTaskGroupDescription: sourceChapter.specific_task_group_description,
          specificTaskGroupTagline: sourceChapter.specific_task_group_tagline,
          specificTaskGroupBooksInfluencedBy: sanitizeJsonData(sourceChapter.specific_task_group_books_influenced_by),
          terminalLearningObjectives: sanitizeJsonData(sourceChapter.terminal_learning_objectives),
          summary: sourceChapter.summary,
          updatedAt: new Date(),
        };
        
        // Remove undefined values
        Object.keys(chapterDbData).forEach(key => {
          if (chapterDbData[key] === undefined) {
            delete chapterDbData[key];
          }
        });
        
        // Insert the chapter
        await db.insert(chapters).values(chapterDbData);
        
        console.log(`✅ Created: Book ${sourceChapter.novel_book}, Chapter ${sourceChapter.all_chapter}`);
        console.log(`   chapter_id: ${sourceChapter.id}`);
        console.log(`   unique_identifier: ${uniqueIdentifier || '(none)'}`);
        console.log(`   title: ${chapterDbData.title}\n`);
        createdCount++;
        
      } catch (error: any) {
        console.error(`❌ Error creating chapter ${sourceChapter.id}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`   ✅ Created: ${createdCount}`);
    console.log(`   ⚠️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total in batch: ${batch.length}`);
    
    if (startIndex + count < missingChapters.length) {
      console.log(`\n🔄 Next batch: tsx scripts/upload-missing-chapters.ts ${startIndex + count} ${count}`);
    } else {
      console.log('\n🎉 All missing chapters processed!');
    }
    
  } catch (error) {
    console.error('\n💥 Upload operation failed:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const startIndex = process.argv[2] ? parseInt(process.argv[2], 10) : 0;
const count = process.argv[3] ? parseInt(process.argv[3], 10) : 10;

// Validate arguments
if (isNaN(startIndex) || startIndex < 0) {
  console.error('❌ Invalid startIndex. Must be a non-negative number.');
  process.exit(1);
}

if (isNaN(count) || count <= 0) {
  console.error('❌ Invalid count. Must be a positive number.');
  process.exit(1);
}

// Run the upload
uploadMissingChapters(startIndex, count).catch(console.error);

