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

async function extractExactChapterTitles() {
  console.log('📚 Extracting exact chapter titles from outline...');
  const outlineData = await loadJSON(path.join(LORE_PATH, 'l_outline.json'));
  
  const chapterTitleMap = new Map(); // chapterNumber -> title
  
  // Navigate through the outline structure
  const seriesData = outlineData.SelfImprovementSeries;
  if (!seriesData || !seriesData.Books) {
    throw new Error('No books data found in outline');
  }
  
  // Function to recursively search for chapters and their titles
  function searchForChapterTitles(obj, path = '') {
    if (typeof obj !== 'object' || obj === null) return;
    
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'chapter' && typeof value === 'string') {
        // Found a chapter field - check if parent object has title data
        const parent = obj;
        const chapterMatch = value.match(/Chapter (\d+)/);
        
        if (chapterMatch && parent.title) {
          const chapterNum = parseInt(chapterMatch[1]);
          
          // Only add if we don't already have this chapter or if this title looks more complete
          if (!chapterTitleMap.has(chapterNum) || 
              (chapterTitleMap.get(chapterNum).startsWith('Chapter ') && !parent.title.startsWith('Chapter '))) {
            chapterTitleMap.set(chapterNum, parent.title);
            console.log(`  Chapter ${chapterNum}: "${parent.title}" at ${path}.${key}`);
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        // Recursively search nested objects
        searchForChapterTitles(value, path ? `${path}.${key}` : key);
      }
    }
  }
  
  // Start the recursive search
  searchForChapterTitles(seriesData, 'SelfImprovementSeries');
  
  console.log(`\n📚 Found exact titles for ${chapterTitleMap.size} chapters`);
  
  // Sort and display the found chapter titles
  const sortedChapters = Array.from(chapterTitleMap.entries()).sort((a, b) => a[0] - b[0]);
  console.log('\n📋 Chapter titles summary:');
  sortedChapters.forEach(([chapterNum, title]) => {
    console.log(`  Chapter ${chapterNum}: "${title}"`);
  });
  
  return chapterTitleMap;
}

async function updateChaptersWithExactTitles(chapterTitleMap) {
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
      const exactTitle = chapterTitleMap.get(chapter.chapterNumber);
      
      if (exactTitle) {
        // Update chapter with exact title from outline
        await db
          .update(schema.chapters)
          .set({
            title: exactTitle
          })
          .where(eq(schema.chapters.id, chapter.id));
        
        updatedCount++;
        
        if (updatedCount <= 20) {
          const bookNum = await getBookNumber(db, chapter.bookId);
          console.log(`  ✅ Updated Chapter ${chapter.chapterNumber} (Book ${bookNum}): "${exactTitle}"`);
        }
      } else {
        unmatchedChapters.push(chapter.chapterNumber);
      }
    }
    
    if (updatedCount > 20) {
      console.log(`  ✅ Updated ${updatedCount} chapters with exact titles from outline`);
    }
    
    if (unmatchedChapters.length > 0) {
      console.log(`\n⚠️  Chapters without title data in outline: ${unmatchedChapters.slice(0, 10).join(', ')}${unmatchedChapters.length > 10 ? ` and ${unmatchedChapters.length - 10} more` : ''}`);
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} chapters with exact titles!`);
    console.log(`📊 ${unmatchedChapters.length} chapters kept their existing titles (no outline data found)`);
    
  } catch (error) {
    console.error('❌ Error updating chapter titles:', error);
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
    console.log('🚀 Starting to extract exact chapter titles from outline...\n');
    
    // Extract exact titles from outline
    const chapterTitleMap = await extractExactChapterTitles();
    
    if (chapterTitleMap.size === 0) {
      console.log('⚠️  No chapter title data found in outline');
      return;
    }
    
    // Update database with exact titles
    await updateChaptersWithExactTitles(chapterTitleMap);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();