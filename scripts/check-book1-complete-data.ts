#!/usr/bin/env tsx

/**
 * Script to check Book 1 chapters for complete data population
 */

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, asc } from 'drizzle-orm';

async function checkBook1CompleteData() {
  try {
    // Get Book 1 first
    const book1 = await db.select().from(books).where(eq(books.bookNumber, 1)).limit(1);
    
    if (book1.length === 0) {
      console.log('❌ Book 1 not found in database');
      return;
    }

    console.log(`📚 Found Book 1: ${book1[0].title} (ID: ${book1[0].id})`);

    // Get chapters for Book 1
    const bookChapters = await db.select({
      chapterNumber: chapters.chapterNumber,
      title: chapters.title,
      focus: chapters.focus,
      focusArea: chapters.focusArea,
      epicNovelPages: chapters.epicNovelPages,
      epicChapterFocus: chapters.epicChapterFocus,
      epicNovelSectionName: chapters.epicNovelSectionName,
      specificTaskGroupTagline: chapters.specificTaskGroupTagline,
      tarotFamily: chapters.tarotFamily,
      tarotCardItem: chapters.tarotCardItem,
      colorName: chapters.colorName,
      hexCode: chapters.hexCode,
      terminalLearningObjectives: chapters.terminalLearningObjectives,
      specificTaskGroupBooksInfluencedBy: chapters.specificTaskGroupBooksInfluencedBy
    }).from(chapters)
      .where(eq(chapters.bookId, book1[0].id))
      .orderBy(asc(chapters.chapterNumber));
    
    console.log(`\\n📊 Book 1 Chapter Data Completeness Check (${bookChapters.length} chapters):\\n`);
    
    // Check data completeness for each chapter
    for (const chapter of bookChapters) {
      const completeness = {
        title: !!chapter.title && chapter.title !== `Chapter ${chapter.chapterNumber}`,
        focus: !!chapter.focus,
        focusArea: !!chapter.focusArea,
        epicPages: !!chapter.epicNovelPages,
        epicFocus: !!chapter.epicChapterFocus,
        sectionName: !!chapter.epicNovelSectionName,
        tagline: !!chapter.specificTaskGroupTagline,
        tarotFamily: !!chapter.tarotFamily,
        tarotCard: !!chapter.tarotCardItem,
        colorTheme: !!chapter.colorName && !!chapter.hexCode,
        learningObjectives: !!chapter.terminalLearningObjectives && chapter.terminalLearningObjectives !== '{}',
        booksInfluenced: !!chapter.specificTaskGroupBooksInfluencedBy && chapter.specificTaskGroupBooksInfluencedBy !== '{}'
      };
      
      const completeFields = Object.values(completeness).filter(Boolean).length;
      const totalFields = Object.keys(completeness).length;
      const percentage = Math.round((completeFields / totalFields) * 100);
      
      const status = percentage >= 90 ? '✅ COMPLETE' : percentage >= 70 ? '🟡 PARTIAL' : '❌ INCOMPLETE';
      
      console.log(`Chapter ${chapter.chapterNumber}: ${status} (${percentage}% - ${completeFields}/${totalFields} fields)`);
      console.log(`  📝 Title: ${chapter.title || 'Missing'}`);
      console.log(`  🎯 Focus: ${chapter.focus || 'Missing'}`);
      console.log(`  📖 Pages: ${chapter.epicNovelPages || 'Missing'}`);
      console.log(`  🎨 Color: ${chapter.colorName || 'Missing'} (${chapter.hexCode || 'Missing'})`);
      console.log(`  🔮 Tarot: ${chapter.tarotFamily || 'Missing'} ${chapter.tarotCardItem || 'Missing'}`);
      console.log(`  💡 Tagline: ${chapter.specificTaskGroupTagline ? 'Present' : 'Missing'}`);
      console.log(`  🎓 Learning Objectives: ${completeness.learningObjectives ? 'Present' : 'Missing'}`);
      console.log(`  📚 Books Influenced: ${completeness.booksInfluenced ? 'Present' : 'Missing'}`);
      console.log('');
    }
    
    // Summary
    const completeChapters = bookChapters.filter(chapter => {
      const completeness = {
        title: !!chapter.title && chapter.title !== `Chapter ${chapter.chapterNumber}`,
        focus: !!chapter.focus,
        focusArea: !!chapter.focusArea,
        epicPages: !!chapter.epicNovelPages,
        epicFocus: !!chapter.epicChapterFocus,
        sectionName: !!chapter.epicNovelSectionName,
        tagline: !!chapter.specificTaskGroupTagline,
        tarotFamily: !!chapter.tarotFamily,
        tarotCard: !!chapter.tarotCardItem,
        colorTheme: !!chapter.colorName && !!chapter.hexCode,
        learningObjectives: !!chapter.terminalLearningObjectives && chapter.terminalLearningObjectives !== '{}',
        booksInfluenced: !!chapter.specificTaskGroupBooksInfluencedBy && chapter.specificTaskGroupBooksInfluencedBy !== '{}'
      };
      
      const completeFields = Object.values(completeness).filter(Boolean).length;
      const totalFields = Object.keys(completeness).length;
      return (completeFields / totalFields) >= 0.9;
    });
    
    console.log(`\\n📈 Summary: ${completeChapters.length}/${bookChapters.length} chapters are complete (≥90% fields populated)`);

  } catch (error) {
    console.error('❌ Error checking Book 1 complete data:', error);
  }
}

checkBook1CompleteData();