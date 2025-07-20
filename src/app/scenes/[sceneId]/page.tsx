'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, BookOpenIcon, SparklesIcon, ClockIcon, EyeIcon, CalendarIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';

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
  beat_goal?: string;
  symbolism?: string;
  preliminarySceneFocus?: string;
  preliminarySceneDescription?: string;
  tarotSymbolism?: string;
  heroJourneyStage?: string;
  pages?: string;
  primaryTarotCard?: string;
  secondaryTarotCards?: any;
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
  historicalEventIds?: any;
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
  createdAt: string;
  updatedAt: string;
}

interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  pov?: string;
  tense?: string;
  coreEmotion?: string;
  sceneTone?: string;
}

interface Book {
  id: string;
  title: string;
  bookNumber: number;
}

export default function SceneDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sceneId = params.sceneId as string;
  
  const [scene, setScene] = useState<Scene | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScene, setEditedScene] = useState<Scene | null>(null);
  const [editedChapter, setEditedChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    if (!sceneId) return;
    fetchSceneData();
  }, [sceneId]);

  const fetchSceneData = async () => {
    try {
      const response = await fetch(`/api/scenes/${sceneId}`);
      if (response.ok) {
        const data = await response.json();
        setScene(data.scene);
        setChapter(data.chapter);
        setBook(data.book);
        setEditedScene(data.scene);
        setEditedChapter(data.chapter);
      }
    } catch (error) {
      console.error('Failed to fetch scene data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSceneInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedScene) return;
    const { name, value } = e.target;
    setEditedScene({ ...editedScene, [name]: value });
  };

  const handleChapterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedChapter) return;
    const { name, value } = e.target;
    setEditedChapter({ ...editedChapter, [name]: value });
  };

  const handleUpdate = async () => {
    if (!editedScene || !editedChapter) return;
    try {
      // Update Scene
      const sceneResponse = await fetch(`/api/scenes/${sceneId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedScene),
      });
      if (sceneResponse.ok) {
        const updatedScene = await sceneResponse.json();
        setScene(updatedScene);
        setEditedScene(updatedScene);
      } else {
        throw new Error('Failed to update scene');
      }

      // Update Chapter
      const chapterResponse = await fetch(`/api/chapters/${chapter?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedChapter),
      });
      if (chapterResponse.ok) {
        const updatedChapter = await chapterResponse.json();
        setChapter(updatedChapter);
        setEditedChapter(updatedChapter);
      } else {
        throw new Error('Failed to update chapter');
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update scene or chapter:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this scene?')) {
      try {
        const response = await fetch(`/api/scenes/${sceneId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          router.push(`/chapters/${chapter?.id}?tab=scenes`);
        }
      } catch (error) {
        console.error('Failed to delete scene:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading scene...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!scene || !chapter || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Scene Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The scene you're looking for doesn't exist or has been moved.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Breadcrumbs items={[
        { label: 'Books', href: '/books' },
        { label: book.title, href: `/books/${book.id}` },
        { label: `Chapter ${chapter.chapterNumber}`, href: `/chapters/${chapter.id}` },
        { label: `Scene ${scene.sceneNumber}: ${scene.title}`, current: true }
      ]} />
      
      {/* Header */}
      <div className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <Link 
            href={`/chapters/${chapter.id}?tab=scenes`}
            className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Chapter {chapter.chapterNumber}</span>
          </Link>
        </div>

        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-600/50">
          {/* Scene Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                  Scene {scene.sceneNumber}
                </span>
                {scene.heroJourneyStage && (
                  <span className="px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900 rounded-full">
                    {scene.heroJourneyStage.replace(/_/g, ' ')}
                  </span>
                )}
                {scene.primaryTarotCard && (
                  <span className="px-3 py-1 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900 rounded-full">
                    {scene.primaryTarotCard}
                  </span>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={editedScene?.title || ''}
                  onChange={handleSceneInputChange}
                  className="text-4xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b-2 border-indigo-500"
                />
              ) : (
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {scene.title}
                </h1>
              )}
              {scene.focus && (
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {scene.focus}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button onClick={handleUpdate} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">Save</button>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Edit</button>
              )}
              <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>

          {/* Scene Description */}
          {isEditing ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Description</h2>
              <textarea
                name="description"
                value={editedScene?.description || ''}
                onChange={handleSceneInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
              />
            </div>
          ) : (
            scene.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Description</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {scene.description}
                </p>
              </div>
            )
          )}

          {/* Main Scene Elements */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {isEditing ? (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                    <BookOpenIcon className="w-5 h-5 mr-2" />
                    Setup
                  </h3>
                  <textarea
                    name="setup"
                    value={editedScene?.setup || ''}
                    onChange={handleSceneInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                  />
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Beat Goal
                  </h3>
                  <textarea
                    name="beatGoal"
                    value={editedScene?.beatGoal || ''}
                    onChange={handleSceneInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                  />
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                  <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-3 flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Symbolism
                  </h3>
                  <textarea
                    name="symbolism"
                    value={editedScene?.symbolism || ''}
                    onChange={handleSceneInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                  />
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center">
                    <EyeIcon className="w-5 h-5 mr-2" />
                    Sensory Detail
                  </h3>
                  <textarea
                    name="sensoryDetail"
                    value={editedScene?.sensoryDetail || ''}
                    onChange={handleSceneInputChange}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                  />
                </div>
              </>
            ) : (
              <>
                {scene.setup && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                      <BookOpenIcon className="w-5 h-5 mr-2" />
                      Setup
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                      {scene.setup}
                    </p>
                  </div>
                )}

                {scene.beatGoal && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                      <SparklesIcon className="w-5 h-5 mr-2" />
                      Beat Goal
                    </h3>
                    <p className="text-purple-800 dark:text-purple-200 leading-relaxed">
                      {scene.beatGoal}
                    </p>
                  </div>
                )}

                {scene.symbolism && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                    <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-3 flex items-center">
                      <SparklesIcon className="w-5 h-5 mr-2" />
                      Symbolism
                    </h3>
                    <p className="text-emerald-800 dark:text-emerald-200 leading-relaxed">
                      {scene.symbolism}
                    </p>
                  </div>
                )}

                {scene.sensoryDetail && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                    <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center">
                      <EyeIcon className="w-5 h-5 mr-2" />
                      Sensory Detail
                    </h3>
                    <p className="text-orange-800 dark:text-orange-200 leading-relaxed">
                      {scene.sensoryDetail}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Timeline Management */}
          <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-800 mb-8">
            <h3 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Timeline Management
            </h3>
            {isEditing ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                    <CalendarIcon className="w-4 h-4 inline mr-1" />
                    Timeline Date
                  </label>
                  <input
                    type="text"
                    name="timeline_date"
                    value={editedScene?.timeline_date || ''}
                    onChange={handleSceneInputChange}
                    className="w-full p-3 border border-cyan-300 dark:border-cyan-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                    placeholder="e.g., 1/10/1320"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                    <GlobeAltIcon className="w-4 h-4 inline mr-1" />
                    Timeline Variant
                  </label>
                  <select
                    name="timeline_variant"
                    value={editedScene?.timeline_variant || ''}
                    onChange={handleSceneInputChange}
                    className="w-full p-3 border border-cyan-300 dark:border-cyan-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
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
                  <label className="block text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                    📍 Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editedScene?.location || ''}
                    onChange={handleSceneInputChange}
                    className="w-full p-3 border border-cyan-300 dark:border-cyan-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                    placeholder="e.g., Bologna City Square, Italy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                    🔄 Chronological Sequence
                  </label>
                  <input
                    type="number"
                    name="chronologicalSequence"
                    value={editedScene?.chronologicalSequence || ''}
                    onChange={handleSceneInputChange}
                    className="w-full p-3 border border-cyan-300 dark:border-cyan-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                    placeholder="Chronological order"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                    ⚡ Temporal Divergence
                  </label>
                  <input
                    type="text"
                    name="temporalDivergencePoint"
                    value={editedScene?.temporalDivergencePoint || ''}
                    onChange={handleSceneInputChange}
                    className="w-full p-3 border border-cyan-300 dark:border-cyan-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                    placeholder="Key divergence point"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2">
                    🌍 Real World Context
                  </label>
                  <input
                    type="text"
                    name="realWorldContext"
                    value={editedScene?.realWorldContext || ''}
                    onChange={handleSceneInputChange}
                    className="w-full p-3 border border-cyan-300 dark:border-cyan-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                    placeholder="Historical context"
                  />
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(scene.timeline_date || scene.historicalDate) && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-cyan-300 dark:border-cyan-600">
                    <h4 className="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2 flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      Timeline Date
                    </h4>
                    <p className="text-cyan-900 dark:text-cyan-100 font-semibold">{scene.timeline_date || scene.historicalDate}</p>
                  </div>
                )}
                {scene.timeline_variant && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-cyan-300 dark:border-cyan-600">
                    <h4 className="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2 flex items-center">
                      <GlobeAltIcon className="w-4 h-4 mr-1" />
                      Timeline Variant
                    </h4>
                    <p className="text-cyan-900 dark:text-cyan-100 font-semibold">{scene.timeline_variant}</p>
                  </div>
                )}
                {scene.location && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-cyan-300 dark:border-cyan-600">
                    <h4 className="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2 flex items-center">
                      📍 Location
                    </h4>
                    <p className="text-cyan-900 dark:text-cyan-100 font-semibold">{scene.location}</p>
                  </div>
                )}
                {scene.chronologicalSequence && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-cyan-300 dark:border-cyan-600">
                    <h4 className="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2 flex items-center">
                      🔄 Chronological Sequence
                    </h4>
                    <p className="text-cyan-900 dark:text-cyan-100 font-semibold">#{scene.chronologicalSequence}</p>
                  </div>
                )}
                {scene.temporalDivergencePoint && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-cyan-300 dark:border-cyan-600">
                    <h4 className="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2 flex items-center">
                      ⚡ Temporal Divergence
                    </h4>
                    <p className="text-cyan-900 dark:text-cyan-100 font-semibold">{scene.temporalDivergencePoint}</p>
                  </div>
                )}
                {scene.realWorldContext && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-cyan-300 dark:border-cyan-600">
                    <h4 className="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2 flex items-center">
                      🌍 Real World Context
                    </h4>
                    <p className="text-cyan-900 dark:text-cyan-100">{scene.realWorldContext}</p>
                  </div>
                )}
                {scene.timelineSignificance && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-cyan-300 dark:border-cyan-600 md:col-span-2 lg:col-span-3">
                    <h4 className="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2 flex items-center">
                      ⭐ Timeline Significance
                    </h4>
                    <p className="text-cyan-900 dark:text-cyan-100">{scene.timelineSignificance}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chapter Context */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800 mb-8">
            <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center">
              <BookOpenIcon className="w-5 h-5 mr-2" />
              Chapter Context
            </h3>
            {isEditing ? (
              <div className="space-y-6">
                {/* Narrative Perspective */}
                <div>
                  <h4 className="text-md font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Narrative Perspective</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                        👁️ Point of View
                      </label>
                      <input
                        type="text"
                        name="pov"
                        value={editedScene?.pov || ''}
                        onChange={handleSceneInputChange}
                        className="w-full p-3 border border-indigo-300 dark:border-indigo-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                        placeholder="e.g., Francisco, 3rd Person Limited"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                        ⏰ Narrative Tense
                      </label>
                      <input
                        type="text"
                        name="tense"
                        value={editedScene?.tense || ''}
                        onChange={handleSceneInputChange}
                        className="w-full p-3 border border-indigo-300 dark:border-indigo-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                        placeholder="e.g., Past Tense, Third person limited"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Emotional Context */}
                <div>
                  <h4 className="text-md font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Emotional Context</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                        ❤️ Core Emotion
                      </label>
                      <input
                        type="text"
                        name="core_emotion"
                        value={editedScene?.core_emotion || ''}
                        onChange={handleSceneInputChange}
                        className="w-full p-3 border border-indigo-300 dark:border-indigo-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                        placeholder="e.g., Tension and conflict"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                        🎭 Scene Tone
                      </label>
                      <input
                        type="text"
                        name="scene_tone"
                        value={editedScene?.scene_tone || ''}
                        onChange={handleSceneInputChange}
                        className="w-full p-3 border border-indigo-300 dark:border-indigo-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                        placeholder="e.g., Dramatic and intense"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Story Structure */}
                <div>
                  <h4 className="text-md font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Story Structure</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                        🎯 Beat Goal
                      </label>
                      <textarea
                        name="beat_goal"
                        value={editedScene?.beat_goal || ''}
                        onChange={handleSceneInputChange}
                        rows={3}
                        className="w-full p-3 border border-indigo-300 dark:border-indigo-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                        placeholder="What this scene should accomplish..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                        🌏 Hero's Journey Stage
                      </label>
                      <input
                        type="text"
                        name="heroJourneyStage"
                        value={editedScene?.heroJourneyStage || ''}
                        onChange={handleSceneInputChange}
                        className="w-full p-3 border border-indigo-300 dark:border-indigo-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                        placeholder="e.g., ordinary_world, call_to_adventure"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Narrative Perspective Display */}
                {(scene.pov || scene.tense) && (
                  <div>
                    <h4 className="text-md font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Narrative Perspective</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {scene.pov && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-300 dark:border-indigo-600">
                          <h5 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                            👁️ Point of View
                          </h5>
                          <p className="text-indigo-900 dark:text-indigo-100 font-semibold">{scene.pov}</p>
                        </div>
                      )}
                      {scene.tense && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-300 dark:border-indigo-600">
                          <h5 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                            ⏰ Narrative Tense
                          </h5>
                          <p className="text-indigo-900 dark:text-indigo-100 font-semibold">{scene.tense}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Emotional Context Display */}
                {(scene.core_emotion || scene.scene_tone) && (
                  <div>
                    <h4 className="text-md font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Emotional Context</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {scene.core_emotion && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-300 dark:border-indigo-600">
                          <h5 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                            ❤️ Core Emotion
                          </h5>
                          <p className="text-indigo-900 dark:text-indigo-100">{scene.core_emotion}</p>
                        </div>
                      )}
                      {scene.scene_tone && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-300 dark:border-indigo-600">
                          <h5 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                            🎭 Scene Tone
                          </h5>
                          <p className="text-indigo-900 dark:text-indigo-100">{scene.scene_tone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Story Structure Display */}
                {(scene.beat_goal || scene.heroJourneyStage) && (
                  <div>
                    <h4 className="text-md font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Story Structure</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {scene.beat_goal && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-300 dark:border-indigo-600">
                          <h5 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                            🎯 Beat Goal
                          </h5>
                          <p className="text-indigo-900 dark:text-indigo-100">{scene.beat_goal}</p>
                        </div>
                      )}
                      {scene.heroJourneyStage && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-300 dark:border-indigo-600">
                          <h5 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                            🌏 Hero's Journey Stage
                          </h5>
                          <p className="text-indigo-900 dark:text-indigo-100">{scene.heroJourneyStage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Scene Metadata Display */}
                {(scene.pages || scene.sceneNumber || scene.storySequence) && (
                  <div>
                    <h4 className="text-md font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Scene Metadata</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {scene.pages && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-300 dark:border-indigo-600">
                          <h5 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                            📄 Pages
                          </h5>
                          <p className="text-indigo-900 dark:text-indigo-100 font-semibold">{scene.pages}</p>
                        </div>
                      )}
                      {scene.sceneNumber && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-300 dark:border-indigo-600">
                          <h5 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                            🔢 Scene Number
                          </h5>
                          <p className="text-indigo-900 dark:text-indigo-100 font-semibold">#{scene.sceneNumber}</p>
                        </div>
                      )}
                      {scene.storySequence && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-300 dark:border-indigo-600">
                          <h5 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                            📈 Story Sequence
                          </h5>
                          <p className="text-indigo-900 dark:text-indigo-100 font-semibold">#{scene.storySequence}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Additional Details */}
          {(scene.internalConflict || scene.tarotSymbolism || scene.characterGrowthElement) && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Additional Details</h3>
              
              {scene.internalConflict && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Internal Conflict</h4>
                  <p className="text-red-800 dark:text-red-200">{scene.internalConflict}</p>
                </div>
              )}

              {scene.tarotSymbolism && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Tarot Symbolism</h4>
                  <p className="text-indigo-800 dark:text-indigo-200">{scene.tarotSymbolism}</p>
                </div>
              )}

              {scene.characterGrowthElement && (
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-teal-900 dark:text-teal-100 mb-2">Character Growth</h4>
                  <p className="text-teal-800 dark:text-teal-200">{scene.characterGrowthElement}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}