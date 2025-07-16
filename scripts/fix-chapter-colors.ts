#!/usr/bin/env tsx

/**
 * Script to fix chapter colors by preserving original l_outline.json colors
 * and updating chapter data from Book_1_Only_Outline.json
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Color mapping from the original l_outline.json
const originalColors = {
  1: { name: "Orange Peel", hex: "#FF9900" },
  2: { name: "Neon Carrot", hex: "#FF9933" },
  3: { name: "Outrageous Orange", hex: "#FF6633" },
  4: { name: "Grandis", hex: "#EECC55" },
  5: { name: "Peach-Orange", hex: "#FFCC99" },
  6: { name: "La Rioja", hex: "#CCCC00" },
  7: { name: "Sunglow", hex: "#FFCC33" },
  8: { name: "Atomic Tangerine", hex: "#FF9966" },
  9: { name: "Fallow", hex: "#CC9966" },
  10: { name: "Scarlet", hex: "#FF3300" },
  11: { name: "Safety Orange", hex: "#FF6600" },
  12: { name: "Harley Davidson Orange", hex: "#CC3300" },
  13: { name: "Black", hex: "#000000" },
  14: { name: "Caramel", hex: "#FFDA97" },
  15: { name: "Salomie", hex: "#FFD17D" },
  16: { name: "Golden Tainoi", hex: "#FFC55C" },
  17: { name: "Supernova", hex: "#FFB733" },
  18: { name: "Orange", hex: "#FFA500" },
  19: { name: "Dark Goldenrod", hex: "#CC8400" },
  20: { name: "Golden Brown", hex: "#A36A00" },
  21: { name: "Raw Umber", hex: "#825500" },
  22: { name: "Raw Umber", hex: "#684400" },
  23: { name: "Black", hex: "#000000" },
  24: { name: "Orange", hex: "#FFA500" },
  25: { name: "Black", hex: "#000000" },
  26: { name: "Gamboge", hex: "#CC9900" },
  27: { name: "Fuel Yellow", hex: "#CC9933" },
  28: { name: "Tenne (Tawny)", hex: "#CC6600" },
  29: { name: "Mai Tai", hex: "#996633" },
  30: { name: "Golden Brown", hex: "#996600" },
  31: { name: "Saddle Brown", hex: "#993300" },
  32: { name: "Milano Red", hex: "#993333" },
  33: { name: "Baker's Chocolate", hex: "#663300" },
  34: { name: "Seal Brown", hex: "#330000" },
  35: { name: "Dark Red", hex: "#990000" },
  36: { name: "Ecstasy", hex: "#CC6633" },
  37: { name: "Persian Plum", hex: "#663333" },
  38: { name: "Black", hex: "#000000" },
  39: { name: "Ecstasy", hex: "#CC6633" },
  40: { name: "Black", hex: "#000000" }
};

// Convert hex to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 165, b: 0 }; // Default to orange
}

async function fixChapterColors() {
  console.log('🚀 Starting chapter color fix...');
  
  try {
    // Get Book 1
    const book1 = await db.select().from(books).where(eq(books.bookNumber, 1)).limit(1);
    
    if (book1.length === 0) {
      console.log('❌ Book 1 not found in database');
      return;
    }

    console.log(`📚 Found Book 1: ${book1[0].title}`);

    // Load chapter data from Book_1_Only_Outline.json
    const book1OutlineData = JSON.parse(readFileSync(resolve(__dirname, '../lore/json/storyline/Book_1_Only_Outline.json'), 'utf-8'));
    
    // Process chapters 8-40 to update with correct colors and story data
    for (const section of book1OutlineData.structure) {
      for (const chapter of section.chapters) {
        if (chapter.chapter >= 8 && chapter.chapter <= 40) {
          const chapterNum = chapter.chapter;
          const originalColor = originalColors[chapterNum];
          
          if (!originalColor) {
            console.log(`⚠️  No color mapping for Chapter ${chapterNum}, skipping...`);
            continue;
          }

          const rgb = hexToRgb(originalColor.hex);
          
          console.log(`🔄 Updating Chapter ${chapterNum}: ${chapter.title} with color ${originalColor.name} (${originalColor.hex})`);
          
          // Find existing chapters with this chapter number
          const existingChapters = await db.select()
            .from(chapters)
            .where(and(
              eq(chapters.bookId, book1[0].id),
              eq(chapters.chapterNumber, chapterNum)
            ));

          // Delete duplicates and keep the one that matches the original color scheme
          if (existingChapters.length > 1) {
            console.log(`   🧹 Found ${existingChapters.length} duplicates for Chapter ${chapterNum}, cleaning up...`);
            
            // Find the chapter with the correct color or the first one
            const keepChapter = existingChapters.find(ch => ch.hexCode === originalColor.hex) || existingChapters[0];
            
            // Delete the others
            for (const chap of existingChapters) {
              if (chap.id !== keepChapter.id) {
                await db.delete(chapters).where(eq(chapters.id, chap.id));
                console.log(`   🗑️  Deleted duplicate chapter ${chap.id}`);
              }
            }
          }

          // Update the remaining chapter with correct data
          const updateData = {
            title: chapter.title,
            colorName: originalColor.name,
            hexCode: originalColor.hex,
            red: rgb.r,
            green: rgb.g,
            blue: rgb.b,
            specificTaskGroupDescription: chapter.summary,
            updatedAt: new Date()
          };

          await db.update(chapters)
            .set(updateData)
            .where(and(
              eq(chapters.bookId, book1[0].id),
              eq(chapters.chapterNumber, chapterNum)
            ));
          
          console.log(`   ✅ Updated Chapter ${chapterNum} with correct color and data`);
        }
      }
    }

    console.log('🎉 Chapter color fix completed successfully!');
    console.log('📊 All chapters now have their correct colors from the original l_outline.json');
    
  } catch (error) {
    console.error('💥 Error fixing chapter colors:', error);
  }
}

fixChapterColors();