'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  description: string;
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

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;
    async function fetchChapters() {
      try {
        const response = await fetch(`/api/books/${bookId}/chapters`);
        if (response.ok) {
          const data = await response.json();
          setChapters(data);
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
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="aspect-square rounded-lg flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg"
            style={{ backgroundColor: chapter.colorTheme?.hex || '#ffffff' }}
          >
            <div className={`font-bold ${getTextColor(chapter.colorTheme?.hex)}`}>
              {chapter.chapterNumber}
            </div>
            <h2 className={`text-lg font-semibold ${getTextColor(chapter.colorTheme?.hex)}`}>
              {chapter.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}