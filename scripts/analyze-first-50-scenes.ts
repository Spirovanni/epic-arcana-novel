#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

interface Scene {
  id: string;
  chapter_id: string;
  scene_number: number;
  title: string;
  pov?: string;
  setup?: string;
  description?: string;
  focus?: string;
  internal_conflict?: string;
  characters?: string[];
  [key: string]: any;
}

interface Chapter {
  id: string;
  chapter_number: number;
  scenes?: Scene[];
  [key: string]: any;
}

interface Outline {
  chapters: Chapter[];
  [key: string]: any;
}

interface SceneAnalysis {
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
const outlinePath = path.join(__dirname, '../data/l_outline.json');
const outline: Outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

// Extract all scenes with their chapter info
const allScenes: Array<Scene & { chapter_number: number }> = [];

for (const chapter of outline.chapters) {
  if (chapter.scenes && Array.isArray(chapter.scenes)) {
    for (const scene of chapter.scenes) {
      allScenes.push({
        ...scene,
        chapter_number: chapter.chapter_number,
      });
    }
  }
}

// Sort scenes by chapter number, then scene number
allScenes.sort((a, b) => {
  if (a.chapter_number !== b.chapter_number) {
    return a.chapter_number - b.chapter_number;
  }
  return a.scene_number - b.scene_number;
});

// Take first 50 scenes
const first50Scenes = allScenes.slice(0, 50);

console.log(`Found ${allScenes.length} total scenes`);
console.log(`Processing first ${first50Scenes.length} scenes...`);

// Function to extract character names from text
function extractCharacterNames(text: string): string[] {
  const commonNames = [
    'Francisco', 'Zara', 'Roger', 'Isabella', 'Maya', 'Alex',
    'Elena', 'Marcus', 'Sarah', 'David', 'Emma', 'James',
    'Olivia', 'Lucas', 'Sophia', 'Ethan', 'Ava', 'Noah',
    'Liam', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
    'Thomas', 'Henry', 'Sebastian', 'Victoria', 'Penelope',
    'Dr. Chen', 'Professor Martinez', 'Coach', 'Mentor'
  ];

  const found = new Set<string>();
  const lowerText = text.toLowerCase();

  for (const name of commonNames) {
    if (lowerText.includes(name.toLowerCase())) {
      found.add(name);
    }
  }

  return Array.from(found);
}

// Function to analyze a scene and propose enhanced conflict
function analyzeScene(scene: Scene & { chapter_number: number }, index: number): SceneAnalysis {
  // Combine all text fields for analysis
  const combinedText = [
    scene.setup || '',
    scene.description || '',
    scene.focus || '',
    scene.internal_conflict || ''
  ].join(' ');

  // Extract characters from text
  let charactersInvolved = scene.characters || [];
  if (charactersInvolved.length === 0) {
    charactersInvolved = extractCharacterNames(combinedText);
  }

  // Add POV character if not already in list
  if (scene.pov && !charactersInvolved.includes(scene.pov)) {
    charactersInvolved.unshift(scene.pov);
  }

  // Generate proposed enhanced conflict
  let proposedConflict = scene.internal_conflict || '';

  // If there are multiple characters, enhance the conflict
  if (charactersInvolved.length > 1) {
    // Analyze the scene content to propose enhancements
    const otherCharacters = charactersInvolved.filter(c => c !== scene.pov);

    if (otherCharacters.length > 0 && proposedConflict) {
      // Add context about other characters if the conflict seems limited
      if (!proposedConflict.toLowerCase().includes('others') &&
          !otherCharacters.some(char => proposedConflict.toLowerCase().includes(char.toLowerCase()))) {
        proposedConflict += ` This internal struggle is complicated by interactions with ${otherCharacters.join(', ')}, whose own agendas and perspectives challenge ${scene.pov}'s assumptions and force deeper self-reflection.`;
      }
    }
  }

  // If no conflict exists, propose a basic one
  if (!proposedConflict && scene.pov) {
    proposedConflict = `${scene.pov} grapples with internal tensions arising from the events of this scene, particularly regarding their role and relationships with ${charactersInvolved.filter(c => c !== scene.pov).join(', ') || 'others'}.`;
  }

  return {
    scene_index: index + 1,
    chapter_id: scene.chapter_id,
    scene_number: scene.scene_number,
    title: scene.title || 'Untitled',
    pov: scene.pov || 'Unknown',
    current_internal_conflict: scene.internal_conflict || '',
    characters_involved: charactersInvolved,
    proposed_enhanced_conflict: proposedConflict,
  };
}

// Analyze all first 50 scenes
const analysis: SceneAnalysis[] = first50Scenes.map((scene, index) =>
  analyzeScene(scene, index)
);

// Write the analysis to file
const outputPath = path.join(__dirname, 'first-50-scenes-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

console.log(`\nAnalysis complete!`);
console.log(`Output written to: ${outputPath}`);
console.log(`\nSummary:`);
console.log(`- Total scenes analyzed: ${analysis.length}`);
console.log(`- Scenes with internal conflicts: ${analysis.filter(a => a.current_internal_conflict).length}`);
console.log(`- Scenes with multiple characters: ${analysis.filter(a => a.characters_involved.length > 1).length}`);
console.log(`- Unique POV characters: ${new Set(analysis.map(a => a.pov)).size}`);

// Print first few scenes as preview
console.log(`\nFirst 5 scenes preview:`);
for (let i = 0; i < Math.min(5, analysis.length); i++) {
  const a = analysis[i];
  console.log(`\n${i + 1}. ${a.chapter_id} Scene ${a.scene_number}: ${a.title}`);
  console.log(`   POV: ${a.pov}`);
  console.log(`   Characters: ${a.characters_involved.join(', ')}`);
  console.log(`   Current conflict: ${a.current_internal_conflict.substring(0, 100)}${a.current_internal_conflict.length > 100 ? '...' : ''}`);
}
