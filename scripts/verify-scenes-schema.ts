#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import { chapters, scenes } from '../src/lib/schema';

async function verifySchema() {
    console.log('🔍 Verifying scenes table constraints...\n');

    // Check for unique constraint on (chapter_id, scene_number)
    const constraints = await db.execute(sql`
    SELECT
      con.conname AS constraint_name,
      con.contype AS constraint_type,
      pg_get_constraintdef(con.oid) AS definition
    FROM pg_constraint con
    INNER JOIN pg_class rel ON rel.oid = con.conrelid
    INNER JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE rel.relname = 'scenes'
      AND nsp.nspname = 'public'
      AND con.contype IN ('p', 'u')
    ORDER BY con.conname;
  `);

    console.log('📋 Scenes table constraints:');
    console.log(JSON.stringify(constraints.rows, null, 2));

    // Check for the mentioned chapter ID
    console.log('\n🔍 Looking for chapter 1d524e45-469a-4709-bfcd-456d6486177c...\n');

    const chapterCheck = await db
        .select({
            id: chapters.id,
            chapterNumber: chapters.chapterNumber,
            title: chapters.title,
            uniqueIdentifier: chapters.uniqueIdentifier,
        })
        .from(chapters)
        .where(sql`${chapters.id} = '1d524e45-469a-4709-bfcd-456d6486177c'`);

    if (chapterCheck.length > 0) {
        console.log('✅ Found chapter:');
        console.log(JSON.stringify(chapterCheck[0], null, 2));

        // Check scenes for this chapter
        const sceneCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(scenes)
            .where(sql`${scenes.chapterId} = '1d524e45-469a-4709-bfcd-456d6486177c'`);

        console.log(`\n📊 This chapter has ${sceneCount[0]?.count ?? 0} scenes in the database.`);
    } else {
        console.log('❌ Chapter not found in database.');
        console.log('\n📋 Here are the first 5 chapters in the database:');

        const sampleChapters = await db
            .select({
                id: chapters.id,
                chapterNumber: chapters.chapterNumber,
                title: chapters.title,
                uniqueIdentifier: chapters.uniqueIdentifier,
            })
            .from(chapters)
            .orderBy(chapters.chapterNumber)
            .limit(5);

        console.log(JSON.stringify(sampleChapters, null, 2));
    }

    // Check current max story_sequence
    console.log('\n📈 Current max story_sequence in scenes:');
    const [maxSeq] = await db
        .select({ max: sql<number>`max(${scenes.storySequence})` })
        .from(scenes);

    console.log(`Max story_sequence: ${maxSeq?.max ?? 0}`);
}

verifySchema()
    .then(() => {
        console.log('\n✅ Verification complete');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
