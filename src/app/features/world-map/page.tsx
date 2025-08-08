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
    updateConfig: updateOverlayConfig,
    toggleBookBoundaries,
    toggleChapterBoundaries,
    toggleLocationLabels
  } = useRegionalOverlay();


  const loadLocations = useCallback(async () => {
    try {
      // Load SVG regions first
      const regions = await extractSVGRegions();
      
      // Use static data directly since we don't have an API endpoint yet
      const locationsData = [
        {
          name: "Hyperborea Library",
          other_names: ["The Citadel of the Shining Ones"],
          sensory_description: "A vast, crystalline fortress that glows with a soft, ethereal light. The air is filled with the sound of distant chimes and the scent of frost.",
          location: "Located at the northernmost point of Laurasia, surrounded by the icy expanse of the Hyperborean Sea.",
          type: "Cyclopean Library-City",
          description: "A tiered citadel of translucent ice-stone that refracts polar sunlight into reading chambers below. Scrolls here are etched on mica leaves that sing when turned.",
          notable_features: "Contains the only intact copy of the lost 'Cicero Codex Borealis'. Frost-lamps powered by aurora energy keep ink from fading.",
          lore: "Founded by the Shining Ones before the last axial tilt; scholars claim its vaults shift location whenever the Pole Star realigns.",
          affiliation: "Neutral—policed by the Varangian Archivists",
          linked_arcana: "The Hermit"
        },
        {
          name: "Citadel of Borealis",
          other_names: ["The Chrono-Fortress"],
          sensory_description: "A towering structure of shimmering ice and stone, surrounded by a swirling aurora. The air is crisp and filled with the scent of pine.",
          location: "Located in the heart of the Hyperborean Sea, surrounded by a vast expanse of ice and snow.",
          type: "Fortress-Observatory",
          description: "A hexagonal bastion perched on a basalt column rising from the Sea of Glass. Its ramparts double as an armillary sphere tracking convergent timelines.",
          notable_features: "Houses the Chrono-Bell whose toll resets minor paradoxes within a day's march.",
          lore: "Built by Roger de Flor's engineer-magi during the First Catalan Incursion; now garrisoned by knights of the Order of the Dragon.",
          affiliation: "Grand Catalan Company",
          linked_arcana: "The Tower"
        },
        {
          name: "Ironroot Mountains",
          other_names: ["The Orichalcum Peaks"],
          sensory_description: "A range of jagged peaks that glint with metallic hues, surrounded by the scent of molten metal and the sound of clanging hammers.",
          location: "Stretching across the western edge of Laurasia, bordering the Sea of Orichalcum.",
          type: "Mountain Range",
          description: "Jagged peaks shot through with metallic trees whose sap smelts into orichalcum.",
          notable_features: "Canyons echo with 'Smith-songs'—natural harmonics that temper blades left to resonate overnight.",
          lore: "Legend holds that the Kusanagi was re-forged here after shattering a dragon's scale.",
          affiliation: "Independent dwarf-clans & Hospitaller prospectors",
          linked_arcana: "Strength"
        },
        {
          name: "Selene Gate",
          type: "Moon-Temple & Portal",
          description: "Marble arch flanked by twin crescent pylons; at syzygy it opens a mirror-path to Gondwana's Shadow Coast.",
          notable_features: "Central altar floats on a column of lunar gravity, allowing weightless martial training.",
          lore: "Custodied by Salasa Atumari's tide-priests who levy 'silver tithes' for each crossing.",
          affiliation: "Salasa's Tide Cult",
          linked_arcana: "The High Priestess"
        },
        {
          name: "Hollow Spire",
          type: "Natural/Arcane Monolith",
          description: "A kilometer-high needle of obsidian with a spiraling cavity down its core; ascending winds produce organ-like drones.",
          notable_features: "Acoustics translate spoken vows into binding geasa enforced by the land itself.",
          lore: "Petrarch is prophesied to utter a verse here that will shatter Dagon's deterministic script.",
          affiliation: "Neutral—pilgrimage site for poets & oath-breakers alike",
          linked_arcana: "Judgement"
        }
      ];

      const processedLocations = locationsData.map((location, index) => {
        // Try to find matching SVG region for this location
        const matchingRegion = findMatchingRegion(location.name, regions);
        
        return {
          ...location,
          id: `loc-${index}`,
          coordinates: matchingRegion?.coordinates || generateCoordinates(index, locationsData.length),
          chapters: generateMockChapters(location.name),
          svgRegionId: matchingRegion?.id
        };
      });
      
      setLocations(processedLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const generateCoordinates = (index: number, total: number) => {
    // Generate coordinates in a circular pattern for demo
    const angle = (index / total) * 2 * Math.PI;
    const radius = 200;
    const centerX = 400;
    const centerY = 300;
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
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
                onToggleBookBoundaries={toggleBookBoundaries}
                onToggleChapterBoundaries={toggleChapterBoundaries}
                onToggleLocationLabels={toggleLocationLabels}
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
            overlayConfig={overlayConfig}
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