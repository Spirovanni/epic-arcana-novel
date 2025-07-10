'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
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
  CheckCircleIcon,
  TrophyIcon,
  FireIcon,
  EyeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface ChapterAnalytics {
  overview: {
    id: string;
    title: string;
    chapterNumber: number;
    bookTitle: string;
    bookId: string;
    description: string;
    totalPages: number;
    totalWords: number;
    averageWordsPerPage: number;
    lastUpdated: string;
    createdAt: string;
    completionRate: number;
  };
  
  progress: {
    pagesCompleted: number;
    pagesTotal: number;
    wordsWritten: number;
    wordsTarget: number;
    scenesCompleted: number;
    scenesTotal: number;
    taskGroupsCompleted: number;
    taskGroupsTotal: number;
  };
  
  writing: {
    dailyWordCounts: Array<{
      date: string;
      words: number;
      pages: number;
    }>;
    wordCountTrend: 'increasing' | 'decreasing' | 'stable';
    productivityScore: number;
    streakDays: number;
  };
  
  content: {
    pageAnalytics: Array<{
      pageNumber: number;
      wordCount: number;
      lastUpdated: string;
      completionRate: number;
    }>;
    sceneBreakdown: Array<{
      sceneNumber: number;
      title: string;
      focus: string;
      pages: string;
      completionRate: number;
    }>;
    taskGroupBreakdown: Array<{
      type: string;
      title: string;
      description: string;
      completionRate: number;
    }>;
  };
  
  timeline: {
    milestones: Array<{
      date: string;
      event: string;
      description: string;
      type: 'creation' | 'update' | 'completion';
    }>;
  };
}

export default function ChapterAnalyticsPage() {
  const params = useParams();
  const chapterId = params.chapterId as string;
  const [analytics, setAnalytics] = useState<ChapterAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'writing' | 'content' | 'timeline'>('overview');

  useEffect(() => {
    if (!chapterId) return;
    fetchChapterAnalytics();
  }, [chapterId]);

  const fetchChapterAnalytics = async () => {
    try {
      const response = await fetch(`/api/dashboard/chapter/${chapterId}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch chapter analytics:', error);
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />;
      case 'decreasing':
        return <ArrowTrendingUpIcon className="w-5 h-5 text-red-500 transform rotate-180" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-yellow-500"></div>;
    }
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'creation':
        return <SparklesIcon className="w-5 h-5 text-purple-500" />;
      case 'completion':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'update':
        return <PencilSquareIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Chapter Analytics', current: true }
        ]} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Chapter Not Found', current: true }
        ]} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Chapter Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The chapter analytics you're looking for doesn't exist.</p>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { overview, progress, writing, content, timeline } = analytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: overview.bookTitle, href: `/books/${overview.bookId}` },
        { label: `Chapter ${overview.chapterNumber} Analytics`, current: true }
      ]} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-2">
                Chapter {overview.chapterNumber}: {overview.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">{overview.bookTitle}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{overview.description}</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/chapters/${overview.id}`}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
              >
                <PencilSquareIcon className="w-4 h-4" />
                <span>Edit Chapter</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overview.totalPages}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Pages</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <SparklesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overview.totalWords.toLocaleString()}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Words</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <ClockIcon className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{content.sceneBreakdown.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Scenes</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <AcademicCapIcon className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{content.taskGroupBreakdown.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Tasks</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <TrophyIcon className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{overview.completionRate}%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Complete</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg w-fit mx-auto">
          {[
            { key: 'overview', label: 'Overview', icon: EyeIcon },
            { key: 'progress', label: 'Progress', icon: TrophyIcon },
            { key: 'writing', label: 'Writing Stats', icon: PencilSquareIcon },
            { key: 'content', label: 'Content', icon: BookOpenIcon },
            { key: 'timeline', label: 'Timeline', icon: ClockIcon },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === key
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Chapter Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                    <span className="text-gray-900 dark:text-gray-100">{formatDate(overview.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                    <span className="text-gray-900 dark:text-gray-100">{formatDate(overview.lastUpdated)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg Words/Page:</span>
                    <span className="text-gray-900 dark:text-gray-100">{overview.averageWordsPerPage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Completion:</span>
                    <span className="text-gray-900 dark:text-gray-100">{overview.completionRate}%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Writing Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Productivity Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{writing.productivityScore}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">/100</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Writing Streak</span>
                    <div className="flex items-center space-x-2">
                      <FireIcon className="w-5 h-5 text-orange-500" />
                      <span className="text-gray-900 dark:text-gray-100">{writing.streakDays} days</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Word Count Trend</span>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(writing.wordCountTrend)}
                      <span className="text-gray-900 dark:text-gray-100 capitalize">{writing.wordCountTrend}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Content Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Pages</span>
                        <span className="text-gray-900 dark:text-gray-100">{progress.pagesCompleted}/{progress.pagesTotal}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(progress.pagesCompleted / progress.pagesTotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Words</span>
                        <span className="text-gray-900 dark:text-gray-100">{progress.wordsWritten.toLocaleString()}/{progress.wordsTarget.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(progress.wordsWritten / progress.wordsTarget) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Structure Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Scenes</span>
                        <span className="text-gray-900 dark:text-gray-100">{progress.scenesCompleted}/{progress.scenesTotal}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-amber-600 h-2 rounded-full"
                          style={{ width: `${(progress.scenesCompleted / progress.scenesTotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Task Groups</span>
                        <span className="text-gray-900 dark:text-gray-100">{progress.taskGroupsCompleted}/{progress.taskGroupsTotal}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${(progress.taskGroupsCompleted / progress.taskGroupsTotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Writing Stats Tab */}
          {activeTab === 'writing' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Daily Writing Activity</h3>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {writing.dailyWordCounts.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div 
                        className={`h-16 rounded-lg flex items-end justify-center p-1 ${
                          day.words > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <div 
                          className={`w-full rounded ${
                            day.words > 0 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          style={{ height: `${Math.max((day.words / 700) * 100, 8)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
                        {day.words}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Words written per day (last 7 days)
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Page Analytics */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Page Breakdown</h3>
                <div className="grid gap-3">
                  {content.pageAnalytics.map((page) => (
                    <div key={page.pageNumber} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">Page {page.pageNumber}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{page.wordCount} words</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Updated {formatDateTime(page.lastUpdated)}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          page.completionRate === 100 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                        }`}>
                          {page.completionRate}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scene Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Scene Analysis</h3>
                <div className="space-y-4">
                  {content.sceneBreakdown.map((scene) => (
                    <div key={scene.sceneNumber} className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            Scene {scene.sceneNumber}: {scene.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{scene.focus}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Pages {scene.pages}</div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            scene.completionRate === 100 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                          }`}>
                            {scene.completionRate}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Group Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Task Groups</h3>
                <div className="space-y-4">
                  {content.taskGroupBreakdown.map((taskGroup, index) => (
                    <div key={index} className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{taskGroup.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              taskGroup.type === 'Major Task Group'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            }`}>
                              {taskGroup.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{taskGroup.description}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          taskGroup.completionRate === 100 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                        }`}>
                          {taskGroup.completionRate}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Chapter Timeline</h3>
              <div className="space-y-4">
                {timeline.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getMilestoneIcon(milestone.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{milestone.event}</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(milestone.date)}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{milestone.description}</p>
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