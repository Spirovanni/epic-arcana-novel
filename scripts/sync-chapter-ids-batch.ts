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
 * Recursively traverse JSON to find all objects with EA- IDs
 */
function findAllChaptersRecursive(obj: any, path: string = ''): ChapterData[] {
  const chapters: ChapterData[] = [];
  
  if (typeof obj !== 'object' || obj === null) {
    return chapters;
  }
  
  // Check if this object is a chapter with EA- ID
  if (obj.id && typeof obj.id === 'string' && obj.id.startsWith('EA-')) {
    const chapterMatch = obj.chapter?.match(/(\d+)/);
    const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : null;
    
    // Extract EA- number to help determine book
    const eaMatch = obj.id.match(/EA-(\d+)/);
    const eaNumber = eaMatch ? parseInt(eaMatch[1], 10) : null;
    
    // Determine book number from EA- number (each book has ~40 chapters)
    // EA-001 to EA-040 = Book 1, EA-041 to EA-080 = Book 2, etc.
    let novelBook = obj.novel_book;
    if (!novelBook && eaNumber) {
      novelBook = Math.ceil(eaNumber / 40);
      if (novelBook > 9) novelBook = 9; // Cap at book 9
    }
    
    // Use all_chapter or infer from EA number
    let allChapter = obj.all_chapter;
    if (!allChapter && novelBook && eaNumber) {
      // EA numbers are sequential across all books, so for book N:
      // all_chapter = EA number - (book-1) * 40
      allChapter = eaNumber - ((novelBook - 1) * 40);
      if (allChapter < 1 || allChapter > 40) {
        // Fallback: just use chapter number from chapter field
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
    });
  }
  
  // Recursively search in all child objects/arrays
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      for (const item of obj[key]) {
        chapters.push(...findAllChaptersRecursive(item, `${path}.${key}[]`));
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      chapters.push(...findAllChaptersRecursive(obj[key], `${path}.${key}`));
    }
  }
  
  return chapters;
}

/**
 * Extract all chapters from l_outline.json with their IDs and unique_identifiers
 */
function extractChaptersFromOutline(outlineData: any): ChapterData[] {
  // Use recursive search to find ALL chapters with EA- IDs
  const allChapters = findAllChaptersRecursive(outlineData);
  
  // Remove duplicates (in case same chapter appears multiple times)
  const uniqueChapters = new Map<string, ChapterData>();
  for (const chapter of allChapters) {
    const key = chapter.id;
    if (!uniqueChapters.has(key)) {
      uniqueChapters.set(key, chapter);
    } else {
      // If duplicate, prefer the one with more complete data
      const existing = uniqueChapters.get(key)!;
      if ((!existing.unique_identifier && chapter.unique_identifier) ||
          (!existing.novel_book && chapter.novel_book) ||
          (!existing.all_chapter && chapter.all_chapter)) {
        uniqueChapters.set(key, chapter);
      }
    }
  }
  
  const chapters = Array.from(uniqueChapters.values());
  
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
      // If unique_identifier starts with EA-, don't update it (keep existing value)
      let uniqueIdentifier = chapterData.unique_identifier;
      if (!uniqueIdentifier || uniqueIdentifier.startsWith('EA-')) {
        // Keep existing unique_identifier if the new one is invalid or starts with EA-
        uniqueIdentifier = chapter.uniqueIdentifier || null;
      }
      
      // Prepare update data
      const updateData: any = {
        chapterId: chapterData.id, // EA-001, EA-002, etc.
        updatedAt: new Date(),
      };
      
      // Only update unique_identifier if we have a valid one
      if (uniqueIdentifier && !uniqueIdentifier.startsWith('EA-')) {
        updateData.uniqueIdentifier = uniqueIdentifier;
      }
      
      // Update the chapter
      await db
        .update(chapters)
        .set(updateData)
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

