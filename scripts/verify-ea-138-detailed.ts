import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('🔍 Detailed verification of EA-138 scenes...\n');

    const [chapter] = await db
        .select()
        .from(chapters)
        .where(eq(chapters.chapterNumber, 138))
        .limit(1);

    if (!chapter) {
        console.log('❌ Chapter 138 not found');
        return;
    }

    const chapterScenes = await db
        .select()
        .from(scenes)
        .where(eq(scenes.chapterId, chapter.id))
        .orderBy(scenes.sceneNumber);

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📖 Chapter ${chapter.chapterNumber}: ${chapter.title}`);
    console.log(`   Total Scenes: ${chapterScenes.length}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    for (const scene of chapterScenes) {
        console.log(`Scene ${scene.sceneNumber}: "${scene.title}"`);
        console.log(`   Location: ${scene.location || 'MISSING'}`);
        console.log(`   Timeline Variant: ${scene.timeline_variant || 'MISSING'}`);
        console.log(`   Narrative Function: ${scene.narrativeFunction ? 'Present' : 'MISSING'}`);

        const learningObjectives = scene.learning_objectives ?
            (typeof scene.learning_objectives === 'string' ? JSON.parse(scene.learning_objectives) : scene.learning_objectives) : [];
        const foreshadowingElements = scene.foreshadowing_elements ?
            (typeof scene.foreshadowing_elements === 'string' ? JSON.parse(scene.foreshadowing_elements) : scene.foreshadowing_elements) : [];

        console.log(`   Learning Objectives: ${Array.isArray(learningObjectives) ? learningObjectives.length : 0} items`);
        console.log(`   Foreshadowing Elements: ${Array.isArray(foreshadowingElements) ? foreshadowingElements.length : 0} items`);

        const missing = [];
        if (!scene.location) missing.push('location');
        if (!scene.timeline_variant) missing.push('timeline_variant');
        if (!scene.narrativeFunction) missing.push('narrativeFunction');

        if (missing.length > 0) {
            console.log(`   ⚠️  Missing: ${missing.join(', ')}`);
        } else {
            console.log(`   ✅ All key fields present`);
        }
        console.log('');
    }

    console.log('✅ Verification complete!');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
