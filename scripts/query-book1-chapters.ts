import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, and } from 'drizzle-orm';
import * as schema from '../src/lib/schema';

const { chapters, books } = schema;

async function queryBook1Chapters() {
  console.log('🔍 Querying Book 1 chapters for color theme analysis...\n');
  
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
    // First, get Book 1 ID and basic info
    console.log('📚 Finding Book 1...');
    const book1 = await db.select().from(books).where(eq(books.bookNumber, 1)).limit(1);
    
    if (book1.length === 0) {
      console.log('❌ Book 1 not found in database');
      return;
    }

    console.log(`✅ Found Book 1: "${book1[0].title}" (ID: ${book1[0].id})\n`);

    // Query all chapters for Book 1
    console.log('📖 Querying all chapters for Book 1...');
    const book1Chapters = await db
      .select()
      .from(chapters)
      .where(eq(chapters.bookId, book1[0].id))
      .orderBy(chapters.chapterNumber);

    console.log(`📊 SUMMARY RESULTS:`);
    console.log(`==================`);
    console.log(`Total chapters found for Book 1: ${book1Chapters.length}\n`);

    if (book1Chapters.length === 0) {
      console.log('❌ No chapters found for Book 1');
      return;
    }

    // Analyze color themes
    console.log('🎨 COLOR THEME ANALYSIS:');
    console.log('========================');
    
    const colorThemeStats = {
      withColorTheme: 0,
      withHexCode: 0,
      withColorName: 0,
      withRGBValues: 0,
      uniqueColors: new Set<string>(),
      uniqueHexCodes: new Set<string>(),
    };

    // Detailed chapter analysis
    console.log('\n📋 DETAILED CHAPTER BREAKDOWN:');
    console.log('==============================');
    
    book1Chapters.forEach((chapter, index) => {
      console.log(`\nChapter ${chapter.chapterNumber}: "${chapter.title || 'Untitled'}"`);
      console.log(`  ID: ${chapter.id}`);
      console.log(`  Unique Identifier: ${chapter.uniqueIdentifier || 'N/A'}`);
      
      // Color Theme Analysis
      if (chapter.colorTheme) {
        colorThemeStats.withColorTheme++;
        console.log(`  Color Theme (JSON): ${JSON.stringify(chapter.colorTheme)}`);
      }
      
      if (chapter.hexCode) {
        colorThemeStats.withHexCode++;
        colorThemeStats.uniqueHexCodes.add(chapter.hexCode);
        console.log(`  Hex Code: ${chapter.hexCode}`);
      }
      
      if (chapter.colorName) {
        colorThemeStats.withColorName++;
        colorThemeStats.uniqueColors.add(chapter.colorName);
        console.log(`  Color Name: ${chapter.colorName}`);
      }
      
      if (chapter.red !== null || chapter.green !== null || chapter.blue !== null) {
        colorThemeStats.withRGBValues++;
        console.log(`  RGB Values: R:${chapter.red || 'null'} G:${chapter.green || 'null'} B:${chapter.blue || 'null'}`);
      }
      
      // Additional metadata
      console.log(`  Focus: ${chapter.focus || 'N/A'}`);
      console.log(`  Type: ${chapter.type || 'N/A'}`);
      console.log(`  Major Task Group ID: ${chapter.majorTaskGroupId || 'N/A'}`);
    });

    // Color statistics summary
    console.log('\n🎯 COLOR STATISTICS SUMMARY:');
    console.log('============================');
    console.log(`Chapters with colorTheme JSON field: ${colorThemeStats.withColorTheme}`);
    console.log(`Chapters with hexCode field: ${colorThemeStats.withHexCode}`);
    console.log(`Chapters with colorName field: ${colorThemeStats.withColorName}`);
    console.log(`Chapters with RGB values: ${colorThemeStats.withRGBValues}`);
    console.log(`Unique color names found: ${colorThemeStats.uniqueColors.size}`);
    console.log(`Unique hex codes found: ${colorThemeStats.uniqueHexCodes.size}`);

    if (colorThemeStats.uniqueColors.size > 0) {
      console.log(`\nUnique color names: ${Array.from(colorThemeStats.uniqueColors).join(', ')}`);
    }
    
    if (colorThemeStats.uniqueHexCodes.size > 0) {
      console.log(`Unique hex codes: ${Array.from(colorThemeStats.uniqueHexCodes).join(', ')}`);
    }

    // Pattern analysis
    console.log('\n🔍 PATTERN ANALYSIS:');
    console.log('====================');
    
    if (colorThemeStats.withColorTheme === 1 && book1Chapters.length > 1) {
      console.log('⚠️  POTENTIAL ISSUE: Only 1 chapter has colorTheme data, but there are multiple chapters.');
      console.log('   This could explain why only one color is showing in the UI.');
    } else if (colorThemeStats.withColorTheme === 0) {
      console.log('❌ CRITICAL ISSUE: No chapters have colorTheme data.');
      console.log('   This would explain why colors are not showing in the UI.');
    } else if (colorThemeStats.withColorTheme === book1Chapters.length) {
      console.log('✅ All chapters have colorTheme data - this should work correctly.');
    } else {
      console.log(`⚠️  PARTIAL DATA: ${colorThemeStats.withColorTheme} out of ${book1Chapters.length} chapters have colorTheme data.`);
      console.log('   Some chapters may not display colors correctly.');
    }

    // Check for data consistency issues
    console.log('\n🔧 DATA CONSISTENCY CHECK:');
    console.log('===========================');
    
    const inconsistencies: string[] = [];
    
    book1Chapters.forEach((chapter) => {
      const hasColorTheme = !!chapter.colorTheme;
      const hasHexCode = !!chapter.hexCode;
      const hasColorName = !!chapter.colorName;
      const hasRGB = chapter.red !== null || chapter.green !== null || chapter.blue !== null;
      
      if (hasColorTheme && !hasHexCode && !hasColorName && !hasRGB) {
        inconsistencies.push(`Chapter ${chapter.chapterNumber}: Has colorTheme JSON but no individual color fields`);
      }
      
      if (!hasColorTheme && (hasHexCode || hasColorName || hasRGB)) {
        inconsistencies.push(`Chapter ${chapter.chapterNumber}: Has individual color fields but no colorTheme JSON`);
      }
      
      if (hasHexCode && (!hasRGB || chapter.red === null || chapter.green === null || chapter.blue === null)) {
        inconsistencies.push(`Chapter ${chapter.chapterNumber}: Has hex code but incomplete RGB values`);
      }
    });
    
    if (inconsistencies.length > 0) {
      console.log('⚠️  Data inconsistencies found:');
      inconsistencies.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('✅ No data inconsistencies detected.');
    }

  } catch (error) {
    console.error('🔴 Failed to query database:', error);
  } finally {
    await pool.end();
    console.log('\n✅ Database connection closed.');
  }
}

queryBook1Chapters();