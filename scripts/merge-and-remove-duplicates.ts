#!/usr/bin/env tsx

/**
 * Merge duplicate chapters and remove duplicates
 * Combines data from duplicate entries (keeps non-null values)
 */

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { sql, eq, and, inArray } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function mergeDuplicates() {
  console.log('🔍 Finding and merging duplicate chapters...\n');
  
  try {
    // Find duplicates by book_id + chapter_number
    const duplicates = await db.execute(sql`
      SELECT 
        book_id,
        chapter_number,
        COUNT(*) as count,
        STRING_AGG(id::text, ', ' ORDER BY created_at) as ids
      FROM chapters
      GROUP BY book_id, chapter_number
      HAVING COUNT(*) > 1
      ORDER BY book_id, chapter_number;
    `);
    
    if (duplicates.rows.length === 0) {
      console.log('✅ No duplicates found!\n');
      return;
    }
    
    console.log(`📋 Found ${duplicates.rows.length} duplicate groups\n`);
    
    let mergedCount = 0;
    let deletedCount = 0;
    
    // Get all books for reference
    const allBooks = await db.select({ id: books.id, bookNumber: books.bookNumber }).from(books);
    const bookIdToNumber = new Map<string, number>();
    for (const book of allBooks) {
      bookIdToNumber.set(book.id, book.bookNumber);
    }
    
    for (const dup of duplicates.rows as any[]) {
      const ids = dup.ids.split(', ').map((id: string) => id.trim());
      const bookNum = bookIdToNumber.get(dup.book_id) || '?';
      
      console.log(`\n📖 Processing Book ${bookNum}, Chapter ${dup.chapter_number} (${ids.length} duplicates):`);
      
      // Get all duplicate chapters with full data
      const duplicateChapters = await db.select().from(chapters).where(inArray(chapters.id, ids));
      
      if (duplicateChapters.length < 2) {
        console.log('   ⚠️  Only one chapter found, skipping...');
        continue;
      }
      
      // Sort by creation date (keep the oldest one as base)
      duplicateChapters.sort((a, b) => 
        (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0)
      );
      
      const baseChapter = duplicateChapters[0];
      const others = duplicateChapters.slice(1);
      
      console.log(`   Base chapter: ${baseChapter.id.substring(0, 8)}... (created: ${baseChapter.createdAt})`);
      
      // Merge data from other chapters into base
      const mergedData: any = { ...baseChapter };
      
      for (const other of others) {
        console.log(`   Merging from: ${other.id.substring(0, 8)}...`);
        
        // Merge all fields - keep non-null values
        for (const key in other) {
          if (key === 'id' || key === 'createdAt' || key === 'updatedAt') continue;
          
          const otherValue = (other as any)[key];
          const currentValue = mergedData[key];
          
          // If current is null/empty and other has a value, use other's value
          if ((currentValue === null || currentValue === undefined || currentValue === '') && 
              otherValue !== null && otherValue !== undefined && otherValue !== '') {
            mergedData[key] = otherValue;
            console.log(`      ✅ Merged ${key}: ${typeof otherValue === 'string' ? otherValue.substring(0, 50) + '...' : otherValue}`);
          }
          // If both are objects (like colorTheme), merge them
          else if (typeof currentValue === 'object' && currentValue !== null && 
                   typeof otherValue === 'object' && otherValue !== null) {
            const merged = { ...currentValue, ...otherValue };
            // Only update if we got new data
            if (JSON.stringify(merged) !== JSON.stringify(currentValue)) {
              mergedData[key] = merged;
              console.log(`      ✅ Merged object ${key}`);
            }
          }
        }
      }
      
      // Update the base chapter with merged data
      mergedData.updatedAt = new Date();
      
      // Remove id, createdAt from update data (these shouldn't change)
      delete mergedData.id;
      delete mergedData.createdAt;
      
      await db
        .update(chapters)
        .set(mergedData)
        .where(eq(chapters.id, baseChapter.id));
      
      console.log(`   ✅ Updated base chapter with merged data`);
      mergedCount++;
      
      // Delete the duplicate chapters
      const idsToDelete = others.map(c => c.id);
      await db.delete(chapters).where(inArray(chapters.id, idsToDelete));
      
      console.log(`   🗑️  Deleted ${idsToDelete.length} duplicate chapter(s)`);
      deletedCount += idsToDelete.length;
    }
    
    console.log('\n📊 Summary:');
    console.log(`   ✅ Merged ${mergedCount} duplicate groups`);
    console.log(`   🗑️  Deleted ${deletedCount} duplicate chapters`);
    console.log('\n✅ Duplicate removal completed!');
    
    // Verify no duplicates remain
    const remainingDuplicates = await db.execute(sql`
      SELECT 
        book_id,
        chapter_number,
        COUNT(*) as count
      FROM chapters
      GROUP BY book_id, chapter_number
      HAVING COUNT(*) > 1;
    `);
    
    if (remainingDuplicates.rows.length === 0) {
      console.log('✅ Verification: No duplicates remain in the database!');
    } else {
      console.log(`⚠️  Warning: ${remainingDuplicates.rows.length} duplicate groups still remain.`);
    }
    
  } catch (error) {
    console.error('\n❌ Error merging duplicates:', error);
    process.exit(1);
  }
}

mergeDuplicates().catch(console.error);

