import * as fs from 'fs';
import * as path from 'path';

// File paths
const sourceFile = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/json/storyline/Book_1_Combined_Database_Ready.json';
const targetFile = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/l_outline.json';

interface Scene {
  scene_number: number;
  title: string;
  setup: string;
  symbolism: string;
  beat_goal: string;
}

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  summary: string;
  plot: string;
  section: string;
  scenes: Scene[];
  pov: string;
  tense: string;
  core_emotion: string;
  scene_tone: string;
  character_arcs: any;
  story_gaps_addressed: any;
  location_details: any;
  series_connections: any;
}

interface BookData {
  book_id: number;
  title: string;
  chapters: Chapter[];
}

// Read the source file
console.log('Reading source file...');
const sourceData: BookData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

// Read the target file
console.log('Reading target file...');
const targetData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));

// Create a mapping of new chapter data by chapter number
const chapterMap = new Map<number, Chapter>();
sourceData.chapters.forEach(chapter => {
  chapterMap.set(chapter.chapter_number, chapter);
});

// Function to recursively find and update Book 1 chapters
function updateBookChapters(obj: any, path: string = ''): boolean {
  let found = false;
  
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        // Check if this is a chapter structure we need to update
        if (key === 'chapter' && typeof obj[key] === 'string' && obj[key].startsWith('Chapter ')) {
          const chapterMatch = obj[key].match(/Chapter (\d+)/);
          if (chapterMatch) {
            const chapterNum = parseInt(chapterMatch[1]);
            const newChapterData = chapterMap.get(chapterNum);
            
            if (newChapterData) {
              console.log(`Updating ${obj[key]} (${currentPath})`);
              
              // Update the scenes structure
              if (obj.scenes && Array.isArray(obj.scenes)) {
                obj.scenes = newChapterData.scenes.map(scene => ({
                  scene_number: scene.scene_number,
                  title: scene.title,
                  setup: scene.setup,
                  symbolism: scene.symbolism,
                  beat_goal: scene.beat_goal
                }));
              }
              
              // Add missing fields if they don't exist
              if (!obj.pov && newChapterData.pov) {
                obj.pov = newChapterData.pov;
              }
              if (!obj.tense && newChapterData.tense) {
                obj.tense = newChapterData.tense;
              }
              if (!obj.core_emotion && newChapterData.core_emotion) {
                obj.core_emotion = newChapterData.core_emotion;
              }
              if (!obj.scene_tone && newChapterData.scene_tone) {
                obj.scene_tone = newChapterData.scene_tone;
              }
              
              found = true;
            }
          }
        }
        
        // Recursively search in nested objects
        if (updateBookChapters(obj[key], currentPath)) {
          found = true;
        }
      }
    }
  }
  
  return found;
}

// Update the target data
console.log('Updating chapters...');
const updated = updateBookChapters(targetData);

if (updated) {
  // Write the updated data back to the file
  console.log('Writing updated file...');
  fs.writeFileSync(targetFile, JSON.stringify(targetData, null, 2));
  console.log('Successfully updated l_outline.json with new Book 1 scene structure');
} else {
  console.log('No Book 1 chapters found to update');
}