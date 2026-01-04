const fs = require('fs');

// Read the raw scenes data
const rawScenes = JSON.parse(fs.readFileSync('/tmp/scenes_101_150_raw.json', 'utf8'));

// Function to extract character names from text
function extractCharacters(scene) {
  const characters = new Set();

  // Add POV character
  if (scene.pov) {
    characters.add(scene.pov);
  }

  // Check characters array if it exists
  if (scene.characters && Array.isArray(scene.characters)) {
    scene.characters.forEach(c => {
      if (typeof c === 'string') {
        characters.add(c);
      } else if (c && c.name) {
        characters.add(c.name);
      }
    });
  }

  // Extract from setup, description, focus
  const text = [
    scene.setup || '',
    scene.description || '',
    scene.focus || ''
  ].join(' ');

  // Common character names to look for
  const namePatterns = [
    'Francisco', 'Zara', 'Roger', 'Elise', 'Marcus', 'Sarah',
    'Elena', 'David', 'Michael', 'Julia', 'Carlos', 'Ana',
    'Thomas', 'Lisa', 'James', 'Maria', 'Robert', 'Jennifer',
    'William', 'Patricia', 'Richard', 'Linda', 'Joseph', 'Barbara',
    'Charles', 'Elizabeth', 'Christopher', 'Susan', 'Daniel', 'Jessica',
    'Matthew', 'Karen', 'Anthony', 'Nancy', 'Mark', 'Betty',
    'Donald', 'Helen', 'Steven', 'Sandra', 'Paul', 'Donna',
    'Andrew', 'Carol', 'Joshua', 'Ruth', 'Kenneth', 'Sharon',
    'Kevin', 'Michelle', 'Brian', 'Laura', 'George', 'Sarah',
    'Edward', 'Kimberly', 'Ronald', 'Deborah', 'Timothy', 'Amy',
    'Jason', 'Angela', 'Jeffrey', 'Melissa', 'Ryan', 'Brenda'
  ];

  namePatterns.forEach(name => {
    const regex = new RegExp('\\b' + name + '\\b', 'gi');
    if (regex.test(text)) {
      characters.add(name);
    }
  });

  return Array.from(characters);
}

// Function to generate enhanced internal conflict
function generateEnhancedConflict(scene, characters) {
  const pov = scene.pov || 'the protagonist';
  const currentConflict = scene.internal_conflict || '';

  // Analyze the scene content
  const text = [
    scene.setup || '',
    scene.description || '',
    scene.focus || ''
  ].join(' ').toLowerCase();

  let enhanced = currentConflict;

  // If there's already a conflict, we'll enhance it
  // Otherwise, we'll create one based on the scene content

  if (!currentConflict || currentConflict.trim() === '') {
    // Generate a new conflict based on scene content
    if (text.includes('leadership') || text.includes('lead')) {
      enhanced = `${pov} struggles with self-doubt about their leadership abilities`;
    } else if (text.includes('decision') || text.includes('choose')) {
      enhanced = `${pov} faces internal turmoil over difficult choices`;
    } else if (text.includes('trust') || text.includes('betray')) {
      enhanced = `${pov} battles with trust issues and fear of betrayal`;
    } else if (text.includes('fear') || text.includes('afraid')) {
      enhanced = `${pov} confronts deep-seated fears and anxieties`;
    } else if (text.includes('conflict') || text.includes('tension')) {
      enhanced = `${pov} navigates internal tension and conflicting values`;
    } else {
      enhanced = `${pov} grapples with personal challenges and growth`;
    }
  }

  // Enhance with other character conflicts if multiple characters present
  if (characters.length > 1) {
    const otherChars = characters.filter(c => c !== pov);

    if (otherChars.length > 0) {
      // Look for relationship indicators
      if (text.includes('mentor') || text.includes('guide')) {
        enhanced += `, complicated by tension with their mentor ${otherChars[0]} whose methods challenge their beliefs`;
      } else if (text.includes('team') || text.includes('group') || text.includes('collaborate')) {
        enhanced += `, while navigating team dynamics and conflicting priorities among ${otherChars.slice(0, 2).join(' and ')}`;
      } else if (text.includes('oppose') || text.includes('disagree') || text.includes('argument')) {
        enhanced += `, intensified by disagreement with ${otherChars[0]} over the best path forward`;
      } else if (text.includes('relationship') || text.includes('romance') || text.includes('love')) {
        enhanced += `, further complicated by evolving feelings toward ${otherChars[0]} that challenge professional boundaries`;
      } else if (text.includes('rival') || text.includes('competition')) {
        enhanced += `, exacerbated by competitive tension with ${otherChars[0]} that forces self-examination`;
      } else if (otherChars.length >= 2) {
        enhanced += `, complicated by interpersonal tensions between ${otherChars[0]} and ${otherChars[1]} that force ${pov} to navigate conflicting loyalties`;
      } else if (otherChars.length === 1) {
        enhanced += `, while ${otherChars[0]}'s contrasting approach highlights ${pov}'s internal doubts`;
      }
    }
  }

  return enhanced;
}

// Process each scene
const analysis = rawScenes.map((scene, index) => {
  const sceneIndex = 101 + index;
  const characters = extractCharacters(scene);

  return {
    scene_index: sceneIndex,
    chapter_id: scene.chapter_id,
    scene_number: scene.scene_number,
    title: scene.title || `Scene ${scene.scene_number}`,
    pov: scene.pov || 'Unknown',
    current_internal_conflict: scene.internal_conflict || '',
    characters_involved: characters,
    proposed_enhanced_conflict: generateEnhancedConflict(scene, characters)
  };
});

// Write the analysis to the output file
const outputPath = '/Users/xaviermartinez/dev/cursor/epic-arcana-novel/scripts/scenes-101-150-analysis.json';
fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2), 'utf8');

console.log(`Analysis complete! Processed ${analysis.length} scenes.`);
console.log(`Output written to: ${outputPath}`);
