#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the source data
const book5SourcePath = path.join(__dirname, '../lore/json/storyline/Book_5_Holder_of_Life_Force_Outline.json');
const book5Source = JSON.parse(fs.readFileSync(book5SourcePath, 'utf8'));

// Read the target file
const lOutlinePath = path.join(__dirname, '../lore/l_outline.json');
const lOutlineContent = fs.readFileSync(lOutlinePath, 'utf8');

// Extract all chapters from Book 5 source
const allChapters = [];
book5Source.structure.forEach(part => {
  part.chapters.forEach(chapter => {
    allChapters.push(chapter);
  });
});

console.log(`Found ${allChapters.length} chapters in Book 5 source data`);

// Function to split chapter summary into 4 scenes
function createScenesFromSummary(summary) {
  const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const scenes = [];
  const sentencesPerScene = Math.ceil(sentences.length / 4);
  
  for (let i = 0; i < 4; i++) {
    const start = i * sentencesPerScene;
    const end = Math.min(start + sentencesPerScene, sentences.length);
    const sceneText = sentences.slice(start, end).join('. ').trim();
    
    scenes.push({
      "scene_number": i + 1,
      "title": `Scene ${i + 1}`,
      "setup": sceneText + (sceneText.endsWith('.') ? '' : '.'),
      "symbolism": `Symbolic elements of scene ${i + 1}`,
      "beat_goal": `Advance the narrative through scene ${i + 1}`
    });
  }
  
  return scenes;
}

// Process each chapter
allChapters.forEach((chapter, index) => {
  const chapterNumber = chapter.chapter;
  const chapterSummary = chapter.summary;
  
  // Create scenes structure
  const scenes = createScenesFromSummary(chapterSummary);
  
  // Create the scenes JSON structure
  const scenesJson = JSON.stringify(scenes, null, 12);
  
  // Find the chapter pattern in the file
  const chapterPattern = new RegExp(`(STG 5\\.[0-9]+\\.[0-9]+\\.[0-9]+.*?Chapter ${chapterNumber}.*?summary.*?scene_tone.*?)(\\s*)(}|,)`, 'gs');
  
  console.log(`Processing Chapter ${chapterNumber}: ${chapter.title}`);
  
  // This is a simplified version - in practice, you'd need more sophisticated text processing
  // to handle the JSON structure properly
});

console.log('Script completed. Manual processing may be needed for complex JSON structure.');