import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books, taskMasters } from '@/lib/schema';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allBooks = await db.select().from(books).orderBy(asc(books.bookNumber));
    
    // Get the first task master's color theme for each book
    const booksWithColors = await Promise.all(
      allBooks.map(async (book) => {
        const firstTaskMaster = await db
          .select({ 
            colorName: taskMasters.colorName,
            hexCode: taskMasters.hexCode,
            red: taskMasters.red,
            green: taskMasters.green,
            blue: taskMasters.blue
          })
          .from(taskMasters)
          .where(eq(taskMasters.bookId, book.id))
          .limit(1);
        
        const taskMaster = firstTaskMaster[0];
        
        return {
          id: book.id,
          title: book.title,
          bookNumber: book.bookNumber,
          fictionNovelTitle: book.fictionNovelTitle,
          summary: book.description,
          colorTheme: taskMaster ? {
            name: taskMaster.colorName,
            hex: taskMaster.hexCode,
            rgb: {
              red: taskMaster.red,
              green: taskMaster.green,
              blue: taskMaster.blue
            }
          } : null
        };
      })
    );
    
    return NextResponse.json(booksWithColors);
  } catch (error) {
    console.error('Error fetching books:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
