import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { bookId: string } }) {
  try {
    const bookId = params.bookId;
    const bookChapters = await db.select().from(chapters).where(eq(chapters.bookId, bookId)).orderBy(asc(chapters.chapterNumber));

    if (bookChapters.length === 0) {
      return new NextResponse('Not Found', { status: 404 });
    }

    return NextResponse.json(bookChapters);
  } catch (error) {
    console.error(`Error fetching chapters for book ${params.bookId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
