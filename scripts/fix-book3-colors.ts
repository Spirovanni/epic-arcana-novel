#!/usr/bin/env tsx

/**
 * Script to fix Book 3 chapter colors by applying the correct magenta/purple color scheme from l_outline.json
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Book 3 color mapping from l_outline.json (magenta/purple progression)
const book3Colors = {
  1: { name: "Neon Pink", hex: "#FF66CC" },
  2: { name: "Razzle Dazzle Rose", hex: "#FF33CC" },
  3: { name: "Hot Magenta", hex: "#FF00CC" },
  4: { name: "Hollywood Cerise", hex: "#FF0099" },
  5: { name: "Fuchsia", hex: "#CC33CC" },
  6: { name: "Razzmatazz", hex: "#FF0066" },
  7: { name: "Torch Red", hex: "#FF0033" },
  8: { name: "Dark Magenta", hex: "#990099" },
  9: { name: "Séance", hex: "#663366" },
  10: { name: "Mardi Gras", hex: "#330033" },
  11: { name: "Magenta", hex: "#FF00FF" },
  12: { name: "Vivid Violet", hex: "#993399" },
  13: { name: "Medium Violet Red", hex: "#CC1A99" },
  14: { name: "Lavender Rose", hex: "#EA97D5" },
  15: { name: "Tea Rose", hex: "#E57DCA" },
  16: { name: "Free Speech Magenta", hex: "#DE5CBD" },
  17: { name: "Deep Cerise", hex: "#D633AD" },
  18: { name: "Medium Violet Red", hex: "#CC0099" },
  19: { name: "Eggplant", hex: "#A3007A" },
  20: { name: "Eggplant", hex: "#820062" },
  21: { name: "Tyrian Purple", hex: "#68004E" },
  22: { name: "Tyrian Purple", hex: "#53003E" },
  23: { name: "Medium Red Violet", hex: "#B02F8F" },
  24: { name: "Magenta", hex: "#FF00FF" },
  25: { name: "Violet Blue", hex: "#AA44AA" },
  26: { name: "Snuff", hex: "#FFCCFF" },
  27: { name: "Violet", hex: "#FF99FF" },
  28: { name: "Lilac", hex: "#CC99CC" },
  29: { name: "Pink Flamingo", hex: "#FF66FF" },
  30: { name: "Medium Violet Red", hex: "#CC0099" },
  31: { name: "Orchid", hex: "#CC66CC" },
  32: { name: "Violet Blue", hex: "#996699" },
  33: { name: "Electric Purple", hex: "#CC00FF" },
  34: { name: "Indigo", hex: "#660099" },
  35: { name: "Deep Magenta", hex: "#CC00CC" },
  36: { name: "Magenta", hex: "#FF00FF" },
  37: { name: "Electric Purple", hex: "#9900FF" },
  38: { name: "Dark Magenta", hex: "#8800AA" },
  39: { name: "Magenta", hex: "#FF00FF" },
  40: { name: "Medium Red Violet", hex: "#B328A0" }
};

// Convert hex to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 0, b: 255 }; // Default to magenta
}

async function fixBook3Colors() {
  console.log('🚀 Starting Book 3 color fix...');
  
  try {
    // Get Book 3
    const book3 = await db.select().from(books).where(eq(books.bookNumber, 3)).limit(1);
    
    if (book3.length === 0) {
      console.log('❌ Book 3 not found in database');
      return;
    }

    console.log(`📚 Found Book 3: ${book3[0].title}`);

    // Load chapter data from Book_3_Awake_Iron_Outline.json if it exists
    let book3OutlineData = null;
    try {
      book3OutlineData = JSON.parse(readFileSync(resolve(__dirname, '../lore/json/storyline/Book_3_Awake_Iron_Outline.json'), 'utf-8'));
    } catch (error) {
      console.log('⚠️  Book_3_Awake_Iron_Outline.json not found, using generic chapter titles');
    }
    
    // Update all chapters 1-40 with correct colors
    for (let chapterNum = 1; chapterNum <= 40; chapterNum++) {
      const colorData = book3Colors[chapterNum];
      
      if (!colorData) {
        console.log(`⚠️  No color mapping for Chapter ${chapterNum}, skipping...`);
        continue;
      }

      const rgb = hexToRgb(colorData.hex);
      
      // Find chapter data from Book_3_Awake_Iron_Outline.json if available
      let chapterTitle = `Chapter ${chapterNum}`;
      let chapterSummary = '';
      
      if (book3OutlineData && book3OutlineData.structure) {
        for (const section of book3OutlineData.structure) {
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
          eq(chapters.bookId, book3[0].id),
          eq(chapters.chapterNumber, chapterNum)
        ));
      
      console.log(`   ✅ Updated Chapter ${chapterNum} with correct color and data`);
    }

    console.log('🎉 Book 3 color fix completed successfully!');
    console.log('📊 All Book 3 chapters now have their correct magenta/purple color progression from l_outline.json');
    
  } catch (error) {
    console.error('💥 Error fixing Book 3 colors:', error);
  }
}

fixBook3Colors();