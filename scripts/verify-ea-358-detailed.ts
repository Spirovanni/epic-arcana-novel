import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

const CHAPTER_NUMBER = 358;
const EXPECTED_CHAPTER_UNIQUE_ID = `EA-${CHAPTER_NUMBER}`;

async function verify() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log(`\n🔍 Verifying EA-${CHAPTER_NUMBER} scenes...\n`);
  
  // Get chapter ID
  const chapters = await sql`
    SELECT id, title, unique_identifier 
    FROM chapters 
    WHERE chapter_number = ${CHAPTER_NUMBER}
  `;
  
  if (chapters.length === 0) {
    console.error(`❌ Chapter ${CHAPTER_NUMBER} not found!`);
    process.exit(1);
  }
  
  const chapter = chapters[0];
  console.log(`📖 Chapter: ${chapter.title}`);
  console.log(`   DB unique_identifier: ${chapter.unique_identifier}`);
  console.log(`   Expected chapter_unique_identifier in scenes: ${EXPECTED_CHAPTER_UNIQUE_ID}\n`);
  
  // Get scenes
  const scenes = await sql`
    SELECT * FROM scenes 
    WHERE chapter_id = ${chapter.id}
    ORDER BY scene_number
  `;
  
  console.log(`📊 Found ${scenes.length} scenes\n`);
  
  // Required keys check (using snake_case as returned by raw SQL)
  const requiredKeys = [
    'scene_number', 'title', 'focus', 'description', 'pages',
    'setup', 'symbolism', 'location', 'pov', 'tense',
    'timeline_variant', 'timeline_date', 'core_emotion', 'scene_tone',
    'save_the_cat_beat', 'narrative_function', 'sensory_detail', 'internal_conflict',
    'beat_goal', 'character_growth_element', 'scene_card_progression',
    'timeline_significance', 'real_world_context', 'series_connection_resonance',
    'chapter_unique_identifier'
  ];
  
  let allPassed = true;
  
  for (const scene of scenes) {
    console.log(`\n--- Scene ${scene.scene_number}: ${scene.title} ---`);
    
    // Check required keys exist
    const missingKeys: string[] = [];
    for (const key of requiredKeys) {
      if (scene[key] === undefined) {
        missingKeys.push(key);
      }
    }
    
    if (missingKeys.length > 0) {
      console.log(`   ❌ Missing keys: ${missingKeys.join(', ')}`);
      allPassed = false;
    } else {
      console.log('   ✓ All required keys present');
    }
    
    // Check chapter_unique_identifier format (must be "EA-###")
    const chapterUniqueId = scene.chapter_unique_identifier;
    if (!chapterUniqueId) {
      console.log(`   ❌ chapter_unique_identifier is empty/null`);
      allPassed = false;
    } else if (chapterUniqueId !== EXPECTED_CHAPTER_UNIQUE_ID) {
      console.log(`   ❌ chapter_unique_identifier mismatch: got "${chapterUniqueId}", expected "${EXPECTED_CHAPTER_UNIQUE_ID}"`);
      allPassed = false;
    } else if (!/^EA-\d{3}$/.test(chapterUniqueId)) {
      console.log(`   ❌ chapter_unique_identifier format wrong: "${chapterUniqueId}" (should be EA-###)`);
      allPassed = false;
    } else {
      console.log(`   ✓ chapter_unique_identifier correct: ${chapterUniqueId}`);
    }
    
    // Check non-blank required fields
    if (!scene.location || scene.location.trim() === '') {
      console.log('   ❌ location is blank');
      allPassed = false;
    } else {
      console.log(`   ✓ location: ${scene.location}`);
    }
    
    if (!scene.timeline_variant || scene.timeline_variant.trim() === '') {
      console.log('   ❌ timeline_variant is blank');
      allPassed = false;
    } else {
      console.log(`   ✓ timeline_variant: ${scene.timeline_variant}`);
    }
    
    // Check critical fields (snake_case)
    const criticalFields = ['save_the_cat_beat', 'scene_card_progression'];
    const emptyFields: string[] = [];
    for (const f of criticalFields) {
      if (scene[f] === null || scene[f] === undefined || scene[f] === '') {
        emptyFields.push(f);
      }
    }
    if (emptyFields.length > 0) {
      console.log(`   ❌ Critical fields empty: ${emptyFields.join(', ')}`);
      allPassed = false;
    } else {
      console.log(`   ✓ Critical fields populated (save_the_cat_beat, scene_card_progression: ${scene.scene_card_progression})`);
    }
    
    // Check JSON fields
    const jsonFields = ['learning_objectives', 'foreshadowing_elements', 'sudowrite_metadata'];
    let jsonValid = true;
    for (const f of jsonFields) {
      try {
        const value = scene[f];
        if (value === null || value === undefined) {
          continue;
        }
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (parsed === null) {
          continue;
        }
        if (typeof parsed !== 'object') {
          jsonValid = false;
          console.log(`   ❌ JSON field '${f}' is not valid object after parsing`);
        }
      } catch (e) {
        jsonValid = false;
        console.log(`   ❌ JSON field '${f}' is not valid JSON: ${scene[f]}`);
      }
    }
    if (jsonValid) {
      console.log('   ✓ All JSON fields valid');
    } else {
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log(`✅ ALL VERIFICATION CHECKS PASSED for EA-${CHAPTER_NUMBER}`);
    console.log(`   ${scenes.length} scenes verified`);
    console.log(`   chapter_unique_identifier: ${EXPECTED_CHAPTER_UNIQUE_ID} ✓`);
  } else {
    console.log(`❌ VERIFICATION FAILED for EA-${CHAPTER_NUMBER}`);
    process.exit(1);
  }
}

verify().catch(console.error);
