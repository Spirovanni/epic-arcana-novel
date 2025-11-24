import { NextResponse } from 'next/server';
import { Client } from '@neondatabase/serverless';

/**
 * Get the chapter mapping for a personality profile
 * Uses personality_chapter_mappings table synced from new_personality_profile.json
 * EA-001 → Book 1, Chapter 1: "The Awakening Call"
 * EA-002 → Book 1, Chapter 2: "The First Test"
 * etc.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();

  try {
    const { profileId } = await params;

    if (!profileId) {
      return new NextResponse('Missing profileId parameter', { status: 400 });
    }

    // Get the personality chapter mapping from our synced table
    const mappingResult = await client.query(
      'SELECT canonical_id, all_chapter, novel_book, chapter_title, color_name, rgb_hex, color_symbolism FROM personality_chapter_mappings WHERE canonical_id = $1 LIMIT 1',
      [profileId]
    );

    if (mappingResult.rows.length === 0) {
      return new NextResponse('Personality Not Found', { status: 404 });
    }

    const mapping = mappingResult.rows[0] as any;

    // Now get the actual chapter data from the chapters table
    const chapterResult = await client.query(
      `
      SELECT
        c.id,
        c.unique_identifier,
        c.title,
        c.chapter_number,
        b.book_number,
        c.icon_path,
        c.hex_code,
        c.color_name,
        c.red,
        c.green,
        c.blue
      FROM chapters c
      JOIN books b ON c.book_id = b.id
      WHERE b.book_number = $1 AND c.chapter_number = $2
      LIMIT 1
      `,
      [mapping.novel_book, mapping.all_chapter]
    );

    if (chapterResult.rows.length === 0) {
      // Return the mapping data even if chapter record not found
      return NextResponse.json({
        id: null,
        unique_identifier: null,
        title: mapping.chapter_title,
        chapter_number: mapping.all_chapter,
        book_number: mapping.novel_book,
        icon_path: `/icons/chapters/book${mapping.novel_book}/chapter${mapping.all_chapter}.png`,
        hex_code: mapping.rgb_hex,
        color_name: mapping.color_name,
        personality_color: mapping.rgb_hex,
        personality_color_name: mapping.color_name,
        red: null,
        green: null,
        blue: null,
      });
    }

    // Merge chapter data with personality color from mapping
    const chapterData = chapterResult.rows[0] as any;
    return NextResponse.json({
      ...chapterData,
      personality_color: mapping.rgb_hex,
      personality_color_name: mapping.color_name,
    });
  } catch (error) {
    console.error('Error fetching chapter for personality:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    await client.end();
  }
}
