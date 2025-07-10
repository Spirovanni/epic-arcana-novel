'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import ResponsiveText from '@/components/ResponsiveText';

interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  description: string;
  iconPath?: string;
  colorTheme: {
    name: string;
    hex: string;
    rgb: [number, number, number];
  };
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

// Helper function to get chapter icon path with fallback
const getChapterIconPath = (chapter: Chapter, bookNumber: number): string => {
  // If iconPath is explicitly set in database, use it
  if (chapter.iconPath) {
    return `/icons/${chapter.iconPath}`;
  }
  
  // Auto-generate path based on book and chapter numbers
  const defaultPath = `/icons/chapters/book${bookNumber}/chapter${chapter.chapterNumber}.png`;
  return defaultPath;
};

// Helper function to handle icon loading errors
const handleIconError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement;
  target.src = '/icons/fallback/default-chapter.svg';
};

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [bookNumber, setBookNumber] = useState<number>(1);
  const [bookTitle, setBookTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;
    async function fetchChapters() {
      try {
        const response = await fetch(`/api/books/${bookId}/chapters`);
        if (response.ok) {
          const data = await response.json();
          setChapters(data.chapters);
          setBookNumber(data.book.bookNumber);
          setBookTitle(data.book.title);
        }
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchChapters();
  }, [bookId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <Breadcrumbs items={[
          { label: 'Books', href: '/books' },
          { label: bookTitle || 'Loading...', current: true }
        ]} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading chapters...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Breadcrumbs items={[
        { label: 'Books', href: '/books' },
        { label: bookTitle, current: true }
      ]} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-sm font-semibold mb-4">
            Book {bookNumber}
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-4">
            {bookTitle}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore the {chapters.length} chapters of this transformative journey through time and consciousness.
          </p>
          <div className="mt-6">
            <Link 
              href={`/outline/${bookId}`} 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Full Outline
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {chapters.map((chapter) => {
          const iconPath = getChapterIconPath(chapter, bookNumber);
          const textColor = getTextColor(chapter.colorTheme?.hex);
          
          return (
            <Link 
              key={chapter.id}
              href={`/chapters/${chapter.id}`}
              className="block aspect-square rounded-2xl p-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl shadow-xl relative overflow-hidden backdrop-blur-sm border border-white/10"
              style={{ backgroundColor: chapter.colorTheme?.hex || '#ffffff' }}
            >
              {/* Icon positioned in top-right area, 75% size, fully contained */}
              <div className="w-3/4 h-3/4 absolute top-2 right-2">
                <img
                  src={iconPath}
                  alt={`Chapter ${chapter.chapterNumber} icon`}
                  className="w-full h-full object-contain drop-shadow-lg"
                  onError={handleIconError}
                />
              </div>
              
              {/* Modern chapter number - top left with glassmorphism */}
              <div className={`absolute top-4 left-4 font-black text-2xl ${textColor} z-20 px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg`}>
                {chapter.chapterNumber}
              </div>
              
              {/* Modern title - fully responsive text sizing */}
              <div className="absolute bottom-2 left-2 right-2 z-20 h-12">
                <div className={`${textColor} backdrop-blur-xl bg-white/30 border-2 border-white/40 rounded-xl px-2 py-1 shadow-2xl h-full flex items-center justify-center`}>
                  <ResponsiveText
                    text={chapter.title}
                    className={`font-black tracking-wide text-center w-full ${textColor}`}
                    style={{ 
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                    maxFontSize={24}
                    minFontSize={10}
                  />
                </div>
              </div>
              
              {/* Subtle gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none"></div>
            </Link>
          );
        })}
        </div>
      </div>
    </div>
  );
}