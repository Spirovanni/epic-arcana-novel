import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  chapters,
  learningResources,
  learningResourceChapters,
  connectionPoints,
  terminalLearningObjectives,
} from '../src/lib/schema';
import { eq, asc, and } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL not set');

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function main() {
  try {
    console.log('====================================');
    console.log('Testing API Response Logic');
    console.log('Chapter 1 - Mimicking Chapter API');
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

    // This is EXACTLY what the API does
    const linkedResources = await db
      .select({
        id: learningResources.id,
        resourceId: learningResources.resourceId,
        title: learningResources.title,
        author: learningResources.author,
        specificTaskGroupTitle: learningResources.specificTaskGroupTitle,
        focusArea: learningResources.focusArea,
        tagline: learningResources.tagline,
      })
      .from(learningResourceChapters)
      .innerJoin(
        learningResources,
        eq(learningResourceChapters.learningResourceId, learningResources.id)
      )
      .where(eq(learningResourceChapters.chapterId, chapterId));

    console.log(`Found ${linkedResources.length} linked resources\n`);

    // For each learning resource, fetch its connection points and objectives
    const learningResourcesWithData = await Promise.all(
      linkedResources.map(async (resource) => {
        const points = await db
          .select({
            pointNumber: connectionPoints.pointNumber,
            description: connectionPoints.description,
          })
          .from(connectionPoints)
          .where(
            and(
              eq(connectionPoints.learningResourceId, resource.id),
              eq(connectionPoints.chapterId, chapterId)
            )
          )
          .orderBy(asc(connectionPoints.pointNumber));

        const objectives = await db
          .select({
            objectiveNumber: terminalLearningObjectives.objectiveNumber,
            description: terminalLearningObjectives.description,
            bloomLevel: terminalLearningObjectives.bloomLevel,
          })
          .from(terminalLearningObjectives)
          .where(
            and(
              eq(terminalLearningObjectives.learningResourceId, resource.id),
              eq(terminalLearningObjectives.chapterId, chapterId)
            )
          )
          .orderBy(asc(terminalLearningObjectives.objectiveNumber));

        return {
          ...resource,
          connectionPoints: points,
          objectives,
        };
      })
    );

    // Display like the frontend would
    for (const resource of learningResourcesWithData) {
      console.log(`\n📖 ${resource.title}`);
      console.log(`   Theme: ${resource.specificTaskGroupTitle}`);
      console.log(`   Connection Points: ${resource.connectionPoints.length}`);
      resource.connectionPoints.slice(0, 2).forEach((pt) => {
        console.log(`     ${pt.pointNumber}. ${pt.description.substring(0, 50)}...`);
      });
      console.log(`   Learning Objectives: ${resource.objectives.length}`);
      resource.objectives.slice(0, 2).forEach((obj) => {
        console.log(
          `     ${obj.objectiveNumber}. ${obj.description.substring(0, 45)}... [${obj.bloomLevel}]`
        );
      });
    }

    console.log('\n====================================');
    console.log('If each book shows DIFFERENT points,');
    console.log('the data in the API response is correct!');
    console.log('====================================');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

main();
