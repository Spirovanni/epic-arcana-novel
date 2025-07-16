#!/usr/bin/env tsx

/**
 * Script to fix Book 6 chapter colors by applying the correct teal/cyan color scheme from l_outline.json
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Book 6 color mapping from l_outline.json (teal/cyan progression)
// Note: Book 6 has 37 chapters, missing chapters 13, 23, and 38
const book6Colors = {
  1: { name: "Light Cyan", hex: "#CCFFFF" },
  2: { name: "Morning Glory", hex: "#99CCCC" },
  3: { name: "Summer Sky", hex: "#33CCFF" },
  4: { name: "Java", hex: "#339999" },
  5: { name: "Pacific Blue", hex: "#0099CC" },
  6: { name: "Cadet Blue", hex: "#669999" },
  7: { name: "Summer Sky", hex: "#3399CC" },
  8: { name: "Cerulean", hex: "#006699" },
  9: { name: "Mosque", hex: "#006666" },
  10: { name: "Cyprus", hex: "#003333" },
  11: { name: "Teal", hex: "#008080" },
  12: { name: "Blumine", hex: "#336666" },
  // Chapter 13 is missing in l_outline.json
  14: { name: "Pattens Blue", hex: "#C1EAFF" },
  15: { name: "Columbia Blue", hex: "#B1E5FF" },
  16: { name: "Columbia Blue", hex: "#9DDEFF" },
  17: { name: "Light Sky Blue", hex: "#85D6FF" },
  18: { name: "Maya Blue", hex: "#66CCFF" },
  19: { name: "Picton Blue", hex: "#52A3CC" },
  20: { name: "Boston Blue", hex: "#4282A3" },
  21: { name: "Astral", hex: "#356882" },
  22: { name: "Chathams Blue", hex: "#2A5368" },
  // Chapter 23 is missing in l_outline.json
  24: { name: "Teal", hex: "#008080" },
  25: { name: "Atoll", hex: "#338080" },
  26: { name: "Electric Blue", hex: "#99FFFF" },
  27: { name: "Baby Blue", hex: "#66FFFF" },
  28: { name: "Aqua", hex: "#33FFFF" },
  29: { name: "Magic Mint", hex: "#99FFCC" },
  30: { name: "Downy", hex: "#66CCCC" },
  31: { name: "Medium Turquoise", hex: "#33CCCC" },
  32: { name: "Robin's Egg Blue", hex: "#00CCCC" },
  33: { name: "Medium Spring Green", hex: "#33FF99" },
  34: { name: "Shamrock", hex: "#33CC99" },
  35: { name: "Shamrock Green", hex: "#009966" },
  36: { name: "Aqua", hex: "#00FFFF" },
  37: { name: "Persian Green", hex: "#009999" },
  // Chapter 38 is missing in l_outline.json
  39: { name: "Aqua", hex: "#00FFFF" },
  40: { name: "Viking", hex: "#42A7B0" }
};

// Convert hex to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 128, b: 128 }; // Default to teal
}

async function fixBook6Colors() {
  console.log('🚀 Starting Book 6 color fix...');
  
  try {
    // Get Book 6
    const book6 = await db.select().from(books).where(eq(books.bookNumber, 6)).limit(1);
    
    if (book6.length === 0) {
      console.log('❌ Book 6 not found in database');
      return;
    }

    console.log(`📚 Found Book 6: ${book6[0].title}`);

    // Load chapter data from Book_6_City_of_Shadows_Outline.json if it exists
    let book6OutlineData = null;
    try {
      book6OutlineData = JSON.parse(readFileSync(resolve(__dirname, '../lore/json/storyline/Book_6_City_of_Shadows_Outline.json'), 'utf-8'));
    } catch (error) {
      console.log('⚠️  Book_6_City_of_Shadows_Outline.json not found, using generic chapter titles');
    }
    
    // Update all chapters 1-40 with correct colors (where available)
    for (let chapterNum = 1; chapterNum <= 40; chapterNum++) {
      const colorData = book6Colors[chapterNum];
      
      if (!colorData) {
        console.log(`⚠️  No color mapping for Chapter ${chapterNum} (missing in l_outline.json), skipping...`);
        continue;
      }

      const rgb = hexToRgb(colorData.hex);
      
      // Find chapter data from Book_6_City_of_Shadows_Outline.json if available
      let chapterTitle = `Chapter ${chapterNum}`;
      let chapterSummary = '';
      
      if (book6OutlineData && book6OutlineData.structure) {
        for (const section of book6OutlineData.structure) {
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
          eq(chapters.bookId, book6[0].id),
          eq(chapters.chapterNumber, chapterNum)
        ));
      
      console.log(`   ✅ Updated Chapter ${chapterNum} with correct color and data`);
    }

    console.log('🎉 Book 6 color fix completed successfully!');
    console.log('📊 All Book 6 chapters now have their correct teal/cyan color progression from l_outline.json');
    console.log('ℹ️  Note: Chapters 13, 23, and 38 were missing from l_outline.json and were skipped');
    
  } catch (error) {
    console.error('💥 Error fixing Book 6 colors:', error);
  }
}

fixBook6Colors();