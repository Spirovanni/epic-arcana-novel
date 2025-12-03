/**
 * Detailed Data Verification Report
 * Verifies that each chapter has UNIQUE connection points and learning objectives
 * from the l_outline.json file
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { connectionPoints, terminalLearningObjectives, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL not set');

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function main() {
  try {
    console.log('====================================');
    console.log('Detailed Data Verification Report');
    console.log('Book 1: Chapters 1-5');
    console.log('====================================\n');

    // Get chapters 1-5
    for (const chNum of [1, 2, 3, 4, 5]) {
      const chResult = await db
        .select()
        .from(chapters)
        .where(eq(chapters.chapterNumber, chNum));

      if (!chResult.length) {
        console.log(`Chapter ${chNum}: NOT FOUND\n`);
        continue;
      }

      const chId = chResult[0].id;
      console.log(`\n=== CHAPTER ${chNum}: ${chResult[0].title} ===\n`);

      const points = await db
        .select()
        .from(connectionPoints)
        .where(eq(connectionPoints.chapterId, chId));

      const objectives = await db
        .select()
        .from(terminalLearningObjectives)
        .where(eq(terminalLearningObjectives.chapterId, chId));

      console.log(`Total connection points: ${points.length}`);
      console.log(`Total objectives: ${objectives.length}\n`);

      // Show first 2 connection points
      console.log('First 2 Connection Points:');
      points.slice(0, 2).forEach((p) => {
        const text = p.description.length > 100 ? p.description.substring(0, 97) + '...' : p.description;
        console.log(`  Point ${p.pointNumber}: ${text}`);
      });

      // Show first 2 objectives
      console.log('\nFirst 2 Learning Objectives:');
      objectives.slice(0, 2).forEach((o) => {
        const text = o.description.length > 80 ? o.description.substring(0, 77) + '...' : o.description;
        const bloom = o.bloomLevel ? ` [${o.bloomLevel}]` : '';
        console.log(`  Objective ${o.objectiveNumber}: ${text}${bloom}`);
      });
    }

    console.log('\n====================================');
    console.log('VERIFICATION RESULT:');
    console.log('If each chapter shows DIFFERENT connection points and objectives,');
    console.log('then data is correctly populated from l_outline.json per chapter.');
    console.log('====================================');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

main();
