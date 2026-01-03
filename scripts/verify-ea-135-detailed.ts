import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('🔍 Detailed verification of EA-135 scenes...\n');

    const [chapter] = await db
        .select()
        .from(chapters)
        .where(eq(chapters.chapterNumber, 135))
        .limit(1);

    if (!chapter) {
        console.log('❌ Chapter 135 not found');
        return;
    }

    const chapterScenes = await db
        .select()
        .from(scenes)
        .where(eq(scenes.chapterId, chapter.id))
        .orderBy(scenes.sceneNumber);

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📖 Chapter ${chapter.chapterNumber}: ${chapter.title}`);
    console.log(`   Unique Identifier: ${chapter.uniqueIdentifier}`);
    console.log(`   Total Scenes: ${chapterScenes.length}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    for (const scene of chapterScenes) {
        console.log(`Scene ${scene.sceneNumber}: "${scene.title}"`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        console.log(`📄 Basic Fields:`);
        console.log(`   POV: ${scene.pov || 'N/A'}`);
        console.log(`   Tense: ${scene.tense || 'N/A'}`);
        console.log(`   Pages: ${scene.pages || 'N/A'}`);
        console.log(`   Scene Card: ${scene.sceneCardProgression || 'N/A'}`);

        console.log(`\n📍 Location & Timeline:`);
        console.log(`   Location: ${scene.location || 'MISSING'}`);
        console.log(`   Timeline Date: ${scene.timeline_date || 'N/A'}`);
        console.log(`   Timeline Variant: ${scene.timeline_variant || 'MISSING'}`);

        console.log(`\n📝 Content Fields:`);
        console.log(`   Setup: ${scene.setup ? scene.setup.substring(0, 100) + '...' : 'N/A'}`);
        console.log(`   Description: ${scene.description ? scene.description.substring(0, 100) + '...' : 'N/A'}`);
        console.log(`   Focus: ${scene.focus ? scene.focus.substring(0, 100) + '...' : 'N/A'}`);

        console.log(`\n🎭 Enhanced Fields:`);
        console.log(`   Core Emotion: ${scene.core_emotion || 'N/A'}`);
        console.log(`   Scene Tone: ${scene.scene_tone || 'N/A'}`);
        console.log(`   Symbolism: ${scene.symbolism ? scene.symbolism.substring(0, 80) + '...' : 'N/A'}`);
        console.log(`   Internal Conflict: ${scene.internalConflict ? scene.internalConflict.substring(0, 80) + '...' : 'N/A'}`);
        console.log(`   Character Growth: ${scene.characterGrowthElement ? scene.characterGrowthElement.substring(0, 80) + '...' : 'N/A'}`);
        console.log(`   Series Connection: ${scene.seriesConnectionResonance ? scene.seriesConnectionResonance.substring(0, 80) + '...' : 'N/A'}`);
        console.log(`   Save the Cat Beat: ${scene.saveTheCatBeat || 'N/A'}`);
        console.log(`   Narrative Function: ${scene.narrativeFunction || 'MISSING'}`);

        console.log(`\n🎯 Learning & Foreshadowing:`);
        const learningObjectives = scene.learning_objectives ?
            (typeof scene.learning_objectives === 'string' ? JSON.parse(scene.learning_objectives) : scene.learning_objectives) : [];
        const foreshadowingElements = scene.foreshadowing_elements ?
            (typeof scene.foreshadowing_elements === 'string' ? JSON.parse(scene.foreshadowing_elements) : scene.foreshadowing_elements) : [];

        console.log(`   Learning Objectives: ${Array.isArray(learningObjectives) ? learningObjectives.length : 0} items`);
        console.log(`   Foreshadowing Elements: ${Array.isArray(foreshadowingElements) ? foreshadowingElements.length : 0} items`);

        // Check for missing key enhanced fields
        const missing = [];
        if (!scene.location) missing.push('location');
        if (!scene.timeline_variant) missing.push('timeline_variant');
        if (!scene.narrativeFunction) missing.push('narrativeFunction');

        if (missing.length > 0) {
            console.log(`\n   ⚠️  Missing fields: ${missing.join(', ')}`);
        } else {
            console.log(`\n   ✅ All key enhanced fields present`);
        }

        console.log('');
    }

    console.log('✅ Detailed verification complete!');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
