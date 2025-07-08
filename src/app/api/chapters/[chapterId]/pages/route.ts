import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapterPages } from '@/lib/schema';
import { and, eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request, { params }: { params: { chapterId: string } }) {
  try {
    const chapterId = params.chapterId;
    const pages = await db.select().from(chapterPages).where(eq(chapterPages.chapterId, chapterId)).orderBy(chapterPages.pageNumber);
    return NextResponse.json(pages);
  } catch (error) {
    console.error(`Error fetching pages for chapter ${params.chapterId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { chapterId: string } }) {
  try {
    const { userId } = auth();
    // In a real app, you'd check if the user is an admin here
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const chapterId = params.chapterId;
    const { pageNumber, content } = await request.json();

    const result = await db.update(chapterPages)
      .set({ content: content, updatedAt: new Date() })
      .where(and(eq(chapterPages.chapterId, chapterId), eq(chapterPages.pageNumber, pageNumber)))
      .returning();

    if (result.length === 0) {
      return new NextResponse('Page not found', { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(`Error updating page for chapter ${params.chapterId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
