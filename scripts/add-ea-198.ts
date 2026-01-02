#!/usr/bin/env tsx

/**
 * Add EA-198 chapter from l_outline.json to Neon DB
 * Book 5, Chapter 38 (all_chapter 98) - MAT 5.3
 */

import { db } from '../src/lib/db';
import { chapters, books, majorTaskGroups } from '../src/lib/schema';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function sanitizeJsonData(data: any): any {
  if (typeof data === 'string') {
    return data.replace(/\0/g, '');
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeJsonData);
  }
  if (typeof data === 'object' && data !== null) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      cleaned[key] = sanitizeJsonData(value);
    }
    return cleaned;
  }
  return data;
}

function findChapterById(data: any, targetId: string): any {
  function traverse(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return null;
    
    if (obj.id === targetId) {
      return obj;
    }
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const result = traverse(obj[key]);
        if (result) return result;
      }
    }
    
    return null;
  }
  
  return traverse(data);
}

async function addChapter() {
  console.log('🚀 Adding EA-198 to Neon DB...\n');
  
  try {
    const outlineFilePath = resolve(__dirname, '../data/l_outline.json');
    const rawData = readFileSync(outlineFilePath, 'utf-8');
    const outlineData = JSON.parse(rawData);
    
    const chapterId = 'EA-198';
    const bookNumber = 5;
    
    // Get Book 5
    const bookRecord = await db.select({ id: books.id }).from(books).where(eq(books.bookNumber, bookNumber)).limit(1);
    
    if (bookRecord.length === 0) {
      console.log(`❌ Book ${bookNumber} not found in database`);
      process.exit(1);
    }
    
    const bookId = bookRecord[0].id;
    
    console.log(`📖 Processing ${chapterId}...`);
    
    const chapterData = findChapterById(outlineData, chapterId);
    
    if (!chapterData) {
      console.log(`❌ ${chapterId} not found in l_outline.json`);
      process.exit(1);
    }
    
    // Handle novel_book being string or number (may not exist for MAT chapters)
    const chapterBookNumber = chapterData.novel_book 
      ? (typeof chapterData.novel_book === 'string' ? parseInt(chapterData.novel_book) : chapterData.novel_book)
      : bookNumber;
    
    if (chapterBookNumber !== bookNumber) {
      console.log(`⚠️  ${chapterId} belongs to Book ${chapterBookNumber}, not Book ${bookNumber}`);
    }
    
    console.log(`   Title: ${chapterData.specific_task_group_title || chapterData.major_task_group_title || chapterData.title}`);
    console.log(`   unique_identifier: ${chapterData.unique_identifier}`);
    console.log(`   Chapter: ${chapterData.all_chapter} (${chapterData.chapter})\n`);
    
    // Check if chapter already exists
    const existingChapter = await db
      .select()
      .from(chapters)
      .where(
        and(
          eq(chapters.bookId, bookId),
          eq(chapters.chapterNumber, chapterData.all_chapter)
        )
      )
      .limit(1);
    
    let majorTaskGroupId: string | null = null;
    if (chapterData.major_task_group_unique_identifier) {
      const majorTaskGroupRecord = await db.select({ id: majorTaskGroups.id })
        .from(majorTaskGroups)
        .where(eq(majorTaskGroups.uniqueIdentifier, chapterData.major_task_group_unique_identifier))
        .limit(1);
      if (majorTaskGroupRecord.length > 0) {
        majorTaskGroupId = majorTaskGroupRecord[0].id;
      }
    }
    
    // Determine title - handle both STG and MAT chapters
    const title = chapterData.major_task_group_title || 
                 chapterData.specific_task_group_title || 
                 chapterData.title || 
                 `Chapter ${chapterData.all_chapter}`;
    
    // Determine description
    const description = chapterData.major_task_group_description || 
                       chapterData.specific_task_group_description || 
                       chapterData.description || 
                       null;
    
    // Determine tagline
    const tagline = chapterData.major_task_group_tagline || 
                   chapterData.specific_task_group_tagline || 
                   chapterData.tagline || 
                   null;
    
    // Determine books influenced by - handle both STG and MAT chapters
    const booksInfluencedBy = chapterData.major_activity_theme_books_influenced_by || 
                             chapterData.specific_task_group_books_influenced_by || 
                             null;
    
    const chapterDbData = {
      chapterId: chapterData.id,
      uniqueIdentifier: chapterData.unique_identifier.startsWith('EA-') ? null : chapterData.unique_identifier,
      title: title,
      focusArea: chapterData.focus_area,
      focus: chapterData.focus_area,
      epicNovelPages: chapterData.epic_novel_pages,
      epicChapterFocus: chapterData.epic_chapter_focus,
      epicNovelChapterFocus: chapterData.epic_novel_chapter_focus,
      epicNovelSectionName: chapterData.epic_novel_section_name,
      description: description,
      specificTaskGroupDescription: description,
      tarotCardLink: chapterData.tarot_card_link,
      tarotFamily: chapterData.tarot_family || chapterData.new_tarot_family,
      tarotCardItem: chapterData.tarot_card_item,
      colorTheme: chapterData.color_name && chapterData.hex_code ? {
        name: chapterData.color_name,
        hex: chapterData.hex_code,
        rgb: {
          red: chapterData.red || 0,
          green: chapterData.green || 0,
          blue: chapterData.blue || 0,
        },
      } : null,
      type: chapterData.type,
      colorName: chapterData.color_name,
      hexCode: chapterData.hex_code,
      red: chapterData.red,
      green: chapterData.green,
      blue: chapterData.blue,
      connectionToMajorTaskGroup: chapterData.connection_to_the_major_task_group,
      specificTaskGroupTagline: tagline,
      specificTaskGroupBooksInfluencedBy: booksInfluencedBy ? sanitizeJsonData(booksInfluencedBy) : null,
      terminalLearningObjectives: chapterData.terminal_learning_objectives ? sanitizeJsonData(chapterData.terminal_learning_objectives) : null,
      summary: chapterData.summary,
      characterArcs: chapterData.character_arcs ? sanitizeJsonData(chapterData.character_arcs) : null,
      storyGapsAddressed: chapterData.story_gaps_addressed ? sanitizeJsonData(chapterData.story_gaps_addressed) : null,
      epicPreliminarySceneFocus: chapterData.epic_preliminary_scene_focus,
      epicPreliminarySceneDescription: chapterData.epic_preliminary_scene_description,
      newTarotFamily: chapterData.new_tarot_family,
      majorTaskGroupId: majorTaskGroupId,
      iconPath: `/icons/chapters/book${chapterBookNumber}/chapter${chapterData.all_chapter}.png`,
      updatedAt: new Date(),
    };
    
    if (existingChapter.length > 0) {
      // Update existing chapter
      await db
        .update(chapters)
        .set(chapterDbData)
        .where(eq(chapters.id, existingChapter[0].id));
      
      console.log(`✅ Updated: ${chapterId} (Chapter ${chapterData.all_chapter}) - ${title}`);
    } else {
      // Create new chapter
      await db.insert(chapters).values({
        id: uuidv4(),
        bookId: bookId,
        chapterNumber: chapterData.all_chapter,
        majorTaskGroupId: majorTaskGroupId,
        createdAt: new Date(),
        ...chapterDbData,
      });
      
      console.log(`➕ Created: ${chapterId} (Chapter ${chapterData.all_chapter}) - ${title}`);
    }
    
    console.log('\n🎉 Chapter has been added/updated in Neon DB!');
    
  } catch (error) {
    console.error('\n💥 Operation failed:', error);
    process.exit(1);
  }
}

addChapter().catch(console.error);

