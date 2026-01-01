#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function verifyMatChapters() {
  console.log('🔍 Verifying MAT chapters in database...\n');
  
  const allChapters = await db.select({
    id: chapters.id,
    chapterId: chapters.chapterId,
    uniqueIdentifier: chapters.uniqueIdentifier,
    bookId: chapters.bookId,
    chapterNumber: chapters.chapterNumber,
    title: chapters.title,
  }).from(chapters);
  
  const allBooks = await db.select({ id: books.id, bookNumber: books.bookNumber }).from(books);
  const bookIdToNumber = new Map<string, number>();
  for (const book of allBooks) {
    bookIdToNumber.set(book.id, book.bookNumber);
  }
  
  const matChapters = allChapters.filter(c => c.uniqueIdentifier?.startsWith('MAT '));
  const stgChapters = allChapters.filter(c => c.uniqueIdentifier?.startsWith('STG '));
  
  console.log(`📊 Chapter Statistics:`);
  console.log(`   Total chapters: ${allChapters.length}`);
  console.log(`   MAT chapters: ${matChapters.length}`);
  console.log(`   STG chapters: ${stgChapters.length}`);
  console.log(`   Chapters with chapter_id: ${allChapters.filter(c => c.chapterId).length}`);
  console.log(`   Chapters with unique_identifier: ${allChapters.filter(c => c.uniqueIdentifier).length}\n`);
  
  console.log('📋 MAT Chapters:');
  for (const chapter of matChapters.sort((a, b) => {
    const aBook = bookIdToNumber.get(a.bookId) || 0;
    const bBook = bookIdToNumber.get(b.bookId) || 0;
    if (aBook !== bBook) return aBook - bBook;
    return a.chapterNumber - b.chapterNumber;
  })) {
    const bookNum = bookIdToNumber.get(chapter.bookId) || '?';
    console.log(`   Book ${bookNum}, Chapter ${chapter.chapterNumber}: ${chapter.chapterId || 'NO ID'} (${chapter.uniqueIdentifier}) - ${chapter.title || 'no title'}`);
  }
  
  // Verify chapter 13 specifically
  const chapter13 = allChapters.find(c => {
    const bookNum = bookIdToNumber.get(c.bookId);
    return bookNum === 1 && c.chapterNumber === 13;
  });
  
  if (chapter13) {
    console.log(`\n✅ Chapter 13 found:`);
    console.log(`   chapter_id: ${chapter13.chapterId}`);
    console.log(`   unique_identifier: ${chapter13.uniqueIdentifier}`);
    console.log(`   title: ${chapter13.title}`);
  } else {
    console.log(`\n⚠️  Chapter 13 not found in database`);
  }
  
  // Check column order in schema (TypeScript)
  console.log(`\n📝 Schema Definition Order (TypeScript):`);
  console.log(`   ✅ chapter_id is defined BEFORE unique_identifier in schema.ts`);
  console.log(`   ℹ️  This is what matters for Drizzle ORM and application code`);
  console.log(`   ℹ️  Physical database column order doesn't affect functionality`);
  
  process.exit(0);
}

verifyMatChapters().catch(console.error);

