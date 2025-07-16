#!/usr/bin/env tsx

/**
 * Script to fix Book 8 chapter colors by applying the correct chartreuse/yellow color scheme from l_outline.json
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Book 8 color mapping from l_outline.json (chartreuse/yellow progression)
const book8Colors = {
  1: { name: "Mint Green", hex: "#99FF99" },
  2: { name: "Reef", hex: "#CCFF99" },
  3: { name: "Screamin' Green", hex: "#66FF66" },
  4: { name: "Lime Green", hex: "#33FF33" },
  5: { name: "Fern", hex: "#66CC66" },
  6: { name: "Free Speech Green", hex: "#00CC00" },
  7: { name: "Kelly Green", hex: "#33CC00" },
  8: { name: "Dark Pastel Green", hex: "#00CC33" },
  9: { name: "Olivine", hex: "#99CC66" },
  10: { name: "Verdun Green", hex: "#336600" },
  11: { name: "Chartreuse", hex: "#7FFF00" },
  12: { name: "Limeade", hex: "#669933" },
  13: { name: "Apple", hex: "#5BD540" },
  14: { name: "Australian Mint", hex: "#EAFFAC" },
  15: { name: "Tidal", hex: "#E5FF97" },
  16: { name: "Mindaro", hex: "#DEFF7D" },
  17: { name: "Mindaro", hex: "#D6FF5C" },
  18: { name: "Pear", hex: "#CCFF33" },
  19: { name: "Yellow Green", hex: "#A3CC29" },
  20: { name: "Limerick", hex: "#82A321" },
  21: { name: "Olive Drab", hex: "#68821A" },
  22: { name: "Fiji Green", hex: "#536815" },
  23: { name: "Conifer", hex: "#B0D04F" },
  24: { name: "Chartreuse", hex: "#7FFF00" },
  25: { name: "Mantis", hex: "#7BC342" },
  26: { name: "Mindaro", hex: "#CCFF66" },
  27: { name: "Feijoa", hex: "#99FF66" },
  28: { name: "Spring Bud", hex: "#99FF00" },
  29: { name: "Green Yellow", hex: "#99FF33" },
  30: { name: "Bright Green", hex: "#66FF00" },
  31: { name: "Harlequin", hex: "#33FF00" },
  32: { name: "Bright Green", hex: "#66FF33" },
  33: { name: "Lime Green", hex: "#33CC33" },
  34: { name: "Apple", hex: "#66CC33" },
  35: { name: "La Palma", hex: "#339900" },
  36: { name: "Yellow", hex: "#FFFF00" },
  37: { name: "Kelly Green", hex: "#66CC00" },
  38: { name: "Lawn Green", hex: "#7BEA22" },
  39: { name: "Yellow", hex: "#FFFF00" },
  40: { name: "Lima", hex: "#74C62B" }
};

// Convert hex to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 127, g: 255, b: 0 }; // Default to chartreuse
}

async function fixBook8Colors() {
  console.log('🚀 Starting Book 8 color fix...');
  
  try {
    // Get Book 8
    const book8 = await db.select().from(books).where(eq(books.bookNumber, 8)).limit(1);
    
    if (book8.length === 0) {
      console.log('❌ Book 8 not found in database');
      return;
    }

    console.log(`📚 Found Book 8: ${book8[0].title}`);

    // Load chapter data from Book_8_Splendor_of_the_Ancient_Garden_Outline.json if it exists
    let book8OutlineData = null;
    try {
      book8OutlineData = JSON.parse(readFileSync(resolve(__dirname, '../lore/json/storyline/Book_8_Splendor_of_the_Ancient_Garden_Outline.json'), 'utf-8'));
    } catch (error) {
      console.log('⚠️  Book_8_Splendor_of_the_Ancient_Garden_Outline.json not found, using generic chapter titles');
    }
    
    // Update all chapters 1-40 with correct colors
    for (let chapterNum = 1; chapterNum <= 40; chapterNum++) {
      const colorData = book8Colors[chapterNum];
      
      if (!colorData) {
        console.log(`⚠️  No color mapping for Chapter ${chapterNum}, skipping...`);
        continue;
      }

      const rgb = hexToRgb(colorData.hex);
      
      // Find chapter data from Book_8_Splendor_of_the_Ancient_Garden_Outline.json if available
      let chapterTitle = `Chapter ${chapterNum}`;
      let chapterSummary = '';
      
      if (book8OutlineData && book8OutlineData.structure) {
        for (const section of book8OutlineData.structure) {
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
      
      console.log(`🔄 Updating Chapter ${chapterNum}: ${chapterTitle} with color ${colorData.name} (${colorData.hex})`);
      
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
          eq(chapters.bookId, book8[0].id),
          eq(chapters.chapterNumber, chapterNum)
        ));
      
      console.log(`   ✅ Updated Chapter ${chapterNum} with correct color and data`);
    }

    console.log('🎉 Book 8 color fix completed successfully!');
    console.log('📊 All Book 8 chapters now have their correct chartreuse/yellow color progression from l_outline.json');
    
  } catch (error) {
    console.error('💥 Error fixing Book 8 colors:', error);
  }
}

fixBook8Colors();