import * as fs from 'fs';
import * as path from 'path';

interface Scene {
  scene_number: number;
  chapter_id: string;
  title?: string;
  pov?: string;
  setup?: string;
  description?: string;
  focus?: string;
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

interface AnalysisResult {
  scene_index: number;
  chapter_id: string;
  scene_number: number;
  title: string;
  pov: string;
  current_internal_conflict: string;
  characters_involved: string[];
  proposed_enhanced_conflict: string;
}

// Read the outline file
const outlinePath = path.join(__dirname, '..', 'data', 'l_outline.json');
const outlineData: Outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

// Extract all scenes with their global index
const allScenes: Array<Scene & { chapter_id: string; global_index: number }> = [];
let globalIndex = 0;

for (const chapter of outlineData.chapters) {
  if (chapter.scenes && Array.isArray(chapter.scenes)) {
    for (const scene of chapter.scenes) {
      globalIndex++;
      allScenes.push({
        ...scene,
        chapter_id: chapter.chapter_id,
        global_index: globalIndex
      });
    }
  }
}

console.log(`Total scenes found: ${allScenes.length}`);

// Extract scenes 151-200
const targetScenes = allScenes.filter(s => s.global_index >= 151 && s.global_index <= 200);

console.log(`Scenes 151-200: ${targetScenes.length} scenes`);

// Function to extract character names from text
function extractCharacters(scene: Scene & { chapter_id: string }): string[] {
  const characters = new Set<string>();

  // Add POV character
  if (scene.pov) {
    characters.add(scene.pov);
  }

  // Add from characters array if exists
  if (scene.characters && Array.isArray(scene.characters)) {
    scene.characters.forEach(c => characters.add(c));
  }

  // Common character names to look for
  const knownCharacters = [
    'Francisco', 'Zara', 'Roger', 'Maggie', 'Marcus', 'Kai', 'Elena',
    'Thomas', 'Sarah', 'David', 'Michael', 'Lisa', 'James', 'Amara',
    'Viktor', 'Isabella', 'Chen', 'Olivia', 'Nathan', 'Emma'
  ];

  // Search in text fields
  const textFields = [
    scene.setup || '',
    scene.description || '',
    scene.focus || '',
    scene.title || '',
    scene.internal_conflict || '',
    scene.internalConflict || ''
  ].join(' ');

  knownCharacters.forEach(name => {
    if (textFields.includes(name)) {
      characters.add(name);
    }
  });

  return Array.from(characters);
}

// Function to enhance internal conflict
function enhanceInternalConflict(scene: Scene & { chapter_id: string; global_index: number }): string {
  const currentConflict = scene.internal_conflict || scene.internalConflict || '';
  const pov = scene.pov || 'Unknown POV';
  const characters = extractCharacters(scene);

  // If there's already a detailed conflict, use it as base
  if (currentConflict && currentConflict.length > 100) {
    // Check if it already mentions other characters
    const hasOtherCharacters = characters.some(c =>
      c !== pov && currentConflict.includes(c)
    );

    if (hasOtherCharacters) {
      return currentConflict;
    }
  }

  // Build enhanced conflict based on available information
  const setup = scene.setup || '';
  const description = scene.description || '';
  const focus = scene.focus || '';
  const title = scene.title || '';

  let enhanced = currentConflict || '';

  // Add context from other fields if conflict is minimal
  if (enhanced.length < 50) {
    const contextParts = [];

    if (focus) contextParts.push(focus);
    if (description) contextParts.push(description);
    if (setup) contextParts.push(setup);

    if (contextParts.length > 0) {
      enhanced = contextParts.join(' ').substring(0, 300);
    }
  }

  // Add character interaction context if multiple characters are present
  if (characters.length > 1) {
    const otherCharacters = characters.filter(c => c !== pov);
    if (otherCharacters.length > 0 && !enhanced.includes(otherCharacters[0])) {
      enhanced += ` [Involves interactions with: ${otherCharacters.join(', ')}]`;
    }
  }

  return enhanced || `[Scene ${scene.global_index}: ${title}] - Internal conflict details needed`;
}

// Analyze each scene
const analysis: AnalysisResult[] = targetScenes.map(scene => {
  const characters = extractCharacters(scene);

  return {
    scene_index: scene.global_index,
    chapter_id: scene.chapter_id,
    scene_number: scene.scene_number,
    title: scene.title || 'Untitled',
    pov: scene.pov || 'Unknown',
    current_internal_conflict: scene.internal_conflict || scene.internalConflict || '',
    characters_involved: characters,
    proposed_enhanced_conflict: enhanceInternalConflict(scene)
  };
});

// Write the analysis to output file
const outputPath = path.join(__dirname, 'scenes-151-200-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

console.log(`\nAnalysis complete!`);
console.log(`Output written to: ${outputPath}`);
console.log(`\nSummary:`);
console.log(`- Total scenes analyzed: ${analysis.length}`);
console.log(`- Scenes with internal conflicts: ${analysis.filter(a => a.current_internal_conflict).length}`);
console.log(`- Scenes with multiple characters: ${analysis.filter(a => a.characters_involved.length > 1).length}`);

// Print sample
console.log(`\nSample scenes:`);
analysis.slice(0, 3).forEach(a => {
  console.log(`\nScene ${a.scene_index} (${a.chapter_id}, Scene ${a.scene_number})`);
  console.log(`  Title: ${a.title}`);
  console.log(`  POV: ${a.pov}`);
  console.log(`  Characters: ${a.characters_involved.join(', ')}`);
  console.log(`  Current conflict: ${a.current_internal_conflict.substring(0, 100)}...`);
});
