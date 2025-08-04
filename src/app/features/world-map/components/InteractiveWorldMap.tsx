"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Location } from '../page';
import PangeaMap from './PangeaMap';
import { CameraSettings } from '../utils/mapNavigation';

interface InteractiveWorldMapProps {
  locations: Location[];
  activeTimeline: 'alpha' | 'beta' | 'gamma';
  onLocationClick: (location: Location) => void;
  selectedLocation: Location | null;
}

export function InteractiveWorldMap({ 
  locations, 
  activeTimeline, 
  onLocationClick, 
  selectedLocation 
}: InteractiveWorldMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  // Coordinates to center on Mediterranean/Europe/North Africa region (target screenshot)
  // Current view shows Northern Asia/Russia, target shows Mediterranean/Europe/Arabia
  // Need to move significantly SOUTH and WEST from current position
  // Based on geographical analysis: move from Northern Asia to Mediterranean
  const mapOriginX = 1500; // Move WEST from Northern Asia to Europe
  const mapOriginY = 1600; // Move SOUTH from Northern Asia to Mediterranean
  
  // Initial view: Start with 1x zoom, then set to 5x after mount
  const [mapZoom, setMapZoom] = useState(1.0);
  const [mapCenter, setMapCenter] = useState({ x: 0, y: 0 }); // Will be calculated after mount
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null); // Start with world view
  const [isPanMode, setIsPanMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  const timelineColors = {
    alpha: { primary: '#10b981', secondary: '#047857', bg: 'from-emerald-500/20' },
    beta: { primary: '#f59e0b', secondary: '#d97706', bg: 'from-amber-500/20' },
    gamma: { primary: '#8b5cf6', secondary: '#7c3aed', bg: 'from-violet-500/20' }
  };

  const currentTheme = timelineColors[activeTimeline];

  const handleLocationHover = (location: Location | null) => {
    setHoveredLocation(location);
  };

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
    // Find location that matches this region
    const matchedLocation = locations.find(loc => 
      loc.name.toLowerCase().includes(regionId.toLowerCase()) ||
      regionId.toLowerCase().includes(loc.name.toLowerCase())
    );
    if (matchedLocation) {
      onLocationClick(matchedLocation);
    }
  };

  const handleRegionHover = (regionId: string | null) => {
    // Optional: show region name in tooltip
    console.log('Hovering region:', regionId);
  };

  // Set initial view on component mount - direct coordinate approach
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Setting initial view to 5x zoom at (0,0)');
      console.log('Map origin coordinates:', mapOriginX, mapOriginY);
      
      // Use direct calculation to center the origin point
      const mapContainer = document.querySelector('.flex-1.relative');
      if (mapContainer) {
        const rect = mapContainer.getBoundingClientRect();
        const viewport = { width: rect.width, height: rect.height };
        
        const zoom = 14.281; // Increased by 1.3x (10.985 × 1.3 = 14.281)
        
        // Direct approach: translate map so origin appears at viewport center
        // Move 11% to the right + 105 pixels by subtracting percentage and adding fixed pixel offset
        // Move 425% north (470% - 45%) by subtracting 425% of viewport height from centerY
        const centerX = (viewport.width / 2 - mapOriginX) - (viewport.width * 0.11) + 105;
        const centerY = (viewport.height / 2 - mapOriginY) - (viewport.height * 4.25);
        
        console.log('Initial view - viewport center:', viewport.width / 2, viewport.height / 2);
        console.log('Initial view - translation:', centerX.toFixed(1), centerY.toFixed(1));
        
        setMapZoom(zoom);
        setMapCenter({ x: centerX, y: centerY });
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []); // Remove dependencies to prevent re-renders

  // Simple resize handler - no automatic recalculation to prevent issues
  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized - you may need to manually refocus on origin');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    setMapZoom(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.5, Math.min(10, newZoom));
    });
  };

  const resetView = () => {
    // Reset to default view - center map in viewport
    setMapCenter({ x: 0, y: 0 });
    setMapZoom(1.0);
  };

  const focusOnRegion = (cameraSettings: CameraSettings) => {
    setMapCenter(cameraSettings.center);
    setMapZoom(cameraSettings.zoom);
  };


  const focusOnOrigin = () => {
    // Get actual viewport dimensions from the map container
    const mapContainer = document.querySelector('.flex-1.relative');
    if (mapContainer) {
      const rect = mapContainer.getBoundingClientRect();
      const viewport = {
        width: rect.width,
        height: rect.height
      };
      
      console.log('=== Focus on Origin Debug ===');
      console.log('Viewport dimensions:', viewport);
      console.log('Map origin coordinates:', mapOriginX, mapOriginY);
      
      const zoom = 14.281; // Increased by 1.3x (10.985 × 1.3 = 14.281)
      
      // Direct calculation: move the map so origin appears at center
      // Move 11% to the right + 105px by subtracting percentage and adding fixed pixel offset
      // Move 425% north (470% - 45%) by subtracting 425% of viewport height from centerY
      const centerX = (viewport.width / 2 - mapOriginX) - (viewport.width * 0.11) + 105;
      const centerY = (viewport.height / 2 - mapOriginY) - (viewport.height * 4.25);
      
      console.log('Centering Europe/Africa region at coordinates:', mapOriginX, mapOriginY);
      console.log('Viewport center:', viewport.width / 2, viewport.height / 2);
      console.log('Translation needed:', centerX, centerY);
      
      setMapZoom(zoom);
      setMapCenter({ x: centerX, y: centerY });
    } else {
      console.error('Could not find map container');
    }
  };

  const togglePanMode = () => {
    setIsPanMode(!isPanMode);
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPanMode) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - mapCenter.x,
      y: e.clientY - mapCenter.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isPanMode) return;
    
    setMapCenter({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={`relative w-full h-full overflow-hidden bg-slate-800 ${
        isPanMode ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* SVG Map Background */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translate(${mapCenter.x}px, ${mapCenter.y}px) scale(${mapZoom})`,
          transformOrigin: 'center'
        }}
      >
        <PangeaMap
          ref={svgRef}
          activeTimeline={activeTimeline}
          selectedRegion={selectedRegion}
          onRegionClick={handleRegionClick}
          onRegionHover={handleRegionHover}
          zoom={1.0}
          isPanMode={isPanMode}
          showGrid={showGrid}
        />
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        {/* Grid Toggle */}
        <motion.button
          onClick={toggleGrid}
          className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center transition-colors ${
            showGrid 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={showGrid ? 'Hide coordinate grid' : 'Show coordinate grid'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
        </motion.button>
        
        {/* Pan Mode Toggle */}
        <motion.button
          onClick={togglePanMode}
          className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center transition-colors ${
            isPanMode 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isPanMode ? 'Exit pan mode' : 'Enable pan mode'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isPanMode ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            )}
          </svg>
        </motion.button>
        <motion.button
          onClick={() => handleZoom('in')}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg font-bold text-gray-700 dark:text-gray-300">+</span>
        </motion.button>
        <motion.button
          onClick={() => handleZoom('out')}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg font-bold text-gray-700 dark:text-gray-300">−</span>
        </motion.button>
        <motion.button
          onClick={focusOnOrigin}
          className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg flex items-center justify-center transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Focus on (0,0) at 5x zoom"
        >
          <span className="text-xs font-bold">0,0</span>
        </motion.button>
        <motion.button
          onClick={resetView}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Reset view"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </motion.button>
      </div>

      {/* Timeline Indicator */}
      <div className="absolute top-4 left-4 z-20">
        <motion.div
          className={`px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r ${currentTheme.bg} backdrop-blur-sm border border-white/20`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentTheme.primary }}
            />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {activeTimeline.charAt(0).toUpperCase() + activeTimeline.slice(1)} Timeline
            </span>
            {selectedRegion && (
              <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                • {selectedRegion.replace(/[_-]/g, ' ')}
              </span>
            )}
          </div>
        </motion.div>
      </div>


      {/* Map Container */}
      <div 
        ref={mapRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${mapCenter.x}px, ${mapCenter.y}px) scale(${mapZoom})`,
          transformOrigin: 'center'
        }}
      >
        {/* Locations */}
        {locations.map((location, index) => {
          const isSelected = selectedLocation?.id === location.id;
          const isHovered = hoveredLocation?.id === location.id;
          
          return (
            <motion.div
              key={location.id}
              className={`absolute group ${isPanMode ? 'pointer-events-none' : 'cursor-pointer pointer-events-auto'}`}
              style={{
                left: location.coordinates?.x || 400 + (index * 50),
                top: location.coordinates?.y || 300 + (index * 50)
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onLocationClick(location)}
              onMouseEnter={() => handleLocationHover(location)}
              onMouseLeave={() => handleLocationHover(null)}
            >
              {/* Location Ring */}
              <motion.div
                className={`absolute inset-0 rounded-full border-2 ${
                  isSelected ? 'border-4' : ''
                }`}
                style={{
                  borderColor: isSelected || isHovered ? currentTheme.primary : currentTheme.secondary,
                  width: isSelected ? '60px' : '50px',
                  height: isSelected ? '60px' : '50px',
                  marginLeft: isSelected ? '-5px' : '0',
                  marginTop: isSelected ? '-5px' : '0'
                }}
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  borderColor: isSelected || isHovered ? currentTheme.primary : currentTheme.secondary
                }}
                transition={{ duration: 0.2 }}
              />
              
              {/* Location Dot */}
              <motion.div
                className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                style={{ 
                  backgroundColor: isSelected || isHovered ? currentTheme.primary : currentTheme.secondary 
                }}
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  backgroundColor: isSelected || isHovered ? currentTheme.primary : currentTheme.secondary
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {getLocationIcon(location.linked_arcana)}
              </motion.div>

              {/* Location Name Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs text-gray-300 mt-1">{location.type}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chapter Indicators */}
              {location.chapters && location.chapters.length > 0 && (
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {location.chapters.length}
                </motion.div>
              )}

              {/* Arcana Badge */}
              <motion.div
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                🃏
              </motion.div>
            </motion.div>
          );
        })}

        {/* Connection Lines (for related locations) */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {locations.map((location, index) => {
            if (index === 0) return null;
            const prevLocation = locations[index - 1];
            const startX = (prevLocation.coordinates?.x || 400) + 25;
            const startY = (prevLocation.coordinates?.y || 300) + 25;
            const endX = (location.coordinates?.x || 400) + 25;
            const endY = (location.coordinates?.y || 300) + 25;

            return (
              <motion.line
                key={`connection-${index}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={currentTheme.secondary}
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Map Legend</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
              #
            </div>
            <span className="text-gray-600 dark:text-gray-400">Chapter count</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs">
              🃏
            </div>
            <span className="text-gray-600 dark:text-gray-400">Linked Arcana</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-gray-400" style={{ borderStyle: 'dashed' }}></div>
            <span className="text-gray-600 dark:text-gray-400">Timeline connections</span>
          </div>
          {showGrid && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border border-blue-500 opacity-30" style={{ borderStyle: 'dashed' }}></div>
              <span className="text-gray-600 dark:text-gray-400">Coordinate grid</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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