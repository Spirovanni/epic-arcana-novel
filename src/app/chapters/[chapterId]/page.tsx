'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { ArrowLeftIcon, BookOpenIcon, SparklesIcon, ClockIcon, AcademicCapIcon, PlusIcon, LightBulbIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import CharacterArcGuidance from '@/components/CharacterArcGuidance';
import CharacterToolkitHUD from '@/components/CharacterToolkitHUD';

// Simple HTML editor component for React 19 compatibility
const SimpleHTMLEditor = ({ value, onChange, onSave }: { 
  value: string; 
  onChange: (value: string) => void; 
  onSave: () => void;
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalValue] = useState(value);
  
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
    setHasUnsavedChanges(newContent !== originalValue);
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
    <div className="border rounded-lg overflow-hidden">
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
            className="p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <textarea
            id="content-editor"
            value={value}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full h-[350px] p-4 border-0 resize-none focus:outline-none font-mono text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            placeholder="Start writing your chapter content here..."
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
  learningObjectives: any;
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
}

// Helper functions
const getTextColor = (bgColor: string): 'text-white' | 'text-black' => {
  if (!bgColor) return 'text-black';
  const color = bgColor.startsWith('#') ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'text-black' : 'text-white';
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

const getOverallProgress = (pages: any[]): number => {
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
  const [editingPage, setEditingPage] = useState<ChapterPage | null>(null);
  const [aiPrompts, setAiPrompts] = useState<AIPrompt[]>([]);
  const [showPrompts, setShowPrompts] = useState(false);
  const [permissions, setPermissions] = useState({ canRead: false, canWrite: false, canAdmin: false });
  const [showToolkit, setShowToolkit] = useState(false);

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
        }
      } catch (error) {
        console.error('Failed to fetch chapter data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchChapterData();
  }, [chapterId]);

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

  // Add new page
  const addNewPage = async () => {
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

  // Auto-continue to next page when current page is complete
  const checkForAutoContinuation = (content: string, currentPageIndex: number) => {
    const currentPageNumber = currentPageIndex + 1;
    const charCount = countCharacters(content);
    const goal = getPageGoal(currentPageNumber, data?.pages.length || 0);
    
    // If page is complete and there's a next page, auto-switch
    if (charCount >= goal && currentPageIndex < (data?.pages.length || 0) - 1) {
      setCurrentPage(currentPageIndex + 1);
    }
    // If page is complete and it's the last page, but not at max pages, create new page
    else if (charCount >= goal && currentPageIndex === (data?.pages.length || 0) - 1 && (data?.pages.length || 0) < 15) {
      addNewPage();
    }
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
            <p className="text-gray-600 dark:text-gray-400 mb-6">The chapter you're looking for doesn't exist or has been moved.</p>
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

  const { chapter, book, scenes, taskGroups, pages, stats } = data;
  const iconPath = getChapterIconPath(chapter, book.bookNumber);
  const textColor = getTextColor(chapter.colorTheme?.hex);
  const isDarkTheme = textColor === 'text-white';
  
  const currentPageData = pages[currentPage];
  const currentPageWordCount = currentPageData ? countWords(currentPageData.content) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Breadcrumbs items={[
        { label: 'Books', href: '/books' },
        { label: book.title, href: `/books/${book.id}` },
        { label: `Chapter ${chapter.chapterNumber}: ${chapter.title}`, current: true }
      ]} />
      
      {/* Hero Header */}
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

        {/* Header Content */}
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Chapter Icon */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 relative">
                <div className={`absolute inset-0 rounded-2xl ${isDarkTheme ? 'bg-white/20' : 'bg-black/10'} backdrop-blur-md border-2 ${isDarkTheme ? 'border-white/30' : 'border-black/20'} shadow-2xl`}>
                  <img
                    src={iconPath}
                    alt={`Chapter ${chapter.chapterNumber} icon`}
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
                <p className={`text-lg ${textColor} opacity-90`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                  {chapter.description}
                </p>
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

      {/* Content Tabs */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-6 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg w-fit mx-auto">
          {[
            { key: 'overview', label: 'Overview', icon: BookOpenIcon },
            { key: 'write', label: 'Write', icon: SparklesIcon },
            { key: 'scenes', label: `Scenes (${stats.sceneCount})`, icon: ClockIcon },
            { key: 'tasks', label: `Tasks (${stats.taskGroupCount})`, icon: AcademicCapIcon },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === key
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg'
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Chapter Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                  <BookOpenIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Chapter Overview
                </h2>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {chapter.tagline && (
                      <div>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Tagline</h3>
                        <p className="text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/30 rounded px-3 py-2 italic">
                          "{chapter.tagline}"
                        </p>
                      </div>
                    )}
                    {chapter.focusArea && (
                      <div>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Focus Area</h3>
                        <p className="text-gray-900 dark:text-gray-100 bg-green-50 dark:bg-green-900/30 rounded px-3 py-2">
                          {chapter.focusArea}
                        </p>
                      </div>
                    )}
                    {chapter.connectionToMajorTaskGroup && (
                      <div>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Connection to Major Task Group</h3>
                        <p className="text-gray-900 dark:text-gray-100 bg-amber-50 dark:bg-amber-900/30 rounded px-3 py-2 text-sm">
                          {chapter.connectionToMajorTaskGroup}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
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
                    {/* Chapter Position */}
                    <div>
                      <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Chapter Position</h3>
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded px-3 py-2">
                        <p className="text-gray-900 dark:text-gray-100">
                          Chapter {chapter.chapterNumber} of {book.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Tarot Information */}
                {(chapter.tarotFamily || chapter.tarotCardItem || chapter.tarotCardLink) && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
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
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
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
              {chapter.terminalLearningObjectives && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <AcademicCapIcon className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
                    Learning Objectives
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(chapter.terminalLearningObjectives).map(([key, objective]) => (
                      <div key={key} className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-green-700 dark:text-green-300 text-sm">{objective}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Task Master and Major Task Group Context */}
              {(data.taskMaster || data.majorTaskGroup) && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
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
                          <p className="text-indigo-600 dark:text-indigo-400 text-xs mt-2 italic">"{data.taskMaster.tagline}"</p>
                        )}
                      </div>
                    )}
                    {data.majorTaskGroup && (
                      <div className="bg-cyan-50 dark:bg-cyan-900/30 rounded-lg p-4">
                        <h3 className="font-semibold text-cyan-800 dark:text-cyan-200 mb-2">Major Task Group</h3>
                        <p className="text-cyan-900 dark:text-cyan-100 font-medium mb-2">{data.majorTaskGroup.title}</p>
                        <p className="text-cyan-700 dark:text-cyan-300 text-sm">{data.majorTaskGroup.description}</p>
                        {data.majorTaskGroup.tagline && (
                          <p className="text-cyan-600 dark:text-cyan-400 text-xs mt-2 italic">"{data.majorTaskGroup.tagline}"</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Character Arc Guidance */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <CharacterArcGuidance characterGuidance={data?.characterGuidance || []} />
              </div>

              {/* Books Influenced By */}
              {chapter.booksInfluencedBy && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <BookOpenIcon className="w-6 h-6 mr-2 text-amber-600 dark:text-amber-400" />
                    Literary Influences
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(chapter.booksInfluencedBy).map(([key, book]) => (
                      <div key={key} className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4">
                        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                          {book.title}
                        </h3>
                        <p className="text-amber-700 dark:text-amber-300 text-sm mb-2">
                          by {book.author}
                        </p>
                        {book.section_of_focus && (
                          <p className="text-amber-600 dark:text-amber-400 text-xs">
                            Focus: {book.section_of_focus}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'write' && (
            <div className="space-y-6">
              {!permissions.canWrite && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Writing Access Required</h3>
                  <p className="text-yellow-700 dark:text-yellow-300">You need admin access or a paid membership to edit chapters.</p>
                </div>
              )}

              {permissions.canWrite && (
                <>
                  {/* Writing Tools */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
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
                        <button
                          onClick={fetchAiPrompts}
                          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                        >
                          <LightBulbIcon className="w-4 h-4" />
                          <span>AI Prompts</span>
                        </button>
                        <button
                          onClick={addNewPage}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                          <span>Add Page</span>
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
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${getOverallProgress(pages)}%` }}
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
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Pages</h3>
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
                              setData(prev => prev ? {
                                ...prev,
                                pages: prev.pages.map(p => 
                                  p.id === currentPageData.id ? { ...p, content } : p
                                )
                              } : null);
                              
                              // Check for auto-continuation
                              checkForAutoContinuation(content, currentPage);
                            }}
                            onSave={() => savePage(currentPageData.id, currentPageData.content)}
                          />
                        </div>
                        
                        {/* Page Goal Information */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
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
                        </div>
                      </div>
                    )}

                    {pages.length === 0 && (
                      <div className="text-center py-12">
                        <BookOpenIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-300 mb-4">No pages created yet</p>
                        <button
                          onClick={addNewPage}
                          className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                        >
                          Create First Page
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* AI Prompts Modal */}
              {showPrompts && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl max-h-[80vh] overflow-y-auto">
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
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Chapter Scenes</h2>
              {scenes.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                  <BookOpenIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">No scenes have been created for this chapter yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {scenes.map((scene) => (
                    <div key={scene.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                            Scene {scene.sceneNumber}: {scene.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{scene.description}</p>
                        </div>
                        {scene.pages && (
                          <div className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200">
                            {scene.pages} pages
                          </div>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        {scene.focus && (
                          <div>
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Focus</h4>
                            <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded px-2 py-1">{scene.focus}</p>
                          </div>
                        )}
                        {scene.heroJourneyStage && (
                          <div>
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Hero's Journey</h4>
                            <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded px-2 py-1">{scene.heroJourneyStage}</p>
                          </div>
                        )}
                        {scene.primaryTarotCard && (
                          <div>
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Primary Tarot Card</h4>
                            <p className="text-gray-600 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/30 rounded px-2 py-1">{scene.primaryTarotCard}</p>
                          </div>
                        )}
                        {scene.historicalDate && (
                          <div>
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Historical Date</h4>
                            <p className="text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/30 rounded px-2 py-1">{scene.historicalDate}</p>
                          </div>
                        )}
                      </div>
                      
                      {scene.tarotSymbolism && (
                        <div className="mt-3 pt-3 border-t dark:border-gray-700">
                          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Tarot Symbolism</h4>
                          <p className="text-gray-600 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/30 rounded px-2 py-1 text-sm">{scene.tarotSymbolism}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Task Groups</h2>
              
              {taskGroups.major.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Major Task Groups</h3>
                  <div className="grid gap-4">
                    {taskGroups.major.map((taskGroup) => (
                      <div key={taskGroup.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 dark:border-blue-400">
                        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{taskGroup.title}</h4>
                        {taskGroup.tagline && (
                          <p className="text-blue-700 dark:text-blue-300 font-medium mb-2 italic">"{taskGroup.tagline}"</p>
                        )}
                        <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">{taskGroup.description}</p>
                        
                        {taskGroup.focusArea && (
                          <div className="mb-2">
                            <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-1 text-sm">Focus Area</h5>
                            <p className="text-gray-600 dark:text-gray-300 bg-white/60 dark:bg-gray-800/60 rounded px-2 py-1 text-sm">{taskGroup.focusArea}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {taskGroups.specific.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Specific Task Groups</h3>
                  <div className="grid gap-4">
                    {taskGroups.specific.map((taskGroup) => (
                      <div key={taskGroup.id} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-6 border-l-4 border-green-500 dark:border-green-400">
                        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{taskGroup.title}</h4>
                        {taskGroup.tagline && (
                          <p className="text-green-700 dark:text-green-300 font-medium mb-2 italic">"{taskGroup.tagline}"</p>
                        )}
                        <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">{taskGroup.description}</p>
                        
                        {taskGroup.focusArea && (
                          <div className="mb-2">
                            <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-1 text-sm">Focus Area</h5>
                            <p className="text-gray-600 dark:text-gray-300 bg-white/60 dark:bg-gray-800/60 rounded px-2 py-1 text-sm">{taskGroup.focusArea}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {taskGroups.major.length === 0 && taskGroups.specific.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                  <AcademicCapIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">No task groups have been created for this chapter yet.</p>
                </div>
              )}
            </div>
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