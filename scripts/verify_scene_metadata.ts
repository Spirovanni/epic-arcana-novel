import { db } from '../src/lib/db';
import { scenes, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function verifySceneMetadata() {
    console.log('🔍 Verifying Scene Metadata Population\n');
    console.log('═'.repeat(70));

    const targetChapters = [
        { eaId: 'EA-004', dbId: 'STG 1.1.2.1', title: 'Explosive' },
        { eaId: 'EA-005', dbId: 'STG 1.1.2.2', title: 'Implementation' },
        { eaId: 'EA-006', dbId: 'STG 1.1.2.3', title: 'Ownership' }
    ];

    let totalVerified = 0;
    let allPassed = true;

    for (const target of targetChapters) {
        console.log(`\n${'─'.repeat(70)}`);
        console.log(`📚 ${target.eaId}: ${target.title} (${target.dbId})`);
        console.log('─'.repeat(70));

        const chapter = await db
            .select()
            .from(chapters)
            .where(eq(chapters.uniqueIdentifier, target.dbId))
            .limit(1);

        if (chapter.length === 0) {
            console.log(`❌ Chapter not found in database`);
            allPassed = false;
            continue;
        }

        const sceneData = await db
            .select({
                sceneNumber: scenes.sceneNumber,
                title: scenes.title,
                sudowriteMetadata: scenes.sudowrite_metadata,
                learningObjectives: scenes.learning_objectives,
                foreshadowingElements: scenes.foreshadowing_elements
            })
            .from(scenes)
            .where(eq(scenes.chapterId, chapter[0].id))
            .orderBy(scenes.sceneNumber);

        console.log(`\nFound ${sceneData.length} scenes:\n`);

        sceneData.forEach(scene => {
            const hasSudowrite = scene.sudowriteMetadata && Object.keys(scene.sudowriteMetadata as object).length > 0;
            const hasLearning = scene.learningObjectives && Object.keys(scene.learningObjectives as object).length > 0;
            const hasForeshadowing = scene.foreshadowingElements && Object.keys(scene.foreshadowingElements as object).length > 0;

            const allPresent = hasSudowrite && hasLearning && hasForeshadowing;
            const icon = allPresent ? '✅' : '❌';

            console.log(`${icon} Scene ${scene.sceneNumber}: ${scene.title}`);
            console.log(`   Sudowrite Metadata: ${hasSudowrite ? '✓ Present' : '✗ Missing'}`);
            console.log(`   Learning Objectives: ${hasLearning ? '✓ Present' : '✗ Missing'}`);
            console.log(`   Foreshadowing: ${hasForeshadowing ? '✓ Present' : '✗ Missing'}`);

            if (allPresent) {
                totalVerified++;
            } else {
                allPassed = false;
            }

            console.log('');
        });
    }

    console.log('═'.repeat(70));
    console.log(`\n📊 Verification Results:`);
    console.log(`   Total scenes verified: ${totalVerified} / 9`);

    if (allPassed) {
        console.log('\n✅ ALL SCENES SUCCESSFULLY POPULATED!');
        console.log('\n🎉 Scene metadata enhancement complete!\n');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some scenes are missing metadata. Please review above.');
        process.exit(1);
    }
}

verifySceneMetadata();
