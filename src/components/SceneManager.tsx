'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, PencilIcon, TrashIcon, UserIcon, BookOpenIcon, ClockIcon, EyeIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Scene {
  id: string;
  chapterId: string;
  sceneNumber: number;
  title: string;
  focus: string;
  description: string;
  setup?: string;
  sensoryDetail?: string;
  internalConflict?: string;
  beatGoal?: string;
  preliminarySceneFocus?: string;
  preliminarySceneDescription?: string;
  tarotSymbolism?: string;
  heroJourneyStage?: string;
  pages?: string;
  primaryTarotCard?: string;
  secondaryTarotCards?: string[];
  tarotCardId?: string;
  tarotNarrativeRole?: string;
  franciscoTarotConnection?: string;
  laSignoraTarotConnection?: string;
  dagonTarotConnection?: string;
  temporalPowerManifested?: string;
  characterGrowthElement?: string;
  sceneCardProgression?: number;
  cardReversalSignificance?: string;
  historicalDate?: string;
  storyTimelineDate?: string;
  historicalEventIds?: string[];
  temporalDivergencePoint?: string;
  realWorldContext?: string;
  alternateTimelineVariant?: string;
  chronologicalSequence?: number;
  storySequence?: number;
  timelineSignificance?: string;
  timeline_date?: string;
  timeline_variant?: string;
  location?: string;
  pov?: string;
  tense?: string;
  core_emotion?: string;
  scene_tone?: string;
  symbolism?: string;
  createdAt: string;
  updatedAt: string;
}

interface Character {
  id: string;
  name: string;
  characterType: string;
  role?: string;
  pronouns?: string;
}

interface SceneManagerProps {
  chapterId: string;
  chapterColorHex: string;
}

const POV_STYLES = [
  { value: 'first_person', label: 'First Person (I/me)' },
  { value: 'second_person', label: 'Second Person (You)' },
  { value: 'third_person_limited', label: 'Third Person Limited' },
  { value: 'third_person_omniscient', label: 'Third Person Omniscient' },
  { value: 'third_person_objective', label: 'Third Person Objective' },
];

const TENSE_OPTIONS = [
  { value: 'past', label: 'Past Tense' },
  { value: 'present', label: 'Present Tense' },
  { value: 'future', label: 'Future Tense' },
];

const HERO_JOURNEY_STAGES = [
  { value: 'ordinary_world', label: 'Ordinary World' },
  { value: 'call_to_adventure', label: 'Call to Adventure' },
  { value: 'refusal_of_call', label: 'Refusal of the Call' },
  { value: 'meeting_mentor', label: 'Meeting the Mentor' },
  { value: 'crossing_threshold', label: 'Crossing the Threshold' },
  { value: 'tests_allies_enemies', label: 'Tests, Allies, and Enemies' },
  { value: 'approach_inmost_cave', label: 'Approach to the Inmost Cave' },
  { value: 'ordeal', label: 'The Ordeal' },
  { value: 'reward', label: 'Reward (Seizing the Sword)' },
  { value: 'road_back', label: 'The Road Back' },
  { value: 'resurrection', label: 'Resurrection' },
  { value: 'return_elixir', label: 'Return with the Elixir' },
];

export default function SceneManager({ chapterId }: SceneManagerProps) {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [povStyle, setPovStyle] = useState('third_person_limited');
  const [tense, setTense] = useState('past');
  const [formData, setFormData] = useState({
    title: '',
    focus: '',
    description: '',
    setup: '',
    sensoryDetail: '',
    internalConflict: '',
    beatGoal: '',
    preliminarySceneFocus: '',
    preliminarySceneDescription: '',
    tarotSymbolism: '',
    heroJourneyStage: '',
    pages: '',
    primaryTarotCard: '',
    tarotNarrativeRole: '',
    franciscoTarotConnection: '',
    laSignoraTarotConnection: '',
    dagonTarotConnection: '',
    temporalPowerManifested: '',
    characterGrowthElement: '',
    historicalDate: '',
    storyTimelineDate: '',
    realWorldContext: '',
    timelineSignificance: '',
    timeline_date: '1/10/1320',
    timeline_variant: 'Prime Timeline',
    location: 'Bologna City Square, Italy',
    pov: '3rd Person Limited',
    tense: 'Past Tense',
    core_emotion: 'Tension and conflict',
    scene_tone: 'Dramatic and intense',
  });

  const fetchScenes = useCallback(async () => {
    try {
      console.log(`[SceneManager] Fetching scenes for chapter: ${chapterId}`);
      const response = await fetch(`/api/chapters/${chapterId}/scenes`);
      if (response.ok) {
        const data = await response.json();
        console.log(`[SceneManager] Received ${data.scenes?.length || 0} scenes from API`);
        if (data.scenes && data.scenes.length > 0) {
          console.log(`[SceneManager] Scene IDs:`, data.scenes.map((s: Scene) => ({ id: s.id, number: s.sceneNumber, title: s.title })));
        }
        setScenes(data.scenes);
      } else {
        console.error(`[SceneManager] Failed to fetch scenes. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('[SceneManager] Failed to fetch scenes:', error);
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    fetchScenes();
    fetchCharacters();
  }, [chapterId, fetchScenes]);

  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/characters');
      if (response.ok) {
        const data = await response.json();
        setCharacters(data.characters || data);
      }
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    }
  };

  const handleAddScene = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/chapters/${chapterId}/scenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          povCharacter: selectedCharacter,
          povStyle,
          tense,
        }),
      });

      if (response.ok) {
        const newScene = await response.json();
        setScenes([...scenes, newScene]);
        setShowAddForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to add scene:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      focus: '',
      description: '',
      setup: '',
      sensoryDetail: '',
      internalConflict: '',
      beatGoal: '',
      preliminarySceneFocus: '',
      preliminarySceneDescription: '',
      tarotSymbolism: '',
      heroJourneyStage: '',
      pages: '',
      primaryTarotCard: '',
      tarotNarrativeRole: '',
      franciscoTarotConnection: '',
      laSignoraTarotConnection: '',
      dagonTarotConnection: '',
      temporalPowerManifested: '',
      characterGrowthElement: '',
      historicalDate: '',
      storyTimelineDate: '',
      realWorldContext: '',
      timelineSignificance: '',
      timeline_date: '1/10/1320',
      timeline_variant: 'Prime Timeline',
      location: 'Bologna City Square, Italy',
      pov: '3rd Person Limited',
      tense: 'Past Tense',
      core_emotion: 'Tension and conflict',
      scene_tone: 'Dramatic and intense',
    });
    setSelectedCharacter('');
    setPovStyle('third_person_limited');
    setTense('past');
  };

  // Removed unused getCharacterName function

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpenIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Scenes</h3>
          <span className="px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 rounded-full">
            {scenes.length} scenes
          </span>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Scene
        </button>
      </div>

      {/* Add Scene Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
          <form onSubmit={handleAddScene} className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add New Scene</h4>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scene Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter scene title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Focus
                </label>
                <input
                  type="text"
                  value={formData.focus}
                  onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Scene focus"
                />
              </div>
            </div>

            {/* POV and Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <UserIcon className="w-4 h-4 inline mr-1" />
                  POV Character
                </label>
                <select
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select character</option>
                  {characters.map((character) => (
                    <option key={character.id} value={character.id}>
                      {character.name} ({character.characterType})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  POV Style
                </label>
                <select
                  value={povStyle}
                  onChange={(e) => setPovStyle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {POV_STYLES.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <ClockIcon className="w-4 h-4 inline mr-1" />
                  Tense
                </label>
                <select
                  value={tense}
                  onChange={(e) => setTense(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {TENSE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Describe what happens in this scene"
              />
            </div>

            {/* Scene Structure Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Setup
                </label>
                <textarea
                  value={formData.setup}
                  onChange={(e) => setFormData({ ...formData, setup: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Scene setup and initial situation..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sensory Detail
                </label>
                <textarea
                  value={formData.sensoryDetail}
                  onChange={(e) => setFormData({ ...formData, sensoryDetail: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Key sensory details that bring the scene to life..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Internal Conflict
                </label>
                <textarea
                  value={formData.internalConflict}
                  onChange={(e) => setFormData({ ...formData, internalConflict: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Character's internal struggle or emotional conflict..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Beat Goal
                </label>
                <textarea
                  value={formData.beatGoal}
                  onChange={(e) => setFormData({ ...formData, beatGoal: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="What this scene beat should accomplish..."
                />
              </div>
            </div>

            {/* Hero's Journey Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hero&apos;s Journey Stage
                </label>
                <select
                  value={formData.heroJourneyStage}
                  onChange={(e) => setFormData({ ...formData, heroJourneyStage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select stage</option>
                  {HERO_JOURNEY_STAGES.map((stage) => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Tarot Card
                </label>
                <input
                  type="text"
                  value={formData.primaryTarotCard}
                  onChange={(e) => setFormData({ ...formData, primaryTarotCard: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., The Fool, Death, etc."
                />
              </div>
            </div>

            {/* Timeline Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <ClockIcon className="w-4 h-4 inline mr-1" />
                  Timeline Date
                </label>
                <input
                  type="text"
                  value={formData.timeline_date}
                  onChange={(e) => setFormData({ ...formData, timeline_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., 1/10/1320"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timeline Variant
                </label>
                <select
                  value={formData.timeline_variant}
                  onChange={(e) => setFormData({ ...formData, timeline_variant: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select timeline variant</option>
                  <option value="Prime Timeline">Prime Timeline</option>
                  <option value="Timeline Fracture">Timeline Fracture</option>
                  <option value="Divergence Point Alpha">Divergence Point Alpha</option>
                  <option value="Pangea Insertion">Pangea Insertion</option>
                  <option value="Convergence Point">Convergence Point</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📍 Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., Bologna City Square, Italy"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors"
              >
                {isSubmitting ? 'Adding...' : 'Add Scene'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scenes List */}
      <div className="space-y-6">
        {scenes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No scenes yet. Add your first scene to get started.</p>
          </div>
        ) : (
          scenes.map((scene) => (
            <div
              key={scene.id}
              className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-2xl transition-all duration-200 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer group overflow-hidden"
              onClick={() => router.push(`/scenes/${scene.id}`)}
            >
              {/* Header Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-200 dark:bg-indigo-900 rounded-full">
                        Scene {scene.sceneNumber}
                      </span>
                      {scene.heroJourneyStage && (
                        <span className="px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900 rounded-full">
                          🗺️ {HERO_JOURNEY_STAGES.find(s => s.value === scene.heroJourneyStage)?.label || scene.heroJourneyStage}
                        </span>
                      )}
                      {scene.primaryTarotCard && (
                        <span className="px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900 rounded-full">
                          🃏 {scene.primaryTarotCard}
                        </span>
                      )}
                      {scene.timeline_variant && (
                        <span className="px-3 py-1 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900 rounded-full">
                          ⏰ {scene.timeline_variant}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {scene.title}
                    </h4>
                    {(scene.timeline_date || scene.location) && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {scene.timeline_date && (
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {scene.timeline_date}
                          </span>
                        )}
                        {scene.location && (
                          <span className="flex items-center gap-1">
                            📍 {scene.location}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/scenes/${scene.id}`);
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                      title="View details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50"
                      title="Edit scene"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50"
                      title="Delete scene"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="p-5 space-y-4">
                {/* POV and Writing Details */}
                {(scene.pov || scene.tense || scene.core_emotion) && (
                  <div className="flex flex-wrap gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                    {scene.pov && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{scene.pov}</span>
                      </div>
                    )}
                    {scene.tense && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">📖 {scene.tense}</span>
                      </div>
                    )}
                    {scene.core_emotion && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                        <span className="text-xs font-medium text-pink-700 dark:text-pink-300">💭 {scene.core_emotion}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Scene Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {scene.setup && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                      <h5 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                        <BookOpenIcon className="w-4 h-4 mr-1.5" />
                        SETUP
                      </h5>
                      <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed line-clamp-3">
                        {scene.setup}
                      </p>
                    </div>
                  )}
                  
                  {scene.beatGoal && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-500">
                      <h5 className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-2 flex items-center">
                        <SparklesIcon className="w-4 h-4 mr-1.5" />
                        BEAT GOAL
                      </h5>
                      <p className="text-sm text-purple-900 dark:text-purple-100 leading-relaxed line-clamp-3">
                        {scene.beatGoal}
                      </p>
                    </div>
                  )}

                  {scene.symbolism && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border-l-4 border-emerald-500 lg:col-span-2">
                      <h5 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center">
                        <SparklesIcon className="w-4 h-4 mr-1.5" />
                        SYMBOLISM
                      </h5>
                      <p className="text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed line-clamp-3">
                        {scene.symbolism}
                      </p>
                    </div>
                  )}

                  {scene.preliminarySceneDescription && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border-l-4 border-amber-500 lg:col-span-2">
                      <h5 className="text-sm font-bold text-amber-700 dark:text-amber-300 mb-2 flex items-center">
                        📋 PRELIMINARY SCENE DESCRIPTION
                      </h5>
                      <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed line-clamp-3">
                        {scene.preliminarySceneDescription}
                      </p>
                    </div>
                  )}

                  {scene.scene_tone && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border-l-4 border-indigo-500">
                      <h5 className="text-sm font-bold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                        🎭 SCENE TONE
                      </h5>
                      <p className="text-sm text-indigo-900 dark:text-indigo-100 leading-relaxed">
                        {scene.scene_tone}
                      </p>
                    </div>
                  )}

                  {scene.preliminarySceneFocus && (
                    <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4 border-l-4 border-violet-500">
                      <h5 className="text-sm font-bold text-violet-700 dark:text-violet-300 mb-2 flex items-center">
                        🎯 SCENE FOCUS
                      </h5>
                      <p className="text-sm text-violet-900 dark:text-violet-100 leading-relaxed">
                        {scene.preliminarySceneFocus}
                      </p>
                    </div>
                  )}
                </div>

                {/* Click indicator */}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-medium">
                    Click to view full scene details & all metadata →
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}