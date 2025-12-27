import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function verifySQLMetadata() {
    console.log('🔍 Verifying Scene Metadata using Direct SQL\n');
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

        const result = await db.execute(sql`
      SELECT 
        s.scene_number,
        s.title,
        CASE WHEN s.sudowrite_metadata IS NOT NULL THEN 1 ELSE 0 END as has_sudowrite,
        CASE WHEN s.learning_objectives IS NOT NULL THEN 1 ELSE 0 END as has_learning,
        CASE WHEN s.foreshadowing_elements IS NOT NULL THEN 1 ELSE 0 END as has_foreshadowing,
        jsonb_object_keys(s.sudowrite_metadata) as sudowrite_keys_sample
      FROM scenes s
      JOIN chapters c ON s.chapter_id = c.id
      WHERE c.unique_identifier = ${target.dbId}
      ORDER BY s.scene_number
    `);

        const scenes = result.rows as Array<{
            scene_number: number;
            title: string;
            has_sudowrite: number;
            has_learning: number;
            has_foreshadowing: number;
        }>;

        console.log(`\nFound ${scenes.length} scenes:\n`);

        scenes.forEach(scene => {
            const allPresent = scene.has_sudowrite && scene.has_learning && scene.has_foreshadowing;
            const icon = allPresent ? '✅' : '❌';

            console.log(`${icon} Scene ${scene.scene_number}: ${scene.title}`);
            console.log(`   Sudowrite Metadata: ${scene.has_sudowrite ? '✓ Present' : '✗ Missing'}`);
            console.log(`   Learning Objectives: ${scene.has_learning ? '✓ Present' : '✗ Missing'}`);
            console.log(`   Foreshadowing: ${scene.has_foreshadowing ? '✓ Present' : '✗ Missing'}`);
            console.log('');

            if (allPresent) {
                totalVerified++;
            } else {
                allPassed = false;
            }
        });
    }

    console.log('═'.repeat(70));
    console.log(`\n📊 Verification Results:`);
    console.log(`   Total scenes verified: ${totalVerified} / 9`);

    if (allPassed && totalVerified === 9) {
        console.log('\n✅ ALL SCENES SUCCESSFULLY POPULATED!');
        console.log('\n🎉 Scene metadata enhancement complete!\n');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some scenes are missing metadata. Please review above.');
        process.exit(1);
    }
}

verifySQLMetadata();
