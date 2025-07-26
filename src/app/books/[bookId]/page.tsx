'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import ResponsiveText from '@/components/ResponsiveText';

interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  description: string;
  iconPath?: string;
  colorTheme: {
    name: string;
    hex: string;
    rgb: [number, number, number];
  };
}

interface Scene {
  id: string;
  chapterId: string;
  sceneNumber: number;
  title: string;
  description?: string;
  setup?: string;
  beatGoal?: string;
  pov?: string;
  location?: string;
  timeline_date?: string;
  core_emotion?: string;
  scene_tone?: string;
  primaryTarotCard?: string;
  internalConflict?: string;
  sensoryDetail?: string;
  symbolism?: string;
  tarotSymbolism?: string;
  tarotNarrativeRole?: string;
  heroJourneyStage?: string;
  characterGrowthElement?: string;
  temporalPowerManifested?: string;
  timelineSignificance?: string;
  chapter?: {
    title: string;
    chapterNumber: number;
    colorTheme: {
      hex: string;
    };
  };
}

// Enhanced helper functions for sophisticated styling
const getTextColor = (bgColor: string): 'text-white' | 'text-black' => {
    if (!bgColor) return 'text-black';
    const color = bgColor.startsWith('#') ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'text-black' : 'text-white';
};

// Generate sophisticated gradient backgrounds for chapters
const createChapterGradient = (hex: string) => {
  const lighterHex = adjustBrightness(hex, 25);
  const darkerHex = adjustBrightness(hex, -20);
  return `linear-gradient(135deg, ${hex}F0 0%, ${lighterHex}E0 30%, ${hex}D0 70%, ${darkerHex}F0 100%)`;
};

// Adjust color brightness
const adjustBrightness = (hex: string, percent: number) => {
  const color = hex.startsWith('#') ? hex.substring(1, 7) : hex;
  const num = parseInt(color, 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

// Helper function to get chapter icon path with fallback
const getChapterIconPath = (chapter: Chapter, bookNumber: number): string => {
  // If iconPath is explicitly set in database, use it
  if (chapter.iconPath) {
    return `/icons/${chapter.iconPath}`;
  }
  
  // Auto-generate path based on book and chapter numbers
  const defaultPath = `/icons/chapters/book${bookNumber}/chapter${chapter.chapterNumber}.png`;
  return defaultPath;
};

// Helper function to handle icon loading errors
const handleIconError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement;
  target.src = '/icons/fallback/default-chapter.svg';
};

// Six-Act Structure Data
const getSixActStructure = (bookNumber: number) => {
  const actStructures: Record<number, Array<{
    title: string;
    subtitle: string;
    chapters: string;
    startChapter: number;
    endChapter: number;
  }>> = {
    1: [
      { title: "Origins", subtitle: "The Law Student's Hidden Gifts", chapters: "1-7", startChapter: 1, endChapter: 7 },
      { title: "Catalyst", subtitle: "The Tarot Cards Call", chapters: "8-13", startChapter: 8, endChapter: 13 },
      { title: "Trials", subtitle: "Mastering the Ancient Arts", chapters: "14-20", startChapter: 14, endChapter: 20 },
      { title: "Revelation", subtitle: "The Cosmic Purpose Unveiled", chapters: "21-27", startChapter: 21, endChapter: 27 },
      { title: "Confrontation", subtitle: "Battle for Understanding", chapters: "28-35", startChapter: 28, endChapter: 35 },
      { title: "Transformation", subtitle: "Master of Two Worlds", chapters: "36-40", startChapter: 36, endChapter: 40 }
    ],
    2: [
      { title: "Origins", subtitle: "Timeline Walker Emerges", chapters: "1-7", startChapter: 1, endChapter: 7 },
      { title: "Catalyst", subtitle: "The First Temporal Breach", chapters: "8-13", startChapter: 8, endChapter: 13 },
      { title: "Trials", subtitle: "Learning Time's Language", chapters: "14-20", startChapter: 14, endChapter: 20 },
      { title: "Revelation", subtitle: "The Chronicle Conspiracy", chapters: "21-27", startChapter: 21, endChapter: 27 },
      { title: "Confrontation", subtitle: "War Across Time", chapters: "28-35", startChapter: 28, endChapter: 35 },
      { title: "Transformation", subtitle: "Guardian of Moments", chapters: "36-40", startChapter: 36, endChapter: 40 }
    ],
    3: [
      { title: "Origins", subtitle: "The Ancient Enemy Stirs", chapters: "1-7", startChapter: 1, endChapter: 7 },
      { title: "Catalyst", subtitle: "Dagon's First Strike", chapters: "8-13", startChapter: 8, endChapter: 13 },
      { title: "Trials", subtitle: "Forging the Alliance", chapters: "14-20", startChapter: 14, endChapter: 20 },
      { title: "Revelation", subtitle: "The True Nature of Evil", chapters: "21-27", startChapter: 21, endChapter: 27 },
      { title: "Confrontation", subtitle: "The Siege of Reality", chapters: "28-35", startChapter: 28, endChapter: 35 },
      { title: "Transformation", subtitle: "Architect of Defense", chapters: "36-40", startChapter: 36, endChapter: 40 }
    ],
    4: [
      { title: "Origins", subtitle: "When Time Breaks Apart", chapters: "1-7", startChapter: 1, endChapter: 7 },
      { title: "Catalyst", subtitle: "The Fracturing Event", chapters: "8-13", startChapter: 8, endChapter: 13 },
      { title: "Trials", subtitle: "Navigating Broken Worlds", chapters: "14-20", startChapter: 14, endChapter: 20 },
      { title: "Revelation", subtitle: "The Pattern Behind Chaos", chapters: "21-27", startChapter: 21, endChapter: 27 },
      { title: "Confrontation", subtitle: "Mending What Was Broken", chapters: "28-35", startChapter: 28, endChapter: 35 },
      { title: "Transformation", subtitle: "Weaver of Timelines", chapters: "36-40", startChapter: 36, endChapter: 40 }
    ],
    5: [
      { title: "Origins", subtitle: "Multiple Realities Collide", chapters: "1-7", startChapter: 1, endChapter: 7 },
      { title: "Catalyst", subtitle: "The Great Convergence Begins", chapters: "8-13", startChapter: 8, endChapter: 13 },
      { title: "Trials", subtitle: "Uniting Fractured Selves", chapters: "14-20", startChapter: 14, endChapter: 20 },
      { title: "Revelation", subtitle: "The Universal Design", chapters: "21-27", startChapter: 21, endChapter: 27 },
      { title: "Confrontation", subtitle: "The Battle for All Worlds", chapters: "28-35", startChapter: 28, endChapter: 35 },
      { title: "Transformation", subtitle: "Shepherd of Realities", chapters: "36-40", startChapter: 36, endChapter: 40 }
    ],
    6: [
      { title: "Origins", subtitle: "The Final Pieces Move", chapters: "1-7", startChapter: 1, endChapter: 7 },
      { title: "Catalyst", subtitle: "Dagon's Ultimate Scheme", chapters: "8-13", startChapter: 8, endChapter: 13 },
      { title: "Trials", subtitle: "The Hardest Sacrifices", chapters: "14-20", startChapter: 14, endChapter: 20 },
      { title: "Revelation", subtitle: "The True Cost of Victory", chapters: "21-27", startChapter: 21, endChapter: 27 },
      { title: "Confrontation", subtitle: "Everything on the Line", chapters: "28-35", startChapter: 28, endChapter: 35 },
      { title: "Transformation", subtitle: "Master of Sacrifice", chapters: "36-40", startChapter: 36, endChapter: 40 }
    ],
    7: [
      { title: "Origins", subtitle: "After the Great War", chapters: "1-7", startChapter: 1, endChapter: 7 },
      { title: "Catalyst", subtitle: "The Healing Begins", chapters: "8-13", startChapter: 8, endChapter: 13 },
      { title: "Trials", subtitle: "Rebuilding What Was Lost", chapters: "14-20", startChapter: 14, endChapter: 20 },
      { title: "Revelation", subtitle: "The New World Order", chapters: "21-27", startChapter: 21, endChapter: 27 },
      { title: "Confrontation", subtitle: "Resistance to Change", chapters: "28-35", startChapter: 28, endChapter: 35 },
      { title: "Transformation", subtitle: "Architect of Renewal", chapters: "36-40", startChapter: 36, endChapter: 40 }
    ],
    8: [
      { title: "Origins", subtitle: "Beyond All Limitations", chapters: "1-7", startChapter: 1, endChapter: 7 },
      { title: "Catalyst", subtitle: "The Infinite Path Opens", chapters: "8-13", startChapter: 8, endChapter: 13 },
      { title: "Trials", subtitle: "Transcending Human Bounds", chapters: "14-20", startChapter: 14, endChapter: 20 },
      { title: "Revelation", subtitle: "The Cosmic Truth", chapters: "21-27", startChapter: 21, endChapter: 27 },
      { title: "Confrontation", subtitle: "The Ultimate Choice", chapters: "28-35", startChapter: 28, endChapter: 35 },
      { title: "Transformation", subtitle: "Champion of Infinite", chapters: "36-40", startChapter: 36, endChapter: 40 }
    ],
    9: [
      { title: "Origins", subtitle: "The Final Beginning", chapters: "1-7", startChapter: 1, endChapter: 7 },
      { title: "Catalyst", subtitle: "Universal Awakening", chapters: "8-13", startChapter: 8, endChapter: 13 },
      { title: "Trials", subtitle: "The Last Great Test", chapters: "14-20", startChapter: 14, endChapter: 20 },
      { title: "Revelation", subtitle: "The Purpose of Everything", chapters: "21-27", startChapter: 21, endChapter: 27 },
      { title: "Confrontation", subtitle: "The Ultimate Triumph", chapters: "28-35", startChapter: 28, endChapter: 35 },
      { title: "Transformation", subtitle: "Herald of New Dawn", chapters: "36-40", startChapter: 36, endChapter: 40 }
    ]
  };
  
  return actStructures[bookNumber] || actStructures[1];
};

// Format scene data for Sudowrite as one continuous paragraph
const formatSceneForSudowrite = (scene: Scene): string => {
  const elements = [];
  
  // Scene Header
  elements.push(`SCENE: ${scene.title}`);
  elements.push(`Chapter: ${scene.chapter?.title} (Ch${scene.chapter?.chapterNumber})`);
  elements.push(`Scene Number: ${scene.sceneNumber}`);
  
  // Core Scene Information
  if (scene.description) {
    elements.push(`DESCRIPTION: ${scene.description}`);
  }
  
  if (scene.setup) {
    elements.push(`SETUP: ${scene.setup}`);
  }
  
  if (scene.beatGoal) {
    elements.push(`SCENE GOAL/BEAT: ${scene.beatGoal}`);
  }
  
  // Character & Narrative Context
  if (scene.pov) {
    elements.push(`POINT OF VIEW: ${scene.pov}`);
  }
  
  if (scene.core_emotion) {
    elements.push(`CORE EMOTION: ${scene.core_emotion}`);
  }
  
  if (scene.scene_tone) {
    elements.push(`SCENE TONE: ${scene.scene_tone}`);
  }
  
  if (scene.location) {
    elements.push(`LOCATION: ${scene.location}`);
  }
  
  if (scene.timeline_date) {
    elements.push(`TIMELINE: ${scene.timeline_date}`);
  }
  
  // Advanced Context
  if (scene.internalConflict) {
    elements.push(`INTERNAL CONFLICT: ${scene.internalConflict}`);
  }
  
  if (scene.sensoryDetail) {
    elements.push(`SENSORY DETAILS: ${scene.sensoryDetail}`);
  }
  
  if (scene.symbolism) {
    elements.push(`SYMBOLISM: ${scene.symbolism}`);
  }
  
  // Tarot Integration
  if (scene.primaryTarotCard) {
    elements.push(`TAROT CARD: ${scene.primaryTarotCard}`);
    
    if (scene.tarotSymbolism) {
      elements.push(`TAROT SYMBOLISM: ${scene.tarotSymbolism}`);
    }
    
    if (scene.tarotNarrativeRole) {
      elements.push(`TAROT NARRATIVE ROLE: ${scene.tarotNarrativeRole}`);
    }
  }
  
  // Character Development
  if (scene.heroJourneyStage) {
    elements.push(`HERO'S JOURNEY STAGE: ${scene.heroJourneyStage}`);
  }
  
  if (scene.characterGrowthElement) {
    elements.push(`CHARACTER GROWTH: ${scene.characterGrowthElement}`);
  }
  
  // Temporal Powers & Timeline
  if (scene.temporalPowerManifested) {
    elements.push(`TEMPORAL POWER: ${scene.temporalPowerManifested}`);
  }
  
  if (scene.timelineSignificance) {
    elements.push(`TIMELINE SIGNIFICANCE: ${scene.timelineSignificance}`);
  }
  
  // Join all elements with " | " to create one continuous paragraph
  return elements.join(' | ');
};

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [bookNumber, setBookNumber] = useState<number>(1);
  const [bookTitle, setBookTitle] = useState<string>('');
  const [bookPrimaryColor, setBookPrimaryColor] = useState<string>('#6366f1');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chapters' | 'scenes'>('chapters');
  const [copiedSceneId, setCopiedSceneId] = useState<string | null>(null);

  // Copy scene data to clipboard
  const handleCopyScene = async (scene: Scene) => {
    try {
      const formattedText = formatSceneForSudowrite(scene);
      await navigator.clipboard.writeText(formattedText);
      setCopiedSceneId(scene.id);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedSceneId(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy scene data:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = formatSceneForSudowrite(scene);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopiedSceneId(scene.id);
      setTimeout(() => {
        setCopiedSceneId(null);
      }, 2000);
    }
  };

  useEffect(() => {
    if (!bookId) return;
    async function fetchBookData() {
      try {
        const [chaptersResponse, outlineResponse] = await Promise.all([
          fetch(`/api/books/${bookId}/chapters`),
          fetch(`/api/books/${bookId}/outline-complete`)
        ]);
        
        if (chaptersResponse.ok) {
          const chaptersData = await chaptersResponse.json();
          setChapters(chaptersData.chapters);
          setBookNumber(chaptersData.book.bookNumber);
          setBookTitle(chaptersData.book.title);
          setBookPrimaryColor(chaptersData.book.primaryColor || '#FFA500');
        }
        
        if (outlineResponse.ok) {
          const outlineData = await outlineResponse.json();
          const allScenes: Scene[] = [];
          outlineData.chapters.forEach((chapter: Chapter & { scenes?: Scene[] }) => {
            if (chapter.scenes) {
              chapter.scenes.forEach((scene: Scene) => {
                allScenes.push({
                  ...scene,
                  chapter: {
                    title: chapter.title,
                    chapterNumber: chapter.chapterNumber,
                    colorTheme: chapter.colorTheme
                  }
                });
              });
            }
          });
          setScenes(allScenes);
        }
      } catch (error) {
        console.error('Failed to fetch book data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookData();
  }, [bookId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <Breadcrumbs items={[
          { label: 'Books', href: '/books' },
          { label: bookTitle || 'Loading...', current: true }
        ]} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: bookPrimaryColor }}></div>
            <p className="text-gray-600 dark:text-gray-400">Loading chapters...</p>
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
        { label: bookTitle, current: true }
      ]} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center px-6 py-3 rounded-full backdrop-blur-md border text-sm font-bold mb-6 shadow-lg"
            style={{
              background: `linear-gradient(to right, ${bookPrimaryColor}33, ${bookPrimaryColor}40)`,
              borderColor: `${bookPrimaryColor}50`,
              color: getTextColor(bookPrimaryColor) === 'text-white' ? '#ffffff' : bookPrimaryColor
            }}
          >
            <span 
              className="w-2 h-2 rounded-full mr-3 animate-pulse"
              style={{ backgroundColor: bookPrimaryColor }}
            ></span>
            BOOK {bookNumber}
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            <span 
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(to right, ${bookPrimaryColor}, ${adjustBrightness(bookPrimaryColor, 20)}, ${adjustBrightness(bookPrimaryColor, -10)})`,
                WebkitBackgroundClip: 'text'
              }}
            >
              {bookTitle}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed font-light mb-8">
            Explore the <span className="font-bold" style={{ color: bookPrimaryColor }}>{chapters.length} chapters</span> and <span className="font-bold" style={{ color: bookPrimaryColor }}>{scenes.length} scenes</span> of this transformative journey through time and consciousness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href={`/outline/${bookId}`} 
              className="inline-flex items-center px-8 py-4 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 group"
              style={{
                background: `linear-gradient(to right, ${bookPrimaryColor}, ${adjustBrightness(bookPrimaryColor, -15)})`,
                '--hover-bg': `linear-gradient(to right, ${adjustBrightness(bookPrimaryColor, -20)}, ${adjustBrightness(bookPrimaryColor, -30)})`
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(to right, ${adjustBrightness(bookPrimaryColor, -20)}, ${adjustBrightness(bookPrimaryColor, -30)})`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(to right, ${bookPrimaryColor}, ${adjustBrightness(bookPrimaryColor, -15)})`;
              }}
            >
              <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="tracking-wide">VIEW FULL OUTLINE</span>
            </Link>
            <Link 
              href="/books" 
              className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              ← Back to Books
            </Link>
          </div>
          <div className="mt-8 flex justify-center">
            <div 
              className="w-24 h-1 rounded-full"
              style={{
                background: `linear-gradient(to right, transparent, ${bookPrimaryColor}, transparent)`
              }}
            ></div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-2 border border-gray-200/20 dark:border-gray-700/30">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2
                ${activeTab === 'chapters' 
                  ? 'text-white shadow-lg' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              style={{
                background: activeTab === 'chapters' 
                  ? `linear-gradient(to right, ${bookPrimaryColor}, ${adjustBrightness(bookPrimaryColor, -15)})` 
                  : 'transparent'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Chapters ({chapters.length})
            </button>
            <button
              onClick={() => setActiveTab('scenes')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2
                ${activeTab === 'scenes' 
                  ? 'text-white shadow-lg' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              style={{
                background: activeTab === 'scenes' 
                  ? `linear-gradient(to right, ${bookPrimaryColor}, ${adjustBrightness(bookPrimaryColor, -15)})` 
                  : 'transparent'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              All Scenes ({scenes.length})
            </button>
          </div>
        </div>

        {/* Chapters Tab Content - Six-Act Structure */}
        {activeTab === 'chapters' && (
          <div className="space-y-12">
            {getSixActStructure(bookNumber).map((act, actIndex) => {
              const actChapters = chapters.filter(chapter => 
                chapter.chapterNumber >= act.startChapter && chapter.chapterNumber <= act.endChapter
              );
              
              // Act color progression
              const actColors = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];
              const actColor = actColors[actIndex] || '#6366f1';
              
              return (
                <div key={actIndex} className="space-y-6">
                  {/* Act Header */}
                  <div className="text-center relative">
                    <div 
                      className="inline-flex items-center px-8 py-4 rounded-2xl backdrop-blur-md border shadow-2xl mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${actColor}20, ${actColor}30)`,
                        borderColor: `${actColor}40`,
                      }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-4 animate-pulse"
                        style={{ backgroundColor: actColor }}
                      ></div>
                      <div className="text-left">
                        <h2 
                          className="text-2xl font-black tracking-wide"
                          style={{ color: actColor }}
                        >
                          Act {actIndex + 1}: {act.title}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium italic">
                          "{act.subtitle}"
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          Chapters {act.chapters} • {actChapters.length} chapters
                        </p>
                      </div>
                    </div>
                    
                    {/* Act divider */}
                    <div 
                      className="w-32 h-1 rounded-full mx-auto"
                      style={{
                        background: `linear-gradient(to right, transparent, ${actColor}, transparent)`
                      }}
                    ></div>
                  </div>

                  {/* Act Chapters Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
                    {actChapters.map((chapter) => {
                      const iconPath = getChapterIconPath(chapter, bookNumber);
                      const textColor = getTextColor(chapter.colorTheme?.hex);
                      const chapterHex = chapter.colorTheme?.hex || '#6366f1';
                      const gradientBg = createChapterGradient(chapterHex);
                      const glowColor = chapterHex + '40';
                      
                      return (
                        <Link 
                          key={chapter.id}
                          href={`/chapters/${chapter.id}`}
                          className="block aspect-square transition-all duration-500 ease-out hover:scale-110 hover:rotate-2 group relative overflow-hidden"
                          style={{
                            borderRadius: '20px',
                            boxShadow: `0 15px 30px -8px ${glowColor}, 0 0 0 1px ${chapterHex}30`,
                          }}
                        >
                          {/* Enhanced gradient background */}
                          <div 
                            className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: gradientBg }}
                          />
                          
                          {/* Mystical overlay pattern */}
                          <div 
                            className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                            style={{
                              backgroundImage: `radial-gradient(circle at 25% 75%, ${chapterHex}60 0%, transparent 50%), radial-gradient(circle at 75% 25%, ${chapterHex}40 0%, transparent 50%)`
                            }}
                          />
                          
                          {/* Animated sparkles */}
                          <div className="absolute top-2 left-2 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                          <div className="absolute top-8 right-3 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                          <div className="absolute bottom-4 left-2 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                          
                          {/* Top-right icon positioning */}
                          <div className="w-16 h-16 absolute top-2 right-2 z-30 group-hover:scale-110 transition-transform duration-500">
                            <Image
                              src={iconPath}
                              alt={`Chapter ${chapter.chapterNumber} icon`}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain drop-shadow-2xl filter brightness-110 contrast-110"
                              onError={handleIconError}
                              style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                            />
                          </div>
                          
                          {/* Enhanced chapter number */}
                          <div className={`absolute top-2 left-2 font-black text-lg ${textColor} z-20 px-2 py-1 rounded-lg backdrop-blur-md border shadow-xl group-hover:scale-110 transition-all duration-300`}
                            style={{
                              background: `linear-gradient(135deg, ${chapterHex}60, ${chapterHex}80)`,
                              borderColor: `${chapterHex}80`,
                              textShadow: `0 1px 4px ${chapterHex}80`
                            }}>
                            {chapter.chapterNumber}
                          </div>
                          
                          {/* Chapter title at bottom */}
                          <div className="absolute bottom-2 left-2 right-2 z-20">
                            <div className={`${textColor} backdrop-blur-xl border rounded-lg px-2 py-1 shadow-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300`}
                              style={{
                                background: `linear-gradient(135deg, ${chapterHex}50, ${chapterHex}70)`,
                                borderColor: `${chapterHex}80`,
                              }}>
                              <ResponsiveText
                                text={chapter.title}
                                className={`font-bold tracking-wide text-center w-full ${textColor}`}
                                style={{ 
                                  textShadow: `0 1px 3px ${chapterHex}80`
                                }}
                                maxFontSize={12}
                                minFontSize={8}
                              />
                            </div>
                          </div>
                          
                          {/* Enhanced mystical overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none group-hover:from-white/10 group-hover:to-black/10 transition-all duration-500"></div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Scenes Tab Content */}
        {activeTab === 'scenes' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenes.map((scene) => {
              const chapterHex = scene.chapter?.colorTheme?.hex || bookPrimaryColor;
              const textColor = getTextColor(chapterHex);
              
              return (
                <Link
                  key={scene.id}
                  href={`/scenes/${scene.id}`}
                  className="group block bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-200/20 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-gray-700/50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  {/* Scene Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`px-3 py-1 rounded-lg font-bold text-sm ${textColor} shadow-lg`}
                        style={{
                          background: `linear-gradient(135deg, ${chapterHex}80, ${chapterHex}A0)`,
                        }}
                      >
                        Ch{scene.chapter?.chapterNumber} • S{scene.sceneNumber}
                      </div>
                      {scene.primaryTarotCard && (
                        <div className="text-2xl" title={`Tarot: ${scene.primaryTarotCard}`}>
                          🔮
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Copy Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCopyScene(scene);
                        }}
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                          copiedSceneId === scene.id
                            ? 'bg-green-500 text-white'
                            : 'bg-white/20 hover:bg-white/30 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                        }`}
                        title={copiedSceneId === scene.id ? 'Copied!' : 'Copy scene data for Sudowrite'}
                      >
                        {copiedSceneId === scene.id ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                      
                      {/* Navigate Arrow */}
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Scene Title */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-opacity-80 transition-colors">
                    {scene.title}
                  </h3>
                  
                  {/* Chapter Context */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {scene.chapter?.title}
                  </p>
                  
                  {/* Scene Details */}
                  <div className="space-y-2 text-sm">
                    {scene.description && (
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                        {scene.description}
                      </p>
                    )}
                    
                    {/* Metadata Row */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {scene.pov && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md text-xs">
                          POV: {scene.pov}
                        </span>
                      )}
                      {scene.location && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-xs">
                          📍 {scene.location}
                        </span>
                      )}
                      {scene.core_emotion && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-md text-xs">
                          💭 {scene.core_emotion}
                        </span>
                      )}
                      {scene.timeline_date && (
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-md text-xs">
                          📅 {scene.timeline_date}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
            </div>
          </>
        )}
        
        {/* Empty States */}
        {activeTab === 'chapters' && chapters.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Chapters Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">This book&apos;s chapters are still being prepared for your journey.</p>
          </div>
        )}
        
        {activeTab === 'scenes' && scenes.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Scenes Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">This book&apos;s scenes are still being crafted for your adventure.</p>
          </div>
        )}
      </div>
    </div>
  );
}