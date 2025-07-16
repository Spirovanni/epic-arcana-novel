#!/usr/bin/env tsx

/**
 * Script to integrate Book 1 chapter data from Book_1_Only_Outline.json into l_outline.json
 * This script extracts chapters 8-40 and integrates them into the existing structure
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LORE_DIR = resolve(__dirname, '../lore');

// Read both JSON files
const book1OutlineData = JSON.parse(readFileSync(resolve(LORE_DIR, 'json/storyline/Book_1_Only_Outline.json'), 'utf-8'));
const lOutlineData = JSON.parse(readFileSync(resolve(LORE_DIR, 'l_outline.json'), 'utf-8'));

// Function to convert Book_1_Only_Outline chapter to l_outline format
function convertChapterToLOutlineFormat(chapter: any, chapterNum: number, stgId: string, taskGroupId: string, taskMasterId: string) {
  return {
    unique_identifier: stgId,
    chapter: `Chapter ${chapterNum}`,
    type: "Specific Task Group",
    tarot_card_link: "",
    tarot_family: "", // Will need to be filled based on pattern
    new_tarot_family: "", // Will need to be filled based on pattern
    tarot_card_item: "", // Will need to be filled based on pattern
    color_name: "Orange", // Based on Book 1 Orange theme
    hex_code: "#FFA500",
    red: 255,
    green: 165,
    blue: 0,
    epic_novel_pages: `Pages ${(chapterNum - 1) * 15 + 1} - ${chapterNum * 15}`, // Estimated page ranges
    epic_chapter_focus: chapter.plot,
    epic_preliminary_scene_focus: chapter.plot,
    epic_preliminary_scene_description: chapter.summary,
    epic_novel_chapter_focus: `Scene ${chapter.scene}: ${chapter.plot}`,
    epic_novel_section_name: getSectionName(chapterNum),
    specific_task_group_title: chapter.title,
    focus_area: getFocusArea(chapter.title),
    connection_to_the_major_task_group: getConnectionToMajorTaskGroup(chapter.title, chapter.summary),
    specific_task_group_description: chapter.summary,
    specific_task_group_tagline: `${chapter.title} represents ${chapter.plot.toLowerCase()} in the hero's journey.`,
    specific_task_group_books_influenced_by: generateBookInfluences(chapter.title, chapter.summary),
    scene: chapter.scene,
    hero_journey_beat: getHeroJourneyBeat(chapterNum),
    hero_journey_beat_objective: getHeroJourneyBeatObjective(chapterNum),
    plot: chapter.plot,
    save_the_cat_beat: getSaveTheCatBeat(chapterNum),
    save_the_cat_beat_goal: "",
    title: chapter.title,
    summary: chapter.summary,
    character_arcs: chapter.character_arcs || {},
    story_gaps_addressed: chapter.story_gaps_addressed || {},
    location_details: chapter.location_details || {},
    series_connections: chapter.series_connections || {}
  };
}

// Helper functions to generate appropriate values
function getSectionName(chapterNum: number): string {
  if (chapterNum <= 13) return "Part I: Spirit of Aether";
  if (chapterNum <= 26) return "Part II: Temporal Awakening";
  return "Part III: Crown of Destiny";
}

function getFocusArea(title: string): string {
  // Convert title to focus area format
  return `${title} Development`;
}

function getConnectionToMajorTaskGroup(title: string, summary: string): string {
  return `The ${title} phase represents a crucial development in Francisco's journey, where ${summary.split('.')[0].toLowerCase()}. This connects to the larger transformation theme by showing how individual growth contributes to cosmic change.`;
}

function getHeroJourneyBeat(chapterNum: number): string {
  const beats = [
    "The Ordinary World", "The Call to Adventure", "Refusal of the Call", "Meeting the Mentor",
    "Crossing the Threshold", "Tests, Allies, and Enemies", "Approach to the Innermost Cave",
    "The Ordeal", "The Reward", "The Road Back", "Resurrection", "Return with the Elixir"
  ];
  
  const beatIndex = Math.floor((chapterNum - 1) / 3.33) % beats.length;
  return beats[beatIndex];
}

function getHeroJourneyBeatObjective(chapterNum: number): string {
  return `The goal of this beat is to advance Francisco's development through the ${getHeroJourneyBeat(chapterNum).toLowerCase()} stage of his transformation.`;
}

function getSaveTheCatBeat(chapterNum: number): string {
  if (chapterNum <= 5) return "Opening Image";
  if (chapterNum <= 10) return "Set-up";
  if (chapterNum <= 15) return "Catalyst";
  if (chapterNum <= 20) return "Debate";
  if (chapterNum <= 25) return "Break Into Two";
  if (chapterNum <= 30) return "B Story";
  if (chapterNum <= 35) return "Fun and Games";
  return "Midpoint";
}

function generateBookInfluences(title: string, summary: string) {
  // Generate basic book influences structure
  return {
    book1: {
      title: "Hero with a Thousand Faces",
      author: "Joseph Campbell",
      section_of_focus: "Hero's Journey",
      section_description: `Explores the ${title.toLowerCase()} stage of the hero's journey, showing how ${summary.split('.')[0].toLowerCase()}.`,
      connection_focus_area: `The ${title} phase connects to Campbell's monomyth structure.`,
      connect_points: {
        point1: `Shows the universal nature of the ${title.toLowerCase()} experience.`,
        point2: "Demonstrates how personal transformation follows archetypal patterns.",
        point3: "Illustrates the cosmic significance of individual choices."
      },
      terminal_learning_objectives: {
        objective1: `Understand the ${title.toLowerCase()} phase of personal development.`,
        objective2: "Apply archetypal patterns to personal growth.",
        objective3: "Recognize the universal nature of transformation."
      }
    },
    book2: {
      title: "The Power of Myth",
      author: "Joseph Campbell",
      section_of_focus: "Mythological Thinking",
      section_description: `Examines how mythological thinking applies to the ${title.toLowerCase()} experience.`,
      connection_focus_area: `The ${title} theme resonates with mythological patterns of growth.`,
      connect_points: {
        point1: "Connects personal experience to universal mythic themes.",
        point2: "Shows how individual growth reflects cosmic patterns.",
        point3: "Demonstrates the transformative power of mythological understanding."
      },
      terminal_learning_objectives: {
        objective1: "Apply mythological thinking to personal challenges.",
        objective2: "Recognize archetypal patterns in daily life.",
        objective3: "Use mythic understanding for personal transformation."
      }
    },
    book3: {
      title: "The Divine Comedy",
      author: "Dante Alighieri",
      section_of_focus: "Spiritual Journey",
      section_description: `Relates to the ${title.toLowerCase()} aspect of spiritual development and transformation.`,
      connection_focus_area: `The ${title} phase mirrors Dante's journey through spiritual realms.`,
      connect_points: {
        point1: "Shows the progression of spiritual awakening.",
        point2: "Demonstrates the challenges of moral development.",
        point3: "Illustrates the ultimate goal of divine understanding."
      },
      terminal_learning_objectives: {
        objective1: "Understand the stages of spiritual development.",
        objective2: "Apply moral reasoning to complex situations.",
        objective3: "Pursue higher understanding through dedicated practice."
      }
    }
  };
}

// Process the chapters
console.log('🚀 Starting Book 1 chapter integration...');

// Get the trilogy structure from l_outline
const trilogyBooks = lOutlineData.SelfImprovementSeries.Books.trilogies["1st_trilogy"].trilogy_books;
const book1 = trilogyBooks.Book1;

// Get chapters from Book_1_Only_Outline
const chaptersData = book1OutlineData.structure;

let chapterCounter = 8; // Starting from chapter 8 since 1-7 are already done

// Find chapters 8-40 and integrate them
for (const section of chaptersData) {
  for (const chapter of section.chapters) {
    if (chapter.chapter >= 8 && chapter.chapter <= 40) {
      console.log(`📖 Processing Chapter ${chapter.chapter}: ${chapter.title}`);
      
      // Determine which task master and major task group this belongs to
      const taskMasterNum = Math.ceil(chapter.chapter / 13.33); // Roughly 13-14 chapters per task master
      const majorTaskGroupNum = Math.ceil((chapter.chapter % 13.33 || 13.33) / 4.44); // Roughly 4-5 chapters per major task group
      
      const taskMasterId = `TM 1.${taskMasterNum}`;
      const majorTaskGroupId = `MTG 1.${taskMasterNum}.${majorTaskGroupNum}`;
      const stgId = `STG 1.${taskMasterNum}.${majorTaskGroupNum}.${((chapter.chapter - 1) % 4) + 1}`;
      
      // Convert chapter to l_outline format
      const convertedChapter = convertChapterToLOutlineFormat(chapter, chapter.chapter, stgId, majorTaskGroupId, taskMasterId);
      
      // Find or create the appropriate task master
      if (!book1.task_masters) {
        book1.task_masters = {};
      }
      
      const taskMasterKey = `task_master_${taskMasterNum}`;
      if (!book1.task_masters[taskMasterKey]) {
        book1.task_masters[taskMasterKey] = {
          unique_identifier: taskMasterId,
          type: "Task Master",
          color_name: "Orange",
          hex_code: "#FFA500",
          red: 255,
          green: 165,
          blue: 0,
          title: `Book 1 Task Master ${taskMasterNum}`,
          tagline: `Guiding Francisco's transformation through ${getSectionName(chapter.chapter)}`,
          description: `This task master oversees Francisco's development during the ${getSectionName(chapter.chapter)} phase of his journey.`,
          fiction_novel_section_title: getSectionName(chapter.chapter),
          fiction_novel_section_description: `The ${getSectionName(chapter.chapter)} represents a crucial phase in Francisco's transformation.`,
          fiction_novel_section_tagline: `${getSectionName(chapter.chapter)} - Where destiny begins to unfold`,
          fiction_novel_section_books_influenced_by: {},
          major_task_groups: {}
        };
      }
      
      // Find or create the appropriate major task group
      const majorTaskGroupKey = `major_task_group_${majorTaskGroupNum}`;
      if (!book1.task_masters[taskMasterKey].major_task_groups) {
        book1.task_masters[taskMasterKey].major_task_groups = {};
      }
      if (!book1.task_masters[taskMasterKey].major_task_groups[majorTaskGroupKey]) {
        book1.task_masters[taskMasterKey].major_task_groups[majorTaskGroupKey] = {
          unique_identifier: majorTaskGroupId,
          type: "Major Task Group",
          color_name: "Orange",
          hex_code: "#FFA500",
          red: 255,
          green: 165,
          blue: 0,
          major_task_group_title: `Transformation Phase ${majorTaskGroupNum}`,
          major_task_group_description: `This phase focuses on Francisco's development through the challenges of ${chapter.plot.toLowerCase()}.`,
          major_task_group_tagline: `Phase ${majorTaskGroupNum} - ${chapter.plot} development`,
          major_task_group_books_influenced_by: {},
          specific_task_groups: {}
        };
      }
      
      // Add the converted chapter to the specific task groups
      const specificTaskGroupKey = `specific_task_group_${((chapter.chapter - 1) % 4) + 1}`;
      if (!book1.task_masters[taskMasterKey].major_task_groups[majorTaskGroupKey].specific_task_groups) {
        book1.task_masters[taskMasterKey].major_task_groups[majorTaskGroupKey].specific_task_groups = {};
      }
      book1.task_masters[taskMasterKey].major_task_groups[majorTaskGroupKey].specific_task_groups[specificTaskGroupKey] = convertedChapter;
      
      console.log(`   ✅ Added to ${taskMasterKey} > ${majorTaskGroupKey} > ${specificTaskGroupKey}`);
    }
  }
}

// Write the updated l_outline.json
writeFileSync(resolve(LORE_DIR, 'l_outline.json'), JSON.stringify(lOutlineData, null, 4), 'utf-8');

console.log('🎉 Chapter integration completed successfully!');
console.log('📊 Updated l_outline.json with chapters 8-40 from Book_1_Only_Outline.json');
console.log('🔄 All chapters now follow the established structure and maintain Orange color theme');