/**
 * Script to manually complete a user's assessment session
 * Run with: npx tsx scripts/complete-user-session.ts
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function completeSession() {
    console.log('=== Completing Assessment Session ===\n');

    // Get the latest in_progress session for user 1
    const sessions = await sql`
    SELECT id, user_id, status, started_at 
    FROM assessment_sessions_v2 
    WHERE user_id = 1 AND status = 'in_progress'
    ORDER BY started_at DESC
    LIMIT 1
  `;

    if (sessions.length === 0) {
        console.log('No in_progress sessions found for user 1');
        return;
    }

    const session = sessions[0];
    console.log('Found session:', session.id);

    // Create a mock result based on the scoring engine output structure
    const mockResult = {
        dimensions: {
            agency: 0.65,
            stability: 0.72,
            empathy: 0.58,
            openness: 0.81,
            orderliness: 0.45,
            novelty_seeking: 0.73,
            abstract_reasoning: 0.68,
            emotional_intensity: 0.52,
            social_dominance: 0.48,
            cooperativeness: 0.76,
            risk_tolerance: 0.55,
            conscientiousness: 0.67,
            adaptability: 0.79,
            imagination: 0.85
        },
        type_probs: { 1: 0.08, 2: 0.11, 3: 0.09, 4: 0.15, 5: 0.12, 6: 0.10, 7: 0.18, 8: 0.07, 9: 0.10 },
        dominant_type: 7,
        wing_bin: 3,
        development_bin: 2,
        instincts: { SP: 0.35, SO: 0.40, SX: 0.25 },
        chapter: 263,
        ea_id: 'EA-263',
        color: {
            rgb_hex: '#7B68EE',
            hsl: '240,54%,67%'
        },
        top_signal_items: ['FC-007', 'L-012', 'FC-015', 'L-023', 'FC-031'],
        profile: {
            id: 'EA-263',
            chapter: 263,
            display_name: 'Wayfinder of Open Horizons',
            theme: 'Joyful Exploration',
            family: 'Freedom / Discovery',
            matchScore: 87,
            matchReason: 'Strong match with Freedom / Discovery personality (Type 7, Wing 3, Development 2)',
            traits: {
                strengths: [
                    'Visionary thinking',
                    'Infectious enthusiasm',
                    'Quick adaptability',
                    'Creative problem-solving',
                    'Natural optimism'
                ],
                shadow: [
                    'Scattered attention',
                    'Commitment avoidance',
                    'Superficial engagement',
                    'Impulsive decisions',
                    'Escapism tendencies'
                ],
                growth_focus: [
                    'Cultivate depth over breadth',
                    'Practice staying present',
                    'Complete what you start',
                    'Embrace difficult emotions',
                    'Build lasting commitments'
                ]
            }
        },
        alternativeMatches: [],
        meta: {
            duration_sec: 1847,
            version: '1.0.0',
            item_pack: 'Laurasia-1.0'
        }
    };

    const now = new Date().toISOString();

    // Insert result into assessment_results_v2
    await sql`
    INSERT INTO assessment_results_v2 (session_id, result, computed_at)
    VALUES (${session.id}, ${JSON.stringify(mockResult)}::jsonb, ${now})
    ON CONFLICT (session_id) DO UPDATE SET
      result = ${JSON.stringify(mockResult)}::jsonb,
      computed_at = ${now}
  `;
    console.log('Inserted result into assessment_results_v2');

    // Update session status to completed
    await sql`
    UPDATE assessment_sessions_v2
    SET status = 'completed', completed_at = ${now}, updated_at = ${now}
    WHERE id = ${session.id}
  `;
    console.log('Updated session status to completed');

    console.log('\n=== Done! Refresh /profile to see results ===');
}

completeSession()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Error:', err);
        process.exit(1);
    });
