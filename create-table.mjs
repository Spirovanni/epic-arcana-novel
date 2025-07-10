import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE chapter_pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        chapter_id UUID REFERENCES chapters(id),
        page_number INTEGER NOT NULL,
        content TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Table "chapter_pages" created successfully.');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    client.release();
    pool.end();
  }
}

createTable();
