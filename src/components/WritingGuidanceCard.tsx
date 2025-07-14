'use client';

import { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  BookOpenIcon,
  UserIcon,
  ClockIcon,
  LightBulbIcon,
  PencilIcon,
  EyeIcon,
  SparklesIcon,
  CheckCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface WritingGuidance {
  id: string;
  chapterId: string;
  chapterNumber: number;
  title: string;
  chapter?: {
    id: string;
    title: string;
    description: string;
    iconPath: string;
    colorTheme: {
      name: string;
      hex: string;
    };
  };
  writingDetails: {
    povType: string;
    povCharacter: string;
    tense: string;
    whyThisPovAndTense: string;
    summary: string;
    keyPlotDevelopments: string[];
    narrativeFunction: string[];
    toneAndVisualPrompts: string[];
    tipsForWriting: string[];
    fullText: string;
  };
  writingProgress: {
    isStarted: boolean;
    wordCount: number;
    completionRate: number;
    lastUpdated: string;
  };
}

interface WritingGuidanceCardProps {
  guidance: WritingGuidance;
  onStartWriting?: (chapterId: string) => void;
  onViewChapter?: (chapterId: string) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export default function WritingGuidanceCard({ 
  guidance, 
  onStartWriting, 
  onViewChapter,
  isExpanded = false,
  onToggleExpanded 
}: WritingGuidanceCardProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const { writingDetails, writingProgress, chapter } = guidance;
  const colorTheme = chapter?.colorTheme?.hex || '#6366f1';

  const sections = [
    {
      id: 'pov-tense',
      title: 'POV & Tense',
      icon: UserIcon,
      content: (
        <div className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">POV:</span>
              <p className="text-gray-900 dark:text-gray-100">{writingDetails.povType}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Character:</span>
              <p className="text-gray-900 dark:text-gray-100">{writingDetails.povCharacter}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Tense:</span>
              <p className="text-gray-900 dark:text-gray-100">{writingDetails.tense}</p>
            </div>
          </div>
          {writingDetails.whyThisPovAndTense && (
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Why this POV & Tense:</span>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{writingDetails.whyThisPovAndTense}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'plot-developments',
      title: 'Key Plot Developments',
      icon: BookOpenIcon,
      content: (
        <ul className="space-y-2">
          {writingDetails.keyPlotDevelopments.map((development, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{development}</span>
            </li>
          ))}
        </ul>
      )
    },
    {
      id: 'narrative-function',
      title: 'Narrative Function',
      icon: SparklesIcon,
      content: (
        <ul className="space-y-2">
          {writingDetails.narrativeFunction.map((func, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 dark:text-gray-300 text-sm">{func}</span>
            </li>
          ))}
        </ul>
      )
    },
    {
      id: 'tone-visuals',
      title: 'Tone & Visual Prompts',
      icon: EyeIcon,
      content: (
        <div className="space-y-2">
          {writingDetails.toneAndVisualPrompts.map((prompt, index) => (
            <div key={index} className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3">
              <span className="text-amber-800 dark:text-amber-200 text-sm">{prompt}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'writing-tips',
      title: 'Writing Tips',
      icon: LightBulbIcon,
      content: (
        <div className="space-y-2">
          {writingDetails.tipsForWriting.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <LightBulbIcon className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{tip}</span>
            </div>
          ))}
        </div>
      )
    }
  ];

  const getProgressColor = (rate: number) => {
    if (rate === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (rate < 30) return 'bg-red-200 dark:bg-red-900';
    if (rate < 70) return 'bg-yellow-200 dark:bg-yellow-900';
    return 'bg-green-200 dark:bg-green-900';
  };

  const getProgressTextColor = (rate: number) => {
    if (rate === 0) return 'text-gray-600 dark:text-gray-400';
    if (rate < 30) return 'text-red-800 dark:text-red-200';
    if (rate < 70) return 'text-yellow-800 dark:text-yellow-200';
    return 'text-green-800 dark:text-green-200';
  };

  return (
    <motion.div
      layout
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      style={{
        borderLeftColor: colorTheme,
        borderLeftWidth: '4px'
      }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleExpanded}
              className="flex items-center gap-2 text-left group"
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Chapter {guidance.chapterNumber}: {guidance.title}
                </h3>
                {writingDetails.summary && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {writingDetails.summary}
                  </p>
                )}
              </div>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getProgressColor(writingProgress.completionRate)} ${getProgressTextColor(writingProgress.completionRate)}`}>
                {writingProgress.completionRate}% Complete
              </div>
              {writingProgress.wordCount > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {writingProgress.wordCount.toLocaleString()} words
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onViewChapter?.(guidance.chapterId)}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <EyeIcon className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => onStartWriting?.(guidance.chapterId)}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {writingProgress.isStarted ? <PencilIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                {writingProgress.isStarted ? 'Continue' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-6">
              {/* Section Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(isActive ? null : section.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {section.title}
                    </button>
                  );
                })}
              </div>

              {/* Active Section Content */}
              <AnimatePresence mode="wait">
                {activeSection && (
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4"
                  >
                    {sections.find(s => s.id === activeSection)?.content}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Full Guidance Text */}
              {!activeSection && writingDetails.fullText && (
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <BookOpenIcon className="w-4 h-4" />
                    Complete Writing Guidance
                  </h4>
                  <div className="text-blue-700 dark:text-blue-300 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {writingDetails.fullText}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 