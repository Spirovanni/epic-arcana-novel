'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  bookNumber: number;
  fictionNovelTitle: string;
  summary: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('/api/books');
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        }
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Link href={`/books/${book.id}`} key={book.id} className="block p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <h2 className="text-xl font-semibold">{`Book ${book.bookNumber}: ${book.title}`}</h2>
            <p className="text-gray-500">{book.fictionNovelTitle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
