#!/usr/bin/env tsx

/**
 * Script to fix Book 2 chapter colors by applying the correct red/pink color scheme from l_outline.json
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Book 2 color mapping from l_outline.json (red/pink progression)
const book2Colors = {
  1: { name: "Cosmos", hex: "#FFCCCC" },
  2: { name: "Petite Orchid", hex: "#CC9999" },
  3: { name: "Petite Orchid", hex: "#CC9999" },
  4: { name: "Indian Red", hex: "#CC6666" },
  5: { name: "Mona Lisa", hex: "#FF9999" },
  6: { name: "Bittersweet", hex: "#FF6666" },
  7: { name: "Persian Red", hex: "#CC3333" },
  8: { name: "Crimson", hex: "#CC0033" },
  9: { name: "Free Speech Red", hex: "#CC0000" },
  10: { name: "Carmine", hex: "#990033" },
  11: { name: "Vermillion", hex: "#FF4D00" },
  12: { name: "Maroon", hex: "#660000" },
  13: { name: "Mandy", hex: "#CC4F51" },
  14: { name: "Sundown", hex: "#FFACAC" },
  15: { name: "Mona Lisa", hex: "#FF9797" },
  16: { name: "Salmon", hex: "#FF7D7D" },
  17: { name: "Bittersweet", hex: "#FF5C5C" },
  18: { name: "Cinnabar", hex: "#FF3333" },
  19: { name: "Persian Red", hex: "#CC2929" },
  20: { name: "Brown", hex: "#A32121" },
  21: { name: "Falu Red", hex: "#821A1A" },
  22: { name: "Red Oxide", hex: "#681515" },
  23: { name: "Valencia", hex: "#CD514F" },
  24: { name: "Vermillion", hex: "#FF4D00" },
  25: { name: "Hippie Pink", hex: "#AA4D4F" },
  26: { name: "Carnation Pink", hex: "#FF99CC" },
  27: { name: "Wild Strawberry", hex: "#FF3399" },
  28: { name: "Hopbush", hex: "#CC6699" },
  29: { name: "Deep Cerise", hex: "#CC3399" },
  30: { name: "Radical Red", hex: "#FF3366" },
  31: { name: "Brilliant Rose", hex: "#FF6699" },
  32: { name: "Lipstick", hex: "#993366" },
  33: { name: "Ruby", hex: "#CC0066" },
  34: { name: "Cerise", hex: "#CC3366" },
  35: { name: "Tyrian Purple", hex: "#660033" },
  36: { name: "Red", hex: "#FF0000" },
  37: { name: "Radical Red", hex: "#990066" },
  38: { name: "Cerise", hex: "#D03373" },
  39: { name: "Red", hex: "#FF0000" },
  40: { name: "Old Rose", hex: "#BB3D4E" }
};

// Convert hex to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 204, b: 204 }; // Default to cosmos pink
}

async function fixBook2Colors() {
  console.log('🚀 Starting Book 2 color fix...');
  
  try {
    // Get Book 2
    const book2 = await db.select().from(books).where(eq(books.bookNumber, 2)).limit(1);
    
    if (book2.length === 0) {
      console.log('❌ Book 2 not found in database');
      return;
    }

    console.log(`📚 Found Book 2: ${book2[0].title}`);

    // Load chapter data from Book_2_Temporal_Express_Outline.json
    const book2OutlineData = JSON.parse(readFileSync(resolve(__dirname, '../lore/json/storyline/Book_2_Temporal_Express_Outline.json'), 'utf-8'));
    
    // Update all chapters 1-40 with correct colors
    for (let chapterNum = 1; chapterNum <= 40; chapterNum++) {
      const colorData = book2Colors[chapterNum];
      
      if (!colorData) {
        console.log(`⚠️  No color mapping for Chapter ${chapterNum}, skipping...`);
        continue;
      }

      const rgb = hexToRgb(colorData.hex);
      
      // Find chapter data from Book_2_Temporal_Express_Outline.json
      let chapterTitle = `Chapter ${chapterNum}`;
      let chapterSummary = '';
      
      for (const section of book2OutlineData.structure) {
        for (const chapter of section.chapters) {
          if (chapter.chapter === chapterNum) {
            chapterTitle = chapter.title;
            chapterSummary = chapter.summary;
            break;
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
          eq(chapters.bookId, book2[0].id),
          eq(chapters.chapterNumber, chapterNum)
        ));
      
      console.log(`   ✅ Updated Chapter ${chapterNum} with correct color and data`);
    }

    console.log('🎉 Book 2 color fix completed successfully!');
    console.log('📊 All Book 2 chapters now have their correct red/pink color progression from l_outline.json');
    
  } catch (error) {
    console.error('💥 Error fixing Book 2 colors:', error);
  }
}

fixBook2Colors();