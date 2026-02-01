import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const REQUIRED_COLUMNS = [
    'id', 'chapter_id', 'scene_number', 'title', 'focus', 'description',
    'created_at', 'updated_at', 'temporal_power_manifested',
    'character_growth_element', 'scene_card_progression', 'real_world_context',
    'chronological_sequence', 'story_sequence', 'timeline_significance',
    'setup', 'sensory_detail', 'internal_conflict', 'beat_goal', 'symbolism',
    'timeline_date', 'narrative_function', 'pov', 'tense', 'core_emotion',
    'scene_tone', 'learning_objectives', 'foreshadowing_elements', 'sudowrite_metadata',
    'chapter_scene_focus', 'series_connection_resonance', 'chapter_unique_identifier',
    'timeline_variant', 'save_the_cat_beat', 'preliminary_scene_focus',
    'preliminary_scene_description', 'location', 'pages'
];

async function verifyEA355() {
    console.log('🔍 Verifying comprehensive EA-355 scenes...\n');

    const chapters = await sql`
    SELECT id, title 
    FROM chapters 
    WHERE chapter_number = 355
  `;

    if (chapters.length === 0) {
        console.error('❌ EA-355 (Chapter 355) not found!');
        process.exit(1);
    }

    const chapterId = chapters[0].id;
    console.log(`✓ Found chapter: ${chapters[0].title}`);

    const scenes = await sql`
    SELECT * FROM scenes 
    WHERE chapter_id = ${chapterId}
    ORDER BY scene_number
  `;

    console.log(`📊 Scene count: ${scenes.length}\n`);

    if (scenes.length !== 3) {
        console.error(`❌ Expected 3 scenes, found ${scenes.length}`);
        process.exit(1);
    }

    let allPassed = true;

    for (const scene of scenes) {
        console.log(`📝 Scene ${scene.scene_number}: ${scene.title}`);

        const missingCols = REQUIRED_COLUMNS.filter(col => scene[col] === undefined);
        if (missingCols.length > 0) {
            console.error(`   ❌ Missing columns: ${missingCols.join(', ')}`);
            allPassed = false;
        } else {
            console.log('   ✓ All required columns present');
        }

        // Check chapter_unique_identifier format (MUST be EA-355)
        if (scene.chapter_unique_identifier !== 'EA-355') {
            console.error(`   ❌ chapter_unique_identifier incorrect: "${scene.chapter_unique_identifier}" (expected "EA-355")`);
            allPassed = false;
        } else {
            console.log(`   ✓ chapter_unique_identifier correct: "EA-355"`);
        }

        if (!scene.location || scene.location.trim() === '') {
            console.error('   ❌ location is blank or missing');
            allPassed = false;
        } else {
            console.log(`   ✓ location populated: "${scene.location}"`);
        }

        if (!scene.timeline_variant || scene.timeline_variant.trim() === '') {
            console.error('   ❌ timeline_variant is blank or missing');
            allPassed = false;
        } else {
            console.log(`   ✓ timeline_variant populated: "${scene.timeline_variant}"`);
        }

        const otherCriticalFields = [
            'beat_goal', 'save_the_cat_beat', 'focus', 'description', 
            'setup', 'symbolism', 'timeline_date', 'narrative_function', 'pov', 'tense'
        ];

        const emptyCritical = otherCriticalFields.filter(f => !scene[f] || (typeof scene[f] === 'string' && scene[f].trim() === ''));

        if (emptyCritical.length > 0) {
            console.error(`   ❌ Critical fields empty: ${emptyCritical.join(', ')}`);
            allPassed = false;
        } else {
            console.log('   ✓ All other critical fields populated');
        }

        // Check JSON fields
        const jsonFields = ['learning_objectives', 'foreshadowing_elements', 'sudowrite_metadata'];
        let jsonValid = true;
        for (const f of jsonFields) {
            if (!scene[f]) {
                console.error(`   ❌ ${f} is null or undefined`);
                jsonValid = false;
                allPassed = false;
            } else {
                let parsed;
                if (typeof scene[f] === 'string') {
                    try {
                        parsed = JSON.parse(scene[f]);
                    } catch (e) {
                        console.error(`   ❌ ${f} is not valid JSON`);
                        jsonValid = false;
                        allPassed = false;
                        continue;
                    }
                } else if (typeof scene[f] === 'object') {
                    parsed = scene[f];
                } else {
                    console.error(`   ❌ ${f} has invalid type: ${typeof scene[f]}`);
                    jsonValid = false;
                    allPassed = false;
                    continue;
                }
                
                if (f === 'learning_objectives' || f === 'foreshadowing_elements') {
                    if (!Array.isArray(parsed)) {
                        console.error(`   ❌ ${f} should be an array`);
                        jsonValid = false;
                        allPassed = false;
                    }
                } else if (f === 'sudowrite_metadata') {
                    if (typeof parsed !== 'object' || Array.isArray(parsed)) {
                        console.error(`   ❌ ${f} should be an object`);
                        jsonValid = false;
                        allPassed = false;
                    }
                }
            }
        }
        if (jsonValid) console.log('   ✓ All JSON fields valid and populated');

        // Check story-heavy indicators
        const storyIndicators = ['weaponized', 'forcing', 'tension', 'consequence', 'permanent'];
        const focusText = (scene.focus || '').toLowerCase();
        const foundIndicators = storyIndicators.filter(term => focusText.includes(term));
        
        if (foundIndicators.length >= 3) {
            console.log(`   ✓ Story-heavy focus pattern detected (${foundIndicators.length}/5 indicators)`);
        } else {
            console.error(`   ❌ Focus may not follow story-heavy pattern (only ${foundIndicators.length}/5 indicators)`);
            allPassed = false;
        }

        // Check for Record Keepers antagonism
        const descText = (scene.description || '').toLowerCase();
        if (descText.includes('record keeper')) {
            console.log('   ✓ Record Keepers antagonism present');
        } else {
            console.error('   ❌ Record Keepers antagonism not found in description');
            allPassed = false;
        }

        // Check scene_card_progression
        if (scene.scene_card_progression && scene.scene_card_progression >= 1042) {
            console.log(`   ✓ scene_card_progression: ${scene.scene_card_progression}`);
        } else {
            console.error(`   ❌ scene_card_progression invalid or too low: ${scene.scene_card_progression}`);
            allPassed = false;
        }

        // Check Timestamps
        if ((scene.created_at instanceof Date || !isNaN(Date.parse(scene.created_at))) &&
            (scene.updated_at instanceof Date || !isNaN(Date.parse(scene.updated_at)))) {
            console.log('   ✓ Timestamps present and valid');
        } else {
            console.error('   ❌ Invalid timestamps');
            allPassed = false;
        }

        // Check for explicit advice voice
        const avoidTerms = ['the lesson is', 'you should', 'one must', 'it is important to'];
        let contentFields = [scene.description, scene.internal_conflict, scene.character_growth_element].join(' ').toLowerCase();
        const foundAvoid = avoidTerms.filter(term => contentFields.includes(term));
        
        if (foundAvoid.length > 0) {
            console.error(`   ❌ Found explicit guidance language: ${foundAvoid.join(', ')}`);
            allPassed = false;
        } else {
            console.log('   ✓ No explicit self-help voice detected');
        }

        console.log();
    }

    if (allPassed) {
        console.log('============================================================');
        console.log('✅ EA-355 DETAILED VERIFICATION PASSED!');
        console.log('   - 3 scenes imported');
        console.log('   - All required columns present');
        console.log('   - chapter_unique_identifier = "EA-355" ✓');
        console.log('   - location and timeline_variant populated');
        console.log('   - All critical fields populated');
        console.log('   - All JSON fields valid');
        console.log('   - Story-heavy pattern confirmed');
        console.log('   - Record Keepers antagonism present');
        console.log('   - No explicit self-help voice');
        console.log('   - scene_card_progression values valid (1042+)');
        console.log('============================================================');
        process.exit(0);
    } else {
        console.error('❌ VERIFICATION FAILED - See errors above');
        process.exit(1);
    }
}

verifyEA355()
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
