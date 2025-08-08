"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OverlayConfig } from '../utils/regionalGrouping';

interface OverlayControlsProps {
  config: OverlayConfig;
  onConfigChange: (updates: Partial<OverlayConfig>) => void;
  onToggleBookBoundaries: () => void;
  onToggleChapterBoundaries: () => void;
  onToggleLocationLabels: () => void;
}

export function OverlayControls({
  config,
  onConfigChange,
  onToggleBookBoundaries,
  onToggleChapterBoundaries,
  onToggleLocationLabels
}: OverlayControlsProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div 
        className="p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
            <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Regional Overlays
          </h3>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-3 space-y-4">
              {/* Toggle Controls */}
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Overlay Layers
                </h4>
                
                {/* Book Boundaries */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={config.showBookBoundaries}
                        onChange={onToggleBookBoundaries}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        config.showBookBoundaries 
                          ? 'bg-orange-500 border-orange-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {config.showBookBoundaries && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Book Regions</span>
                  </label>
                  <div 
                    className="w-4 h-4 rounded border-2"
                    style={{ backgroundColor: config.bookBoundaryColor, borderColor: config.bookBoundaryColor }}
                    title="Book boundary color"
                  />
                </div>

                {/* Chapter Boundaries */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={config.showChapterBoundaries}
                        onChange={onToggleChapterBoundaries}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        config.showChapterBoundaries 
                          ? 'bg-teal-500 border-teal-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {config.showChapterBoundaries && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Chapter Areas</span>
                  </label>
                  <div 
                    className="w-4 h-4 rounded border-2"
                    style={{ backgroundColor: config.chapterBoundaryColor, borderColor: config.chapterBoundaryColor }}
                    title="Chapter boundary color"
                  />
                </div>

                {/* Location Labels */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={config.showLocationLabels}
                        onChange={onToggleLocationLabels}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        config.showLocationLabels 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {config.showLocationLabels && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Location Names</span>
                  </label>
                  <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs font-bold" style={{ color: config.labelColor }}>A</span>
                  </div>
                </div>
              </div>

              {/* Opacity Control */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Overlay Opacity
                </h4>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500 w-8">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.opacity}
                    onChange={(e) => onConfigChange({ opacity: parseFloat(e.target.value) })}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-xs text-gray-500 w-12">{Math.round(config.opacity * 100)}%</span>
                </div>
              </div>

              {/* Color Controls */}
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Colors
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Book Boundaries</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={config.bookBoundaryColor}
                        onChange={(e) => onConfigChange({ bookBoundaryColor: e.target.value })}
                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.bookBoundaryColor}
                        onChange={(e) => onConfigChange({ bookBoundaryColor: e.target.value })}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Chapter Areas</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={config.chapterBoundaryColor}
                        onChange={(e) => onConfigChange({ chapterBoundaryColor: e.target.value })}
                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.chapterBoundaryColor}
                        onChange={(e) => onConfigChange({ chapterBoundaryColor: e.target.value })}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Label Text</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.labelColor}
                      onChange={(e) => onConfigChange({ labelColor: e.target.value })}
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.labelColor}
                      onChange={(e) => onConfigChange({ labelColor: e.target.value })}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Quick Presets
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onConfigChange({
                      showBookBoundaries: true,
                      showChapterBoundaries: false,
                      showLocationLabels: true,
                      opacity: 0.4,
                      bookBoundaryColor: '#FF6B35',
                      labelColor: '#2C3E50'
                    })}
                    className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 rounded hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
                  >
                    Book Focus
                  </button>
                  <button
                    onClick={() => onConfigChange({
                      showBookBoundaries: false,
                      showChapterBoundaries: true,
                      showLocationLabels: true,
                      opacity: 0.3,
                      chapterBoundaryColor: '#4ECDC4',
                      labelColor: '#2C3E50'
                    })}
                    className="px-2 py-1 text-xs bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 rounded hover:bg-teal-200 dark:hover:bg-teal-900/30 transition-colors"
                  >
                    Chapter Detail
                  </button>
                  <button
                    onClick={() => onConfigChange({
                      showBookBoundaries: false,
                      showChapterBoundaries: false,
                      showLocationLabels: true,
                      opacity: 0.6,
                      labelColor: '#1F2937'
                    })}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Labels Only
                  </button>
                  <button
                    onClick={() => onConfigChange({
                      showBookBoundaries: false,
                      showChapterBoundaries: false,
                      showLocationLabels: false,
                      opacity: 0
                    })}
                    className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Hide All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #FF6B35;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #FF6B35;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}