#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq, sql } from 'drizzle-orm';

async function compareFormats() {
    console.log('📊 Comparing Scene Formats\n');

    // EA-041 scenes
    const ea041 = await db
        .select()
        .from(scenes)
        .where(eq(scenes.chapterId, '1d524e45-469a-4709-bfcd-456d6486177c'))
        .orderBy(scenes.sceneNumber)
        .limit(2);

    // EA-023 scenes
    const ea023 = await db
        .select()
        .from(scenes)
        .where(eq(scenes.chapterId, 'c472d921-232d-48b5-95d2-69988e9af26e'))
        .orderBy(scenes.sceneNumber)
        .limit(2);

    console.log('=== EA-041 Scene 1 (Reference Format) ===');
    console.log(JSON.stringify(ea041[0], null, 2));

    console.log('\n=== EA-023 Scene 1 (Current Format) ===');
    console.log(JSON.stringify(ea023[0], null, 2));

    console.log('\n=== Issues Found ===');

    // Check story sequences
    const allScenes = await db
        .select({
            chapterUniqueIdentifier: scenes.chapterUniqueIdentifier,
            sceneNumber: scenes.sceneNumber,
            storySequence: scenes.storySequence,
        })
        .from(scenes)
        .orderBy(scenes.storySequence);

    console.log('\nStory Sequence Order:');
    allScenes.forEach(s => {
        if (s.storySequence) {
            console.log(`  ${s.chapterUniqueIdentifier} Scene ${s.sceneNumber}: story_sequence ${s.storySequence}`);
        }
    });
}

compareFormats()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
