#!/usr/bin/env tsx

/**
 * Script to check current Book 4 colors in the database
 */

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, asc } from 'drizzle-orm';

async function checkBook4Colors() {
  try {
    // Get Book 4 first
    const book4 = await db.select().from(books).where(eq(books.bookNumber, 4)).limit(1);
    
    if (book4.length === 0) {
      console.log('❌ Book 4 not found in database');
      return;
    }

    console.log(`📚 Found Book 4: ${book4[0].title} (ID: ${book4[0].id})`);

    // Get chapters for Book 4
    const bookChapters = await db.select({
      chapterNumber: chapters.chapterNumber,
      colorName: chapters.colorName,
      hexCode: chapters.hexCode,
      title: chapters.title
    }).from(chapters)
      .where(eq(chapters.bookId, book4[0].id))
      .orderBy(asc(chapters.chapterNumber));
    
    console.log(`\n🎨 Current chapter colors in database (${bookChapters.length} chapters):\n`);
    
    // Group by chapter number to see duplicates
    const chapterMap = new Map();
    bookChapters.forEach(ch => {
      if (!chapterMap.has(ch.chapterNumber)) {
        chapterMap.set(ch.chapterNumber, []);
      }
      chapterMap.get(ch.chapterNumber).push(ch);
    });

    // Display grouped results
    for (let chapterNum = 1; chapterNum <= 40; chapterNum++) {
      const chapterEntries = chapterMap.get(chapterNum) || [];
      if (chapterEntries.length === 0) {
        console.log(`Chapter ${chapterNum}: ❌ MISSING`);
      } else if (chapterEntries.length === 1) {
        const ch = chapterEntries[0];
        console.log(`Chapter ${chapterNum}: ${ch.colorName || 'No Color'} - ${ch.hexCode || 'No Hex'} (${ch.title || 'No Title'})`);
      } else {
        console.log(`Chapter ${chapterNum}: 🔄 ${chapterEntries.length} DUPLICATES`);
        chapterEntries.forEach((ch, i) => {
          console.log(`  ${i + 1}. ${ch.colorName || 'No Color'} - ${ch.hexCode || 'No Hex'} (${ch.title || 'No Title'})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error checking Book 4 colors:', error);
  }
}

checkBook4Colors();