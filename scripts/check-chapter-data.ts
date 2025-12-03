import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { connectionPoints, chapters } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL not set');

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function main() {
  try {
    // Get chapters 1 and 2
    const ch1Result = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 1));

    const ch2Result = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, 2));

    if (!ch1Result.length || !ch2Result.length) {
      console.log('Chapters not found');
      return;
    }

    const ch1Id = ch1Result[0].id;
    const ch2Id = ch2Result[0].id;

    // Get connection points for chapter 1
    const ch1Points = await db
      .select()
      .from(connectionPoints)
      .where(eq(connectionPoints.chapterId, ch1Id));

    // Get connection points for chapter 2
    const ch2Points = await db
      .select()
      .from(connectionPoints)
      .where(eq(connectionPoints.chapterId, ch2Id));

    console.log('Chapter 1 - First 3 connection points:');
    ch1Points.slice(0, 3).forEach((p) => {
      console.log(`  Point ${p.pointNumber}: ${p.description.substring(0, 80)}...`);
    });

    console.log('\nChapter 2 - First 3 connection points:');
    ch2Points.slice(0, 3).forEach((p) => {
      console.log(`  Point ${p.pointNumber}: ${p.description.substring(0, 80)}...`);
    });

    console.log('\n✓ If the descriptions differ, the data was populated correctly.');
    console.log('✗ If they\'re the same, data was duplicated incorrectly.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

main();
