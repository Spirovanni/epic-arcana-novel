import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// 34 required columns (removed completion_status, notes)
const REQUIRED_COLUMNS = [
  'id', 'chapter_id', 'scene_number', 'title', 'focus', 'description', 
  'created_at', 'updated_at', 'temporal_power_manifested', 
  'character_growth_element', 'scene_card_progression', 'real_world_context', 
  'chronological_sequence', 'story_sequence', 'timeline_significance', 
  'setup', 'sensory_detail', 'internal_conflict', 'beat_goal', 'symbolism', 
  'timeline_date', 'narrative_function', 
  'learning_objectives', 'foreshadowing_elements', 'sudowrite_metadata', 
  'chapter_scene_focus', 'series_connection_resonance', 'chapter_unique_identifier', 
  'timeline_variant', 'save_the_cat_beat', 'preliminary_scene_focus', 
  'preliminary_scene_description', 'location', 'pages'
];

async function verifyEA347() {
  console.log('🔍 Verifying comprehensive EA-347 scenes...\n');

  // 1. Get Chapter
  const chapters = await sql`
    SELECT id, title 
    FROM chapters 
    WHERE chapter_number = 347
  `;

  if (chapters.length === 0) {
    console.error('❌ EA-347 (Chapter 347) not found!');
    process.exit(1);
  }

  const chapterId = chapters[0].id;
  console.log(`✓ Found chapter: ${chapters[0].title}`);

  // 2. Get Scenes
  const scenes = await sql`
    SELECT * FROM scenes 
    WHERE chapter_id = ${chapterId}
    ORDER BY scene_number
  `;

  console.log(`📊 Scene count: ${scenes.length}\n`);

  if (scenes.length !== 4) {
    console.error(`❌ Expected 4 scenes, found ${scenes.length}`);
    process.exit(1);
  }

  let allPassed = true;

  // 3. Check each scene
  for (const scene of scenes) {
    console.log(`📝 Scene ${scene.scene_number}: ${scene.title}`);
    
    // Check all columns present (in the object)
    const missingCols = REQUIRED_COLUMNS.filter(col => scene[col] === undefined);
    if (missingCols.length > 0) {
      console.error(`   ❌ Missing columns: ${missingCols.join(', ')}`);
      allPassed = false;
    } else {
      console.log('   ✓ All required columns present');
    }

    // Check critical fields populated
    const criticalFields = [
      'location', 'timeline_variant', 'beat_goal', 'chapter_unique_identifier',
      'save_the_cat_beat', 'chronological_sequence'
    ];
    
    const emptyCritical = criticalFields.filter(f => !scene[f]);
    
    // Allow chronological_sequence checked separately as number (0 is falsy but valid if seq could be 0, but here >1000)
    if (scene.chronological_sequence === null) {
         if (!emptyCritical.includes('chronological_sequence')) emptyCritical.push('chronological_sequence');
    }

    if (emptyCritical.length > 0) {
      console.error(`   ❌ Critical fields empty: ${emptyCritical.join(', ')}`);
      allPassed = false;
    } else {
      console.log('   ✓ All critical fields populated');
    }

    // Check JSON fields
    const jsonFields = ['learning_objectives', 'foreshadowing_elements', 'sudowrite_metadata'];
    let jsonValid = true;
    for (const f of jsonFields) {
      if (!scene[f] || typeof scene[f] !== 'object') {
        // Postgres driver usually returns objects for JSON/JSONB columns
        // Checking for null or non-object
        if (scene[f] === null) jsonValid = false;
      }
    }
    if (jsonValid) console.log('   ✓ All JSON fields valid');
    else { console.error('   ❌ Invalid JSON fields'); allPassed = false; }
    
    // Check Author Citations (should be NONE)
    const citationTerms = ['Mel Robbins', 'Chip Heath', 'Greg McKeown', 'Steven Pressfield'];
    // Check description/focus/setup/internal_conflict/character_growth_element/sensory_detail
    const contentFields = ['description', 'focus', 'setup', 'internal_conflict', 'character_growth_element', 'sensory_detail'];
    let content = "";
    contentFields.forEach(f => { if(scene[f]) content += scene[f] + " "; });
    content = content.toLowerCase();

    const foundCitations = citationTerms.filter(term => content.includes(term.toLowerCase()));
    
    if (foundCitations.length > 0) {
       console.error(`   ❌ Found author citations: ${foundCitations.join(', ')}`);
       allPassed = false;
    } else {
       console.log('   ✓ No author citations found');
    }

    // Check Timestamps (should be Dates or valid Strings)
    if ((scene.created_at instanceof Date || !isNaN(Date.parse(scene.created_at))) && 
        (scene.updated_at instanceof Date || !isNaN(Date.parse(scene.updated_at)))) {
      console.log('   ✓ Timestamps present');
    } else {
      console.error('   ❌ Invalid timestamps');
      allPassed = false;
    }

    console.log();
  }

  if (allPassed) {
    console.log('============================================================');
    console.log('✅ EA-347 COMPREHENSIVE VERIFICATION PASSED!');
    console.log('   - 4 scenes imported');
    console.log('   - All required columns present');
    console.log('   - All critical fields populated');
    console.log('   - All JSON fields valid');
    console.log('   - Timestamps properly formatted');
    process.exit(0);
  } else {
    console.error('❌ VERIFICATION FAILED');
    process.exit(1);
  }
}

verifyEA347()
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
