"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SVGRegion, getRegionsByType, searchRegions } from '../utils/svgRegionExtractor';

interface RegionBrowserProps {
  onRegionSelect: (region: SVGRegion) => void;
  selectedRegion?: SVGRegion | null;
}

export function RegionBrowser({ onRegionSelect, selectedRegion }: RegionBrowserProps) {
  const [regions] = useState<SVGRegion[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<SVGRegion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<SVGRegion['type'] | 'all'>('all');
  const [isLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load regions functionality removed - component works with empty regions array
  }, []);

  const filterRegions = useCallback(() => {
    let filtered = regions;

    if (searchTerm) {
      filtered = searchRegions(filtered, searchTerm);
    }

    if (selectedType !== 'all') {
      filtered = getRegionsByType(filtered, selectedType);
    }

    setFilteredRegions(filtered);
  }, [regions, searchTerm, selectedType]);

  useEffect(() => {
    filterRegions();
  }, [regions, searchTerm, selectedType, filterRegions]);

  const getTypeCounts = () => {
    const counts = regions.reduce((acc, region) => {
      acc[region.type] = (acc[region.type] || 0) + 1;
      return acc;
    }, {} as Record<SVGRegion['type'], number>);

    return counts;
  };

  const typeCounts = getTypeCounts();

  if (isLoading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            SVG Regions ({regions.length})
          </h3>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="p-4">
              {/* Search and Filter */}
              <div className="space-y-4 mb-4">
                <input
                  type="text"
                  placeholder="Search regions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedType('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedType === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    All ({regions.length})
                  </button>
                  {Object.entries(typeCounts).map(([type, count]) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type as SVGRegion['type'])}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedType === type
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      {type} ({count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Region List */}
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {filteredRegions.map((region) => (
                    <motion.div
                      key={region.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedRegion?.id === region.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => onRegionSelect(region)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {region.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {region.type} • {region.id}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {region.coordinates && (
                            <span>
                              {Math.round(region.coordinates.x)}, {Math.round(region.coordinates.y)}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {filteredRegions.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No regions found matching your criteria.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}