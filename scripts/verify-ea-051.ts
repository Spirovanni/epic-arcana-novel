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
  
  const chapter51 = await db.select({
    id: chapters.id,
    chapterId: chapters.chapterId,
    chapterNumber: chapters.chapterNumber,
    uniqueIdentifier: chapters.uniqueIdentifier,
    title: chapters.title,
    description: chapters.description,
    summary: chapters.summary,
    focusArea: chapters.focusArea,
    tarotFamily: chapters.tarotFamily,
    colorName: chapters.colorName,
    hexCode: chapters.hexCode,
    characterArcs: chapters.characterArcs,
    storyGapsAddressed: chapters.storyGapsAddressed,
    specificTaskGroupBooksInfluencedBy: chapters.specificTaskGroupBooksInfluencedBy,
    epicNovelPages: chapters.epicNovelPages,
    epicChapterFocus: chapters.epicChapterFocus,
    iconPath: chapters.iconPath,
  }).from(chapters).where(and(eq(chapters.bookId, book2[0].id), eq(chapters.chapterNumber, 51))).limit(1);
  
  if (chapter51.length === 0) {
    console.log('❌ Chapter EA-051 (Chapter 51, Book 2) not found');
    process.exit(1);
  }
  
  const ch = chapter51[0];
  
  console.log('✅ EA-051 Chapter 51 (Book 2, Chapter 11) Verification:');
  console.log('='.repeat(60));
  console.log(`   Chapter ID: ${ch.chapterId || 'N/A'}`);
  console.log(`   Chapter Number: ${ch.chapterNumber}`);
  console.log(`   Unique Identifier: ${ch.uniqueIdentifier || 'N/A'}`);
  console.log(`   Title: ${ch.title || 'N/A'}`);
  console.log(`   Focus Area: ${ch.focusArea || 'N/A'}`);
  console.log(`   Tarot Family: ${ch.tarotFamily || 'N/A'}`);
  console.log(`   Color: ${ch.colorName || 'N/A'} (${ch.hexCode || 'N/A'})`);
  console.log(`   Epic Novel Pages: ${ch.epicNovelPages || 'N/A'}`);
  console.log(`   Epic Chapter Focus: ${ch.epicChapterFocus || 'N/A'}`);
  console.log(`   Icon Path: ${ch.iconPath || 'N/A'}`);
  console.log(`   Description: ${ch.description ? 'YES (' + ch.description.substring(0, 60) + '...)' : 'NO'}`);
  console.log(`   Summary: ${ch.summary ? 'YES (' + ch.summary.substring(0, 60) + '...)' : 'NO'}`);
  console.log(`   Character Arcs: ${ch.characterArcs ? 'YES (JSON data)' : 'NO'}`);
  console.log(`   Story Gaps Addressed: ${ch.storyGapsAddressed ? 'YES (JSON data)' : 'NO'}`);
  console.log(`   Books Influenced By: ${ch.specificTaskGroupBooksInfluencedBy ? 'YES (JSON data)' : 'NO'}`);
  
  process.exit(0);
}

verify().catch(console.error);

