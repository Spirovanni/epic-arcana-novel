#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function verify() {
  const book2 = await db.select({ id: books.id }).from(books).where(eq(books.bookNumber, 2)).limit(1);
  
  if (book2.length === 0) {
    console.log('❌ Book 2 not found');
    process.exit(1);
  }
  
  const chapter63 = await db.select({
    id: chapters.id,
    chapterId: chapters.chapterId,
    chapterNumber: chapters.chapterNumber,
    uniqueIdentifier: chapters.uniqueIdentifier,
    title: chapters.title,
    description: chapters.description,
    summary: chapters.summary,
    focusArea: chapters.focusArea,
    tarotFamily: chapters.tarotFamily,
    tarotCardItem: chapters.tarotCardItem,
    colorName: chapters.colorName,
    hexCode: chapters.hexCode,
    characterArcs: chapters.characterArcs,
    storyGapsAddressed: chapters.storyGapsAddressed,
    specificTaskGroupBooksInfluencedBy: chapters.specificTaskGroupBooksInfluencedBy,
    epicNovelPages: chapters.epicNovelPages,
    epicChapterFocus: chapters.epicChapterFocus,
    epicNovelChapterFocus: chapters.epicNovelChapterFocus,
    specificTaskGroupTagline: chapters.specificTaskGroupTagline,
    iconPath: chapters.iconPath,
  }).from(chapters).where(and(eq(chapters.bookId, book2[0].id), eq(chapters.chapterNumber, 63))).limit(1);
  
  if (chapter63.length === 0) {
    console.log('❌ Chapter EA-063 (Chapter 63, Book 2) not found');
    process.exit(1);
  }
  
  const ch = chapter63[0];
  
  console.log('✅ EA-063 Chapter 63 (Book 2, Chapter 23) Verification:');
  console.log('='.repeat(60));
  console.log(`   Chapter ID: ${ch.chapterId || 'N/A'}`);
  console.log(`   Chapter Number: ${ch.chapterNumber}`);
  console.log(`   Unique Identifier: ${ch.uniqueIdentifier || 'N/A'}`);
  console.log(`   Title: ${ch.title || 'N/A'}`);
  console.log(`   Focus Area: ${ch.focusArea || 'N/A'}`);
  console.log(`   Tarot Family: ${ch.tarotFamily || 'N/A'}`);
  console.log(`   Tarot Card Item: ${ch.tarotCardItem || 'N/A'}`);
  console.log(`   Color: ${ch.colorName || 'N/A'} (${ch.hexCode || 'N/A'})`);
  console.log(`   Epic Novel Pages: ${ch.epicNovelPages || 'N/A'}`);
  console.log(`   Epic Chapter Focus: ${ch.epicChapterFocus || 'N/A'}`);
  console.log(`   Epic Novel Chapter Focus: ${ch.epicNovelChapterFocus || 'N/A'}`);
  console.log(`   Tagline: ${ch.specificTaskGroupTagline || 'N/A'}`);
  console.log(`   Icon Path: ${ch.iconPath || 'N/A'}`);
  console.log(`   Description: ${ch.description ? 'YES (' + ch.description.substring(0, 60) + '...)' : 'NO'}`);
  console.log(`   Summary: ${ch.summary ? 'YES (' + ch.summary.substring(0, 60) + '...)' : 'NO'}`);
  console.log(`   Character Arcs: ${ch.characterArcs ? 'YES (JSON data)' : 'NO'}`);
  console.log(`   Story Gaps Addressed: ${ch.storyGapsAddressed ? 'YES (JSON data)' : 'NO'}`);
  console.log(`   Books Influenced By: ${ch.specificTaskGroupBooksInfluencedBy ? 'YES (JSON data)' : 'NO'}`);
  
  process.exit(0);
}

verify().catch(console.error);

