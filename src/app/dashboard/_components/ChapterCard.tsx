'use client';

import Link from 'next/link';
import { ChevronRightIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ChapterAnalytics {
  id: string;
  title: string;
  chapterNumber: number;
  bookTitle: string;
  bookId: string;
  pages: number;
  words: number;
  scenes: number;
  taskGroups: number;
  completionRate: number;
  lastUpdated: string;
  colorTheme?: {
    name: string;
    hex: string;
  };
  focus?: string;
  status?: 'draft' | 'in_progress' | 'completed' | 'published';
}

interface ChapterCardProps {
  chapter: ChapterAnalytics;
  compact?: boolean;
  showBookTitle?: boolean;
}

export default function ChapterCard({ 
  chapter, 
  compact = false, 
  showBookTitle = true 
}: ChapterCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
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
            <DocumentTextIcon className="w-5 h-5 text-gray-400" />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Chapter {chapter.chapterNumber}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-32">
                {chapter.title}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {chapter.completionRate}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {chapter.words.toLocaleString()} words
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
              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Chapter {chapter.chapterNumber}: {chapter.title}
              </h3>
            </div>
            {chapter.colorTheme && (
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: chapter.colorTheme.hex }}
                title={chapter.colorTheme.name}
              ></div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 mb-2">
            {showBookTitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {chapter.bookTitle}
              </p>
            )}
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-500">
              <ClockIcon className="w-3 h-3" />
              <span>Updated {formatDate(chapter.lastUpdated)}</span>
            </div>
          </div>

          {chapter.focus && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
              Focus: {chapter.focus}
            </p>
          )}

          {chapter.status && (
            <div className="mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(chapter.status)}`}>
                {getStatusLabel(chapter.status)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <Link
            href={`/dashboard/chapter/${chapter.id}`}
            className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
          >
            <span className="text-sm font-medium">Analytics</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
          <Link
            href={`/chapters/${chapter.id}`}
            className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <span className="text-sm font-medium">Edit</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">{chapter.pages}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Pages</div>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{chapter.words.toLocaleString()}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Words</div>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{chapter.scenes}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Scenes</div>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">{chapter.taskGroups}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Tasks</div>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{chapter.completionRate}%</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Complete</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{chapter.completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(chapter.completionRate, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}