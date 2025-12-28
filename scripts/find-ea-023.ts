#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { chapters } from '../src/lib/schema';
import { like, or, eq } from 'drizzle-orm';

async function findChapter() {
    console.log('🔍 Searching for EA-023...\n');

    const results = await db
        .select({
            id: chapters.id,
            chapterNumber: chapters.chapterNumber,
            title: chapters.title,
            uniqueIdentifier: chapters.uniqueIdentifier,
        })
        .from(chapters)
        .where(
            or(
                like(chapters.uniqueIdentifier, '%EA-023%'),
                like(chapters.uniqueIdentifier, '%23%'),
                like(chapters.title, '%23%')
            )
        )
        .orderBy(chapters.chapterNumber);

    if (results.length === 0) {
        console.log('❌ No chapters found matching EA-023');
        console.log('\nSearching for chapter number 23...');

        const byNumber = await db
            .select({
                id: chapters.id,
                chapterNumber: chapters.chapterNumber,
                title: chapters.title,
                uniqueIdentifier: chapters.uniqueIdentifier,
            })
            .from(chapters)
            .where(eq(chapters.chapterNumber, 23))
            .limit(5);

        if (byNumber.length > 0) {
            console.log('\nFound chapters with number 23:');
            byNumber.forEach(ch => {
                console.log(`  - ${ch.uniqueIdentifier || 'N/A'} (${ch.title || 'Untitled'})`);
                console.log(`    ID: ${ch.id}`);
                console.log(`    Chapter Number: ${ch.chapterNumber}`);
            });
        }
    } else {
        console.log('✅ Found matching chapters:\n');
        results.forEach(ch => {
            console.log(`  - ${ch.uniqueIdentifier || 'N/A'} (${ch.title || 'Untitled'})`);
            console.log(`    ID: ${ch.id}`);
            console.log(`    Chapter Number: ${ch.chapterNumber}`);
            console.log('');
        });
    }
}

findChapter()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
