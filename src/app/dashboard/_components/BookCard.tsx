'use client';

import Link from 'next/link';
import { ChevronRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';

interface BookProgress {
  id: string;
  title: string;
  bookNumber: number;
  chapters: number;
  totalPages: number;
  totalWords: number;
  completionPercentage: number;
  lastUpdated: string;
  colorTheme?: {
    name: string;
    hex: string;
  };
  description?: string;
  status?: 'draft' | 'in_progress' | 'completed' | 'published';
}

interface BookCardProps {
  book: BookProgress;
  compact?: boolean;
}

export default function BookCard({ book, compact = false }: BookCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'published':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'draft':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'published':
        return 'Published';
      case 'draft':
      default:
        return 'Draft';
    }
  };

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {book.colorTheme && (
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: book.colorTheme.hex }}
              ></div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Book {book.bookNumber}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-32">
                {book.title}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {book.completionPercentage}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {book.chapters} chapters
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center space-x-2">
              <BookOpenIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Book {book.bookNumber}: {book.title}
              </h3>
            </div>
            {book.colorTheme && (
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: book.colorTheme.hex }}
                title={book.colorTheme.name}
              ></div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {formatDate(book.lastUpdated)}
            </p>
            {book.status && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                {getStatusLabel(book.status)}
              </span>
            )}
          </div>

          {book.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {book.description}
            </p>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <Link
            href={`/books/${book.id}`}
            className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <span className="text-sm font-medium">View Book</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
          <Link
            href={`/dashboard/books/${book.id}/analytics`}
            className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
          >
            <span className="text-sm font-medium">Analytics</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{book.chapters}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Chapters</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">{book.totalPages}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Pages</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{book.totalWords.toLocaleString()}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Words</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{book.completionPercentage}%</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Complete</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{book.completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(book.completionPercentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}