#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { scenes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

async function checkEA023() {
    console.log('📊 Checking imported scenes for EA-023 (Chapter 23: MAT 1.2)...\n');

    const chapterId = 'c472d921-232d-48b5-95d2-69988e9af26e';

    const importedScenes = await db
        .select({
            sceneNumber: scenes.sceneNumber,
            title: scenes.title,
            storySequence: scenes.storySequence,
            chronologicalSequence: scenes.chronologicalSequence,
            focus: scenes.focus,
            timeline_variant: scenes.timeline_variant,
            core_emotion: scenes.core_emotion,
        })
        .from(scenes)
        .where(eq(scenes.chapterId, chapterId))
        .orderBy(scenes.sceneNumber);

    console.log(`Found ${importedScenes.length} scenes:\n`);

    importedScenes.forEach((scene) => {
        console.log(`Scene ${scene.sceneNumber}: "${scene.title}"`);
        console.log(`  Story Sequence: ${scene.storySequence}`);
        console.log(`  Focus: ${scene.focus}`);
        console.log(`  Timeline: ${scene.timeline_variant}`);
        console.log(`  Emotion: ${scene.core_emotion}`);
        console.log('');
    });

    console.log('✅ EA-023 import complete!');
}

checkEA023()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
