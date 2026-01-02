#!/usr/bin/env tsx

/**
 * Verify Book 1 chapters have all their data populated
 */

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function verifyBook1Chapters() {
  console.log('🔍 Verifying Book 1 chapters...\n');
  
  try {
    const book1 = await db.select({ id: books.id }).from(books).where(eq(books.bookNumber, 1)).limit(1);
    
    if (book1.length === 0) {
      console.log('❌ Book 1 not found');
      process.exit(1);
    }
    
    const book1Id = book1[0].id;
    
    // Get all chapters ordered by chapter number
    const allChapters = await db.select({
      chapterNumber: chapters.chapterNumber,
      chapterId: chapters.chapterId,
      title: chapters.title,
      uniqueIdentifier: chapters.uniqueIdentifier,
      description: chapters.description,
      summary: chapters.summary,
      focusArea: chapters.focusArea,
      tarotFamily: chapters.tarotFamily,
      colorName: chapters.colorName,
      characterArcs: chapters.characterArcs,
      storyGapsAddressed: chapters.storyGapsAddressed,
      specificTaskGroupBooksInfluencedBy: chapters.specificTaskGroupBooksInfluencedBy,
      terminalLearningObjectives: chapters.terminalLearningObjectives,
    })
    .from(chapters)
    .where(eq(chapters.bookId, book1Id))
    .orderBy(chapters.chapterNumber);
    
    console.log(`📊 Found ${allChapters.length} chapters in database\n`);
    
    // Check for gaps in chapter numbers
    const chapterNumbers = allChapters.map(ch => ch.chapterNumber).sort((a, b) => a - b);
    const missing = [];
    for (let i = 1; i <= 40; i++) {
      if (!chapterNumbers.includes(i)) {
        missing.push(i);
      }
    }
    
    if (missing.length > 0) {
      console.log(`⚠️  Missing chapter numbers: ${missing.join(', ')}\n`);
    } else {
      console.log('✅ All chapters 1-40 are present\n');
    }
    
    // Count chapters with various data fields
    let withTitle = 0;
    let withDescription = 0;
    let withSummary = 0;
    let withFocusArea = 0;
    let withTarotFamily = 0;
    let withColorName = 0;
    let withCharacterArcs = 0;
    let withStoryGaps = 0;
    let withBooksInfluenced = 0;
    let withLearningObjectives = 0;
    
    for (const ch of allChapters) {
      if (ch.title) withTitle++;
      if (ch.description) withDescription++;
      if (ch.summary) withSummary++;
      if (ch.focusArea) withFocusArea++;
      if (ch.tarotFamily) withTarotFamily++;
      if (ch.colorName) withColorName++;
      if (ch.characterArcs) withCharacterArcs++;
      if (ch.storyGapsAddressed) withStoryGaps++;
      if (ch.specificTaskGroupBooksInfluencedBy) withBooksInfluenced++;
      if (ch.terminalLearningObjectives) withLearningObjectives++;
    }
    
    console.log('📊 Data Population Statistics:');
    console.log(`   Chapters with title: ${withTitle}/${allChapters.length}`);
    console.log(`   Chapters with description: ${withDescription}/${allChapters.length}`);
    console.log(`   Chapters with summary: ${withSummary}/${allChapters.length}`);
    console.log(`   Chapters with focus area: ${withFocusArea}/${allChapters.length}`);
    console.log(`   Chapters with tarot family: ${withTarotFamily}/${allChapters.length}`);
    console.log(`   Chapters with color name: ${withColorName}/${allChapters.length}`);
    console.log(`   Chapters with character arcs: ${withCharacterArcs}/${allChapters.length}`);
    console.log(`   Chapters with story gaps addressed: ${withStoryGaps}/${allChapters.length}`);
    console.log(`   Chapters with books influenced by: ${withBooksInfluenced}/${allChapters.length}`);
    console.log(`   Chapters with learning objectives: ${withLearningObjectives}/${allChapters.length}\n`);
    
    // Show sample of chapters
    console.log('📖 Sample chapters (first 5):');
    for (let i = 0; i < Math.min(5, allChapters.length); i++) {
      const ch = allChapters[i];
      console.log(`   Chapter ${ch.chapterNumber} (${ch.chapterId || 'N/A'}): ${ch.title || 'No title'}`);
      console.log(`      - Unique ID: ${ch.uniqueIdentifier || 'N/A'}`);
      console.log(`      - Has description: ${ch.description ? 'Yes' : 'No'}`);
      console.log(`      - Has summary: ${ch.summary ? 'Yes' : 'No'}`);
      console.log(`      - Has character arcs: ${ch.characterArcs ? 'Yes' : 'No'}`);
      console.log('');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  }
}

verifyBook1Chapters().catch(console.error);

