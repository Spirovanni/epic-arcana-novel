'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import DashboardSidebar from '../../_components/DashboardSidebar';
import SimpleChart from '@/components/SimpleChart';
import { 
  ChartBarIcon,
  BookOpenIcon,
  ClockIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  FireIcon,
  TrophyIcon,
  TableCellsIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface BookAnalytics {
  id: string;
  title: string;
  bookNumber: number;
  status: 'draft' | 'in_progress' | 'completed' | 'published';
  colorTheme: {
    name: string;
    hex: string;
  };
  metrics: {
    totalWords: number;
    targetWords: number;
    completedChapters: number;
    totalChapters: number;
    totalPages: number;
    averageWordsPerChapter: number;
    averageWordsPerPage: number;
    estimatedReadingTime: number;
    lastUpdated: string;
    daysInDevelopment: number;
    wordsPerDay: number;
    chaptersPerMonth: number;
  };
  qualityScores: {
    plotDevelopment: number;
    characterDevelopment: number;
    worldBuilding: number;
    thematicDepth: number;
    editingComplete: number;
    consistencyScore: number;
    readabilityScore: number;
    pacing: 'fast' | 'moderate' | 'slow';
    complexity: 'simple' | 'moderate' | 'complex';
  };
  developmentTimeline: {
    started: string;
    firstDraft?: string;
    firstEdit?: string;
    finalDraft?: string;
    published?: string;
    milestones: {
      date: string;
      event: string;
      description: string;
      type: 'start' | 'milestone' | 'completion' | 'revision';
    }[];
  };
  productivityMetrics: {
    writingSessions: number;
    averageSessionLength: number;
    totalHoursWritten: number;
    wordsPerHour: number;
    bestDay: {
      date: string;
      words: number;
    };
    currentStreak: number;
    longestStreak: number;
    productivityTrend: 'increasing' | 'stable' | 'decreasing';
  };
  comparativeRanking: {
    wordCountRank: number;
    completionRank: number;
    qualityRank: number;
    productivityRank: number;
  };
}

interface SeriesAnalytics {
  totalBooks: number;
  completedBooks: number;
  totalWords: number;
  totalChapters: number;
  averageBookLength: number;
  seriesCompletionRate: number;
  estimatedSeriesReadingTime: number;
  developmentStartDate: string;
  projectedCompletionDate: string;
  overallQualityScore: number;
  consistencyAcrossBooks: number;
}

interface TimeRangeData {
  range: '7d' | '30d' | '90d' | '1y' | 'all';
  data: {
    date: string;
    wordsWritten: number;
    hoursWritten: number;
    chaptersCompleted: number;
    booksWorkedOn: string[];
  }[];
}

export default function BooksAnalyticsPage() {
  const [booksData, setBooksData] = useState<BookAnalytics[]>([]);
  const [seriesData, setSeriesData] = useState<SeriesAnalytics | null>(null);
  const [timeRangeData, setTimeRangeData] = useState<TimeRangeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'development' | 'productivity' | 'quality'>('overview');
  const [sortBy, setSortBy] = useState<'bookNumber' | 'completion' | 'quality' | 'productivity'>('bookNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const response = await fetch(`/api/dashboard/books/analytics?range=${selectedTimeRange}`);
      if (response.ok) {
        const data = await response.json();
        setBooksData(data.books);
        setSeriesData(data.series);
        setTimeRangeData(data.timeRange);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      // Generate mock data for development
      setBooksData(generateMockBooksAnalytics());
      setSeriesData(generateMockSeriesAnalytics());
    } finally {
      setLoading(false);
    }
  }, [selectedTimeRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeRange, fetchAnalyticsData]);

  const generateMockBooksAnalytics = (): BookAnalytics[] => {
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

    const colors = ['#FF6B35', '#4F46E5', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#06B6D4', '#EC4899', '#6366F1'];
    const statuses = ['completed', 'completed', 'completed', 'completed', 'completed', 'in_progress', 'in_progress', 'draft', 'draft'];

    return Array.from({ length: 9 }, (_, i) => {
      const totalWords = 65000 + Math.floor(Math.random() * 25000);
      const targetWords = 80000;
      const completedChapters = statuses[i] === 'completed' ? 40 : Math.floor(Math.random() * 40) + 20;
      const daysInDev = 90 + Math.floor(Math.random() * 200);

      return {
        id: `book-${i + 1}`,
        title: bookTitles[i],
        bookNumber: i + 1,
        status: statuses[i] as 'draft' | 'in_progress' | 'completed' | 'published',
        colorTheme: {
          name: ['Orange', 'Blue', 'Green', 'Purple', 'Red', 'Amber', 'Cyan', 'Pink', 'Indigo'][i],
          hex: colors[i]
        },
        metrics: {
          totalWords,
          targetWords,
          completedChapters,
          totalChapters: 40,
          totalPages: Math.floor(totalWords / 280),
          averageWordsPerChapter: Math.floor(totalWords / completedChapters),
          averageWordsPerPage: 280 + Math.floor(Math.random() * 40),
          estimatedReadingTime: Math.floor(totalWords / 250),
          lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          daysInDevelopment: daysInDev,
          wordsPerDay: Math.floor(totalWords / daysInDev),
          chaptersPerMonth: Math.floor((completedChapters / daysInDev) * 30)
        },
        qualityScores: {
          plotDevelopment: 70 + Math.floor(Math.random() * 30),
          characterDevelopment: 75 + Math.floor(Math.random() * 25),
          worldBuilding: 80 + Math.floor(Math.random() * 20),
          thematicDepth: 65 + Math.floor(Math.random() * 35),
          editingComplete: statuses[i] === 'completed' ? 90 + Math.floor(Math.random() * 10) : 30 + Math.floor(Math.random() * 50),
          consistencyScore: 75 + Math.floor(Math.random() * 25),
          readabilityScore: 70 + Math.floor(Math.random() * 30),
          pacing: ['fast', 'moderate', 'slow'][Math.floor(Math.random() * 3)] as 'fast' | 'moderate' | 'slow',
          complexity: ['moderate', 'complex'][Math.floor(Math.random() * 2)] as 'moderate' | 'complex'
        },
        developmentTimeline: {
          started: new Date(2024, i, 1).toISOString(),
          firstDraft: statuses[i] !== 'draft' ? new Date(2024, i + 1, 15).toISOString() : undefined,
          firstEdit: statuses[i] === 'completed' ? new Date(2024, i + 2, 1).toISOString() : undefined,
          finalDraft: statuses[i] === 'completed' ? new Date(2024, i + 2, 20).toISOString() : undefined,
          milestones: [
            {
              date: new Date(2024, i, 1).toISOString(),
              event: 'Development Started',
              description: 'Initial planning and outline creation',
              type: 'start'
            },
            {
              date: new Date(2024, i, 15).toISOString(),
              event: 'First Chapter Completed',
              description: 'Completed first chapter draft',
              type: 'milestone'
            }
          ]
        },
        productivityMetrics: {
          writingSessions: 80 + Math.floor(Math.random() * 120),
          averageSessionLength: 90 + Math.floor(Math.random() * 60),
          totalHoursWritten: 120 + Math.floor(Math.random() * 180),
          wordsPerHour: 400 + Math.floor(Math.random() * 300),
          bestDay: {
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            words: 1200 + Math.floor(Math.random() * 800)
          },
          currentStreak: Math.floor(Math.random() * 25),
          longestStreak: 35 + Math.floor(Math.random() * 30),
          productivityTrend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)] as 'increasing' | 'stable' | 'decreasing'
        },
        comparativeRanking: {
          wordCountRank: Math.floor(Math.random() * 9) + 1,
          completionRank: Math.floor(Math.random() * 9) + 1,
          qualityRank: Math.floor(Math.random() * 9) + 1,
          productivityRank: Math.floor(Math.random() * 9) + 1
        }
      };
    });
  };

  const generateMockSeriesAnalytics = (): SeriesAnalytics => {
    return {
      totalBooks: 9,
      completedBooks: 5,
      totalWords: 585000,
      totalChapters: 360,
      averageBookLength: 65000,
      seriesCompletionRate: 72,
      estimatedSeriesReadingTime: 2340, // in minutes
      developmentStartDate: new Date(2024, 0, 1).toISOString(),
      projectedCompletionDate: new Date(2024, 11, 31).toISOString(),
      overallQualityScore: 82,
      consistencyAcrossBooks: 78
    };
  };

  const sortedBooks = [...booksData].sort((a, b) => {
    let aValue: number, bValue: number;
    
    switch (sortBy) {
      case 'completion':
        aValue = (a.metrics.completedChapters / a.metrics.totalChapters) * 100;
        bValue = (b.metrics.completedChapters / b.metrics.totalChapters) * 100;
        break;
      case 'quality':
        aValue = Object.values(a.qualityScores).slice(0, 5).reduce((sum: number, val) => sum + (typeof val === 'number' ? val : 0), 0) / 5;
        bValue = Object.values(b.qualityScores).slice(0, 5).reduce((sum: number, val) => sum + (typeof val === 'number' ? val : 0), 0) / 5;
        break;
      case 'productivity':
        aValue = a.productivityMetrics.wordsPerHour;
        bValue = b.productivityMetrics.wordsPerHour;
        break;
      default:
        aValue = a.bookNumber;
        bValue = b.bookNumber;
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'in_progress':
        return 'text-blue-600 dark:text-blue-400';
      case 'draft':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-amber-600 dark:text-amber-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
      case 'decreasing':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
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
            { label: 'Books', href: '/dashboard/books' },
            { label: 'Analytics', current: true }
          ]} />
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
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
          { label: 'Books', href: '/dashboard/books' },
          { label: 'Analytics', current: true }
        ]} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-4">
              Books Analytics
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
              Deep dive into your writing development across the Epic Arcana series with comprehensive analytics, productivity insights, and quality assessments.
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Time Range Selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y' | 'all')}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>

                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'bookNumber' | 'completion' | 'quality' | 'productivity')}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  >
                    <option value="bookNumber">Book Number</option>
                    <option value="completion">Completion</option>
                    <option value="quality">Quality Score</option>
                    <option value="productivity">Productivity</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {sortOrder === 'asc' ? (
                      <ChevronUpIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* View Selector */}
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {[
                  { key: 'overview', label: 'Overview', icon: ChartBarIcon },
                  { key: 'development', label: 'Development', icon: BookOpenIcon },
                  { key: 'productivity', label: 'Productivity', icon: PencilSquareIcon },
                  { key: 'quality', label: 'Quality', icon: TrophyIcon }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedView(key as 'overview' | 'development' | 'productivity' | 'quality')}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      selectedView === key
                        ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Series Overview Stats */}
          {seriesData && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <BookOpenIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {seriesData.completedBooks}/{seriesData.totalBooks}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Books Complete</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <SparklesIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {(seriesData.totalWords / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Words</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <DocumentTextIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {seriesData.totalChapters}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Chapters</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <ClockIcon className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {formatTime(seriesData.estimatedSeriesReadingTime)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Reading Time</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <TrophyIcon className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {seriesData.overallQualityScore}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Quality Score</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <ArrowTrendingUpIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {seriesData.seriesCompletionRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Series Progress</div>
              </div>
            </div>
          )}

          {/* Main Content Based on Selected View */}
          {selectedView === 'overview' && (
            <div className="space-y-8">
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Book Completion Progress */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <ChartBarIcon className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Book Completion Progress
                  </h3>
                  <SimpleChart
                    type="bar"
                    data={sortedBooks.map(book => ({
                      label: `Book ${book.bookNumber}`,
                      value: (book.metrics.completedChapters / book.metrics.totalChapters) * 100,
                      color: book.colorTheme.hex
                    }))}
                    height={300}
                  />
                </div>

                {/* Word Count Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <SparklesIcon className="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" />
                    Word Count Distribution
                  </h3>
                  <SimpleChart
                    type="bar"
                    data={sortedBooks.map(book => ({
                      label: `Book ${book.bookNumber}`,
                      value: book.metrics.totalWords,
                      color: book.colorTheme.hex
                    }))}
                    height={300}
                  />
                </div>
              </div>

              {/* Writing Timeline */}
              {timeRangeData && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <CalendarDaysIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                    Writing Activity Timeline ({selectedTimeRange})
                  </h3>
                  <SimpleChart
                    type="line"
                    data={timeRangeData.data.map((entry, index) => ({
                      label: `Day ${index + 1}`,
                      value: entry.wordsWritten,
                      color: '#6366F1'
                    }))}
                    height={250}
                  />
                </div>
              )}

              {/* Books Summary Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                    <TableCellsIcon className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-400" />
                    Books Overview
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Book</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Words</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quality</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Productivity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {sortedBooks.map((book) => {
                        const completionRate = (book.metrics.completedChapters / book.metrics.totalChapters) * 100;
                        const qualityScore = Object.values(book.qualityScores).slice(0, 5).reduce((sum: number, val) => sum + (typeof val === 'number' ? val : 0), 0) / 5;
                        
                        return (
                          <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                                  style={{ backgroundColor: book.colorTheme.hex }}
                                ></div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Book {book.bookNumber}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-32">
                                    {book.title}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                book.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                book.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {book.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                                  <div 
                                    className="h-2 rounded-full"
                                    style={{ 
                                      width: `${completionRate}%`,
                                      backgroundColor: book.colorTheme.hex
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                  {Math.round(completionRate)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-100">
                                {book.metrics.totalWords.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {book.metrics.wordsPerDay}/day
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-medium ${getQualityColor(qualityScore)}`}>
                                {Math.round(qualityScore)}%
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                  {book.productivityMetrics.wordsPerHour}/hr
                                </span>
                                {getTrendIcon(book.productivityMetrics.productivityTrend)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3">
                                <EyeIcon className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'development' && (
            <div className="space-y-8">
              {/* Development Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                  <CalendarDaysIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Series Development Timeline
                </h3>
                <div className="space-y-6">
                  {sortedBooks.map((book, index) => (
                    <div key={book.id} className="relative">
                      {index < sortedBooks.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200 dark:bg-gray-700"></div>
                      )}
                      <div className="flex items-start space-x-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: book.colorTheme.hex }}
                        >
                          {book.bookNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {book.title}
                            </h4>
                            <span className={`text-sm font-medium ${getStatusColor(book.status)}`}>
                              {book.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Started:</span>
                              <div className="font-medium">{formatDate(book.developmentTimeline.started)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Days in Dev:</span>
                              <div className="font-medium">{book.metrics.daysInDevelopment}</div>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Chapters:</span>
                              <div className="font-medium">{book.metrics.completedChapters}/{book.metrics.totalChapters}</div>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Words/Day:</span>
                              <div className="font-medium">{book.metrics.wordsPerDay}</div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${(book.metrics.completedChapters / book.metrics.totalChapters) * 100}%`,
                                  backgroundColor: book.colorTheme.hex
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Development Metrics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Development Speed (Words/Day)
                  </h3>
                  <SimpleChart
                    type="bar"
                    data={sortedBooks.map(book => ({
                      label: `Book ${book.bookNumber}`,
                      value: book.metrics.wordsPerDay,
                      color: book.colorTheme.hex
                    }))}
                    height={250}
                  />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Development Duration (Days)
                  </h3>
                  <SimpleChart
                    type="bar"
                    data={sortedBooks.map(book => ({
                      label: `Book ${book.bookNumber}`,
                      value: book.metrics.daysInDevelopment,
                      color: book.colorTheme.hex
                    }))}
                    height={250}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedView === 'productivity' && (
            <div className="space-y-8">
              {/* Productivity Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <PencilSquareIcon className="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" />
                    Words Per Hour
                  </h3>
                  <SimpleChart
                    type="bar"
                    data={sortedBooks.map(book => ({
                      label: `Book ${book.bookNumber}`,
                      value: book.productivityMetrics.wordsPerHour,
                      color: book.colorTheme.hex
                    }))}
                    height={250}
                  />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <ClockIcon className="w-6 h-6 mr-2 text-amber-600 dark:text-amber-400" />
                    Total Hours Written
                  </h3>
                  <SimpleChart
                    type="bar"
                    data={sortedBooks.map(book => ({
                      label: `Book ${book.bookNumber}`,
                      value: book.productivityMetrics.totalHoursWritten,
                      color: book.colorTheme.hex
                    }))}
                    height={250}
                  />
                </div>
              </div>

              {/* Productivity Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedBooks.map((book) => (
                  <div key={book.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Book {book.bookNumber}
                      </h4>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: book.colorTheme.hex }}
                      ></div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Sessions:</span>
                        <span className="font-medium">{book.productivityMetrics.writingSessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Avg Session:</span>
                        <span className="font-medium">{book.productivityMetrics.averageSessionLength}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Words/Hour:</span>
                        <span className="font-medium">{book.productivityMetrics.wordsPerHour}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Best Day:</span>
                        <span className="font-medium">{book.productivityMetrics.bestDay.words} words</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Current Streak:</span>
                        <span className="font-medium flex items-center">
                          <FireIcon className="w-4 h-4 text-red-500 mr-1" />
                          {book.productivityMetrics.currentStreak}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Trend:</span>
                        <span className="font-medium flex items-center">
                          {getTrendIcon(book.productivityMetrics.productivityTrend)}
                          <span className="ml-1 capitalize">{book.productivityMetrics.productivityTrend}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedView === 'quality' && (
            <div className="space-y-8">
              {/* Quality Overview Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <TrophyIcon className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
                  Overall Quality Scores
                </h3>
                <SimpleChart
                  type="bar"
                  data={sortedBooks.map(book => {
                    const qualityScore = Object.values(book.qualityScores).slice(0, 5).reduce((sum: number, val) => sum + (typeof val === 'number' ? val : 0), 0) / 5;
                    return {
                      label: `Book ${book.bookNumber}`,
                      value: qualityScore,
                      color: book.colorTheme.hex
                    };
                  })}
                  height={250}
                />
              </div>

              {/* Quality Metrics Detail */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sortedBooks.map((book) => (
                  <div key={book.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Book {book.bookNumber}: {book.title}
                      </h4>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: book.colorTheme.hex }}
                      ></div>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(book.qualityScores).slice(0, 7).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <span className={`text-sm font-medium ${getQualityColor(typeof value === 'number' ? value : 0)}`}>
                              {typeof value === 'number' ? `${value}%` : value}
                            </span>
                          </div>
                          {typeof value === 'number' && (
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${value}%`,
                                  backgroundColor: book.colorTheme.hex
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}