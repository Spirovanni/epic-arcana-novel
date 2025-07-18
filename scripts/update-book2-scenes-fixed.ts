import * as fs from 'fs';
import * as path from 'path';

interface Book2Chapter {
  chapter: number;
  title: string;
  summary: string;
  character_arcs?: any;
  story_gaps_addressed?: any;
  location_details?: any;
  series_connections?: any;
}

interface Book2Data {
  structure: Array<{
    section: string;
    chapters: Book2Chapter[];
  }>;
}

interface Scene {
  scene_number: number;
  title: string;
  setup: string;
  symbolism: string;
  beat_goal: string;
}

// Function to split chapter summary into 4 scene setups
function createSceneSetups(summary: string): string[] {
  const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const scenesCount = 4;
  const sentencesPerScene = Math.ceil(sentences.length / scenesCount);
  
  const scenes: string[] = [];
  for (let i = 0; i < scenesCount; i++) {
    const start = i * sentencesPerScene;
    const end = Math.min(start + sentencesPerScene, sentences.length);
    const sceneText = sentences.slice(start, end).join('. ').trim();
    scenes.push(sceneText + (sceneText.endsWith('.') ? '' : '.'));
  }
  
  return scenes;
}

// Function to create simplified scenes for a chapter
function createSimplifiedScenes(chapter: Book2Chapter): Scene[] {
  const sceneSetups = createSceneSetups(chapter.summary);
  
  return sceneSetups.map((setup, index) => ({
    scene_number: index + 1,
    title: `Scene ${index + 1}`,
    setup: setup,
    symbolism: `Symbolic elements of scene ${index + 1}`,
    beat_goal: `Advance the narrative through scene ${index + 1}`
  }));
}

// Function to determine core emotion based on chapter content
function getCoreEmotion(title: string, summary: string): string {
  const content = (title + ' ' + summary).toLowerCase();
  
  if (content.includes('despair') || content.includes('hollow') || content.includes('abandoned')) {
    return 'Despair and emptiness';
  } else if (content.includes('crisis') || content.includes('storm') || content.includes('force')) {
    return 'Urgency and determination';
  } else if (content.includes('willpower') || content.includes('strength') || content.includes('resolve')) {
    return 'Growing strength and resolve';
  } else if (content.includes('thrive') || content.includes('challenge') || content.includes('opportunity')) {
    return 'Confidence and growth';
  } else if (content.includes('journey') || content.includes('adventure') || content.includes('discovery')) {
    return 'Wonder and anticipation';
  } else if (content.includes('patience') || content.includes('wisdom') || content.includes('contemplation')) {
    return 'Contemplation and patience';
  } else if (content.includes('conflict') || content.includes('betrayal') || content.includes('enemy')) {
    return 'Tension and conflict';
  } else if (content.includes('hope') || content.includes('optimism') || content.includes('unity')) {
    return 'Hope and determination';
  } else if (content.includes('fear') || content.includes('danger') || content.includes('threat')) {
    return 'Fear and courage';
  } else if (content.includes('love') || content.includes('loyalty') || content.includes('friendship')) {
    return 'Love and connection';
  } else {
    return 'Mixed emotions and growth';
  }
}

// Function to determine scene tone based on chapter content
function getSceneTone(title: string, summary: string): string {
  const content = (title + ' ' + summary).toLowerCase();
  
  if (content.includes('crisis') || content.includes('storm') || content.includes('danger')) {
    return 'Tense and dramatic';
  } else if (content.includes('peaceful') || content.includes('contemplation') || content.includes('reflection')) {
    return 'Calm and reflective';
  } else if (content.includes('discovery') || content.includes('wonder') || content.includes('journey')) {
    return 'Mysterious and adventurous';
  } else if (content.includes('conflict') || content.includes('battle') || content.includes('fight')) {
    return 'Intense and action-packed';
  } else if (content.includes('hope') || content.includes('triumph') || content.includes('success')) {
    return 'Uplifting and inspiring';
  } else if (content.includes('despair') || content.includes('loss') || content.includes('grief')) {
    return 'Melancholic and introspective';
  } else {
    return 'Varied and dynamic';
  }
}

async function updateBook2Scenes() {
  try {
    // Read the Book 2 outline data
    const book2Path = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/json/storyline/Book_2_Temporal_Express_Outline.json';
    const book2Data: Book2Data = JSON.parse(fs.readFileSync(book2Path, 'utf8'));
    
    // Read the main outline file
    const outlinePath = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/l_outline.json';
    const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));
    
    // Extract all chapters from Book 2 data
    const allChapters: Book2Chapter[] = [];
    book2Data.structure.forEach(section => {
      allChapters.push(...section.chapters);
    });
    
    console.log(`Found ${allChapters.length} chapters in Book 2`);
    
    // Create a sequential mapping of STG patterns to chapter numbers
    const stgToChapterMap = new Map<string, number>();
    let chapterCounter = 1;
    
    // Generate STG patterns for all 40 chapters
    for (let taskMaster = 1; taskMaster <= 2; taskMaster++) {
      for (let majorGroup = 1; majorGroup <= (taskMaster === 1 ? 4 : 9); majorGroup++) {
        for (let specificGroup = 1; specificGroup <= 3; specificGroup++) {
          if (chapterCounter <= 40) {
            const stgPattern = `STG 2.${taskMaster}.${majorGroup}.${specificGroup}`;
            stgToChapterMap.set(stgPattern, chapterCounter);
            chapterCounter++;
          }
        }
      }
    }
    
    console.log(`Created mapping for ${stgToChapterMap.size} STG patterns`);
    
    // Create a map of chapter number to chapter data
    const chapterDataMap = new Map<number, Book2Chapter>();
    allChapters.forEach(chapter => {
      chapterDataMap.set(chapter.chapter, chapter);
    });
    
    // Function to recursively find and update Book 2 chapters
    function updateChapterInObject(obj: any, path: string = ''): number {
      let updatedCount = 0;
      
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          const currentPath = path ? `${path}.${key}` : key;
          
          if (typeof value === 'object' && value !== null) {
            // Check if this is a Book 2 chapter
            if (value.unique_identifier && typeof value.unique_identifier === 'string') {
              const stgPattern = value.unique_identifier;
              const chapterNum = stgToChapterMap.get(stgPattern);
              
              if (chapterNum && chapterDataMap.has(chapterNum)) {
                const chapterData = chapterDataMap.get(chapterNum)!;
                
                console.log(`Updating STG ${stgPattern} -> Chapter ${chapterNum}: ${chapterData.title}`);
                
                // Create simplified scenes structure
                const scenes = createSimplifiedScenes(chapterData);
                
                // Add scenes and other properties to the chapter
                value.scenes = scenes;
                value.pov = "3rd Person Limited";
                value.tense = "Past Tense";
                value.core_emotion = getCoreEmotion(chapterData.title, chapterData.summary);
                value.scene_tone = getSceneTone(chapterData.title, chapterData.summary);
                
                // Update existing character_arcs, story_gaps_addressed, location_details, series_connections
                if (chapterData.character_arcs) {
                  value.character_arcs = chapterData.character_arcs;
                }
                if (chapterData.story_gaps_addressed) {
                  value.story_gaps_addressed = chapterData.story_gaps_addressed;
                }
                if (chapterData.location_details) {
                  value.location_details = chapterData.location_details;
                }
                if (chapterData.series_connections) {
                  value.series_connections = chapterData.series_connections;
                }
                
                updatedCount++;
              }
            }
            
            // Recursively process nested objects
            updatedCount += updateChapterInObject(value, currentPath);
          }
        }
      }
      
      return updatedCount;
    }
    
    // Update all Book 2 chapters
    const totalUpdated = updateChapterInObject(outlineData);
    console.log(`Updated ${totalUpdated} chapters total`);
    
    // Write the updated outline back to file
    fs.writeFileSync(outlinePath, JSON.stringify(outlineData, null, 2));
    console.log('Successfully updated l_outline.json with Book 2 simplified scenes');
    
  } catch (error) {
    console.error('Error updating Book 2 scenes:', error);
  }
}

// Run the update
updateBook2Scenes();