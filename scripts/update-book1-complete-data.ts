#!/usr/bin/env tsx

/**
 * Script to update all Book 1 chapters with complete data from l_outline.json
 * This will populate all chapters with the same level of detail as Chapter 32
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the extracted chapter data
const chapterData = JSON.parse(readFileSync(resolve(__dirname, '../tmp/book1_chapters_1_40.json'), 'utf-8'));

// Convert hex to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 165, b: 0 }; // Default to orange
}

async function updateBook1CompleteData() {
  console.log('🚀 Starting Book 1 complete data update...');
  
  try {
    // Get Book 1
    const book1 = await db.select().from(books).where(eq(books.bookNumber, 1)).limit(1);
    
    if (book1.length === 0) {
      console.log('❌ Book 1 not found in database');
      return;
    }

    console.log(`📚 Found Book 1: ${book1[0].title}`);

    // Process each chapter
    for (let chapterNum = 1; chapterNum <= 40; chapterNum++) {
      const chapterKey = `chapter_${chapterNum}`;
      const chapterInfo = chapterData[chapterKey];
      
      if (!chapterInfo) {
        console.log(`⚠️  No data found for Chapter ${chapterNum}, skipping...`);
        continue;
      }

      const rgb = hexToRgb(chapterInfo.hexCode);
      
      console.log(`🔄 Updating Chapter ${chapterNum}: ${chapterInfo.title}`);
      
      // Prepare the complete update data
      const updateData = {
        title: chapterInfo.title,
        description: chapterInfo.description || `Chapter ${chapterNum} content`,
        focus: chapterInfo.focus || '',
        focusArea: chapterInfo.focusArea || '',
        epicNovelPages: chapterInfo.epicNovelPages || '',
        epicChapterFocus: chapterInfo.epicChapterFocus || '',
        epicNovelSectionName: chapterInfo.epicNovelSectionName || '',
        specificTaskGroupDescription: chapterInfo.specificTaskGroupDescription || '',
        specificTaskGroupTagline: chapterInfo.specificTaskGroupTagline || '',
        connectionToMajorTaskGroup: chapterInfo.connectionToMajorTaskGroup || '',
        tarotFamily: chapterInfo.tarotFamily || '',
        tarotCardItem: chapterInfo.tarotCardItem || '',
        tarotCardLink: chapterInfo.tarotCardLink || '',
        colorName: chapterInfo.colorName,
        hexCode: chapterInfo.hexCode,
        red: rgb.r,
        green: rgb.g,
        blue: rgb.b,
        terminalLearningObjectives: JSON.stringify(chapterInfo.terminalLearningObjectives || {}),
        specificTaskGroupBooksInfluencedBy: JSON.stringify(chapterInfo.specificTaskGroupBooksInfluencedBy || {}),
        updatedAt: new Date()
      };

      // Update ALL chapters with this chapter number
      const updateResult = await db.update(chapters)
        .set(updateData)
        .where(and(
          eq(chapters.bookId, book1[0].id),
          eq(chapters.chapterNumber, chapterNum)
        ));
      
      console.log(`   ✅ Updated Chapter ${chapterNum} with complete data`);
      
      // Log key details for verification
      console.log(`      📝 Title: ${chapterInfo.title}`);
      console.log(`      🎯 Focus: ${chapterInfo.focus}`);
      console.log(`      📖 Pages: ${chapterInfo.epicNovelPages}`);
      console.log(`      🎨 Color: ${chapterInfo.colorName} (${chapterInfo.hexCode})`);
      console.log(`      🔮 Tarot: ${chapterInfo.tarotFamily} ${chapterInfo.tarotCardItem}`);
      console.log(`      💡 Tagline: ${chapterInfo.specificTaskGroupTagline}`);
      console.log('');
    }

    console.log('🎉 Book 1 complete data update finished!');
    console.log('📊 All Book 1 chapters now have complete data matching Chapter 32 level of detail');
    console.log('✨ Chapter overview sections should now display full information for all chapters');
    
  } catch (error) {
    console.error('💥 Error updating Book 1 complete data:', error);
  }
}

updateBook1CompleteData();