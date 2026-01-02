#!/usr/bin/env tsx

/**
 * Populate missing data for Chapters 5 and 6 (EA-005 and EA-006)
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

async function populateChapters5And6() {
  console.log('🚀 Populating Chapters 5 and 6 with all available data...\n');
  
  try {
    const outlineFilePath = resolve(__dirname, '../data/l_outline.json');
    const rawData = readFileSync(outlineFilePath, 'utf-8');
    const outlineData = JSON.parse(rawData);
    
    // Get Book 1
    const book1Record = await db.select({ id: books.id }).from(books).where(eq(books.bookNumber, 1)).limit(1);
    
    if (book1Record.length === 0) {
      console.log('❌ Book 1 not found in database');
      process.exit(1);
    }
    
    const book1Id = book1Record[0].id;
    
    // Process EA-005 (Chapter 5)
    console.log('📖 Processing EA-005 (Chapter 5)...');
    const chapter5Data = findChapterById(outlineData, 'EA-005');
    
    if (!chapter5Data) {
      console.log('❌ EA-005 not found in l_outline.json');
    } else {
      const existingChapter5 = await db
        .select()
        .from(chapters)
        .where(
          and(
            eq(chapters.bookId, book1Id),
            eq(chapters.chapterNumber, 5)
          )
        )
        .limit(1);
      
      if (existingChapter5.length === 0) {
        console.log('⚠️  Chapter 5 not found in database');
      } else {
        const updateData5: any = {
          chapterId: chapter5Data.id,
          uniqueIdentifier: chapter5Data.unique_identifier.startsWith('EA-') ? null : chapter5Data.unique_identifier,
          title: chapter5Data.specific_task_group_title || chapter5Data.title,
          focusArea: chapter5Data.focus_area || null,
          focus: chapter5Data.focus_area || null,
          epicNovelPages: chapter5Data.epic_novel_pages || null,
          epicChapterFocus: chapter5Data.epic_chapter_focus || null,
          epicNovelChapterFocus: chapter5Data.epic_novel_chapter_focus || null,
          epicNovelSectionName: chapter5Data.epic_novel_section_name || null,
          description: chapter5Data.specific_task_group_description || null,
          specificTaskGroupDescription: chapter5Data.specific_task_group_description || null,
          tarotCardLink: chapter5Data.tarot_card_link || null,
          tarotFamily: chapter5Data.tarot_family || chapter5Data.new_tarot_family || null,
          tarotCardItem: chapter5Data.tarot_card_item || null,
          type: chapter5Data.type || null,
          colorName: chapter5Data.color_name || null,
          hexCode: chapter5Data.hex_code || null,
          red: chapter5Data.red ?? null,
          green: chapter5Data.green ?? null,
          blue: chapter5Data.blue ?? null,
          connectionToMajorTaskGroup: chapter5Data.connection_to_the_major_task_group || null,
          specificTaskGroupTagline: chapter5Data.specific_task_group_tagline || null,
          specificTaskGroupBooksInfluencedBy: chapter5Data.specific_task_group_books_influenced_by ? sanitizeJsonData(chapter5Data.specific_task_group_books_influenced_by) : null,
          summary: chapter5Data.summary || null,
          characterArcs: chapter5Data.character_arcs ? sanitizeJsonData(chapter5Data.character_arcs) : null,
          storyGapsAddressed: chapter5Data.story_gaps_addressed ? sanitizeJsonData(chapter5Data.story_gaps_addressed) : null,
          epicPreliminarySceneFocus: chapter5Data.epic_preliminary_scene_focus || null,
          epicPreliminarySceneDescription: chapter5Data.epic_preliminary_scene_description || null,
          newTarotFamily: chapter5Data.new_tarot_family || null,
          updatedAt: new Date(),
        };
        
        if (chapter5Data.color_name && chapter5Data.hex_code) {
          updateData5.colorTheme = {
            name: chapter5Data.color_name,
            hex: chapter5Data.hex_code,
            rgb: {
              red: chapter5Data.red || 0,
              green: chapter5Data.green || 0,
              blue: chapter5Data.blue || 0,
            },
          };
        }
        
        await db
          .update(chapters)
          .set(updateData5)
          .where(eq(chapters.id, existingChapter5[0].id));
        
        console.log('✅ Updated Chapter 5 with all available data:');
        console.log(`   Title: ${updateData5.title}`);
        console.log(`   Description: ${updateData5.description ? 'Yes' : 'No'}`);
        console.log(`   Summary: ${updateData5.summary ? 'Yes' : 'No'}`);
        console.log(`   Character Arcs: ${updateData5.characterArcs ? 'Yes' : 'No'}`);
        console.log(`   Story Gaps: ${updateData5.storyGapsAddressed ? 'Yes' : 'No'}`);
        console.log(`   Books Influenced: ${updateData5.specificTaskGroupBooksInfluencedBy ? 'Yes' : 'No'}\n`);
      }
    }
    
    // Process EA-006 (Chapter 6)
    console.log('📖 Processing EA-006 (Chapter 6)...');
    const chapter6Data = findChapterById(outlineData, 'EA-006');
    
    if (!chapter6Data) {
      console.log('❌ EA-006 not found in l_outline.json');
    } else {
      const existingChapter6 = await db
        .select()
        .from(chapters)
        .where(
          and(
            eq(chapters.bookId, book1Id),
            eq(chapters.chapterNumber, 6)
          )
        )
        .limit(1);
      
      if (existingChapter6.length === 0) {
        console.log('⚠️  Chapter 6 not found in database');
      } else {
        const updateData6: any = {
          chapterId: chapter6Data.id,
          uniqueIdentifier: chapter6Data.unique_identifier.startsWith('EA-') ? null : chapter6Data.unique_identifier,
          title: chapter6Data.specific_task_group_title || chapter6Data.title,
          focusArea: chapter6Data.focus_area || null,
          focus: chapter6Data.focus_area || null,
          epicNovelPages: chapter6Data.epic_novel_pages || null,
          epicChapterFocus: chapter6Data.epic_chapter_focus || null,
          epicNovelChapterFocus: chapter6Data.epic_novel_chapter_focus || null,
          epicNovelSectionName: chapter6Data.epic_novel_section_name || null,
          description: chapter6Data.specific_task_group_description || null,
          specificTaskGroupDescription: chapter6Data.specific_task_group_description || null,
          tarotCardLink: chapter6Data.tarot_card_link || null,
          tarotFamily: chapter6Data.tarot_family || chapter6Data.new_tarot_family || null,
          tarotCardItem: chapter6Data.tarot_card_item || null,
          type: chapter6Data.type || null,
          colorName: chapter6Data.color_name || null,
          hexCode: chapter6Data.hex_code || null,
          red: chapter6Data.red ?? null,
          green: chapter6Data.green ?? null,
          blue: chapter6Data.blue ?? null,
          connectionToMajorTaskGroup: chapter6Data.connection_to_the_major_task_group || null,
          specificTaskGroupTagline: chapter6Data.specific_task_group_tagline || null,
          specificTaskGroupBooksInfluencedBy: chapter6Data.specific_task_group_books_influenced_by ? sanitizeJsonData(chapter6Data.specific_task_group_books_influenced_by) : null,
          summary: chapter6Data.summary || null,
          characterArcs: chapter6Data.character_arcs ? sanitizeJsonData(chapter6Data.character_arcs) : null,
          storyGapsAddressed: chapter6Data.story_gaps_addressed ? sanitizeJsonData(chapter6Data.story_gaps_addressed) : null,
          epicPreliminarySceneFocus: chapter6Data.epic_preliminary_scene_focus || null,
          epicPreliminarySceneDescription: chapter6Data.epic_preliminary_scene_description || null,
          newTarotFamily: chapter6Data.new_tarot_family || null,
          updatedAt: new Date(),
        };
        
        if (chapter6Data.color_name && chapter6Data.hex_code) {
          updateData6.colorTheme = {
            name: chapter6Data.color_name,
            hex: chapter6Data.hex_code,
            rgb: {
              red: chapter6Data.red || 0,
              green: chapter6Data.green || 0,
              blue: chapter6Data.blue || 0,
            },
          };
        }
        
        await db
          .update(chapters)
          .set(updateData6)
          .where(eq(chapters.id, existingChapter6[0].id));
        
        console.log('✅ Updated Chapter 6 with all available data:');
        console.log(`   Title: ${updateData6.title}`);
        console.log(`   Description: ${updateData6.description ? 'Yes' : 'No'}`);
        console.log(`   Summary: ${updateData6.summary ? 'Yes' : 'No'}`);
        console.log(`   Character Arcs: ${updateData6.characterArcs ? 'Yes' : 'No'}`);
        console.log(`   Story Gaps: ${updateData6.storyGapsAddressed ? 'Yes' : 'No'}`);
        console.log(`   Books Influenced: ${updateData6.specificTaskGroupBooksInfluencedBy ? 'Yes' : 'No'}\n`);
      }
    }
    
    console.log('🎉 Chapters 5 and 6 have been populated with all available data from l_outline.json!');
    
  } catch (error) {
    console.error('\n💥 Population failed:', error);
    process.exit(1);
  }
}

populateChapters5And6().catch(console.error);

