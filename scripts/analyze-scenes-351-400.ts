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
    if (key !== 'scenes') {
      extractAllScenes(obj[key], allScenes, chapterId);
    }
  }

  return allScenes;
}

const outlinePath = path.join(__dirname, '..', 'data', 'l_outline.json');
const outlineData: any = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

const allScenes = extractAllScenes(outlineData);
console.log(`Total scenes found: ${allScenes.length}`);

const targetScenes = allScenes.filter(s => s.global_index >= 351 && s.global_index <= 400);
console.log(`Scenes 351-400: ${targetScenes.length} scenes`);

if (targetScenes.length === 0) {
  console.log('No scenes found in range 351-400!');
  process.exit(0);
}

function extractCharacters(scene: Scene & { chapter_id: string }): string[] {
  const characters = new Set<string>();

  if (scene.pov) {
    const povMatch = scene.pov.match(/\(([^)]+)\)/);
    if (povMatch) {
      characters.add(povMatch[1]);
    } else if (!scene.pov.includes('Person')) {
      characters.add(scene.pov);
    }
  }

  if (scene.characters && Array.isArray(scene.characters)) {
    scene.characters.forEach(c => characters.add(c));
  }

  const knownCharacters = [
    'Francisco', 'Zara', 'Roger', 'Maggie', 'Marcus', 'Kai', 'Elena',
    'Thomas', 'Sarah', 'David', 'Michael', 'Lisa', 'James', 'Amara',
    'Viktor', 'Isabella', 'Chen', 'Olivia', 'Nathan', 'Emma', 'Alex',
    'Sophie', 'Daniel', 'Rachel', 'Liam', 'Grace', 'Ethan', 'Maya',
    'Jordan', 'Chloe', 'Ryan', 'Ava', 'Noah', 'Mia', 'Lucas', 'Aria',
    'Novella', 'Gherardo', 'Dante', 'La Signora', 'Salasa', 'Doge',
    'Council', 'Team', 'Board', 'Temporal Monks', 'Beatrice', 'Colonna'
  ];

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

function enhanceInternalConflict(scene: Scene & { chapter_id: string; global_index: number }): string {
  const currentConflict = scene.internal_conflict || scene.internalConflict || '';
  const pov = scene.pov || 'Unknown POV';
  const characters = extractCharacters(scene);
  const title = scene.title || 'Untitled';
  const setup = scene.setup || '';
  const description = scene.description || '';
  const focus = scene.focus || '';

  let enhanced = currentConflict;

  if (characters.length > 1) {
    const povChar = characters.find(c => pov.includes(c)) || characters[0];
    const otherChars = characters.filter(c => c !== povChar);
    const hasCharacterMentions = otherChars.some(c => enhanced.includes(c));

    if (!hasCharacterMentions && enhanced) {
      const allText = `${setup} ${description} ${focus}`.toLowerCase();
      let dynamicAddition = '';
      
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

const analysis: AnalysisResult[] = targetScenes.map(scene => {
  const characters = extractCharacters(scene);
  const pov = scene.pov || 'Unknown';

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

const outputPath = path.join(__dirname, 'scenes-351-400-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

console.log(`\nAnalysis complete!`);
console.log(`Output written to: ${outputPath}`);
console.log(`\nSummary:`);
console.log(`- Total scenes analyzed: ${analysis.length}`);
console.log(`- Scenes with internal conflicts: ${analysis.filter(a => a.current_internal_conflict).length}`);
console.log(`- Scenes with multiple characters: ${analysis.filter(a => a.characters_involved.length > 1).length}`);

const allChars = new Set<string>();
analysis.forEach(a => a.characters_involved.forEach(c => allChars.add(c)));
console.log(`- Unique characters involved: ${allChars.size}`);
console.log(`- Characters: ${Array.from(allChars).sort().join(', ')}`);

