"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Location, Timeline } from '../page';
import { RegionBrowser } from './RegionBrowser';
import { SVGRegion } from '../utils/svgRegionExtractor';

interface MapControlsProps {
  timelines: Timeline[];
  activeTimeline: 'alpha' | 'beta' | 'gamma';
  onTimelineChange: (timeline: 'alpha' | 'beta' | 'gamma') => void;
  locations: Location[];
  onLocationSelect: (location: Location) => void;
  onRegionSelect?: (region: SVGRegion) => void;
}

const getLocationIcon = (arcana: string): string => {
  const iconMap: Record<string, string> = {
    'The Hermit': '🏔️',
    'The Tower': '🏰',
    'Strength': '⚔️',
    'The High Priestess': '🌙',
    'Judgement': '⚖️',
    'The Wheel of Fortune': '💰',
    'Temperance': '⏳',
    'The Magician': '⚙️',
    'The Hanged Man': '🌊',
    'Death': '🌲'
  };
  
  return iconMap[arcana] || '📍';
};

export function MapControls({
  timelines,
  activeTimeline,
  onTimelineChange,
  locations,
  onLocationSelect,
  onRegionSelect
}: MapControlsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArcana, setSelectedArcana] = useState<string>('');

  const uniqueArcana = Array.from(new Set(locations.map(loc => loc.linked_arcana))).sort();

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArcana = !selectedArcana || location.linked_arcana === selectedArcana;
    return matchesSearch && matchesArcana;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <motion.h2
          className="text-xl font-bold text-gray-900 dark:text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Map Controls
        </motion.h2>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active Timeline
          </label>
          <div className="space-y-2">
            {timelines.map((timeline) => (
              <motion.button
                key={timeline.id}
                onClick={() => onTimelineChange(timeline.id as 'alpha' | 'beta' | 'gamma')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                  activeTimeline === timeline.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: timeline.color }}
                />
                <div className="flex-1 text-left">
                  <div className={`font-medium ${
                    activeTimeline === timeline.id 
                      ? 'text-purple-700 dark:text-purple-300' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {timeline.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {timeline.description}
                  </div>
                </div>
                {activeTimeline === timeline.id && (
                  <motion.div
                    className="w-2 h-2 bg-purple-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Search Locations
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, type, or description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Filter by Arcana
            </label>
            <select
              value={selectedArcana}
              onChange={(e) => setSelectedArcana(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Arcana</option>
              {uniqueArcana.map((arcana) => (
                <option key={arcana} value={arcana}>
                  {arcana}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Locations ({filteredLocations.length})
              </h3>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Clear
                </button>
              )}
            </div>

            <AnimatePresence>
              {filteredLocations.map((location, index) => (
                <motion.button
                  key={location.id}
                  onClick={() => onLocationSelect(location)}
                  className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all duration-200 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                          {location.name}
                        </h4>
                        {location.chapters && location.chapters.length > 0 && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-full">
                            {location.chapters.length} chapters
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {location.type}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                        {location.description}
                      </p>
                    </div>
                    <div className="ml-3 flex flex-col items-end space-y-1">
                      <span className="text-lg" title={location.linked_arcana}>
                        {getLocationIcon(location.linked_arcana)}
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        {location.linked_arcana}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>

            {filteredLocations.length === 0 && (
              <motion.div
                className="text-center py-8 text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p>No locations found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedArcana('');
                  }}
                  className="mt-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* SVG Region Browser */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <RegionBrowser
            onRegionSelect={(region) => {
              console.log('Selected region:', region);
              onRegionSelect?.(region);
            }}
          />
        </div>
      </div>
    </div>
  );
}