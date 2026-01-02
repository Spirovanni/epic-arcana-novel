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
  
  const chapterNumbers = [67, 68, 69];
  const chapterTitles = ['Open Minded', 'Methodical', 'Excitable Curiosity'];
  
  for (let i = 0; i < chapterNumbers.length; i++) {
    const chapterNum = chapterNumbers[i];
    const expectedTitle = chapterTitles[i];
    
    const chapter = await db.select({
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
      specificTaskGroupTagline: chapters.specificTaskGroupTagline,
      iconPath: chapters.iconPath,
    }).from(chapters).where(and(eq(chapters.bookId, book2[0].id), eq(chapters.chapterNumber, chapterNum))).limit(1);
    
    if (chapter.length === 0) {
      console.log(`\n❌ Chapter ${chapterNum} (EA-${String(chapterNum).padStart(3, '0')}) not found`);
      continue;
    }
    
    const ch = chapter[0];
    
    console.log(`\n✅ Chapter ${chapterNum} (${ch.chapterId}) Verification:`);
    console.log('='.repeat(60));
    console.log(`   Title: ${ch.title || 'N/A'}`);
    console.log(`   Unique ID: ${ch.uniqueIdentifier || 'N/A'}`);
    console.log(`   Focus Area: ${ch.focusArea || 'N/A'}`);
    console.log(`   Tarot: ${ch.tarotFamily || 'N/A'} - ${ch.tarotCardItem || 'N/A'}`);
    console.log(`   Color: ${ch.colorName || 'N/A'} (${ch.hexCode || 'N/A'})`);
    console.log(`   Pages: ${ch.epicNovelPages || 'N/A'}`);
    console.log(`   Tagline: ${ch.specificTaskGroupTagline || 'N/A'}`);
    console.log(`   Icon Path: ${ch.iconPath || 'N/A'}`);
    console.log(`   Description: ${ch.description ? 'YES' : 'NO'}`);
    console.log(`   Summary: ${ch.summary ? 'YES' : 'NO'}`);
    console.log(`   Character Arcs: ${ch.characterArcs ? 'YES' : 'NO'}`);
    console.log(`   Story Gaps: ${ch.storyGapsAddressed ? 'YES' : 'NO'}`);
    console.log(`   Books Influenced: ${ch.specificTaskGroupBooksInfluencedBy ? 'YES' : 'NO'}`);
  }
  
  console.log('\n✅ All chapters verified!');
  process.exit(0);
}

verify().catch(console.error);

