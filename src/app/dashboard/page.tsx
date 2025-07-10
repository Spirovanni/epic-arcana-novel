'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import SimpleChart from '@/components/SimpleChart';
import DashboardSidebar from './_components/DashboardSidebar';
import StatsCard from './_components/StatsCard';
import ProgressCard from './_components/ProgressCard';
import ActivityFeed from './_components/ActivityFeed';
import BookCard from './_components/BookCard';
import ChapterCard from './_components/ChapterCard';
import { 
  ChartBarIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ClockIcon,
  AcademicCapIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalBooks: number;
  totalChapters: number;
  totalPages: number;
  totalWords: number;
  totalScenes: number;
  totalTaskGroups: number;
  completionRate: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: 'page_created' | 'page_updated' | 'chapter_created';
  title: string;
  timestamp: string;
  bookTitle: string;
  chapterTitle?: string;
}

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
}

interface ChapterAnalytics {
  id: string;
  title: string;
  chapterNumber: number;
  bookTitle: string;
  pages: number;
  words: number;
  scenes: number;
  taskGroups: number;
  completionRate: number;
  lastUpdated: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookProgress, setBookProgress] = useState<BookProgress[]>([]);
  const [topChapters, setTopChapters] = useState<ChapterAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'books' | 'chapters'>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setBookProgress(data.bookProgress);
        setTopChapters(data.topChapters);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'page_created':
        return <DocumentTextIcon className="w-4 h-4 text-green-500" />;
      case 'page_updated':
        return <PencilSquareIcon className="w-4 h-4 text-blue-500" />;
      case 'chapter_created':
        return <BookOpenIcon className="w-4 h-4 text-purple-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'page_created':
        return `New page created in ${activity.chapterTitle}`;
      case 'page_updated':
        return `Page updated in ${activity.chapterTitle}`;
      case 'chapter_created':
        return `New chapter created: ${activity.title}`;
      default:
        return activity.title;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <DashboardSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <Breadcrumbs items={[{ label: 'Dashboard', current: true }]} />
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <DashboardSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Breadcrumbs items={[{ label: 'Dashboard', current: true }]} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-4">
            Epic Arcana Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Monitor your writing progress, track analytics, and dive deep into your epic journey.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg">
            {[
              { key: 'overview', label: 'Overview', icon: ChartBarIcon },
              { key: 'books', label: 'Books', icon: BookOpenIcon },
              { key: 'chapters', label: 'Chapters', icon: DocumentTextIcon },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeView === key
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeView === 'overview' && stats && (
          <div className="space-y-8">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
              <StatsCard
                title="Books"
                value={stats.totalBooks}
                icon={BookOpenIcon}
                color="indigo"
              />
              <StatsCard
                title="Chapters"
                value={stats.totalChapters}
                icon={DocumentTextIcon}
                color="blue"
              />
              <StatsCard
                title="Pages"
                value={stats.totalPages}
                icon={PencilSquareIcon}
                color="green"
              />
              <StatsCard
                title="Words"
                value={stats.totalWords}
                icon={SparklesIcon}
                color="purple"
              />
              <StatsCard
                title="Scenes"
                value={stats.totalScenes}
                icon={ClockIcon}
                color="amber"
              />
              <StatsCard
                title="Tasks"
                value={stats.totalTaskGroups}
                icon={AcademicCapIcon}
                color="red"
              />
            </div>

            {/* Completion Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProgressCard
                  title="Overall Progress"
                  percentage={stats.completionRate}
                  description="Based on chapter completion and content development"
                  color="green"
                />
              </div>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Quick Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Avg Pages/Chapter:</span>
                      <span className="font-medium">{Math.round(stats.totalPages / stats.totalChapters)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Avg Words/Page:</span>
                      <span className="font-medium">{Math.round(stats.totalWords / stats.totalPages)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tasks/Chapter:</span>
                      <span className="font-medium">{Math.round(stats.totalTaskGroups / stats.totalChapters)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Recent Activity and Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityFeed 
                activities={stats.recentActivity} 
                maxItems={6}
              />
              
              {/* Book Progress Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <ChartBarIcon className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Book Completion Progress
                </h3>
                <SimpleChart
                  type="bar"
                  data={bookProgress.slice(0, 6).map(book => ({
                    label: `Book ${book.bookNumber}`,
                    value: book.completionPercentage,
                    color: book.colorTheme?.hex || '#6366F1'
                  }))}
                  height={250}
                />
              </div>
            </div>
          </div>
        )}

        {/* Books Tab */}
        {activeView === 'books' && (
          <div className="space-y-6">
            <div className="grid gap-6">
              {bookProgress.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                  <BookOpenIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">No books found</p>
                </div>
              ) : (
                bookProgress.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Chapters Tab */}
        {activeView === 'chapters' && (
          <div className="space-y-6">
            <div className="grid gap-4">
              {topChapters.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                  <DocumentTextIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">No chapters found</p>
                </div>
              ) : (
                topChapters.map((chapter) => (
                  <ChapterCard 
                    key={chapter.id} 
                    chapter={{
                      ...chapter,
                      bookId: 'temp-id' // This would come from your API
                    }} 
                  />
                ))
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}