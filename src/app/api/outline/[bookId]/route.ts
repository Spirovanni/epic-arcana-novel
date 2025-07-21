import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters, taskGroups } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ bookId: string }> }) {
  try {
    const { bookId } = await params;

    // 1. Get all chapters for the book
    const bookChapters = await db.select({ id: chapters.id }).from(chapters).where(eq(chapters.bookId, bookId));
    const chapterIds = bookChapters.map(c => c.id);

    if (chapterIds.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Get all task groups
    const allTaskGroups = await db.select().from(taskGroups);
    const taskGroupMap = new Map(allTaskGroups.map(tg => [tg.id, tg]));

    // 3. Find all task groups belonging to the book (leaves and their ancestors)
    const bookTaskGroupIds = new Set<string>();
    const leaves = allTaskGroups.filter(tg => tg.chapterId && chapterIds.includes(tg.chapterId));

    for (const leaf of leaves) {
      let current = leaf;
      while (current) {
        bookTaskGroupIds.add(current.id);
        current = current.parentTaskGroupId ? taskGroupMap.get(current.parentTaskGroupId) : null;
      }
    }

    const bookTaskGroups = allTaskGroups.filter(tg => bookTaskGroupIds.has(tg.id));

    return NextResponse.json(bookTaskGroups);
  } catch (error) {
    const { bookId: errorBookId } = await params;
    console.error(`Error fetching outline for book ${errorBookId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}