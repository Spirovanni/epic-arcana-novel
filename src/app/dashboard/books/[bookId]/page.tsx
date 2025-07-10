'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import DashboardSidebar from '../../_components/DashboardSidebar';
import SimpleChart from '@/components/SimpleChart';
import { 
  BookOpenIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  SparklesIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  FireIcon,
  TrophyIcon,
  AcademicCapIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface BookDetail {
  id: string;
  title: string;
  bookNumber: number;
  description: string;
  totalChapters: number;
  completedChapters: number;
  totalPages: number;
  totalWords: number;
  targetWords: number;
  estimatedReadingTime: number;
  status: 'draft' | 'in_progress' | 'completed' | 'published';
  startDate: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  lastUpdated: string;
  colorTheme: {
    name: string;
    hex: string;
    rgb: number[];
  };
  themes: string[];
  genres: string[];
  writingGoals: {
    dailyWords: number;
    weeklyWords: number;
    monthlyChapters: number;
  };
  progressMetrics: {
    plotDevelopment: number;
    characterDevelopment: number;
    worldBuilding: number;
    thematicDepth: number;
    editingComplete: number;
  };
  qualityMetrics: {
    averageChapterLength: number;
    consistencyScore: number;
    pacing: 'fast' | 'moderate' | 'slow';
    complexity: 'simple' | 'moderate' | 'complex';
    readabilityScore: number;
  };
  writingHistory: {
    date: string;
    wordsWritten: number;
    hoursSpent: number;
    chaptersWorkedOn: number[];
    mood: 'excellent' | 'good' | 'okay' | 'difficult';
    notes?: string;
  }[];
  chapters: {
    id: string;
    number: number;
    title: string;
    words: number;
    pages: number;
    status: 'not_started' | 'draft' | 'in_progress' | 'completed' | 'edited';
    lastUpdated: string;
    completionPercentage: number;
  }[];
}

interface WritingStreaks {
  current: number;
  longest: number;
  thisMonth: number;
}

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  
  const [book, setBook] = useState<BookDetail | null>(null);
  const [streaks, setStreaks] = useState<WritingStreaks | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'analytics' | 'goals'>('overview');

  useEffect(() => {
    fetchBookDetail();
  }, [bookId]);

  const fetchBookDetail = async () => {
    try {
      const response = await fetch(`/api/dashboard/books/${bookId}`);
      if (response.ok) {
        const data = await response.json();
        setBook(data.book);
        setStreaks(data.streaks);
      }
    } catch (error) {
      console.error('Failed to fetch book detail:', error);
      // Mock data for development
      setBook(generateMockBookDetail());
      setStreaks({ current: 12, longest: 45, thisMonth: 18 });
    } finally {
      setLoading(false);
    }
  };

  const generateMockBookDetail = (): BookDetail => {
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

    const bookNum = parseInt(bookId.split('-')[1]) || 1;
    
    return {
      id: bookId,
      title: bookTitles[bookNum - 1] || "Unknown Book",
      bookNumber: bookNum,
      description: "An epic fantasy journey exploring the depths of virtue, temporal mechanics, and character transformation through the lens of ancient wisdom and mystical arcana.",
      totalChapters: 40,
      completedChapters: 35 + Math.floor(Math.random() * 5),
      totalPages: 600 + Math.floor(Math.random() * 200),
      totalWords: 65000 + Math.floor(Math.random() * 25000),
      targetWords: 80000,
      estimatedReadingTime: 240 + Math.floor(Math.random() * 60),
      status: ['completed', 'in_progress', 'draft'][Math.floor(Math.random() * 3)] as any,
      startDate: new Date(2024, bookNum - 1, 1).toISOString(),
      targetCompletionDate: new Date(2024, bookNum + 2, 1).toISOString(),
      lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      colorTheme: {
        name: ['Orange', 'Blue', 'Green', 'Purple', 'Red', 'Amber', 'Cyan', 'Pink', 'Indigo'][bookNum - 1] || 'Blue',
        hex: ['#FF6B35', '#4F46E5', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#06B6D4', '#EC4899', '#6366F1'][bookNum - 1] || '#4F46E5',
        rgb: [255, 107, 53]
      },
      themes: ['virtue', 'temporal mechanics', 'character transformation', 'ancient wisdom'],
      genres: ['fantasy', 'historical fiction', 'philosophical fiction', 'adventure'],
      writingGoals: {
        dailyWords: 500 + Math.floor(Math.random() * 500),
        weeklyWords: 3500 + Math.floor(Math.random() * 1500),
        monthlyChapters: 4 + Math.floor(Math.random() * 3)
      },
      progressMetrics: {
        plotDevelopment: 75 + Math.floor(Math.random() * 25),
        characterDevelopment: 80 + Math.floor(Math.random() * 20),
        worldBuilding: 85 + Math.floor(Math.random() * 15),
        thematicDepth: 70 + Math.floor(Math.random() * 30),
        editingComplete: 60 + Math.floor(Math.random() * 40)
      },
      qualityMetrics: {
        averageChapterLength: 1800 + Math.floor(Math.random() * 400),
        consistencyScore: 75 + Math.floor(Math.random() * 25),
        pacing: ['fast', 'moderate', 'slow'][Math.floor(Math.random() * 3)] as any,
        complexity: ['moderate', 'complex'][Math.floor(Math.random() * 2)] as any,
        readabilityScore: 70 + Math.floor(Math.random() * 30)
      },
      writingHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        wordsWritten: Math.floor(Math.random() * 1000),
        hoursSpent: 1 + Math.floor(Math.random() * 4),
        chaptersWorkedOn: [Math.floor(Math.random() * 40) + 1],
        mood: ['excellent', 'good', 'okay', 'difficult'][Math.floor(Math.random() * 4)] as any,
        notes: Math.random() > 0.7 ? 'Great progress on character development today' : undefined
      })),
      chapters: Array.from({ length: 40 }, (_, i) => ({
        id: `chapter-${i + 1}`,
        number: i + 1,
        title: `Chapter ${i + 1}: The Journey Continues`,
        words: 1500 + Math.floor(Math.random() * 800),
        pages: 12 + Math.floor(Math.random() * 6),
        status: i < 35 ? 'completed' : ['in_progress', 'draft', 'not_started'][Math.floor(Math.random() * 3)] as any,
        lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        completionPercentage: i < 35 ? 100 : Math.floor(Math.random() * 100)
      }))
    };
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'not_started':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'okay':
        return 'bg-yellow-500';
      case 'difficult':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading book details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <DashboardSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Book not found</p>
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
          { label: `Book ${book.bookNumber}`, current: true }
        ]} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: book.colorTheme.hex }}
                >
                  {book.bookNumber}
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100">
                    {book.title}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(book.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                        {book.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Updated {formatDate(book.lastUpdated)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link
                  href={`/books/${book.id}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>View Book</span>
                </Link>
                <Link
                  href={`/dashboard/books/${book.id}/settings`}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  <CogIcon className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-4xl">
              {book.description}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'overview', label: 'Overview', icon: ChartBarIcon },
                { key: 'chapters', label: 'Chapters', icon: DocumentTextIcon },
                { key: 'analytics', label: 'Analytics', icon: ArrowTrendingUpIcon },
                { key: 'goals', label: 'Goals', icon: TrophyIcon }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === key
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                  <DocumentTextIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {book.completedChapters}/{book.totalChapters}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Chapters</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                  <SparklesIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {book.totalWords.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                  <PencilSquareIcon className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {book.totalPages}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pages</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                  <ClockIcon className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {formatTime(book.estimatedReadingTime)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Read Time</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                  <FireIcon className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {streaks?.current || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                  <AcademicCapIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {book.qualityMetrics.consistencyScore}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Quality</div>
                </div>
              </div>

              {/* Progress and Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progress Metrics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Development Progress
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(book.progressMetrics).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${value}%`,
                              backgroundColor: book.colorTheme.hex
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Writing History Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Writing History (Last 30 Days)
                  </h3>
                  <SimpleChart
                    type="line"
                    data={book.writingHistory.slice(0, 30).reverse().map((entry, index) => ({
                      label: `Day ${index + 1}`,
                      value: entry.wordsWritten,
                      color: book.colorTheme.hex
                    }))}
                    height={200}
                  />
                </div>
              </div>

              {/* Recent Writing Sessions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Recent Writing Sessions
                </h3>
                <div className="space-y-3">
                  {book.writingHistory.slice(0, 10).map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className={`w-3 h-3 rounded-full ${getMoodColor(session.mood)}`}
                          title={`Mood: ${session.mood}`}
                        ></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {session.wordsWritten} words in {session.hoursSpent}h
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(session.date)} • Chapters {session.chaptersWorkedOn.join(', ')}
                          </div>
                        </div>
                      </div>
                      {session.notes && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          "{session.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chapters Tab */}
          {activeTab === 'chapters' && (
            <div className="space-y-6">
              <div className="grid gap-4">
                {book.chapters.map((chapter) => (
                  <div key={chapter.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            Chapter {chapter.number}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(chapter.status)}`}>
                            {chapter.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {chapter.title}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {chapter.words.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Words</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {chapter.pages}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Pages</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {chapter.completionPercentage}%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Complete</div>
                        </div>
                        <Link
                          href={`/chapters/${chapter.id}`}
                          className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                        >
                          <span className="text-sm font-medium">Edit</span>
                          <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${chapter.completionPercentage}%`,
                            backgroundColor: book.colorTheme.hex
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Quality Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Quality Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Average Chapter Length</span>
                      <span className="font-medium">{book.qualityMetrics.averageChapterLength} words</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Consistency Score</span>
                      <span className="font-medium">{book.qualityMetrics.consistencyScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Pacing</span>
                      <span className="font-medium capitalize">{book.qualityMetrics.pacing}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Complexity</span>
                      <span className="font-medium capitalize">{book.qualityMetrics.complexity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Readability Score</span>
                      <span className="font-medium">{book.qualityMetrics.readabilityScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Writing Streaks
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                        {streaks?.current || 0}
                      </div>
                      <div className="text-sm text-red-600 dark:text-red-400">Current Streak</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                        {streaks?.longest || 0}
                      </div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">Longest Streak</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {streaks?.thisMonth || 0}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">This Month</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Word Progress Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Word Count Progress
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Progress to Target
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {book.totalWords.toLocaleString()} / {book.targetWords.toLocaleString()} words
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((book.totalWords / book.targetWords) * 100, 100)}%`,
                        backgroundColor: book.colorTheme.hex
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>0</span>
                    <span>{Math.round((book.totalWords / book.targetWords) * 100)}%</span>
                    <span>{book.targetWords.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                  <CalendarDaysIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {book.writingGoals.dailyWords}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Daily Word Goal</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                  <ClockIcon className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {book.writingGoals.weeklyWords}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Weekly Word Goal</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                  <DocumentTextIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {book.writingGoals.monthlyChapters}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Chapter Goal</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Start Date</span>
                    <span className="font-medium">{formatDate(book.startDate)}</span>
                  </div>
                  {book.targetCompletionDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Target Completion</span>
                      <span className="font-medium">{formatDate(book.targetCompletionDate)}</span>
                    </div>
                  )}
                  {book.actualCompletionDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Actual Completion</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {formatDate(book.actualCompletionDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Themes and Genres */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Themes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {book.themes.map((theme, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {book.genres.map((genre, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}