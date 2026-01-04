import * as fs from 'fs';
import * as path from 'path';

interface Scene {
  scene_number: number;
  title?: string;
  setup?: string;
  description?: string;
  focus?: string;
  pov?: string;
  internal_conflict?: string;
  internalConflict?: string;
  characters?: string[];
  [key: string]: any;
}

interface Chapter {
  chapter_id: string;
  scenes: Scene[];
  [key: string]: any;
}

interface Outline {
  chapters: Chapter[];
  [key: string]: any;
}

// Read the outline file
const outlinePath = path.join(__dirname, '..', 'data', 'l_outline.json');
const outlineData: Outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

// Extract all scenes with their chapter context
interface SceneWithContext {
  scene_index: number;
  chapter_id: string;
  scene_number: number;
  title: string;
  pov: string;
  setup: string;
  description: string;
  focus: string;
  current_internal_conflict: string;
  characters_involved: string[];
  scene_data: Scene;
}

const allScenes: SceneWithContext[] = [];

// Collect all scenes from all chapters
outlineData.chapters.forEach((chapter: Chapter) => {
  if (chapter.scenes && Array.isArray(chapter.scenes)) {
    chapter.scenes.forEach((scene: Scene) => {
      const sceneWithContext: SceneWithContext = {
        scene_index: 0, // Will be set after sorting
        chapter_id: chapter.chapter_id || '',
        scene_number: scene.scene_number || 0,
        title: scene.title || '',
        pov: scene.pov || '',
        setup: scene.setup || '',
        description: scene.description || '',
        focus: scene.focus || '',
        current_internal_conflict: scene.internal_conflict || scene.internalConflict || '',
        characters_involved: scene.characters || [],
        scene_data: scene
      };
      allScenes.push(sceneWithContext);
    });
  }
});

// Sort scenes by chapter ID (EA-XXX) and then by scene number
allScenes.sort((a, b) => {
  // Extract chapter number from EA-XXX format
  const getChapterNum = (id: string) => {
    const match = id.match(/EA-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const chapterA = getChapterNum(a.chapter_id);
  const chapterB = getChapterNum(b.chapter_id);

  if (chapterA !== chapterB) {
    return chapterA - chapterB;
  }

  return a.scene_number - b.scene_number;
});

// Assign scene indices
allScenes.forEach((scene, index) => {
  scene.scene_index = index + 1;
});

// Extract scenes 51-100
const scenes51to100 = allScenes.slice(50, 100); // 0-indexed, so 50-99

console.log(`Total scenes in outline: ${allScenes.length}`);
console.log(`Extracting scenes 51-100 (${scenes51to100.length} scenes)`);

// Save the extracted scenes for analysis
const outputPath = path.join(__dirname, 'scenes-51-100-raw.json');
fs.writeFileSync(outputPath, JSON.stringify(scenes51to100, null, 2));

console.log(`Saved raw scenes to: ${outputPath}`);
console.log('\nFirst scene:');
console.log(`  Scene ${scenes51to100[0]?.scene_index}: ${scenes51to100[0]?.chapter_id} - ${scenes51to100[0]?.title}`);
console.log('\nLast scene:');
console.log(`  Scene ${scenes51to100[scenes51to100.length - 1]?.scene_index}: ${scenes51to100[scenes51to100.length - 1]?.chapter_id} - ${scenes51to100[scenes51to100.length - 1]?.title}`);
