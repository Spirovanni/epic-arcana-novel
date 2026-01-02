#!/usr/bin/env tsx

/**
 * Comprehensive script to populate ALL Book 1 chapters from l_outline.json
 * Extracts all available data points and maps them to database columns
 * Handles both STG (specific_task_group) and MAT (major_activity_theme) chapters
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

interface ChapterData {
  id: string; // EA-XXX
  unique_identifier: string; // STG X.X.X.X or MAT X.X
  chapter: string; // e.g., "Chapter 13"
  novel_book: number;
  all_chapter: number;
  // STG chapters use specific_task_group_*
  specific_task_group_title?: string;
  // MAT chapters use major_task_group_title
  major_task_group_title?: string;
  title?: string; // Fallback
  focus_area?: string;
  epic_novel_pages?: string;
  epic_chapter_focus?: string;
  epic_novel_chapter_focus?: string;
  epic_novel_section_name?: string;
  specific_task_group_description?: string;
  major_task_group_description?: string;
  description?: string; // Fallback
  tarot_card_link?: string;
  tarot_family?: string;
  new_tarot_family?: string;
  tarot_card_item?: string;
  color_name?: string;
  hex_code?: string;
  red?: number;
  green?: number;
  blue?: number;
  type?: string;
  connection_to_the_major_task_group?: string;
  specific_task_group_tagline?: string;
  major_task_group_tagline?: string;
  tagline?: string; // Fallback
  specific_task_group_books_influenced_by?: any;
  major_activity_theme_books_influenced_by?: any;
  terminal_learning_objectives?: any;
  summary?: string;
  character_arcs?: any;
  story_gaps_addressed?: any;
  epic_preliminary_scene_focus?: string;
  epic_preliminary_scene_description?: string;
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

function extractBook1Chapters(outlineData: any): ChapterData[] {
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
    
    // Check if this node is a Book 1 chapter (EA- ID and novel_book === 1)
    if (node.id && typeof node.id === 'string' && node.id.startsWith('EA-') &&
        node.novel_book === 1 &&
        node.all_chapter && typeof node.all_chapter === 'number') {
      
      // Must have either specific_task_group_title OR major_task_group_title OR title
      const hasTitle = node.specific_task_group_title || node.major_task_group_title || node.title;
      
      if (hasTitle && node.unique_identifier) {
        extractedChapters.push({
          id: node.id,
          unique_identifier: node.unique_identifier,
          chapter: node.chapter || `Chapter ${node.all_chapter}`,
          novel_book: node.novel_book,
          all_chapter: node.all_chapter,
          specific_task_group_title: node.specific_task_group_title,
          major_task_group_title: node.major_task_group_title,
          title: node.title,
          focus_area: node.focus_area,
          epic_novel_pages: node.epic_novel_pages,
          epic_chapter_focus: node.epic_chapter_focus,
          epic_novel_chapter_focus: node.epic_novel_chapter_focus,
          epic_novel_section_name: node.epic_novel_section_name,
          specific_task_group_description: node.specific_task_group_description,
          major_task_group_description: node.major_task_group_description,
          description: node.description,
          tarot_card_link: node.tarot_card_link,
          tarot_family: node.tarot_family,
          new_tarot_family: node.new_tarot_family,
          tarot_card_item: node.tarot_card_item,
          color_name: node.color_name,
          hex_code: node.hex_code,
          red: node.red,
          green: node.green,
          blue: node.blue,
          type: node.type,
          connection_to_the_major_task_group: node.connection_to_the_major_task_group,
          specific_task_group_tagline: node.specific_task_group_tagline,
          major_task_group_tagline: node.major_task_group_tagline,
          tagline: node.tagline,
          specific_task_group_books_influenced_by: node.specific_task_group_books_influenced_by,
          major_activity_theme_books_influenced_by: node.major_activity_theme_books_influenced_by,
          terminal_learning_objectives: node.terminal_learning_objectives,
          summary: node.summary,
          character_arcs: node.character_arcs,
          story_gaps_addressed: node.story_gaps_addressed,
          epic_preliminary_scene_focus: node.epic_preliminary_scene_focus,
          epic_preliminary_scene_description: node.epic_preliminary_scene_description,
          major_task_group_unique_identifier: currentMajorTaskGroupId,
        });
      }
    }
    
    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        traverse(node[key], currentBookNumber, currentMajorTaskGroupId);
      }
    }
  };
  
  traverse(outlineData);
  
  // Sort by chapter number
  extractedChapters.sort((a, b) => a.all_chapter - b.all_chapter);
  
  return extractedChapters;
}

async function populateBook1Chapters() {
  console.log('🚀 Starting comprehensive Book 1 chapter population...\n');
  
  try {
    const outlineFilePath = resolve(__dirname, '../data/l_outline.json');
    console.log(`📖 Loading l_outline.json from: ${outlineFilePath}`);
    const rawData = readFileSync(outlineFilePath, 'utf-8');
    const outlineData = JSON.parse(rawData);
    
    const book1Chapters = extractBook1Chapters(outlineData);
    console.log(`📚 Found ${book1Chapters.length} Book 1 chapters in l_outline.json\n`);
    
    if (book1Chapters.length === 0) {
      console.log('❌ No Book 1 chapters found!');
      process.exit(1);
    }
    
    // Get Book 1
    const book1Record = await db.select({ id: books.id }).from(books).where(eq(books.bookNumber, 1)).limit(1);
    
    if (book1Record.length === 0) {
      console.log('❌ Book 1 not found in database');
      process.exit(1);
    }
    
    const book1Id = book1Record[0].id;
    
    // Get all existing Book 1 chapters
    const existingChapters = await db.select({
      id: chapters.id,
      chapterNumber: chapters.chapterNumber,
      chapterId: chapters.chapterId,
    }).from(chapters).where(eq(chapters.bookId, book1Id));
    
    const existingByChapterNumber = new Map<number, { id: string; chapterId: string | null }>();
    for (const chapter of existingChapters) {
      existingByChapterNumber.set(chapter.chapterNumber, { id: chapter.id, chapterId: chapter.chapterId });
    }
    
    console.log(`📊 Processing ${book1Chapters.length} chapters...\n`);
    
    let updatedCount = 0;
    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const chapterData of book1Chapters) {
      try {
        const existing = existingByChapterNumber.get(chapterData.all_chapter);
        
        // Resolve major task group if applicable
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
        
        // Determine title - MAT chapters use major_task_group_title, STG use specific_task_group_title
        const title = chapterData.major_task_group_title || 
                     chapterData.specific_task_group_title || 
                     chapterData.title || 
                     `Chapter ${chapterData.all_chapter}`;
        
        // Determine description - MAT chapters use major_task_group_description
        const description = chapterData.major_task_group_description || 
                           chapterData.specific_task_group_description || 
                           chapterData.description || 
                           null;
        
        // Determine tagline
        const tagline = chapterData.major_task_group_tagline || 
                       chapterData.specific_task_group_tagline || 
                       chapterData.tagline || 
                       null;
        
        // Determine books influenced by - MAT chapters use major_activity_theme_books_influenced_by
        const booksInfluencedBy = chapterData.major_activity_theme_books_influenced_by || 
                                 chapterData.specific_task_group_books_influenced_by || 
                                 null;
        
        // Build comprehensive chapter data
        const chapterDbData: any = {
          chapterId: chapterData.id, // EA-XXX
          uniqueIdentifier: chapterData.unique_identifier.startsWith('EA-') ? null : chapterData.unique_identifier,
          title: title,
          focusArea: chapterData.focus_area || null,
          focus: chapterData.focus_area || null, // Also set focus field
          epicNovelPages: chapterData.epic_novel_pages || null,
          epicChapterFocus: chapterData.epic_chapter_focus || null,
          epicNovelChapterFocus: chapterData.epic_novel_chapter_focus || null,
          epicNovelSectionName: chapterData.epic_novel_section_name || null,
          description: description,
          specificTaskGroupDescription: description, // Also set specificTaskGroupDescription
          tarotCardLink: chapterData.tarot_card_link || null,
          tarotFamily: chapterData.tarot_family || chapterData.new_tarot_family || null,
          tarotCardItem: chapterData.tarot_card_item || null,
          type: chapterData.type || null,
          colorName: chapterData.color_name || null,
          hexCode: chapterData.hex_code || null,
          red: chapterData.red ?? null,
          green: chapterData.green ?? null,
          blue: chapterData.blue ?? null,
          connectionToMajorTaskGroup: chapterData.connection_to_the_major_task_group || null,
          specificTaskGroupTagline: tagline,
          specificTaskGroupBooksInfluencedBy: booksInfluencedBy ? sanitizeJsonData(booksInfluencedBy) : null,
          terminalLearningObjectives: chapterData.terminal_learning_objectives ? sanitizeJsonData(chapterData.terminal_learning_objectives) : null,
          summary: chapterData.summary || null,
          characterArcs: chapterData.character_arcs ? sanitizeJsonData(chapterData.character_arcs) : null,
          storyGapsAddressed: chapterData.story_gaps_addressed ? sanitizeJsonData(chapterData.story_gaps_addressed) : null,
          epicPreliminarySceneFocus: chapterData.epic_preliminary_scene_focus || null,
          epicPreliminarySceneDescription: chapterData.epic_preliminary_scene_description || null,
          newTarotFamily: chapterData.new_tarot_family || null,
          majorTaskGroupId: majorTaskGroupId,
          updatedAt: new Date(),
        };
        
        // Build colorTheme JSONB object if color data exists
        if (chapterData.color_name && chapterData.hex_code) {
          chapterDbData.colorTheme = {
            name: chapterData.color_name,
            hex: chapterData.hex_code,
            rgb: {
              red: chapterData.red || 0,
              green: chapterData.green || 0,
              blue: chapterData.blue || 0,
            },
          };
        } else {
          chapterDbData.colorTheme = null;
        }
        
        if (existing) {
          // Update existing chapter
          await db
            .update(chapters)
            .set(chapterDbData)
            .where(eq(chapters.id, existing.id));
          
          updatedCount++;
          console.log(`✅ Updated: Chapter ${chapterData.all_chapter} (${chapterData.id}) - ${title}`);
        } else {
          // Create new chapter
          await db.insert(chapters).values({
            id: uuidv4(),
            bookId: book1Id,
            chapterNumber: chapterData.all_chapter,
            createdAt: new Date(),
            ...chapterDbData,
          });
          
          createdCount++;
          console.log(`➕ Created: Chapter ${chapterData.all_chapter} (${chapterData.id}) - ${title}`);
        }
      } catch (error: any) {
        errorCount++;
        console.error(`❌ Error processing chapter ${chapterData.id} (Chapter ${chapterData.all_chapter}):`, error.message);
      }
    }
    
    console.log('\n📊 Population Summary:');
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   ➕ Created: ${createdCount}`);
    console.log(`   ⚠️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total processed: ${book1Chapters.length}`);
    console.log('\n🎉 All Book 1 chapters have been populated from l_outline.json!');
    
  } catch (error) {
    console.error('\n💥 Population failed:', error);
    process.exit(1);
  }
}

populateBook1Chapters().catch(console.error);

