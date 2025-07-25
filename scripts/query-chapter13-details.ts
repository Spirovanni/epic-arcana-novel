import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from '../src/lib/schema';

const { chapters, chapterDetails, books } = schema;

async function queryChapter13Details() {
  console.log('🔍 Querying Chapter 13 details...\n');
  
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('🔴 DATABASE_URL is not defined in your .env file.');
    return;
  }

  const pool = new Pool({
    connectionString,
  });

  const db = drizzle(pool, { schema });

  try {
    // Get Chapter 13 data
    console.log('📖 Finding Chapter 13...');
    const chapter13 = await db
      .select()
      .from(chapters)
      .where(eq(chapters.id, 'fdb9c68e-ca8f-4b5f-b090-480ad99c25cd'))
      .limit(1);
    
    if (chapter13.length === 0) {
      console.log('❌ Chapter 13 not found in database');
      return;
    }

    console.log('✅ Found Chapter 13:');
    console.log(`   Title: "${chapter13[0].title}"`);
    console.log(`   ID: ${chapter13[0].id}`);
    console.log(`   Chapter Number: ${chapter13[0].chapterNumber}`);
    console.log(`   Focus: ${chapter13[0].focus}`);
    console.log(`   Description: ${chapter13[0].description || 'No description'}`);

    // Check for chapter details (summary)
    console.log('\n📝 Checking chapter_details for summary...');
    const chapterDetailsData = await db
      .select()
      .from(chapterDetails)
      .where(eq(chapterDetails.chapterId, chapter13[0].id))
      .limit(1);

    if (chapterDetailsData.length > 0) {
      console.log('✅ Found chapter details:');
      console.log(`   Summary: ${chapterDetailsData[0].summary || 'No summary'}`);
      console.log(`   POV Type: ${chapterDetailsData[0].povType || 'N/A'}`);
      console.log(`   POV Character: ${chapterDetailsData[0].povCharacterName || 'N/A'}`);
      console.log(`   Tense: ${chapterDetailsData[0].tense || 'N/A'}`);
    } else {
      console.log('❌ No chapter details found for Chapter 13');
    }

  } catch (error) {
    console.error('🔴 Failed to query database:', error);
  } finally {
    await pool.end();
    console.log('\n✅ Database connection closed.');
  }
}

queryChapter13Details();