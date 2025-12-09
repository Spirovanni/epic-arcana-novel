/**
 * Fix Chapter Numbers and Book Associations (EA-001 to EA-051)
 * 
 * This script updates the database to align chapter_number and book_id
 * with the values in data/l_outline.json
 * 
 * Usage: node scripts/fix-chapter-numbers-ea-001-to-051.mjs
 */

import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Mapping from l_outline.json
const chapterMapping = [
  { id: 'EA-001', unique_id: 'STG 1.1.1.1', all_chapter: 1, novel_book: 1, chapter: 'Chapter 1', title: 'Despair' },
  { id: 'EA-002', unique_id: 'STG 1.1.1.2', all_chapter: 2, novel_book: 1, chapter: 'Chapter 2', title: 'Guileless' },
  { id: 'EA-003', unique_id: 'STG 1.1.1.3', all_chapter: 3, novel_book: 1, chapter: 'Chapter 3', title: 'Vibratile' },
  { id: 'EA-004', unique_id: 'STG 1.1.2.1', all_chapter: 4, novel_book: 1, chapter: 'Chapter 4', title: 'Explosive' },
  { id: 'EA-005', unique_id: 'STG 1.1.2.2', all_chapter: 5, novel_book: null, chapter: 'Chapter 5', title: 'Implementation' },
  { id: 'EA-006', unique_id: 'STG 1.1.2.3', all_chapter: 6, novel_book: null, chapter: 'Chapter 6', title: 'Ownership' },
  { id: 'EA-007', unique_id: 'STG 1.1.3.1', all_chapter: 7, novel_book: 1, chapter: 'Chapter 7', title: 'Dominion' },
  { id: 'EA-008', unique_id: 'STG 1.1.3.2', all_chapter: 8, novel_book: 1, chapter: 'Chapter 8', title: 'Transformation' },
  { id: 'EA-009', unique_id: 'STG 1.1.3.3', all_chapter: 9, novel_book: 1, chapter: 'Chapter 9', title: 'Determination' },
  { id: 'EA-010', unique_id: 'STG 1.1.4.1', all_chapter: 10, novel_book: 1, chapter: 'Chapter 10', title: 'Structure' },
  { id: 'EA-011', unique_id: 'STG 1.1.4.2', all_chapter: 11, novel_book: 1, chapter: 'Chapter 11', title: 'Acceptance' },
  { id: 'EA-012', unique_id: 'STG 1.1.4.3', all_chapter: 12, novel_book: 1, chapter: 'Chapter 12', title: 'Celebration' },
  { id: 'EA-013', unique_id: 'MAT 1.1', all_chapter: 13, novel_book: 1, chapter: 'Chapter 13', title: 'Potentiality' },
  { id: 'EA-014', unique_id: 'STG 1.2.1.1', all_chapter: 14, novel_book: 1, chapter: 'Chapter 14', title: 'Breakdown' },
  { id: 'EA-015', unique_id: 'STG 1.2.1.2', all_chapter: 15, novel_book: 1, chapter: 'Chapter 15', title: 'Confidence' },
  { id: 'EA-016', unique_id: 'STG 1.2.1.3', all_chapter: 16, novel_book: 1, chapter: 'Chapter 16', title: 'Assertiveness' },
  { id: 'EA-018', unique_id: 'STG 1.2.2.2', all_chapter: 18, novel_book: 1, chapter: 'Chapter 18', title: 'Well‑Being' },
  { id: 'EA-019', unique_id: 'STG 1.2.2.3', all_chapter: 19, novel_book: 1, chapter: 'Chapter 19', title: 'Manifesting‑Force' },
  { id: 'EA-021', unique_id: 'STG 1.2.3.2', all_chapter: 21, novel_book: 1, chapter: 'Chapter 21', title: 'Perseverance' },
  { id: 'EA-022', unique_id: 'STG 1.2.3.3', all_chapter: 22, novel_book: 1, chapter: 'Chapter 22', title: 'Investing' },
  { id: 'EA-023', unique_id: 'MAT 1.2', all_chapter: 23, novel_book: 1, chapter: 'Chapter 23', title: 'The Goddess of Mindful Direction' },
  { id: 'EA-024', unique_id: 'STG 1.3.1.1', all_chapter: 24, novel_book: 1, chapter: 'Chapter 24', title: 'Harmony' },
  { id: 'EA-025', unique_id: 'STG 1.3.1.2', all_chapter: 25, novel_book: 1, chapter: 'Chapter 25', title: 'New Beginnings' },
  { id: 'EA-026', unique_id: 'STG 1.3.1.3', all_chapter: 26, novel_book: 1, chapter: 'Chapter 26', title: 'Balance' },
  { id: 'EA-027', unique_id: 'STG 1.3.2.1', all_chapter: 27, novel_book: 1, chapter: 'Chapter 27', title: 'Opportunities' },
  { id: 'EA-028', unique_id: 'STG 1.3.2.2', all_chapter: 28, novel_book: 1, chapter: 'Chapter 28', title: 'Achievement' },
  { id: 'EA-029', unique_id: 'STG 1.3.2.3', all_chapter: 29, novel_book: 1, chapter: 'Chapter 29', title: 'Disruption' },
  { id: 'EA-030', unique_id: 'STG 1.3.3.1', all_chapter: 30, novel_book: 1, chapter: 'Chapter 30', title: 'Restoration' },
  { id: 'EA-031', unique_id: 'STG 1.3.3.2', all_chapter: 31, novel_book: 1, chapter: 'Chapter 31', title: 'Deployment' },
  { id: 'EA-032', unique_id: 'STG 1.3.3.3', all_chapter: 32, novel_book: 1, chapter: 'Chapter 32', title: 'Passion' },
  { id: 'EA-033', unique_id: 'STG 1.3.4.1', all_chapter: 33, novel_book: 1, chapter: 'Chapter 33', title: 'Valor' },
  { id: 'EA-034', unique_id: 'STG 1.3.4.2', all_chapter: 34, novel_book: 1, chapter: 'Chapter 34', title: 'Inspire' },
  { id: 'EA-035', unique_id: 'STG 1.3.4.3', all_chapter: 35, novel_book: 1, chapter: 'Chapter 35', title: 'Ambition' },
  { id: 'EA-036', unique_id: 'STG 1.3.5.1', all_chapter: 36, novel_book: 1, chapter: 'Chapter 36', title: 'Collaborations' },
  { id: 'EA-037', unique_id: 'STG 1.3.5.2', all_chapter: 37, novel_book: 1, chapter: 'Chapter 37', title: 'Potentiality' },
  { id: 'EA-038', unique_id: 'MAT 1.3', all_chapter: 38, novel_book: 1, chapter: 'Chapter 38', title: 'Inner Knowledge' },
  { id: 'EA-039', unique_id: 'STG 1.3.6.1', all_chapter: 39, novel_book: 1, chapter: 'Chapter 39', title: 'Success' },
  { id: 'EA-040', unique_id: 'STG 1.3.6.2', all_chapter: 40, novel_book: null, chapter: 'Chapter 40', title: 'Aspiration' },
  { id: 'EA-041', unique_id: 'STG 2.1.1.1', all_chapter: 41, novel_book: 2, chapter: 'Chapter 1', title: 'Abandoned Success' },
  { id: 'EA-042', unique_id: 'STG 2.1.1.2', all_chapter: 42, novel_book: 2, chapter: 'Chapter 2', title: 'Intense Force' },
  { id: 'EA-043', unique_id: 'STG 2.1.1.3', all_chapter: 43, novel_book: 2, chapter: 'Chapter 3', title: 'Intense Force' },
  { id: 'EA-044', unique_id: 'STG 2.1.2.1', all_chapter: 44, novel_book: 2, chapter: 'Chapter 4', title: 'Thrive' },
  { id: 'EA-045', unique_id: 'STG 2.1.2.2', all_chapter: 45, novel_book: 2, chapter: 'Chapter 5', title: 'Move Forward' },
  { id: 'EA-046', unique_id: 'STG 2.1.2.3', all_chapter: 46, novel_book: 2, chapter: 'Chapter 6', title: 'Gracious' },
  { id: 'EA-047', unique_id: 'STG 2.1.3.1', all_chapter: 47, novel_book: 2, chapter: 'Chapter 7', title: 'Sophisticated' },
  { id: 'EA-048', unique_id: 'STG 2.1.3.2', all_chapter: 48, novel_book: 2, chapter: 'Chapter 8', title: 'Disillusionment' },
  { id: 'EA-049', unique_id: 'STG 2.1.3.3', all_chapter: 49, novel_book: 2, chapter: 'Chapter 9', title: 'Patience' },
  { id: 'EA-050', unique_id: 'STG 2.1.4.1', all_chapter: 50, novel_book: 2, chapter: 'Chapter 10', title: 'Instability' },
  { id: 'EA-051', unique_id: 'STG 2.1.4.2', all_chapter: 51, novel_book: 2, chapter: 'Chapter 11', title: 'Swiftness' },
];

async function fixChapterNumbers() {
  try {
    await client.connect();
    console.log('✓ Connected to database');
    
    // Get book IDs
    const booksResult = await client.query('SELECT id, book_number FROM books ORDER BY book_number');
    const bookMap = {};
    booksResult.rows.forEach(row => {
      bookMap[row.book_number] = row.id;
    });
    
    console.log(`\n📚 Found ${booksResult.rows.length} books in database:`);
    booksResult.rows.forEach(row => {
      console.log(`   Book ${row.book_number}: ${row.id}`);
    });
    
    console.log('\n🔧 Fixing chapter numbers (EA-001 to EA-051)...\n');
    
    let updatedCount = 0;
    let notFoundCount = 0;
    let skippedCount = 0;
    
    for (const mapping of chapterMapping) {
      // Find chapter by unique_identifier
      const chapterResult = await client.query(
        'SELECT id, chapter_number, book_id, title FROM chapters WHERE unique_identifier = $1',
        [mapping.unique_id]
      );
      
      if (chapterResult.rows.length === 0) {
        console.log(`   ⚠️  ${mapping.id} (${mapping.unique_id}) - NOT FOUND in database`);
        notFoundCount++;
        continue;
      }
      
      const chapter = chapterResult.rows[0];
      const currentChapterNum = chapter.chapter_number;
      const correctChapterNum = mapping.all_chapter;
      
      // Determine correct book_id
      let correctBookId = null;
      if (mapping.novel_book !== null) {
        correctBookId = bookMap[mapping.novel_book];
      }
      
      const currentBookId = chapter.book_id;
      
      // Check if update is needed
      const needsChapterNumUpdate = currentChapterNum !== correctChapterNum;
      const needsBookIdUpdate = correctBookId && currentBookId !== correctBookId;
      
      if (!needsChapterNumUpdate && !needsBookIdUpdate) {
        console.log(`   ✓  ${mapping.id} - Already correct (ch: ${currentChapterNum})`);
        skippedCount++;
        continue;
      }
      
      // Update the chapter
      const updates = [];
      const values = [];
      let paramCount = 1;
      
      if (needsChapterNumUpdate) {
        updates.push(`chapter_number = $${paramCount++}`);
        values.push(correctChapterNum);
      }
      
      if (needsBookIdUpdate) {
        updates.push(`book_id = $${paramCount++}`);
        values.push(correctBookId);
      }
      
      values.push(chapter.id);
      
      const updateQuery = `UPDATE chapters SET ${updates.join(', ')} WHERE id = $${paramCount}`;
      await client.query(updateQuery, values);
      
      const changes = [];
      if (needsChapterNumUpdate) changes.push(`ch: ${currentChapterNum}→${correctChapterNum}`);
      if (needsBookIdUpdate) changes.push(`book: ${currentBookId?.substring(0, 8)}→${correctBookId?.substring(0, 8)}`);
      
      console.log(`   ✅ ${mapping.id} (${mapping.unique_id}) - UPDATED: ${changes.join(', ')}`);
      updatedCount++;
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ FIX COMPLETE');
    console.log('='.repeat(70));
    console.log(`✅ Chapters updated: ${updatedCount}`);
    console.log(`✓  Chapters already correct: ${skippedCount}`);
    console.log(`⚠️  Chapters not found: ${notFoundCount}`);
    console.log(`📊 Total processed: ${chapterMapping.length}`);
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✓ Database connection closed');
  }
}

// Run the fix
fixChapterNumbers();

