'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { ArrowLeftIcon, BookOpenIcon, SparklesIcon, ClockIcon, AcademicCapIcon, LightBulbIcon, ClipboardDocumentCheckIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import CharacterArcGuidance from '@/components/CharacterArcGuidance';
import CharacterToolkitHUD from '@/components/CharacterToolkitHUD';
import SceneManager from '@/components/SceneManager';
import TaskChecklist from '@/components/TaskChecklist';

// Simple HTML editor component for React 19 compatibility
const SimpleHTMLEditor = ({ value, onChange, onSave }: { 
  value: string; 
  onChange: (value: string) => void; 
  onSave: () => void;
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const insertFormat = (tag: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    
    let newContent = '';
    if (tag === 'h1') newContent = `${beforeText}<h1>${selectedText || 'Heading 1'}</h1>${afterText}`;
    else if (tag === 'h2') newContent = `${beforeText}<h2>${selectedText || 'Heading 2'}</h2>${afterText}`;
    else if (tag === 'h3') newContent = `${beforeText}<h3>${selectedText || 'Heading 3'}</h3>${afterText}`;
    else if (tag === 'p') newContent = `${beforeText}<p>${selectedText || 'Paragraph'}</p>${afterText}`;
    else if (tag === 'bold') newContent = `${beforeText}<strong>${selectedText || 'Bold text'}</strong>${afterText}`;
    else if (tag === 'italic') newContent = `${beforeText}<em>${selectedText || 'Italic text'}</em>${afterText}`;
    else if (tag === 'blockquote') newContent = `${beforeText}<blockquote><p>${selectedText || 'Quote text'}</p></blockquote>${afterText}`;
    
    onChange(newContent);
    setHasUnsavedChanges(true);
  };

  const handleContentChange = (newContent: string) => {
    onChange(newContent);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600 p-3 flex flex-wrap items-center gap-3">
        {/* Formatting Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => insertFormat('h1')}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => insertFormat('h2')}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => insertFormat('h3')}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => insertFormat('p')}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            Paragraph
          </button>
          <button
            type="button"
            onClick={() => insertFormat('bold')}
            className="px-3 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => insertFormat('italic')}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors italic"
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => insertFormat('blockquote')}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            Quote
          </button>
        </div>

        {/* Divider */}
        <div className="border-l border-gray-300 dark:border-gray-600 h-6"></div>

        {/* Preview Toggle */}
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`px-4 py-1.5 text-sm font-medium border rounded-md transition-colors ${
            isPreview 
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
              : 'text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        >
          {isPreview ? 'Edit Mode' : 'Preview'}
        </button>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasUnsavedChanges || isSaving}
          className={`px-4 py-1.5 text-sm font-medium border rounded-md transition-colors ${
            hasUnsavedChanges && !isSaving
              ? 'bg-green-600 text-white border-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
          }`}
        >
          {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}
        </button>

        {/* Unsaved indicator */}
        {hasUnsavedChanges && (
          <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">• Unsaved changes</span>
        )}
      </div>
      
      {/* Editor/Preview */}
      <div className="min-h-[350px]">
        {isPreview ? (
          <div 
            className="p-4 prose prose-sm max-w-none prose-gray dark:prose-invert bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <textarea
            id="content-editor"
            value={value}
            onChange={(e) => handleContentChange(e.target.value)}
            onPaste={(e) => {
              // Get pasted text
              const pastedText = e.clipboardData?.getData('text') || '';
              if (pastedText.length > 500) {
                // Add visual feedback for large paste
                const indicator = document.createElement('div');
                indicator.textContent = 'Large content detected - distributing across pages...';
                indicator.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
                document.body.appendChild(indicator);
                setTimeout(() => {
                  if (document.body.contains(indicator)) {
                    document.body.removeChild(indicator);
                  }
                }, 3000);
              }
            }}
            className="w-full h-[350px] p-4 border-0 resize-none focus:outline-none font-mono text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Start writing your chapter content here... (Large content will automatically create new pages)"
          />
        )}
      </div>
    </div>
  );
};

interface ColorTheme {
  name: string;
  hex: string;
  rgb: [number, number, number];
}

interface Chapter {
  id: string;
  title: string;
  specific_task_group_title: string;
  chapterNumber: number;
  description: string;
  focus: string;
  focusArea?: string;
  connectionToMajorTaskGroup?: string;
  summary?: string;
  tagline?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  terminalLearningObjectives?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  booksInfluencedBy?: any;
  epicNovelPages: string;
  epicChapterFocus: string;
  epicNovelChapterFocus: string;
  epicNovelSectionName: string;
  tarotCardLink: string;
  tarotFamily: string;
  tarotCardItem: string;
  colorTheme: ColorTheme;
  iconPath?: string;
  previousChapterId?: string;
  nextChapterId?: string;
  [key: string]: unknown;
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
  beatGoal?: string;
  tarotSymbolism: string;
  heroJourneyStage: string;
  pages: string;
  primaryTarotCard: string;
  tarotNarrativeRole: string;
  historicalDate: string;
}

interface TaskGroup {
  id: string;
  type: string;
  title: string;
  description: string;
  tagline: string;
  focusArea: string;
  learningObjectives: Record<string, unknown>;
}

interface ChapterPage {
  id: string;
  pageNumber: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface AIPrompt {
  category: string;
  title: string;
  prompt: string;
}

interface CharacterGuidance {
  character: {
    id: string;
    name: string;
    description: string;
  };
  arc: {
    id: string;
    arcType: string;
    triumphTheme: string;
    stage: string;
    development: {
      book: number;
      chapter: number;
      focus: string;
      arc_development: string;
      key_events: string[];
      character_growth: string;
      writer_tasks: string[];
    };
  };
}

interface ChapterData {
  chapter: Chapter;
  book: Book;
  scenes: Scene[];
  taskGroups: {
    major: TaskGroup[];
    specific: TaskGroup[];
  };
  pages: ChapterPage[];
  characterGuidance: CharacterGuidance[];
  stats: {
    sceneCount: number;
    taskGroupCount: number;
    pageCount: number;
    wordCount: number;
    characterArcsCount: number;
  };
  taskMaster?: TaskGroup;
  majorTaskGroup?: TaskGroup;
}

// Enhanced helper functions for sophisticated chapter theming
const getTextColor = (bgColor: string): 'text-white' | 'text-black' => {
  if (!bgColor) return 'text-black';
  const color = bgColor.startsWith('#') ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'text-black' : 'text-white';
};

// Generate sophisticated gradient backgrounds for chapter theming
const createChapterGradient = (hex: string) => {
  const lighterHex = adjustBrightness(hex, 20);
  const darkerHex = adjustBrightness(hex, -30);
  return `linear-gradient(135deg, ${hex}E6 0%, ${lighterHex}CC 25%, ${hex}B3 50%, ${darkerHex}E6 100%)`;
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

// Format chapter data for Sudowrite
const formatChapterForSudowrite = (chapter: Chapter, scenes: Scene[]): string => {
  const parts = [];
  
  // Chapter Header
  parts.push(`CHAPTER ${chapter.chapterNumber}: ${chapter.title}`);
  parts.push('='.repeat(50));
  parts.push('');
  
  // Chapter Summary
  if (chapter.summary) {
    parts.push('CHAPTER SUMMARY:');
    parts.push(chapter.summary);
    parts.push('');
  }
  
  // Scene Beat Goals
  if (scenes.length > 0) {
    parts.push('SCENE BEAT GOALS:');
    parts.push('-'.repeat(30));
    scenes.forEach((scene, index) => {
      parts.push(`Scene ${scene.sceneNumber}: ${scene.title}`);
      if (scene.beatGoal) {
        parts.push(`Beat Goal: ${scene.beatGoal}`);
      } else if (scene.focus) {
        parts.push(`Focus: ${scene.focus}`);
      }
      if (index < scenes.length - 1) {
        parts.push('');
      }
    });
  }
  
  return parts.join('\n');
};

const getChapterIconPath = (chapter: Chapter, bookNumber: number): string => {
  if (chapter.iconPath) {
    return `/icons/${chapter.iconPath}`;
  }
  return `/icons/chapters/book${bookNumber}/chapter${chapter.chapterNumber}.png`;
};

const handleIconError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement;
  target.src = '/icons/fallback/default-chapter.svg';
};

const countWords = (text: string): number => {
  return text.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
};

const countCharacters = (text: string): number => {
  return text.replace(/<[^>]*>/g, '').length;
};

// Component to handle description with expand/collapse functionality
const ExpandableDescription = ({ description, textColor, isExpanded, onToggle }: {
  description: string;
  textColor: string;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  if (!description) return null;

  // Split description into words and approximate lines based on typical line length
  const words = description.split(/\s+/);
  const wordsPerLine = 12; // Approximate words per line for this text size
  const maxLines = 10;
  const maxWordsCollapsed = maxLines * wordsPerLine;
  
  const shouldTruncate = words.length > maxWordsCollapsed;
  const displayText = isExpanded ? description : words.slice(0, maxWordsCollapsed).join(' ');
  
  if (!shouldTruncate) {
    // If content is short enough, just display normally without expand button
    return (
      <p className={`text-lg ${textColor} opacity-90`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
        {description}
      </p>
    );
  }

  return (
    <div className="relative pr-20 pb-8">
      <p className={`text-lg ${textColor} opacity-90 whitespace-pre-line`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
        {displayText}
        {!isExpanded && '...'}
      </p>
      
      {/* Expand/Collapse Button - positioned in bottom right */}
      <button
        onClick={onToggle}
        className={`absolute bottom-0 right-0 flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-200 backdrop-blur-md border-2 shadow-lg ${
          textColor === 'text-white' 
            ? 'bg-white/25 border-white/40 hover:bg-white/35 text-white' 
            : 'bg-black/15 border-black/30 hover:bg-black/25 text-black'
        }`}
        style={{ 
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          zIndex: 10
        }}
      >
        <span className="text-xs font-semibold">
          {isExpanded ? 'Show Less' : 'Show More'}
        </span>
        {isExpanded ? (
          <ChevronUpIcon className="w-4 h-4" />
        ) : (
          <ChevronDownIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

const getPageGoal = (pageNumber: number, totalPages: number): number => {
  if (pageNumber === 1) return 1000; // First page: 1000 characters
  if (pageNumber === totalPages && totalPages > 1) return 300; // Last page: 300 characters minimum
  return 2000; // All other pages: 2000 characters
};

const getPageProgress = (content: string, pageNumber: number, totalPages: number): number => {
  const charCount = countCharacters(content);
  const goal = getPageGoal(pageNumber, totalPages);
  return Math.min(100, (charCount / goal) * 100);
};

const getOverallProgress = (pages: ChapterPage[]): number => {
  const maxPages = 15;
  const completedPages = pages.filter(page => {
    const charCount = countCharacters(page.content || '');
    const goal = getPageGoal(page.pageNumber, pages.length);
    return charCount >= goal;
  }).length;
  
  return Math.min(100, (completedPages / maxPages) * 100);
};

export default function ChapterWritingPage() {
  const params = useParams();
  const chapterId = params.chapterId as string;
  const { user } = useUser();
  
  const [data, setData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'write' | 'scenes' | 'tasks'>('overview');
  const [currentPage, setCurrentPage] = useState(0);
  const [aiPrompts, setAiPrompts] = useState<AIPrompt[]>([]);
  const [showPrompts, setShowPrompts] = useState(false);
  const [permissions, setPermissions] = useState({ canRead: false, canWrite: false, canAdmin: false });
  const [showToolkit, setShowToolkit] = useState(false);
  const [totalTasks, setTotalTasks] = useState(0);
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [editedChapter, setEditedChapter] = useState<Partial<Chapter> | null>(null);
  const [isSavingOverview, setIsSavingOverview] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
  }, []);

  // Check user permissions - TEMPORARILY ALLOWING ALL ACCESS FOR DEVELOPMENT
  useEffect(() => {
    // TODO: Re-enable admin authentication later
    // For development purposes, allowing all access
    setPermissions({
      canRead: true,
      canWrite: true, // Temporarily allowing write access for all users
      canAdmin: true  // Temporarily allowing admin access for all users
    });
    
    // Original admin check (commented out for development):
    // if (user) {
    //   const isAdmin = user.publicMetadata?.role === 'admin' || 
    //                  user.emailAddresses?.[0]?.emailAddress === 'admin@epicarcana.com';
    //   const isPaidMember = user.publicMetadata?.membershipType === 'paid';
    //   
    //   setPermissions({
    //     canRead: true,
    //     canWrite: isAdmin || isPaidMember,
    //     canAdmin: isAdmin
    //   });
    // }
  }, [user]);

  // Function to get task count for the chapter (using same logic as TaskChecklist)
  const getTaskCount = (): number => {
    // Same mock data structure as TaskChecklist component
    const mockChapterTasks = {
      character_arcs: {
        "Francisco": "Initial state - Young law student with hidden poetic talent, struggling with father's expectations vs. personal desires. Academic pressure conflicts with creative impulses. Social naivety evident in his infatuation with Novella.",
        "Novella": "Intelligent daughter hiding behind conventions, representing Francisco's idealized view of love and knowledge.",
        "Dante": "Mysterious guide introduction - Hints at his chronicle manipulation abilities. Shows deeper knowledge of temporal mechanics than he initially reveals."
      },
      story_gaps_addressed: {
        "trionfi_system": "Francisco's first unintentional activation shows him seeing the train pathway on the card - establishes cards as windows to other realities/timelines.",
        "temporal_mechanics": "The distant train grumbling represents the first temporal disturbance, setting up timeline awareness.",
        "character_motivation": "Francisco's preparation shows his growing courage despite fear - establishes his heroic potential beneath academic exterior."
      },
      series_connections: {
        "book_9_parallel": "Opening despair will transform into universal hope when Francisco gives up his singular greatness for humanity's potential.",
        "the_fool_journey": "Francisco's first step as The Fool, unaware of the cosmic significance of his simple card game creation.",
        "timeline_convergence": "This chapter's events will echo in the final book when all timelines converge into a single moment of choice."
      }
    };

    // Calculate total task count (3 + 3 + 3 = 9)
    return Object.keys(mockChapterTasks.character_arcs).length + 
           Object.keys(mockChapterTasks.story_gaps_addressed).length + 
           Object.keys(mockChapterTasks.series_connections).length;
  };

  // Fetch chapter data
  useEffect(() => {
    if (!chapterId) return;
    async function fetchChapterData() {
      try {
        const response = await fetch(`/api/chapters/${chapterId}`);
        if (response.ok) {
          const chapterData = await response.json();
          
          
          setData(chapterData);
          
          // Set first page as current if pages exist
          if (chapterData.pages && chapterData.pages.length > 0) {
            setCurrentPage(0);
          }

          // Set task count on page load
          setTotalTasks(getTaskCount());
        } else {
          // Log detailed error information for debugging
          console.error(`Failed to fetch chapter ${chapterId}:`, {
            status: response.status,
            statusText: response.statusText,
            url: response.url
          });
          
          // Try to get error message from response
          try {
            const errorText = await response.text();
            console.error('Server error message:', errorText);
          } catch {
            console.error('Could not read error response');
          }
        }
      } catch (error) {
        console.error('Failed to fetch chapter data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchChapterData();
  }, [chapterId]);

  // Clean up pages beyond the 15-page limit
  const cleanupExcessPages = useCallback(async () => {
    if (!data || data.pages.length <= 15) return;
    
    const excessPages = data.pages.slice(15); // Pages beyond the 15th
    console.log(`Cleaning up ${excessPages.length} excess pages beyond the 15-page limit`);
    
    try {
      const deletePromises = excessPages.map(page => 
        fetch(`/api/chapters/${chapterId}/pages/${page.id}`, {
          method: 'DELETE',
        })
      );
      
      await Promise.all(deletePromises);
      
      // Update state to remove excess pages
      setData(prev => prev ? {
        ...prev,
        pages: prev.pages.slice(0, 15),
        stats: { ...prev.stats, pageCount: Math.min(prev.stats.pageCount, 15) }
      } : null);
      
      console.log(`Successfully cleaned up excess pages`);
    } catch (error) {
      console.error('Failed to clean up excess pages:', error);
    }
  }, [data, chapterId]);

  // Clean up excess pages beyond 15
  useEffect(() => {
    if (data && !loading && data.pages.length > 15) {
      cleanupExcessPages();
    }
  }, [data, loading, cleanupExcessPages]);

  // Fetch AI prompts
  const fetchAiPrompts = async () => {
    try {
      const response = await fetch(`/api/chapters/${chapterId}/ai-prompt`);
      if (response.ok) {
        const promptData = await response.json();
        setAiPrompts(promptData.prompts);
        setShowPrompts(true);
      }
    } catch (error) {
      console.error('Failed to fetch AI prompts:', error);
    }
  };

  // Save page content
  const savePage = async (pageId: string, content: string) => {
    try {
      const response = await fetch(`/api/chapters/${chapterId}/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      if (response.ok) {
        const updatedPage = await response.json();
        setData(prev => prev ? {
          ...prev,
          pages: prev.pages.map(p => p.id === pageId ? updatedPage : p)
        } : null);
      }
    } catch (error) {
      console.error('Failed to save page:', error);
    }
  };

  // Add new page (with 15-page limit)
  const addNewPage = async () => {
    if (!data || data.pages.length >= 15) {
      console.log('Cannot add page: 15-page limit reached');
      return;
    }
    
    try {
      const response = await fetch(`/api/chapters/${chapterId}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '' }),
      });
      
      if (response.ok) {
        const newPage = await response.json();
        setData(prev => prev ? {
          ...prev,
          pages: [...prev.pages, newPage],
          stats: { ...prev.stats, pageCount: prev.stats.pageCount + 1 }
        } : null);
        setCurrentPage(data?.pages.length || 0);
      }
    } catch (error) {
      console.error('Failed to add new page:', error);
    }
  };

  // Create all remaining pages up to 15
  const ensureAllPagesExist = async () => {
    if (!data) return;
    
    const currentPageCount = data.pages.length;
    if (currentPageCount >= 15) {
      console.log('15-page limit already reached');
      return;
    }
    
    const pagesNeeded = Math.min(15 - currentPageCount, 15); // Ensure we never exceed 15
    
    if (pagesNeeded > 0) {
      try {
        for (let i = 0; i < pagesNeeded; i++) {
          // Double-check we haven't exceeded the limit
          if (data.pages.length + i >= 15) break;
          
          const response = await fetch(`/api/chapters/${chapterId}/pages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: '' }),
          });
          
          if (response.ok) {
            const newPage = await response.json();
            setData(prev => prev ? {
              ...prev,
              pages: [...prev.pages, newPage],
              stats: { ...prev.stats, pageCount: prev.stats.pageCount + 1 }
            } : null);
          }
        }
      } catch (error) {
        console.error('Failed to create pages:', error);
      }
    }
  };

  // Save chapter overview data
  const saveChapterOverview = async () => {
    if (!editedChapter) return;
    
    setIsSavingOverview(true);
    try {
      const response = await fetch(`/api/chapters/${chapterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedChapter),
      });
      
      if (response.ok) {
        setData(prev => prev ? {
          ...prev,
          chapter: { ...prev.chapter, ...editedChapter }
        } : null);
        setIsEditingOverview(false);
        setEditedChapter(null);
      }
    } catch (error) {
      console.error('Failed to save chapter overview:', error);
    } finally {
      setIsSavingOverview(false);
    }
  };

  // Start editing overview
  const startEditingOverview = () => {
    if (!data?.chapter) return;
    setEditedChapter({
      title: data.chapter.title || '',
      focusArea: data.chapter.focusArea || '',
      connectionToMajorTaskGroup: data.chapter.connectionToMajorTaskGroup || '',
      summary: data.chapter.summary || ''
    });
    setIsEditingOverview(true);
  };

  // Cancel editing overview
  const cancelEditingOverview = () => {
    setIsEditingOverview(false);
    setEditedChapter(null);
  };

  // Update edited chapter field
  const updateEditedChapterField = (field: string, value: string) => {
    setEditedChapter(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Copy chapter data to clipboard
  const handleCopyChapter = async () => {
    if (!data?.chapter) return;
    
    const formattedText = formatChapterForSudowrite(data.chapter, data.scenes);
    
    // Check if clipboard API is available and we're in a secure context
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(formattedText);
        setIsCopied(true);
        
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
        return;
      } catch (error) {
        console.error('Clipboard API failed:', error);
      }
    }
    
    // Fallback for older browsers or non-secure contexts
    try {
      const textArea = document.createElement('textarea');
      textArea.value = formattedText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      } else {
        console.error('Fallback copy failed');
      }
    } catch (error) {
      console.error('Failed to copy chapter data:', error);
    }
  };

  // Enhanced content handler for large pastes - auto-distribute across pages
  const handleLargeContentPaste = async (content: string, startPageIndex: number) => {
    const maxCharsPerPage = 2000;
    const firstPageMax = 1000;
    const cleanContent = content.replace(/<[^>]*>/g, ''); // Strip existing HTML for character counting
    const totalChars = cleanContent.length;
    
    // If content fits in current page, just update it
    const currentPageGoal = getPageGoal(startPageIndex + 1, data?.pages.length || 0);
    if (totalChars <= currentPageGoal) {
      return; // Let normal flow handle it
    }

    // Calculate how many pages we need
    let remainingChars = totalChars;
    let currentPageIndex = startPageIndex;
    let neededPages = 0;
    
    // Calculate pages needed
    while (remainingChars > 0) {
      const pageGoal = currentPageIndex === 0 ? firstPageMax : maxCharsPerPage;
      remainingChars -= pageGoal;
      neededPages++;
      currentPageIndex++;
    }

    // Create additional pages if needed
    const currentPageCount = data?.pages.length || 0;
    const pagesNeeded = Math.min(neededPages, 15 - currentPageCount); // Respect 15 page limit
    
    for (let i = 0; i < pagesNeeded - 1; i++) {
      await addNewPage();
    }

    // Wait a bit for pages to be created, then distribute content
    setTimeout(() => distributeContentAcrossPages(content, startPageIndex), 100);
  };

  // Distribute content across multiple pages
  const distributeContentAcrossPages = (content: string, startPageIndex: number) => {
    if (!data) return;
    
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    let currentPageIndex = startPageIndex;
    let currentPageContent = '';
    let paragraphIndex = 0;
    
    const updatedPages = [...data.pages];
    
    while (paragraphIndex < paragraphs.length && currentPageIndex < updatedPages.length) {
      const pageGoal = getPageGoal(currentPageIndex + 1, updatedPages.length);
      
      // Add paragraphs to current page until we reach the goal
      while (paragraphIndex < paragraphs.length) {
        const nextParagraph = paragraphs[paragraphIndex];
        
        // Check if adding this paragraph would exceed the page goal
        if (countCharacters(currentPageContent + nextParagraph) > pageGoal && currentPageContent.length > 0) {
          break;
        }
        
        currentPageContent += (currentPageContent ? '\n\n' : '') + nextParagraph;
        paragraphIndex++;
      }
      
      // Update the page content
      if (currentPageIndex < updatedPages.length) {
        updatedPages[currentPageIndex] = {
          ...updatedPages[currentPageIndex],
          content: currentPageContent
        };
      }
      
      // Move to next page
      currentPageIndex++;
      currentPageContent = '';
    }
    
    // Update state with distributed content
    setData(prev => prev ? {
      ...prev,
      pages: updatedPages
    } : null);
    
    // Save all updated pages
    updatedPages.forEach((page, index) => {
      if (index >= startPageIndex && page.content) {
        savePage(page.id, page.content);
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <Breadcrumbs items={[
          { label: 'Books', href: '/books' },
          { label: 'Loading...', current: true }
        ]} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading chapter...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <Breadcrumbs items={[
          { label: 'Books', href: '/books' },
          { label: 'Chapter Not Found', current: true }
        ]} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Chapter Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The chapter you&apos;re looking for doesn&apos;t exist or has been moved.</p>
            <Link 
              href="/books" 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200"
            >
              Return to Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { chapter, book, pages: allPages, stats } = data;
  // Limit to first 15 pages only and ensure proper numbering
  const pages = allPages
    .slice(0, 15)
    .map((page, index) => ({
      ...page,
      pageNumber: index + 1 // Ensure sequential numbering 1-15
    }));
  const iconPath = getChapterIconPath(chapter, book.bookNumber);
  const chapterHex = chapter.colorTheme?.hex || '#6366f1';
  const textColor = getTextColor(chapterHex);
  const isDarkTheme = textColor === 'text-white';
  const gradientBg = createChapterGradient(chapterHex);
  const glowColor = chapterHex + '40';
  
  const currentPageData = pages[currentPage];
  const currentPageWordCount = currentPageData ? countWords(currentPageData.content) : 0;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Subtle mystical overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, ${chapterHex}40 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${chapterHex}30 0%, transparent 50%)`
        }}
      />
      <Navbar />
      <Breadcrumbs items={[
        { label: 'Books', href: '/books' },
        { label: book.title, href: `/books/${book.id}` },
        { label: `Chapter ${chapter.chapterNumber}: ${chapter.title}`, current: true }
      ]} />
      
      {/* Enhanced Hero Header */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          background: gradientBg,
          boxShadow: `0 20px 40px -12px ${glowColor}`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30 pointer-events-none"></div>
        
        {/* Mystical pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 75%, ${chapterHex}60 0%, transparent 50%), radial-gradient(circle at 75% 25%, ${chapterHex}40 0%, transparent 50%)`
          }}
        />
        
        {/* Animated sparkles */}
        <div className="absolute top-8 left-8 w-1 h-1 bg-white/60 rounded-full animate-pulse pointer-events-none"></div>
        <div className="absolute top-16 right-12 w-1 h-1 bg-white/40 rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-16 w-1 h-1 bg-white/50 rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
        
        {/* Navigation */}
        <div className="relative z-10 container mx-auto px-6 py-4 flex justify-between items-center">
          <Link 
            href={`/books/${book.id}`}
            className={`inline-flex items-center space-x-2 ${textColor} hover:opacity-80 transition-opacity`}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to {book.title}</span>
          </Link>

          <div className="flex items-center space-x-2">
            {chapter.previousChapterId && (
              <Link href={`/chapters/${chapter.previousChapterId}`} className={`${textColor} hover:opacity-80 transition-opacity p-2 rounded-full bg-white/10 hover:bg-white/20`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            )}
            {chapter.nextChapterId && (
              <Link href={`/chapters/${chapter.nextChapterId}`} className={`${textColor} hover:opacity-80 transition-opacity p-2 rounded-full bg-white/10 hover:bg-white/20`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Header Content */}
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Chapter Icon */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 relative">
                <div className={`absolute inset-0 rounded-2xl ${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md border-2 ${isDarkTheme ? 'border-white/30' : 'border-black/20'} shadow-2xl`}>
                  <Image
                    src={iconPath}
                    alt={`Chapter ${chapter.chapterNumber} icon`}
                    width={160}
                    height={160}
                    className="w-full h-full object-contain p-4 drop-shadow-xl"
                    onError={handleIconError}
                  />
                </div>
                <div className={`absolute -bottom-2 -right-2 ${textColor} font-black text-3xl lg:text-4xl ${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md rounded-xl px-3 py-1 border-2 ${isDarkTheme ? 'border-white/30' : 'border-black/20'} shadow-xl`}>
                  {chapter.chapterNumber}
                </div>
              </div>
            </div>

            {/* Chapter Information */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className={`text-3xl lg:text-4xl font-black ${textColor} mb-2 leading-tight`} style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                  {chapter.title}
                </h1>
                <ExpandableDescription
                  description={chapter.description}
                  textColor={textColor}
                  isExpanded={isDescriptionExpanded}
                  onToggle={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className={`${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md rounded-lg p-3 border ${isDarkTheme ? 'border-white/30' : 'border-black/20'} text-center`}>
                  <div className={`text-xl font-bold ${textColor}`}>{stats.wordCount}</div>
                  <div className={`text-xs ${textColor} opacity-80`}>Words</div>
                </div>
                <div className={`${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md rounded-lg p-3 border ${isDarkTheme ? 'border-white/30' : 'border-black/20'} text-center`}>
                  <div className={`text-xl font-bold ${textColor}`}>{stats.pageCount}</div>
                  <div className={`text-xs ${textColor} opacity-80`}>Pages</div>
                </div>
                <div className={`${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md rounded-lg p-3 border ${isDarkTheme ? 'border-white/30' : 'border-black/20'} text-center`}>
                  <div className={`text-xl font-bold ${textColor}`}>{stats.sceneCount}</div>
                  <div className={`text-xs ${textColor} opacity-80`}>Scenes</div>
                </div>
                <div className={`${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md rounded-lg p-3 border ${isDarkTheme ? 'border-white/30' : 'border-black/20'} text-center`}>
                  <div className={`text-xl font-bold ${textColor}`}>{stats.taskGroupCount}</div>
                  <div className={`text-xs ${textColor} opacity-80`}>Tasks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Tabs */}
      <div className="container mx-auto px-6 py-6 relative z-10">
        <div 
          className="flex flex-wrap gap-2 mb-6 backdrop-blur-md rounded-xl p-1 w-fit mx-auto shadow-2xl border"
          style={{
            background: `linear-gradient(135deg, ${chapterHex}20, ${chapterHex}10)`,
            borderColor: `${chapterHex}30`,
            boxShadow: `0 8px 32px ${glowColor}`
          }}
        >
          {[
            { key: 'overview', label: 'Overview', icon: BookOpenIcon },
            { key: 'write', label: 'Write', icon: SparklesIcon },
            { key: 'scenes', label: `Scenes (${stats.sceneCount})`, icon: ClockIcon },
            { key: 'tasks', label: `Tasks (${totalTasks})`, icon: AcademicCapIcon },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'overview' | 'write' | 'scenes' | 'tasks')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                activeTab === key
                  ? `text-white shadow-xl transform scale-105`
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-105'
              }`}
              style={activeTab === key ? {
                background: `linear-gradient(135deg, ${chapterHex}, ${adjustBrightness(chapterHex, -20)})`,
                boxShadow: `0 4px 20px ${chapterHex}60`
              } : {}}
            >
              <Icon className="w-5 h-5" />
              <span className="tracking-wide">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Enhanced Chapter Overview */}
              <div 
                className="backdrop-blur-md rounded-xl shadow-2xl p-6 border"
                style={{
                  background: `linear-gradient(135deg, ${chapterHex}08, ${chapterHex}05)`,
                  borderColor: `${chapterHex}20`,
                  boxShadow: `0 8px 32px ${glowColor}`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                    <BookOpenIcon className="w-6 h-6 mr-2" style={{ color: chapterHex }} />
                    <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                      Chapter Overview
                    </span>
                  </h2>
                  {permissions.canWrite && (
                    <div className="flex items-center space-x-2">
                      {isEditingOverview ? (
                        <>
                          <button
                            onClick={saveChapterOverview}
                            disabled={isSavingOverview}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                          >
                            {isSavingOverview ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            <span>{isSavingOverview ? 'Saving...' : 'Save'}</span>
                          </button>
                          <button
                            onClick={cancelEditingOverview}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Cancel</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={startEditingOverview}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={handleCopyChapter}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                              isCopied 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }`}
                          >
                            {isCopied ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                            <span>{isCopied ? 'Copied!' : 'Copy for Sudowrite'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Tagline</h3>
                      {isEditingOverview ? (
                        <input
                          type="text"
                          value={editedChapter?.tagline || ''}
                          onChange={(e) => updateEditedChapterField('tagline', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 font-medium italic focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter chapter tagline..."
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 italic font-medium border border-gray-200 dark:border-gray-600">
                          &quot;{chapter.tagline || 'No tagline set'}&quot;
                        </p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Focus Area</h3>
                      {isEditingOverview ? (
                        <input
                          type="text"
                          value={editedChapter?.focusArea || ''}
                          onChange={(e) => updateEditedChapterField('focusArea', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter focus area..."
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 font-medium border border-gray-200 dark:border-gray-600">
                          {chapter.focusArea || 'No focus area set'}
                        </p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Connection to Major Task Group</h3>
                      {isEditingOverview ? (
                        <textarea
                          value={editedChapter?.connectionToMajorTaskGroup || ''}
                          onChange={(e) => updateEditedChapterField('connectionToMajorTaskGroup', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                          placeholder="Enter connection to major task group..."
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 text-sm font-medium border border-gray-200 dark:border-gray-600">
                          {chapter.connectionToMajorTaskGroup || 'No connection specified'}
                        </p>
                      )}
                    </div>
                    {/* Color Theme */}
                    <div>
                      <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Color Theme</h3>
                      <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded px-3 py-2">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: chapter.colorTheme?.hex }}
                        ></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{chapter.colorTheme?.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{chapter.colorTheme?.hex}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Summary</h3>
                      {isEditingOverview ? (
                        <textarea
                          value={editedChapter?.summary || ''}
                          onChange={(e) => updateEditedChapterField('summary', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                          placeholder="Enter chapter summary..."
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 text-sm font-medium border border-gray-200 dark:border-gray-600">
                          {chapter.summary || 'No summary available'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Tarot Information */}
                {(chapter.tarotFamily || chapter.tarotCardItem || chapter.tarotCardLink) && (
                  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-600/50">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                      <SparklesIcon className="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" />
                      Tarot & Symbolism
                    </h2>
                    <div className="space-y-3">
                      {chapter.tarotFamily && (
                        <div>
                          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Family</h3>
                          <p className="text-gray-900 dark:text-gray-100 bg-purple-50 dark:bg-purple-900/30 rounded px-3 py-2">{chapter.tarotFamily}</p>
                        </div>
                      )}
                      {chapter.tarotCardItem && (
                        <div>
                          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Card</h3>
                          <p className="text-gray-900 dark:text-gray-100 bg-purple-50 dark:bg-purple-900/30 rounded px-3 py-2">{chapter.tarotCardItem}</p>
                        </div>
                      )}
                      {chapter.tarotCardLink && (
                        <div>
                          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Connection</h3>
                          <p className="text-gray-900 dark:text-gray-100 bg-purple-50 dark:bg-purple-900/30 rounded px-3 py-2 text-sm">{chapter.tarotCardLink}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Epic Novel Structure */}
                {(chapter.epicNovelSectionName || chapter.epicChapterFocus || chapter.epicNovelPages || chapter.epicNovelChapterFocus) && (
                  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-600/50">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                      <BookOpenIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                      Epic Structure
                    </h2>
                    <div className="space-y-3">
                      {chapter.epicNovelSectionName && (
                        <div>
                          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Section</h3>
                          <p className="text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/30 rounded px-3 py-2">{chapter.epicNovelSectionName}</p>
                        </div>
                      )}
                      {chapter.epicChapterFocus && (
                        <div>
                          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Chapter Focus</h3>
                          <p className="text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/30 rounded px-3 py-2 text-sm">{chapter.epicChapterFocus}</p>
                        </div>
                      )}
                      {chapter.epicNovelChapterFocus && (
                        <div>
                          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Novel Chapter Focus</h3>
                          <p className="text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/30 rounded px-3 py-2 text-sm">{chapter.epicNovelChapterFocus}</p>
                        </div>
                      )}
                      {chapter.epicNovelPages && (
                        <div>
                          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Pages</h3>
                          <p className="text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/30 rounded px-3 py-2">{chapter.epicNovelPages}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Learning Objectives */}
              {chapter.terminalLearningObjectives && typeof chapter.terminalLearningObjectives === 'object' && (
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-600/50">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <AcademicCapIcon className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
                    Learning Objectives
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(chapter.terminalLearningObjectives).map(([key, objective]: [string, unknown]) => {
                      // Handle nested objects safely
                      const objectiveText = typeof objective === 'object' && objective !== null 
                        ? JSON.stringify(objective, null, 2)
                        : String(objective || '');
                      
                      return (
                        <div key={key} className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <pre className="text-green-700 dark:text-green-300 text-sm whitespace-pre-wrap">{objectiveText}</pre>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Task Master and Major Task Group Context */}
              {(data.taskMaster || data.majorTaskGroup) && (
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-600/50">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <AcademicCapIcon className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Hierarchical Context
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {data.taskMaster && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4">
                        <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Task Master</h3>
                        <p className="text-indigo-900 dark:text-indigo-100 font-medium mb-2">{data.taskMaster.title}</p>
                        <p className="text-indigo-700 dark:text-indigo-300 text-sm">{data.taskMaster.description}</p>
                        {data.taskMaster.tagline && (
                          <p className="text-indigo-600 dark:text-indigo-400 text-xs mt-2 italic">&quot;{data.taskMaster.tagline}&quot;</p>
                        )}
                      </div>
                    )}
                    {data.majorTaskGroup && (
                      <div className="bg-cyan-50 dark:bg-cyan-900/30 rounded-lg p-4">
                        <h3 className="font-semibold text-cyan-800 dark:text-cyan-200 mb-2">Major Task Group</h3>
                        <p className="text-cyan-900 dark:text-cyan-100 font-medium mb-2">{data.majorTaskGroup.title}</p>
                        <p className="text-cyan-700 dark:text-cyan-300 text-sm">{data.majorTaskGroup.description}</p>
                        {data.majorTaskGroup.tagline && (
                          <p className="text-cyan-600 dark:text-cyan-400 text-xs mt-2 italic">&quot;{data.majorTaskGroup.tagline}&quot;</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Character Arc Guidance */}
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-600/50">
                <CharacterArcGuidance characterGuidance={data?.characterGuidance || []} />
              </div>

              {/* Books Influenced By */}
              {chapter.booksInfluencedBy && typeof chapter.booksInfluencedBy === 'object' && (
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-600/50">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <BookOpenIcon className="w-6 h-6 mr-2 text-amber-600 dark:text-amber-400" />
                    Literary Influences
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(chapter.booksInfluencedBy).map(([key, book]) => {
                      // Handle nested objects safely
                      if (typeof book === 'object' && book !== null) {
                        const bookObj = book as { title?: string; author?: string; section_of_focus?: string; section_description?: string };
                        return (
                          <div key={key} className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4">
                            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                              {bookObj.title || key}
                            </h3>
                            <p className="text-amber-700 dark:text-amber-300 text-sm mb-2">
                              by {bookObj.author || 'Unknown Author'}
                            </p>
                            {bookObj.section_of_focus && (
                              <p className="text-amber-600 dark:text-amber-400 text-xs">
                                Focus: {bookObj.section_of_focus}
                              </p>
                            )}
                            {bookObj.section_description && (
                              <p className="text-amber-600 dark:text-amber-400 text-xs mt-1">
                                {bookObj.section_description}
                              </p>
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <div key={key} className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4">
                            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">{key}</h3>
                            <p className="text-amber-700 dark:text-amber-300 text-sm">{String(book || '')}</p>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'write' && (
            <div className="space-y-6">
              {!permissions.canWrite && (
                <div className="bg-yellow-50/95 dark:bg-yellow-900/40 backdrop-blur-sm border border-yellow-200 dark:border-yellow-700 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Writing Access Required</h3>
                  <p className="text-yellow-700 dark:text-yellow-300">You need admin access or a paid membership to edit chapters.</p>
                </div>
              )}

              {permissions.canWrite && (
                <>
                  {/* Writing Tools */}
                  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Chapter Writing</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowToolkit(!showToolkit)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            showToolkit
                              ? 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          <ClipboardDocumentCheckIcon className="w-4 h-4" />
                          <span>Toolkit</span>
                        </button>
                        {allPages.length > 15 && (
                          <button
                            onClick={cleanupExcessPages}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            🗑️ Clean Pages
                          </button>
                        )}
                        <button
                          onClick={fetchAiPrompts}
                          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all duration-300 hover:scale-105 font-medium"
                          style={{
                            background: `linear-gradient(135deg, ${chapterHex}, ${adjustBrightness(chapterHex, -20)})`,
                            boxShadow: `0 4px 20px ${chapterHex}60`
                          }}
                        >
                          <LightBulbIcon className="w-4 h-4" />
                          <span>AI Prompts</span>
                        </button>
                      </div>
                    </div>

                    {/* Overall Chapter Progress */}
                    {pages.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Chapter Progress</h3>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {Math.round(getOverallProgress(pages))}% complete
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div 
                            className="h-3 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${getOverallProgress(pages)}%`,
                              background: `linear-gradient(90deg, ${chapterHex}, ${adjustBrightness(chapterHex, 20)})`
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>0 pages</span>
                          <span>15 pages (max)</span>
                        </div>
                      </div>
                    )}

                    {/* Page Navigation */}
                    {pages.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Pages (15 max)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                          {pages.map((page, index) => {
                            const progress = getPageProgress(page.content || '', page.pageNumber, pages.length);
                            const charCount = countCharacters(page.content || '');
                            const goal = getPageGoal(page.pageNumber, pages.length);
                            const isComplete = charCount >= goal;
                            
                            return (
                              <div key={page.id} className="relative">
                                {/* Progress Bar */}
                                <div className="mb-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      Page {page.pageNumber}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                      {charCount}/{goal}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full transition-all duration-300 ${
                                        isComplete 
                                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                      }`}
                                      style={{ width: `${progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                {/* Page Button */}
                                <button
                                  onClick={() => setCurrentPage(index)}
                                  className={`w-full px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                                    currentPage === index
                                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                      : isComplete
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                  }`}
                                >
                                  Page {page.pageNumber}
                                  {isComplete && (
                                    <span className="ml-1 text-xs">✓</span>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Writing Editor */}
                    {currentPageData && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Page {currentPageData.pageNumber}
                          </h3>
                          <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-4">
                            <span>{currentPageWordCount} words</span>
                            <span>
                              {countCharacters(currentPageData.content || '')} / {getPageGoal(currentPageData.pageNumber, pages.length)} chars
                            </span>
                          </div>
                        </div>
                        
                        {/* Current Page Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Page Progress</span>
                            <span className="text-sm text-gray-500 dark:text-gray-500">
                              {Math.round(getPageProgress(currentPageData.content || '', currentPageData.pageNumber, pages.length))}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getPageProgress(currentPageData.content || '', currentPageData.pageNumber, pages.length)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="min-h-[400px]">
                          <SimpleHTMLEditor
                            value={currentPageData.content}
                            onChange={(content) => {
                              const previousContent = currentPageData.content || '';
                              const contentDiff = content.length - previousContent.length;
                              
                              // Update current page content first
                              setData(prev => prev ? {
                                ...prev,
                                pages: prev.pages.map(p => 
                                  p.id === currentPageData.id ? { ...p, content } : p
                                )
                              } : null);
                              
                              // Check if this is a large paste operation (more than 500 characters added at once)
                              if (contentDiff > 500) {
                                // Handle large content paste by distributing across pages
                                handleLargeContentPaste(content, currentPage);
                              }
                              // Remove auto-continuation - let users manually navigate pages
                            }}
                            onSave={() => savePage(currentPageData.id, currentPageData.content)}
                          />
                        </div>
                        
                        {/* Page Goal Information */}
                        <div className="bg-gray-50/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-600/50">
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Page Goal</h4>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {currentPageData.pageNumber === 1 && (
                              <p>First page goal: 1,000 characters (~175 words)</p>
                            )}
                            {currentPageData.pageNumber > 1 && currentPageData.pageNumber < pages.length && (
                              <p>Standard page goal: 2,000 characters (~350 words)</p>
                            )}
                            {currentPageData.pageNumber === pages.length && pages.length > 1 && (
                              <p>Final page goal: 300 characters minimum (~50 words)</p>
                            )}
                          </div>
                          
                          {/* Page completion suggestion */}
                          {(() => {
                            const charCount = countCharacters(currentPageData.content || '');
                            const goal = getPageGoal(currentPageData.pageNumber, pages.length);
                            const isComplete = charCount >= goal;
                            const hasNextPage = currentPage < pages.length - 1;
                            
                            if (isComplete && hasNextPage) {
                              return (
                                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                                  <p className="text-green-700 dark:text-green-300 text-sm font-medium mb-2">
                                    ✓ Page goal reached!
                                  </p>
                                  <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                                  >
                                    Continue to Page {currentPage + 2} →
                                  </button>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    )}

                    {pages.length === 0 && (
                      <div className="text-center py-12">
                        <BookOpenIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-300 mb-4">No pages created yet</p>
                        <button
                          onClick={ensureAllPagesExist}
                          className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                        >
                          Create All 15 Pages
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* AI Prompts Modal */}
              {showPrompts && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-sm rounded-xl max-w-4xl max-h-[80vh] overflow-y-auto border border-gray-200/50 dark:border-gray-600/50">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">AI Writing Prompts</h2>
                        <button
                          onClick={() => setShowPrompts(false)}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="space-y-4">
                        {aiPrompts.map((prompt, index) => (
                          <div key={index} className="border dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{prompt.title}</h3>
                              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">{prompt.category}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{prompt.prompt}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'scenes' && (
            <SceneManager chapterId={chapterId} chapterColorHex={chapterHex} />
          )}

          {activeTab === 'tasks' && (
            <TaskChecklist 
              chapterId={chapterId} 
              chapterData={data.chapter} 
              onTaskCountChange={setTotalTasks}
            />
          )}
        </div>
      </div>

      {/* Character Toolkit HUD */}
      <CharacterToolkitHUD 
        characterGuidance={data?.characterGuidance || []}
        isVisible={showToolkit}
        onClose={() => setShowToolkit(false)}
      />
    </div>
  );
}