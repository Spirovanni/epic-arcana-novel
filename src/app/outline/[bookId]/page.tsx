'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  DocumentTextIcon,
  FolderIcon,
  FolderOpenIcon,
  PencilIcon,
  BookOpenIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  MapPinIcon,
  EyeIcon,
  UserIcon,
  HeartIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  BeakerIcon,
  FireIcon,
  TrophyIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  description: string;
  setup: string;
  beatGoal: string;
  tarotSymbolism: string;
  timeline_date: string;
  timeline_variant: string;
  location: string;
  pov: string;
  core_emotion: string;
  scene_tone: string;
}

interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  description: string;
  summary: string;
  plot: string;
  heroJourneyBeat: string;
  saveTheCatBeat: string;
  focus: string;
  focusArea: string;
  colorTheme: {
    name: string;
    hex: string;
    rgb: { red: number; green: number; blue: number };
  };
  tarotFamily: string;
  tarotCardLink: string;
  scenes: Scene[];
}

interface Book {
  id: string;
  title: string;
  bookNumber: number;
  theme: {
    color: string;
    name: string;
    description: string;
  };
}

interface Stats {
  totalChapters: number;
  completedChapters: number;
  totalScenes: number;
  completedScenes: number;
  completionPercentage: number;
}

interface OutlineData {
  book: Book;
  chapters: Chapter[];
  stats: Stats;
}

const ChapterCard = ({ chapter, isExpanded, onToggleExpanded }: { 
  chapter: Chapter; 
  isExpanded: boolean; 
  onToggleExpanded: () => void;
}) => {
  const [showScenes, setShowScenes] = useState(false);
  
  const getChapterIcon = (chapterNumber: number) => {
    if (chapterNumber <= 10) return <RocketLaunchIcon className="w-5 h-5" />;
    if (chapterNumber <= 20) return <BeakerIcon className="w-5 h-5" />;
    if (chapterNumber <= 30) return <FireIcon className="w-5 h-5" />;
    if (chapterNumber <= 39) return <StarIcon className="w-5 h-5" />;
    return <TrophyIcon className="w-5 h-5" />;
  };

  const getStoryPhase = (chapterNumber: number) => {
    if (chapterNumber <= 10) return { name: "Beginning", color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200" };
    if (chapterNumber <= 20) return { name: "Rising Action", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200" };
    if (chapterNumber <= 30) return { name: "Midpoint", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200" };
    if (chapterNumber === 37) return { name: "Climax", color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200" };
    if (chapterNumber === 38) return { name: "Falling Action", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200" };
    if (chapterNumber === 39) return { name: "Resolution", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200" };
    if (chapterNumber === 40) return { name: "Grand Finale", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200" };
    return { name: "Development", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200" };
  };

  const phase = getStoryPhase(chapter.chapterNumber);
  const isComplete = chapter.title && chapter.summary && chapter.scenes.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Chapter Header */}
      <div 
        className="p-6 cursor-pointer"
        onClick={onToggleExpanded}
        style={{ 
          background: `linear-gradient(135deg, ${chapter.colorTheme.hex}15 0%, ${chapter.colorTheme.hex}25 100%)`,
          borderBottom: `2px solid ${chapter.colorTheme.hex}30`
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg text-white shadow-lg"
                style={{ backgroundColor: chapter.colorTheme.hex }}
              >
                {getChapterIcon(chapter.chapterNumber)}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Chapter {chapter.chapterNumber}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${phase.color}`}>
                    {phase.name}
                  </span>
                  {isComplete && (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                {chapter.title || `Chapter ${chapter.chapterNumber}`}
              </h3>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <SparklesIcon className="w-4 h-4" />
                  <span>{chapter.focus || chapter.focusArea || 'Theme TBD'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>{chapter.scenes.length} scenes</span>
                </div>
                {chapter.tarotFamily && (
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4" />
                    <span>{chapter.tarotFamily}</span>
                  </div>
                )}
              </div>
              
              {chapter.heroJourneyBeat && (
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Hero's Journey:</strong> {chapter.heroJourneyBeat.split(' - ')[0]}
                </div>
              )}
              
              {chapter.summary && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">
                  {chapter.summary}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowScenes(!showScenes);
              }}
              className="p-2 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors"
              title="Toggle scenes"
            >
              <DocumentTextIcon className="w-4 h-4" />
            </button>
            <Link 
              href={`/chapters/${chapter.id}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors"
              title="View chapter"
            >
              <EyeIcon className="w-4 h-4" />
            </Link>
            <div className="p-1">
              {isExpanded ? (
                <ChevronDownIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Chapter Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chapter.plot && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Plot</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {chapter.plot}
                </p>
              </div>
            )}
            
            {chapter.heroJourneyBeat && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Hero's Journey</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {chapter.heroJourneyBeat}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link 
              href={`/chapters/${chapter.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <BookOpenIcon className="w-4 h-4" />
              View Chapter
            </Link>
            {chapter.tarotCardLink && (
              <a 
                href={chapter.tarotCardLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                <StarIcon className="w-4 h-4" />
                Tarot Card
              </a>
            )}
          </div>
        </div>
      )}

      {/* Scenes */}
      {showScenes && chapter.scenes.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-4 h-4" />
              Scenes ({chapter.scenes.length})
            </h4>
            <div className="space-y-3">
              {chapter.scenes.map((scene) => (
                <div 
                  key={scene.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">
                      Scene {scene.sceneNumber}: {scene.title || 'Untitled Scene'}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {scene.timeline_date && (
                        <div className="flex items-center gap-1">
                          <CalendarDaysIcon className="w-3 h-3" />
                          {scene.timeline_date}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {scene.location && (
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <MapPinIcon className="w-3 h-3" />
                        <span>{scene.location}</span>
                      </div>
                    )}
                    {scene.pov && (
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <UserIcon className="w-3 h-3" />
                        <span>{scene.pov}</span>
                      </div>
                    )}
                    {scene.core_emotion && (
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <HeartIcon className="w-3 h-3" />
                        <span>{scene.core_emotion}</span>
                      </div>
                    )}
                  </div>
                  
                  {scene.setup && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-3 leading-relaxed">
                      {scene.setup}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function OutlinePage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  const [outlineData, setOutlineData] = useState<OutlineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  useEffect(() => {
    if (!bookId) return;

    async function fetchData() {
      try {
        const response = await fetch(`/api/books/${bookId}/outline-complete`);
        if (response.ok) {
          const data = await response.json();
          setOutlineData(data);
        }
      } catch (error) {
        console.error('Failed to fetch outline data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [bookId]);

  const toggleChapterExpanded = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const expandAll = () => {
    if (outlineData) {
      setExpandedChapters(new Set(outlineData.chapters.map(c => c.id)));
    }
  };

  const collapseAll = () => {
    setExpandedChapters(new Set());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <Breadcrumbs items={[
          { label: 'Books', href: '/books' },
          { label: 'Loading...', href: `/books/${bookId}` },
          { label: 'Outline', current: true }
        ]} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading epic outline...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!outlineData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Outline Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">We couldn't load the outline for this book.</p>
        </div>
      </div>
    );
  }

  const { book, chapters, stats } = outlineData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Breadcrumbs items={[
        { label: 'Books', href: '/books' },
        { label: book.title, href: `/books/${bookId}` },
        { label: 'Epic Outline', current: true }
      ]} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Epic Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center px-6 py-3 rounded-full text-white font-bold text-lg mb-6 shadow-lg"
            style={{ backgroundColor: book.theme.color }}
          >
            <TrophyIcon className="w-6 h-6 mr-2" />
            Book {book.bookNumber}: {book.theme.name}
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent mb-4">
            {book.title}
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-6 font-medium">
            {book.theme.description}
          </p>
          <div className="text-lg text-gray-500 dark:text-gray-500">
            Francisco's Epic Journey from Law Student to Master of Two Worlds
          </div>
          
          <div className="mt-8">
            <Link 
              href={`/books/${bookId}`}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <RocketLaunchIcon className="w-6 h-6 mr-3" />
              Explore Chapters
            </Link>
          </div>
        </div>

        {/* Epic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl shadow-lg p-6 text-center border-2 border-green-200 dark:border-green-800">
            <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2">
              {stats.totalChapters}
            </div>
            <div className="text-green-800 dark:text-green-200 font-semibold">Total Chapters</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-lg p-6 text-center border-2 border-blue-200 dark:border-blue-800">
            <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">
              {stats.completedChapters}
            </div>
            <div className="text-blue-800 dark:text-blue-200 font-semibold">Completed</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-xl shadow-lg p-6 text-center border-2 border-purple-200 dark:border-purple-800">
            <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">
              {stats.totalScenes}
            </div>
            <div className="text-purple-800 dark:text-purple-200 font-semibold">Total Scenes</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl shadow-lg p-6 text-center border-2 border-orange-200 dark:border-orange-800">
            <div className="text-4xl font-black text-orange-600 dark:text-orange-400 mb-2">
              {stats.completedScenes}
            </div>
            <div className="text-orange-800 dark:text-orange-200 font-semibold">Epic Scenes</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-xl shadow-lg p-6 text-center border-2 border-yellow-200 dark:border-yellow-800">
            <div className="text-4xl font-black text-yellow-600 dark:text-yellow-400 mb-2">
              {stats.completionPercentage}%
            </div>
            <div className="text-yellow-800 dark:text-yellow-200 font-semibold">Complete</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Chapter Journey
            </h2>
            <span className="text-gray-500 dark:text-gray-400">
              • {chapters.length} chapters of epic adventure
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={expandAll}
              className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/70 transition-colors text-sm font-medium"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Story Progress</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{stats.completionPercentage}% complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${stats.completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-6">
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              isExpanded={expandedChapters.has(chapter.id)}
              onToggleExpanded={() => toggleChapterExpanded(chapter.id)}
            />
          ))}
        </div>

        {/* Epic Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-lg">
            <SparklesIcon className="w-6 h-6 mr-2" />
            Epic Arcana: The Master's Journey Complete!
            <SparklesIcon className="w-6 h-6 ml-2" />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            From ambitious law student to Master of Two Worlds in {chapters.length} epic chapters
          </p>
        </div>
      </div>
    </div>
  );
}