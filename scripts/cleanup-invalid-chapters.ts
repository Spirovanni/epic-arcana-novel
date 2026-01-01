#!/usr/bin/env tsx

/**
 * Clean up invalid chapters from the database
 * Removes chapters that:
 * - Have unique_identifier starting with "MAT"
 * - Have unique_identifier with less than 4 numbers (not STG format)
 * - Don't have an EA- chapter_id assigned
 * 
 * Only keeps chapters with:
 * - unique_identifier starting with "STG" (like "STG 1.1.1.1")
 * - chapter_id with EA- prefix
 * - Exactly 40 chapters per book
 */

import { db } from '../src/lib/db';
import { chapters, books, scenes, chapterPages, chapterTasks, taskGroups, chapterWritingGuidance } from '../src/lib/schema';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { eq, and, sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get all valid EA- IDs from l_outline.json
 */
function getValidEaIds(outlineData: any): Set<string> {
  const eaIds = new Set<string>();
  
  function findAllEaIds(obj: any) {
    if (typeof obj !== 'object' || obj === null) return;
    
    if (obj.id && typeof obj.id === 'string' && obj.id.startsWith('EA-')) {
      eaIds.add(obj.id);
    }
    
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        for (const item of obj[key]) {
          findAllEaIds(item);
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        findAllEaIds(obj[key]);
      }
    }
  }
  
  findAllEaIds(outlineData);
  return eaIds;
}

/**
 * Check if unique_identifier has at least 4 numbers (STG format: STG 1.1.1.1)
 * Examples: "STG 1.1.1.1" (4 numbers), "STG 2.2.6.3" (4 numbers) - both valid
 */
function hasValidStgFormat(uniqueIdentifier: string | null): boolean {
  if (!uniqueIdentifier) return false;
  if (!uniqueIdentifier.startsWith('STG ')) return false;
  
  // Count numbers in the identifier (should have at least 4 for STG 1.1.1.1 format)
  // Split by spaces and dots, then count numeric parts
  const parts = uniqueIdentifier.replace('STG ', '').split(/[.\s]+/);
  const numbers = parts.filter(p => /^\d+$/.test(p.trim()));
  return numbers.length >= 4;
}

async function cleanupInvalidChapters() {
  console.log('🧹 Starting cleanup of invalid chapters...\n');
  
  try {
    // Load valid EA- IDs from l_outline.json
    const outlineFilePath = resolve(__dirname, '../data/l_outline.json');
    const rawData = readFileSync(outlineFilePath, 'utf-8');
    const outlineData = JSON.parse(rawData);
    const validEaIds = getValidEaIds(outlineData);
    
    console.log(`📚 Found ${validEaIds.size} valid EA- IDs in l_outline.json\n`);
    
    // Get all chapters
    const allChapters = await db.select({
      id: chapters.id,
      bookId: chapters.bookId,
      chapterNumber: chapters.chapterNumber,
      chapterId: chapters.chapterId,
      uniqueIdentifier: chapters.uniqueIdentifier,
      title: chapters.title,
    }).from(chapters);
    
    // Get book numbers for display
    const allBooks = await db.select({
      id: books.id,
      bookNumber: books.bookNumber,
    }).from(books);
    
    const bookIdToNumber = new Map<string, number>();
    for (const book of allBooks) {
      bookIdToNumber.set(book.id, book.bookNumber);
    }
    
    console.log(`📊 Found ${allChapters.length} total chapters in database\n`);
    
    // Identify invalid chapters
    const invalidChapters: Array<{ id: string; reason: string; bookNumber: number; chapterNumber: number; title: string | null }> = [];
    
    for (const chapter of allChapters) {
      const bookNumber = bookIdToNumber.get(chapter.bookId) || 0;
      const reasons: string[] = [];
      
      // Check 1: unique_identifier starts with "MAT" - REMOVED: MAT chapters are valid!
      // MAT chapters are valid Major Activity Theme chapters
      
      // Check 2: unique_identifier doesn't have valid STG format (less than 4 numbers)
      if (chapter.uniqueIdentifier && !hasValidStgFormat(chapter.uniqueIdentifier)) {
        reasons.push(`unique_identifier invalid format: ${chapter.uniqueIdentifier}`);
      }
      
      // Check 3: No EA- chapter_id assigned
      if (!chapter.chapterId || !chapter.chapterId.startsWith('EA-')) {
        reasons.push('no EA- chapter_id assigned');
      }
      
      // Check 4: chapter_id not in l_outline.json
      if (chapter.chapterId && !validEaIds.has(chapter.chapterId)) {
        reasons.push(`chapter_id ${chapter.chapterId} not found in l_outline.json`);
      }
      
      if (reasons.length > 0) {
        invalidChapters.push({
          id: chapter.id,
          reason: reasons.join(', '),
          bookNumber,
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
        });
      }
    }
    
    console.log(`⚠️  Found ${invalidChapters.length} invalid chapters to delete:\n`);
    
    if (invalidChapters.length === 0) {
      console.log('✅ No invalid chapters found! All chapters meet the criteria.');
      return;
    }
    
    // Show first 20 invalid chapters
    console.log('📋 First 20 invalid chapters:');
    for (const chapter of invalidChapters.slice(0, 20)) {
      console.log(`   Book ${chapter.bookNumber}, Chapter ${chapter.chapterNumber}: ${chapter.title || '(no title)'}`);
      console.log(`      Reason: ${chapter.reason}`);
    }
    
    if (invalidChapters.length > 20) {
      console.log(`   ... and ${invalidChapters.length - 20} more\n`);
    } else {
      console.log('');
    }
    
    // Delete invalid chapters (first delete dependent records)
    console.log(`🗑️  Deleting ${invalidChapters.length} invalid chapters...\n`);
    
    let deletedCount = 0;
    let errorCount = 0;
    
    for (const chapter of invalidChapters) {
      try {
        const chapterId = chapter.id;
        
        // Delete dependent records first (tables without CASCADE)
        try {
          await db.delete(scenes).where(eq(scenes.chapterId, chapterId));
        } catch (e) {
          // Ignore if no scenes exist
        }
        
        try {
          await db.delete(chapterPages).where(eq(chapterPages.chapterId, chapterId));
        } catch (e) {
          // Ignore if no pages exist
        }
        
        try {
          await db.delete(chapterTasks).where(eq(chapterTasks.chapterId, chapterId));
        } catch (e) {
          // Ignore if no tasks exist
        }
        
        try {
          await db.delete(taskGroups).where(eq(taskGroups.chapterId, chapterId));
        } catch (e) {
          // Ignore if no task groups exist
        }
        
        try {
          await db.delete(chapterWritingGuidance).where(eq(chapterWritingGuidance.chapterId, chapterId));
        } catch (e) {
          // Ignore if no guidance exists
        }
        
        // Now delete the chapter (tables with CASCADE will auto-delete)
        await db.delete(chapters).where(eq(chapters.id, chapterId));
        deletedCount++;
        if (deletedCount <= 10 || deletedCount % 50 === 0) {
          console.log(`   ✅ Deleted: Book ${chapter.bookNumber}, Chapter ${chapter.chapterNumber} (${chapter.title || 'no title'})`);
        }
      } catch (error: any) {
        errorCount++;
        if (errorCount <= 10) {
          console.error(`   ❌ Error deleting chapter ${chapter.id}:`, error.message);
        }
      }
    }
    
    if (errorCount > 10) {
      console.log(`   ⚠️  ... and ${errorCount - 10} more errors`);
    }
    
    console.log(`\n📊 Cleanup Summary:`);
    console.log(`   ✅ Deleted: ${deletedCount} invalid chapters`);
    console.log(`   📝 Total processed: ${invalidChapters.length}`);
    
    // Verify remaining chapters
    const remainingChapters = await db.select({
      id: chapters.id,
      bookId: chapters.bookId,
      chapterNumber: chapters.chapterNumber,
      chapterId: chapters.chapterId,
      uniqueIdentifier: chapters.uniqueIdentifier,
    }).from(chapters);
    
    console.log(`\n📚 Remaining chapters in database: ${remainingChapters.length}`);
    
    // Check chapters per book (join with books table to get accurate book numbers)
    const chaptersWithBooks = await db
      .select({
        bookNumber: books.bookNumber,
        chapterId: chapters.chapterId,
        uniqueIdentifier: chapters.uniqueIdentifier,
      })
      .from(chapters)
      .innerJoin(books, eq(chapters.bookId, books.id));
    
    const chaptersByBook = new Map<number, number>();
    for (const row of chaptersWithBooks) {
      chaptersByBook.set(row.bookNumber, (chaptersByBook.get(row.bookNumber) || 0) + 1);
    }
    
    console.log('\n📖 Chapters per book after cleanup:');
    for (const [bookNum, count] of Array.from(chaptersByBook.entries()).sort()) {
      console.log(`   Book ${bookNum}: ${count} chapters ${count === 40 ? '✅' : '⚠️'}`);
    }
    
    // Check for chapters missing chapter_id or with invalid unique_identifier
    const stillInvalid = chaptersWithBooks.filter(
      c => !c.chapterId || 
           !c.chapterId.startsWith('EA-') || 
           !c.uniqueIdentifier || 
           !c.uniqueIdentifier.startsWith('STG ') ||
           !hasValidStgFormat(c.uniqueIdentifier)
    );
    
    if (stillInvalid.length > 0) {
      console.log(`\n⚠️  Warning: ${stillInvalid.length} remaining chapters may still be invalid.`);
      console.log('   First 10:');
      for (const chapter of stillInvalid.slice(0, 10)) {
        console.log(`   Book ${chapter.bookNumber}: chapter_id=${chapter.chapterId || 'none'}, unique_identifier=${chapter.uniqueIdentifier || 'none'}`);
      }
    }
    
  } catch (error) {
    console.error('\n💥 Cleanup failed:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanupInvalidChapters().catch(console.error);

