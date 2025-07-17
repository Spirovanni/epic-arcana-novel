#!/usr/bin/env tsx

/**
 * Fix missing data for Book 9 chapters 39 and 40
 * Import data from book9_extracted.json
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fixBook9Chapters() {
  console.log('🚀 Fixing Book 9 chapters 39 and 40');
  
  try {
    // Load the book9_extracted.json file
    const book9FilePath = resolve(__dirname, '../lore/book9_extracted.json');
    const rawData = readFileSync(book9FilePath, 'utf-8');
    const book9Data = JSON.parse(rawData);
    
    // Get Book 9 from database
    const book9 = await db.select().from(books).where(eq(books.bookNumber, 9)).limit(1);
    if (book9.length === 0) {
      throw new Error('Book 9 not found in database');
    }
    
    const bookId = book9[0].id;
    
    // Navigate to the specific task groups for chapters 39 and 40
    const taskMasters = book9Data.task_masters;
    let chapter39Data = null;
    let chapter40Data = null;
    
    // Search through task masters for chapters 39 and 40
    for (const taskMasterKey of Object.keys(taskMasters)) {
      const taskMaster = taskMasters[taskMasterKey];
      if (taskMaster.major_task_groups) {
        for (const majorTaskGroupKey of Object.keys(taskMaster.major_task_groups)) {
          const majorTaskGroup = taskMaster.major_task_groups[majorTaskGroupKey];
          if (majorTaskGroup.Specific_task_groups) {
            for (const specificTaskGroupKey of Object.keys(majorTaskGroup.Specific_task_groups)) {
              const specificTaskGroup = majorTaskGroup.Specific_task_groups[specificTaskGroupKey];
              if (specificTaskGroup.chapter === "Chapter 39") {
                chapter39Data = specificTaskGroup;
                console.log('Found Chapter 39 data:', specificTaskGroup.specific_task_group_title);
              }
              if (specificTaskGroup.chapter === "Chapter 40") {
                chapter40Data = specificTaskGroup;
                console.log('Found Chapter 40 data:', specificTaskGroup.specific_task_group_title);
              }
            }
          }
        }
      }
    }
    
    if (!chapter39Data || !chapter40Data) {
      throw new Error('Could not find chapter 39 or 40 data in book9_extracted.json');
    }
    
    // Update Chapter 39
    const chapter39UpdateData = {
      title: chapter39Data.specific_task_group_title,
      specificTaskGroupDescription: chapter39Data.specific_task_group_description,
      colorName: chapter39Data.color_name,
      hexCode: chapter39Data.hex_code,
      red: chapter39Data.red,
      green: chapter39Data.green,
      blue: chapter39Data.blue,
      epicNovelPages: chapter39Data.epic_novel_pages,
      epicChapterFocus: chapter39Data.epic_chapter_focus,
      focusArea: chapter39Data.focus_area,
      specificTaskGroupTagline: chapter39Data.specific_task_group_tagline,
      specificTaskGroupBooksInfluencedBy: chapter39Data.specific_task_group_books_influenced_by,
      updatedAt: new Date()
    };
    
    await db
      .update(chapters)
      .set(chapter39UpdateData)
      .where(and(eq(chapters.bookId, bookId), eq(chapters.chapterNumber, 39)));
    
    console.log('✅ Updated Chapter 39: Knowledge');
    
    // Update Chapter 40
    const chapter40UpdateData = {
      title: chapter40Data.specific_task_group_title,
      specificTaskGroupDescription: chapter40Data.specific_task_group_description,
      colorName: chapter40Data.color_name,
      hexCode: chapter40Data.hex_code,
      red: chapter40Data.red,
      green: chapter40Data.green,
      blue: chapter40Data.blue,
      epicNovelPages: chapter40Data.epic_novel_pages,
      epicChapterFocus: chapter40Data.epic_chapter_focus,
      focusArea: chapter40Data.focus_area,
      specificTaskGroupTagline: chapter40Data.specific_task_group_tagline,
      specificTaskGroupBooksInfluencedBy: chapter40Data.specific_task_group_books_influenced_by,
      updatedAt: new Date()
    };
    
    await db
      .update(chapters)
      .set(chapter40UpdateData)
      .where(and(eq(chapters.bookId, bookId), eq(chapters.chapterNumber, 40)));
    
    console.log('✅ Updated Chapter 40: Kingdom');
    
    console.log('\n🎉 Book 9 chapters 39 and 40 have been successfully updated!');
    console.log('📊 Chapters should now appear properly on the website');
    
  } catch (error) {
    console.error('\n💥 Fix operation failed:', error);
    process.exit(1);
  }
}

// Run the fix
fixBook9Chapters().catch(console.error);