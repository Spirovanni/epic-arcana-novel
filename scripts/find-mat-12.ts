#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { chapters } from '../src/lib/schema';
import { like, eq } from 'drizzle-orm';

async function findMat12() {
    console.log('🔍 Searching for MAT 1.2 (EA-023)...\n');

    const results = await db
        .select({
            id: chapters.id,
            chapterNumber: chapters.chapterNumber,
            title: chapters.title,
            uniqueIdentifier: chapters.uniqueIdentifier,
        })
        .from(chapters)
        .where(like(chapters.uniqueIdentifier, '%MAT 1.2%'));

    if (results.length > 0) {
        console.log('✅ Found:\n');
        results.forEach(ch => {
            console.log(`Chapter: ${ch.uniqueIdentifier || 'N/A'}`);
            console.log(`Title: ${ch.title || 'Untitled'}`);
            console.log(`ID: ${ch.id}`);
            console.log(`Chapter Number: ${ch.chapterNumber}\n`);
        });
    } else {
        console.log('❌ No chapter found with MAT 1.2 identifier');
    }
}

findMat12()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
