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

async function findBook1Id(): Promise<string> {
  // Find the Epic Arcana series
  const series = await db
    .select()
    .from(novelSeries)
    .where(eq(novelSeries.title, 'Epic Arcana'))
    .limit(1);
  
  if (series.length === 0) {
    throw new Error('Epic Arcana series not found');
  }
  
  // Find Book 1
  const book1 = await db
    .select()
    .from(books)
    .where(and(
      eq(books.seriesId, series[0].id),
      eq(books.bookNumber, 1)
    ))
    .limit(1);
  
  if (book1.length === 0) {
    throw new Error('Book 1 not found');
  }
  
  return book1[0].id;
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

async function extractBook1ScenesData(): Promise<{ [chapterNumber: number]: ChapterData }> {
  const outlinePath = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/l_outline.json';
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));
  
  const book1Chapters: { [chapterNumber: number]: ChapterData } = {};
  
  function extractChapterData(obj: any): void {
    if (typeof obj !== 'object' || obj === null) return;
    
    // Debug logging - only for chapters with scenes
    if (obj.unique_identifier && obj.unique_identifier.includes('STG 1.') && obj.scenes) {
      console.log(`Found STG 1 chapter with scenes: ${obj.unique_identifier} - ${obj.chapter}`);
    }
    
    // Check if current object has the structure we need
    if (obj.unique_identifier && 
        typeof obj.unique_identifier === 'string' && 
        obj.unique_identifier.includes('STG 1.') && 
        obj.chapter && 
        obj.chapter.startsWith('Chapter ') &&
        obj.scenes) {
      
      const chapterNumberMatch = obj.chapter.match(/Chapter (\d+)/);
      if (chapterNumberMatch) {
        const chapterNumber = parseInt(chapterNumberMatch[1]);
        
        book1Chapters[chapterNumber] = {
          chapter: obj.chapter,
          pov: obj.pov || '3rd Person Limited',
          tense: obj.tense || 'Past Tense',
          core_emotion: obj.core_emotion || 'Tension and conflict',
          scene_tone: obj.scene_tone || 'Dramatic and intense',
          scenes: obj.scenes
        };
        
        console.log(`✓ Extracted data for ${obj.chapter}: ${obj.scenes.length} scenes`);
      }
    }
    
    // Recursively search all nested objects
    for (const key in obj) {
      extractChapterData(obj[key]);
    }
  }
  
  extractChapterData(outlineData);
  
  return book1Chapters;
}

async function seedScenesForChapter(
  bookId: string, 
  chapterId: string, 
  chapterNumber: number, 
  chapterData: ChapterData
): Promise<void> {
  console.log(`\\nSeeding scenes for Chapter ${chapterNumber}...`);
  
  // Update chapter with metadata using raw SQL
  await sql`
    UPDATE chapters 
    SET pov = ${chapterData.pov}, 
        tense = ${chapterData.tense}, 
        core_emotion = ${chapterData.core_emotion}, 
        scene_tone = ${chapterData.scene_tone}
    WHERE id = ${chapterId}
  `;
  
  console.log(`  ✓ Updated chapter metadata`);
  
  // Delete existing scenes for this chapter using raw SQL
  await sql`DELETE FROM scenes WHERE chapter_id = ${chapterId}`;
  console.log(`  ✓ Cleared existing scenes`);
  
  // Insert new scenes using raw SQL to avoid schema mismatch
  for (const scene of chapterData.scenes) {
    await sql`
      INSERT INTO scenes (chapter_id, scene_number, title, setup, symbolism)
      VALUES (${chapterId}, ${scene.scene_number}, ${scene.title || 'Untitled Scene'}, ${scene.setup || ''}, ${scene.symbolism || ''})
    `;
  }
  
  console.log(`  ✓ Inserted ${chapterData.scenes.length} scenes`);
}

async function main() {
  try {
    console.log('🚀 Starting Book 1 scenes seeding process...');
    
    // Find Book 1
    const book1Id = await findBook1Id();
    console.log(`✓ Found Book 1 ID: ${book1Id}`);
    
    // Extract scenes data from l_outline.json
    const book1ChaptersData = await extractBook1ScenesData();
    const chapterCount = Object.keys(book1ChaptersData).length;
    console.log(`✓ Extracted scenes data for ${chapterCount} chapters`);
    
    if (chapterCount === 0) {
      console.log('⚠ No Book 1 chapters with scenes data found');
      return;
    }
    
    let processedCount = 0;
    let skippedCount = 0;
    
    // Process each chapter
    for (const [chapterNumber, chapterData] of Object.entries(book1ChaptersData)) {
      const chapterNum = parseInt(chapterNumber);
      const chapterId = await findChapterByNumber(book1Id, chapterNum);
      
      if (chapterId) {
        await seedScenesForChapter(book1Id, chapterId, chapterNum, chapterData);
        processedCount++;
      } else {
        console.log(`⚠ Chapter ${chapterNum} not found in database, skipping`);
        skippedCount++;
      }
    }
    
    console.log(`\\n✅ Book 1 scenes seeding complete!`);
    console.log(`📊 Processed: ${processedCount} chapters`);
    console.log(`⚠ Skipped: ${skippedCount} chapters (not found in database)`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run the seeding script
main();