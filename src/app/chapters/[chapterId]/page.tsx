'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, BookOpenIcon, SparklesIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface ColorTheme {
  name: string;
  hex: string;
  rgb: [number, number, number];
}

interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  description: string;
  focus: string;
  epicNovelPages: string;
  epicChapterFocus: string;
  epicNovelChapterFocus: string;
  epicNovelSectionName: string;
  tarotCardLink: string;
  tarotFamily: string;
  tarotCardItem: string;
  colorTheme: ColorTheme;
  iconPath?: string;
}

interface Book {
  id: string;
  title: string;
  bookNumber: number;
  subject: string;
  focus: string;
  tagline: string;
  triumph: string;
}

interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  focus: string;
  description: string;
  tarotSymbolism: string;
  heroJourneyStage: string;
  pages: string;
  primaryTarotCard: string;
  secondaryTarotCards: any;
  tarotNarrativeRole: string;
  historicalDate: string;
  storyTimelineDate: string;
}

interface TaskGroup {
  id: string;
  type: string;
  title: string;
  description: string;
  tagline: string;
  focusArea: string;
  learningObjectives: any;
}

interface ChapterData {
  chapter: Chapter;
  book: Book;
  scenes: Scene[];
  taskGroups: {
    major: TaskGroup[];
    specific: TaskGroup[];
    all: TaskGroup[];
  };
  stats: {
    sceneCount: number;
    taskGroupCount: number;
    majorTaskGroupCount: number;
    specificTaskGroupCount: number;
  };
}

// Helper function to determine text color based on background luminance
const getTextColor = (bgColor: string): 'text-white' | 'text-black' => {
  if (!bgColor) return 'text-black';
  const color = bgColor.startsWith('#') ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'text-black' : 'text-white';
};

// Helper function to get chapter icon path
const getChapterIconPath = (chapter: Chapter, bookNumber: number): string => {
  if (chapter.iconPath) {
    return `/icons/${chapter.iconPath}`;
  }
  return `/icons/chapters/book${bookNumber}/chapter${chapter.chapterNumber}.png`;
};

// Helper function to handle icon loading errors
const handleIconError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement;
  target.src = '/icons/fallback/default-chapter.svg';
};

export default function ChapterDetailPage() {
  const params = useParams();
  const chapterId = params.chapterId as string;
  const [data, setData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'scenes' | 'tasks'>('overview');

  useEffect(() => {
    if (!chapterId) return;
    async function fetchChapterData() {
      try {
        const response = await fetch(`/api/chapters/${chapterId}`);
        if (response.ok) {
          const chapterData = await response.json();
          setData(chapterData);
        }
      } catch (error) {
        console.error('Failed to fetch chapter data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchChapterData();
  }, [chapterId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chapter details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Chapter Not Found</h1>
          <Link href="/books" className="text-blue-600 hover:underline">
            Return to Books
          </Link>
        </div>
      </div>
    );
  }

  const { chapter, book, scenes, taskGroups, stats } = data;
  const iconPath = getChapterIconPath(chapter, book.bookNumber);
  const textColor = getTextColor(chapter.colorTheme?.hex);
  const isDarkTheme = textColor === 'text-white';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header with Chapter Icon */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${chapter.colorTheme?.hex || '#ffffff'} 0%, ${chapter.colorTheme?.hex || '#ffffff'}99 100%)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30"></div>
        
        {/* Navigation */}
        <div className="relative z-10 container mx-auto px-6 py-4">
          <Link 
            href={`/books/${book.id}`}
            className={`inline-flex items-center space-x-2 ${textColor} hover:opacity-80 transition-opacity`}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to {book.title}</span>
          </Link>
        </div>

        {/* Main Header Content */}
        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* Chapter Icon - Prominent Display */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 lg:w-64 lg:h-64 relative">
                <div className={`absolute inset-0 rounded-3xl ${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md border-2 ${isDarkTheme ? 'border-white/30' : 'border-black/20'} shadow-2xl`}>
                  <img
                    src={iconPath}
                    alt={`Chapter ${chapter.chapterNumber} icon`}
                    className="w-full h-full object-contain p-6 drop-shadow-2xl"
                    onError={handleIconError}
                  />
                </div>
                <div className={`absolute -bottom-4 -right-4 ${textColor} font-black text-6xl lg:text-8xl ${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md rounded-2xl px-4 py-2 border-2 ${isDarkTheme ? 'border-white/30' : 'border-black/20'} shadow-xl`}>
                  {chapter.chapterNumber}
                </div>
              </div>
            </div>

            {/* Chapter Information */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className={`text-4xl lg:text-6xl font-black ${textColor} mb-4 leading-tight`} style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                  {chapter.title}
                </h1>
                <div className={`${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md rounded-xl p-4 border-2 ${isDarkTheme ? 'border-white/30' : 'border-black/20'}`}>
                  <p className={`text-lg ${textColor} leading-relaxed`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                    {chapter.description}
                  </p>
                </div>
              </div>

              {/* Chapter Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md rounded-xl p-4 border-2 ${isDarkTheme ? 'border-white/30' : 'border-black/20'} text-center`}>
                  <BookOpenIcon className={`w-8 h-8 ${textColor} mx-auto mb-2`} />
                  <div className={`text-2xl font-bold ${textColor}`}>{stats.sceneCount}</div>
                  <div className={`text-sm ${textColor} opacity-80`}>Scenes</div>
                </div>
                <div className={`${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md rounded-xl p-4 border-2 ${isDarkTheme ? 'border-white/30' : 'border-black/20'} text-center`}>
                  <AcademicCapIcon className={`w-8 h-8 ${textColor} mx-auto mb-2`} />
                  <div className={`text-2xl font-bold ${textColor}`}>{stats.taskGroupCount}</div>
                  <div className={`text-sm ${textColor} opacity-80`}>Task Groups</div>
                </div>
                <div className={`${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md rounded-xl p-4 border-2 ${isDarkTheme ? 'border-white/30' : 'border-black/20'} text-center`}>
                  <SparklesIcon className={`w-8 h-8 ${textColor} mx-auto mb-2`} />
                  <div className={`text-xl font-bold ${textColor}`}>{chapter.tarotFamily}</div>
                  <div className={`text-sm ${textColor} opacity-80`}>Tarot Family</div>
                </div>
                <div className={`${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md rounded-xl p-4 border-2 ${isDarkTheme ? 'border-white/30' : 'border-black/20'} text-center`}>
                  <ClockIcon className={`w-8 h-8 ${textColor} mx-auto mb-2`} />
                  <div className={`text-xl font-bold ${textColor}`}>{chapter.epicNovelPages}</div>
                  <div className={`text-sm ${textColor} opacity-80`}>Novel Pages</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex space-x-1 mb-8 bg-white rounded-xl p-1 shadow-lg w-fit mx-auto">
          {[
            { key: 'overview', label: 'Overview', icon: BookOpenIcon },
            { key: 'scenes', label: `Scenes (${stats.sceneCount})`, icon: SparklesIcon },
            { key: 'tasks', label: `Task Groups (${stats.taskGroupCount})`, icon: AcademicCapIcon },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Tarot Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <SparklesIcon className="w-8 h-8 mr-3 text-purple-600" />
                  Tarot & Symbolism
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Tarot Family</h3>
                      <p className="text-lg text-gray-900 bg-purple-50 rounded-lg px-4 py-2">{chapter.tarotFamily}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Tarot Card</h3>
                      <p className="text-lg text-gray-900 bg-purple-50 rounded-lg px-4 py-2">{chapter.tarotCardItem}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Tarot Connection</h3>
                    <p className="text-gray-900 bg-purple-50 rounded-lg px-4 py-3 leading-relaxed">{chapter.tarotCardLink}</p>
                  </div>
                </div>
              </div>

              {/* Epic Novel Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <BookOpenIcon className="w-8 h-8 mr-3 text-blue-600" />
                  Epic Novel Structure
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Section Name</h3>
                      <p className="text-lg text-gray-900 bg-blue-50 rounded-lg px-4 py-2">{chapter.epicNovelSectionName}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Chapter Focus</h3>
                      <p className="text-gray-900 bg-blue-50 rounded-lg px-4 py-3">{chapter.epicChapterFocus}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Novel Chapter Focus</h3>
                      <p className="text-gray-900 bg-blue-50 rounded-lg px-4 py-3">{chapter.epicNovelChapterFocus}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">General Focus</h3>
                      <p className="text-gray-900 bg-blue-50 rounded-lg px-4 py-3">{chapter.focus}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scenes' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Chapter Scenes</h2>
              {scenes.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No scenes have been created for this chapter yet.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {scenes.map((scene) => (
                    <div key={scene.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Scene {scene.sceneNumber}: {scene.title}
                          </h3>
                          <p className="text-gray-600 mb-3">{scene.description}</p>
                        </div>
                        {scene.pages && (
                          <div className="bg-gray-100 rounded-lg px-3 py-1 text-sm font-semibold text-gray-700">
                            {scene.pages} pages
                          </div>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        {scene.focus && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-1">Focus</h4>
                            <p className="text-gray-600 bg-gray-50 rounded px-3 py-2">{scene.focus}</p>
                          </div>
                        )}
                        {scene.heroJourneyStage && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-1">Hero's Journey</h4>
                            <p className="text-gray-600 bg-gray-50 rounded px-3 py-2">{scene.heroJourneyStage}</p>
                          </div>
                        )}
                        {scene.primaryTarotCard && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-1">Primary Tarot Card</h4>
                            <p className="text-gray-600 bg-purple-50 rounded px-3 py-2">{scene.primaryTarotCard}</p>
                          </div>
                        )}
                        {scene.historicalDate && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-1">Historical Date</h4>
                            <p className="text-gray-600 bg-amber-50 rounded px-3 py-2">{scene.historicalDate}</p>
                          </div>
                        )}
                        {scene.tarotNarrativeRole && (
                          <div className="md:col-span-2">
                            <h4 className="font-semibold text-gray-700 mb-1">Tarot Narrative Role</h4>
                            <p className="text-gray-600 bg-gray-50 rounded px-3 py-2">{scene.tarotNarrativeRole}</p>
                          </div>
                        )}
                        {scene.tarotSymbolism && (
                          <div className="md:col-span-3">
                            <h4 className="font-semibold text-gray-700 mb-1">Tarot Symbolism</h4>
                            <p className="text-gray-600 bg-purple-50 rounded px-3 py-2">{scene.tarotSymbolism}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Task Groups</h2>
              
              {taskGroups.major.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Major Task Groups</h3>
                  <div className="grid gap-6">
                    {taskGroups.major.map((taskGroup) => (
                      <div key={taskGroup.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 border-l-4 border-blue-500">
                        <h4 className="text-xl font-bold text-gray-800 mb-3">{taskGroup.title}</h4>
                        {taskGroup.tagline && (
                          <p className="text-blue-700 font-medium mb-3 italic">"{taskGroup.tagline}"</p>
                        )}
                        <p className="text-gray-700 mb-4">{taskGroup.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          {taskGroup.focusArea && (
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-1">Focus Area</h5>
                              <p className="text-gray-600 bg-white/60 rounded px-3 py-2">{taskGroup.focusArea}</p>
                            </div>
                          )}
                          {taskGroup.learningObjectives && (
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-1">Learning Objectives</h5>
                              <div className="bg-white/60 rounded px-3 py-2">
                                {Array.isArray(taskGroup.learningObjectives) ? (
                                  <ul className="text-gray-600 space-y-1">
                                    {taskGroup.learningObjectives.map((objective: string, idx: number) => (
                                      <li key={idx} className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        {objective}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-gray-600">{taskGroup.learningObjectives}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {taskGroups.specific.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Specific Task Groups</h3>
                  <div className="grid gap-6">
                    {taskGroups.specific.map((taskGroup) => (
                      <div key={taskGroup.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
                        <h4 className="text-xl font-bold text-gray-800 mb-3">{taskGroup.title}</h4>
                        {taskGroup.tagline && (
                          <p className="text-green-700 font-medium mb-3 italic">"{taskGroup.tagline}"</p>
                        )}
                        <p className="text-gray-700 mb-4">{taskGroup.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          {taskGroup.focusArea && (
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-1">Focus Area</h5>
                              <p className="text-gray-600 bg-white/60 rounded px-3 py-2">{taskGroup.focusArea}</p>
                            </div>
                          )}
                          {taskGroup.learningObjectives && (
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-1">Learning Objectives</h5>
                              <div className="bg-white/60 rounded px-3 py-2">
                                {Array.isArray(taskGroup.learningObjectives) ? (
                                  <ul className="text-gray-600 space-y-1">
                                    {taskGroup.learningObjectives.map((objective: string, idx: number) => (
                                      <li key={idx} className="flex items-start">
                                        <span className="text-green-500 mr-2">•</span>
                                        {objective}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-gray-600">{taskGroup.learningObjectives}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {taskGroups.all.length === 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No task groups have been created for this chapter yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}