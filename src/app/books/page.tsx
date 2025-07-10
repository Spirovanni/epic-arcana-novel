'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <Breadcrumbs items={[{ label: 'Books', current: true }]} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Breadcrumbs items={[{ label: 'Books', current: true }]} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-4">
            Epic Arcana Chronicles
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Journey through nine transformative books of temporal mastery, each revealing unique aspects of Francisco's evolution across time and consciousness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => {
          const backgroundColor = book.colorTheme?.hex || '#f3f4f6';
          const textColorClass = getTextColor(backgroundColor);
          
          return (
            <Link 
              href={`/books/${book.id}`} 
              key={book.id} 
              className="group block"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] h-[320px]">
                <div 
                  className="p-8 h-full flex flex-col justify-between relative"
                  style={{ 
                    background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%)` 
                  }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-4 ${textColorClass} bg-white/20 backdrop-blur-sm`}>
                      Book {book.bookNumber}
                    </div>
                    <h2 className={`text-2xl font-black mb-3 ${textColorClass} leading-tight group-hover:scale-105 transition-transform duration-200 line-clamp-3`}>
                      {book.title}
                    </h2>
                  </div>
                  
                  <div className="relative z-10 space-y-3">
                    <p className={`text-sm ${textColorClass} opacity-90 leading-relaxed line-clamp-2`}>
                      {book.fictionNovelTitle}
                    </p>
                    {book.colorTheme && (
                      <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${textColorClass} bg-black/20`}>
                        <div 
                          className="w-2 h-2 rounded-full mr-2" 
                          style={{ backgroundColor: book.colorTheme.hex }}
                        ></div>
                        {book.colorTheme.name}
                      </div>
                    )}
                  </div>
                  
                  {/* Hover arrow */}
                  <div className={`absolute bottom-4 right-4 w-8 h-8 ${textColorClass} opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0`}>
                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        </div>
      </div>
    </div>
  );
}
