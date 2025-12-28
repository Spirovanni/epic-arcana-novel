#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { sql } from 'drizzle-orm';

async function checkAllSequences() {
    console.log('📊 Checking all story sequences in database...\n');

    const [maxRow] = await db
        .select({ max: sql<number>`max(${scenes.storySequence})` })
        .from(scenes);

    console.log(`Max story_sequence in DB: ${maxRow?.max ?? 0}\n`);

    const allScenes = await db
        .select({
            chapterUniqueIdentifier: scenes.chapterUniqueIdentifier,
            sceneNumber: scenes.sceneNumber,
            title: scenes.title,
            storySequence: scenes.storySequence,
        })
        .from(scenes)
        .orderBy(scenes.storySequence);

    console.log('All scenes ordered by story_sequence:');
    allScenes.forEach(s => {
        if (s.storySequence) {
            console.log(`  [${s.storySequence}] ${s.chapterUniqueIdentifier} Scene ${s.sceneNumber}: ${s.title}`);
        } else {
            console.log(`  [NULL] ${s.chapterUniqueIdentifier} Scene ${s.sceneNumber}: ${s.title}`);
        }
    });
}

checkAllSequences()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
