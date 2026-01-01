#!/usr/bin/env tsx

/**
 * Sync chapter_id and unique_identifier from l_outline.json to chapters table
 * Processes 10 chapters at a time for review
 * 
 * Usage: 
 *   tsx scripts/sync-chapter-ids-batch.ts [startIndex] [count]
 *   tsx scripts/sync-chapter-ids-batch.ts 0 10  (first 10 chapters)
 *   tsx scripts/sync-chapter-ids-batch.ts 10 10 (next 10 chapters)
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and, sql } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ChapterData {
  id: string; // EA-001, EA-002, etc.
  unique_identifier: string; // STG 1.1.1.1, etc. (never EA-*)
  chapter: string; // "Chapter 1", "Chapter 2", etc.
  novel_book: number;
  all_chapter: number;
}

/**
 * Extract all chapters from l_outline.json with their IDs and unique_identifiers
 */
function extractChaptersFromOutline(outlineData: any): ChapterData[] {
  const chapters: ChapterData[] = [];
  
  const trilogyBooks = outlineData.SelfImprovementSeries?.Books?.trilogies;
  if (!trilogyBooks) {
    throw new Error('Trilogy books not found in l_outline.json');
  }
  
  // Traverse all books, task masters, major task groups, and specific task groups
  for (const trilogyKey of Object.keys(trilogyBooks)) {
    const trilogy = trilogyBooks[trilogyKey];
    const trilogyBooksObj = trilogy?.trilogy_books;
    
    if (!trilogyBooksObj) continue;
    
    for (const bookKey of Object.keys(trilogyBooksObj)) {
      const book = trilogyBooksObj[bookKey];
      const taskMasters = book?.task_masters;
      
      if (!taskMasters) continue;
      
      for (const taskMasterKey of Object.keys(taskMasters)) {
        const taskMaster = taskMasters[taskMasterKey];
        const majorTaskGroups = taskMaster?.major_task_groups;
        
        if (!majorTaskGroups) continue;
        
        for (const majorTaskGroupKey of Object.keys(majorTaskGroups)) {
          const majorTaskGroup = majorTaskGroups[majorTaskGroupKey];
          const specificTaskGroups = majorTaskGroup?.specific_task_groups;
          
          if (!specificTaskGroups) continue;
          
          for (const specificTaskGroupKey of Object.keys(specificTaskGroups)) {
            const specificTaskGroup = specificTaskGroups[specificTaskGroupKey];
            
            // Extract chapter data
            if (specificTaskGroup.id && specificTaskGroup.unique_identifier) {
              const chapterMatch = specificTaskGroup.chapter?.match(/(\d+)/);
              const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : null;
              
              if (chapterNumber && specificTaskGroup.novel_book) {
                chapters.push({
                  id: specificTaskGroup.id, // EA-001, etc.
                  unique_identifier: specificTaskGroup.unique_identifier, // STG 1.1.1.1, etc.
                  chapter: specificTaskGroup.chapter,
                  novel_book: specificTaskGroup.novel_book,
                  all_chapter: specificTaskGroup.all_chapter || chapterNumber,
                });
              }
            }
          }
        }
      }
    }
  }
  
  // Sort by book number and chapter number
  chapters.sort((a, b) => {
    if (a.novel_book !== b.novel_book) {
      return a.novel_book - b.novel_book;
    }
    return a.all_chapter - b.all_chapter;
  });
  
  return chapters;
}

async function syncChapterIds(startIndex: number = 0, count: number = 10) {
  console.log(`🚀 Starting chapter ID sync (chapters ${startIndex} to ${startIndex + count - 1})`);
  
  try {
    // Load the l_outline.json file
    const outlineFilePath = resolve(__dirname, '../data/l_outline.json');
    const rawData = readFileSync(outlineFilePath, 'utf-8');
    const outlineData = JSON.parse(rawData);
    
    // Extract all chapters from outline
    const allChapters = extractChaptersFromOutline(outlineData);
    console.log(`📚 Found ${allChapters.length} total chapters in l_outline.json`);
    
    // Get the batch to process
    const batch = allChapters.slice(startIndex, startIndex + count);
    console.log(`📋 Processing batch of ${batch.length} chapters:\n`);
    
    if (batch.length === 0) {
      console.log('⚠️  No chapters to process in this range');
      return;
    }
    
    // Get all books to create a book number to ID map
    const allBooks = await db.select({
      id: books.id,
      bookNumber: books.bookNumber,
    }).from(books);
    
    const bookNumberToId = new Map<number, string>();
    for (const book of allBooks) {
      bookNumberToId.set(book.bookNumber, book.id);
    }
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const chapterData of batch) {
      const bookId = bookNumberToId.get(chapterData.novel_book);
      
      if (!bookId) {
        console.log(`⚠️  Skipped: Book ${chapterData.novel_book} not found in database`);
        skippedCount++;
        continue;
      }
      
      // Find the chapter in the database by book and chapter number
      const existingChapters = await db
        .select()
        .from(chapters)
        .where(
          and(
            eq(chapters.bookId, bookId),
            eq(chapters.chapterNumber, chapterData.all_chapter)
          )
        )
        .limit(1);
      
      if (existingChapters.length === 0) {
        console.log(`⚠️  Skipped: Chapter ${chapterData.all_chapter} (Book ${chapterData.novel_book}) not found in database`);
        skippedCount++;
        continue;
      }
      
      const chapter = existingChapters[0];
      
      // Validate that unique_identifier doesn't start with EA-
      const uniqueIdentifier = chapterData.unique_identifier?.startsWith('EA-')
        ? null  // Don't set if it starts with EA-
        : chapterData.unique_identifier;
      
      // Update the chapter
      await db
        .update(chapters)
        .set({
          chapterId: chapterData.id, // EA-001, EA-002, etc.
          uniqueIdentifier: uniqueIdentifier || chapter.uniqueIdentifier, // Only update if it doesn't start with EA-
          updatedAt: new Date(),
        })
        .where(eq(chapters.id, chapter.id));
      
      console.log(`✅ Updated: Book ${chapterData.novel_book}, Chapter ${chapterData.all_chapter}`);
      console.log(`   chapter_id: ${chapterData.id}`);
      console.log(`   unique_identifier: ${uniqueIdentifier || chapter.uniqueIdentifier || '(unchanged)'}`);
      console.log(`   title: ${chapter.title || '(no title)'}\n`);
      updatedCount++;
    }
    
    console.log('\n📊 Summary:');
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   ⚠️  Skipped: ${skippedCount}`);
    console.log(`   📝 Total in batch: ${batch.length}`);
    
    if (startIndex + count < allChapters.length) {
      console.log(`\n🔄 Next batch: tsx scripts/sync-chapter-ids-batch.ts ${startIndex + count} ${count}`);
    } else {
      console.log('\n🎉 All chapters processed!');
    }
    
  } catch (error) {
    console.error('\n💥 Sync operation failed:', error);
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

// Run the sync
syncChapterIds(startIndex, count).catch(console.error);

