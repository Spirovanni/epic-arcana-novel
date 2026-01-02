#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function verify() {
  const book1 = await db.select({ id: books.id }).from(books).where(eq(books.bookNumber, 1)).limit(1);
  
  const chapter17 = await db.select({
    id: chapters.id,
    chapterId: chapters.chapterId,
    uniqueIdentifier: chapters.uniqueIdentifier,
    title: chapters.title,
    description: chapters.description,
    summary: chapters.summary,
    focusArea: chapters.focusArea,
    tarotFamily: chapters.tarotFamily,
    characterArcs: chapters.characterArcs,
    storyGapsAddressed: chapters.storyGapsAddressed,
  }).from(chapters).where(and(eq(chapters.bookId, book1[0].id), eq(chapters.chapterNumber, 17))).limit(1);
  
  if (chapter17.length === 0) {
    console.log('❌ Chapter 17 not found');
    process.exit(1);
  }
  
  const ch = chapter17[0];
  
  console.log('✅ EA-017 Chapter 17 Verification:');
  console.log(`   Chapter ID: ${ch.chapterId || 'N/A'}`);
  console.log(`   Unique Identifier: ${ch.uniqueIdentifier || 'N/A'}`);
  console.log(`   Title: ${ch.title || 'N/A'}`);
  console.log(`   Focus Area: ${ch.focusArea || 'N/A'}`);
  console.log(`   Tarot Family: ${ch.tarotFamily || 'N/A'}`);
  console.log(`   Description: ${ch.description ? 'YES (' + ch.description.substring(0, 60) + '...)' : 'NO'}`);
  console.log(`   Summary: ${ch.summary ? 'YES (' + ch.summary.substring(0, 60) + '...)' : 'NO'}`);
  console.log(`   Character Arcs: ${ch.characterArcs ? 'YES (JSON data)' : 'NO'}`);
  console.log(`   Story Gaps Addressed: ${ch.storyGapsAddressed ? 'YES (JSON data)' : 'NO'}`);
  
  process.exit(0);
}

verify().catch(console.error);

