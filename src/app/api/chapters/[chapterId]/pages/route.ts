import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapterPages } from '@/lib/schema';
import { eq, asc, desc } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    
    const pages = await db
      .select()
      .from(chapterPages)
      .where(eq(chapterPages.chapterId, chapterId))
      .orderBy(asc(chapterPages.pageNumber));

    return NextResponse.json(pages);
  } catch (error) {
    const { chapterId: errorChapterId } = await params;
    console.error(`Error fetching pages for chapter ${errorChapterId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    const { content = '', pageNumber } = await request.json();
    
    // If no page number specified, get the next available page number
    let finalPageNumber = pageNumber;
    if (!finalPageNumber) {
      const lastPage = await db
        .select()
        .from(chapterPages)
        .where(eq(chapterPages.chapterId, chapterId))
        .orderBy(desc(chapterPages.pageNumber))
        .limit(1);
      
      finalPageNumber = lastPage.length > 0 ? lastPage[0].pageNumber + 1 : 1;
    }
    
    const newPage = await db
      .insert(chapterPages)
      .values({
        chapterId,
        pageNumber: finalPageNumber,
        content
      })
      .returning();

    return NextResponse.json(newPage[0]);
  } catch (error) {
    const { chapterId: errorChapterId } = await params;
    console.error(`Error creating page for chapter ${errorChapterId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}