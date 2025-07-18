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
  originalTitle?: string;
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

// Helper functions for enhanced color styling
const getTextColor = (bgColor: string): 'text-white' | 'text-black' => {
  if (!bgColor) return 'text-black';
  const color = bgColor.startsWith('#') ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'text-black' : 'text-white';
};

// Generate sophisticated gradient backgrounds
const createGradientBackground = (hex: string) => {
  const lighterHex = adjustBrightness(hex, 20);
  const darkerHex = adjustBrightness(hex, -30);
  return `linear-gradient(135deg, ${hex}E6 0%, ${lighterHex}CC 25%, ${hex}B3 50%, ${darkerHex}E6 100%)`;
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

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('/api/books');
        if (response.ok) {
          const data = await response.json();
          setBooks(data.books || []);
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
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-600 bg-clip-text text-transparent">
              Epic Arcana
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-200">Chronicles</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
            Journey through nine transformative books of temporal mastery, each revealing unique aspects of Francisco's evolution across time and consciousness.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => {
          const backgroundColor = book.colorTheme?.hex || '#6366f1';
          const textColorClass = getTextColor(backgroundColor);
          const gradientBg = createGradientBackground(backgroundColor);
          const glowColor = backgroundColor + '40'; // Add transparency for glow effect
          
          return (
            <Link 
              href={`/books/${book.id}`} 
              key={book.id} 
              className="group block"
            >
              <div 
                className="relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-[1.03] hover:rotate-1 h-[360px] group-hover:shadow-2xl"
                style={{
                  boxShadow: `0 25px 50px -12px ${glowColor}, 0 0 0 1px ${backgroundColor}20`,
                  filter: 'hover:brightness(1.1)'
                }}
              >
                {/* Animated gradient background */}
                <div 
                  className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: gradientBg }}
                />
                
                {/* Mystical overlay pattern */}
                <div 
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  style={{
                    backgroundImage: `radial-gradient(circle at 20% 80%, ${backgroundColor}60 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${backgroundColor}60 0%, transparent 50%)`
                  }}
                />
                
                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                  {/* Enhanced decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-20 translate-x-20 group-hover:scale-110 transition-transform duration-700"
                    style={{ background: `radial-gradient(circle, ${backgroundColor}20 0%, transparent 70%)` }}></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-16 -translate-x-16 group-hover:scale-110 transition-transform duration-700"
                    style={{ background: `radial-gradient(circle, ${backgroundColor}30 0%, transparent 70%)` }}></div>
                  
                  {/* Mystical sparkles */}
                  <div className="absolute top-4 left-4 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                  <div className="absolute top-12 right-8 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-16 left-8 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                  
                  <div className="relative z-20">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold mb-6 ${textColorClass} backdrop-blur-md border group-hover:scale-105 transition-all duration-300`}
                      style={{ 
                        background: `linear-gradient(135deg, ${backgroundColor}40, ${backgroundColor}60)`,
                        borderColor: `${backgroundColor}60`,
                        boxShadow: `0 4px 12px ${backgroundColor}30`
                      }}>
                      <span className="tracking-wider">BOOK {book.bookNumber}</span>
                    </div>
                    <h2 className={`text-3xl font-black mb-2 ${textColorClass} leading-tight group-hover:scale-105 transition-all duration-300 tracking-tight`}
                      style={{ textShadow: `0 2px 8px ${backgroundColor}80` }}>
                      {book.fictionNovelTitle || book.title}
                    </h2>
                    {book.originalTitle && (
                      <p className={`text-sm ${textColorClass} opacity-80 font-medium mb-4 tracking-wide`}
                        style={{ textShadow: `0 1px 3px ${backgroundColor}60` }}>
                        {book.originalTitle}
                      </p>
                    )}
                  </div>
                  
                  <div className="relative z-20 space-y-4">
                    {book.colorTheme && (
                      <div className={`inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold ${textColorClass} backdrop-blur-md border group-hover:scale-105 transition-all duration-300`}
                        style={{
                          background: `linear-gradient(135deg, ${backgroundColor}50, ${backgroundColor}70)`,
                          borderColor: `${backgroundColor}80`,
                          boxShadow: `0 4px 12px ${backgroundColor}40`
                        }}>
                        <div 
                          className="w-3 h-3 rounded-full mr-2 shadow-lg" 
                          style={{ 
                            backgroundColor: book.colorTheme.hex,
                            boxShadow: `0 0 8px ${book.colorTheme.hex}80, inset 0 1px 0 rgba(255,255,255,0.3)`
                          }}
                        ></div>
                        <span className="tracking-wider uppercase">{book.colorTheme.name}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced hover arrow */}
                  <div className={`absolute bottom-6 right-6 w-10 h-10 ${textColorClass} opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 rotate-12 group-hover:rotate-0`}
                    style={{
                      background: `linear-gradient(135deg, ${backgroundColor}60, ${backgroundColor}80)`,
                      borderRadius: '50%',
                      boxShadow: `0 4px 12px ${backgroundColor}50`
                    }}>
                    <svg className="w-6 h-6 m-2" fill="currentColor" viewBox="0 0 20 20">
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
