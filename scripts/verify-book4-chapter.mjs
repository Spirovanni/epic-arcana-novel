import * as fs from 'fs';

const outline = JSON.parse(fs.readFileSync('/Users/xaviermartinez/dev/cursor/epic-arcana-novel/lore/l_outline.json', 'utf-8'));

function findChapter(obj, targetId) {
  function traverse(obj) {
    if (typeof obj !== 'object' || obj === null) return null;
    
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const result = traverse(item);
        if (result) return result;
      }
    } else {
      if (obj.unique_identifier === targetId) {
        return obj;
      }
      for (const key in obj) {
        const result = traverse(obj[key]);
        if (result) return result;
      }
    }
    return null;
  }
  
  return traverse(obj);
}

const chapter1 = findChapter(outline, 'STG 4.1.1.1');
if (chapter1) {
  console.log('Chapter 1 Info:');
  console.log('Title:', chapter1.specific_task_group_title);
  console.log('Chapter:', chapter1.chapter);
  console.log('POV:', chapter1.pov);
  console.log('Tense:', chapter1.tense);
  console.log('Core Emotion:', chapter1.core_emotion);
  console.log('Scene Tone:', chapter1.scene_tone);
  console.log('Scenes:', chapter1.scenes ? chapter1.scenes.length : 'No scenes');
  
  if (chapter1.scenes) {
    chapter1.scenes.forEach((scene, index) => {
      console.log(`Scene ${index + 1}:`, scene.title);
      console.log('  Setup:', scene.setup.substring(0, 100) + '...');
      console.log('  POV:', scene.pov);
      console.log('  Tense:', scene.tense);
      console.log('  Core Emotion:', scene.core_emotion);
      console.log('  Scene Tone:', scene.scene_tone);
    });
  }
}

// Also check a Books 1-3 chapter for comparison
const book1Chapter1 = findChapter(outline, 'STG 1.1.1.1');
if (book1Chapter1) {
  console.log('\n--- Book 1 Chapter 1 for comparison ---');
  console.log('Title:', book1Chapter1.specific_task_group_title);
  console.log('Chapter:', book1Chapter1.chapter);
  console.log('Scenes:', book1Chapter1.scenes ? book1Chapter1.scenes.length : 'No scenes');
  
  if (book1Chapter1.scenes) {
    book1Chapter1.scenes.forEach((scene, index) => {
      console.log(`Scene ${index + 1}:`, scene.title);
      console.log('  POV:', scene.pov);
      console.log('  Tense:', scene.tense);
      console.log('  Core Emotion:', scene.core_emotion);
      console.log('  Scene Tone:', scene.scene_tone);
    });
  }
}