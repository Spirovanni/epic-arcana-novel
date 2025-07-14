'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import WritingGuidanceCard from '@/components/WritingGuidanceCard';
import WritingAssistantSidebar from '@/components/WritingAssistantSidebar';
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  DocumentTextIcon,
  FolderIcon,
  FolderOpenIcon,
  PencilIcon,
  BookOpenIcon,
  SparklesIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface TaskGroup {
  id: string;
  title: string;
  description: string;
  type: string;
  parentTaskGroupId: string | null;
  children?: TaskGroup[];
}

interface Book {
  id: string;
  title: string;
  bookNumber: number;
}

interface WritingGuidance {
  id: string;
  chapterId: string;
  chapterNumber: number;
  title: string;
  chapter?: {
    id: string;
    title: string;
    description: string;
    iconPath: string;
    colorTheme: {
      name: string;
      hex: string;
    };
  };
  writingDetails: {
    povType: string;
    povCharacter: string;
    tense: string;
    whyThisPovAndTense: string;
    summary: string;
    keyPlotDevelopments: string[];
    narrativeFunction: string[];
    toneAndVisualPrompts: string[];
    tipsForWriting: string[];
    fullText: string;
  };
  writingProgress: {
    isStarted: boolean;
    wordCount: number;
    completionRate: number;
    lastUpdated: string;
  };
}

interface WritingStats {
  totalChapters: number;
  chaptersStarted: number;
  totalWords: number;
  estimatedCompletionTime: number;
}

const TaskGroupNode = ({ node, level = 0 }: { node: TaskGroup; level?: number }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  
  const getNodeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'major task group':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800';
      case 'specific task group':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border-gray-200 dark:border-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'major task group':
        return hasChildren ? (isExpanded ? <FolderOpenIcon className="w-5 h-5" /> : <FolderIcon className="w-5 h-5" />) : <DocumentTextIcon className="w-5 h-5" />;
      case 'specific task group':
        return <DocumentTextIcon className="w-5 h-5" />;
      default:
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className={`${level > 0 ? 'ml-6' : ''} mb-4`}>
      <div className={`rounded-xl p-6 border shadow-lg hover:shadow-xl transition-all duration-200 ${getNodeColor(node.type)}`}>
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="text-blue-600 dark:text-blue-400">
              {getTypeIcon(node.type)}
            </div>
            {hasChildren && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-md hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {node.title}
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                node.type.toLowerCase() === 'major task group' 
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' 
                  : 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
              }`}>
                {node.type}
              </span>
            </div>
            
            {node.description && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {node.description}
              </p>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-6 space-y-4">
            {node.children.map((child) => (
              <TaskGroupNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function OutlinePage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  const [outline, setOutline] = useState<TaskGroup[]>([]);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'outline' | 'writing'>('outline');
  const [writingGuidance, setWritingGuidance] = useState<WritingGuidance[]>([]);
  const [writingStats, setWritingStats] = useState<WritingStats | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [showWritingAssistant, setShowWritingAssistant] = useState(false);
  const [currentChapter] = useState<WritingGuidance | null>(null);

  useEffect(() => {
    if (!bookId) return;

    async function fetchData() {
      try {
        // Fetch all data in parallel
        const [outlineResponse, bookResponse, writingGuidanceResponse] = await Promise.all([
          fetch(`/api/outline/${bookId}`),
          fetch(`/api/books/${bookId}`),
          fetch(`/api/books/${bookId}/writing-guidance`)
        ]);

        if (outlineResponse.ok) {
          const taskGroups: TaskGroup[] = await outlineResponse.json();
          
          const taskGroupMap = new Map(taskGroups.map(tg => [tg.id, { ...tg, children: [] }]));
          const hierarchy: TaskGroup[] = [];

          for(const tg of taskGroups) {
              if(tg.parentTaskGroupId && taskGroupMap.has(tg.parentTaskGroupId)) {
                  const parent = taskGroupMap.get(tg.parentTaskGroupId);
                  parent.children.push(taskGroupMap.get(tg.id));
              } else if (!tg.parentTaskGroupId) {
                  hierarchy.push(taskGroupMap.get(tg.id));
              }
          }
          
          setOutline(hierarchy);
        }

        if (bookResponse.ok) {
          const bookData = await bookResponse.json();
          setBook(bookData);
        }

        if (writingGuidanceResponse.ok) {
          const guidanceData = await writingGuidanceResponse.json();
          setWritingGuidance(guidanceData.guidance || []);
          setWritingStats(guidanceData.stats || null);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [bookId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <Breadcrumbs items={[
          { label: 'Books', href: '/books' },
          { label: book?.title || 'Loading...', href: `/books/${bookId}` },
          { label: 'Outline', current: true }
        ]} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading outline...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Breadcrumbs items={[
        { label: 'Books', href: '/books' },
        { label: book?.title || 'Book', href: `/books/${bookId}` },
        { label: 'Story Outline', current: true }
      ]} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-sm font-semibold mb-4">
            {book && `Book ${book.bookNumber}`}
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-4">
            {book?.title} - {viewMode === 'writing' ? 'Writing Guide' : 'Story Outline'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {viewMode === 'writing' 
              ? 'Comprehensive writing guidance for each chapter with AI-powered assistance.'
              : 'Explore the hierarchical structure of task groups that drive the narrative forward.'
            }
          </p>
          
          {/* Mode Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setViewMode('outline')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'outline'
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <ClipboardDocumentListIcon className="w-4 h-4" />
                Story Outline
              </button>
              <button
                onClick={() => setViewMode('writing')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'writing'
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <PencilIcon className="w-4 h-4" />
                Writing Guide
              </button>
            </div>
            
            {viewMode === 'writing' && (
              <button
                onClick={() => setShowWritingAssistant(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
              >
                <SparklesIcon className="w-4 h-4" />
                Writing Assistant
              </button>
            )}
          </div>
          
          <div className="mt-6">
            <Link 
              href={`/books/${bookId}`}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to Chapters
            </Link>
          </div>
        </div>

        {/* Stats */}
        {outline.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {outline.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Root Task Groups</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {outline.reduce((acc, node) => acc + (node.children?.length || 0), 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Sub Task Groups</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {outline.reduce((acc, node) => acc + 1 + (node.children?.length || 0), 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Elements</div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {viewMode === 'outline' ? (
            /* Outline Content */
            outline.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Outline Available</h3>
                <p className="text-gray-500 dark:text-gray-500">This book doesn&apos;t have any task groups defined yet.</p>
              </div>
            ) : (
              outline.map((node) => (
                <TaskGroupNode key={node.id} node={node} />
              ))
            )
          ) : (
            /* Writing Guide Content */
            <div className="space-y-6">
              {/* Writing Stats */}
              {writingStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {writingStats.totalChapters}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Total Chapters</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {writingStats.chaptersStarted}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Started</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {writingStats.totalWords.toLocaleString()}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Words Written</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                      {writingStats.estimatedCompletionTime}h
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Est. Time</div>
                  </div>
                </div>
              )}

              {/* Writing Guidance Cards */}
              {writingGuidance.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpenIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Writing Guidance Available</h3>
                  <p className="text-gray-500 dark:text-gray-500">Writing guidance hasn&apos;t been imported for this book yet.</p>
                </div>
              ) : (
                writingGuidance.map((guidance) => (
                  <WritingGuidanceCard
                    key={guidance.id}
                    guidance={guidance}
                    isExpanded={expandedChapters.has(guidance.id)}
                    onToggleExpanded={() => {
                      const newExpanded = new Set(expandedChapters);
                      if (newExpanded.has(guidance.id)) {
                        newExpanded.delete(guidance.id);
                      } else {
                        newExpanded.add(guidance.id);
                      }
                      setExpandedChapters(newExpanded);
                    }}
                    onStartWriting={(chapterId) => {
                      router.push(`/chapters/${chapterId}`);
                    }}
                    onViewChapter={(chapterId) => {
                      router.push(`/chapters/${chapterId}`);
                    }}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Writing Assistant Sidebar */}
      <WritingAssistantSidebar
        isOpen={showWritingAssistant}
        onClose={() => setShowWritingAssistant(false)}
        currentChapter={currentChapter ? {
          id: currentChapter.chapterId,
          number: currentChapter.chapterNumber,
          title: currentChapter.title,
          guidance: currentChapter.writingDetails
        } : undefined}
        onStartSession={(chapterId) => {
          router.push(`/chapters/${chapterId}`);
        }}
      />
    </div>
  );
}