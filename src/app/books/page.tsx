'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  bookNumber: number;
  fictionNovelTitle: string;
  summary: string;
  colorTheme?: {
    name: string;
    hex: string;
    rgb: {
      red: number;
      green: number;
      blue: number;
    };
  } | null;
}

// Helper function to determine text color based on background luminance
const getTextColor = (bgColor: string): 'text-white' | 'text-black' => {
  if (!bgColor) return 'text-black';
  const color = bgColor.startsWith('#') ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'text-black' : 'text-white';
};

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => {
          const backgroundColor = book.colorTheme?.hex || '#f3f4f6';
          const textColorClass = getTextColor(backgroundColor);
          
          return (
            <Link 
              href={`/books/${book.id}`} 
              key={book.id} 
              className="block rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg overflow-hidden"
            >
              <div 
                className="p-6 h-full flex flex-col justify-between min-h-[200px]"
                style={{ backgroundColor }}
              >
                <div>
                  <div className={`text-sm font-medium mb-2 ${textColorClass} opacity-80`}>
                    Book {book.bookNumber}
                  </div>
                  <h2 className={`text-xl font-bold mb-3 ${textColorClass} leading-tight`}>
                    {book.title}
                  </h2>
                </div>
                <div>
                  <p className={`text-sm ${textColorClass} opacity-90 line-clamp-2`}>
                    {book.fictionNovelTitle}
                  </p>
                  {book.colorTheme && (
                    <div className={`text-xs mt-3 ${textColorClass} opacity-60`}>
                      {book.colorTheme.name}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
