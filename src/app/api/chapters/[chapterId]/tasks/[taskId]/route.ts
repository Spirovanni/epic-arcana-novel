import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapterTasks } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ chapterId: string; taskId: string }> }
) {
  try {
    const { chapterId, taskId } = await params;
    
    console.log(`[TASK API] Fetching task ${taskId} for chapter ${chapterId}`);
    
    const task = await db
      .select()
      .from(chapterTasks)
      .where(
        and(
          eq(chapterTasks.chapterId, chapterId),
          eq(chapterTasks.taskId, taskId)
        )
      )
      .limit(1);
    
    if (task.length === 0) {
      return NextResponse.json({ 
        completed: false,
        message: 'Task not found in database, returning default status'
      });
    }
    
    console.log(`[TASK API] Task status:`, task[0]);
    
    return NextResponse.json({ 
      completed: task[0].completed,
      completedAt: task[0].completedAt,
      userId: task[0].userId,
    });
  } catch (error) {
    console.error('[TASK API] Error fetching task:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ chapterId: string; taskId: string }> }
) {
  try {
    const { chapterId, taskId } = await params;
    const body = await request.json();
    const { userId } = await auth();
    
    console.log(`[TASK API] Updating task ${taskId} for chapter ${chapterId}:`, body);
    
    const { completed } = body;
    
    if (typeof completed !== 'boolean') {
      return new NextResponse('Invalid completed value', { status: 400 });
    }
    
    // Check if task exists
    const existingTask = await db
      .select()
      .from(chapterTasks)
      .where(
        and(
          eq(chapterTasks.chapterId, chapterId),
          eq(chapterTasks.taskId, taskId)
        )
      )
      .limit(1);
    
    let result;
    
    if (existingTask.length === 0) {
      // Task doesn't exist, return error since we expect tasks to be created first
      return new NextResponse('Task not found. Please initialize tasks first.', { status: 404 });
    } else {
      // Update existing task
      result = await db
        .update(chapterTasks)
        .set({
          completed,
          completedAt: completed ? new Date().toISOString() : null,
          userId: userId || null,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(chapterTasks.chapterId, chapterId),
            eq(chapterTasks.taskId, taskId)
          )
        )
        .returning();
    }
    
    console.log(`[TASK API] Task updated:`, result[0]);
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('[TASK API] Error updating task:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
