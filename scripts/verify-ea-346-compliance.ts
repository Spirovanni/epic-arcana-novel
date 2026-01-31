import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function verifyEA346() {
    console.log('🔍 Verifying EA-346 compliance fix...\n');

    const chapterNumber = 346;
    const expectedSceneCount = 4;

    try {
        // Get the chapter
        const chapters = await sql`
      SELECT id, title, unique_identifier, chapter_number
      FROM chapters
      WHERE chapter_number = ${chapterNumber}
      LIMIT 1
    `;

        if (chapters.length === 0) {
            console.log('❌ Error: EA-346 chapter not found in database');
            process.exit(1);
        }

        const chapter = chapters[0];
        console.log(`✅ Found chapter: ${chapter.title}`);
        console.log(`   Unique Identifier: ${chapter.unique_identifier}`);
        console.log(`   Chapter ID: ${chapter.id}\n`);

        // Get all scenes for this chapter
        const scenes = await sql`
      SELECT 
        id, scene_number, title, 
        location, timeline_variant,
        focus, preliminary_scene_focus, preliminary_scene_description,
        description, chapter_scene_focus, setup,
        pov, tense, core_emotion, scene_tone,
        sensory_detail, internal_conflict, beat_goal
      FROM scenes
      WHERE chapter_id = ${chapter.id}
      ORDER BY scene_number
    `;

        console.log(`📊 Scene Count Verification:`);
        console.log(`   Expected: ${expectedSceneCount}`);
        console.log(`   Found: ${scenes.length}`);

        if (scenes.length !== expectedSceneCount) {
            console.log(`   ❌ Scene count mismatch!\n`);
            process.exit(1);
        }
        console.log(`   ✅ Scene count matches\n`);

        // Check for forbidden author citations
        const forbiddenTerms = ['McChesney', 'David Allen', 'Newport'];
        let citationsFound = false;

        // Verify each scene
        let allFieldsPopulated = true;

        for (const scene of scenes) {
            console.log(`\n📝 Scene ${scene.scene_number}: ${scene.title}`);
            console.log(`   ID: ${scene.id}`);

            // Check for author citations in description and setup
            const description = scene.description || '';
            const setup = scene.setup || '';

            for (const term of forbiddenTerms) {
                if (description.includes(term) || setup.includes(term)) {
                    console.log(`   ❌ VIOLATION: Found "${term}" in scene text`);
                    citationsFound = true;
                }
            }

            if (!citationsFound) {
                console.log(`   ✅ No author citations found`);
            }

            // Check critical fields
            const checks = {
                'location': scene.location,
                'timeline_variant': scene.timeline_variant,
                'focus': scene.focus,
                'preliminary_scene_focus': scene.preliminary_scene_focus,
                'preliminary_scene_description': scene.preliminary_scene_description,
                'description': scene.description,
                'chapter_scene_focus': scene.chapter_scene_focus,
                'setup': scene.setup,
                'pov': scene.pov,
                'tense': scene.tense,
                'core_emotion': scene.core_emotion,
                'scene_tone': scene.scene_tone,
                'sensory_detail': scene.sensory_detail,
                'internal_conflict': scene.internal_conflict,
                'beat_goal': scene.beat_goal
            };

            let sceneFieldsOk = true;
            for (const [field, value] of Object.entries(checks)) {
                const isPopulated = value && value.trim() !== '';
                if (!isPopulated) {
                    console.log(`   ❌ ${field}: MISSING`);
                    allFieldsPopulated = false;
                    sceneFieldsOk = false;
                }
            }

            if (sceneFieldsOk) {
                console.log(`   ✅ All required fields populated`);
            }
        }

        console.log(`\n${'='.repeat(60)}`);
        console.log(`📊 FINAL VERIFICATION SUMMARY for EA-346:`);
        console.log(`${'='.repeat(60)}`);
        console.log(`   Total scenes: ${scenes.length}`);
        console.log(`   Scene count correct: ${scenes.length === expectedSceneCount ? '✅ YES' : '❌ NO'}`);
        console.log(`   All required fields populated: ${allFieldsPopulated ? '✅ YES' : '❌ NO'}`);
        console.log(`   No author citations: ${!citationsFound ? '✅ YES' : '❌ NO'}`);
        console.log(`${'='.repeat(60)}\n`);

        if (allFieldsPopulated && scenes.length === expectedSceneCount && !citationsFound) {
            console.log('✅ VERIFICATION PASSED - EA-346 compliance fix complete!');
            console.log('   • All scenes imported correctly');
            console.log('   • All required fields populated');
            console.log('   • No explicit author citations found');
            process.exit(0);
        } else {
            console.log('❌ VERIFICATION FAILED - Please review issues above');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error during verification:', error);
        process.exit(1);
    }
}

verifyEA346();
