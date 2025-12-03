import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  chapters,
  learningResources,
  learningResourceChapters,
  connectionPoints,
} from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL not set');

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function main() {
  try {
    console.log('====================================');
    console.log('Detailed Check: Connection Points');
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
    console.log(`Chapter ID: ${chapterId}\n`);

    // Get all resources for chapter 1 with their IDs
    const resources = await db
      .select({
        resourceId: learningResources.id,
        title: learningResources.title,
      })
      .from(learningResourceChapters)
      .innerJoin(
        learningResources,
        eq(learningResourceChapters.learningResourceId, learningResources.id)
      )
      .where(eq(learningResourceChapters.chapterId, chapterId));

    console.log(`Found ${resources.length} resources:\n`);
    for (const resource of resources) {
      console.log(`Resource ID: ${resource.resourceId}`);
      console.log(`Title: ${resource.title}`);

      // Get ALL connection points for this resource
      const allPoints = await db
        .select({
          id: connectionPoints.id,
          pointNumber: connectionPoints.pointNumber,
          description: connectionPoints.description,
          resourceId: connectionPoints.learningResourceId,
          chapterId: connectionPoints.chapterId,
        })
        .from(connectionPoints)
        .where(eq(connectionPoints.learningResourceId, resource.resourceId));

      console.log(`  Connection Points in DB: ${allPoints.length}`);
      allPoints.forEach((pt) => {
        console.log(
          `    ID: ${pt.id}, Point ${pt.pointNumber}: ${pt.description.substring(0, 50)}...`
        );
      });
      console.log();
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

main();
