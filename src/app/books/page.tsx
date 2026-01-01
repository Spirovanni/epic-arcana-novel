'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppNavbar } from '@/components/shared/AppNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, FileDown } from 'lucide-react';

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

// Helper function for color contrast
const getContrastColor = (hex: string): string => {
  if (!hex) return 'hsl(var(--foreground))';
  const color = hex.startsWith('#') ? hex.substring(1, 7) : hex;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

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

  const handleDownloadOutline = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/books/outlines/pdf');
      if (!response.ok) {
        throw new Error(`Failed to generate outline PDF: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'epic-arcana-sudowrite-outline.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading outline PDF', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground">Loading Epic Arcana Chronicles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-end mb-6">
          <Button 
            onClick={handleDownloadOutline} 
            disabled={loading || downloading}
            size="lg"
            className="flex items-center gap-2"
          >
            {downloading ? 'Generating Outline PDF...' : 'Download Sudowrite Outline PDF'}
            <FileDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Epic Arcana Chronicles
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Journey through nine transformative books of temporal mastery and consciousness evolution.
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const themeColor = book.colorTheme?.hex || 'hsl(var(--primary))';
            const contrastColor = getContrastColor(themeColor);
            
            return (
              <Link 
                href={`/books/${book.id}`} 
                key={book.id} 
                className="group block"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-border/50 hover:border-border">
                  <CardHeader 
                    className="text-center pb-3"
                    style={{
                      background: `linear-gradient(135deg, ${themeColor}15, ${themeColor}25)`,
                      borderBottom: `1px solid ${themeColor}30`
                    }}
                  >
                    <div className="flex items-center justify-center mb-3">
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-semibold"
                        style={{
                          backgroundColor: themeColor,
                          color: contrastColor,
                          border: 'none'
                        }}
                      >
                        BOOK {book.bookNumber}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground leading-tight">
                      {book.fictionNovelTitle || book.title}
                    </CardTitle>
                    {book.originalTitle && (
                      <p className="text-sm text-muted-foreground font-medium">
                        {book.originalTitle}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-4 space-y-4">
                    {/* Summary */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {book.summary.length > 100 ? `${book.summary.substring(0, 100)}...` : book.summary}
                    </p>
                    
                    {/* Color Theme Badge */}
                    {book.colorTheme && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full border border-border/50" 
                          style={{ backgroundColor: book.colorTheme.hex }}
                        />
                        <Badge variant="outline" className="text-xs">
                          {book.colorTheme.name}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Action Button */}
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Read Book {book.bookNumber}
                        <BookOpen className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {books.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No books available</h3>
            <p className="text-muted-foreground">Check back later for new chronicles.</p>
          </div>
        )}
      </div>
    </div>
  );
}
