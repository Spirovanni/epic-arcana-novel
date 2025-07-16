#!/usr/bin/env tsx

/**
 * Script to fix Book 4 chapter colors by applying the correct purple/blue color scheme from l_outline.json
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Book 4 color mapping from l_outline.json (purple/blue progression)
const book4Colors = {
  1: { name: "Heliotrope", hex: "#CC66FF" },
  2: { name: "Electric Purple", hex: "#CC33FF" },
  3: { name: "Dark Orchid", hex: "#9933CC" },
  4: { name: "Dark Violet", hex: "#9900CC" },
  5: { name: "Light Slate Blue", hex: "#9966FF" },
  6: { name: "Dark Slate Blue", hex: "#333399" },
  7: { name: "Persian Indigo", hex: "#330099" },
  8: { name: "Electric Indigo", hex: "#6600FF" },
  9: { name: "Han Purple", hex: "#3300FF" },
  10: { name: "Medium Blue", hex: "#3300CC" },
  11: { name: "Purple", hex: "#660066" },
  12: { name: "Han Purple", hex: "#6633FF" },
  13: { name: "Purple Heart", hex: "#7322D5" },
  14: { name: "Lilac", hex: "#C197C1" },
  15: { name: "London Hue", hex: "#B17DB1" },
  16: { name: "Violet Blue", hex: "#9D5C9D" },
  17: { name: "Vivid Violet", hex: "#853385" },
  18: { name: "Purple", hex: "#800080" },
  19: { name: "Tyrian Purple", hex: "#520052" },
  20: { name: "Mardi Gras", hex: "#420042" },
  21: { name: "Mardi Gras", hex: "#350035" },
  22: { name: "Mardi Gras", hex: "#2A002A" },
  23: { name: "Séance", hex: "#732F73" },
  24: { name: "Purple", hex: "#800080" },
  25: { name: "Black", hex: "#000000" },
  26: { name: "Lavender Blue", hex: "#CCCCFF" },
  27: { name: "Portage", hex: "#9999FF" },
  28: { name: "Mauve", hex: "#CC99FF" },
  29: { name: "Blue Bell", hex: "#9999CC" },
  30: { name: "Neon Blue", hex: "#3333FF" },
  31: { name: "Medium Slate Blue", hex: "#6666FF" },
  32: { name: "Royal Blue", hex: "#3366FF" },
  33: { name: "Blue", hex: "#0033FF" },
  34: { name: "Persian Blue", hex: "#0033CC" },
  35: { name: "Royal Purple", hex: "#663399" },
  36: { name: "Purple Heart", hex: "#6600CC" },
  37: { name: "Persian Indigo", hex: "#330066" },
  38: { name: "Persian Indigo", hex: "#330066" },
  39: { name: "Purple Heart", hex: "#6600CC" },
  40: { name: "Persian Indigo", hex: "#330066" }
};

// Convert hex to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 128, g: 0, b: 128 }; // Default to purple
}

async function fixBook4Colors() {
  console.log('🚀 Starting Book 4 color fix...');
  
  try {
    // Get Book 4
    const book4 = await db.select().from(books).where(eq(books.bookNumber, 4)).limit(1);
    
    if (book4.length === 0) {
      console.log('❌ Book 4 not found in database');
      return;
    }

    console.log(`📚 Found Book 4: ${book4[0].title}`);

    // Load chapter data from Book_4_Tome_of_Fates_Outline.json if it exists
    let book4OutlineData = null;
    try {
      book4OutlineData = JSON.parse(readFileSync(resolve(__dirname, '../lore/json/storyline/Book_4_Tome_of_Fates_Outline.json'), 'utf-8'));
    } catch (error) {
      console.log('⚠️  Book_4_Tome_of_Fates_Outline.json not found, using generic chapter titles');
    }
    
    // Update all chapters 1-40 with correct colors
    for (let chapterNum = 1; chapterNum <= 40; chapterNum++) {
      const colorData = book4Colors[chapterNum];
      
      if (!colorData) {
        console.log(`⚠️  No color mapping for Chapter ${chapterNum}, skipping...`);
        continue;
      }

      const rgb = hexToRgb(colorData.hex);
      
      // Find chapter data from Book_4_Tome_of_Fates_Outline.json if available
      let chapterTitle = `Chapter ${chapterNum}`;
      let chapterSummary = '';
      
      if (book4OutlineData && book4OutlineData.structure) {
        for (const section of book4OutlineData.structure) {
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
          eq(chapters.bookId, book4[0].id),
          eq(chapters.chapterNumber, chapterNum)
        ));
      
      console.log(`   ✅ Updated Chapter ${chapterNum} with correct color and data`);
    }

    console.log('🎉 Book 4 color fix completed successfully!');
    console.log('📊 All Book 4 chapters now have their correct purple/blue color progression from l_outline.json');
    
  } catch (error) {
    console.error('💥 Error fixing Book 4 colors:', error);
  }
}

fixBook4Colors();