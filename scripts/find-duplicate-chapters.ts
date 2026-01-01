#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { sql, eq, and } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function findDuplicates() {
  console.log('🔍 Finding duplicate chapters...\n');
  
  // Find duplicates by book_id + chapter_number
  const duplicates = await db.execute(sql`
    SELECT 
      book_id,
      chapter_number,
      COUNT(*) as count,
      STRING_AGG(id::text, ', ' ORDER BY created_at) as ids,
      STRING_AGG(chapter_id, ', ' ORDER BY created_at) as chapter_ids,
      STRING_AGG(title, ' | ' ORDER BY created_at) as titles
    FROM chapters
    GROUP BY book_id, chapter_number
    HAVING COUNT(*) > 1
    ORDER BY book_id, chapter_number;
  `);
  
  if (duplicates.rows.length === 0) {
    console.log('✅ No duplicates found by book_id + chapter_number\n');
  } else {
    console.log(`⚠️  Found ${duplicates.rows.length} duplicate groups:\n`);
    duplicates.rows.forEach((dup: any) => {
      console.log(`   Book ${dup.book_id.substring(0, 8)}..., Chapter ${dup.chapter_number}: ${dup.count} copies`);
      console.log(`      IDs: ${dup.ids}`);
      console.log(`      Chapter IDs: ${dup.chapter_ids || 'N/A'}`);
      console.log(`      Titles: ${dup.titles}`);
      console.log('');
    });
  }
  
  // Also check for duplicates by chapter_id
  const duplicatesByChapterId = await db.execute(sql`
    SELECT 
      chapter_id,
      COUNT(*) as count,
      STRING_AGG(id::text, ', ' ORDER BY created_at) as ids,
      STRING_AGG(chapter_number::text, ', ' ORDER BY created_at) as chapter_numbers
    FROM chapters
    WHERE chapter_id IS NOT NULL
    GROUP BY chapter_id
    HAVING COUNT(*) > 1
    ORDER BY chapter_id;
  `);
  
  if (duplicatesByChapterId.rows.length === 0) {
    console.log('✅ No duplicates found by chapter_id\n');
  } else {
    console.log(`⚠️  Found ${duplicatesByChapterId.rows.length} duplicate groups by chapter_id:\n`);
    duplicatesByChapterId.rows.forEach((dup: any) => {
      console.log(`   Chapter ID ${dup.chapter_id}: ${dup.count} copies`);
      console.log(`      UUIDs: ${dup.ids}`);
      console.log(`      Chapter Numbers: ${dup.chapter_numbers}`);
      console.log('');
    });
  }
  
  // Get all books for reference
  const allBooks = await db.select({ id: books.id, bookNumber: books.bookNumber }).from(books);
  const bookIdToNumber = new Map<string, number>();
  for (const book of allBooks) {
    bookIdToNumber.set(book.id, book.bookNumber);
  }
  
  // Get detailed info for duplicates
  if (duplicates.rows.length > 0 || duplicatesByChapterId.rows.length > 0) {
    console.log('\n📋 Detailed duplicate information:\n');
    
    const allDuplicateIds = new Set<string>();
    duplicates.rows.forEach((dup: any) => {
      dup.ids.split(', ').forEach((id: string) => allDuplicateIds.add(id.trim()));
    });
    duplicatesByChapterId.rows.forEach((dup: any) => {
      dup.ids.split(', ').forEach((id: string) => allDuplicateIds.add(id.trim()));
    });
    
    const duplicateChapters = await db.select({
      id: chapters.id,
      bookId: chapters.bookId,
      chapterNumber: chapters.chapterNumber,
      chapterId: chapters.chapterId,
      uniqueIdentifier: chapters.uniqueIdentifier,
      title: chapters.title,
      description: chapters.description,
      summary: chapters.summary,
      createdAt: chapters.createdAt,
    })
    .from(chapters)
    .where(sql`chapters.id = ANY(${Array.from(allDuplicateIds)})`)
    .orderBy(chapters.bookId, chapters.chapterNumber, chapters.createdAt);
    
    duplicateChapters.forEach(ch => {
      const bookNum = bookIdToNumber.get(ch.bookId) || '?';
      console.log(`   Book ${bookNum}, Chapter ${ch.chapterNumber} (${ch.chapterId || 'NO ID'}):`);
      console.log(`      UUID: ${ch.id.substring(0, 8)}...`);
      console.log(`      Title: ${ch.title || 'NO TITLE'}`);
      console.log(`      uniqueIdentifier: ${ch.uniqueIdentifier || 'NO ID'}`);
      console.log(`      Description: ${ch.description ? 'YES' : 'NO'}`);
      console.log(`      Summary: ${ch.summary ? 'YES' : 'NO'}`);
      console.log(`      Created: ${ch.createdAt}`);
      console.log('');
    });
  }
  
  const totalDuplicates = duplicates.rows.length + duplicatesByChapterId.rows.length;
  if (totalDuplicates > 0) {
    console.log(`\n📊 Total duplicate groups found: ${totalDuplicates}`);
  } else {
    console.log('\n✅ No duplicates found in the chapters table!');
  }
  
  process.exit(0);
}

findDuplicates().catch(console.error);

