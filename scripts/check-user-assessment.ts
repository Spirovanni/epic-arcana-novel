/**
 * Debug script to check user assessment data
 * Run with: npx tsx scripts/check-user-assessment.ts
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkUserAssessment() {
    console.log('=== Checking User Assessment Data ===\n');

    // Get all users
    const users = await sql`SELECT id, clerk_id, email, first_name FROM users ORDER BY id DESC LIMIT 5`;
    console.log('Recent Users:');
    console.table(users);

    if (users.length === 0) {
        console.log('No users found!');
        return;
    }

    const userId = users[0].id;
    console.log(`\nChecking data for user ID: ${userId}\n`);

    // Check V2 sessions
    const v2Sessions = await sql`
    SELECT id, user_id, status, started_at, completed_at 
    FROM assessment_sessions_v2 
    WHERE user_id = ${userId}
    ORDER BY started_at DESC
  `;
    console.log('V2 Assessment Sessions:');
    console.table(v2Sessions);

    // Check V2 results
    if (v2Sessions.length > 0) {
        for (const session of v2Sessions) {
            const results = await sql`
        SELECT session_id, computed_at, 
               (result->>'dominant_type') as dominant_type,
               (result->'profile'->>'display_name') as display_name
        FROM assessment_results_v2 
        WHERE session_id = ${session.id}
      `;
            console.log(`\nResults for session ${session.id}:`);
            console.table(results);
        }
    }

    // Check legacy user_assessment_results
    const legacyResults = await sql`
    SELECT id, user_id, primary_player_type, enneagram_type, completed_at
    FROM user_assessment_results
    WHERE user_id = ${userId}
    ORDER BY completed_at DESC
  `;
    console.log('\nLegacy User Assessment Results:');
    console.table(legacyResults);

    // Check V2 answers count
    if (v2Sessions.length > 0) {
        const answerCount = await sql`
      SELECT session_id, COUNT(*) as answer_count
      FROM assessment_answers_v2
      WHERE session_id = ${v2Sessions[0].id}
      GROUP BY session_id
    `;
        console.log('\nAnswer count for latest session:');
        console.table(answerCount);
    }
}

checkUserAssessment()
    .then(() => {
        console.log('\n=== Done ===');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error:', err);
        process.exit(1);
    });
