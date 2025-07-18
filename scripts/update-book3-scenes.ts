import * as fs from 'fs';
import * as path from 'path';

interface Scene {
  scene_number: number;
  title: string;
  setup: string;
  symbolism: string;
  beat_goal: string;
  pov: string;
  tense: string;
  core_emotion: string;
  scene_tone: string;
}

interface Book3Chapter {
  chapter: number;
  title: string;
  summary: string;
  character_arcs: any;
  story_gaps_addressed: any;
  location_details: any;
  series_connections: any;
}

// Read the Book 3 source data
const book3Path = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/json/storyline/Book_3_Sphere_of_Influence_Outline.json';
const book3Data = JSON.parse(fs.readFileSync(book3Path, 'utf8'));

// Read the l_outline.json file
const outlinePath = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/l_outline.json';
const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));

// Extract Book 3 chapters from the source data
const book3Chapters = book3Data.structure.flatMap((part: any) => part.chapters);

// Function to split chapter summary into 4 logical parts
function splitSummaryIntoScenes(summary: string): string[] {
  const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length <= 4) {
    // If we have 4 or fewer sentences, use them directly
    return sentences.map(s => s.trim());
  }
  
  // Split into 4 roughly equal parts
  const totalSentences = sentences.length;
  const part1End = Math.ceil(totalSentences / 4);
  const part2End = Math.ceil(totalSentences / 2);
  const part3End = Math.ceil(3 * totalSentences / 4);
  
  return [
    sentences.slice(0, part1End).join('. ').trim(),
    sentences.slice(part1End, part2End).join('. ').trim(),
    sentences.slice(part2End, part3End).join('. ').trim(),
    sentences.slice(part3End).join('. ').trim()
  ];
}

// Function to create simplified scenes for a chapter
function createSimplifiedScenes(chapter: Book3Chapter): Scene[] {
  const sceneParts = splitSummaryIntoScenes(chapter.summary);
  
  return sceneParts.map((setup, index) => ({
    scene_number: index + 1,
    title: `Scene ${index + 1}`,
    setup: setup,
    symbolism: "Symbolic elements to be developed",
    beat_goal: "Advance the narrative and character development",
    pov: "3rd Person Limited",
    tense: "Past Tense",
    core_emotion: "Varies by scene context",
    scene_tone: "Reflective and purposeful"
  }));
}

// Function to update a chapter in the outline
function updateChapterInOutline(chapterNumber: number, sourceChapter: Book3Chapter, outline: any): boolean {
  const chapterStr = `Chapter ${chapterNumber}`;
  let found = false;
  
  // Navigate through the outline structure to find Book 3 chapters
  function searchAndUpdate(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return false;
    
    for (const key in obj) {
      if (key === 'unique_identifier' && typeof obj[key] === 'string' && obj[key].startsWith('STG 3.')) {
        if (obj.chapter === chapterStr) {
          // Update the chapter with simplified scenes
          const scenes = createSimplifiedScenes(sourceChapter);
          obj.scenes = scenes;
          
          // Update chapter-level fields
          obj.pov = "3rd Person Limited";
          obj.tense = "Past Tense";
          obj.core_emotion = "Varies by scene context";
          obj.scene_tone = "Reflective and purposeful";
          
          // Update summary if it exists
          if (obj.summary) {
            obj.summary = sourceChapter.summary;
          }
          
          // Update character arcs if they exist
          if (sourceChapter.character_arcs && obj.character_arcs) {
            obj.character_arcs = sourceChapter.character_arcs;
          }
          
          // Update story gaps if they exist
          if (sourceChapter.story_gaps_addressed && obj.story_gaps_addressed) {
            obj.story_gaps_addressed = sourceChapter.story_gaps_addressed;
          }
          
          // Update location details if they exist
          if (sourceChapter.location_details && obj.location_details) {
            obj.location_details = sourceChapter.location_details;
          }
          
          // Update series connections if they exist
          if (sourceChapter.series_connections && obj.series_connections) {
            obj.series_connections = sourceChapter.series_connections;
          }
          
          console.log(`Updated ${chapterStr} (${obj.unique_identifier})`);
          return true;
        }
      }
      
      if (searchAndUpdate(obj[key])) {
        found = true;
      }
    }
    
    return found;
  }
  
  return searchAndUpdate(outline);
}

// Main processing
console.log('Starting Book 3 scenes update...');
console.log(`Found ${book3Chapters.length} chapters in Book 3 data`);

let updatedCount = 0;

// Process each chapter
for (const sourceChapter of book3Chapters) {
  if (updateChapterInOutline(sourceChapter.chapter, sourceChapter, outlineData)) {
    updatedCount++;
  }
}

console.log(`Updated ${updatedCount} chapters out of ${book3Chapters.length}`);

// Write the updated outline back to the file
fs.writeFileSync(outlinePath, JSON.stringify(outlineData, null, 2));
console.log('Book 3 scenes update completed!');