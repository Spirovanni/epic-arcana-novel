import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { books } from '@/lib/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const allBooks = await db.select().from(books).orderBy(asc(books.bookNumber));
    return NextResponse.json(allBooks);
  } catch (error) {
    console.error('Error fetching books:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
