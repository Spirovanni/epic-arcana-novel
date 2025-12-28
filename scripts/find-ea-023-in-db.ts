#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { scenes, chapters } from '../src/lib/schema';
import { eq, like, or } from 'drizzle-orm';

async function findEA023Scenes() {
    console.log('🔍 Searching for EA-023 scenes...\n');

    // Search by MAT 1.2 identifier
    const byIdentifier = await db
        .select({
            sceneNumber: scenes.sceneNumber,
            title: scenes.title,
            chapterUniqueIdentifier: scenes.chapterUniqueIdentifier,
            storySequence: scenes.storySequence,
        })
        .from(scenes)
        .where(like(scenes.chapterUniqueIdentifier, '%MAT 1.2%'))
        .orderBy(scenes.sceneNumber);

    console.log('✅ Scenes with "MAT 1.2" identifier (EA-023):\n');
    if (byIdentifier.length > 0) {
        byIdentifier.forEach(s => {
            console.log(`  Scene ${s.sceneNumber}: ${s.title}`);
            console.log(`    Identifier: ${s.chapterUniqueIdentifier}`);
            console.log(`    Story Sequence: ${s.storySequence}`);
        });
    } else {
        console.log('  None found');
    }

    console.log('\n📊 Chapter information:');
    const chapter = await db
        .select({
            id: chapters.id,
            uniqueIdentifier: chapters.uniqueIdentifier,
            title: chapters.title,
            chapterNumber: chapters.chapterNumber,
        })
        .from(chapters)
        .where(eq(chapters.id, 'c472d921-232d-48b5-95d2-69988e9af26e'));

    if (chapter[0]) {
        console.log(`  Chapter: ${chapter[0].title}`);
        console.log(`  Unique ID: ${chapter[0].uniqueIdentifier}`);
        console.log(`  Chapter Number: ${chapter[0].chapterNumber}`);
        console.log(`  Database ID: ${chapter[0].id}`);
    }

    console.log('\n💡 Note: EA-023 is stored as "MAT 1.2" in chapter_unique_identifier');
}

findEA023Scenes()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
