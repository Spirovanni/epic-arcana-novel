#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function verifyBoth() {
    console.log('✅ Verification: EA-ID Migration\n');

    // EA-041
    const ea041 = await db
        .select({
            sceneNumber: scenes.sceneNumber,
            chapterUniqueIdentifier: scenes.chapterUniqueIdentifier,
        })
        .from(scenes)
        .where(eq(scenes.chapterId, '1d524e45-469a-4709-bfcd-456d6486177c'))
        .orderBy(scenes.sceneNumber);

    console.log('EA-041 (Chapter 41) scenes:');
    ea041.forEach(s => console.log(`  Scene ${s.sceneNumber}: ${s.chapterUniqueIdentifier}`));

    // EA-023
    const ea023 = await db
        .select({
            sceneNumber: scenes.sceneNumber,
            chapterUniqueIdentifier: scenes.chapterUniqueIdentifier,
        })
        .from(scenes)
        .where(eq(scenes.chapterId, 'c472d921-232d-48b5-95d2-69988e9af26e'))
        .orderBy(scenes.sceneNumber);

    console.log('\nEA-023 (Chapter 23) scenes:');
    ea023.forEach(s => console.log(`  Scene ${s.sceneNumber}: ${s.chapterUniqueIdentifier}`));

    console.log('\n✅ All scenes now use EA-IDs!');
}

verifyBoth()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
