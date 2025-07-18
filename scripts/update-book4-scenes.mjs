import * as fs from 'fs';

// Function to split summary into 4 logical parts
function splitSummaryIntoScenes(summary) {
  const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const totalSentences = sentences.length;
  
  if (totalSentences <= 4) {
    // If 4 or fewer sentences, each becomes a scene
    return sentences.map(s => s.trim() + '.');
  }
  
  // Divide sentences into 4 roughly equal parts
  const sceneLengths = [
    Math.ceil(totalSentences * 0.25),
    Math.ceil(totalSentences * 0.25),
    Math.ceil(totalSentences * 0.25),
    totalSentences - Math.ceil(totalSentences * 0.75)
  ];
  
  const scenes = [];
  let currentIndex = 0;
  
  for (let i = 0; i < 4; i++) {
    const sceneLength = sceneLengths[i];
    const sceneSentences = sentences.slice(currentIndex, currentIndex + sceneLength);
    scenes.push(sceneSentences.join('. ').trim() + '.');
    currentIndex += sceneLength;
  }
  
  return scenes;
}

// Function to determine core emotion based on chapter content
function determineCoreEmotion(title, summary) {
  const content = (title + ' ' + summary).toLowerCase();
  
  if (content.includes('despair') || content.includes('abyss') || content.includes('dark')) {
    return 'Despair and uncertainty';
  } else if (content.includes('hope') || content.includes('triumph') || content.includes('success')) {
    return 'Hope and determination';
  } else if (content.includes('conflict') || content.includes('confrontation') || content.includes('battle')) {
    return 'Tension and conflict';
  } else if (content.includes('discovery') || content.includes('revelation') || content.includes('breakthrough')) {
    return 'Wonder and revelation';
  } else if (content.includes('love') || content.includes('compassion') || content.includes('connection')) {
    return 'Love and connection';
  } else if (content.includes('fear') || content.includes('anxiety') || content.includes('doubt')) {
    return 'Fear and doubt';
  } else {
    return 'Tension and conflict'; // Default
  }
}

// Function to determine scene tone based on chapter content
function determineSceneTone(title, summary) {
  const content = (title + ' ' + summary).toLowerCase();
  
  if (content.includes('calm') || content.includes('peaceful') || content.includes('serene')) {
    return 'Contemplative and serene';
  } else if (content.includes('urgent') || content.includes('action') || content.includes('battle')) {
    return 'Intense and urgent';
  } else if (content.includes('mystery') || content.includes('secret') || content.includes('hidden')) {
    return 'Mysterious and intriguing';
  } else if (content.includes('triumph') || content.includes('victory') || content.includes('success')) {
    return 'Triumphant and inspiring';
  } else if (content.includes('dark') || content.includes('shadow') || content.includes('evil')) {
    return 'Dark and foreboding';
  } else {
    return 'Dramatic and intense'; // Default
  }
}

// Function to create scenes for a chapter
function createScenesForChapter(chapter) {
  const sceneSetups = splitSummaryIntoScenes(chapter.summary);
  const coreEmotion = determineCoreEmotion(chapter.title, chapter.summary);
  const sceneTone = determineSceneTone(chapter.title, chapter.summary);
  
  return sceneSetups.map((setup, index) => ({
    scene_number: index + 1,
    title: `Scene ${index + 1}`,
    setup: setup,
    symbolism: `Symbolic elements of scene ${index + 1}`,
    beat_goal: `Advance the narrative through scene ${index + 1}`,
    pov: "3rd Person Limited",
    tense: "Past Tense",
    core_emotion: coreEmotion,
    scene_tone: sceneTone
  }));
}

// Main function to process Book 4 data
function processBook4Data() {
  const book4Path = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/json/storyline/Book_4_Tome_of_Fates_Outline.json';
  const book4Data = JSON.parse(fs.readFileSync(book4Path, 'utf-8'));
  
  const chapterScenesMap = new Map();
  
  // Process all chapters from both sections
  book4Data.structure.forEach(section => {
    section.chapters.forEach(chapter => {
      const scenes = createScenesForChapter(chapter);
      chapterScenesMap.set(chapter.chapter, scenes);
    });
  });
  
  return chapterScenesMap;
}

// Function to update l_outline.json with scenes
function updateOutlineWithScenes() {
  const outlinePath = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/l_outline.json';
  const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));
  
  const chapterScenesMap = processBook4Data();
  
  console.log(`Processing ${chapterScenesMap.size} chapters for Book 4`);
  
  let updatedCount = 0;
  
  // Function to recursively find and update Book 4 chapters
  function updateChapterScenes(obj, currentPath = '') {
    if (typeof obj !== 'object' || obj === null) return;
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => updateChapterScenes(item, `${currentPath}[${index}]`));
    } else {
      for (const key in obj) {
        if (key === 'unique_identifier' && typeof obj[key] === 'string' && obj[key].startsWith('STG 4.')) {
          // Found a Book 4 chapter
          const chapter = obj.chapter;
          if (chapter && typeof chapter === 'string') {
            const chapterNumber = parseInt(chapter.replace('Chapter ', ''));
            if (chapterScenesMap.has(chapterNumber)) {
              const scenes = chapterScenesMap.get(chapterNumber);
              obj.scenes = scenes;
              updatedCount++;
              console.log(`Updated ${obj.unique_identifier} (${chapter}) with ${scenes.length} scenes`);
            }
          }
        } else {
          updateChapterScenes(obj[key], `${currentPath}.${key}`);
        }
      }
    }
  }
  
  updateChapterScenes(outlineData);
  
  // Write the updated outline back to file
  fs.writeFileSync(outlinePath, JSON.stringify(outlineData, null, 2));
  console.log(`Successfully updated l_outline.json with Book 4 scenes. Updated ${updatedCount} chapters.`);
}

// Run the update
try {
  updateOutlineWithScenes();
  console.log('Book 4 scenes update completed successfully!');
} catch (error) {
  console.error('Error updating Book 4 scenes:', error);
}