#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function checkImportedScenes() {
    console.log('📊 Checking imported scenes for Chapter 41...\n');

    const chapterId = '1d524e45-469a-4709-bfcd-456d6486177c';

    const importedScenes = await db
        .select({
            sceneNumber: scenes.sceneNumber,
            title: scenes.title,
            storySequence: scenes.storySequence,
            chronologicalSequence: scenes.chronologicalSequence,
            focus: scenes.focus,
            timeline_variant: scenes.timeline_variant,
        })
        .from(scenes)
        .where(eq(scenes.chapterId, chapterId))
        .orderBy(scenes.sceneNumber);

    console.log(`Found ${importedScenes.length} scenes:\n`);

    importedScenes.forEach((scene) => {
        console.log(`Scene ${scene.sceneNumber}: "${scene.title}"`);
        console.log(`  Story Sequence: ${scene.storySequence}`);
        console.log(`  Chronological Sequence: ${scene.chronologicalSequence}`);
        console.log(`  Focus: ${scene.focus}`);
        console.log(`  Timeline Variant: ${scene.timeline_variant}`);
        console.log('');
    });
}

checkImportedScenes()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
