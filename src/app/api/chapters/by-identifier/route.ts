import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uniqueIdentifier = searchParams.get('uniqueIdentifier');

    if (!uniqueIdentifier) {
      return new NextResponse('Missing uniqueIdentifier parameter', { status: 400 });
    }

    // Get chapter by unique_identifier
    const chapterData = await db
      .select({
        id: chapters.id,
        uniqueIdentifier: chapters.uniqueIdentifier,
        title: chapters.title,
        colorName: chapters.colorName,
        hexCode: chapters.hexCode,
        red: chapters.red,
        green: chapters.green,
        blue: chapters.blue,
        iconPath: chapters.iconPath,
      })
      .from(chapters)
      .where(eq(chapters.uniqueIdentifier, uniqueIdentifier))
      .limit(1);

    if (chapterData.length === 0) {
      return new NextResponse('Chapter Not Found', { status: 404 });
    }

    return NextResponse.json(chapterData[0]);
  } catch (error) {
    console.error('Error fetching chapter by identifier:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
