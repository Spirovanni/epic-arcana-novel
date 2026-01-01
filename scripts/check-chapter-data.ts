#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function checkData() {
  const totalCount = await db.select({ count: sql<number>`count(*)::int` }).from(chapters);
  const sampleChapters = await db.select({
    id: chapters.id,
    chapterId: chapters.chapterId,
    uniqueIdentifier: chapters.uniqueIdentifier,
    title: chapters.title,
    chapterNumber: chapters.chapterNumber,
    description: chapters.description,
    summary: chapters.summary,
  }).from(chapters).limit(10);

  console.log(`📊 Total chapters in database: ${totalCount[0].count}\n`);
  console.log('📋 Sample chapters:');
  sampleChapters.forEach(ch => {
    console.log(`   Chapter ${ch.chapterNumber}: ${ch.chapterId || 'NO ID'} - ${ch.title || 'NO TITLE'}`);
    console.log(`      uniqueIdentifier: ${ch.uniqueIdentifier || 'NONE'}`);
    console.log(`      description: ${ch.description ? 'YES' : 'NO'}`);
    console.log(`      summary: ${ch.summary ? 'YES' : 'NO'}`);
    console.log('');
  });

  process.exit(0);
}

checkData().catch(console.error);
