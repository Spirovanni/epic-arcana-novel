"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface OverlayConfig {
  showBookBoundaries: boolean;
  showChapterBoundaries: boolean;
  showLocationLabels: boolean;
  opacity: number;
  bookBoundaryColor: string;
  chapterBoundaryColor: string;
  labelBackgroundColor: string;
}

interface OverlayControlsProps {
  config: OverlayConfig;
  onConfigChange: (config: OverlayConfig) => void;
}

export function OverlayControls({ config, onConfigChange }: OverlayControlsProps) {
  const updateConfig = (updates: Partial<OverlayConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const quickPresets = [
    {
      name: "Book Focus",
      config: {
        showBookBoundaries: true,
        showChapterBoundaries: false,
        showLocationLabels: false,
        opacity: 0.7,
        bookBoundaryColor: "#ff6b35",
        chapterBoundaryColor: "#14b8a6",
        labelBackgroundColor: "#ffffff"
      }
    },
    {
      name: "Chapter Detail", 
      config: {
        showBookBoundaries: false,
        showChapterBoundaries: true,
        showLocationLabels: false,
        opacity: 0.5,
        bookBoundaryColor: "#ff6b35",
        chapterBoundaryColor: "#14b8a6", 
        labelBackgroundColor: "#ffffff"
      }
    },
    {
      name: "Labels Only",
      config: {
        showBookBoundaries: false,
        showChapterBoundaries: false,
        showLocationLabels: true,
        opacity: 0.9,
        bookBoundaryColor: "#ff6b35",
        chapterBoundaryColor: "#14b8a6",
        labelBackgroundColor: "#ffffff"
      }
    },
    {
      name: "Hide All",
      config: {
        showBookBoundaries: false,
        showChapterBoundaries: false,
        showLocationLabels: false,
        opacity: 0,
        bookBoundaryColor: "#ff6b35",
        chapterBoundaryColor: "#14b8a6",
        labelBackgroundColor: "#ffffff"
      }
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">Regional Overlays</h3>
      
      {/* Toggle Controls */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={config.showBookBoundaries}
            onChange={(e) => updateConfig({ showBookBoundaries: e.target.checked })}
            className="rounded text-purple-600 focus:ring-purple-500 focus:ring-2"
          />
          <span className="text-gray-700 dark:text-gray-300">📚 Book Regions</span>
        </label>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={config.showChapterBoundaries}
            onChange={(e) => updateConfig({ showChapterBoundaries: e.target.checked })}
            className="rounded text-teal-600 focus:ring-teal-500 focus:ring-2"
          />
          <span className="text-gray-700 dark:text-gray-300">📖 Chapter Areas</span>
        </label>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={config.showLocationLabels}
            onChange={(e) => updateConfig({ showLocationLabels: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-gray-700 dark:text-gray-300">🏷️ Location Labels</span>
        </label>
      </div>

      {/* Opacity Slider */}
      <div className="space-y-2">
        <label className="block text-sm text-gray-700 dark:text-gray-300">
          Opacity: {Math.round(config.opacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.opacity}
          onChange={(e) => updateConfig({ opacity: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <label className="block text-sm text-gray-700 dark:text-gray-300">Quick Presets:</label>
        <div className="grid grid-cols-2 gap-2">
          {quickPresets.map((preset) => (
            <motion.button
              key={preset.name}
              onClick={() => onConfigChange(preset.config)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {preset.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Color Pickers */}
      {(config.showBookBoundaries || config.showChapterBoundaries || config.showLocationLabels) && (
        <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-600">
          {config.showBookBoundaries && (
            <div className="flex items-center space-x-2">
              <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Book Color:</label>
              <input
                type="color"
                value={config.bookBoundaryColor}
                onChange={(e) => updateConfig({ bookBoundaryColor: e.target.value })}
                className="w-8 h-6 rounded border-0 cursor-pointer"
              />
            </div>
          )}

          {config.showChapterBoundaries && (
            <div className="flex items-center space-x-2">
              <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Chapter Color:</label>
              <input
                type="color"
                value={config.chapterBoundaryColor}
                onChange={(e) => updateConfig({ chapterBoundaryColor: e.target.value })}
                className="w-8 h-6 rounded border-0 cursor-pointer"
              />
            </div>
          )}

          {config.showLocationLabels && (
            <div className="flex items-center space-x-2">
              <label className="text-xs text-gray-600 dark:text-gray-400 w-16">Label Color:</label>
              <input
                type="color"
                value={config.labelBackgroundColor}
                onChange={(e) => updateConfig({ labelBackgroundColor: e.target.value })}
                className="w-8 h-6 rounded border-0 cursor-pointer"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}