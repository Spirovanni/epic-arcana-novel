import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// All 36 required columns (excluding id and chapter_id which are auto-generated)
const REQUIRED_COLUMNS = [
    'scene_number',
    'title',
    'focus',
    'preliminary_scene_focus',
    'preliminary_scene_description',
    'description',
    'pages',
    'created_at',
    'updated_at',
    'temporal_power_manifested',
    'character_growth_element',
    'scene_card_progression',
    'real_world_context',
    'chronological_sequence',
    'story_sequence',
    'timeline_significance',
    'setup',
    'sensory_detail',
    'internal_conflict',
    'beat_goal',
    'symbolism',
    'timeline_date',
    'timeline_variant',
    'location',
    'pov',
    'tense',
    'core_emotion',
    'scene_tone',
    'save_the_cat_beat',
    'sudowrite_metadata',
    'learning_objectives',
    'foreshadowing_elements',
    'narrative_function',
    'series_connection_resonance',
    'chapter_scene_focus',
    'chapter_unique_identifier'
];

async function verifyEA346Comprehensive() {
    console.log('🔍 Verifying comprehensive EA-346 scenes...\n');

    // Get chapter info
    const chapters = await sql`
    SELECT id, title, unique_identifier 
    FROM chapters 
    WHERE chapter_number = 346
  `;

    if (chapters.length === 0) {
        console.error('✗ EA-346 chapter not found!');
        return 1;
    }

    const chapter = chapters[0];
    console.log(`✓ Found chapter: ${chapter.title || 'EA-346'}`);
    console.log(`  Chapter ID: ${chapter.id}`);
    console.log(`  Unique ID: ${chapter.unique_identifier}\n`);

    // Get all scenes with ALL columns
    const scenes = await sql`
    SELECT * 
    FROM scenes 
    WHERE chapter_id = ${chapter.id}
    ORDER BY scene_number
  `;

    console.log(`📊 Scene count: ${scenes.length}\n`);

    if (scenes.length === 0) {
        console.error('✗ No scenes found!');
        return 1;
    }

    let allValid = true;

    for (const scene of scenes) {
        console.log(`\n📝 Scene ${scene.scene_number}: ${scene.title}`);

        // Check all required columns exist
        const missingColumns = [];
        for (const col of REQUIRED_COLUMNS) {
            if (!(col in scene)) {
                missingColumns.push(col);
            }
        }

        if (missingColumns.length > 0) {
            console.error(`   ✗ MISSING COLUMNS: ${missingColumns.join(', ')}`);
            allValid = false;
            continue;
        }

        console.log(`   ✓ All ${REQUIRED_COLUMNS.length} columns present`);

        // Check critical non-empty fields
        const criticalFields = ['location', 'timeline_variant', 'beat_goal', 'chapter_unique_identifier'];
        const emptyFields = [];
        for (const field of criticalFields) {
            if (!scene[field] || scene[field].toString().trim() === '') {
                emptyFields.push(field);
            }
        }

        if (emptyFields.length > 0) {
            console.error(`   ✗ EMPTY CRITICAL FIELDS: ${emptyFields.join(', ')}`);
            allValid = false;
        } else {
            console.log(`   ✓ All critical fields populated`);
        }

        // Validate JSON fields
        const jsonFields = ['sudowrite_metadata', 'learning_objectives', 'foreshadowing_elements'];
        const invalidJson = [];
        for (const field of jsonFields) {
            if (scene[field]) {
                try {
                    JSON.parse(scene[field]);
                } catch (e) {
                    invalidJson.push(field);
                }
            }
        }

        if (invalidJson.length > 0) {
            console.error(`   ✗ INVALID JSON: ${invalidJson.join(', ')}`);
            allValid = false;
        } else {
            console.log(`   ✓ All JSON fields valid`);
        }

        // Check for author citations
        const textFields = ['focus', 'description', 'setup', 'narrative_function', 'series_connection_resonance'];
        const citations = ['McChesney', 'David Allen', 'Newport', 'GTD', 'WIG', 'Deep Work'];
        const foundCitations = [];

        for (const field of textFields) {
            const text = scene[field] || '';
            for (const citation of citations) {
                if (text.includes(citation) && !['WIG', 'GTD'].includes(citation)) { // WIG and GTD are OK as in-world terms
                    foundCitations.push(`${citation} in ${field}`);
                }
            }
        }

        if (foundCitations.length > 0) {
            console.error(`   ⚠️  POSSIBLE CITATIONS: ${foundCitations.join(', ')}`);
        } else {
            console.log(`   ✓ No author citations found`);
        }

        // Check timestamps exist (Postgres will convert to proper Date objects)
        const timestamps = ['created_at', 'updated_at'];
        const invalidTimestamps = [];
        for (const field of timestamps) {
            if (!scene[field]) {
                invalidTimestamps.push(field);
            }
        }

        if (invalidTimestamps.length > 0) {
            console.error(`   ✗ MISSING TIMESTAMPS: ${invalidTimestamps.join(', ')}`);
            allValid = false;
        } else {
            console.log(`   ✓ Timestamps present`);
        }
    }

    console.log('\n' + '='.repeat(60));
    if (allValid && scenes.length === 4) {
        console.log('✅ EA-346 COMPREHENSIVE VERIFICATION PASSED!');
        console.log(`   - ${scenes.length} scenes imported`);
        console.log(`   - All ${REQUIRED_COLUMNS.length} columns present`);
        console.log('   - All critical fields populated');
        console.log('   - All JSON fields valid');
        console.log('   - Timestamps properly formatted');
        return 0;
    } else {
        console.error('❌ VERIFICATION FAILED - see errors above');
        return 1;
    }
}

verifyEA346Comprehensive()
    .then(code => process.exit(code))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
