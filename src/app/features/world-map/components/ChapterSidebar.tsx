"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Location, Chapter } from '../page';

interface ChapterSidebarProps {
  selectedLocation: Location | null;
  activeTimeline: 'alpha' | 'beta' | 'gamma';
  onClose: () => void;
}

export function ChapterSidebar({
  selectedLocation,
  activeTimeline,
  onClose
}: ChapterSidebarProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  const timelineColors = {
    alpha: { primary: '#10b981', secondary: '#047857' },
    beta: { primary: '#f59e0b', secondary: '#d97706' },
    gamma: { primary: '#8b5cf6', secondary: '#7c3aed' }
  };

  // Mock chapter data - in a real app, this would come from an API
  const allChapters: Chapter[] = [
    {
      id: 'ch-1',
      bookId: 'book-1',
      chapterNumber: 1,
      title: 'The Hermit\'s Discovery',
      description: 'Our journey begins at the crystalline Hyperborea Library, where ancient texts reveal the first clues about the temporal disturbances.',
      locationId: 'loc-0',
      timeline: 'alpha',
      tarotCardLink: 'The Hermit'
    },
    {
      id: 'ch-2',
      bookId: 'book-1',
      chapterNumber: 2,
      title: 'The Tower\'s Shadow',
      description: 'The Citadel of Borealis becomes a focal point as timeline convergences threaten the stability of reality itself.',
      locationId: 'loc-1',
      timeline: 'beta',
      tarotCardLink: 'The Tower'
    },
    {
      id: 'ch-3',
      bookId: 'book-1',
      chapterNumber: 3,
      title: 'Strength in the Mountains',
      description: 'The Ironroot Mountains test our heroes\' resolve as they forge new alliances with the dwarf-clans.',
      locationId: 'loc-2',
      timeline: 'alpha',
      tarotCardLink: 'Strength'
    },
    {
      id: 'ch-4',
      bookId: 'book-1',
      chapterNumber: 4,
      title: 'The High Priestess\'s Gate',
      description: 'At Selene Gate, lunar magic opens pathways between worlds, but at what cost?',
      locationId: 'loc-3',
      timeline: 'gamma',
      tarotCardLink: 'The High Priestess'
    },
    {
      id: 'ch-5',
      bookId: 'book-1',
      chapterNumber: 5,
      title: 'Judgement at the Spire',
      description: 'The Hollow Spire echoes with prophetic verses that will determine the fate of all timelines.',
      locationId: 'loc-4',
      timeline: 'beta',
      tarotCardLink: 'Judgement'
    }
  ];

  const filteredChapters = selectedLocation 
    ? allChapters.filter(ch => ch.locationId === selectedLocation.id)
    : allChapters.filter(ch => ch.timeline === activeTimeline);

  const toggleChapterExpansion = (chapterId: string) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <motion.h2
            className="text-xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Chapter Navigation
          </motion.h2>
          <motion.button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        {selectedLocation ? (
          <motion.div
            className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-medium text-purple-900 dark:text-purple-300 mb-2">
              Viewing chapters for:
            </h3>
            <p className="text-purple-700 dark:text-purple-400 font-semibold">
              {selectedLocation.name}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-500 mt-1">
              {selectedLocation.type}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Viewing chapters for:
            </h3>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: timelineColors[activeTimeline].primary }}
              />
              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                {activeTimeline.charAt(0).toUpperCase() + activeTimeline.slice(1)} Timeline
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Chapter List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Chapters ({filteredChapters.length})
              </h3>
              {selectedLocation && (
                <button
                  onClick={() => selectedLocation && onClose()}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  View all
                </button>
              )}
            </div>

            <AnimatePresence>
              {filteredChapters.length > 0 ? (
                filteredChapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {/* Chapter Header */}
                    <motion.button
                      onClick={() => toggleChapterExpansion(chapter.id)}
                      className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Chapter {chapter.chapterNumber}
                            </span>
                            <span 
                              className="px-2 py-1 text-xs font-medium text-white rounded-full"
                              style={{ backgroundColor: timelineColors[chapter.timeline].primary }}
                            >
                              {chapter.timeline.charAt(0).toUpperCase() + chapter.timeline.slice(1)}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {chapter.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {chapter.description}
                          </p>
                          {chapter.tarotCardLink && (
                            <div className="flex items-center mt-2 text-xs text-purple-600 dark:text-purple-400">
                              <span className="mr-1">🃏</span>
                              <span>{chapter.tarotCardLink}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <motion.div
                            animate={{ rotate: expandedChapter === chapter.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </motion.button>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedChapter === chapter.id && (
                        <motion.div
                          className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/25"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-4 space-y-4">
                            {/* Chapter Actions */}
                            <div className="flex space-x-2">
                              <motion.button
                                className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                Read Chapter
                              </motion.button>
                              <motion.button
                                className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                Edit
                              </motion.button>
                            </div>

                            {/* Chapter Stats */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Book:</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {chapter.bookId}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Timeline:</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {chapter.timeline.charAt(0).toUpperCase() + chapter.timeline.slice(1)}
                                </p>
                              </div>
                              {chapter.tarotCardLink && (
                                <div className="col-span-2">
                                  <span className="text-gray-500 dark:text-gray-400">Linked Arcana:</span>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    🃏 {chapter.tarotCardLink}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Chapter Notes */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Chapter Notes
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {chapter.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="mb-2">No chapters found</p>
                  <p className="text-sm">
                    {selectedLocation 
                      ? `No chapters have been written for ${selectedLocation.name} yet.`
                      : `No chapters found for the ${activeTimeline} timeline.`
                    }
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          + Create New Chapter
        </motion.button>
      </div>
    </div>
  );
}