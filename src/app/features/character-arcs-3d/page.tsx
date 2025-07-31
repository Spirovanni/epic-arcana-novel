'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { CharacterArcs3DVisualization } from './components/CharacterArcs3DVisualization'
import { LoadingSpinner } from './components/LoadingSpinner'

export default function CharacterArcs3DPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      {/* Header */}
      <motion.div 
        className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                3D Character Arcs Visualization
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Interactive 3D visualization of character development throughout the Epic Arcana series
              </p>
            </div>
            
            {/* Controls will go here */}
            <div className="flex items-center space-x-4">
              <motion.button
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset View
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save Scene
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
          <Suspense fallback={<LoadingSpinner />}>
            <CharacterArcs3DVisualization />
          </Suspense>
        </motion.div>
      </div>

      {/* Floating Info Panel */}
      <motion.div 
        className="fixed top-1/2 right-6 transform -translate-y-1/2 w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6"
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Character Information</h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Select a character arc to view detailed information and edit story cards.</p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              <strong>💡 Tip:</strong> Drag and drop story cards to reorder character development stages.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}