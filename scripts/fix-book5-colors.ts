#!/usr/bin/env tsx

/**
 * Script to fix Book 5 chapter colors by applying the correct violet/blue color scheme from l_outline.json
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Book 5 color mapping from l_outline.json (violet/blue progression)
const book5Colors = {
  1: { name: "Amethyst", hex: "#9966CC" },
  2: { name: "Scampi", hex: "#666699" },
  3: { name: "Slate Blue", hex: "#6666CC" },
  4: { name: "Navy Blue", hex: "#0066FF" },
  5: { name: "Medium Blue", hex: "#0000CC" },
  6: { name: "Persian Blue", hex: "#3333CC" },
  7: { name: "New Midnight Blue", hex: "#000099" },
  8: { name: "Purple Heart", hex: "#6633CC" },
  9: { name: "Navy", hex: "#000066" },
  10: { name: "Midnight Express", hex: "#000033" },
  11: { name: "Violet", hex: "#EE82EE" },
  12: { name: "Deep Koamaru", hex: "#333366" },
  13: { name: "Blue Gem", hex: "#433AAD" },
  14: { name: "Mauve", hex: "#D5ACFF" },
  15: { name: "Mauve", hex: "#CA97FF" },
  16: { name: "Heliotrope", hex: "#BD7DFF" },
  17: { name: "Medium Purple", hex: "#AD5CFF" },
  18: { name: "Blue Violet", hex: "#9933FF" },
  19: { name: "Purple Heart", hex: "#7A29CC" },
  20: { name: "Royal Purple", hex: "#6221A3" },
  21: { name: "Blue Diamond", hex: "#4E1A82" },
  22: { name: "Christalle", hex: "#3E1568" },
  23: { name: "Amethyst", hex: "#8F4FD0" },
  24: { name: "Violet", hex: "#EE82EE" },
  25: { name: "Deluge", hex: "#826FA4" },
  26: { name: "Electric Blue", hex: "#99FFFF" },
  27: { name: "Deep Sky Blue", hex: "#00CCFF" },
  28: { name: "Dodger Blue", hex: "#0099FF" },
  29: { name: "Picton Blue", hex: "#6699CC" },
  30: { name: "Cornflower Blue", hex: "#6699FF" },
  31: { name: "Dodger Blue", hex: "#3399FF" },
  32: { name: "Lochmara", hex: "#336699" },
  33: { name: "Navy Blue", hex: "#0066CC" },
  34: { name: "Royal Blue", hex: "#3366CC" },
  35: { name: "Prussian Blue", hex: "#003366" },
  36: { name: "Blue", hex: "#0000FF" },
  37: { name: "Smalt", hex: "#003399" },
  38: { name: "Dark Blue", hex: "#001188" },
  39: { name: "Blue", hex: "#0000FF" },
  40: { name: "Rich Blue", hex: "#494CB3" }
};

// Convert hex to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 127, g: 0, b: 255 }; // Default to violet
}

async function fixBook5Colors() {
  console.log('🚀 Starting Book 5 color fix...');
  
  try {
    // Get Book 5
    const book5 = await db.select().from(books).where(eq(books.bookNumber, 5)).limit(1);
    
    if (book5.length === 0) {
      console.log('❌ Book 5 not found in database');
      return;
    }

    console.log(`📚 Found Book 5: ${book5[0].title}`);

    // Load chapter data from Book_5_Holder_of_the_Life_Force_Outline.json if it exists
    let book5OutlineData = null;
    try {
      book5OutlineData = JSON.parse(readFileSync(resolve(__dirname, '../lore/json/storyline/Book_5_Holder_of_the_Life_Force_Outline.json'), 'utf-8'));
    } catch (error) {
      console.log('⚠️  Book_5_Holder_of_the_Life_Force_Outline.json not found, using generic chapter titles');
    }
    
    // Update all chapters 1-40 with correct colors
    for (let chapterNum = 1; chapterNum <= 40; chapterNum++) {
      const colorData = book5Colors[chapterNum];
      
      if (!colorData) {
        console.log(`⚠️  No color mapping for Chapter ${chapterNum}, skipping...`);
        continue;
      }

      const rgb = hexToRgb(colorData.hex);
      
      // Find chapter data from Book_5_Holder_of_the_Life_Force_Outline.json if available
      let chapterTitle = `Chapter ${chapterNum}`;
      let chapterSummary = '';
      
      if (book5OutlineData && book5OutlineData.structure) {
        for (const section of book5OutlineData.structure) {
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
          eq(chapters.bookId, book5[0].id),
          eq(chapters.chapterNumber, chapterNum)
        ));
      
      console.log(`   ✅ Updated Chapter ${chapterNum} with correct color and data`);
    }

    console.log('🎉 Book 5 color fix completed successfully!');
    console.log('📊 All Book 5 chapters now have their correct violet/blue color progression from l_outline.json');
    
  } catch (error) {
    console.error('💥 Error fixing Book 5 colors:', error);
  }
}

fixBook5Colors();