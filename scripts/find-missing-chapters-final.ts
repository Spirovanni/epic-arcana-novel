#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ChapterData {
  id: string; // EA-XXX
  unique_identifier: string; // STG X.X.X.X
  novel_book: number;
  all_chapter: number;
  specific_task_group_title: string;
}

function extractChaptersFromOutline(outlineData: any): ChapterData[] {
  const extractedChapters: ChapterData[] = [];
  
  const traverse = (node: any) => {
    if (typeof node !== 'object' || node === null) return;
    
    // Check if this node is a valid chapter (EA- ID, STG unique_identifier)
    if (node.id && typeof node.id === 'string' && node.id.startsWith('EA-') &&
        node.unique_identifier && typeof node.unique_identifier === 'string' &&
        node.unique_identifier.startsWith('STG ') &&
        node.chapter && typeof node.chapter === 'string' &&
        node.novel_book && typeof node.novel_book === 'number' &&
        node.all_chapter && typeof node.all_chapter === 'number' &&
        node.specific_task_group_title && typeof node.specific_task_group_title === 'string') {
      
      // Count numbers in STG identifier (must have at least 4)
      const parts = node.unique_identifier.replace('STG ', '').split(/[.\s]+/);
      const numbers = parts.filter(p => /^\d+$/.test(p.trim()));
      if (numbers.length >= 4) {
        extractedChapters.push({
          id: node.id,
          unique_identifier: node.unique_identifier,
          novel_book: node.novel_book,
          all_chapter: node.all_chapter,
          specific_task_group_title: node.specific_task_group_title,
        });
      }
    }
    
    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        traverse(node[key]);
      }
    }
  };
  
  traverse(outlineData);
  
  extractedChapters.sort((a, b) => {
    if (a.novel_book !== b.novel_book) {
      return a.novel_book - b.novel_book;
    }
    return a.all_chapter - b.all_chapter;
  });
  
  return extractedChapters;
}

async function findMissingChapters() {
  const outlineFilePath = resolve(__dirname, '../data/l_outline.json');
  const rawData = readFileSync(outlineFilePath, 'utf-8');
  const outlineData = JSON.parse(rawData);
  
  const allChaptersFromOutline = extractChaptersFromOutline(outlineData);
  console.log(`📚 Found ${allChaptersFromOutline.length} valid chapters in l_outline.json\n`);
  
  // Get all existing chapters with their chapter_id
  const existingChapters = await db.select({
    chapterId: chapters.chapterId,
    bookId: chapters.bookId,
    chapterNumber: chapters.chapterNumber,
  }).from(chapters);
  
  const existingChapterIds = new Set(existingChapters.map(c => c.chapterId).filter(Boolean));
  
  const missingChapters = allChaptersFromOutline.filter(
    c => !existingChapterIds.has(c.id)
  );
  
  console.log(`📊 Database has ${existingChapters.length} chapters`);
  console.log(`📋 Missing chapters: ${missingChapters.length}\n`);
  
  if (missingChapters.length > 0) {
    console.log('📝 Missing chapters:');
    for (const chapter of missingChapters.slice(0, 30)) {
      console.log(`   Book ${chapter.novel_book}, Chapter ${chapter.all_chapter}: ${chapter.id} (${chapter.unique_identifier})`);
    }
    if (missingChapters.length > 30) {
      console.log(`   ... and ${missingChapters.length - 30} more`);
    }
  } else {
    console.log('✅ All chapters from l_outline.json are in the database!');
  }
  
  // Check chapters per book
  const allBooks = await db.select({ id: books.id, bookNumber: books.bookNumber }).from(books);
  const chaptersByBook = new Map<number, number>();
  
  for (const chapter of existingChapters) {
    const book = allBooks.find(b => b.id === chapter.bookId);
    if (book) {
      chaptersByBook.set(book.bookNumber, (chaptersByBook.get(book.bookNumber) || 0) + 1);
    }
  }
  
  console.log('\n📖 Current chapters per book:');
  for (const [bookNum, count] of Array.from(chaptersByBook.entries()).sort()) {
    console.log(`   Book ${bookNum}: ${count} chapters (expected 40) ${count === 40 ? '✅' : '⚠️'}`);
  }
  
  // Count chapters per book in outline
  const outlineChaptersByBook = new Map<number, number>();
  for (const chapter of allChaptersFromOutline) {
    outlineChaptersByBook.set(chapter.novel_book, (outlineChaptersByBook.get(chapter.novel_book) || 0) + 1);
  }
  
  console.log('\n📖 Chapters per book in l_outline.json:');
  for (const [bookNum, count] of Array.from(outlineChaptersByBook.entries()).sort()) {
    console.log(`   Book ${bookNum}: ${count} chapters ${count === 40 ? '✅' : '⚠️'}`);
  }
  
  process.exit(0);
}

findMissingChapters().catch(console.error);

