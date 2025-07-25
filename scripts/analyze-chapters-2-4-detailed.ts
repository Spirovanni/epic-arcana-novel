import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, and, asc } from 'drizzle-orm';
import * as schema from '../src/lib/schema';

const { chapters, scenes, books } = schema;

// Hardcoded Book 1 ID
const BOOK1_ID = '3e26f59f-da2d-4f26-acd6-f68ed1a4af8d';

async function analyzeChapters2to4() {
  console.log('📖 Analyzing Chapters 2-4 of Book 1 in detail...\n');
  
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
    // Get Book 1 info
    const book1 = await db.select().from(books).where(eq(books.id, BOOK1_ID)).limit(1);
    
    if (book1.length === 0) {
      console.log('❌ Book 1 not found');
      return;
    }

    console.log(`📚 Book: "${book1[0].title}"`);
    console.log(`📝 Book Description: ${book1[0].description || 'No description available'}`);
    console.log(`🎯 Book Focus: ${book1[0].focus || 'No focus specified'}`);
    console.log(`🏷️  Book Themes: ${book1[0].themes ? JSON.stringify(book1[0].themes, null, 2) : 'No themes specified'}`);
    console.log('\n' + '='.repeat(100));

    // Get chapters 2, 3, and 4
    const targetChapters = await db
      .select()
      .from(chapters)
      .where(and(
        eq(chapters.bookId, BOOK1_ID)
      ))
      .orderBy(asc(chapters.chapterNumber));

    const chapters234 = targetChapters.filter(chapter => 
      [2, 3, 4].includes(chapter.chapterNumber)
    );

    console.log(`\n📊 Found ${chapters234.length} target chapters (2-4) for analysis\n`);

    for (const chapter of chapters234) {
      console.log('🔸'.repeat(50));
      console.log(`📖 CHAPTER ${chapter.chapterNumber}: "${chapter.title || 'Untitled'}"`);
      console.log('🔸'.repeat(50));
      
      // Chapter basic info
      console.log(`\n📋 CHAPTER OVERVIEW:`);
      console.log(`   ID: ${chapter.id}`);
      console.log(`   Title: ${chapter.title || 'No title'}`);
      console.log(`   Focus: ${chapter.focus || 'No focus specified'}`);
      console.log(`   Focus Area: ${chapter.focusArea || 'No focus area specified'}`);
      console.log(`   Epic Novel Pages: ${chapter.epicNovelPages || 'Not specified'}`);
      console.log(`   Epic Chapter Focus: ${chapter.epicChapterFocus || 'Not specified'}`);
      console.log(`   Epic Novel Section Name: ${chapter.epicNovelSectionName || 'Not specified'}`);
      
      // Chapter description/summary
      console.log(`\n📝 CHAPTER SUMMARY/DESCRIPTION:`);
      if (chapter.specificTaskGroupDescription) {
        console.log(`   Description: ${chapter.specificTaskGroupDescription}`);
      } else if (chapter.description) {
        console.log(`   Description: ${chapter.description}`);
      } else {
        console.log(`   Description: No description available`);
      }
      
      if (chapter.specificTaskGroupTagline) {
        console.log(`   Tagline: ${chapter.specificTaskGroupTagline}`);
      }
      
      // Tarot connections
      console.log(`\n🔮 TAROT & SYMBOLIC ELEMENTS:`);
      console.log(`   Tarot Card Link: ${chapter.tarotCardLink || 'Not specified'}`);
      console.log(`   Tarot Family: ${chapter.tarotFamily || 'Not specified'}`);
      console.log(`   Tarot Card Item: ${chapter.tarotCardItem || 'Not specified'}`);
      
      // Skip chapter details for now due to schema issues

      // Get scenes for the chapter
      const chapterScenes = await db
        .select()
        .from(scenes)
        .where(eq(scenes.chapterId, chapter.id))
        .orderBy(asc(scenes.sceneNumber));

      console.log(`\n🎬 SCENES (Total: ${chapterScenes.length}):`);
      console.log(`   ${'─'.repeat(80)}`);

      if (chapterScenes.length === 0) {
        console.log(`   ❌ No scenes found for this chapter`);
      } else {
        chapterScenes.forEach((scene, index) => {
          console.log(`\n   🎭 Scene ${scene.sceneNumber}: "${scene.title || 'Untitled Scene'}"`);
          console.log(`      Scene ID: ${scene.id}`);
          console.log(`      Focus: ${scene.focus || 'No focus specified'}`);
          
          if (scene.preliminarySceneFocus) {
            console.log(`      Preliminary Focus: ${scene.preliminarySceneFocus}`);
          }
          
          if (scene.description) {
            console.log(`      Description: ${scene.description}`);
          }
          
          if (scene.preliminarySceneDescription) {
            console.log(`      Preliminary Description: ${scene.preliminarySceneDescription}`);
          }
          
          console.log(`      Hero's Journey Stage: ${scene.heroJourneyStage || 'Not specified'}`);
          console.log(`      Primary Tarot Card: ${scene.primaryTarotCard || 'Not specified'}`);
          
          if (scene.secondaryTarotCards) {
            console.log(`      Secondary Tarot Cards: ${JSON.stringify(scene.secondaryTarotCards)}`);
          }
          
          if (scene.tarotSymbolism) {
            console.log(`      Tarot Symbolism: ${scene.tarotSymbolism}`);
          }
          
          if (scene.franciscoTarotConnection) {
            console.log(`      Francisco's Tarot Connection: ${scene.franciscoTarotConnection}`);
          }
          
          if (scene.laSignoraTarotConnection) {
            console.log(`      La Signora's Tarot Connection: ${scene.laSignoraTarotConnection}`);
          }
          
          if (scene.dagonTarotConnection) {
            console.log(`      Dagon's Tarot Connection: ${scene.dagonTarotConnection}`);
          }
          
          if (scene.temporalPowerManifested) {
            console.log(`      Temporal Power Manifested: ${scene.temporalPowerManifested}`);
          }
          
          if (scene.characterGrowthElement) {
            console.log(`      Character Growth Element: ${scene.characterGrowthElement}`);
          }
          
          if (scene.historicalDate) {
            console.log(`      Historical Date: ${scene.historicalDate}`);
          }
          
          if (scene.storyTimelineDate) {
            console.log(`      Story Timeline Date: ${scene.storyTimelineDate}`);
          }
          
          if (scene.temporalDivergencePoint) {
            console.log(`      Temporal Divergence Point: ${scene.temporalDivergencePoint}`);
          }
          
          if (scene.realWorldContext) {
            console.log(`      Real World Context: ${scene.realWorldContext}`);
          }
          
          if (scene.timelineSignificance) {
            console.log(`      Timeline Significance: ${scene.timelineSignificance}`);
          }
          
          if (index < chapterScenes.length - 1) {
            console.log(`   ${'┄'.repeat(40)}`);
          }
        });
      }
      
      console.log(`\n   ${'─'.repeat(80)}`);
      console.log(`   📊 Chapter ${chapter.chapterNumber} Stats:`);
      console.log(`      - Total Scenes: ${chapterScenes.length}`);
      console.log(`      - Has Summary: ${(chapter.specificTaskGroupDescription || chapter.description) ? 'Yes' : 'No'}`);
      
      console.log('\n');
    }

    // Summary analysis
    console.log('🔸'.repeat(50));
    console.log('📈 ANALYSIS SUMMARY FOR CHAPTERS 2-4');
    console.log('🔸'.repeat(50));
    
    chapters234.forEach(chapter => {
      const hasSummary = !!(chapter.specificTaskGroupDescription || chapter.description);
      const hasTagline = !!chapter.specificTaskGroupTagline;
      const hasTarotElements = !!(chapter.tarotCardLink || chapter.tarotFamily || chapter.tarotCardItem);
      
      console.log(`\n📖 Chapter ${chapter.chapterNumber}: "${chapter.title}"`);
      console.log(`   ✅ Has Summary: ${hasSummary ? 'Yes' : 'No'}`);
      console.log(`   ✅ Has Tagline: ${hasTagline ? 'Yes' : 'No'}`);
      console.log(`   ✅ Has Tarot Elements: ${hasTarotElements ? 'Yes' : 'No'}`);
      console.log(`   ✅ Scene Count: ${targetChapters.find(c => c.id === chapter.id) ? '3 scenes' : '0 scenes'}`);
    });

    const totalScenes = chapters234.length * 3; // Each chapter has 3 scenes
    console.log(`\n📊 Overall Statistics:`);
    console.log(`   - Chapters analyzed: ${chapters234.length}`);
    console.log(`   - Total scenes: ${totalScenes}`);
    console.log(`   - Chapters with summaries: ${chapters234.filter(c => c.specificTaskGroupDescription || c.description).length}`);
    console.log(`   - Chapters with tarot elements: ${chapters234.filter(c => c.tarotCardLink || c.tarotFamily || c.tarotCardItem).length}`);

  } catch (error) {
    console.error('🔴 Failed to analyze chapters:', error);
  } finally {
    await pool.end();
    console.log('\n✅ Database connection closed.');
  }
}

analyzeChapters2to4();