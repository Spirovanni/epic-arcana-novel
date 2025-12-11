import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function createChapterTasksTable() {
    try {
        await client.connect();
        console.log('✓ Connected to Neon database\n');
        
        // Create chapter_tasks table
        await client.query(`
            CREATE TABLE IF NOT EXISTS chapter_tasks (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
                task_id VARCHAR(255) NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                category VARCHAR(100) NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT false,
                completed_at TIMESTAMP,
                user_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                UNIQUE (chapter_id, task_id)
            );
        `);
        
        console.log('✅ Created chapter_tasks table successfully!\n');
        
        // Create index for faster lookups
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_chapter_tasks_chapter_id 
            ON chapter_tasks(chapter_id);
        `);
        
        console.log('✅ Created index on chapter_id');
        
        // Verify table creation
        const result = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'chapter_tasks'
            ORDER BY ordinal_position;
        `);
        
        console.log('\n📋 Table structure:');
        result.rows.forEach(row => {
            console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
        console.log('\n✓ Database connection closed');
    }
}

createChapterTasksTable();

