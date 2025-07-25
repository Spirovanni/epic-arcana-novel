import 'dotenv/config';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in your .env file.');
}

const pool = new Pool({ connectionString });

async function updateChapter6Summary() {
  const client = await pool.connect();
  
  try {
    console.log('Finding Chapter 6 of Book 1...');
    
    // Find Book 1
    let book1Result = await client.query(`
      SELECT id, title, book_number
      FROM books 
      WHERE book_number = 1 
      LIMIT 1;
    `);
    
    if (book1Result.rows.length === 0) {
      console.error('Book 1 not found in database');
      return;
    }
    
    console.log(`Found Book 1: ${book1Result.rows[0].title} (ID: ${book1Result.rows[0].id})`);
    
    // Find Chapter 6 of Book 1
    const chapter6Result = await client.query(`
      SELECT id, chapter_number, title, summary
      FROM chapters
      WHERE book_id = $1
        AND chapter_number = 6
      LIMIT 1;
    `, [book1Result.rows[0].id]);
    
    if (chapter6Result.rows.length === 0) {
      console.error('Chapter 6 of Book 1 not found in database');
      return;
    }
    
    const chapter = chapter6Result.rows[0];
    console.log(`Found Chapter 6: ${chapter.title} (ID: ${chapter.id})`);
    console.log(`Current summary: ${chapter.summary || 'No summary currently set'}`);
    
    // New summary as provided by the user
    const newSummary = `Francisco faces the devastating consequences of his bargain with Dagon as he finds himself trapped in an isolation chamber that responds mercilessly to his emotions, manifesting his overwhelming guilt and shame through distorted mirrors showing different versions of himself. Reaching his emotional rock bottom, Francisco grapples with the crushing weight of his ego and the realization that he has been manipulated by forces far beyond his understanding. In his darkest moment, he is mysteriously transported to a timeless garden where flowers bloom and wither in moments, existing outside the normal flow of time. Here, in this realm of eternal transformation, Francisco encounters La Signora del Gioco in her true form—revealing that Giovanna, whom he thought he knew, is actually a cosmic entity of immense power and wisdom. She extends not condemnation but partnership, offering to work alongside Francisco to understand the full scope of Dagon's plan and the true nature of the Crown of the Ancient Ones. Through this revelation, Francisco begins the painful but necessary process of accepting responsibility for his choices and learning that true strength comes not from individual ambition but from collaborative wisdom. The chapter embodies ownership—taking full responsibility for one's actions and their consequences, no matter how painful that acknowledgment might be.`;
    
    // Update the chapter summary
    const updateResult = await client.query(`
      UPDATE chapters 
      SET summary = $1, 
          updated_at = NOW()
      WHERE id = $2
      RETURNING id, title, summary;
    `, [newSummary, chapter.id]);
    
    if (updateResult.rows.length > 0) {
      console.log('✅ Chapter 6 updated successfully!');
      console.log(`Updated chapter: ${updateResult.rows[0].title}`);
      console.log(`New summary: ${updateResult.rows[0].summary}`);
    } else {
      console.error('❌ Failed to update chapter');
    }
    
  } catch (error) {
    console.error('Error updating chapter:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

updateChapter6Summary();