'use client'

import React, { Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// import { CharacterArcs3DVisualization } from './components/CharacterArcs3DVisualization' // Temporarily disabled
import { Simple3DScene } from './components/Simple3DScene' // Temporary simple version
import { CharacterArcsTimeline } from './components/CharacterArcsTimeline'
import { LoadingSpinner } from './components/LoadingSpinner'
import { Navbar } from '@/app/landing/components/Navbar'

export default function CharacterArcs3DPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'3d' | 'timeline'>('timeline')
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      <Navbar />
      
      {/* Page Header */}
      <motion.div 
        className="pt-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                {viewMode === '3d' ? '3D Character Arcs Visualization' : 'Character Story Arcs Timeline'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {viewMode === '3d' 
                  ? 'Interactive 3D visualization of character development throughout the Epic Arcana series'
                  : 'Timeline visualization showing character arcs and story progression across scenes'
                }
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                <motion.button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'timeline'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setViewMode('timeline')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Timeline
                </motion.button>
                <motion.button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === '3d'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setViewMode('3d')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  3D View
                </motion.button>
              </div>
              
              <motion.button
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCharacter(null)}
              >
                Show All
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Visualization Area */}
      <div className="flex-1 p-6">
        <motion.div 
          className="h-[calc(100vh-180px)] bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {viewMode === '3d' ? (
              <motion.div
                key="3d-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <Simple3DScene 
                    selectedCharacter={selectedCharacter}
                    onCharacterSelect={setSelectedCharacter}
                  />
                </Suspense>
              </motion.div>
            ) : (
              <motion.div
                key="timeline-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <CharacterArcsTimeline 
                  selectedCharacter={selectedCharacter}
                  onEventSelect={(selection) => {
                    if (selection === 'all') {
                      setSelectedCharacter(null)
                    } else if (typeof selection === 'string') {
                      // Check if it's a character ID - updated to match actual character IDs from database
                      const characterIds = [
                        'francisco-petrarch', 
                        'la-signora-del-gioco', 
                        'dante-alighieri', 
                        'dagon-atumari', 
                        'novella-dandrea', 
                        'hannibal-barca',
                        'madonna-oriente',
                        'man-from-taured',
                        'umbra'
                      ]
                      if (characterIds.includes(selection)) {
                        setSelectedCharacter(selection)
                      } else {
                        console.log('Event selected:', selection)
                        // Handle event selection in the future
                      }
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Floating Info Panel - only show when no character is selected and in 3D mode */}
      <AnimatePresence>
        {!selectedCharacter && viewMode === '3d' && (
        <motion.div 
          className="fixed top-1/2 right-6 transform -translate-y-1/2 w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Character Information</h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {viewMode === '3d' 
                ? 'Select a character arc to view detailed information and edit story cards.'
                : 'Click on timeline events to see detailed scene information and character development.'
              }
            </p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              <strong>💡 Tip:</strong> Switch between Timeline and 3D views to see different perspectives of character development.
            </p>
          </div>
        </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}