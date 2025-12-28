#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq, like, or } from 'drizzle-orm';

async function checkAllEA023() {
    console.log('🔍 Checking ALL scenes for Chapter 23...\n');

    const chapterId = 'c472d921-232d-48b5-95d2-69988e9af26e';

    const allScenes = await db
        .select({
            sceneNumber: scenes.sceneNumber,
            title: scenes.title,
            chapterUniqueIdentifier: scenes.chapterUniqueIdentifier,
            storySequence: scenes.storySequence,
        })
        .from(scenes)
        .where(eq(scenes.chapterId, chapterId))
        .orderBy(scenes.sceneNumber);

    console.log(`Found ${allScenes.length} total scenes:\n`);
    allScenes.forEach(s => {
        console.log(`Scene ${s.sceneNumber}: ${s.title}`);
        console.log(`  Identifier: ${s.chapterUniqueIdentifier}`);
        console.log(`  Story Sequence: ${s.storySequence}\n`);
    });

    // Count by identifier
    const byEA = allScenes.filter(s => s.chapterUniqueIdentifier?.startsWith('EA-'));
    const byMAT = allScenes.filter(s => s.chapterUniqueIdentifier?.startsWith('MAT'));

    console.log(`📊 Summary:`);
    console.log(`  - With EA-ID: ${byEA.length}`);
    console.log(`  - With MAT/STG ID: ${byMAT.length}`);
}

checkAllEA023()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
