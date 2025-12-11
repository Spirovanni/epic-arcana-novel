import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapterTasks, chapters } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    
    console.log(`[TASKS API] Fetching tasks for chapter: ${chapterId}`);
    
    // Verify chapter exists
    const chapterResult = await db
      .select()
      .from(chapters)
      .where(eq(chapters.id, chapterId))
      .limit(1);
    
    if (chapterResult.length === 0) {
      return new NextResponse('Chapter Not Found', { status: 404 });
    }
    
    // Get all tasks for this chapter
    const tasks = await db
      .select()
      .from(chapterTasks)
      .where(eq(chapterTasks.chapterId, chapterId));
    
    console.log(`[TASKS API] Found ${tasks.length} tasks for chapter ${chapterId}`);
    
    return NextResponse.json({ 
      tasks: tasks.map(task => ({
        id: task.taskId,
        title: task.title,
        description: task.description || '',
        completed: task.completed,
        category: task.category,
        completedAt: task.completedAt,
        userId: task.userId,
      }))
    });
  } catch (error) {
    console.error('[TASKS API] Error fetching tasks:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ chapterId: string }> }) {
  try {
    const { chapterId } = await params;
    const body = await request.json();
    
    console.log(`[TASKS API] Creating task for chapter: ${chapterId}`, body);
    
    const { taskId, title, description, category } = body;
    
    if (!taskId || !title || !category) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    
    // Insert or update task
    const result = await db
      .insert(chapterTasks)
      .values({
        chapterId,
        taskId,
        title,
        description: description || '',
        category,
        completed: false,
      })
      .onConflictDoUpdate({
        target: [chapterTasks.chapterId, chapterTasks.taskId],
        set: {
          title,
          description: description || '',
          category,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    console.log(`[TASKS API] Task upserted:`, result[0]);
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('[TASKS API] Error creating/updating task:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
