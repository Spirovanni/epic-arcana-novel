import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    const result = await db.execute(sql`
      SELECT current_database() as database_name,
             (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'users') as users_table,
             (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'assessments') as assessments_table,
             (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'user_assessment_results') as results_table,
             (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'assessment_answers') as answers_table
    `);

    const row = result.rows[0] as any;
    console.log('✅ Database connection successful!');
    console.log(`📊 Connected to database: ${row.database_name}`);
    console.log(`📋 Users table exists: ${row.users_table > 0 ? 'Yes' : 'NO'}`);
    console.log(`📋 Assessments table exists: ${row.assessments_table > 0 ? 'Yes' : 'NO'}`);
    console.log(`📋 Results table exists: ${row.results_table > 0 ? 'Yes' : 'NO'}`);
    console.log(`📋 Answers table exists: ${row.answers_table > 0 ? 'Yes' : 'NO'}`);
  } catch (error) {
    console.error('❌ Database connection/query failed:', error);
    throw error;
  }
}

testConnection().then(() => process.exit(0)).catch(() => process.exit(1));
