"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveWorldMap } from './components/InteractiveWorldMap';
import { LocationDetailModal } from './components/LocationDetailModal';
import { MapControls } from './components/MapControls';
import { useRegionalOverlay } from './components/RegionalOverlay';
import { extractSVGRegions, findMatchingRegion } from './utils/svgRegionExtractor';

export interface Location {
  id: string;
  name: string;
  other_names?: string[];
  type: string;
  description: string;
  sensory_description?: string;
  location?: string;
  notable_features: string;
  lore: string;
  affiliation: string;
  linked_arcana: string;
  coordinates?: { x: number; y: number };
  svgRegionId?: string;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  bookId: string;
  chapterNumber: number;
  title: string;
  description: string;
  locationId?: string;
  timeline: 'alpha' | 'beta' | 'gamma';
  tarotCardLink?: string;
}

export interface Timeline {
  id: string;
  name: string;
  color: string;
  description: string;
}

export default function WorldMapPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Regional overlay system
  const {
    config: overlayConfig,
    updateConfig: updateOverlayConfig
  } = useRegionalOverlay();


  const loadLocations = useCallback(async () => {
    try {
      // Load SVG regions first
      const regions = await extractSVGRegions();
      
      // Fetch actual locations from the database
      const response = await fetch('/api/locations');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch locations');
      }
      
      const locationsData = data.locations || [];

      const processedLocations = locationsData.map((location: Location) => {
        // Try to find matching SVG region for this location
        const matchingRegion = findMatchingRegion(location.name, regions);
        
        return {
          ...location,
          coordinates: matchingRegion?.coordinates || location.coordinates || generateRandomCoordinates(),
          chapters: generateMockChapters(location.name),
          svgRegionId: matchingRegion?.id
        };
      });
      
      setLocations(processedLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
      // Fallback to empty array instead of hardcoded data
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const generateRandomCoordinates = () => {
    // Generate random coordinates within the map bounds
    return {
      x: Math.random() * 800 + 100, // Random x between 100-900
      y: Math.random() * 600 + 100  // Random y between 100-700
    };
  };

  const generateMockChapters = (locationName: string): Chapter[] => {
    // Generate mock chapters for demo
    return [
      {
        id: `chapter-${locationName.toLowerCase().replace(/\s+/g, '-')}-1`,
        bookId: 'book-1',
        chapterNumber: Math.floor(Math.random() * 20) + 1,
        title: `The ${locationName} Encounter`,
        description: `A pivotal chapter where our heroes discover the secrets of ${locationName}.`,
        locationId: `loc-${locationName}`,
        timeline: 'alpha',
        tarotCardLink: 'The Hermit'
      }
    ];
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading the world of Laurasia...</p>
        </motion.div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to load locations</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            There was an error loading the world map data.
          </p>
          <button
            onClick={() => {
              setIsLoading(true);
              loadLocations();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Chapter-Centric World Map
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Explore the interconnected world of Laurasia and discover how chapters unfold across time and space
              </p>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              {/* Chapters Navigation Menu */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <select
                  value={selectedLocation?.name || ''}
                  onChange={(e) => {
                    const location = locations.find(loc => loc.name === e.target.value);
                    if (location) handleLocationClick(location);
                  }}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-w-[200px]"
                >
                  <option value="">Select a Chapter...</option>
                  {locations
                    .filter(loc => loc.name && loc.name.trim() !== '')
                    .sort((a, b) => {
                      // Extract chapter numbers for sorting
                      const aNum = a.name.match(/^\d+/)?.[0];
                      const bNum = b.name.match(/^\d+/)?.[0];
                      if (aNum && bNum) {
                        return parseInt(aNum) - parseInt(bNum);
                      }
                      return a.name.localeCompare(b.name);
                    })
                    .map(location => (
                      <option key={location.name} value={location.name}>
                        {location.name}
                      </option>
                    ))
                  }
                </select>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                {locations.length} locations
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Retractable Map Controls */}
        <AnimatePresence>
          {showLeftSidebar && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto"
            >
              <MapControls
                locations={locations}
                onLocationSelect={handleLocationClick}
                overlayConfig={overlayConfig}
                onOverlayConfigChange={updateOverlayConfig}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Map */}
        <div className="flex-1 relative">
          {/* Sidebar Toggle Button */}
          <motion.button
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            className="absolute top-4 left-4 z-30 w-10 h-10 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={showLeftSidebar ? 'Hide sidebar' : 'Show sidebar'}
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showLeftSidebar ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              )}
            </svg>
          </motion.button>

          <InteractiveWorldMap
            locations={locations}
            onLocationClick={handleLocationClick}
            selectedLocation={selectedLocation}
          />
        </div>

      </div>

      {/* Location Detail Modal */}
      <LocationDetailModal
        location={selectedLocation}
        isOpen={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </div>
  );
}