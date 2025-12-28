#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { isNotNull } from 'drizzle-orm';

async function resetAllScenes() {
    console.log('🔄 Resetting ALL scenes to start fresh...\n');

    // Delete all scenes
    const deleted = await db
        .delete(scenes)
        .where(isNotNull(scenes.id))
        .returning({
            chapterUniqueIdentifier: scenes.chapterUniqueIdentifier,
            sceneNumber: scenes.sceneNumber
        });

    console.log(`✅ Deleted ${deleted.length} total scenes\n`);

    console.log('✅ Database reset. Ready for clean import.');
    console.log('\nReset state file with:');
    console.log('  rm .scene-import-state.json');
    console.log('\nThen import chapters in order:');
    console.log('  yarn import:scene --run-all --chapter-id 1d524e45-469a-4709-bfcd-456d6486177c  # EA-041');
    console.log('  yarn import:scene --run-all --chapter-id c472d921-232d-48b5-95d2-69988e9af26e  # EA-023');
}

resetAllScenes()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
