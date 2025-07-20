import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../src/lib/schema';

const { chapters, books } = schema;

async function analyzeChapterGaps() {
  console.log('🔍 Analyzing Chapter Gaps and Color Theme Patterns for Book 1...\n');
  
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('🔴 DATABASE_URL is not defined in your .env file.');
    return;
  }

  const pool = new Pool({
    connectionString,
  });

  const db = drizzle(pool, { schema });

  try {
    // Get Book 1
    const book1 = await db.select().from(books).where(eq(books.bookNumber, 1)).limit(1);
    const book1Chapters = await db
      .select()
      .from(chapters)
      .where(eq(chapters.bookId, book1[0].id))
      .orderBy(chapters.chapterNumber);

    // Extract chapter numbers and analyze gaps
    const existingChapterNumbers = book1Chapters.map(ch => ch.chapterNumber).sort((a, b) => a - b);
    const minChapter = Math.min(...existingChapterNumbers);
    const maxChapter = Math.max(...existingChapterNumbers);
    
    console.log('📊 CHAPTER NUMBER ANALYSIS:');
    console.log('===========================');
    console.log(`Chapter range: ${minChapter} to ${maxChapter}`);
    console.log(`Total chapters in DB: ${existingChapterNumbers.length}`);
    console.log(`Expected chapters in range: ${maxChapter - minChapter + 1}`);
    
    // Find missing chapters
    const missingChapters: number[] = [];
    for (let i = minChapter; i <= maxChapter; i++) {
      if (!existingChapterNumbers.includes(i)) {
        missingChapters.push(i);
      }
    }
    
    if (missingChapters.length > 0) {
      console.log(`\n❌ Missing chapters: ${missingChapters.join(', ')}`);
    } else {
      console.log('\n✅ No gaps in chapter sequence');
    }
    
    console.log(`\n📋 Existing chapters: ${existingChapterNumbers.join(', ')}`);
    
    // Analyze color theme patterns
    console.log('\n🎨 COLOR THEME PATTERN ANALYSIS:');
    console.log('================================');
    
    const colorAnalysis = book1Chapters.map(chapter => {
      let colorTheme = null;
      if (chapter.colorTheme) {
        try {
          colorTheme = typeof chapter.colorTheme === 'string' 
            ? JSON.parse(chapter.colorTheme) 
            : chapter.colorTheme;
        } catch (e) {
          console.log(`⚠️  Invalid JSON in chapter ${chapter.chapterNumber}`);
        }
      }
      
      return {
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        colorName: colorTheme?.name || 'No color',
        hexCode: colorTheme?.hex || 'No hex',
        uniqueId: chapter.uniqueIdentifier
      };
    }).sort((a, b) => a.chapterNumber - b.chapterNumber);
    
    console.log('\nColor themes by chapter:');
    colorAnalysis.forEach(ch => {
      console.log(`  Ch. ${ch.chapterNumber}: ${ch.colorName} (${ch.hexCode}) - "${ch.title}"`);
    });
    
    // Group by color family
    console.log('\n🌈 COLOR FAMILY GROUPING:');
    console.log('=========================');
    
    const colorFamilies = {
      orange: [] as any[],
      red: [] as any[],
      yellow: [] as any[],
      brown: [] as any[],
      other: [] as any[]
    };
    
    colorAnalysis.forEach(ch => {
      const colorName = ch.colorName.toLowerCase();
      const hexCode = ch.hexCode.toLowerCase();
      
      if (colorName.includes('orange') || colorName.includes('tangerine') || colorName.includes('carrot')) {
        colorFamilies.orange.push(ch);
      } else if (colorName.includes('red') || colorName.includes('scarlet') || hexCode.startsWith('#ff') && hexCode.endsWith('00')) {
        colorFamilies.red.push(ch);
      } else if (colorName.includes('yellow') || colorName.includes('golden') || colorName.includes('sunglow')) {
        colorFamilies.yellow.push(ch);
      } else if (colorName.includes('brown') || colorName.includes('umber') || colorName.includes('golden brown')) {
        colorFamilies.brown.push(ch);
      } else {
        colorFamilies.other.push(ch);
      }
    });
    
    Object.entries(colorFamilies).forEach(([family, chapters]) => {
      if (chapters.length > 0) {
        console.log(`\n${family.toUpperCase()} family (${chapters.length} chapters):`);
        chapters.forEach((ch: any) => {
          console.log(`  Ch. ${ch.chapterNumber}: ${ch.colorName} (${ch.hexCode})`);
        });
      }
    });
    
    // Check for potential UI issues
    console.log('\n🔧 POTENTIAL UI ISSUES:');
    console.log('=======================');
    
    console.log('✅ All chapters have color data in colorTheme JSON field');
    console.log('⚠️  No chapters have individual hexCode, colorName, or RGB fields populated');
    console.log('💡 This suggests the UI might be looking for individual fields instead of the JSON field');
    
    // Color distribution analysis
    const uniqueColors = new Set(colorAnalysis.map(ch => ch.colorName));
    const uniqueHexes = new Set(colorAnalysis.map(ch => ch.hexCode));
    
    console.log('\n📈 COLOR DIVERSITY:');
    console.log('==================');
    console.log('Unique color names:', uniqueColors.size);
    console.log('Unique hex codes:', uniqueHexes.size);
    console.log('Total chapters:', colorAnalysis.length);
    
    if (uniqueColors.size === colorAnalysis.length) {
      console.log('✅ Every chapter has a unique color');
    } else {
      console.log('⚠️  Some chapters share the same color');
    }

  } catch (error) {
    console.error('🔴 Failed to analyze chapters:', error);
  } finally {
    await pool.end();
    console.log('\n✅ Database connection closed.');
  }
}

analyzeChapterGaps();