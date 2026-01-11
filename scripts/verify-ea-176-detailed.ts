import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

async function verifyEA176() {
    console.log('🔍 Verifying EA-172 Import...\n');

    const chapterNumber = 176;

    try {
        // Find the chapter
        const [chapter] = await db
            .select()
            .from(chapters)
            .where(eq(chapters.chapterNumber, chapterNumber))
            .limit(1);

        if (!chapter) {
            console.error('❌ Chapter 168 not found');
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

        // Expected scene count (default to 3 if not specified)
        const expectedSceneCount = 3;

        if (chapterScenes.length !== expectedSceneCount) {
            console.error(`❌ Scene count mismatch: expected ${expectedSceneCount}, got ${chapterScenes.length}`);
        } else {
            console.log(`✅ Scene count matches expected: ${expectedSceneCount}\n`);
        }

        // Verify each scene
        let allFieldsValid = true;

        for (const scene of chapterScenes) {
            console.log(`📝 Scene ${scene.sceneNumber}: ${scene.title}`);

            // Check required fields - note: DB column is timeline_variant but schema maps to timelineVariant
            const rawScene: any = scene;
            const requiredFields = {
                location: scene.location,
                timeline_variant: rawScene.timeline_variant || scene.timelineVariant,
            };

            const missingRequired = Object.entries(requiredFields)
                .filter(([_, value]) => !value || value === 'MISSING' || value === '')
                .map(([key]) => key);

            if (missingRequired.length > 0) {
                console.error(`   ❌ Missing required fields: ${missingRequired.join(', ')}`);
                allFieldsValid = false;
            } else {
                console.log(`   ✅ Required fields populated`);
            }

            // Check for enhanced fields
            const enhancedFields = {
                setup: scene.setup,
                sensory_detail: scene.sensoryDetail,
                internal_conflict: scene.internalConflict,
                beat_goal: scene.beatGoal,
                description: scene.description,
                symbolism: scene.symbolism,
                core_emotion: scene.coreEmotion,
                scene_tone: scene.sceneTone,
                character_growth_element: scene.characterGrowthElement,
                series_connection_resonance: scene.seriesConnectionResonance,
                save_the_cat_beat: scene.saveTheCatBeat,
                narrative_function: scene.narrativeFunction,
                real_world_context: scene.realWorldContext,
                timeline_significance: scene.timelineSignificance,
            };

            const populatedEnhanced = Object.entries(enhancedFields)
                .filter(([_, value]) => value && value !== 'MISSING' && value !== '')
                .length;

            console.log(`   ✅ Enhanced fields populated: ${populatedEnhanced}/${Object.keys(enhancedFields).length}`);

            // Check location and timeline_variant specifically
            const timelineVariantValue = (scene as any).timeline_variant || scene.timelineVariant;
            console.log(`   📍 Location: ${scene.location}`);
            console.log(`   ⏱️  Timeline Variant: ${timelineVariantValue}`);
            console.log(`   📅 Timeline Date: ${scene.timelineDate || 'not set'}`);
            console.log(`   📄 Pages: ${scene.pages || 'not set'}`);
            console.log('');
        }

        if (allFieldsValid) {
            console.log('✅ All required fields validated');
        } else {
            console.error('❌ Some required fields missing');
        }

        console.log('\n' + '='.repeat(50));
        console.log('✅ Verification complete for EA-168');

    } catch (error) {
        console.error('❌ Verification failed:', error);
        throw error;
    } finally {
        process.exit(0);
    }
}

verifyEA176();
