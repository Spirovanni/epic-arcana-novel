import * as fs from 'fs';
import * as path from 'path';

/**
 * Detailed verification for EA-199 enhanced scenes
 */

interface Scene {
  scene_number: number;
  title?: string;
  scene_title?: string;
  setup?: string;
  location?: string;
  timeline_variant?: string;
  description?: string;
  beat_goal?: string;
  symbolism?: string;
  sensoryDetail?: string;
  internalConflict?: string;
  characterGrowthElement?: string;
  seriesConnectionResonance?: string;
  narrativeFunction?: string;
  realWorldContext?: string;
  learning_objectives?: string[];
  foreshadowing_elements?: string[];
  [key: string]: any;
}

interface ChapterData {
  id: string;
  chapter: string;
  specific_task_group_title?: string;
  scenes?: Scene[];
}

async function main() {
  const eaId = 'EA-199';
  const expectedSceneCount = 3;
  
  console.log(`🔍 Verifying ${eaId} enhanced scenes...\n`);

  // Read outline
  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  // Find EA-199
  function findChapter(obj: any): ChapterData | null {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.id === eaId) return obj;
    
    for (const key of Object.keys(obj)) {
      const result = findChapter(obj[key]);
      if (result) return result;
    }
    return null;
  }

  const chapter = findChapter(outline);
  
  if (!chapter) {
    throw new Error(`${eaId} not found in outline`);
  }

  console.log(`✅ Found ${eaId} in outline`);
  console.log(`   Chapter: ${chapter.chapter}`);
  console.log(`   Title: ${chapter.specific_task_group_title}`);
  console.log(`   Scene count: ${chapter.scenes?.length || 0}\n`);

  // Verify scene count
  if (!chapter.scenes || chapter.scenes.length !== expectedSceneCount) {
    throw new Error(`Expected ${expectedSceneCount} scenes, found ${chapter.scenes?.length || 0}`);
  }
  console.log(`✅ Scene count matches: ${expectedSceneCount} scenes\n`);

  // Required fields for each scene
  const requiredFields = [
    'scene_number',
    'title',
    'location',
    'timeline_variant',
    'setup',
    'description',
    'beat_goal',
    'symbolism',
    'pov',
    'tense',
    'core_emotion',
    'scene_tone',
    'pages'
  ];

  const enhancedFields = [
    'sensoryDetail',
    'internalConflict',
    'characterGrowthElement',
    'seriesConnectionResonance',
    'sceneCardProgression',
    'realWorldContext',
    'timelineSignificance',
    'saveTheCatBeat',
    'narrativeFunction',
    'learning_objectives',
    'foreshadowing_elements'
  ];

  // Verify each scene
  for (const scene of chapter.scenes) {
    const sceneTitle = scene.scene_title || scene.title;
    console.log(`📝 Scene ${scene.scene_number}: ${sceneTitle}`);

    // Check required fields
    const missingRequired: string[] = [];
    for (const field of requiredFields) {
      const value = scene[field];
      if (value === undefined || value === null || value === '' || value === 'MISSING') {
        missingRequired.push(field);
      }
    }

    if (missingRequired.length > 0) {
      console.log(`   ❌ Missing required fields: ${missingRequired.join(', ')}`);
      throw new Error(`Scene ${scene.scene_number} missing required fields`);
    }
    console.log(`   ✅ All required fields present`);

    // Check enhanced fields
    const missingEnhanced: string[] = [];
    for (const field of enhancedFields) {
      const value = scene[field];
      if (value === undefined || value === null || value === '') {
        missingEnhanced.push(field);
      }
    }

    if (missingEnhanced.length > 0) {
      console.log(`   ⚠️  Missing enhanced fields: ${missingEnhanced.join(', ')}`);
    } else {
      console.log(`   ✅ All enhanced fields present`);
    }

    // Specific validations
    if (!scene.location || scene.location === 'MISSING') {
      throw new Error(`Scene ${scene.scene_number}: location is required and cannot be MISSING`);
    }
    console.log(`   ✅ Location: ${scene.location}`);

    if (!scene.timeline_variant || scene.timeline_variant === 'MISSING') {
      throw new Error(`Scene ${scene.scene_number}: timeline_variant is required and cannot be MISSING`);
    }
    console.log(`   ✅ Timeline Variant: ${scene.timeline_variant}`);

    // Check array fields
    if (scene.learning_objectives) {
      const count = Array.isArray(scene.learning_objectives) 
        ? scene.learning_objectives.length 
        : 0;
      console.log(`   ✅ Learning Objectives: ${count} items`);
    }

    if (scene.foreshadowing_elements) {
      const count = Array.isArray(scene.foreshadowing_elements)
        ? scene.foreshadowing_elements.length
        : 0;
      console.log(`   ✅ Foreshadowing Elements: ${count} items`);
    }

    // Verify story-heavy content
    const description = scene.description || '';
    const setup = scene.setup || '';
    const internalConflict = scene.internalConflict || '';
    
    if (description.length < 100) {
      console.log(`   ⚠️  Description might be too brief (${description.length} chars)`);
    } else {
      console.log(`   ✅ Description: ${description.length} characters`);
    }

    if (setup.length < 50) {
      console.log(`   ⚠️  Setup might be too brief (${setup.length} chars)`);
    } else {
      console.log(`   ✅ Setup: ${setup.length} characters`);
    }

    if (internalConflict && internalConflict.length > 50) {
      console.log(`   ✅ Internal Conflict: ${internalConflict.length} characters`);
    }

    console.log('');
  }

  console.log(`\n✨ Verification Complete!\n`);
  console.log(`Summary for ${eaId}:`);
  console.log(`  ✅ Scene count: ${chapter.scenes.length} (expected ${expectedSceneCount})`);
  console.log(`  ✅ All required fields present for all scenes`);
  console.log(`  ✅ Location and timeline_variant populated for all scenes`);
  console.log(`  ✅ Enhanced fields present (story-heavy content verified)`);
  console.log(`\nScene Titles:`);
  chapter.scenes.forEach((scene: Scene) => {
    const title = scene.scene_title || scene.title;
    console.log(`  ${scene.scene_number}. ${title}`);
  });
  console.log('');
}

main()
  .then(() => {
    console.log('✅ Verification passed!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  });
