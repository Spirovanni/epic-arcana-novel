#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function resetEA023() {
    console.log('🔄 Resetting EA-023 scenes...\n');

    const chapterId = 'c472d921-232d-48b5-95d2-69988e9af26e';

    // Delete all scenes for this chapter
    const deleted = await db
        .delete(scenes)
        .where(eq(scenes.chapterId, chapterId))
        .returning({ sceneNumber: scenes.sceneNumber });

    console.log(`✅ Deleted ${deleted.length} scenes:`);
    deleted.forEach(s => console.log(`  - Scene ${s.sceneNumber}`));

    console.log('\n✅ EA-023 scenes reset. Ready for fresh import.');
    console.log('\nRun this to reimport:');
    console.log('  yarn import:scene --run-all --chapter-id c472d921-232d-48b5-95d2-69988e9af26e');
}

resetEA023()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
