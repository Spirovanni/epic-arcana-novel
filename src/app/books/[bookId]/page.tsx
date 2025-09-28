'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AppNavbar } from '@/components/shared/AppNavbar';
import ResponsiveText from '@/components/ResponsiveText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Copy, Check } from 'lucide-react';

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
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground">Loading Epic Arcana Chronicles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <Badge 
              variant="secondary" 
              className="text-xs font-semibold"
              style={{
                backgroundColor: bookPrimaryColor,
                color: getTextColor(bookPrimaryColor) === 'text-white' ? '#ffffff' : '#000000',
                border: 'none'
              }}
            >
              BOOK {bookNumber}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {bookTitle}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the <span className="font-bold text-primary">{chapters.length} chapters</span> and <span className="font-bold text-primary">{scenes.length} scenes</span> of this transformative journey through time and consciousness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={`/outline/${bookId}`}>
                <FileText className="mr-2 h-4 w-4" />
                VIEW FULL OUTLINE
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/books">
                ← Back to Books
              </Link>
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={activeTab === 'chapters' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('chapters')}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Chapters ({chapters.length})
            </Button>
            <Button
              variant={activeTab === 'scenes' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('scenes')}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              All Scenes ({scenes.length})
            </Button>
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
                  <Card className="mb-6">
                    <CardHeader className="text-center">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: actColor }}
                        />
                        <Badge variant="outline" style={{ color: actColor, borderColor: actColor }}>
                          Act {actIndex + 1}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold" style={{ color: actColor }}>
                        {act.title}
                      </CardTitle>
                      <p className="text-muted-foreground italic">
                        "{act.subtitle}"
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Chapters {act.chapters} • {actChapters.length} chapters
                      </p>
                    </CardHeader>
                  </Card>

                  {/* Act Chapters Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {actChapters.map((chapter) => {
                      const chapterHex = chapter.colorTheme?.hex || '#6366f1';
                      const contrastColor = getTextColor(chapterHex) === 'text-white' ? '#ffffff' : '#000000';
                      const iconPath = getChapterIconPath(chapter, bookNumber);
                      
                      return (
                        <Link key={chapter.id} href={`/chapters/${chapter.id}`} className="group block">
                          <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-border/50 hover:border-border">
                            <CardHeader 
                              className="text-center pb-3 relative"
                              style={{
                                background: `linear-gradient(135deg, ${chapterHex}15, ${chapterHex}25)`,
                                borderBottom: `1px solid ${chapterHex}30`
                              }}
                            >
                              {/* Chapter Icon */}
                              <div 
                                className="absolute top-2 right-2 w-10 h-10 rounded-lg border-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
                                style={{
                                  backgroundColor: chapterHex,
                                  borderColor: chapterHex,
                                }}
                              >
                                <Image
                                  src={iconPath}
                                  alt={`Chapter ${chapter.chapterNumber} icon`}
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 object-contain"
                                  onError={handleIconError}
                                  style={{
                                    filter: getTextColor(chapterHex) === 'text-white' 
                                      ? 'brightness(0) invert(1)' // White icons for dark backgrounds
                                      : 'brightness(0)' // Black icons for light backgrounds
                                  }}
                                />
                              </div>
                              
                              <Badge 
                                variant="secondary" 
                                className="text-xs font-semibold w-fit mx-auto"
                                style={{
                                  backgroundColor: chapterHex,
                                  color: contrastColor,
                                  border: 'none'
                                }}
                              >
                                CHAPTER {chapter.chapterNumber}
                              </Badge>
                            </CardHeader>
                            
                            <CardContent className="pt-4 space-y-2">
                              <h3 className="font-semibold text-sm text-foreground leading-tight line-clamp-2">
                                {chapter.title}
                              </h3>
                              
                              {chapter.description && (
                                <p className="text-xs text-muted-foreground line-clamp-3">
                                  {chapter.description}
                                </p>
                              )}
                              
                              {/* Color indicator */}
                              <div className="flex items-center gap-2 pt-2">
                                <div 
                                  className="w-2 h-2 rounded-full border border-border/50" 
                                  style={{ backgroundColor: chapterHex }}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {chapter.colorTheme?.name || 'Default'}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenes.map((scene) => {
              const chapterHex = scene.chapter?.colorTheme?.hex || bookPrimaryColor;
              const contrastColor = getTextColor(chapterHex) === 'text-white' ? '#ffffff' : '#000000';
              
              return (
                <Link key={scene.id} href={`/scenes/${scene.id}`} className="group block">
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-border/50 hover:border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className="text-xs font-semibold"
                            style={{
                              backgroundColor: chapterHex,
                              color: contrastColor,
                              border: 'none'
                            }}
                          >
                            Ch{scene.chapter?.chapterNumber} • S{scene.sceneNumber}
                          </Badge>
                          {scene.primaryTarotCard && (
                            <span className="text-lg" title={`Tarot: ${scene.primaryTarotCard}`}>
                              🔮
                            </span>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCopyScene(scene);
                          }}
                          className="h-8 w-8 p-0"
                          title={copiedSceneId === scene.id ? 'Copied!' : 'Copy scene data'}
                        >
                          {copiedSceneId === scene.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <CardTitle className="text-base font-semibold text-left line-clamp-2">
                        {scene.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0 space-y-3">
                      {/* Chapter Context */}
                      <p className="text-sm text-muted-foreground">
                        {scene.chapter?.title}
                      </p>
                      
                      {/* Scene Description */}
                      {scene.description && (
                        <p className="text-sm text-foreground line-clamp-2">
                          {scene.description}
                        </p>
                      )}
                      
                      {/* Metadata Tags */}
                      <div className="flex flex-wrap gap-1">
                        {scene.pov && (
                          <Badge variant="outline" className="text-xs">
                            POV: {scene.pov}
                          </Badge>
                        )}
                        {scene.location && (
                          <Badge variant="outline" className="text-xs">
                            📍 {scene.location}
                          </Badge>
                        )}
                        {scene.core_emotion && (
                          <Badge variant="outline" className="text-xs">
                            💭 {scene.core_emotion}
                          </Badge>
                        )}
                        {scene.timeline_date && (
                          <Badge variant="outline" className="text-xs">
                            📅 {scene.timeline_date}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
        
        {/* Empty States */}
        {activeTab === 'chapters' && chapters.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No chapters available</h3>
            <p className="text-muted-foreground">This book's chapters are still being prepared for your journey.</p>
          </div>
        )}
        
        {activeTab === 'scenes' && scenes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No scenes available</h3>
            <p className="text-muted-foreground">This book's scenes are still being crafted for your adventure.</p>
          </div>
        )}
      </div>
    </div>
  );
}