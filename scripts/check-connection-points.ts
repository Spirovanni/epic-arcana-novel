import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  chapters,
  learningResources,
  learningResourceChapters,
  connectionPoints,
  terminalLearningObjectives,
} from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL not set');

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function main() {
  try {
    console.log('====================================');
    console.log('Checking Connection Points per Book');
    console.log('Chapter 1 only');
    console.log('====================================\n');

    // Get chapter 1
    const ch1 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 1))
      .limit(1);

    if (!ch1.length) {
      console.log('Chapter 1 not found');
      return;
    }

    const chapterId = ch1[0].id;

    // Get all resources for chapter 1
    const resources = await db
      .select({
        id: learningResources.id,
        title: learningResources.title,
      })
      .from(learningResourceChapters)
      .innerJoin(
        learningResources,
        eq(learningResourceChapters.learningResourceId, learningResources.id)
      )
      .where(eq(learningResourceChapters.chapterId, chapterId));

    console.log(`Found ${resources.length} books for Chapter 1:\n`);

    for (const resource of resources) {
      console.log(`\n📖 ${resource.title}`);
      console.log('─'.repeat(50));

      // Get connection points
      const points = await db
        .select({
          pointNumber: connectionPoints.pointNumber,
          description: connectionPoints.description,
        })
        .from(connectionPoints)
        .where(eq(connectionPoints.learningResourceId, resource.id))
        .where(eq(connectionPoints.chapterId, chapterId));

      console.log(`\nConnection Points (${points.length}):`);
      for (const point of points) {
        const text = point.description.substring(0, 80);
        console.log(`  ${point.pointNumber}. ${text}...`);
      }

      // Get objectives
      const objectives = await db
        .select({
          objectiveNumber: terminalLearningObjectives.objectiveNumber,
          description: terminalLearningObjectives.description,
          bloomLevel: terminalLearningObjectives.bloomLevel,
        })
        .from(terminalLearningObjectives)
        .where(eq(terminalLearningObjectives.learningResourceId, resource.id))
        .where(eq(terminalLearningObjectives.chapterId, chapterId));

      console.log(`\nLearning Objectives (${objectives.length}):`);
      for (const obj of objectives) {
        const text = obj.description.substring(0, 70);
        console.log(`  ${obj.objectiveNumber}. ${text}... [${obj.bloomLevel}]`);
      }
    }

    console.log('\n====================================');
    console.log('If each book has DIFFERENT points/objectives,');
    console.log('then the data is correctly populated!');
    console.log('====================================');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

main();
