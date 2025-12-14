import 'dotenv/config'
import { db } from '../src/lib/db'
import { sql } from 'drizzle-orm'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function migrate() {
    try {
        console.log('Creating assessment_sessions_v2 table...')
        await db.execute(sql`
      CREATE TABLE IF NOT EXISTS assessment_sessions_v2 (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL DEFAULT 'in_progress',
        is_retake BOOLEAN NOT NULL DEFAULT false,
        started_at TIMESTAMP NOT NULL DEFAULT now(),
        completed_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `)
        console.log('✅ assessment_sessions_v2 created')

        console.log('Creating index on assessment_sessions_v2...')
        await db.execute(sql`
      CREATE INDEX IF NOT EXISTS assessment_sessions_v2_user_status_idx 
      ON assessment_sessions_v2(user_id, status);
    `)
        console.log('✅ Index created')

        console.log('Creating assessment_answers_v2 table...')
        await db.execute(sql`
      CREATE TABLE IF NOT EXISTS assessment_answers_v2 (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID NOT NULL REFERENCES assessment_sessions_v2(id) ON DELETE CASCADE,
        question_key TEXT NOT NULL,
        answer_type VARCHAR(20) NOT NULL DEFAULT 'likert',
        value JSONB NOT NULL,
        answered_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT assessment_answers_v2_session_question_unique UNIQUE (session_id, question_key)
      );
    `)
        console.log('✅ assessment_answers_v2 created')

        console.log('Creating index on assessment_answers_v2...')
        await db.execute(sql`
      CREATE INDEX IF NOT EXISTS assessment_answers_v2_session_idx 
      ON assessment_answers_v2(session_id);
    `)
        console.log('✅ Index created')

        console.log('Creating assessment_results_v2 table...')
        await db.execute(sql`
      CREATE TABLE IF NOT EXISTS assessment_results_v2 (
        session_id UUID PRIMARY KEY REFERENCES assessment_sessions_v2(id) ON DELETE CASCADE,
        result JSONB NOT NULL,
        computed_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `)
        console.log('✅ assessment_results_v2 created')

        console.log('')
        console.log('🎉 All V2 tables created successfully!')
    } catch (error) {
        console.error('❌ Migration failed:', error)
        throw error
    }
}

migrate().catch(console.error)
