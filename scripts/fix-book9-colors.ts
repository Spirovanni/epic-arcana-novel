#!/usr/bin/env tsx

/**
 * Script to fix Book 9 chapter colors by applying the correct amber/yellow-gold color scheme from l_outline.json
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Book 9 color mapping from l_outline.json (amber/yellow-gold progression)
// Note: Chapters 39 and 40 have incomplete data in l_outline.json
const book9Colors = {
  1: { name: "Canary", hex: "#FFFF99" },
  2: { name: "Laser Lemon", hex: "#FFFF66" },
  3: { name: "Gorse", hex: "#FFFF33" },
  4: { name: "Electric Lime", hex: "#CCFF00" },
  5: { name: "Wattle", hex: "#CCCC33" },
  6: { name: "Citrus", hex: "#99CC00" },
  7: { name: "Yellow Green", hex: "#99CC33" },
  8: { name: "Wild Willow", hex: "#CCCC66" },
  9: { name: "Olive", hex: "#999900" },
  10: { name: "Olive", hex: "#666600" },
  11: { name: "Amber", hex: "#FFBF00" },
  12: { name: "Christi", hex: "#669900" },
  13: { name: "Fuego", hex: "#BFCC2B" },
  14: { name: "Drover", hex: "#FFEA97" },
  15: { name: "Sweet Corn", hex: "#FFE57D" },
  16: { name: "Mustard", hex: "#FFDE5C" },
  17: { name: "Sunglow", hex: "#FFD633" },
  18: { name: "Tangerine Yellow", hex: "#FFCC00" },
  19: { name: "Gamboge", hex: "#CCA300" },
  20: { name: "Dark Goldenrod", hex: "#A38200" },
  21: { name: "Olive", hex: "#826800" },
  22: { name: "Raw Umber", hex: "#685300" },
  23: { name: "Metallic Gold", hex: "#D0B02F" },
  24: { name: "Amber", hex: "#FFBF00" },
  25: { name: "Husk", hex: "#AA9955" },
  26: { name: "White", hex: "#FFFFFF" },
  27: { name: "Very Light Grey", hex: "#CCCCCC" },
  28: { name: "Cream", hex: "#FFFFCC" },
  29: { name: "Green Mist", hex: "#CCCC99" },
  30: { name: "Nobel", hex: "#999999" },
  31: { name: "Avocado", hex: "#999966" },
  32: { name: "Dim Gray", hex: "#666666" },
  33: { name: "Verdigris", hex: "#666633" },
  34: { name: "Karaka", hex: "#333300" },
  35: { name: "Karaka Dark", hex: "#333311" },
  36: { name: "Highball", hex: "#999933" },
  37: { name: "Night Rider", hex: "#333333" },
  38: { name: "Highball", hex: "#8C8C44" },
  // Chapters 39 and 40 have incomplete data in l_outline.json
  // Using fallback colors based on the progression pattern
  39: { name: "Amber", hex: "#FFBF00" },
  40: { name: "Goldenrod", hex: "#DAA520" }
};

// Convert hex to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 191, b: 0 }; // Default to amber
}

async function fixBook9Colors() {
  console.log('🚀 Starting Book 9 color fix...');
  
  try {
    // Get Book 9
    const book9 = await db.select().from(books).where(eq(books.bookNumber, 9)).limit(1);
    
    if (book9.length === 0) {
      console.log('❌ Book 9 not found in database');
      return;
    }

    console.log(`📚 Found Book 9: ${book9[0].title}`);

    // Load chapter data from Book_9_Outline.json if it exists
    let book9OutlineData = null;
    try {
      book9OutlineData = JSON.parse(readFileSync(resolve(__dirname, '../lore/json/storyline/Book_9_Outline.json'), 'utf-8'));
    } catch (error) {
      console.log('⚠️  Book_9_Outline.json not found, using generic chapter titles');
    }
    
    // Update all chapters 1-40 with correct colors
    for (let chapterNum = 1; chapterNum <= 40; chapterNum++) {
      const colorData = book9Colors[chapterNum];
      
      if (!colorData) {
        console.log(`⚠️  No color mapping for Chapter ${chapterNum}, skipping...`);
        continue;
      }

      const rgb = hexToRgb(colorData.hex);
      
      // Find chapter data from Book_9_Outline.json if available
      let chapterTitle = `Chapter ${chapterNum}`;
      let chapterSummary = '';
      
      if (book9OutlineData && book9OutlineData.structure) {
        for (const section of book9OutlineData.structure) {
          if (section.chapters) {
            for (const chapter of section.chapters) {
              if (chapter.chapter === chapterNum) {
                chapterTitle = chapter.title;
                chapterSummary = chapter.summary || '';
                break;
              }
            }
          }
        }
      }
      
      // Add note for chapters 39-40 with incomplete data
      const noteForIncomplete = (chapterNum >= 39) ? ' (fallback color - incomplete data in l_outline.json)' : '';
      
      console.log(`🔄 Updating Chapter ${chapterNum}: ${chapterTitle} with color ${colorData.name} (${colorData.hex})${noteForIncomplete}`);
      
      // Update ALL chapters with this chapter number to have the correct color
      const updateData = {
        title: chapterTitle,
        colorName: colorData.name,
        hexCode: colorData.hex,
        red: rgb.r,
        green: rgb.g,
        blue: rgb.b,
        specificTaskGroupDescription: chapterSummary || `Chapter ${chapterNum} content`,
        updatedAt: new Date()
      };

      const updateResult = await db.update(chapters)
        .set(updateData)
        .where(and(
          eq(chapters.bookId, book9[0].id),
          eq(chapters.chapterNumber, chapterNum)
        ));
      
      console.log(`   ✅ Updated Chapter ${chapterNum} with correct color and data`);
    }

    console.log('🎉 Book 9 color fix completed successfully!');
    console.log('📊 All Book 9 chapters now have their correct amber/yellow-gold color progression from l_outline.json');
    console.log('ℹ️  Note: Chapters 39-40 used fallback colors due to incomplete data in l_outline.json');
    
  } catch (error) {
    console.error('💥 Error fixing Book 9 colors:', error);
  }
}

fixBook9Colors();