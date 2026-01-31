import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function verifyEA246() {
    console.log('🔍 Verifying EA-246 scenes in database...\n');

    const chapterNumber = 246;
    const expectedSceneCount = 3;

    try {
        // Get the chapter
        const chapters = await sql`
      SELECT id, title, unique_identifier, chapter_number
      FROM chapters
      WHERE chapter_number = ${chapterNumber}
      LIMIT 1
    `;

        if (chapters.length === 0) {
            console.log('❌ Error: EA-246 chapter not found in database');
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
        description, chapter_scene_focus,
        setup, sensory_detail, internal_conflict, beat_goal
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

        // Verify each scene
        let allFieldsPopulated = true;

        for (const scene of scenes) {
            console.log(`\n📝 Scene ${scene.scene_number}: ${scene.title}`);
            console.log(`   ID: ${scene.id}`);

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
                'sensory_detail': scene.sensory_detail,
                'internal_conflict': scene.internal_conflict,
                'beat_goal': scene.beat_goal
            };

            for (const [field, value] of Object.entries(checks)) {
                const isPopulated = value && value.trim() !== '';
                const status = isPopulated ? '✅' : '❌';
                console.log(`   ${status} ${field}: ${isPopulated ? 'populated' : 'MISSING'}`);

                if (!isPopulated) {
                    allFieldsPopulated = false;
                }
            }
        }

        console.log(`\n${'='.repeat(60)}`);
        console.log(`📊 Summary for EA-246:`);
        console.log(`   Total scenes: ${scenes.length}`);
        console.log(`   All required fields populated: ${allFieldsPopulated ? '✅ YES' : '❌ NO'}`);
        console.log(`${'='.repeat(60)}\n`);

        if (allFieldsPopulated && scenes.length === expectedSceneCount) {
            console.log('✅ Verification PASSED - EA-246 is complete and correct!');
            process.exit(0);
        } else {
            console.log('❌ Verification FAILED - Please review issues above');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error during verification:', error);
        process.exit(1);
    }
}

verifyEA246();
