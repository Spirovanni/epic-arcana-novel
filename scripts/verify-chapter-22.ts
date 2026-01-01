#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function verify() {
  const book1 = await db.select({ id: books.id }).from(books).where(eq(books.bookNumber, 1)).limit(1);
  
  if (book1.length === 0) {
    console.log('❌ Book 1 not found');
    process.exit(1);
  }
  
  const chapter22 = await db.select({
    id: chapters.id,
    chapterId: chapters.chapterId,
    uniqueIdentifier: chapters.uniqueIdentifier,
    title: chapters.title,
    description: chapters.description,
    summary: chapters.summary,
    focus: chapters.focus,
    epicNovelPages: chapters.epicNovelPages,
    tarotFamily: chapters.tarotFamily,
  }).from(chapters).where(and(eq(chapters.bookId, book1[0].id), eq(chapters.chapterNumber, 22))).limit(1);
  
  if (chapter22.length === 0) {
    console.log('❌ Chapter 22 not found');
    process.exit(1);
  }
  
  const ch = chapter22[0];
  
  console.log('✅ Chapter 22 after merge:');
  console.log('   Chapter ID:', ch.chapterId || 'N/A');
  console.log('   Unique Identifier:', ch.uniqueIdentifier || 'N/A');
  console.log('   Title:', ch.title || 'N/A');
  console.log('   Focus:', ch.focus || 'N/A');
  console.log('   Epic Novel Pages:', ch.epicNovelPages || 'N/A');
  console.log('   Tarot Family:', ch.tarotFamily || 'N/A');
  console.log('   Description:', ch.description ? `YES (${ch.description.substring(0, 60)}...)` : 'NO');
  console.log('   Summary:', ch.summary ? `YES (${ch.summary.substring(0, 60)}...)` : 'NO');
  
  const totalCount = await db.select().from(chapters);
  console.log('\n📊 Total chapters in database:', totalCount.length);
  
  // Check for duplicates
  const duplicates = await db.execute(sql`
    SELECT book_id, chapter_number, COUNT(*) as count
    FROM chapters
    GROUP BY book_id, chapter_number
    HAVING COUNT(*) > 1
  `);
  
  console.log('📋 Duplicates remaining:', duplicates.rows.length);
  
  process.exit(0);
}

verify().catch(console.error);

