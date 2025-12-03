'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  DocumentTextIcon,
  BookOpenIcon,
  SparklesIcon,
  CalendarDaysIcon,
  MapPinIcon,
  EyeIcon,
  UserIcon,
  HeartIcon,
  CheckCircleIcon,
  StarIcon,
  BeakerIcon,
  FireIcon,
  TrophyIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

interface LearningResource {
  id: string;
  resourceId: string;
  title: string;
  author?: string;
  connectionPoints: Array<{
    pointNumber: number;
    description: string;
  }>;
  objectives: Array<{
    objectiveNumber: number;
    description: string;
    bloomLevel?: string;
  }>;
}

interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  focus?: string;
  preliminarySceneFocus?: string;
  preliminarySceneDescription?: string;
  description?: string;
  setup?: string;
  sensoryDetail?: string;
  internalConflict?: string;
  beatGoal?: string;
  tarotSymbolism?: string;
  heroJourneyStage?: string;
  pages?: string;
  symbolism?: string;
  primaryTarotCard?: string;
  secondaryTarotCards?: unknown;
  tarotCardId?: string | null;
  tarotNarrativeRole?: string;
  franciscoTarotConnection?: string;
  laSignoraTarotConnection?: string;
  dagonTarotConnection?: string;
  temporalPowerManifested?: string;
  characterGrowthElement?: string;
  sceneCardProgression?: number | null;
  cardReversalSignificance?: string;
  historicalDate?: string;
  storyTimelineDate?: string;
  historicalEventIds?: unknown;
  temporalDivergencePoint?: string;
  realWorldContext?: string;
  alternateTimelineVariant?: string;
  chronologicalSequence?: number | null;
  storySequence?: number | null;
  timelineSignificance?: string;
  timeline_date?: string;
  timeline_variant?: string;
  location?: string;
  pov?: string;
  tense?: string;
  core_emotion?: string;
  scene_tone?: string;
}

interface Chapter {
  id: string;
  title?: string | null;
  chapterNumber: number;
  description?: string | null;
  summary?: string | null;
  focus?: string | null;
  focusArea?: string | null;
  epicNovelPages?: string | null;
  epicChapterFocus?: string | null;
  epicNovelChapterFocus?: string | null;
  epicNovelSectionName?: string | null;
  epicPreliminarySceneFocus?: string | null;
  epicPreliminarySceneDescription?: string | null;
  tarotCardItem?: string | null;
  connectionToMajorTaskGroup?: string | null;
  specificTaskGroupDescription?: string | null;
  specificTaskGroupTagline?: string | null;
  specificTaskGroupBooksInfluencedBy?: string[] | null;
  pov?: string | null;
  tense?: string | null;
  coreEmotion?: string | null;
  sceneTone?: string | null;
  colorName?: string | null;
  hexCode?: string | null;
  red?: number | null;
  green?: number | null;
  blue?: number | null;
  type?: string | null;
  newTarotFamily?: string | null;
  colorTheme: {
    name: string;
    hex: string;
    rgb: { red: number; green: number; blue: number };
  };
  tarotFamily?: string | null;
  tarotCardLink?: string | null;
  terminalLearningObjectives?: Record<string, unknown>;
  // Story structure fields
  sceneNumber?: number | null;
  heroJourneyBeat?: string | null;
  heroJourneyBeatObjective?: string | null;
  plotBeat?: string | null;
  saveTheCatBeat?: string | null;
  saveTheCatBeatGoal?: string | null;
  // JSON metadata fields
  characterArcs?: Record<string, unknown> | null;
  storyGapsAddressed?: Record<string, unknown> | null;
  locationDetails?: Record<string, unknown> | null;
  seriesConnections?: Record<string, unknown> | null;
  // Relationship identifiers
  taskMasterKey?: string | null;
  majorTaskGroupKey?: string | null;
  specificTaskGroupKey?: string | null;
  // Learning system data
  learningResources?: LearningResource[];
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

type ChapterEdit = Partial<
  Omit<Chapter, 'scenes' | 'colorTheme'>
>;

type SceneEdit = Partial<Scene>;

const SceneCard = ({
  scene,
  onSaveScene,
  saving,
}: {
  scene: Scene;
  onSaveScene: (sceneId: string, data: SceneEdit) => Promise<void>;
  saving?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<SceneEdit>(scene);
  const [secondaryTarotText, setSecondaryTarotText] = useState(() => {
    if (scene.secondaryTarotCards === undefined || scene.secondaryTarotCards === null) return '';
    if (typeof scene.secondaryTarotCards === 'string') return scene.secondaryTarotCards;
    try {
      return JSON.stringify(scene.secondaryTarotCards, null, 2);
    } catch {
      return '';
    }
  });
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setForm(scene);
    if (scene.secondaryTarotCards === undefined || scene.secondaryTarotCards === null) {
      setSecondaryTarotText('');
    } else if (typeof scene.secondaryTarotCards === 'string') {
      setSecondaryTarotText(scene.secondaryTarotCards);
    } else {
      try {
        setSecondaryTarotText(JSON.stringify(scene.secondaryTarotCards, null, 2));
      } catch {
        setSecondaryTarotText('');
      }
    }
  }, [scene]);

  const updateField = (field: keyof SceneEdit, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const parseSecondaryTarot = () => {
    if (!secondaryTarotText.trim()) return undefined;
    try {
      return JSON.parse(secondaryTarotText);
    } catch {
      // fallback to comma separated list
      return secondaryTarotText.split(',').map(item => item.trim()).filter(Boolean);
    }
  };

  const handleSave = async () => {
    setLocalError(null);
    try {
      await onSaveScene(scene.id, {
        ...form,
        secondaryTarotCards: parseSecondaryTarot(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save scene', error);
      setLocalError('Unable to save scene. Please try again.');
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div
        className="flex items-start justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3 flex-1">
          <div className="pt-1">
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-medium text-gray-900 dark:text-gray-100">
              Scene {scene.sceneNumber}: {scene.title || 'Untitled Scene'}
            </h5>
            {!isExpanded && (
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                {scene.timeline_date && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    {scene.timeline_date}
                  </span>
                )}
                {scene.location && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    {scene.location}
                  </span>
                )}
                {scene.pov && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    {scene.pov}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
          >
            {isEditing ? 'Close' : 'Edit'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {scene.setup && !isEditing && (
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {scene.setup}
            </p>
          )}

          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            {scene.description && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Description:</span> {scene.description}
              </p>
            )}
            {scene.beatGoal && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Beat Goal:</span> {scene.beatGoal}
              </p>
            )}
            {scene.heroJourneyStage && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Hero&apos;s Journey:</span> {scene.heroJourneyStage}
              </p>
            )}
            {scene.temporalDivergencePoint && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Temporal Divergence:</span> {scene.temporalDivergencePoint}
              </p>
            )}
          </div>
          <div className="space-y-1">
            {scene.timelineSignificance && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Timeline Significance:</span> {scene.timelineSignificance}
              </p>
            )}
            {scene.tarotSymbolism && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Tarot:</span> {scene.tarotSymbolism}
              </p>
            )}
            {scene.primaryTarotCard && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Primary Card:</span> {scene.primaryTarotCard}
              </p>
            )}
            {scene.scene_tone && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Tone:</span> {scene.scene_tone}
              </p>
            )}
            {(scene.storySequence || scene.chronologicalSequence) && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Sequence:</span>{' '}
                {scene.storySequence ? `Story ${scene.storySequence}` : ''} {scene.storySequence && scene.chronologicalSequence ? '•' : ''}
                {scene.chronologicalSequence ? `Chronology ${scene.chronologicalSequence}` : ''}
              </p>
            )}
            {scene.temporalPowerManifested && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Temporal Power:</span> {scene.temporalPowerManifested}
              </p>
            )}
            {scene.characterGrowthElement && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Growth:</span> {scene.characterGrowthElement}
              </p>
            )}
            {scene.alternateTimelineVariant && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Alt Timeline:</span> {scene.alternateTimelineVariant}
              </p>
            )}
          </div>
        </div>
      )}

      {isEditing && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Title"
            />
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.focus || ''}
              onChange={(e) => updateField('focus', e.target.value)}
              placeholder="Focus"
            />
          </div>
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
            rows={2}
            value={form.setup || ''}
            onChange={(e) => updateField('setup', e.target.value)}
            placeholder="Setup"
          />
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
            rows={3}
            value={form.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Description"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.beatGoal || ''}
              onChange={(e) => updateField('beatGoal', e.target.value)}
              placeholder="Beat Goal"
            />
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.heroJourneyStage || ''}
              onChange={(e) => updateField('heroJourneyStage', e.target.value)}
              placeholder="Hero's Journey Stage"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.timeline_date || ''}
              onChange={(e) => updateField('timeline_date', e.target.value)}
              placeholder="Timeline Date"
            />
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.timeline_variant || ''}
              onChange={(e) => updateField('timeline_variant', e.target.value)}
              placeholder="Timeline Variant"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.location || ''}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="Location"
            />
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.pov || ''}
              onChange={(e) => updateField('pov', e.target.value)}
              placeholder="POV"
            />
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.tense || ''}
              onChange={(e) => updateField('tense', e.target.value)}
              placeholder="Tense"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.core_emotion || ''}
              onChange={(e) => updateField('core_emotion', e.target.value)}
              placeholder="Core Emotion"
            />
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.scene_tone || ''}
              onChange={(e) => updateField('scene_tone', e.target.value)}
              placeholder="Scene Tone"
            />
          </div>
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
            rows={2}
            value={form.timelineSignificance || ''}
            onChange={(e) => updateField('timelineSignificance', e.target.value)}
            placeholder="Timeline Significance"
          />
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
            rows={2}
            value={form.tarotSymbolism || ''}
            onChange={(e) => updateField('tarotSymbolism', e.target.value)}
            placeholder="Tarot Symbolism"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.primaryTarotCard || ''}
              onChange={(e) => updateField('primaryTarotCard', e.target.value)}
              placeholder="Primary Tarot Card"
            />
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              rows={2}
              value={secondaryTarotText}
              onChange={(e) => setSecondaryTarotText(e.target.value)}
              placeholder="Secondary Tarot Cards (JSON or comma separated)"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.temporalPowerManifested || ''}
              onChange={(e) => updateField('temporalPowerManifested', e.target.value)}
              placeholder="Temporal Power Manifested"
            />
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.characterGrowthElement || ''}
              onChange={(e) => updateField('characterGrowthElement', e.target.value)}
              placeholder="Character Growth Element"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.alternateTimelineVariant || ''}
              onChange={(e) => updateField('alternateTimelineVariant', e.target.value)}
              placeholder="Alternate Timeline Variant"
            />
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.storySequence || ''}
              onChange={(e) => updateField('storySequence', e.target.value)}
              placeholder="Story Sequence"
            />
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              value={form.chronologicalSequence || ''}
              onChange={(e) => updateField('chronologicalSequence', e.target.value)}
              placeholder="Chronological Sequence"
            />
          </div>
          {localError && (
            <p className="text-sm text-red-500">{localError}</p>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {saving ? 'Saving...' : 'Save Scene'}
            </button>
            <button
              onClick={() => {
                setForm(scene);
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ChapterCard = ({ 
  chapter, 
  isExpanded, 
  onToggleExpanded,
  onSaveChapter,
  onSaveScene,
  savingChapterId,
  savingSceneId,
}: { 
  chapter: Chapter; 
  isExpanded: boolean; 
  onToggleExpanded: () => void;
  onSaveChapter: (chapterId: string, data: ChapterEdit) => Promise<void>;
  onSaveScene: (sceneId: string, data: SceneEdit) => Promise<void>;
  savingChapterId?: string | null;
  savingSceneId?: string | null;
}) => {
  const [showScenes, setShowScenes] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showThematicFocus, setShowThematicFocus] = useState(false);
  const [showLearningResources, setShowLearningResources] = useState(false);
  const [chapterForm, setChapterForm] = useState<ChapterEdit>({
    title: chapter.title || '',
    summary: chapter.summary || '',
    description: chapter.description || '',
    focus: chapter.focus || '',
    focusArea: chapter.focusArea || '',
    epicNovelPages: chapter.epicNovelPages || '',
    epicChapterFocus: chapter.epicChapterFocus || '',
    epicNovelChapterFocus: chapter.epicNovelChapterFocus || '',
    epicNovelSectionName: chapter.epicNovelSectionName || '',
    tarotCardLink: chapter.tarotCardLink || '',
    tarotFamily: chapter.tarotFamily || '',
    tarotCardItem: chapter.tarotCardItem || '',
    connectionToMajorTaskGroup: chapter.connectionToMajorTaskGroup || '',
    specificTaskGroupDescription: chapter.specificTaskGroupDescription || '',
    specificTaskGroupTagline: chapter.specificTaskGroupTagline || '',
    specificTaskGroupBooksInfluencedBy: chapter.specificTaskGroupBooksInfluencedBy || [],
    pov: chapter.pov || '',
    tense: chapter.tense || '',
    coreEmotion: chapter.coreEmotion || '',
    sceneTone: chapter.sceneTone || '',
    colorName: chapter.colorName || chapter.colorTheme?.name,
    hexCode: chapter.hexCode || chapter.colorTheme?.hex,
    red: chapter.red ?? chapter.colorTheme?.rgb?.red,
    green: chapter.green ?? chapter.colorTheme?.rgb?.green,
    blue: chapter.blue ?? chapter.colorTheme?.rgb?.blue,
  });
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setChapterForm({
      title: chapter.title || '',
      summary: chapter.summary || '',
      description: chapter.description || '',
      focus: chapter.focus || '',
      focusArea: chapter.focusArea || '',
      epicNovelPages: chapter.epicNovelPages || '',
      epicChapterFocus: chapter.epicChapterFocus || '',
      epicNovelChapterFocus: chapter.epicNovelChapterFocus || '',
      epicNovelSectionName: chapter.epicNovelSectionName || '',
      tarotCardLink: chapter.tarotCardLink || '',
      tarotFamily: chapter.tarotFamily || '',
      tarotCardItem: chapter.tarotCardItem || '',
      connectionToMajorTaskGroup: chapter.connectionToMajorTaskGroup || '',
      specificTaskGroupDescription: chapter.specificTaskGroupDescription || '',
      specificTaskGroupTagline: chapter.specificTaskGroupTagline || '',
      specificTaskGroupBooksInfluencedBy: chapter.specificTaskGroupBooksInfluencedBy || [],
      pov: chapter.pov || '',
      tense: chapter.tense || '',
      coreEmotion: chapter.coreEmotion || '',
      sceneTone: chapter.sceneTone || '',
      colorName: chapter.colorName || chapter.colorTheme?.name,
      hexCode: chapter.hexCode || chapter.colorTheme?.hex,
      red: chapter.red ?? chapter.colorTheme?.rgb?.red,
      green: chapter.green ?? chapter.colorTheme?.rgb?.green,
      blue: chapter.blue ?? chapter.colorTheme?.rgb?.blue,
    });
  }, [chapter]);

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

  const handleFieldChange = (field: keyof ChapterEdit, value: string | number | string[]) => {
    setChapterForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChapter = async () => {
    setLocalError(null);
    try {
      await onSaveChapter(chapter.id, chapterForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save chapter', error);
      setLocalError('Unable to save chapter. Please try again.');
    }
  };

  const phase = getStoryPhase(chapter.chapterNumber);
  const isComplete = chapter.title && chapter.summary && chapter.scenes.length > 0;
  const savingChapter = savingChapterId === chapter.id;

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
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                {chapter.title || `Chapter ${chapter.chapterNumber}`}
              </h3>

              {/* Enhanced Metadata Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {chapter.focusArea && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                    <SparklesIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 truncate">{chapter.focusArea}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                  <DocumentTextIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">{chapter.scenes.length} scenes</span>
                </div>
                {chapter.tarotFamily && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900">
                    <StarIcon className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-pink-700 dark:text-pink-300 truncate">{chapter.tarotFamily}</span>
                  </div>
                )}
                {chapter.epicNovelPages && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900">
                    <BookOpenIcon className="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-green-700 dark:text-green-300 truncate">{chapter.epicNovelPages}</span>
                  </div>
                )}
              </div>

              {/* Scene Overview - Narrative Hook */}
              {chapter.epicPreliminarySceneDescription && (
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2 italic border-l-4 border-indigo-500 dark:border-indigo-400 pl-3 py-2">
                  "{chapter.epicPreliminarySceneDescription}"
                </p>
              )}
              {!chapter.epicPreliminarySceneDescription && chapter.summary && (
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">
                  {chapter.summary}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
                setShowScenes(false);
              }}
              className="px-3 py-2 rounded-lg bg-white/60 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
            >
              {isEditing ? 'Close Edit' : 'Edit'}
            </button>
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
          {isEditing && (
            <div className="space-y-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Title"
                />
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.focus || ''}
                  onChange={(e) => handleFieldChange('focus', e.target.value)}
                  placeholder="Focus"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.focusArea || ''}
                  onChange={(e) => handleFieldChange('focusArea', e.target.value)}
                  placeholder="Focus Area"
                />
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.epicNovelPages || ''}
                  onChange={(e) => handleFieldChange('epicNovelPages', e.target.value)}
                  placeholder="Epic Novel Pages"
                />
              </div>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                rows={3}
                value={chapterForm.summary || ''}
                onChange={(e) => handleFieldChange('summary', e.target.value)}
                placeholder="Summary"
              />
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                rows={3}
                value={chapterForm.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Description"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.epicNovelChapterFocus || ''}
                  onChange={(e) => handleFieldChange('epicNovelChapterFocus', e.target.value)}
                  placeholder="Novel Chapter Focus"
                />
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.epicNovelSectionName || ''}
                  onChange={(e) => handleFieldChange('epicNovelSectionName', e.target.value)}
                  placeholder="Section Name"
                />
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.connectionToMajorTaskGroup || ''}
                  onChange={(e) => handleFieldChange('connectionToMajorTaskGroup', e.target.value)}
                  placeholder="Major Task Connection"
                />
              </div>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                value={chapterForm.specificTaskGroupTagline || ''}
                onChange={(e) => handleFieldChange('specificTaskGroupTagline', e.target.value)}
                placeholder="Tagline"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.pov || ''}
                  onChange={(e) => handleFieldChange('pov', e.target.value)}
                  placeholder="POV"
                />
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.tense || ''}
                  onChange={(e) => handleFieldChange('tense', e.target.value)}
                  placeholder="Tense"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.coreEmotion || ''}
                  onChange={(e) => handleFieldChange('coreEmotion', e.target.value)}
                  placeholder="Core Emotion"
                />
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.sceneTone || ''}
                  onChange={(e) => handleFieldChange('sceneTone', e.target.value)}
                  placeholder="Scene Tone"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.tarotFamily || ''}
                  onChange={(e) => handleFieldChange('tarotFamily', e.target.value)}
                  placeholder="Tarot Family"
                />
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.tarotCardLink || ''}
                  onChange={(e) => handleFieldChange('tarotCardLink', e.target.value)}
                  placeholder="Tarot Card Link"
                />
              </div>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                value={chapterForm.tarotCardItem || ''}
                onChange={(e) => handleFieldChange('tarotCardItem', e.target.value)}
                placeholder="Tarot Card Item"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.colorName || ''}
                  onChange={(e) => handleFieldChange('colorName', e.target.value)}
                  placeholder="Color Name"
                />
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.hexCode || ''}
                  onChange={(e) => handleFieldChange('hexCode', e.target.value)}
                  placeholder="Hex Code"
                />
                <input
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                  value={chapterForm.epicChapterFocus || ''}
                  onChange={(e) => handleFieldChange('epicChapterFocus', e.target.value)}
                  placeholder="Epic Chapter Focus"
                />
              </div>
              {localError && (
                <p className="text-sm text-red-500">{localError}</p>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveChapter}
                  disabled={savingChapter}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  {savingChapter ? 'Saving...' : 'Save Chapter'}
                </button>
                <button
                  onClick={() => {
                    setChapterForm({
                      title: chapter.title || '',
                      summary: chapter.summary || '',
                      description: chapter.description || '',
                      focus: chapter.focus || '',
                      focusArea: chapter.focusArea || '',
                      epicNovelPages: chapter.epicNovelPages || '',
                      epicChapterFocus: chapter.epicChapterFocus || '',
                      epicNovelChapterFocus: chapter.epicNovelChapterFocus || '',
                      epicNovelSectionName: chapter.epicNovelSectionName || '',
                      tarotCardLink: chapter.tarotCardLink || '',
                      tarotFamily: chapter.tarotFamily || '',
                      tarotCardItem: chapter.tarotCardItem || '',
                      connectionToMajorTaskGroup: chapter.connectionToMajorTaskGroup || '',
                      specificTaskGroupDescription: chapter.specificTaskGroupDescription || '',
                      specificTaskGroupTagline: chapter.specificTaskGroupTagline || '',
                      specificTaskGroupBooksInfluencedBy: chapter.specificTaskGroupBooksInfluencedBy || [],
                      pov: chapter.pov || '',
                      tense: chapter.tense || '',
                      coreEmotion: chapter.coreEmotion || '',
                      sceneTone: chapter.sceneTone || '',
                      colorName: chapter.colorName || chapter.colorTheme?.name,
                      hexCode: chapter.hexCode || chapter.colorTheme?.hex,
                      red: chapter.red ?? chapter.colorTheme?.rgb?.red,
                      green: chapter.green ?? chapter.colorTheme?.rgb?.green,
                      blue: chapter.blue ?? chapter.colorTheme?.rgb?.blue,
                    });
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!isEditing && (
            <>
              {chapter.epicPreliminarySceneDescription && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Scene Overview</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {chapter.epicPreliminarySceneDescription}
                  </p>
                </div>
              )}

              {chapter.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {chapter.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Narrative Structure Panel */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/40 dark:to-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpenIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Narrative Structure</h4>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    {chapter.heroJourneyBeat && (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-blue-700 dark:text-blue-300 min-w-fit">Hero's Journey:</span>
                        <span className="text-gray-700 dark:text-gray-300 bg-blue-100/50 dark:bg-blue-950/50 px-2 py-0.5 rounded">{chapter.heroJourneyBeat}</span>
                      </div>
                    )}
                    {chapter.plotBeat && (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-amber-700 dark:text-amber-300 min-w-fit">Plot Beat:</span>
                        <span className="text-gray-700 dark:text-gray-300 bg-amber-100/50 dark:bg-amber-950/50 px-2 py-0.5 rounded">{chapter.plotBeat}</span>
                      </div>
                    )}
                    {chapter.saveTheCatBeat && (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-purple-700 dark:text-purple-300 min-w-fit">Save the Cat:</span>
                        <span className="text-gray-700 dark:text-gray-300 bg-purple-100/50 dark:bg-purple-950/50 px-2 py-0.5 rounded">{chapter.saveTheCatBeat}</span>
                      </div>
                    )}
                    {chapter.epicPreliminarySceneFocus && (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-indigo-700 dark:text-indigo-300 min-w-fit">Scene Focus:</span>
                        <span className="text-gray-700 dark:text-gray-300 bg-indigo-100/50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">{chapter.epicPreliminarySceneFocus}</span>
                      </div>
                    )}
                    {chapter.coreEmotion && (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-rose-700 dark:text-rose-300 min-w-fit">Core Emotion:</span>
                        <span className="text-gray-700 dark:text-gray-300 bg-rose-100/50 dark:bg-rose-950/50 px-2 py-0.5 rounded">{chapter.coreEmotion}</span>
                      </div>
                    )}
                    {chapter.sceneTone && (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-teal-700 dark:text-teal-300 min-w-fit">Tone:</span>
                        <span className="text-gray-700 dark:text-gray-300 bg-teal-100/50 dark:bg-teal-950/50 px-2 py-0.5 rounded">{chapter.sceneTone}</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Tarot & Color Panel */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border border-purple-200 dark:border-purple-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <StarIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Tarot & Essence</h4>
                  </div>
                  <div className="space-y-3">
                    {chapter.tarotFamily && (
                      <div>
                        <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Tarot Family</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{chapter.tarotFamily} {chapter.tarotCardItem ? `- ${chapter.tarotCardItem}` : ''}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{
                      backgroundColor: `${chapter.colorTheme.hex}15`,
                      borderLeft: `4px solid ${chapter.colorTheme.hex}`
                    }}>
                      <div>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Chapter Color</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{chapter.colorTheme.name}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg shadow-md" style={{ backgroundColor: chapter.colorTheme.hex }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Specific Task Group Information */}
          {(chapter.type === 'Specific Task Group' || chapter.specificTaskGroupDescription) && (
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                  <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">Thematic Focus</h4>
                </div>
                <button
                  onClick={() => setShowThematicFocus(prev => !prev)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/80 dark:bg-black/30 border border-indigo-200 dark:border-indigo-700 text-indigo-800 dark:text-indigo-100 hover:bg-white dark:hover:bg-black/50 transition-colors"
                >
                  {showThematicFocus ? 'Hide' : 'Show'} Details
                </button>
              </div>
              {showThematicFocus && (
                <div className="space-y-4 text-sm">
                  {chapter.specificTaskGroupTagline && (
                    <div className="px-4 py-3 bg-white/60 dark:bg-black/20 border-l-4 border-indigo-500 rounded-r-lg">
                      <p className="italic text-gray-800 dark:text-gray-200 font-medium">"{chapter.specificTaskGroupTagline}"</p>
                    </div>
                  )}
                  {chapter.specificTaskGroupDescription && (
                    <div>
                      <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">What This Chapter Explores</span>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">{chapter.specificTaskGroupDescription}</p>
                    </div>
                  )}
                  {chapter.connectionToMajorTaskGroup && (
                    <div>
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">How It Connects</span>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">{chapter.connectionToMajorTaskGroup}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Learning Resources Panel */}
          {chapter.learningResources && chapter.learningResources.length > 0 && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/40 border-2 border-teal-200 dark:border-teal-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h4 className="text-lg font-bold text-teal-900 dark:text-teal-100">Learning Resources & References</h4>
                  <span className="text-xs text-teal-700 dark:text-teal-300 font-semibold">
                    ({chapter.learningResources.length})
                  </span>
                </div>
                <button
                  onClick={() => setShowLearningResources((prev) => !prev)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/80 dark:bg-black/30 border border-teal-200 dark:border-teal-700 text-teal-800 dark:text-teal-200 hover:bg-white dark:hover:bg-black/50 transition-colors"
                >
                  {showLearningResources ? 'Hide' : 'Show'} Details
                </button>
              </div>
              {showLearningResources && (
                <div className="space-y-4">
                  {chapter.learningResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-white/70 dark:bg-black/20 rounded-lg p-4 border-l-4 border-teal-500"
                    >
                      <div className="mb-3">
                        <h5 className="font-bold text-gray-900 dark:text-gray-100">
                          {resource.title}
                        </h5>
                        {resource.author && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            by <span className="font-medium">{resource.author}</span>
                          </p>
                        )}
                      </div>

                      {/* Connection Points */}
                      {resource.connectionPoints && resource.connectionPoints.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider mb-2">
                            Connection Points
                          </p>
                          <ul className="space-y-1.5">
                            {resource.connectionPoints.map((point, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                              >
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-semibold flex-shrink-0 mt-0.5">
                                  {point.pointNumber}
                                </span>
                                <span>{point.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Learning Objectives */}
                      {resource.objectives && resource.objectives.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider mb-2">
                            Learning Objectives
                          </p>
                          <ul className="space-y-1.5">
                            {resource.objectives.map((objective, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                              >
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 text-xs font-semibold flex-shrink-0 mt-0.5">
                                  {objective.objectiveNumber}
                                </span>
                                <div className="flex-1">
                                  <p>{objective.description}</p>
                                  {objective.bloomLevel && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400 italic mt-0.5 inline-block">
                                      ({objective.bloomLevel})
                                    </span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Learning Objectives */}
          {chapter.terminalLearningObjectives && typeof chapter.terminalLearningObjectives === 'object' && Object.keys(chapter.terminalLearningObjectives).length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                Learning Objectives
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="space-y-3">
                  {Object.entries(chapter.terminalLearningObjectives).map(([key, objective]) => (
                    <div key={key} className="flex items-start gap-3 group">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-sm flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                          <CheckCircleIcon className="w-3 h-3 text-transparent group-hover:text-indigo-500 transition-colors" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {typeof objective === 'string' ? (
                            <p>{objective}</p>
                          ) : typeof objective === 'object' && objective !== null ? (
                            <div className="space-y-2">
                              {Object.entries(objective as Record<string, unknown>).map(([subKey, subValue]) => (
                                <div key={subKey}>
                                  {typeof subValue === 'string' && subValue.trim() && (
                                    <p className="mb-1">
                                      <span className="font-medium text-gray-600 dark:text-gray-400 capitalize">
                                        {subKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                      </span>
                                      {' '}{subValue}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p>{String(objective)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    Complete these objectives while reading Chapter {chapter.chapterNumber}
                  </p>
                </div>
              </div>
            </div>
          )}

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
                <SceneCard 
                  key={scene.id}
                  scene={scene}
                  onSaveScene={onSaveScene}
                  saving={savingSceneId === scene.id}
                />
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
  const bookId = params.bookId as string;
  const [outlineData, setOutlineData] = useState<OutlineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [savingChapterId, setSavingChapterId] = useState<string | null>(null);
  const [savingSceneId, setSavingSceneId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchOutlineData = useCallback(async (silent = false) => {
    if (!bookId) return;
    if (!silent) setLoading(true);
    setFetchError(null);
    try {
      const response = await fetch(`/api/books/${bookId}/outline-complete`);
      if (!response.ok) {
        throw new Error(`Failed to load outline (${response.status})`);
      }
      const data = await response.json();
      setOutlineData(data);
    } catch (error) {
      console.error('Failed to fetch outline data:', error);
      setFetchError('Unable to load outline data right now.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchOutlineData();
  }, [fetchOutlineData]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSaveChapter = useCallback(async (chapterId: string, data: ChapterEdit) => {
    setSavingChapterId(chapterId);
    try {
      const response = await fetch(`/api/chapters/${chapterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Failed to save chapter ${chapterId}`);
      }
      await fetchOutlineData(true);
    } catch (error) {
      console.error('Failed to save chapter', error);
      setFetchError('Unable to save chapter changes.');
      throw error;
    } finally {
      setSavingChapterId(null);
    }
  }, [fetchOutlineData]);

  const handleSaveScene = useCallback(async (sceneId: string, data: SceneEdit) => {
    setSavingSceneId(sceneId);
    try {
      const payload: Record<string, unknown> = { ...data };
      ['storySequence', 'chronologicalSequence'].forEach((key) => {
        const value = payload[key];
        if (typeof value === 'string') {
          const trimmed = value.trim();
          payload[key] = trimmed === '' ? undefined : Number(trimmed);
        }
      });
      const response = await fetch(`/api/scenes/${sceneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to save scene ${sceneId}`);
      }
      await fetchOutlineData(true);
    } catch (error) {
      console.error('Failed to save scene', error);
      setFetchError('Unable to save scene changes.');
      throw error;
    } finally {
      setSavingSceneId(null);
    }
  }, [fetchOutlineData]);

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

  const scrollToChapter = (chapterNumber: number) => {
    const element = document.getElementById(`chapter-${chapterNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSelectedChapter(chapterNumber);
      setShowTableOfContents(false);
    }
  };

  const toggleTableOfContents = () => {
    setShowTableOfContents(!showTableOfContents);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (!outlineData && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Outline Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {fetchError || 'We couldn&apos;t load the outline for this book.'}
          </p>
        </div>
      </div>
    );
  }

  if (!outlineData) {
    return null;
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

      {fetchError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 dark:border-red-800/60 dark:bg-red-900/30 dark:text-red-100 px-4 py-3 text-sm">
            {fetchError}
          </div>
        </div>
      )}
      
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
            Francisco&apos;s Epic Journey from Law Student to Master of Two Worlds
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

        {/* Navigation and Controls */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
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
                onClick={toggleTableOfContents}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/70 transition-colors text-sm font-medium"
              >
                <DocumentTextIcon className="w-4 h-4" />
                Table of Contents
              </button>
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

          {/* Table of Contents Overlay */}
          {showTableOfContents && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Table of Contents - {book.title}
                  </h3>
                  <button
                    onClick={toggleTableOfContents}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {chapters.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => scrollToChapter(chapter.chapterNumber)}
                        className={`p-3 text-left rounded-lg border transition-all duration-200 hover:shadow-md ${
                          selectedChapter === chapter.chapterNumber
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            {chapter.chapterNumber}
                          </span>
                          <span className="text-sm font-medium truncate">
                            {chapter.title || `Chapter ${chapter.chapterNumber}`}
                          </span>
                        </div>
                        {chapter.summary && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {chapter.summary}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
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
                <div key={chapter.id} id={`chapter-${chapter.chapterNumber}`}>
                  <ChapterCard
                    chapter={chapter}
                    isExpanded={expandedChapters.has(chapter.id)}
                    onToggleExpanded={() => toggleChapterExpanded(chapter.id)}
                    onSaveChapter={handleSaveChapter}
                    onSaveScene={handleSaveScene}
                    savingChapterId={savingChapterId}
                    savingSceneId={savingSceneId}
                  />
                </div>
              ))}
            </div>

        {/* Epic Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-lg">
            <SparklesIcon className="w-6 h-6 mr-2" />
            Epic Arcana: The Master&apos;s Journey Complete!
            <SparklesIcon className="w-6 h-6 ml-2" />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            From ambitious law student to Master of Two Worlds in {chapters.length} epic chapters
          </p>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            title="Back to Top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
