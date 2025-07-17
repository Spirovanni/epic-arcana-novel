#!/usr/bin/env tsx

/**
 * Merge detailed story information from Book_2_Temporal_Express_Outline.json into l_outline.json
 * This script adds hero_journey_beat, character_arcs, story_gaps_addressed, 
 * location_details, and series_connections to all Book 2 chapters
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Chapter {
  chapter: number;
  scene?: number;
  plot?: string;
  title: string;
  summary: string;
  character_arcs?: any;
  story_gaps_addressed?: any;
  location_details?: any;
  series_connections?: any;
  hero_journey_beat?: string;
  hero_journey_beat_objective?: string;
  save_the_cat_beat?: string;
  save_the_cat_beat_goal?: string;
}

interface BookOutline {
  title: string;
  subtitle?: string;
  pages?: string;
  thematic_focus?: string;
  key_arcana?: string[];
  primary_objective?: string;
  structure: Array<{
    section: string;
    chapters: Chapter[];
  }>;
}

async function mergeBook2StoryDetails() {
  console.log('🚀 Starting merge of Book 2 story details');
  
  try {
    // Load the Book_2_Temporal_Express_Outline.json file
    const book2OutlinePath = resolve(__dirname, '../lore/json/storyline/Book_2_Temporal_Express_Outline.json');
    const book2Data: BookOutline = JSON.parse(readFileSync(book2OutlinePath, 'utf-8'));
    
    // Load the l_outline.json file
    const lOutlinePath = resolve(__dirname, '../lore/l_outline.json');
    const lOutlineData = JSON.parse(readFileSync(lOutlinePath, 'utf-8'));
    
    // Create a map of chapter data from Book_2_Temporal_Express_Outline.json
    const chapterDataMap = new Map<number, Chapter>();
    
    book2Data.structure.forEach(section => {
      section.chapters.forEach(chapter => {
        chapterDataMap.set(chapter.chapter, chapter);
      });
    });
    
    console.log(`📊 Found ${chapterDataMap.size} chapters to process`);
    
    // Navigate to Book 2 in l_outline.json and add the missing fields
    const trilogyBooks = lOutlineData.SelfImprovementSeries?.Books?.trilogies;
    
    if (!trilogyBooks) {
      throw new Error('Trilogy books not found in l_outline.json');
    }
    
    // Find Book 2 in the structure
    let book2Found = false;
    let updatedChapters = 0;
    
    for (const trilogyKey of Object.keys(trilogyBooks)) {
      const trilogy = trilogyBooks[trilogyKey];
      if (trilogy.trilogy_books) {
        for (const [bookKey, bookData] of Object.entries(trilogy.trilogy_books as any)) {
          // Check if this is Book 2 (MT 2)
          if ((bookData as any).unique_identifier === 'MT 2') {
            book2Found = true;
            console.log(`✅ Found Book 2: ${(bookData as any).fiction_novel_title}`);
            
            // Process all task masters
            if ((bookData as any).task_masters) {
              for (const [taskMasterKey, taskMaster] of Object.entries((bookData as any).task_masters)) {
                if ((taskMaster as any).major_task_groups) {
                  for (const [majorTaskGroupKey, majorTaskGroup] of Object.entries((taskMaster as any).major_task_groups)) {
                    // Handle both specific_task_groups and Specific_task_groups variations
                    const specificTaskGroups = (majorTaskGroup as any).specific_task_groups || (majorTaskGroup as any).Specific_task_groups;
                    if (specificTaskGroups) {
                      for (const [specificTaskGroupKey, specificTaskGroup] of Object.entries(specificTaskGroups)) {
                        // Extract chapter number from chapter field (e.g., "Chapter 1" -> 1)
                        const chapterMatch = (specificTaskGroup as any).chapter?.match(/Chapter (\d+)/);
                        if (chapterMatch) {
                          const chapterNum = parseInt(chapterMatch[1], 10);
                          // console.log(`        📝 Processing Chapter ${chapterNum}: ${(specificTaskGroup as any).specific_task_group_title}`);
                          const sourceChapter = chapterDataMap.get(chapterNum);
                          
                          if (sourceChapter) {
                            // Add the missing fields
                            if (!(specificTaskGroup as any).hero_journey_beat && sourceChapter.plot) {
                              // Map plot to hero journey beat
                              const plotToHeroJourney: Record<string, string> = {
                                'The Ordinary World': 'The Ordinary World',
                                'The Call to Adventure': 'The Call to Adventure',
                                'Refusal of the Call': 'Refusal of the Call',
                                'Meeting the Mentor': 'Meeting the Mentor',
                                'Crossing the Threshold': 'Crossing the Threshold',
                                'Guardians and Gatekeepers': 'Tests, Allies, Enemies',
                                'Allies, Mentors, and Helpers': 'Tests, Allies, Enemies',
                                'The Road of Trials': 'Tests, Allies, Enemies',
                                'The Supreme Ordeal': 'Approach to the Inmost Cave',
                                'Meeting with the Goddess': 'The Ordeal',
                                'Atonement with the Father': 'Reward (Seizing the Sword)',
                                'The Abyss': 'The Road Back',
                                'The Ultimate Boon': 'Resurrection',
                                'Flight': 'The Road Back',
                                'Rescue from Without': 'Resurrection',
                                'Master of Two Worlds': 'Return with the Elixir'
                              };
                              
                              (specificTaskGroup as any).hero_journey_beat = plotToHeroJourney[sourceChapter.plot] || sourceChapter.plot;
                              (specificTaskGroup as any).hero_journey_beat_objective = `The goal of the hero journey beat is to ${sourceChapter.plot?.toLowerCase() || 'advance the story'}.`;
                            }
                            
                            if (!(specificTaskGroup as any).save_the_cat_beat && sourceChapter.plot) {
                              // Map plot to Save the Cat beat
                              const plotToSaveTheCat: Record<string, string> = {
                                'The Ordinary World': 'Setup',
                                'The Call to Adventure': 'Inciting Incident',
                                'Refusal of the Call': 'Catalyst',
                                'Meeting the Mentor': 'Debate',
                                'Crossing the Threshold': 'Break into Two',
                                'Guardians and Gatekeepers': 'Fun and Games',
                                'Allies, Mentors, and Helpers': 'Fun and Games',
                                'The Road of Trials': 'Fun and Games',
                                'The Supreme Ordeal': 'Midpoint',
                                'Meeting with the Goddess': 'Bad Guys Close In',
                                'Atonement with the Father': 'All Is Lost',
                                'The Abyss': 'Dark Night of the Soul',
                                'The Ultimate Boon': 'Break into Three',
                                'Flight': 'Break into Three',
                                'Rescue from Without': 'Finale',
                                'Master of Two Worlds': 'Finale'
                              };
                              
                              (specificTaskGroup as any).save_the_cat_beat = plotToSaveTheCat[sourceChapter.plot] || sourceChapter.plot;
                              (specificTaskGroup as any).save_the_cat_beat_goal = '';
                            }
                            
                            if (!(specificTaskGroup as any).plot) {
                              (specificTaskGroup as any).plot = sourceChapter.plot;
                            }
                            
                            if (!(specificTaskGroup as any).character_arcs && sourceChapter.character_arcs) {
                              (specificTaskGroup as any).character_arcs = sourceChapter.character_arcs;
                            }
                            
                            if (!(specificTaskGroup as any).story_gaps_addressed && sourceChapter.story_gaps_addressed) {
                              (specificTaskGroup as any).story_gaps_addressed = sourceChapter.story_gaps_addressed;
                            }
                            
                            if (!(specificTaskGroup as any).location_details && sourceChapter.location_details) {
                              (specificTaskGroup as any).location_details = sourceChapter.location_details;
                            }
                            
                            if (!(specificTaskGroup as any).series_connections && sourceChapter.series_connections) {
                              (specificTaskGroup as any).series_connections = sourceChapter.series_connections;
                            }
                            
                            // Update summary if it's different and more detailed
                            if (sourceChapter.summary && sourceChapter.summary.length > ((specificTaskGroup as any).summary?.length || 0)) {
                              (specificTaskGroup as any).summary = sourceChapter.summary;
                            }
                            
                            updatedChapters++;
                            console.log(`   ✅ Updated Chapter ${chapterNum}: ${sourceChapter.title}`);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            break;
          }
        }
      }
      if (book2Found) break;
    }
    
    if (!book2Found) {
      throw new Error('Book 2 not found in l_outline.json');
    }
    
    // Write the updated l_outline.json back to file
    writeFileSync(lOutlinePath, JSON.stringify(lOutlineData, null, 2));
    
    console.log(`\n🎉 Successfully updated ${updatedChapters} chapters in Book 2!`);
    console.log('📊 Added hero journey beats, character arcs, story gaps, location details, and series connections');
    console.log('💾 l_outline.json has been updated with the enhanced story information');
    
  } catch (error) {
    console.error('\n💥 Merge operation failed:', error);
    process.exit(1);
  }
}

// Run the merge
mergeBook2StoryDetails().catch(console.error);