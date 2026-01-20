import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function verifyEA241() {
    console.log('🔍 Verifying EA-241 Import...\n');

    const chapterNumber = 241;

    try {
        // Find the chapter
        const [chapter] = await db
            .select()
            .from(chapters)
            .where(eq(chapters.chapterNumber, chapterNumber))
            .limit(1);

        if (!chapter) {
            console.error('❌ Chapter 241 not found');
            return;
        }

        console.log(`✅ Chapter found: ${chapter.title}`);
        console.log(`   ID: ${chapter.id}`);
        console.log(`   Unique Identifier: ${chapter.uniqueIdentifier}`);
        console.log(`   Focus Area: ${chapter.focusArea}`);
        console.log(`   Tarot: ${chapter.tarotFamily} - ${chapter.tarotCardItem}\n`);

        // Get scenes
        const chapterScenes = await db
            .select()
            .from(scenes)
            .where(eq(scenes.chapterId, chapter.id))
            .orderBy(scenes.sceneNumber);

        console.log(`✅ Found ${chapterScenes.length} scenes\n`);

        // Expected scene count (4 for EA-241)
        const expectedSceneCount = 4;

        if (chapterScenes.length !== expectedSceneCount) {
            console.error(`❌ Scene count mismatch: expected ${expectedSceneCount}, got ${chapterScenes.length}`);
        } else {
            console.log(`✅ Scene count matches expected: ${expectedSceneCount}\n`);
        }

        // Verify each scene
        let allFieldsValid = true;

        for (const scene of chapterScenes) {
            console.log(`📝 Scene ${scene.sceneNumber}: ${scene.title}`);

            // Check required fields
            const rawScene: any = scene;
            const location = scene.location;
            const timelineVariant = rawScene.timeline_variant || scene.timelineVariant;

            if (!location || location === '' || location === 'MISSING') {
                console.error(`   ❌ Missing location`);
                allFieldsValid = false;
            } else {
                console.log(`   ✅ Location: ${location.substring(0, 80)}...`);
            }

            if (!timelineVariant || timelineVariant === '' || timelineVariant === 'MISSING') {
                console.error(`   ❌ Missing timeline_variant`);
                allFieldsValid = false;
            } else {
                console.log(`   ✅ Timeline Variant: ${timelineVariant.substring(0, 80)}...`);
            }

            console.log(`   📅 Timeline Date: ${scene.timelineDate || 'not set'}`);
            console.log(`   📄 Pages: ${scene.pages || 'not set'}`);
            console.log(`   🎴 Scene Card Progression: ${scene.sceneCardProgression || 'not set'}`);

            // Check the critical fields
            if (scene.focus) {
                console.log(`   ✅ Focus: ${scene.focus.substring(0, 100)}...`);
            } else {
                console.log(`   ❌ Focus: not set`);
                allFieldsValid = false;
            }

            if (scene.preliminarySceneFocus) {
                console.log(`   ✅ Preliminary Scene Focus: ${scene.preliminarySceneFocus.substring(0, 80)}...`);
            } else {
                console.log(`   ❌ Preliminary Scene Focus: not set`);
                allFieldsValid = false;
            }

            if (scene.preliminarySceneDescription) {
                console.log(`   ✅ Preliminary Scene Description: ${scene.preliminarySceneDescription.substring(0, 80)}...`);
            } else {
                console.log(`   ❌ Preliminary Scene Description: not set`);
                allFieldsValid = false;
            }

            if (scene.description) {
                console.log(`   ✅ Description: ${scene.description.length} characters`);
            } else {
                console.log(`   ❌ Description: not set`);
                allFieldsValid = false;
            }

            if (scene.chapterSceneFocus) {
                console.log(`   ✅ Chapter Scene Focus: ${scene.chapterSceneFocus.substring(0, 80)}...`);
            } else {
                console.log(`   ❌ Chapter Scene Focus: not set`);
                allFieldsValid = false;
            }

            console.log('');
        }

        if (allFieldsValid) {
            console.log('✅ All required fields validated');
        } else {
            console.error('❌ Some required fields missing');
        }

        console.log('\n' + '='.repeat(50));
        console.log('✅ Verification complete for EA-241');

    } catch (error) {
        console.error('❌ Verification failed:', error);
        throw error;
    } finally {
        process.exit(0);
    }
}

verifyEA241();
