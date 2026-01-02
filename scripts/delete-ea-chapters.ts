#!/usr/bin/env tsx

/**
 * Delete all chapters where unique_identifier starts with 'EA-'
 * Handles all foreign key constraints by deleting dependent records first
 */

import { db } from '../src/lib/db';
import { 
  chapters, 
  chapterPages, 
  chapterTasks, 
  scenes, 
  taskGroups, 
  chapterWritingGuidance,
  learningResourceChapters,
  connectionPoints,
  terminalLearningObjectives
} from '../src/lib/schema';
import { eq, like, sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function deleteEAChapters() {
  console.log('🗑️  Starting deletion of chapters with unique_identifier starting with "EA-"...\n');
  
  try {
    // First, find all chapters with unique_identifier starting with 'EA-'
    const eaChapters = await db
      .select({
        id: chapters.id,
        chapterId: chapters.chapterId,
        uniqueIdentifier: chapters.uniqueIdentifier,
        title: chapters.title,
        chapterNumber: chapters.chapterNumber,
        bookId: chapters.bookId,
      })
      .from(chapters)
      .where(like(chapters.uniqueIdentifier, 'EA-%'));
    
    if (eaChapters.length === 0) {
      console.log('✅ No chapters found with unique_identifier starting with "EA-"');
      return;
    }
    
    console.log(`📋 Found ${eaChapters.length} chapters to delete:\n`);
    
    // Show first 10 chapters
    for (let i = 0; i < Math.min(10, eaChapters.length); i++) {
      const ch = eaChapters[i];
      console.log(`   ${i + 1}. ${ch.chapterId || 'N/A'} - ${ch.uniqueIdentifier} - ${ch.title || 'No title'} (Chapter ${ch.chapterNumber})`);
    }
    if (eaChapters.length > 10) {
      console.log(`   ... and ${eaChapters.length - 10} more\n`);
    } else {
      console.log('');
    }
    
    let deletedCount = 0;
    let errorCount = 0;
    let dependentRecordsDeleted = {
      scenes: 0,
      chapterPages: 0,
      chapterTasks: 0,
      taskGroups: 0,
      chapterWritingGuidance: 0,
    };
    
    // Delete each chapter and its dependencies
    for (const chapter of eaChapters) {
      try {
        const chapterId = chapter.id;
        
        // Delete dependent records first (tables without CASCADE)
        // These need to be deleted manually before deleting the chapter
        
        // 1. Delete scenes
        try {
          const scenesBefore = await db.select().from(scenes).where(eq(scenes.chapterId, chapterId));
          await db.delete(scenes).where(eq(scenes.chapterId, chapterId));
          dependentRecordsDeleted.scenes += scenesBefore.length;
        } catch (e: any) {
          // Ignore if no scenes exist or other errors
          if (!e.message.includes('does not exist')) {
            console.log(`   ⚠️  Warning deleting scenes for chapter ${chapter.id}: ${e.message}`);
          }
        }
        
        // 2. Delete chapter pages
        try {
          const pagesBefore = await db.select().from(chapterPages).where(eq(chapterPages.chapterId, chapterId));
          await db.delete(chapterPages).where(eq(chapterPages.chapterId, chapterId));
          dependentRecordsDeleted.chapterPages += pagesBefore.length;
        } catch (e: any) {
          if (!e.message.includes('does not exist')) {
            console.log(`   ⚠️  Warning deleting pages for chapter ${chapter.id}: ${e.message}`);
          }
        }
        
        // 3. Delete chapter tasks
        try {
          const tasksBefore = await db.select().from(chapterTasks).where(eq(chapterTasks.chapterId, chapterId));
          await db.delete(chapterTasks).where(eq(chapterTasks.chapterId, chapterId));
          dependentRecordsDeleted.chapterTasks += tasksBefore.length;
        } catch (e: any) {
          if (!e.message.includes('does not exist')) {
            console.log(`   ⚠️  Warning deleting tasks for chapter ${chapter.id}: ${e.message}`);
          }
        }
        
        // 4. Delete task groups
        try {
          const taskGroupsBefore = await db.select().from(taskGroups).where(eq(taskGroups.chapterId, chapterId));
          await db.delete(taskGroups).where(eq(taskGroups.chapterId, chapterId));
          dependentRecordsDeleted.taskGroups += taskGroupsBefore.length;
        } catch (e: any) {
          if (!e.message.includes('does not exist')) {
            console.log(`   ⚠️  Warning deleting task groups for chapter ${chapter.id}: ${e.message}`);
          }
        }
        
        // 5. Delete chapter writing guidance
        try {
          const guidanceBefore = await db.select().from(chapterWritingGuidance).where(eq(chapterWritingGuidance.chapterId, chapterId));
          await db.delete(chapterWritingGuidance).where(eq(chapterWritingGuidance.chapterId, chapterId));
          dependentRecordsDeleted.chapterWritingGuidance += guidanceBefore.length;
        } catch (e: any) {
          if (!e.message.includes('does not exist')) {
            console.log(`   ⚠️  Warning deleting guidance for chapter ${chapter.id}: ${e.message}`);
          }
        }
        
        // Note: learningResourceChapters, connectionPoints, and terminalLearningObjectives
        // have CASCADE delete, so they will be automatically deleted when we delete the chapter
        
        // Now delete the chapter itself
        await db.delete(chapters).where(eq(chapters.id, chapterId));
        deletedCount++;
        
        if (deletedCount <= 10 || deletedCount % 50 === 0) {
          console.log(`   ✅ Deleted: ${chapter.chapterId || 'N/A'} - ${chapter.uniqueIdentifier} - ${chapter.title || 'No title'}`);
        }
      } catch (error: any) {
        errorCount++;
        if (errorCount <= 10) {
          console.error(`   ❌ Error deleting chapter ${chapter.id} (${chapter.uniqueIdentifier}):`, error.message);
        }
      }
    }
    
    if (errorCount > 10) {
      console.log(`   ⚠️  ... and ${errorCount - 10} more errors`);
    }
    
    console.log('\n📊 Deletion Summary:');
    console.log(`   ✅ Chapters deleted: ${deletedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📋 Dependent records deleted:`);
    console.log(`      - Scenes: ${dependentRecordsDeleted.scenes}`);
    console.log(`      - Chapter Pages: ${dependentRecordsDeleted.chapterPages}`);
    console.log(`      - Chapter Tasks: ${dependentRecordsDeleted.chapterTasks}`);
    console.log(`      - Task Groups: ${dependentRecordsDeleted.taskGroups}`);
    console.log(`      - Chapter Writing Guidance: ${dependentRecordsDeleted.chapterWritingGuidance}`);
    console.log(`   ℹ️  Note: Learning resource relationships (with CASCADE) were automatically deleted`);
    
    console.log('\n🎉 Deletion completed!');
    
  } catch (error) {
    console.error('\n💥 Operation failed:', error);
    process.exit(1);
  }
}

deleteEAChapters().catch(console.error);

