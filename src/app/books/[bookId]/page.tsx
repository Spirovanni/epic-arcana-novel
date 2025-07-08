'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
    return <div className="text-center p-10">Loading chapters...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Chapters</h1>
        <Link href={`/outline/${bookId}`} className="text-blue-500 hover:underline">
          View Full Outline
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
              
              {/* Modern title - slimmed bottom area with larger font */}
              <div className="absolute bottom-2 left-2 right-2 z-20 h-12">
                <div className={`${textColor} backdrop-blur-xl bg-white/30 border-2 border-white/40 rounded-xl px-4 py-2 shadow-2xl h-full flex items-center`}>
                  <h2 className="font-black text-2xl leading-tight tracking-wide w-full text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    {chapter.title}
                  </h2>
                </div>
              </div>
              
              {/* Subtle gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none"></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}