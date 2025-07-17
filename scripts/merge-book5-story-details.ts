#!/usr/bin/env tsx

/**
 * Merge detailed story information from Book_5_Holder_of_Life_Force_Outline.json into l_outline.json
 * This script adds hero_journey_beat, character_arcs, story_gaps_addressed, 
 * location_details, and series_connections to all Book 5 chapters
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

async function mergeBook5StoryDetails() {
  console.log('🚀 Starting merge of Book 5 story details');
  
  try {
    // Load the Book_5_Holder_of_Life_Force_Outline.json file
    const book5OutlinePath = resolve(__dirname, '../lore/json/storyline/Book_5_Holder_of_Life_Force_Outline.json');
    const book5Data: BookOutline = JSON.parse(readFileSync(book5OutlinePath, 'utf-8'));
    
    // Load the l_outline.json file
    const lOutlinePath = resolve(__dirname, '../lore/l_outline.json');
    const lOutlineData = JSON.parse(readFileSync(lOutlinePath, 'utf-8'));
    
    // Create a map of chapter data from Book_5_Holder_of_Life_Force_Outline.json
    const chapterDataMap = new Map<number, Chapter>();
    
    book5Data.structure.forEach(section => {
      section.chapters.forEach(chapter => {
        chapterDataMap.set(chapter.chapter, chapter);
      });
    });
    
    console.log(`📊 Found ${chapterDataMap.size} chapters to process`);
    
    // Navigate to Book 5 in l_outline.json and add the missing fields
    const trilogyBooks = lOutlineData.SelfImprovementSeries?.Books?.trilogies;
    
    if (!trilogyBooks) {
      throw new Error('Trilogy books not found in l_outline.json');
    }
    
    // Find Book 5 in the structure
    let book5Found = false;
    let updatedChapters = 0;
    
    for (const trilogyKey of Object.keys(trilogyBooks)) {
      const trilogy = trilogyBooks[trilogyKey];
      if (trilogy.trilogy_books) {
        for (const [bookKey, bookData] of Object.entries(trilogy.trilogy_books as any)) {
          // Check if this is Book 5 (MT 5)
          if ((bookData as any).unique_identifier === 'MT 5') {
            book5Found = true;
            console.log(`✅ Found Book 5: ${(bookData as any).fiction_novel_title}`);
            
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
                                'Intro': 'The Ordinary World',
                                'Inciting Incident': 'The Call to Adventure',
                                'The Ordinary World': 'The Ordinary World',
                                'Immediate Reaction': 'Refusal of the Call',
                                'Plot Point I': 'Meeting the Mentor',
                                'Rising Action': 'Crossing the Threshold',
                                'Fun and Games': 'Tests, Allies, Enemies',
                                'Midpoint': 'Approach to the Inmost Cave',
                                'Rising Conflict': 'The Ordeal',
                                'Plot Point II': 'Reward (Seizing the Sword)',
                                'Final Push': 'The Road Back',
                                'Climax': 'Resurrection',
                                'Resolution': 'Return with the Elixir'
                              };
                              
                              (specificTaskGroup as any).hero_journey_beat = plotToHeroJourney[sourceChapter.plot] || sourceChapter.plot;
                              (specificTaskGroup as any).hero_journey_beat_objective = `The goal of the hero journey beat is to ${sourceChapter.plot?.toLowerCase() || 'advance the story'}.`;
                            }
                            
                            if (!(specificTaskGroup as any).save_the_cat_beat && sourceChapter.plot) {
                              // Map plot to Save the Cat beat
                              const plotToSaveTheCat: Record<string, string> = {
                                'Intro': 'Opening Image',
                                'Inciting Incident': 'Inciting Incident',
                                'The Ordinary World': 'Setup',
                                'Immediate Reaction': 'Catalyst',
                                'Plot Point I': 'Debate',
                                'Rising Action': 'Break into Two',
                                'Fun and Games': 'Fun and Games',
                                'Midpoint': 'Midpoint',
                                'Rising Conflict': 'Bad Guys Close In',
                                'Plot Point II': 'All Is Lost',
                                'Final Push': 'Dark Night of the Soul',
                                'Climax': 'Break into Three',
                                'Resolution': 'Finale'
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
      if (book5Found) break;
    }
    
    if (!book5Found) {
      throw new Error('Book 5 not found in l_outline.json');
    }
    
    // Write the updated l_outline.json back to file
    writeFileSync(lOutlinePath, JSON.stringify(lOutlineData, null, 2));
    
    console.log(`\n🎉 Successfully updated ${updatedChapters} chapters in Book 5!`);
    console.log('📊 Added hero journey beats, character arcs, story gaps, location details, and series connections');
    console.log('💾 l_outline.json has been updated with the enhanced story information');
    
  } catch (error) {
    console.error('\n💥 Merge operation failed:', error);
    process.exit(1);
  }
}

// Run the merge
mergeBook5StoryDetails().catch(console.error);