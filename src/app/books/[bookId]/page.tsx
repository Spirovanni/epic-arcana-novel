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

// Enhanced helper functions for sophisticated styling
const getTextColor = (bgColor: string): 'text-white' | 'text-black' => {
    if (!bgColor) return 'text-black';
    const color = bgColor.startsWith('#') ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'text-black' : 'text-white';
};

// Generate sophisticated gradient backgrounds for chapters
const createChapterGradient = (hex: string) => {
  const lighterHex = adjustBrightness(hex, 25);
  const darkerHex = adjustBrightness(hex, -20);
  return `linear-gradient(135deg, ${hex}F0 0%, ${lighterHex}E0 30%, ${hex}D0 70%, ${darkerHex}F0 100%)`;
};

// Adjust color brightness
const adjustBrightness = (hex: string, percent: number) => {
  const color = hex.startsWith('#') ? hex.substring(1, 7) : hex;
  const num = parseInt(color, 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
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
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-600/20 backdrop-blur-md border border-indigo-300/30 text-indigo-800 dark:text-indigo-200 text-sm font-bold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 animate-pulse"></span>
            BOOK {bookNumber}
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-600 bg-clip-text text-transparent">
              {bookTitle}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed font-light mb-8">
            Explore the <span className="font-bold text-indigo-600 dark:text-indigo-400">{chapters.length} chapters</span> of this transformative journey through time and consciousness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href={`/outline/${bookId}`} 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 group"
            >
              <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="tracking-wide">VIEW FULL OUTLINE</span>
            </Link>
            <Link 
              href="/books" 
              className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              ← Back to Books
            </Link>
          </div>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
        {chapters.map((chapter) => {
          const iconPath = getChapterIconPath(chapter, bookNumber);
          const textColor = getTextColor(chapter.colorTheme?.hex);
          const chapterHex = chapter.colorTheme?.hex || '#6366f1';
          const gradientBg = createChapterGradient(chapterHex);
          const glowColor = chapterHex + '40';
          
          return (
            <Link 
              key={chapter.id}
              href={`/chapters/${chapter.id}`}
              className="block aspect-square transition-all duration-500 ease-out hover:scale-110 hover:rotate-2 group relative overflow-hidden"
              style={{
                borderRadius: '24px',
                boxShadow: `0 20px 40px -12px ${glowColor}, 0 0 0 1px ${chapterHex}30`,
              }}
            >
              {/* Enhanced gradient background */}
              <div 
                className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: gradientBg }}
              />
              
              {/* Mystical overlay pattern */}
              <div 
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 75%, ${chapterHex}60 0%, transparent 50%), radial-gradient(circle at 75% 25%, ${chapterHex}40 0%, transparent 50%)`
                }}
              />
              
              {/* Animated sparkles */}
              <div className="absolute top-3 left-3 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
              <div className="absolute top-16 right-6 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-6 left-4 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              
              {/* Top-right icon positioning */}
              <div className="w-24 h-24 absolute top-4 right-4 z-30 group-hover:scale-110 transition-transform duration-500">
                <img
                  src={iconPath}
                  alt={`Chapter ${chapter.chapterNumber} icon`}
                  className="w-full h-full object-contain drop-shadow-2xl filter brightness-110 contrast-110"
                  onError={handleIconError}
                  style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}
                />
              </div>
              
              {/* Enhanced chapter number */}
              <div className={`absolute top-4 left-4 font-black text-2xl ${textColor} z-20 px-4 py-2 rounded-xl backdrop-blur-md border shadow-2xl group-hover:scale-110 transition-all duration-300`}
                style={{
                  background: `linear-gradient(135deg, ${chapterHex}60, ${chapterHex}80)`,
                  borderColor: `${chapterHex}80`,
                  textShadow: `0 2px 8px ${chapterHex}80`
                }}>
                {chapter.chapterNumber}
              </div>
              
              {/* Chapter title only at bottom */}
              <div className="absolute bottom-3 left-3 right-3 z-20 h-12">
                <div className={`${textColor} backdrop-blur-xl border-2 rounded-xl px-3 py-2 shadow-2xl h-full flex items-center justify-center group-hover:scale-105 transition-all duration-300`}
                  style={{
                    background: `linear-gradient(135deg, ${chapterHex}50, ${chapterHex}70)`,
                    borderColor: `${chapterHex}80`,
                  }}>
                  <ResponsiveText
                    text={chapter.title}
                    className={`font-bold tracking-wide text-center w-full ${textColor}`}
                    style={{ 
                      textShadow: `0 2px 6px ${chapterHex}80`
                    }}
                    maxFontSize={16}
                    minFontSize={9}
                  />
                </div>
              </div>
              
              {/* Enhanced mystical overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none group-hover:from-white/10 group-hover:to-black/10 transition-all duration-500"></div>
            </Link>
          );
        })}
        </div>
        
        {/* Enhanced footer section */}
        {chapters.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Chapters Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">This book's chapters are still being prepared for your journey.</p>
          </div>
        )}
      </div>
    </div>
  );
}