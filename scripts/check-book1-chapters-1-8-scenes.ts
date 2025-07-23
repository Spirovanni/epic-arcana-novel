import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, and, asc } from 'drizzle-orm';
import * as schema from '../src/lib/schema';

const { chapters, scenes, books } = schema;

// Hardcoded Book 1 ID as provided
const BOOK1_ID = '3e26f59f-da2d-4f26-acd6-f68ed1a4af8d';

async function checkBook1ChaptersScenes() {
  console.log('🔍 Checking scenes for Book 1 chapters 1-8...\n');
  
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
    // First, verify the book exists
    console.log('📚 Verifying Book 1...');
    const book1 = await db.select().from(books).where(eq(books.id, BOOK1_ID)).limit(1);
    
    if (book1.length === 0) {
      console.log('❌ Book 1 not found with the provided ID');
      return;
    }

    console.log(`✅ Found Book 1: "${book1[0].title}" (ID: ${book1[0].id})\n`);

    // Get chapters 1-8 for Book 1
    console.log('📖 Querying chapters 1-8 for Book 1...');
    const book1Chapters = await db
      .select()
      .from(chapters)
      .where(and(
        eq(chapters.bookId, BOOK1_ID),
        // Using SQL operator to get chapters 1-8
      ))
      .orderBy(asc(chapters.chapterNumber));

    // Filter for chapters 1-8
    const chapters1to8 = book1Chapters.filter(chapter => 
      chapter.chapterNumber >= 1 && chapter.chapterNumber <= 8
    );

    console.log(`📊 Found ${chapters1to8.length} chapters (1-8) for Book 1\n`);

    if (chapters1to8.length === 0) {
      console.log('❌ No chapters 1-8 found for Book 1');
      return;
    }

    // Now get scenes for each chapter
    const chapterSceneData = [];
    const chaptersWithScenes = [];
    const chaptersWithoutScenes = [];

    for (const chapter of chapters1to8) {
      console.log(`🔍 Checking scenes for Chapter ${chapter.chapterNumber}: "${chapter.title || 'Untitled'}"...`);
      
      const chapterScenes = await db
        .select()
        .from(scenes)
        .where(eq(scenes.chapterId, chapter.id))
        .orderBy(asc(scenes.sceneNumber));

      const sceneData = {
        chapterNumber: chapter.chapterNumber,
        chapterTitle: chapter.title || 'Untitled',
        chapterId: chapter.id,
        sceneCount: chapterScenes.length,
        scenes: chapterScenes.map(scene => ({
          sceneNumber: scene.sceneNumber,
          title: scene.title || 'Untitled Scene',
          focus: scene.focus,
          description: scene.description ? scene.description.substring(0, 150) + '...' : 'No description',
          heroJourneyStage: scene.heroJourneyStage,
          primaryTarotCard: scene.primaryTarotCard
        }))
      };

      chapterSceneData.push(sceneData);

      if (chapterScenes.length > 0) {
        chaptersWithScenes.push(chapter.chapterNumber);
      } else {
        chaptersWithoutScenes.push(chapter.chapterNumber);
      }
    }

    // Display results
    console.log('\n' + '='.repeat(80));
    console.log('📊 ANALYSIS RESULTS FOR BOOK 1 CHAPTERS 1-8');
    console.log('='.repeat(80));

    // 1. Which chapters have scenes and how many
    console.log('\n1️⃣ CHAPTERS WITH SCENES:');
    console.log('========================');
    if (chaptersWithScenes.length > 0) {
      chapterSceneData
        .filter(data => data.sceneCount > 0)
        .forEach(data => {
          console.log(`✅ Chapter ${data.chapterNumber}: "${data.chapterTitle}" - ${data.sceneCount} scene(s)`);
        });
    } else {
      console.log('❌ No chapters have scenes');
    }

    // 2. Which chapters are missing scenes
    console.log('\n2️⃣ CHAPTERS MISSING SCENES:');
    console.log('============================');
    if (chaptersWithoutScenes.length > 0) {
      chaptersWithoutScenes.forEach(chapterNum => {
        const chapterData = chapterSceneData.find(data => data.chapterNumber === chapterNum);
        console.log(`❌ Chapter ${chapterNum}: "${chapterData?.chapterTitle}" - NO SCENES`);
      });
    } else {
      console.log('✅ All chapters have scenes!');
    }

    // 3. Detailed scene summaries for chapters that have scenes
    console.log('\n3️⃣ DETAILED SCENE SUMMARIES:');
    console.log('=============================');
    
    const chaptersWithScenesData = chapterSceneData.filter(data => data.sceneCount > 0);
    
    if (chaptersWithScenesData.length > 0) {
      chaptersWithScenesData.forEach(chapterData => {
        console.log(`\n📖 Chapter ${chapterData.chapterNumber}: "${chapterData.chapterTitle}"`);
        console.log(`   Chapter ID: ${chapterData.chapterId}`);
        console.log(`   Total Scenes: ${chapterData.sceneCount}`);
        console.log('   ────────────────────────────────────────────────────────────');
        
        chapterData.scenes.forEach((scene, index) => {
          console.log(`   Scene ${scene.sceneNumber}: "${scene.title}"`);
          if (scene.focus) console.log(`     Focus: ${scene.focus}`);
          if (scene.heroJourneyStage) console.log(`     Hero's Journey Stage: ${scene.heroJourneyStage}`);
          if (scene.primaryTarotCard) console.log(`     Primary Tarot Card: ${scene.primaryTarotCard}`);
          console.log(`     Description: ${scene.description}`);
          if (index < chapterData.scenes.length - 1) console.log('');
        });
      });
    } else {
      console.log('❌ No chapters have scenes to display.');
    }

    // Summary statistics
    console.log('\n' + '='.repeat(80));
    console.log('📈 SUMMARY STATISTICS');
    console.log('='.repeat(80));
    console.log(`Total chapters checked (1-8): ${chapters1to8.length}`);
    console.log(`Chapters with scenes: ${chaptersWithScenes.length}`);
    console.log(`Chapters without scenes: ${chaptersWithoutScenes.length}`);
    
    const totalScenes = chapterSceneData.reduce((sum, data) => sum + data.sceneCount, 0);
    console.log(`Total scenes across chapters 1-8: ${totalScenes}`);
    
    if (chaptersWithScenes.length > 0) {
      const avgScenesPerChapter = totalScenes / chaptersWithScenes.length;
      console.log(`Average scenes per chapter (with scenes): ${avgScenesPerChapter.toFixed(1)}`);
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('===================');
    
    if (chaptersWithoutScenes.length > 0) {
      console.log('🔧 Action needed: The following chapters need scenes created:');
      chaptersWithoutScenes.forEach(chapterNum => {
        const chapterData = chapterSceneData.find(data => data.chapterNumber === chapterNum);
        console.log(`   - Chapter ${chapterNum}: "${chapterData?.chapterTitle}" (ID: ${chapterData?.chapterId})`);
      });
      console.log('\n📝 Consider using the existing scene creation scripts or API endpoints to populate these chapters.');
    } else {
      console.log('✅ All chapters 1-8 have scenes! The story structure is complete for these chapters.');
    }

    // Show missing chapters if any from 1-8 range
    const existingChapterNumbers = chapters1to8.map(c => c.chapterNumber);
    const missingChapterNumbers = [];
    for (let i = 1; i <= 8; i++) {
      if (!existingChapterNumbers.includes(i)) {
        missingChapterNumbers.push(i);
      }
    }

    if (missingChapterNumbers.length > 0) {
      console.log('\n⚠️  WARNING: The following chapter numbers are completely missing from the database:');
      missingChapterNumbers.forEach(num => {
        console.log(`   - Chapter ${num}`);
      });
      console.log('   These chapters need to be created before scenes can be added.');
    }

  } catch (error) {
    console.error('🔴 Failed to query database:', error);
  } finally {
    await pool.end();
    console.log('\n✅ Database connection closed.');
  }
}

checkBook1ChaptersScenes();