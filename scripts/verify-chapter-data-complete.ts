#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { chapters, books } from '../src/lib/schema';
import { sql, eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

async function verifyComplete() {
  console.log('🔍 Verifying chapter data completeness...\n');
  
  // Get statistics
  const stats = await db.execute(sql`
    SELECT 
      COUNT(*) as total,
      COUNT(chapter_id) as with_chapter_id,
      COUNT(unique_identifier) as with_unique_identifier,
      COUNT(title) as with_title,
      COUNT(description) as with_description,
      COUNT(summary) as with_summary,
      COUNT(focus_area) as with_focus_area,
      COUNT(tarot_family) as with_tarot_family
    FROM chapters
  `);
  
  const s = stats.rows[0] as any;
  
  console.log('📊 Chapter Data Statistics:');
  console.log(`   Total chapters: ${s.total}`);
  console.log(`   With chapter_id: ${s.with_chapter_id} (${Math.round(s.with_chapter_id/s.total*100)}%)`);
  console.log(`   With unique_identifier: ${s.with_unique_identifier} (${Math.round(s.with_unique_identifier/s.total*100)}%)`);
  console.log(`   With title: ${s.with_title} (${Math.round(s.with_title/s.total*100)}%)`);
  console.log(`   With description: ${s.with_description} (${Math.round(s.with_description/s.total*100)}%)`);
  console.log(`   With summary: ${s.with_summary} (${Math.round(s.with_summary/s.total*100)}%)`);
  console.log(`   With focus_area: ${s.with_focus_area} (${Math.round(s.with_focus_area/s.total*100)}%)`);
  console.log(`   With tarot_family: ${s.with_tarot_family} (${Math.round(s.with_tarot_family/s.total*100)}%)`);
  
  // Get sample chapters with full data
  const sampleFull = await db.select({
    bookNumber: books.bookNumber,
    chapterNumber: chapters.chapterNumber,
    chapterId: chapters.chapterId,
    uniqueIdentifier: chapters.uniqueIdentifier,
    title: chapters.title,
    description: chapters.description,
    summary: chapters.summary,
  })
  .from(chapters)
  .innerJoin(books, eq(chapters.bookId, books.id))
  .where(sql`chapters.description IS NOT NULL AND chapters.summary IS NOT NULL`)
  .limit(5);
  
  console.log('\n📋 Sample chapters with complete data:');
  sampleFull.forEach(ch => {
    console.log(`   Book ${ch.bookNumber}, Chapter ${ch.chapterNumber}: ${ch.chapterId || 'NO ID'}`);
    console.log(`      Title: ${ch.title || 'NONE'}`);
    console.log(`      uniqueIdentifier: ${ch.uniqueIdentifier || 'NONE'}`);
    console.log(`      Description: ${ch.description ? 'YES (' + ch.description.substring(0, 50) + '...)' : 'NO'}`);
    console.log(`      Summary: ${ch.summary ? 'YES (' + ch.summary.substring(0, 50) + '...)' : 'NO'}`);
    console.log('');
  });
  
  // Check chapters by book
  const byBook = await db.execute(sql`
    SELECT 
      b.book_number,
      COUNT(*) as chapter_count,
      COUNT(c.chapter_id) as with_chapter_id,
      COUNT(c.title) as with_title
    FROM chapters c
    INNER JOIN books b ON c.book_id = b.id
    GROUP BY b.book_number
    ORDER BY b.book_number
  `);
  
  console.log('📖 Chapters per book:');
  byBook.rows.forEach((row: any) => {
    console.log(`   Book ${row.book_number}: ${row.chapter_count} chapters (${row.with_chapter_id} with chapter_id, ${row.with_title} with title)`);
  });
  
  process.exit(0);
}

verifyComplete().catch(console.error);

