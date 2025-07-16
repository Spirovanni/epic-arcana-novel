#!/usr/bin/env tsx

/**
 * Script to fix Book 7 chapter colors by applying the correct green color scheme from l_outline.json
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Book 7 color mapping from l_outline.json (green progression)
const book7Colors = {
  1: { name: "Blue Romance", hex: "#CCFFCC" },
  2: { name: "Dark Sea Green", hex: "#99CC99" },
  3: { name: "Silver Tree", hex: "#66CC99" },
  4: { name: "Laurel", hex: "#669966" },
  5: { name: "Eucalyptus", hex: "#339966" },
  6: { name: "Forest Green", hex: "#339933" },
  7: { name: "Islamic Green", hex: "#009900" },
  8: { name: "San Felix", hex: "#336633" },
  9: { name: "Green", hex: "#006600" },
  10: { name: "Myrtle", hex: "#003300" },
  11: { name: "Green", hex: "#008000" },
  12: { name: "Fun Green", hex: "#006633" },
  13: { name: "Chateau Green", hex: "#2F8F4F" },
  14: { name: "Vista Blue", hex: "#97D5AC" },
  15: { name: "Padua", hex: "#7DCA97" },
  16: { name: "Emerald", hex: "#5CBD7D" },
  17: { name: "Chateau Green", hex: "#33AD5C" },
  18: { name: "Pigment Green", hex: "#009933" },
  19: { name: "Camarone", hex: "#007A29" },
  20: { name: "Crusoe", hex: "#006221" },
  21: { name: "British Racing Green", hex: "#004E1A" },
  22: { name: "British Racing Green", hex: "#003E15" },
  23: { name: "Sea Green", hex: "#2F8F4F" },
  24: { name: "Green", hex: "#008000" },
  25: { name: "Forest Green", hex: "#118022" },
  26: { name: "Screamin' Green", hex: "#33FF66" },
  27: { name: "Free Speech Green", hex: "#00FF33" },
  28: { name: "Spring Green", hex: "#00FF66" },
  29: { name: "Light Green", hex: "#66FF99" },
  30: { name: "Aquamarine", hex: "#66FFCC" },
  31: { name: "Medium Spring Green", hex: "#00FF99" },
  32: { name: "Bright Turquoise", hex: "#00FFCC" },
  33: { name: "Turquoise", hex: "#33FFCC" },
  34: { name: "Caribbean Green", hex: "#00CC99" },
  35: { name: "Medium Sea Green", hex: "#33CC66" },
  36: { name: "Lime", hex: "#00FF00" },
  37: { name: "Malachite", hex: "#00CC66" },
  38: { name: "Spring Green", hex: "#1EF280" },
  39: { name: "Lime", hex: "#00FF00" },
  40: { name: "Eucalyptus", hex: "#26A452" }
};

// Convert hex to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 128, b: 0 }; // Default to green
}

async function fixBook7Colors() {
  console.log('🚀 Starting Book 7 color fix...');
  
  try {
    // Get Book 7
    const book7 = await db.select().from(books).where(eq(books.bookNumber, 7)).limit(1);
    
    if (book7.length === 0) {
      console.log('❌ Book 7 not found in database');
      return;
    }

    console.log(`📚 Found Book 7: ${book7[0].title}`);

    // Load chapter data from Book_7_Dark_Path_to_Victory_Outline.json if it exists
    let book7OutlineData = null;
    try {
      book7OutlineData = JSON.parse(readFileSync(resolve(__dirname, '../lore/json/storyline/Book_7_Dark_Path_to_Victory_Outline.json'), 'utf-8'));
    } catch (error) {
      console.log('⚠️  Book_7_Dark_Path_to_Victory_Outline.json not found, using generic chapter titles');
    }
    
    // Update all chapters 1-40 with correct colors
    for (let chapterNum = 1; chapterNum <= 40; chapterNum++) {
      const colorData = book7Colors[chapterNum];
      
      if (!colorData) {
        console.log(`⚠️  No color mapping for Chapter ${chapterNum}, skipping...`);
        continue;
      }

      const rgb = hexToRgb(colorData.hex);
      
      // Find chapter data from Book_7_Dark_Path_to_Victory_Outline.json if available
      let chapterTitle = `Chapter ${chapterNum}`;
      let chapterSummary = '';
      
      if (book7OutlineData && book7OutlineData.structure) {
        for (const section of book7OutlineData.structure) {
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
          eq(chapters.bookId, book7[0].id),
          eq(chapters.chapterNumber, chapterNum)
        ));
      
      console.log(`   ✅ Updated Chapter ${chapterNum} with correct color and data`);
    }

    console.log('🎉 Book 7 color fix completed successfully!');
    console.log('📊 All Book 7 chapters now have their correct green color progression from l_outline.json');
    
  } catch (error) {
    console.error('💥 Error fixing Book 7 colors:', error);
  }
}

fixBook7Colors();