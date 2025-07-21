import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { promises as fs } from 'fs';
import path from 'path';
import * as schema from '../src/lib/schema.ts';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const LORE_PATH = path.join(process.cwd(), 'lore');

async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

async function extractExactChapterColors() {
  console.log('🎨 Extracting exact chapter colors from outline...');
  const outlineData = await loadJSON(path.join(LORE_PATH, 'l_outline.json'));
  
  const chapterColorMap = new Map(); // chapterNumber -> color data
  
  // Navigate through the outline structure
  const seriesData = outlineData.SelfImprovementSeries;
  if (!seriesData || !seriesData.Books) {
    throw new Error('No books data found in outline');
  }
  
  // Function to recursively search for chapters in any structure
  function searchForChapters(obj, path = '') {
    if (typeof obj !== 'object' || obj === null) return;
    
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'chapter' && typeof value === 'string') {
        // Found a chapter field - check if parent object has color data
        const parent = obj;
        const chapterMatch = value.match(/Chapter (\d+)/);
        
        if (chapterMatch && parent.color_name && parent.hex_code) {
          const chapterNum = parseInt(chapterMatch[1]);
          const rgb = hexToRgb(parent.hex_code);
          
          const colorData = {
            colorName: parent.color_name,
            hexCode: parent.hex_code,
            red: rgb?.r || parent.red || 128,
            green: rgb?.g || parent.green || 128,
            blue: rgb?.b || parent.blue || 128
          };
          
          // Only add if we don't already have this chapter or if this data looks more complete
          if (!chapterColorMap.has(chapterNum) || 
              (chapterColorMap.get(chapterNum).colorName === 'Default' && parent.color_name !== 'Default')) {
            chapterColorMap.set(chapterNum, colorData);
            console.log(`  Chapter ${chapterNum}: ${parent.color_name} (${parent.hex_code}) at ${path}.${key}`);
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        // Recursively search nested objects
        searchForChapters(value, path ? `${path}.${key}` : key);
      }
    }
  }
  
  // Start the recursive search
  searchForChapters(seriesData, 'SelfImprovementSeries');
  
  console.log(`\n🎨 Found exact color data for ${chapterColorMap.size} chapters`);
  
  // Sort and display the found chapters
  const sortedChapters = Array.from(chapterColorMap.entries()).sort((a, b) => a[0] - b[0]);
  console.log('\n📋 Chapter color summary:');
  sortedChapters.forEach(([chapterNum, colorData]) => {
    console.log(`  Chapter ${chapterNum}: ${colorData.colorName} (${colorData.hexCode})`);
  });
  
  return chapterColorMap;
}

async function updateChaptersWithExactColors(chapterColorMap) {
  // Create database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema });

  try {
    console.log('\n🔄 Connecting to database...');
    
    // Get all chapters
    const allChapters = await db.select().from(schema.chapters);
    console.log(`📚 Found ${allChapters.length} chapters in database`);
    
    let updatedCount = 0;
    const unmatchedChapters = [];
    
    for (const chapter of allChapters) {
      const colorData = chapterColorMap.get(chapter.chapterNumber);
      
      if (colorData) {
        // Update chapter with exact colors from outline
        await db
          .update(schema.chapters)
          .set({
            colorName: colorData.colorName,
            hexCode: colorData.hexCode,
            red: colorData.red,
            green: colorData.green,
            blue: colorData.blue
          })
          .where(eq(schema.chapters.id, chapter.id));
        
        updatedCount++;
        
        if (updatedCount <= 20) {
          console.log(`  ✅ Updated Chapter ${chapter.chapterNumber} (Book ${await getBookNumber(db, chapter.bookId)}): ${colorData.colorName} (${colorData.hexCode})`);
        }
      } else {
        unmatchedChapters.push(chapter.chapterNumber);
      }
    }
    
    if (updatedCount > 20) {
      console.log(`  ✅ Updated ${updatedCount} chapters with exact outline colors`);
    }
    
    if (unmatchedChapters.length > 0) {
      console.log(`\n⚠️  Chapters without color data in outline: ${unmatchedChapters.slice(0, 10).join(', ')}${unmatchedChapters.length > 10 ? ` and ${unmatchedChapters.length - 10} more` : ''}`);
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} chapters with exact colors!`);
    console.log(`📊 ${unmatchedChapters.length} chapters kept their existing colors (no outline data found)`);
    
  } catch (error) {
    console.error('❌ Error updating chapter colors:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function getBookNumber(db, bookId) {
  const book = await db.select({ bookNumber: schema.books.bookNumber })
    .from(schema.books)
    .where(eq(schema.books.id, bookId))
    .limit(1);
  return book[0]?.bookNumber || '?';
}

async function main() {
  try {
    console.log('🚀 Starting to extract exact chapter colors from outline...\n');
    
    // Extract exact colors from outline
    const chapterColorMap = await extractExactChapterColors();
    
    if (chapterColorMap.size === 0) {
      console.log('⚠️  No chapter color data found in outline');
      return;
    }
    
    // Update database with exact colors
    await updateChaptersWithExactColors(chapterColorMap);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();