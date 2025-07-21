import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapterPages } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: Request, { params }: { params: Promise<{ chapterId: string; pageId: string }> }) {
  try {
    const { pageId } = await params;
    const { content } = await request.json();
    
    const updatedPage = await db
      .update(chapterPages)
      .set({ 
        content,
        updatedAt: new Date()
      })
      .where(eq(chapterPages.id, pageId))
      .returning();

    if (updatedPage.length === 0) {
      return new NextResponse('Page not found', { status: 404 });
    }

    return NextResponse.json(updatedPage[0]);
  } catch (error) {
    const { pageId: errorPageId } = await params;
    console.error(`Error updating page ${errorPageId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ chapterId: string; pageId: string }> }) {
  try {
    const { pageId } = await params;
    
    const deletedPage = await db
      .delete(chapterPages)
      .where(eq(chapterPages.id, pageId))
      .returning();

    if (deletedPage.length === 0) {
      return new NextResponse('Page not found', { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const { pageId: errorPageId } = await params;
    console.error(`Error deleting page ${errorPageId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}