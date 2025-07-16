#!/usr/bin/env tsx

/**
 * Script to check current chapter colors in the database
 */

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, asc } from 'drizzle-orm';

async function checkChapterColors() {
  try {
    // Get Book 1 first
    const book1 = await db.select().from(books).where(eq(books.bookNumber, 1)).limit(1);
    
    if (book1.length === 0) {
      console.log('❌ Book 1 not found in database');
      return;
    }

    console.log(`📚 Found Book 1: ${book1[0].title} (ID: ${book1[0].id})`);

    // Get chapters for Book 1
    const bookChapters = await db.select({
      chapterNumber: chapters.chapterNumber,
      colorName: chapters.colorName,
      hexCode: chapters.hexCode,
      title: chapters.title
    }).from(chapters)
      .where(eq(chapters.bookId, book1[0].id))
      .orderBy(asc(chapters.chapterNumber));
    
    console.log(`\n🎨 Current chapter colors in database (${bookChapters.length} chapters):\n`);
    
    bookChapters.forEach(ch => {
      console.log(`Chapter ${ch.chapterNumber}: ${ch.colorName || 'No Color'} - ${ch.hexCode || 'No Hex'} (${ch.title || 'No Title'})`);
    });

  } catch (error) {
    console.error('❌ Error checking chapter colors:', error);
  }
}

checkChapterColors();