"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Location } from '../page';

interface LocationDetailModalProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
  activeTimeline: 'alpha' | 'beta' | 'gamma';
}

export function LocationDetailModal({
  location,
  isOpen,
  onClose,
  activeTimeline
}: LocationDetailModalProps) {
  if (!location) return null;

  const timelineColors = {
    alpha: { primary: '#10b981', secondary: '#047857' },
    beta: { primary: '#f59e0b', secondary: '#d97706' },
    gamma: { primary: '#8b5cf6', secondary: '#7c3aed' }
  };

  const currentTheme = timelineColors[activeTimeline];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Header */}
            <div 
              className="relative px-6 py-4 bg-gradient-to-r text-white"
              style={{ 
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` 
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <motion.h2
                    className="text-2xl font-bold mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {location.name}
                  </motion.h2>
                  {location.other_names && location.other_names.length > 0 && (
                    <motion.p
                      className="text-white/80 text-sm mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      Also known as: {location.other_names.join(', ')}
                    </motion.p>
                  )}
                  <motion.div
                    className="flex items-center space-x-4 text-sm text-white/90"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <span className="flex items-center space-x-1">
                      <span>📍</span>
                      <span>{location.type}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>🃏</span>
                      <span>{location.linked_arcana}</span>
                    </span>
                    {location.chapters && (
                      <span className="flex items-center space-x-1">
                        <span>📖</span>
                        <span>{location.chapters.length} chapters</span>
                      </span>
                    )}
                  </motion.div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Timeline Indicator */}
              <motion.div
                className="absolute top-4 right-16 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <span className="text-xs font-medium">
                  {activeTimeline.charAt(0).toUpperCase() + activeTimeline.slice(1)} Timeline
                </span>
              </motion.div>
            </div>

            {/* Content */}
            <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Description Section */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {location.description}
                  </p>
                </motion.section>

                {/* Sensory Description */}
                {location.sensory_description && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <span className="mr-2">👁️</span>
                      Sensory Experience
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                      {location.sensory_description}
                    </p>
                  </motion.section>
                )}

                {/* Location Info */}
                {location.location && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <span className="mr-2">🗺️</span>
                      Geographic Location
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {location.location}
                    </p>
                  </motion.section>
                )}

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Notable Features */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <span className="mr-2">✨</span>
                      Notable Features
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {location.notable_features}
                    </p>
                  </motion.section>

                  {/* Affiliation */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <span className="mr-2">⚔️</span>
                      Affiliation
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {location.affiliation}
                    </p>
                  </motion.section>
                </div>

                {/* Lore Section */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="mr-2">📜</span>
                    Lore & History
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {location.lore}
                  </p>
                </motion.section>

                {/* Related Chapters */}
                {location.chapters && location.chapters.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <span className="mr-2">📚</span>
                      Related Chapters
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {location.chapters.map((chapter, index) => (
                        <motion.div
                          key={chapter.id}
                          className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Chapter {chapter.chapterNumber}: {chapter.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {chapter.description}
                            </p>
                            <div className="flex items-center mt-2 space-x-3 text-xs">
                              <span 
                                className="px-2 py-1 rounded-full text-white font-medium"
                                style={{ backgroundColor: timelineColors[chapter.timeline].primary }}
                              >
                                {chapter.timeline.charAt(0).toUpperCase() + chapter.timeline.slice(1)} Timeline
                              </span>
                              {chapter.tarotCardLink && (
                                <span className="text-purple-600 dark:text-purple-400">
                                  🃏 {chapter.tarotCardLink}
                                </span>
                              )}
                            </div>
                          </div>
                          <button className="ml-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <span>🃏</span>
                    <span>Linked to {location.linked_arcana}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>⚔️</span>
                    <span>{location.affiliation}</span>
                  </span>
                </div>
                <motion.button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}