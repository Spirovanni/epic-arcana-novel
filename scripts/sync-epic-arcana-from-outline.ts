#!/usr/bin/env tsx

/**
 * Sync Epic Arcana novel data from l_outline.json
 * This script focuses on the trilogy_books structure and syncs all book data
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { 
  novelSeries, 
  books, 
  taskMasters, 
  majorTaskGroups, 
  chapters
} from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function sanitizeJsonData(data: any): any {
  if (typeof data === 'string') {
    return data.replace(/\0/g, '');
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeJsonData);
  }
  if (typeof data === 'object' && data !== null) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      cleaned[key] = sanitizeJsonData(value);
    }
    return cleaned;
  }
  return data;
}

function extractBookNumber(identifier: string): number {
  if (!identifier) return 0;
  const match = identifier.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

async function syncEpicArcanaData() {
  console.log('🚀 Starting Epic Arcana sync from l_outline.json');
  
  try {
    // Load the l_outline.json file
    const outlineFilePath = resolve(__dirname, '../lore/l_outline.json');
    const rawData = readFileSync(outlineFilePath, 'utf-8');
    const outlineData = JSON.parse(rawData);
    
    // Navigate to the trilogy_books structure
    const trilogyBooks = outlineData.SelfImprovementSeries?.Books?.trilogies;
    
    if (!trilogyBooks) {
      throw new Error('Trilogy books not found in l_outline.json');
    }
    
    // Create or update the Epic Arcana series
    const seriesData = {
      title: 'Epic Arcana',
      tagline: 'Temporal Chronicles',
      logline: 'A fantasy series exploring the nature of time, fate, and human agency through the lens of medieval tarot cards.',
      description: 'Epic Arcana is a nine-book fantasy series that follows Francisco Petrarch and his allies as they navigate temporal paradoxes and divine conspiracies using mystical tarot cards called Trionfi.',
      genres: ['Fantasy', 'Historical Fiction', 'Time Travel', 'Literary Fiction'],
      themes: ['Free Will vs. Determinism', 'Temporal Mythmaking', 'Divine Authority', 'Human Agency'],
      keyThemes: {},
      updatedAt: new Date()
    };
    
    const existingSeries = await db
      .select()
      .from(novelSeries)
      .where(eq(novelSeries.title, 'Epic Arcana'))
      .limit(1);
    
    let seriesId: string;
    
    if (existingSeries.length > 0) {
      await db
        .update(novelSeries)
        .set(seriesData)
        .where(eq(novelSeries.id, existingSeries[0].id));
      seriesId = existingSeries[0].id;
      console.log('✅ Updated Epic Arcana series');
    } else {
      const newSeries = await db
        .insert(novelSeries)
        .values(seriesData)
        .returning();
      seriesId = newSeries[0].id;
      console.log('✅ Created Epic Arcana series');
    }
    
    // Process all trilogies
    for (const trilogyKey of Object.keys(trilogyBooks)) {
      const trilogyData = trilogyBooks[trilogyKey];
      
      if (!trilogyData.trilogy_books) continue;
      
      console.log(`\n🔄 Processing ${trilogyData.trilogy_title}...`);
      
      // Process books in this trilogy
      for (const [bookKey, bookData] of Object.entries(trilogyData.trilogy_books)) {
        const bookNumber = extractBookNumber(bookData.unique_identifier);
        
        if (bookNumber === 0) continue;
        
        console.log(`📖 Syncing Book ${bookNumber}: ${bookData.fiction_novel_title}`);
        
        // Sync book data
        const bookDbData = {
          seriesId,
          bookNumber,
          uniqueIdentifier: bookData.unique_identifier,
          title: bookData.title,
          fictionNovelTitle: bookData.fiction_novel_title,
          subject: bookData.subject,
          focus: bookData.focus,
          epicNovelPlot: bookData.epic_novel_plot,
          uniqueTheme: bookData.unique_theme,
          militaryComponent: bookData.military_component,
          businessModelGeneration: bookData.business_model_generation,
          personalityType: bookData.personality_type,
          enneagramType: bookData.ennegram_name,
          enneagramDescription: bookData.ennegram_description,
          coveryCoveyHabit: bookData['9_habits_covey'],
          associatedSin: bookData.sin,
          businessModelYou: bookData.business_model_you,
          type: bookData.type,
          tagline: bookData.tagline,
          logline: bookData.logline,
          description: bookData.description,
          themes: sanitizeJsonData(bookData.themes),
          keyThemes: sanitizeJsonData(bookData.key_themes),
          updatedAt: new Date()
        };
        
        const existingBook = await db
          .select()
          .from(books)
          .where(eq(books.bookNumber, bookNumber))
          .limit(1);
        
        let bookId: string;
        
        if (existingBook.length > 0) {
          await db
            .update(books)
            .set(bookDbData)
            .where(eq(books.id, existingBook[0].id));
          bookId = existingBook[0].id;
          console.log(`   ✅ Updated book ${bookNumber}`);
        } else {
          const newBook = await db
            .insert(books)
            .values(bookDbData)
            .returning();
          bookId = newBook[0].id;
          console.log(`   ✅ Created book ${bookNumber}`);
        }
        
        // Sync task masters
        if (bookData.task_masters) {
          for (const [taskMasterKey, taskMasterData] of Object.entries(bookData.task_masters)) {
            const taskMasterDbData = {
              bookId,
              uniqueIdentifier: taskMasterData.unique_identifier,
              type: taskMasterData.type,
              colorName: taskMasterData.color_name,
              hexCode: taskMasterData.hex_code,
              red: taskMasterData.red,
              green: taskMasterData.green,
              blue: taskMasterData.blue,
              title: taskMasterData.title,
              tagline: taskMasterData.tagline,
              description: taskMasterData.description,
              fictionNovelSectionTitle: taskMasterData.fiction_novel_section_title,
              fictionNovelSectionDescription: taskMasterData.fiction_novel_section_description,
              fictionNovelSectionTagline: taskMasterData.fiction_novel_section_tagline,
              fictionNovelSectionBooksInfluencedBy: sanitizeJsonData(taskMasterData.fiction_novel_section_books_influenced_by),
              updatedAt: new Date()
            };
            
            const existingTaskMaster = await db
              .select()
              .from(taskMasters)
              .where(eq(taskMasters.uniqueIdentifier, taskMasterData.unique_identifier))
              .limit(1);
            
            let taskMasterId: string;
            
            if (existingTaskMaster.length > 0) {
              await db
                .update(taskMasters)
                .set(taskMasterDbData)
                .where(eq(taskMasters.id, existingTaskMaster[0].id));
              taskMasterId = existingTaskMaster[0].id;
              console.log(`     ✅ Updated task master: ${taskMasterData.title}`);
            } else {
              const newTaskMaster = await db
                .insert(taskMasters)
                .values(taskMasterDbData)
                .returning();
              taskMasterId = newTaskMaster[0].id;
              console.log(`     ✅ Created task master: ${taskMasterData.title}`);
            }
            
            // Sync major task groups
            if (taskMasterData.major_task_groups) {
              for (const [majorTaskGroupKey, majorTaskGroupData] of Object.entries(taskMasterData.major_task_groups)) {
                const majorTaskGroupDbData = {
                  taskMasterId,
                  uniqueIdentifier: majorTaskGroupData.unique_identifier,
                  type: majorTaskGroupData.type,
                  colorName: majorTaskGroupData.color_name,
                  hexCode: majorTaskGroupData.hex_code,
                  red: majorTaskGroupData.red || 0,
                  green: majorTaskGroupData.green || 0,
                  blue: majorTaskGroupData.blue || 0,
                  title: majorTaskGroupData.major_task_group_title || 'Untitled',
                  description: majorTaskGroupData.major_task_group_description,
                  tagline: majorTaskGroupData.major_task_group_tagline,
                  booksInfluencedBy: sanitizeJsonData(majorTaskGroupData.major_task_group_books_influenced_by),
                  updatedAt: new Date()
                };
                
                const existingMajorTaskGroup = await db
                  .select()
                  .from(majorTaskGroups)
                  .where(eq(majorTaskGroups.uniqueIdentifier, majorTaskGroupData.unique_identifier))
                  .limit(1);
                
                let majorTaskGroupId: string;
                
                if (existingMajorTaskGroup.length > 0) {
                  await db
                    .update(majorTaskGroups)
                    .set(majorTaskGroupDbData)
                    .where(eq(majorTaskGroups.id, existingMajorTaskGroup[0].id));
                  majorTaskGroupId = existingMajorTaskGroup[0].id;
                  console.log(`       ✅ Updated major task group: ${majorTaskGroupData.major_task_group_title}`);
                } else {
                  const newMajorTaskGroup = await db
                    .insert(majorTaskGroups)
                    .values(majorTaskGroupDbData)
                    .returning();
                  majorTaskGroupId = newMajorTaskGroup[0].id;
                  console.log(`       ✅ Created major task group: ${majorTaskGroupData.major_task_group_title}`);
                }
                
                // Sync chapters (specific task groups)
                // Handle both "specific_task_groups" and "Specific_task_groups" variations
                const specificTaskGroups = majorTaskGroupData.specific_task_groups || majorTaskGroupData.Specific_task_groups;
                if (specificTaskGroups) {
                  for (const [specificTaskGroupKey, specificTaskGroupData] of Object.entries(specificTaskGroups)) {
                    const chapterMatch = specificTaskGroupData.chapter?.match(/(\d+)/);
                    const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : 0;
                    
                    if (chapterNumber === 0) continue;
                    
                    const chapterDbData = {
                      bookId,
                      majorTaskGroupId,
                      chapterNumber,
                      uniqueIdentifier: specificTaskGroupData.unique_identifier,
                      title: specificTaskGroupData.specific_task_group_title,
                      chapterTitle: specificTaskGroupData.specific_task_group_title, // NEW: for chapter_title field
                      focus: specificTaskGroupData.focus_area,
                      epicNovelPages: specificTaskGroupData.epic_novel_pages,
                      epicChapterFocus: specificTaskGroupData.epic_chapter_focus,
                      epicNovelChapterFocus: specificTaskGroupData.epic_novel_chapter_focus,
                      epicNovelSectionName: specificTaskGroupData.epic_novel_section_name,
                      description: specificTaskGroupData.specific_task_group_description,
                      tarotCardLink: specificTaskGroupData.tarot_card_link,
                      tarotFamily: specificTaskGroupData.tarot_family,
                      tarotCardItem: specificTaskGroupData.tarot_card_item,
                      colorTheme: {
                        name: specificTaskGroupData.color_name,
                        hex: specificTaskGroupData.hex_code,
                        rgb: {
                          red: specificTaskGroupData.red || 0,
                          green: specificTaskGroupData.green || 0,
                          blue: specificTaskGroupData.blue || 0
                        }
                      },
                      type: specificTaskGroupData.type,
                      colorName: specificTaskGroupData.color_name,
                      hexCode: specificTaskGroupData.hex_code,
                      red: specificTaskGroupData.red || 0,
                      green: specificTaskGroupData.green || 0,
                      blue: specificTaskGroupData.blue || 0,
                      focusArea: specificTaskGroupData.focus_area,
                      connectionToMajorTaskGroup: specificTaskGroupData.connection_to_major_task_group,
                      specificTaskGroupDescription: specificTaskGroupData.specific_task_group_description,
                      specificTaskGroupTagline: specificTaskGroupData.specific_task_group_tagline,
                      specificTaskGroupBooksInfluencedBy: sanitizeJsonData(specificTaskGroupData.specific_task_group_books_influenced_by),
                      terminalLearningObjectives: sanitizeJsonData(specificTaskGroupData.terminal_learning_objectives),
                      updatedAt: new Date()
                    };
                    
                    const existingChapter = await db
                      .select()
                      .from(chapters)
                      .where(eq(chapters.uniqueIdentifier, specificTaskGroupData.unique_identifier))
                      .limit(1);
                    
                    if (existingChapter.length > 0) {
                      await db
                        .update(chapters)
                        .set(chapterDbData)
                        .where(eq(chapters.id, existingChapter[0].id));
                      console.log(`         ✅ Updated chapter ${chapterNumber}: ${specificTaskGroupData.specific_task_group_title}`);
                    } else {
                      await db
                        .insert(chapters)
                        .values(chapterDbData);
                      console.log(`         ✅ Created chapter ${chapterNumber}: ${specificTaskGroupData.specific_task_group_title}`);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    
    console.log('\n🎉 Epic Arcana sync completed successfully!');
    console.log('📊 Database has been populated with Epic Arcana data');
    console.log('🔄 l_outline.json is now the authoritative source of truth');
    
  } catch (error) {
    console.error('\n💥 Sync operation failed:', error);
    process.exit(1);
  }
}

// Run the sync
syncEpicArcanaData().catch(console.error);