'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import DashboardSidebar from '../_components/DashboardSidebar';
import SimpleChart from '@/components/SimpleChart';
import { 
  BookOpenIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface BookStats {
  id: string;
  title: string;
  bookNumber: number;
  totalChapters: number;
  completedChapters: number;
  totalPages: number;
  totalWords: number;
  averageWordsPerPage: number;
  averageWordsPerChapter: number;
  estimatedReadingTime: number; // in minutes
  lastUpdated: string;
  status: 'draft' | 'in_progress' | 'completed' | 'published';
  startDate: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  dailyWordGoal: number;
  weeklyWordGoal: number;
  currentWordStreak: number;
  longestWordStreak: number;
  colorTheme: {
    name: string;
    hex: string;
    rgb: number[];
  };
  themes: string[];
  genres: string[];
  progressMetrics: {
    plotDevelopment: number;
    characterDevelopment: number;
    worldBuilding: number;
    thematicDepth: number;
    editingComplete: number;
  };
  writingVelocity: {
    wordsPerDay: number;
    wordsPerWeek: number;
    chaptersPerMonth: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  };
  qualityMetrics: {
    averageChapterLength: number;
    consistencyScore: number; // 0-100
    pacing: 'fast' | 'moderate' | 'slow';
    complexity: 'simple' | 'moderate' | 'complex';
  };
}

interface WritingSession {
  id: string;
  bookId: string;
  date: string;
  duration: number; // in minutes
  wordsWritten: number;
  chaptersWorkedOn: string[];
  mood: 'excellent' | 'good' | 'okay' | 'difficult';
  notes?: string;
}

export default function BooksDashboardPage() {
  const [books, setBooks] = useState<BookStats[]>([]);
  const [writingSessions, setWritingSessions] = useState<WritingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'bookNumber' | 'progress' | 'lastUpdated' | 'wordCount'>('bookNumber');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBooksData = useCallback(async () => {
    try {
      // This would fetch from your API
      const response = await fetch('/api/dashboard/books');
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books || []);
        setWritingSessions(data.writingSessions || []);
      }
    } catch (error) {
      console.error('Failed to fetch books data:', error);
      // Mock data for development
      setBooks(generateMockBooks());
      setWritingSessions(generateMockSessions());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooksData();
  }, [fetchBooksData]);

  const generateMockBooks = (): BookStats[] => {
    const bookTitles = [
      "Crown of the Ancient Ones",
      "Veil of Secrets Unveiled", 
      "Echoes of Enchantment",
      "Maiden of Mercy",
      "The Order of Justice",
      "Beauty Unleashed",
      "Dark Path to Victory",
      "Splendor of the Ancient Garden",
      "Kingdom Come"
    ];

    return Array.from({ length: 9 }, (_, i) => ({
      id: `book-${i + 1}`,
      title: bookTitles[i],
      bookNumber: i + 1,
      totalChapters: 40,
      completedChapters: Math.floor(Math.random() * 40) + 30,
      totalPages: 600 + Math.floor(Math.random() * 200),
      totalWords: 50000 + Math.floor(Math.random() * 30000),
      averageWordsPerPage: 250 + Math.floor(Math.random() * 50),
      averageWordsPerChapter: 1800 + Math.floor(Math.random() * 400),
      estimatedReadingTime: 180 + Math.floor(Math.random() * 60),
      lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: ['completed', 'in_progress', 'draft'][Math.floor(Math.random() * 3)] as 'completed' | 'in_progress' | 'draft',
      startDate: new Date(2024, 0, 1 + i * 30).toISOString(),
      dailyWordGoal: 500 + Math.floor(Math.random() * 500),
      weeklyWordGoal: 3500 + Math.floor(Math.random() * 1500),
      currentWordStreak: Math.floor(Math.random() * 30),
      longestWordStreak: 45 + Math.floor(Math.random() * 55),
      colorTheme: {
        name: ['Orange', 'Blue', 'Green', 'Purple', 'Red', 'Amber', 'Cyan', 'Pink', 'Indigo'][i],
        hex: ['#FF6B35', '#4F46E5', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#06B6D4', '#EC4899', '#6366F1'][i],
        rgb: [255, 107, 53]
      },
      themes: ['virtue', 'temporal mechanics', 'character transformation'],
      genres: ['fantasy', 'historical fiction', 'philosophical fiction'],
      progressMetrics: {
        plotDevelopment: 70 + Math.floor(Math.random() * 30),
        characterDevelopment: 75 + Math.floor(Math.random() * 25),
        worldBuilding: 80 + Math.floor(Math.random() * 20),
        thematicDepth: 65 + Math.floor(Math.random() * 35),
        editingComplete: 50 + Math.floor(Math.random() * 50)
      },
      writingVelocity: {
        wordsPerDay: 200 + Math.floor(Math.random() * 600),
        wordsPerWeek: 1500 + Math.floor(Math.random() * 3000),
        chaptersPerMonth: 3 + Math.floor(Math.random() * 5),
        trend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)] as 'increasing' | 'stable' | 'decreasing'
      },
      qualityMetrics: {
        averageChapterLength: 1800 + Math.floor(Math.random() * 400),
        consistencyScore: 70 + Math.floor(Math.random() * 30),
        pacing: ['fast', 'moderate', 'slow'][Math.floor(Math.random() * 3)] as 'fast' | 'moderate' | 'slow',
        complexity: ['simple', 'moderate', 'complex'][Math.floor(Math.random() * 3)] as 'simple' | 'moderate' | 'complex'
      }
    }));
  };

  const generateMockSessions = (): WritingSession[] => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `session-${i + 1}`,
      bookId: `book-${Math.floor(Math.random() * 9) + 1}`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 30 + Math.floor(Math.random() * 120),
      wordsWritten: 200 + Math.floor(Math.random() * 800),
      chaptersWorkedOn: [`Chapter ${Math.floor(Math.random() * 40) + 1}`],
      mood: ['excellent', 'good', 'okay', 'difficult'][Math.floor(Math.random() * 4)] as 'excellent' | 'good' | 'okay' | 'difficult',
      notes: Math.random() > 0.5 ? 'Made good progress on character development' : undefined
    }));
  };

  const filteredAndSortedBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.bookNumber.toString().includes(searchTerm);
      const matchesFilter = filterStatus === 'all' || book.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return (b.completedChapters / b.totalChapters) - (a.completedChapters / a.totalChapters);
        case 'lastUpdated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'wordCount':
          return b.totalWords - a.totalWords;
        default:
          return a.bookNumber - b.bookNumber;
      }
    });

  const overallStats = {
    totalBooks: books.length,
    completedBooks: books.filter(b => b.status === 'completed').length,
    inProgressBooks: books.filter(b => b.status === 'in_progress').length,
    totalWords: books.reduce((sum, book) => sum + book.totalWords, 0),
    totalPages: books.reduce((sum, book) => sum + book.totalPages, 0),
    averageCompletion: books.reduce((sum, book) => sum + (book.completedChapters / book.totalChapters * 100), 0) / books.length,
    totalWritingSessions: writingSessions.length,
    averageSessionLength: writingSessions.reduce((sum, session) => sum + session.duration, 0) / writingSessions.length,
    totalWordsThisMonth: writingSessions
      .filter(session => new Date(session.date).getMonth() === new Date().getMonth())
      .reduce((sum, session) => sum + session.wordsWritten, 0)
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <PlayIcon className="w-5 h-5 text-blue-500" />;
      case 'draft':
        return <PauseIcon className="w-5 h-5 text-gray-500" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
      case 'decreasing':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
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
          <Breadcrumbs items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Books', current: true }
          ]} />
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading books dashboard...</p>
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
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Books', current: true }
        ]} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-4">
              Books Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Monitor your writing progress, track book completion, and analyze your writing patterns across the Epic Arcana series.
            </p>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <BookOpenIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{overallStats.totalBooks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Books</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{overallStats.completedBooks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <PlayIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{overallStats.inProgressBooks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <SparklesIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{overallStats.totalWords.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Words</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <DocumentTextIcon className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{overallStats.totalPages.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Pages</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <ArrowTrendingUpIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{Math.round(overallStats.averageCompletion)}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Complete</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Progress Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <ChartBarIcon className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                Book Completion Progress
              </h3>
              <SimpleChart
                type="bar"
                data={books.map(book => ({
                  label: `Book ${book.bookNumber}`,
                  value: (book.completedChapters / book.totalChapters) * 100,
                  color: book.colorTheme.hex
                }))}
                height={250}
              />
            </div>

            {/* Writing Velocity Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <PencilSquareIcon className="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" />
                Writing Velocity Trends
              </h3>
              <SimpleChart
                type="line"
                data={books.map(book => ({
                  label: `Book ${book.bookNumber}`,
                  value: book.writingVelocity.wordsPerDay,
                  color: book.colorTheme.hex
                }))}
                height={250}
              />
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Filter by Status */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="draft">Draft</option>
                </select>

                {/* Sort by */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'bookNumber' | 'progress' | 'lastUpdated' | 'wordCount')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="bookNumber">Book Number</option>
                  <option value="progress">Progress</option>
                  <option value="lastUpdated">Last Updated</option>
                  <option value="wordCount">Word Count</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Books Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedBooks.map((book) => (
                <div key={book.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: book.colorTheme.hex }}
                      ></div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          Book {book.bookNumber}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-48">
                          {book.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(book.status)}
                      {getTrendIcon(book.writingVelocity.trend)}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {book.completedChapters}/{book.totalChapters} chapters
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(book.completedChapters / book.totalChapters) * 100}%`,
                          backgroundColor: book.colorTheme.hex
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {book.totalWords.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Words</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {book.writingVelocity.wordsPerDay}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Words/Day</div>
                    </div>
                  </div>

                  {/* Quality Metrics */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Consistency</span>
                      <span className="font-medium">{book.qualityMetrics.consistencyScore}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Reading Time</span>
                      <span className="font-medium">{formatTime(book.estimatedReadingTime)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      Updated {formatDate(book.lastUpdated)}
                    </span>
                    <Link
                      href={`/dashboard/books/${book.id}`}
                      className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    >
                      <span className="text-sm font-medium">Details</span>
                      <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Book</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Words</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Velocity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Updated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredAndSortedBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: book.colorTheme.hex }}
                            ></div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Book {book.bookNumber}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-48">
                                {book.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                              <div 
                                className="h-2 rounded-full"
                                style={{ 
                                  width: `${(book.completedChapters / book.totalChapters) * 100}%`,
                                  backgroundColor: book.colorTheme.hex
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {Math.round((book.completedChapters / book.totalChapters) * 100)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {book.totalWords.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {book.writingVelocity.wordsPerDay}/day
                            </span>
                            {getTrendIcon(book.writingVelocity.trend)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(book.status)}
                            <span className="text-sm capitalize text-gray-900 dark:text-gray-100">
                              {book.status.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(book.lastUpdated)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/dashboard/books/${book.id}`}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}