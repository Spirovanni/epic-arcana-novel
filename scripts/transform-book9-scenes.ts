import fs from 'fs';
import path from 'path';

interface Book9Chapter {
  chapter: number;
  scene: number;
  plot: string;
  title: string;
  epic_pages: string;
  epic_focus: string;
  summary: string;
  character_arcs: Record<string, string>;
  story_gaps_addressed: Record<string, string>;
  location_details: Record<string, string>;
  series_connections: Record<string, string>;
}

interface Book9Outline {
  title: string;
  subtitle: string;
  thematic_focus: string;
  key_arcana: string[];
  primary_objective: string;
  structure: Array<{
    section: string;
    chapters: Book9Chapter[];
  }>;
}

interface Scene {
  scene_number: number;
  title: string;
  setup: string;
  symbolism: string;
  beat_goal: string;
}

interface ChapterScenes {
  pov: string;
  tense: string;
  core_emotion: string;
  scene_tone: string;
  scenes: Scene[];
}

function splitSummaryIntoScenes(summary: string): string[] {
  // Split the summary into approximately 4 equal parts
  const sentences = summary.split(/(?<=[.!?])\s+/);
  const scenesCount = 4;
  const sentencesPerScene = Math.ceil(sentences.length / scenesCount);
  
  const scenes: string[] = [];
  for (let i = 0; i < scenesCount; i++) {
    const start = i * sentencesPerScene;
    const end = Math.min(start + sentencesPerScene, sentences.length);
    const sceneText = sentences.slice(start, end).join(' ').trim();
    if (sceneText) {
      scenes.push(sceneText);
    }
  }
  
  // Ensure we have exactly 4 scenes
  while (scenes.length < 4) {
    scenes.push("Continue the chapter's narrative progression.");
  }
  
  return scenes.slice(0, 4);
}

function createScenesStructure(chapter: Book9Chapter): ChapterScenes {
  const sceneSetups = splitSummaryIntoScenes(chapter.summary);
  
  const scenes: Scene[] = sceneSetups.map((setup, index) => ({
    scene_number: index + 1,
    title: `Scene ${index + 1}`,
    setup: setup,
    symbolism: "Symbolic elements representing Francisco's cosmic transformation and universal revitalization",
    beat_goal: "Advance Francisco's journey toward ultimate cosmic mastery and universal harmony"
  }));

  return {
    pov: "3rd Person Limited",
    tense: "Past Tense", 
    core_emotion: "Cosmic transcendence and universal responsibility",
    scene_tone: "Epic and transformative",
    scenes: scenes
  };
}

function determineChapterCoreEmotion(chapter: Book9Chapter): string {
  const title = chapter.title.toLowerCase();
  
  if (title.includes('recognition') || title.includes('reality')) return "Awareness and revelation";
  if (title.includes('perseverance') || title.includes('conflict')) return "Determination amid challenge";
  if (title.includes('explorative') || title.includes('exploration')) return "Curiosity and discovery";
  if (title.includes('rest') || title.includes('regenerative')) return "Renewal and restoration";
  if (title.includes('summon') || title.includes('steadfast')) return "Resolve and commitment";
  if (title.includes('grief') || title.includes('growth')) return "Processing and healing";
  if (title.includes('consistency') || title.includes('chaos')) return "Stability amid turbulence";
  if (title.includes('integrity') || title.includes('reliability')) return "Trust and honor";
  if (title.includes('strength') || title.includes('great')) return "Power and fortitude";
  if (title.includes('action') || title.includes('decisive')) return "Urgency and purpose";
  if (title.includes('emotional') || title.includes('dynamics')) return "Connection and understanding";
  if (title.includes('apex') || title.includes('achievement')) return "Triumph and accomplishment";
  if (title.includes('authority') || title.includes('tribal')) return "Leadership and unity";
  if (title.includes('discovery') || title.includes('savage')) return "Innovation and breakthrough";
  if (title.includes('building') || title.includes('realm')) return "Creation and foundation";
  if (title.includes('belief') || title.includes('outdated')) return "Transformation and release";
  if (title.includes('value') || title.includes('intrinsic')) return "Worth and dignity";
  if (title.includes('respect') || title.includes('leadership')) return "Honor and guidance";
  if (title.includes('conflict') || title.includes('healthy')) return "Productive tension";
  if (title.includes('learning') || title.includes('breakthrough')) return "Enlightenment and growth";
  if (title.includes('setbacks') || title.includes('progress')) return "Resilience and advancement";
  if (title.includes('performance') || title.includes('peak')) return "Excellence and mastery";
  if (title.includes('creativity') || title.includes('structured')) return "Innovation and order";
  if (title.includes('mental') || title.includes('deliberate')) return "Focus and discipline";
  if (title.includes('resource') || title.includes('attraction')) return "Abundance and prosperity";
  if (title.includes('creative') || title.includes('potential')) return "Possibility and innovation";
  if (title.includes('synchronized') || title.includes('operations')) return "Harmony and coordination";
  if (title.includes('spiritual') || title.includes('growth')) return "Transcendence and fulfillment";
  if (title.includes('friendship') || title.includes('lasting')) return "Connection and loyalty";
  if (title.includes('defeat') || title.includes('transformation')) return "Resilience and evolution";
  if (title.includes('vulnerability') || title.includes('bold')) return "Courage and authenticity";
  if (title.includes('distress') || title.includes('emotion')) return "Stability and guidance";
  if (title.includes('decision') || title.includes('charge')) return "Authority and wisdom";
  if (title.includes('choice') || title.includes('better')) return "Wisdom and optimization";
  if (title.includes('present') || title.includes('peace')) return "Serenity and mindfulness";
  if (title.includes('vision') || title.includes('cosmic')) return "Clarity and foresight";
  if (title.includes('letting') || title.includes('go')) return "Release and transition";
  if (title.includes('conscious') || title.includes('decision')) return "Awareness and intention";
  if (title.includes('competition') || title.includes('upper')) return "Strategy and collaboration";
  if (title.includes('meaning') || title.includes('purpose')) return "Significance and fulfillment";
  
  return "Cosmic transcendence and universal responsibility";
}

function determineSceneTone(chapter: Book9Chapter): string {
  const focus = chapter.epic_focus.toLowerCase();
  const title = chapter.title.toLowerCase();
  
  if (focus.includes('opening') || focus.includes('image')) return "Majestic and foundational";
  if (focus.includes('set-up') || focus.includes('setup')) return "Building and anticipatory";
  if (focus.includes('inciting') || focus.includes('incident')) return "Catalytic and transformative";
  if (focus.includes('reaction')) return "Responsive and adaptive";
  if (focus.includes('call') || focus.includes('adventure')) return "Inspiring and challenging";
  if (focus.includes('action')) return "Dynamic and purposeful";
  if (focus.includes('consequence')) return "Significant and impactful";
  if (focus.includes('pinch')) return "Intense and focused";
  if (focus.includes('midpoint')) return "Pivotal and revelatory";
  if (focus.includes('reversal')) return "Transformative and empowering";
  if (focus.includes('climax')) return "Ultimate and triumphant";
  if (focus.includes('resolution')) return "Harmonious and complete";
  if (focus.includes('finale')) return "Epic and conclusive";
  
  if (title.includes('conflict') || title.includes('chaos')) return "Intense and challenging";
  if (title.includes('peace') || title.includes('harmony')) return "Serene and balanced";
  if (title.includes('discovery') || title.includes('breakthrough')) return "Revelatory and exciting";
  if (title.includes('triumph') || title.includes('success')) return "Victorious and celebratory";
  
  return "Epic and transcendent";
}

async function main() {
  try {
    console.log('Starting Book 9 transformation...');
    
    // Read the Book 9 outline
    const book9OutlinePath = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/json/storyline/Book_9_Blades_of_Triumph_Outline.json';
    const book9Data: Book9Outline = JSON.parse(fs.readFileSync(book9OutlinePath, 'utf8'));
    
    // Read the main outline
    const outlinePath = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/l_outline.json';
    const outlineData = JSON.parse(fs.readFileSync(outlinePath, 'utf8'));
    
    console.log(`Found ${book9Data.structure.reduce((acc, section) => acc + section.chapters.length, 0)} chapters in Book 9`);
    
    // Extract all Book 9 chapters from the outline
    const allBook9Chapters: Book9Chapter[] = [];
    book9Data.structure.forEach(section => {
      allBook9Chapters.push(...section.chapters);
    });
    
    console.log(`Processing ${allBook9Chapters.length} Book 9 chapters...`);
    
    // Track transformations made
    let transformationsMade = 0;
    
    // For each Book 9 chapter, find the corresponding entry in l_outline.json and update it
    for (const chapter of allBook9Chapters) {
      const chapterNumber = chapter.chapter;
      
      // Find the chapter in the outline data
      function findAndUpdateChapter(obj: any): boolean {
        if (typeof obj !== 'object' || obj === null) return false;
        
        for (const key in obj) {
          if (key === 'unique_identifier' && typeof obj[key] === 'string' && obj[key].includes(`STG 9.`) && obj.chapter === `Chapter ${chapterNumber}`) {
            // Found the chapter, update it with scenes structure
            const scenesData = createScenesStructure(chapter);
            
            // Add the scenes structure to the chapter
            obj.pov = scenesData.pov;
            obj.tense = scenesData.tense;
            obj.core_emotion = determineChapterCoreEmotion(chapter);
            obj.scene_tone = determineSceneTone(chapter);
            obj.scenes = scenesData.scenes;
            
            // Add chapter-level data from Book 9 outline
            obj.character_arcs = chapter.character_arcs;
            obj.story_gaps_addressed = chapter.story_gaps_addressed;
            obj.location_details = chapter.location_details;
            obj.series_connections = chapter.series_connections;
            
            console.log(`✓ Updated Chapter ${chapterNumber}: ${chapter.title}`);
            transformationsMade++;
            return true;
          }
          
          if (findAndUpdateChapter(obj[key])) {
            return true;
          }
        }
        return false;
      }
      
      if (!findAndUpdateChapter(outlineData)) {
        console.log(`⚠ Could not find Chapter ${chapterNumber} in outline`);
      }
    }
    
    // Write the updated outline back to file
    fs.writeFileSync(outlinePath, JSON.stringify(outlineData, null, 2));
    
    console.log(`\n✅ Book 9 transformation complete!`);
    console.log(`📊 Transformations made: ${transformationsMade}/${allBook9Chapters.length} chapters`);
    console.log(`📝 Updated file: ${outlinePath}`);
    
  } catch (error) {
    console.error('❌ Error during transformation:', error);
    process.exit(1);
  }
}

// Run the main function
main();