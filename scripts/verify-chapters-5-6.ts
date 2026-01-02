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
  
  for (const chapterNum of [5, 6]) {
    const chapter = await db.select({
      chapterNumber: chapters.chapterNumber,
      chapterId: chapters.chapterId,
      title: chapters.title,
      uniqueIdentifier: chapters.uniqueIdentifier,
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
      epicNovelChapterFocus: chapters.epicNovelChapterFocus,
      epicNovelSectionName: chapters.epicNovelSectionName,
      connectionToMajorTaskGroup: chapters.connectionToMajorTaskGroup,
      specificTaskGroupTagline: chapters.specificTaskGroupTagline,
      epicPreliminarySceneFocus: chapters.epicPreliminarySceneFocus,
      epicPreliminarySceneDescription: chapters.epicPreliminarySceneDescription,
    }).from(chapters).where(and(eq(chapters.bookId, book1[0].id), eq(chapters.chapterNumber, chapterNum))).limit(1);
    
    if (chapter.length === 0) {
      console.log(`❌ Chapter ${chapterNum} not found`);
      continue;
    }
    
    const ch = chapter[0];
    
    console.log(`\n✅ Chapter ${chapterNum} (${ch.chapterId}) Verification:`);
    console.log(`   Title: ${ch.title || 'N/A'}`);
    console.log(`   Unique ID: ${ch.uniqueIdentifier || 'N/A'}`);
    console.log(`   Description: ${ch.description ? 'YES (' + ch.description.substring(0, 60) + '...)' : 'NO'}`);
    console.log(`   Summary: ${ch.summary ? 'YES (' + ch.summary.substring(0, 60) + '...)' : 'NO'}`);
    console.log(`   Focus Area: ${ch.focusArea || 'N/A'}`);
    console.log(`   Tarot Family: ${ch.tarotFamily || 'N/A'}`);
    console.log(`   Color: ${ch.colorName || 'N/A'} (${ch.hexCode || 'N/A'})`);
    console.log(`   Character Arcs: ${ch.characterArcs ? 'YES (JSON data)' : 'NO'}`);
    console.log(`   Story Gaps Addressed: ${ch.storyGapsAddressed ? 'YES (JSON data)' : 'NO'}`);
    console.log(`   Books Influenced By: ${ch.specificTaskGroupBooksInfluencedBy ? 'YES (JSON data)' : 'NO'}`);
    console.log(`   Epic Novel Pages: ${ch.epicNovelPages || 'N/A'}`);
    console.log(`   Epic Chapter Focus: ${ch.epicChapterFocus || 'N/A'}`);
    console.log(`   Epic Novel Chapter Focus: ${ch.epicNovelChapterFocus || 'N/A'}`);
    console.log(`   Epic Novel Section Name: ${ch.epicNovelSectionName || 'N/A'}`);
    console.log(`   Connection to Major Task Group: ${ch.connectionToMajorTaskGroup ? 'YES' : 'NO'}`);
    console.log(`   Tagline: ${ch.specificTaskGroupTagline || 'N/A'}`);
    console.log(`   Epic Preliminary Scene Focus: ${ch.epicPreliminarySceneFocus || 'N/A'}`);
    console.log(`   Epic Preliminary Scene Description: ${ch.epicPreliminarySceneDescription ? 'YES' : 'NO'}`);
  }
  
  process.exit(0);
}

verify().catch(console.error);

