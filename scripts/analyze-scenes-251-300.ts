import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Function to recursively extract all scenes from the nested outline structure
function extractAllScenes(obj: any, allScenes: Array<Scene & { chapter_id: string; global_index: number }> = [], currentChapterId: string = ''): Array<Scene & { chapter_id: string; global_index: number }> {
  if (typeof obj !== 'object' || obj === null) {
    return allScenes;
  }

  // Check if this object has a chapter identifier
  let chapterId = currentChapterId;
  if (obj.id && typeof obj.id === 'string' && obj.id.startsWith('EA-')) {
    chapterId = obj.id;
  } else if (obj.unique_identifier && typeof obj.unique_identifier === 'string' && obj.unique_identifier.startsWith('EA-')) {
    chapterId = obj.unique_identifier;
  }

  // Check if this object has scenes array
  if (Array.isArray(obj.scenes)) {
    obj.scenes.forEach((scene: any) => {
      allScenes.push({
        ...scene,
        chapter_id: chapterId,
        global_index: allScenes.length + 1
      });
    });
  }

  // Recurse through all properties
  for (const key in obj) {
    if (key !== 'scenes') { // Avoid processing scenes twice
      extractAllScenes(obj[key], allScenes, chapterId);
    }
  }

  return allScenes;
}

// Read the outline file
const outlinePath = path.join(__dirname, '..', 'data', 'l_outline.json');
const outlineData: any = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

// Extract all scenes with their global index
const allScenes = extractAllScenes(outlineData);
console.log(`Total scenes found: ${allScenes.length}`);

// Extract scenes 251-300
const targetScenes = allScenes.filter(s => s.global_index >= 251 && s.global_index <= 300);

console.log(`Scenes 251-300: ${targetScenes.length} scenes`);

if (targetScenes.length === 0) {
  console.log('No scenes found in range 251-300!');
  process.exit(0);
}

// Function to extract character names from text
function extractCharacters(scene: Scene & { chapter_id: string }): string[] {
  const characters = new Set<string>();

  // Extract POV character from POV field
  if (scene.pov) {
    const povMatch = scene.pov.match(/\(([^)]+)\)/);
    if (povMatch) {
      characters.add(povMatch[1]);
    } else if (!scene.pov.includes('Person')) {
      characters.add(scene.pov);
    }
  }

  // Add from characters array if exists
  if (scene.characters && Array.isArray(scene.characters)) {
    scene.characters.forEach(c => characters.add(c));
  }

  // Common character names to look for
  const knownCharacters = [
    'Francisco', 'Zara', 'Roger', 'Maggie', 'Marcus', 'Kai', 'Elena',
    'Thomas', 'Sarah', 'David', 'Michael', 'Lisa', 'James', 'Amara',
    'Viktor', 'Isabella', 'Chen', 'Olivia', 'Nathan', 'Emma', 'Alex',
    'Sophie', 'Daniel', 'Rachel', 'Liam', 'Grace', 'Ethan', 'Maya',
    'Jordan', 'Chloe', 'Ryan', 'Ava', 'Noah', 'Mia', 'Lucas', 'Aria',
    'Novella', 'Gherardo', 'Dante', 'La Signora', 'Salasa', 'Doge',
    'Council', 'Team', 'Board', 'Temporal Monks', 'Beatrice'
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

// Function to enhance internal conflict with multi-character dynamics
function enhanceInternalConflict(scene: Scene & { chapter_id: string; global_index: number }): string {
  const currentConflict = scene.internal_conflict || scene.internalConflict || '';
  const pov = scene.pov || 'Unknown POV';
  const characters = extractCharacters(scene);
  const title = scene.title || 'Untitled';
  const setup = scene.setup || '';
  const description = scene.description || '';
  const focus = scene.focus || '';

  // Start with current conflict
  let enhanced = currentConflict;

  // If there are multiple characters, enhance with interpersonal dynamics
  if (characters.length > 1) {
    const povChar = characters.find(c => pov.includes(c)) || characters[0];
    const otherChars = characters.filter(c => c !== povChar);

    // Check if conflict already mentions other characters
    const hasCharacterMentions = otherChars.some(c => enhanced.includes(c));

    if (!hasCharacterMentions && enhanced) {
      // Add multi-character context based on scene content
      const allText = `${setup} ${description} ${focus}`.toLowerCase();
      
      let dynamicAddition = '';
      
      // Check for relationship types
      if (allText.includes('team') || allText.includes('group') || allText.includes('together')) {
        dynamicAddition = ` The presence and reactions of ${otherChars.join(' and ')} amplify ${povChar}'s struggle, as their expectations, judgments, and needs add layers of complexity to what might otherwise be a simpler decision.`;
      } else if (allText.includes('conflict') || allText.includes('tension') || allText.includes('disagree')) {
        dynamicAddition = ` ${otherChars.join(' and ')}'s competing perspectives externalize ${povChar}'s internal debate, creating interpersonal tension where each person's struggle amplifies the other's doubts.`;
      } else if (allText.includes('lead') || allText.includes('command') || allText.includes('manage')) {
        dynamicAddition = ` ${povChar} must navigate not only their own internal conflict but also the responsibility for ${otherChars.join(' and ')}, torn between personal needs and leadership demands.`;
      } else if (allText.includes('mentor') || allText.includes('teach') || allText.includes('guide')) {
        dynamicAddition = ` In the presence of ${otherChars.join(' and ')}, ${povChar} confronts the humbling reality of their relative inexperience while simultaneously needing to appear competent and decisive.`;
      } else {
        dynamicAddition = ` The situation forces ${povChar} to reconcile competing values and perspectives, creating internal friction between different aspects of their identity and purpose. The presence and reactions of ${otherChars.join(' and ')} amplify this struggle.`;
      }

      enhanced += dynamicAddition;
    }
  }

  // If conflict is still minimal, build from available data
  if (!enhanced || enhanced.length < 50) {
    const contextParts = [];
    if (focus) contextParts.push(focus);
    if (description) contextParts.push(description);
    if (setup) contextParts.push(setup);

    if (contextParts.length > 0) {
      enhanced = contextParts.join(' ').substring(0, 300);
    }
  }

  return enhanced || `[Scene ${scene.global_index}: ${title}] - Internal conflict details needed. POV: ${pov}`;
}

// Analyze each scene
const analysis: AnalysisResult[] = targetScenes.map(scene => {
  const characters = extractCharacters(scene);
  const pov = scene.pov || 'Unknown';
  const povChar = characters.find(c => pov.includes(c)) || characters[0] || pov;

  return {
    scene_index: scene.global_index,
    chapter_id: scene.chapter_id,
    scene_number: scene.scene_number,
    title: scene.title || 'Untitled',
    pov: pov,
    current_internal_conflict: scene.internal_conflict || scene.internalConflict || '',
    characters_involved: characters,
    proposed_enhanced_conflict: enhanceInternalConflict(scene)
  };
});

// Write the analysis to output file
const outputPath = path.join(__dirname, 'scenes-251-300-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

console.log(`\nAnalysis complete!`);
console.log(`Output written to: ${outputPath}`);
console.log(`\nSummary:`);
console.log(`- Total scenes analyzed: ${analysis.length}`);
console.log(`- Scenes with internal conflicts: ${analysis.filter(a => a.current_internal_conflict).length}`);
console.log(`- Scenes with multiple characters: ${analysis.filter(a => a.characters_involved.length > 1).length}`);

// Character distribution
const allChars = new Set<string>();
analysis.forEach(a => a.characters_involved.forEach(c => allChars.add(c)));
console.log(`- Unique characters involved: ${allChars.size}`);
console.log(`- Characters: ${Array.from(allChars).sort().join(', ')}`);

// Print detailed sample
console.log(`\nDetailed sample scenes:`);
analysis.slice(0, 5).forEach(a => {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Scene ${a.scene_index} (${a.chapter_id}, Scene ${a.scene_number})`);
  console.log(`Title: ${a.title}`);
  console.log(`POV: ${a.pov}`);
  console.log(`Characters: ${a.characters_involved.join(', ')}`);
  console.log(`\nCurrent internal conflict:`);
  console.log(`  ${a.current_internal_conflict}`);
  console.log(`\nProposed enhanced conflict:`);
  console.log(`  ${a.proposed_enhanced_conflict}`);
});

