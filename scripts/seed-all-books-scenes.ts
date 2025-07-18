import fs from 'fs';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chapters, scenes, books, novelSeries } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/epic_arcana';
const sql = postgres(connectionString);
const db = drizzle(sql);

interface Scene {
  scene_number: number;
  title: string;
  setup: string;
  symbolism: string;
  beat_goal: string;
}

interface ChapterData {
  chapter: string;
  pov: string;
  tense: string;
  core_emotion: string;
  scene_tone: string;
  scenes: Scene[];
}

interface BookData {
  [chapterNumber: number]: ChapterData;
}

interface AllBooksData {
  [bookNumber: number]: BookData;
}

async function findSeriesId(): Promise<string> {
  const series = await db
    .select()
    .from(novelSeries)
    .where(eq(novelSeries.title, 'Epic Arcana'))
    .limit(1);
  
  if (series.length === 0) {
    throw new Error('Epic Arcana series not found');
  }
  
  return series[0].id;
}

async function findBookId(seriesId: string, bookNumber: number): Promise<string | null> {
  const book = await db
    .select()
    .from(books)
    .where(and(
      eq(books.seriesId, seriesId),
      eq(books.bookNumber, bookNumber)
    ))
    .limit(1);
  
  return book.length > 0 ? book[0].id : null;
}

async function findChapterByNumber(bookId: string, chapterNumber: number): Promise<string | null> {
  const chapter = await db
    .select()
    .from(chapters)
    .where(and(
      eq(chapters.bookId, bookId),
      eq(chapters.chapterNumber, chapterNumber)
    ))
    .limit(1);
  
  return chapter.length > 0 ? chapter[0].id : null;
}

async function extractAllBooksData(): Promise<AllBooksData> {
  const outlinePath = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/l_outline.json';
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));
  
  const allBooksData: AllBooksData = {};
  
  // Initialize all 9 books
  for (let i = 1; i <= 9; i++) {
    allBooksData[i] = {};
  }
  
  function extractChapterData(obj: any): void {
    if (typeof obj !== 'object' || obj === null) return;
    
    // Check if current object has the structure we need for any STG
    if (obj.unique_identifier && 
        typeof obj.unique_identifier === 'string' && 
        obj.unique_identifier.includes('STG ') && 
        obj.chapter && 
        obj.chapter.startsWith('Chapter ') &&
        obj.scenes) {
      
      // Extract book number from STG identifier (e.g., "STG 1." = Book 1, "STG 2." = Book 2)
      const stgMatch = obj.unique_identifier.match(/STG (\d+)\./);
      const chapterNumberMatch = obj.chapter.match(/Chapter (\d+)/);
      
      if (stgMatch && chapterNumberMatch) {
        const bookNumber = parseInt(stgMatch[1]);
        const chapterNumber = parseInt(chapterNumberMatch[1]);
        
        // Only process books 1-9
        if (bookNumber >= 1 && bookNumber <= 9) {
          allBooksData[bookNumber][chapterNumber] = {
            chapter: obj.chapter,
            pov: obj.pov || '3rd Person Limited',
            tense: obj.tense || 'Past Tense',
            core_emotion: obj.core_emotion || 'Tension and conflict',
            scene_tone: obj.scene_tone || 'Dramatic and intense',
            scenes: obj.scenes
          };
          
          console.log(`✓ Extracted Book ${bookNumber}, ${obj.chapter}: ${obj.scenes.length} scenes`);
        }
      }
    }
    
    // Recursively search all nested objects
    for (const key in obj) {
      extractChapterData(obj[key]);
    }
  }
  
  extractChapterData(outlineData);
  
  return allBooksData;
}

async function seedScenesForChapter(
  bookId: string, 
  chapterId: string, 
  bookNumber: number,
  chapterNumber: number, 
  chapterData: ChapterData
): Promise<void> {
  console.log(`Seeding scenes for Book ${bookNumber}, Chapter ${chapterNumber}...`);
  
  // Update chapter with metadata using raw SQL
  await sql`
    UPDATE chapters 
    SET pov = ${chapterData.pov}, 
        tense = ${chapterData.tense}, 
        core_emotion = ${chapterData.core_emotion}, 
        scene_tone = ${chapterData.scene_tone}
    WHERE id = ${chapterId}
  `;
  
  // Delete existing scenes for this chapter using raw SQL
  await sql`DELETE FROM scenes WHERE chapter_id = ${chapterId}`;
  
  // Insert new scenes using raw SQL, including beat_goal field
  for (const scene of chapterData.scenes) {
    await sql`
      INSERT INTO scenes (chapter_id, scene_number, title, setup, symbolism, beat_goal)
      VALUES (
        ${chapterId}, 
        ${scene.scene_number}, 
        ${scene.title || 'Untitled Scene'}, 
        ${scene.setup || ''}, 
        ${scene.symbolism || ''}, 
        ${scene.beat_goal || ''}
      )
    `;
  }
  
  console.log(`  ✓ Updated chapter metadata and inserted ${chapterData.scenes.length} scenes`);
}

async function main() {
  try {
    console.log('🚀 Starting comprehensive scenes seeding process for ALL Epic Arcana books...');
    
    // Find Epic Arcana series
    const seriesId = await findSeriesId();
    console.log(`✓ Found Epic Arcana series ID: ${seriesId}`);
    
    // Extract scenes data from l_outline.json for all books
    console.log('📖 Extracting scenes data from l_outline.json...');
    const allBooksData = await extractAllBooksData();
    
    let totalChapters = 0;
    let totalScenes = 0;
    
    // Count total chapters and scenes
    for (let bookNum = 1; bookNum <= 9; bookNum++) {
      const bookChapters = Object.keys(allBooksData[bookNum]).length;
      totalChapters += bookChapters;
      
      for (const chapterData of Object.values(allBooksData[bookNum])) {
        totalScenes += chapterData.scenes.length;
      }
    }
    
    console.log(`✓ Extracted data for ${totalChapters} chapters across 9 books with ${totalScenes} total scenes`);
    
    if (totalChapters === 0) {
      console.log('⚠ No chapters with scenes data found');
      return;
    }
    
    let processedBooks = 0;
    let processedChapters = 0;
    let processedScenes = 0;
    let skippedBooks = 0;
    let skippedChapters = 0;
    
    // Process each book
    for (let bookNumber = 1; bookNumber <= 9; bookNumber++) {
      const bookData = allBooksData[bookNumber];
      const bookChapterCount = Object.keys(bookData).length;
      
      if (bookChapterCount === 0) {
        console.log(`⚠ No chapters found for Book ${bookNumber}, skipping`);
        skippedBooks++;
        continue;
      }
      
      console.log(`\n📚 Processing Book ${bookNumber} (${bookChapterCount} chapters)...`);
      
      // Find book in database
      const bookId = await findBookId(seriesId, bookNumber);
      if (!bookId) {
        console.log(`⚠ Book ${bookNumber} not found in database, skipping`);
        skippedBooks++;
        continue;
      }
      
      processedBooks++;
      
      // Process each chapter in this book
      for (const [chapterNumber, chapterData] of Object.entries(bookData)) {
        const chapterNum = parseInt(chapterNumber);
        const chapterId = await findChapterByNumber(bookId, chapterNum);
        
        if (chapterId) {
          await seedScenesForChapter(bookId, chapterId, bookNumber, chapterNum, chapterData);
          processedChapters++;
          processedScenes += chapterData.scenes.length;
        } else {
          console.log(`⚠ Book ${bookNumber}, Chapter ${chapterNum} not found in database, skipping`);
          skippedChapters++;
        }
      }
    }
    
    console.log(`\n✅ Comprehensive scenes seeding complete!`);
    console.log(`📊 Summary:`);
    console.log(`   📚 Books processed: ${processedBooks}/9`);
    console.log(`   📄 Chapters processed: ${processedChapters}`);
    console.log(`   🎬 Scenes processed: ${processedScenes}`);
    console.log(`   ⚠ Books skipped: ${skippedBooks}`);
    console.log(`   ⚠ Chapters skipped: ${skippedChapters}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run the seeding script
main();