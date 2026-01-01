#!/usr/bin/env tsx

/**
 * Add MAT (Major Activity Theme) chapters from l_outline.json
 * These chapters have unique_identifier starting with "MAT" instead of "STG"
 * Example: EA-013 with unique_identifier "MAT 1.1"
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

interface MatChapterData {
  id: string; // EA-XXX
  unique_identifier: string; // MAT X.X
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
  summary?: string;
  pov?: string;
  tense?: string;
  core_emotion?: string;
  scene_tone?: string;
}

function extractMatChapters(outlineData: any): MatChapterData[] {
  const extractedChapters: MatChapterData[] = [];
  
  const traverse = (node: any) => {
    if (typeof node !== 'object' || node === null) return;
    
    // Check if this node is a MAT chapter (EA- ID, MAT unique_identifier)
    if (node.id && typeof node.id === 'string' && node.id.startsWith('EA-') &&
        node.unique_identifier && typeof node.unique_identifier === 'string' &&
        node.unique_identifier.startsWith('MAT ') &&
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
        summary: node.summary,
        pov: node.pov,
        tense: node.tense,
        core_emotion: node.core_emotion,
        scene_tone: node.scene_tone,
      });
    }
    
    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        traverse(node[key]);
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

async function addMatChapters() {
  console.log('🔍 Finding MAT chapters in l_outline.json...\n');
  
  try {
    const outlineFilePath = resolve(__dirname, '../data/l_outline.json');
    const rawData = readFileSync(outlineFilePath, 'utf-8');
    const outlineData = JSON.parse(rawData);
    
    const allMatChapters = extractMatChapters(outlineData);
    console.log(`📚 Found ${allMatChapters.length} MAT chapters in l_outline.json\n`);
    
    if (allMatChapters.length === 0) {
      console.log('⚠️  No MAT chapters found in outline file.');
      return;
    }
    
    // Show first few
    console.log('📋 MAT chapters found:');
    for (const chapter of allMatChapters.slice(0, 10)) {
      console.log(`   Book ${chapter.novel_book}, Chapter ${chapter.all_chapter}: ${chapter.id} (${chapter.unique_identifier}) - ${chapter.specific_task_group_title}`);
    }
    if (allMatChapters.length > 10) {
      console.log(`   ... and ${allMatChapters.length - 10} more\n`);
    } else {
      console.log('');
    }
    
    // Check which ones already exist
    const existingChapters = await db.select({
      chapterId: chapters.chapterId,
      bookId: chapters.bookId,
      chapterNumber: chapters.chapterNumber,
    }).from(chapters);
    
    const existingChapterIds = new Set(existingChapters.map(c => c.chapterId).filter(Boolean));
    
    const missingMatChapters = allMatChapters.filter(c => !existingChapterIds.has(c.id));
    console.log(`📊 Already in database: ${allMatChapters.length - missingMatChapters.length}`);
    console.log(`📋 Missing from database: ${missingMatChapters.length}\n`);
    
    if (missingMatChapters.length === 0) {
      console.log('✅ All MAT chapters are already in the database!');
      return;
    }
    
    // Get all books
    const allBooks = await db.select({ id: books.id, bookNumber: books.bookNumber }).from(books);
    const bookNumberToId = new Map<number, string>();
    for (const book of allBooks) {
      bookNumberToId.set(book.bookNumber, book.id);
    }
    
    console.log(`➕ Adding ${missingMatChapters.length} MAT chapters...\n`);
    
    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const chapterData of missingMatChapters) {
      try {
        const bookId = bookNumberToId.get(chapterData.novel_book);
        if (!bookId) {
          console.warn(`⚠️  Skipped: Book ${chapterData.novel_book} not found for chapter ${chapterData.all_chapter}`);
          skippedCount++;
          continue;
        }
        
        // Check if chapter already exists by book + chapter number
        const existingByNumber = await db
          .select()
          .from(chapters)
          .where(
            and(
              eq(chapters.bookId, bookId),
              eq(chapters.chapterNumber, chapterData.all_chapter)
            )
          )
          .limit(1);
        
        if (existingByNumber.length > 0) {
          // Update existing chapter with MAT data
          await db
            .update(chapters)
            .set({
              chapterId: chapterData.id,
              uniqueIdentifier: chapterData.unique_identifier, // MAT X.X
              title: chapterData.specific_task_group_title,
              focusArea: chapterData.focus_area,
              epicNovelPages: chapterData.epic_novel_pages,
              epicChapterFocus: chapterData.epic_chapter_focus,
              epicNovelChapterFocus: chapterData.epic_novel_chapter_focus,
              epicNovelSectionName: chapterData.epic_novel_section_name,
              description: chapterData.specific_task_group_description,
              tarotCardLink: chapterData.tarot_card_link,
              tarotFamily: chapterData.tarot_family,
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
              colorName: chapterData.color_name,
              hexCode: chapterData.hex_code,
              red: chapterData.red,
              green: chapterData.green,
              blue: chapterData.blue,
              focus: chapterData.focus_area,
              connectionToMajorTaskGroup: chapterData.connection_to_the_major_task_group,
              specificTaskGroupDescription: chapterData.specific_task_group_description,
              specificTaskGroupTagline: chapterData.specific_task_group_tagline,
              summary: chapterData.summary,
              pov: chapterData.pov,
              tense: chapterData.tense,
              coreEmotion: chapterData.core_emotion,
              sceneTone: chapterData.scene_tone,
              updatedAt: new Date(),
            })
            .where(eq(chapters.id, existingByNumber[0].id));
          
          console.log(`✅ Updated: Book ${chapterData.novel_book}, Chapter ${chapterData.all_chapter} (${chapterData.id})`);
          createdCount++;
        } else {
          // Create new chapter
          const newChapterId = uuidv4();
          
          await db.insert(chapters).values({
            id: newChapterId,
            bookId: bookId,
            chapterNumber: chapterData.all_chapter,
            chapterId: chapterData.id, // EA-XXX
            uniqueIdentifier: chapterData.unique_identifier, // MAT X.X
            title: chapterData.specific_task_group_title,
            focusArea: chapterData.focus_area,
            epicNovelPages: chapterData.epic_novel_pages,
            epicChapterFocus: chapterData.epic_chapter_focus,
            epicNovelChapterFocus: chapterData.epic_novel_chapter_focus,
            epicNovelSectionName: chapterData.epic_novel_section_name,
            description: chapterData.specific_task_group_description,
            tarotCardLink: chapterData.tarot_card_link,
            tarotFamily: chapterData.tarot_family,
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
            colorName: chapterData.color_name,
            hexCode: chapterData.hex_code,
            red: chapterData.red,
            green: chapterData.green,
            blue: chapterData.blue,
            focus: chapterData.focus_area,
            connectionToMajorTaskGroup: chapterData.connection_to_the_major_task_group,
            specificTaskGroupDescription: chapterData.specific_task_group_description,
            specificTaskGroupTagline: chapterData.specific_task_group_tagline,
            summary: chapterData.summary,
            pov: chapterData.pov,
            tense: chapterData.tense,
            coreEmotion: chapterData.core_emotion,
            sceneTone: chapterData.scene_tone,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          
          console.log(`✅ Created: Book ${chapterData.novel_book}, Chapter ${chapterData.all_chapter} (${chapterData.id})`);
          createdCount++;
        }
      } catch (error: any) {
        console.error(`❌ Error processing chapter ${chapterData.id}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`   ✅ Created/Updated: ${createdCount}`);
    console.log(`   ⚠️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
  } catch (error) {
    console.error('\n💥 Operation failed:', error);
    process.exit(1);
  }
}

addMatChapters().catch(console.error);

