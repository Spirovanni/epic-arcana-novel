#!/usr/bin/env tsx

/**
 * Comprehensive script to repopulate ALL chapter data from l_outline.json
 * This script updates all approved columns (excluding removed scene-specific fields)
 */

import { db } from '../src/lib/db';
import { chapters, books, majorTaskGroups } from '../src/lib/schema';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { eq, and } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ChapterData {
  id: string; // EA-XXX
  unique_identifier: string; // STG X.X.X.X or MAT X.X
  chapter: string; // e.g., "Chapter 13"
  novel_book: number;
  all_chapter: number;
  specific_task_group_title: string;
  focus_area?: string;
  epic_novel_pages?: string;
  epic_chapter_focus?: string;
  epic_novel_chapter_focus?: string;
  epic_novel_section_name?: string;
  specific_task_group_description?: string;
  tarot_card_link?: string;
  tarot_family?: string;
  tarot_card_item?: string;
  color_name?: string;
  hex_code?: string;
  red?: number;
  green?: number;
  blue?: number;
  type?: string;
  connection_to_the_major_task_group?: string;
  specific_task_group_tagline?: string;
  specific_task_group_books_influenced_by?: any;
  terminal_learning_objectives?: any;
  summary?: string;
  epic_preliminary_scene_focus?: string;
  epic_preliminary_scene_description?: string;
  new_tarot_family?: string;
  major_task_group_unique_identifier?: string;
}

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

function extractAllChapters(outlineData: any): ChapterData[] {
  const extractedChapters: ChapterData[] = [];
  
  const traverse = (node: any, currentBookNumber?: number, currentMajorTaskGroupId?: string) => {
    if (typeof node !== 'object' || node === null) return;
    
    // Extract book number
    if (node.novel_book && typeof node.novel_book === 'number') {
      currentBookNumber = node.novel_book;
    }
    
    // Extract Major Task Group unique_identifier
    if (node.unique_identifier && typeof node.unique_identifier === 'string' && node.unique_identifier.startsWith('MAT ')) {
      currentMajorTaskGroupId = node.unique_identifier;
    }
    
    // Check if this node is a chapter (EA- ID)
    if (node.id && typeof node.id === 'string' && node.id.startsWith('EA-') &&
        node.unique_identifier && typeof node.unique_identifier === 'string' &&
        node.chapter && typeof node.chapter === 'string' &&
        node.novel_book && typeof node.novel_book === 'number' &&
        node.all_chapter && typeof node.all_chapter === 'number' &&
        node.specific_task_group_title && typeof node.specific_task_group_title === 'string') {
      
      extractedChapters.push({
        id: node.id,
        unique_identifier: node.unique_identifier,
        chapter: node.chapter,
        novel_book: node.novel_book,
        all_chapter: node.all_chapter,
        specific_task_group_title: node.specific_task_group_title,
        focus_area: node.focus_area,
        epic_novel_pages: node.epic_novel_pages,
        epic_chapter_focus: node.epic_chapter_focus,
        epic_novel_chapter_focus: node.epic_novel_chapter_focus,
        epic_novel_section_name: node.epic_novel_section_name,
        specific_task_group_description: node.specific_task_group_description,
        tarot_card_link: node.tarot_card_link,
        tarot_family: node.tarot_family,
        tarot_card_item: node.tarot_card_item,
        color_name: node.color_name,
        hex_code: node.hex_code,
        red: node.red,
        green: node.green,
        blue: node.blue,
        type: node.type,
        connection_to_the_major_task_group: node.connection_to_the_major_task_group,
        specific_task_group_tagline: node.specific_task_group_tagline,
        specific_task_group_books_influenced_by: node.specific_task_group_books_influenced_by,
        terminal_learning_objectives: node.terminal_learning_objectives,
        summary: node.summary,
        epic_preliminary_scene_focus: node.epic_preliminary_scene_focus,
        epic_preliminary_scene_description: node.epic_preliminary_scene_description,
        new_tarot_family: node.new_tarot_family,
        major_task_group_unique_identifier: currentMajorTaskGroupId,
      });
    }
    
    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        traverse(node[key], currentBookNumber, currentMajorTaskGroupId);
      }
    }
  };
  
  traverse(outlineData);
  
  extractedChapters.sort((a, b) => {
    if (a.novel_book !== b.novel_book) {
      return a.novel_book - b.novel_book;
    }
    return a.all_chapter - b.all_chapter;
  });
  
  return extractedChapters;
}

async function repopulateAllChapters() {
  console.log('🚀 Starting comprehensive chapter data repopulation...\n');
  
  try {
    const outlineFilePath = resolve(__dirname, '../data/l_outline.json');
    const rawData = readFileSync(outlineFilePath, 'utf-8');
    const outlineData = JSON.parse(rawData);
    
    const allChaptersFromOutline = extractAllChapters(outlineData);
    console.log(`📚 Found ${allChaptersFromOutline.length} chapters in l_outline.json\n`);
    
    // Get all books
    const allBooks = await db.select({ id: books.id, bookNumber: books.bookNumber }).from(books);
    const bookNumberToId = new Map<number, string>();
    for (const book of allBooks) {
      bookNumberToId.set(book.bookNumber, book.id);
    }
    
    // Get all existing chapters
    const existingChapters = await db.select({
      id: chapters.id,
      bookId: chapters.bookId,
      chapterNumber: chapters.chapterNumber,
      chapterId: chapters.chapterId,
    }).from(chapters);
    
    const existingByBookAndNumber = new Map<string, { id: string; chapterId: string | null }>();
    for (const chapter of existingChapters) {
      const key = `${chapter.bookId}-${chapter.chapterNumber}`;
      existingByBookAndNumber.set(key, { id: chapter.id, chapterId: chapter.chapterId });
    }
    
    console.log(`📊 Processing ${allChaptersFromOutline.length} chapters...\n`);
    
    let updatedCount = 0;
    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const chapterData of allChaptersFromOutline) {
      try {
        const bookId = bookNumberToId.get(chapterData.novel_book);
        if (!bookId) {
          console.warn(`⚠️  Skipped: Book ${chapterData.novel_book} not found for chapter ${chapterData.all_chapter}`);
          skippedCount++;
          continue;
        }
        
        const key = `${bookId}-${chapterData.all_chapter}`;
        const existing = existingByBookAndNumber.get(key);
        
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
        
        const updateData = {
          chapterId: chapterData.id, // EA-XXX
          uniqueIdentifier: chapterData.unique_identifier.startsWith('EA-') ? null : chapterData.unique_identifier,
          title: chapterData.specific_task_group_title,
          focusArea: chapterData.focus_area,
          epicNovelPages: chapterData.epic_novel_pages,
          epicChapterFocus: chapterData.epic_chapter_focus,
          epicNovelChapterFocus: chapterData.epic_novel_chapter_focus,
          epicNovelSectionName: chapterData.epic_novel_section_name,
          description: chapterData.specific_task_group_description,
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
          focus: chapterData.focus_area,
          connectionToMajorTaskGroup: chapterData.connection_to_the_major_task_group,
          specificTaskGroupDescription: chapterData.specific_task_group_description,
          specificTaskGroupTagline: chapterData.specific_task_group_tagline,
          specificTaskGroupBooksInfluencedBy: sanitizeJsonData(chapterData.specific_task_group_books_influenced_by),
          terminalLearningObjectives: sanitizeJsonData(chapterData.terminal_learning_objectives),
          summary: chapterData.summary,
          epicPreliminarySceneFocus: chapterData.epic_preliminary_scene_focus,
          epicPreliminarySceneDescription: chapterData.epic_preliminary_scene_description,
          newTarotFamily: chapterData.new_tarot_family,
          majorTaskGroupId: majorTaskGroupId,
          updatedAt: new Date(),
        };
        
        if (existing) {
          // Update existing chapter
          await db
            .update(chapters)
            .set(updateData)
            .where(eq(chapters.id, existing.id));
          
          updatedCount++;
          if (updatedCount <= 10 || updatedCount % 50 === 0) {
            console.log(`✅ Updated: Book ${chapterData.novel_book}, Chapter ${chapterData.all_chapter} (${chapterData.id}) - ${chapterData.specific_task_group_title}`);
          }
        } else {
          // Create new chapter
          await db.insert(chapters).values({
            id: crypto.randomUUID(),
            bookId: bookId,
            chapterNumber: chapterData.all_chapter,
            majorTaskGroupId: majorTaskGroupId,
            createdAt: new Date(),
            ...updateData,
          });
          
          createdCount++;
          if (createdCount <= 10 || createdCount % 50 === 0) {
            console.log(`➕ Created: Book ${chapterData.novel_book}, Chapter ${chapterData.all_chapter} (${chapterData.id}) - ${chapterData.specific_task_group_title}`);
          }
        }
      } catch (error: any) {
        errorCount++;
        if (errorCount <= 10) {
          console.error(`❌ Error processing chapter ${chapterData.id}:`, error.message);
        }
      }
    }
    
    console.log('\n📊 Repopulation Summary:');
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   ➕ Created: ${createdCount}`);
    console.log(`   ⚠️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total processed: ${allChaptersFromOutline.length}`);
    console.log('\n🎉 All chapter data has been repopulated from l_outline.json!');
    
  } catch (error) {
    console.error('\n💥 Repopulation failed:', error);
    process.exit(1);
  }
}

repopulateAllChapters().catch(console.error);

