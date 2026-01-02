#!/usr/bin/env tsx

/**
 * Populate icon_path for all Book 1 chapters
 * Format: /icons/chapters/book1/chapter{N}.png where N is the chapter number
 */

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function populateBook1IconPaths() {
  console.log('🚀 Populating icon_path for all Book 1 chapters...\n');
  
  try {
    // Get Book 1
    const book1Record = await db.select({ id: books.id }).from(books).where(eq(books.bookNumber, 1)).limit(1);
    
    if (book1Record.length === 0) {
      console.log('❌ Book 1 not found in database');
      process.exit(1);
    }
    
    const book1Id = book1Record[0].id;
    
    // Get all Book 1 chapters
    const allChapters = await db
      .select({
        id: chapters.id,
        chapterNumber: chapters.chapterNumber,
        chapterId: chapters.chapterId,
        title: chapters.title,
        iconPath: chapters.iconPath,
      })
      .from(chapters)
      .where(eq(chapters.bookId, book1Id))
      .orderBy(chapters.chapterNumber);
    
    console.log(`📊 Found ${allChapters.length} chapters for Book 1\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const chapter of allChapters) {
      // Format: /icons/chapters/book1/chapter{N}.png
      const iconPath = `/icons/chapters/book1/chapter${chapter.chapterNumber}.png`;
      
      // Only update if it's different or null
      if (chapter.iconPath !== iconPath) {
        await db
          .update(chapters)
          .set({
            iconPath: iconPath,
            updatedAt: new Date(),
          })
          .where(eq(chapters.id, chapter.id));
        
        updatedCount++;
        console.log(`✅ Chapter ${chapter.chapterNumber} (${chapter.chapterId || 'N/A'}): ${iconPath}`);
      } else {
        skippedCount++;
        console.log(`⏭️  Chapter ${chapter.chapterNumber}: Already set correctly`);
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📝 Total: ${allChapters.length}`);
    console.log('\n🎉 All Book 1 icon_path values have been populated!');
    
  } catch (error) {
    console.error('\n💥 Population failed:', error);
    process.exit(1);
  }
}

populateBook1IconPaths().catch(console.error);

