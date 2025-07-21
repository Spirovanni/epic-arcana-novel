import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { promises as fs } from 'fs';
import path from 'path';
import * as schema from '../src/lib/schema.ts';
import { eq, and } from 'drizzle-orm';
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

async function extractChapterData(chapterData, chapterNumber) {
  if (!chapterData) return null;

  const rgb = hexToRgb(chapterData.hex_code);
  
  const chapterMetadata = {
    chapterNumber,
    uniqueIdentifier: chapterData.unique_identifier,
    title: chapterData.title || `Chapter ${chapterNumber}`,
    focus: chapterData.specific_task_group_title,
    epicNovelPages: chapterData.epic_novel_pages,
    epicChapterFocus: chapterData.epic_chapter_focus,
    epicNovelChapterFocus: chapterData.epic_novel_chapter_focus,
    epicNovelSectionName: chapterData.epic_novel_section_name,
    description: chapterData.summary,
    tarotCardLink: chapterData.tarot_card_link,
    tarotFamily: chapterData.tarot_family,
    tarotCardItem: chapterData.tarot_card_item,
    colorTheme: {
      colorName: chapterData.color_name,
      hexCode: chapterData.hex_code,
      red: chapterData.red,
      green: chapterData.green,
      blue: chapterData.blue
    },
    type: chapterData.type,
    colorName: chapterData.color_name,
    hexCode: chapterData.hex_code,
    red: rgb?.r || chapterData.red,
    green: rgb?.g || chapterData.green,
    blue: rgb?.b || chapterData.blue,
    focusArea: chapterData.focus_area,
    connectionToMajorTaskGroup: chapterData.connection_to_the_major_task_group,
    specificTaskGroupDescription: chapterData.specific_task_group_description,
    specificTaskGroupTagline: chapterData.specific_task_group_tagline,
    specificTaskGroupBooksInfluencedBy: chapterData.specific_task_group_books_influenced_by,
    terminalLearningObjectives: chapterData.specific_task_group_books_influenced_by,
    plot: chapterData.plot,
    heroJourneyBeat: chapterData.hero_journey_beat,
    saveTheCatBeat: chapterData.save_the_cat_beat,
    saveTheCatBeatGoal: chapterData.save_the_cat_beat_goal,
    summary: chapterData.summary
  };

  // Extract scenes if they exist
  const scenesData = [];
  if (chapterData.scenes && Array.isArray(chapterData.scenes)) {
    for (const scene of chapterData.scenes) {
      if (scene.scene_title && scene.setup) { // Only include completed scenes
        scenesData.push({
          sceneNumber: scene.scene_number,
          title: scene.scene_title?.substring(0, 255) || null,
          description: scene.setup,
          tarotSymbolism: scene.symbolism,
          heroJourneyStage: chapterData.hero_journey_beat?.substring(0, 100) || null,
          primaryTarotCard: scene.beat_goal?.substring(0, 100) || null,
          historicalDate: scene.timeline_date?.substring(0, 50) || null,
          alternateTimelineVariant: scene.timeline_variant?.substring(0, 100) || null,
          temporalDivergencePoint: scene.core_emotion,
          timelineSignificance: scene.scene_tone
        });
      }
    }
  }

  return { chapter: chapterMetadata, scenes: scenesData };
}

async function findBook1Chapters() {
  console.log('Reading l_outline.json file...');
  const outlineData = await loadJSON(path.join(LORE_PATH, 'l_outline.json'));
  
  // Navigate to the SelfImprovementSeries structure
  const seriesData = outlineData.SelfImprovementSeries;
  if (!seriesData) {
    throw new Error('Could not find SelfImprovementSeries in outline data');
  }

  // Navigate to Book 1 in the first trilogy
  const book1Data = seriesData.Books?.trilogies?.["1st_trilogy"]?.trilogy_books?.Book1;
  
  if (!book1Data) {
    throw new Error('Could not find Book 1 in outline data');
  }

  console.log(`Found Book 1: ${book1Data.title}`);

  const chapters = [];
  const chapterNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // Chapters 1-14
  
  // Navigate through task masters to find chapters
  if (book1Data.task_masters) {
    for (const taskMasterKey in book1Data.task_masters) {
      const taskMaster = book1Data.task_masters[taskMasterKey];
      
      if (taskMaster.major_task_groups) {
        for (const majorGroupKey in taskMaster.major_task_groups) {
          const majorGroup = taskMaster.major_task_groups[majorGroupKey];
          
          if (majorGroup.Specific_task_groups) {
            for (const specificGroupKey in majorGroup.Specific_task_groups) {
              const specificGroup = majorGroup.Specific_task_groups[specificGroupKey];
              
              // Extract chapter number from the chapter field
              if (specificGroup.chapter) {
                const chapterMatch = specificGroup.chapter.match(/Chapter (\d+)/);
                if (chapterMatch) {
                  const chapterNum = parseInt(chapterMatch[1]);
                  if (chapterNumbers.includes(chapterNum)) {
                    console.log(`Found Chapter ${chapterNum}: ${specificGroup.title || specificGroup.specific_task_group_title || 'Untitled'}`);
                    const chapterData = await extractChapterData(specificGroup, chapterNum);
                    if (chapterData) {
                      chapters.push(chapterData);
                    }
                  }
                }
              }
              
              // Check for major activity themes (like Chapter 13)
              if (specificGroup.major_activity_theme_1) {
                const majorActivity = specificGroup.major_activity_theme_1;
                if (majorActivity.chapter) {
                  const chapterMatch = majorActivity.chapter.match(/Chapter (\d+)/);
                  if (chapterMatch) {
                    const chapterNum = parseInt(chapterMatch[1]);
                    if (chapterNumbers.includes(chapterNum)) {
                      console.log(`Found Chapter ${chapterNum}: ${majorActivity.specific_task_group_title || majorActivity.title || 'Untitled'}`);
                      const chapterData = await extractChapterData(majorActivity, chapterNum);
                      if (chapterData) {
                        chapters.push(chapterData);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return chapters.sort((a, b) => a.chapter.chapterNumber - b.chapter.chapterNumber);
}

async function restoreChaptersToDatabase(chapters) {
  // Create database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema });

  try {
    console.log('Connecting to database...');
    
    // Find Book 1 in the database
    const book1 = await db.select().from(schema.books).where(eq(schema.books.bookNumber, 1)).limit(1);
    if (book1.length === 0) {
      throw new Error('Book 1 not found in database. Please seed books first.');
    }
    
    const book1Id = book1[0].id;
    console.log(`Found Book 1 in database with ID: ${book1Id}`);

    // Check which chapters currently exist
    const existingChapters = await db
      .select({ chapterNumber: schema.chapters.chapterNumber })
      .from(schema.chapters)
      .where(eq(schema.chapters.bookId, book1Id));
    
    const existingChapterNumbers = new Set(existingChapters.map(ch => ch.chapterNumber));
    console.log(`Existing chapters: ${Array.from(existingChapterNumbers).sort().join(', ')}`);

    for (const chapterData of chapters) {
      const { chapter, scenes } = chapterData;
      
      // Skip chapters that already exist (15, 16, 17)
      if (existingChapterNumbers.has(chapter.chapterNumber)) {
        console.log(`Skipping Chapter ${chapter.chapterNumber}: already exists`);
        continue;
      }
      
      console.log(`\nRestoring Chapter ${chapter.chapterNumber}: ${chapter.title}`);
      
      // Insert new chapter
      const newChapter = await db
        .insert(schema.chapters)
        .values({
          ...chapter,
          bookId: book1Id
        })
        .returning();
      
      const chapterId = newChapter[0].id;
      console.log(`  Inserted chapter with ID: ${chapterId}`);

      // Handle scenes
      if (scenes.length > 0) {
        console.log(`  Adding ${scenes.length} scenes...`);
        
        // Insert new scenes
        for (const scene of scenes) {
          await db.insert(schema.scenes).values({
            ...scene,
            chapterId
          });
          console.log(`    - Scene ${scene.sceneNumber}: ${scene.title}`);
        }
      }
    }

    console.log('\n✅ Successfully restored missing chapters to database!');
    
  } catch (error) {
    console.error('❌ Error restoring chapters to database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function main() {
  try {
    console.log('🚀 Starting to restore Book 1 Chapters 1-14 from outline...\n');
    
    // Extract Book 1 data
    const chapters = await findBook1Chapters();
    
    if (chapters.length === 0) {
      console.log('⚠️  No chapters found to restore');
      return;
    }
    
    console.log(`\n📚 Found ${chapters.length} chapters to restore:`);
    chapters.forEach(({ chapter }) => {
      console.log(`  - Chapter ${chapter.chapterNumber}: ${chapter.title}`);
    });
    
    // Restore to database
    await restoreChaptersToDatabase(chapters);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();