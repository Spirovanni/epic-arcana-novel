import { NextResponse } from 'next/server';
import { Client } from '@neondatabase/serverless';

/**
 * Get the sequential chapter mapping for a personality profile
 * EA-001 → Book 2 Chapter 1
 * EA-002 → Book 2 Chapter 2
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

    // Get the EA number from the profileId (EA-001 → 1, EA-002 → 2, etc.)
    const eaMatch = profileId.match(/EA-(\d+)/);
    if (!eaMatch) {
      return new NextResponse('Invalid profileId format', { status: 400 });
    }

    const eaNumber = parseInt(eaMatch[1], 10);

    // Get the nth chapter in sequential order (across all books)
    // Using ROW_NUMBER to get sequential position
    const result = await client.query(
      `
      WITH ranked_chapters AS (
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
          c.blue,
          ROW_NUMBER() OVER (ORDER BY b.id ASC, c.chapter_number ASC) as seq_num
        FROM chapters c
        JOIN books b ON c.book_id = b.id
      )
      SELECT id, unique_identifier, title, chapter_number, book_number, icon_path, hex_code, color_name, red, green, blue
      FROM ranked_chapters
      WHERE seq_num = $1
      LIMIT 1
      `,
      [eaNumber]
    );

    if (result.rows.length === 0) {
      return new NextResponse('Chapter Not Found', { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching chapter for personality:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    await client.end();
  }
}
