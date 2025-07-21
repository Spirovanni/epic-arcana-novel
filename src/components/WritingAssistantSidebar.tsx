'use client';

import { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  LightBulbIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClockIcon,
  PencilIcon,
  SparklesIcon,
  UserIcon,
  EyeIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface WritingSession {
  chapterId: string;
  chapterNumber: number;
  title: string;
  wordTarget?: number;
  currentWords: number;
  startTime: Date;
  timeSpent: number; // in minutes
  guidanceUsed: string[];
}

interface QuickTip {
  id: string;
  category: 'pov' | 'plot' | 'tone' | 'character' | 'structure';
  title: string;
  content: string;
  applicableToChapter?: number;
}

interface WritingAssistantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentChapter?: {
    id: string;
    number: number;
    title: string;
    guidance?: { [key: string]: unknown };
  };
  writingSession?: WritingSession;
  onStartSession?: (chapterId: string) => void;
  onEndSession?: () => void;
}

export default function WritingAssistantSidebar({
  isOpen,
  onClose,
  currentChapter,
  writingSession,
  onStartSession,
  onEndSession
}: WritingAssistantSidebarProps) {
  const [activeTab, setActiveTab] = useState<'session' | 'guidance' | 'tips' | 'progress'>('session');
  const [sessionTimer, setSessionTimer] = useState(0);

  // Update session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (writingSession) {
      interval = setInterval(() => {
        setSessionTimer(Math.floor((Date.now() - writingSession.startTime.getTime()) / 1000 / 60));
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [writingSession]);

  const quickTips: QuickTip[] = [
    {
      id: '1',
      category: 'pov',
      title: '3rd Person Limited Focus',
      content: 'Stay close to your POV character\'s thoughts and perceptions. Filter everything through their lens.',
      applicableToChapter: currentChapter?.number
    },
    {
      id: '2',
      category: 'plot',
      title: 'Show Don\'t Tell',
      content: 'Instead of stating emotions, show them through actions, dialogue, and physical reactions.',
    },
    {
      id: '3',
      category: 'tone',
      title: 'Renaissance Atmosphere',
      content: 'Include sensory details that evoke the medieval/Renaissance period: stone corridors, candlelight, parchment.',
    },
    {
      id: '4',
      category: 'character',
      title: 'Internal Conflict',
      content: 'Balance external action with internal character struggles and growth moments.',
    }
  ];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getSessionProgress = () => {
    if (!writingSession) return 0;
    if (!writingSession.wordTarget) return 0;
    return Math.min((writingSession.currentWords / writingSession.wordTarget) * 100, 100);
  };

  const tabs = [
    { id: 'session', label: 'Session', icon: ClockIcon },
    { id: 'guidance', label: 'Guidance', icon: BookOpenIcon },
    { id: 'tips', label: 'Tips', icon: LightBulbIcon },
    { id: 'progress', label: 'Progress', icon: ChartBarIcon }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-purple-600" />
                Writing Assistant
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'guidance' | 'structure' | 'characters' | 'themes' | 'review')}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'session' && (
                <div className="space-y-6">
                  {/* Current Chapter */}
                  {currentChapter && (
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        Current Chapter
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        Chapter {currentChapter.number}: {currentChapter.title}
                      </p>
                    </div>
                  )}

                  {/* Writing Session */}
                  {writingSession ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-green-800 dark:text-green-200">
                            Active Session
                          </h3>
                          <button
                            onClick={onEndSession}
                            className="text-xs text-green-700 dark:text-green-300 hover:underline"
                          >
                            End Session
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-green-600 dark:text-green-400">Time:</span>
                            <p className="font-medium text-green-800 dark:text-green-200">
                              {formatTime(sessionTimer)}
                            </p>
                          </div>
                          <div>
                            <span className="text-green-600 dark:text-green-400">Words:</span>
                            <p className="font-medium text-green-800 dark:text-green-200">
                              {writingSession.currentWords.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {writingSession.wordTarget && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-green-600 dark:text-green-400 mb-1">
                              <span>Progress</span>
                              <span>{Math.round(getSessionProgress())}%</span>
                            </div>
                            <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                              <div
                                className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${getSessionProgress()}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        No active writing session
                      </p>
                      {currentChapter && (
                        <button
                          onClick={() => onStartSession?.(currentChapter.id)}
                          className="flex items-center gap-2 mx-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          <PencilIcon className="w-4 h-4" />
                          Start Writing Session
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'guidance' && (
                <div className="space-y-4">
                  {currentChapter?.guidance ? (
                    <div className="space-y-4">
                      {/* POV & Tense Quick Reference */}
                      <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4">
                        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                          <UserIcon className="w-4 h-4" />
                          POV & Tense
                        </h3>
                        <div className="text-sm space-y-1">
                          <p className="text-amber-700 dark:text-amber-300">
                            <span className="font-medium">POV:</span> {currentChapter.guidance.povType}
                          </p>
                          <p className="text-amber-700 dark:text-amber-300">
                            <span className="font-medium">Character:</span> {currentChapter.guidance.povCharacter}
                          </p>
                          <p className="text-amber-700 dark:text-amber-300">
                            <span className="font-medium">Tense:</span> {currentChapter.guidance.tense}
                          </p>
                        </div>
                      </div>

                      {/* Key Plot Points */}
                      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                          <BookOpenIcon className="w-4 h-4" />
                          Key Plot Points
                        </h3>
                        <ul className="text-sm space-y-1">
                          {currentChapter.guidance.keyPlotDevelopments?.slice(0, 3).map((point: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-blue-700 dark:text-blue-300">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        No guidance available for current chapter
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'tips' && (
                <div className="space-y-4">
                  {quickTips.map((tip) => (
                    <div key={tip.id} className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <LightBulbIcon className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">
                            {tip.title}
                          </h4>
                          <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
                            {tip.content}
                          </p>
                          <span className="inline-block mt-2 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded">
                            {tip.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'progress' && (
                <div className="space-y-4">
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
                      <ChartBarIcon className="w-4 h-4" />
                      Today&apos;s Progress
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-purple-600 dark:text-purple-400">Words Written:</span>
                        <p className="font-bold text-purple-800 dark:text-purple-200">1,247</p>
                      </div>
                      <div>
                        <span className="text-purple-600 dark:text-purple-400">Time Spent:</span>
                        <p className="font-bold text-purple-800 dark:text-purple-200">2h 15m</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">Recent Achievements</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">Completed Chapter 1 draft</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">Reached 1,000 words</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                  <EyeIcon className="w-4 h-4" />
                  View Chapter
                </button>
                <button className="flex items-center justify-center gap-1 py-2 px-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  <ArrowRightIcon className="w-4 h-4" />
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 