"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Location } from '../page';
import PangeaMap from './PangeaMap';
import { RegionalOverlay, useRegionalOverlay } from './RegionalOverlay';
import { OverlayControls } from './OverlayControls';

interface CountryData {
  id: string;
  name: string;
  description: string;
  population: string;
  ruler: string;
  culture: string;
  economy: string;
  notes: string;
  color: string;
}

interface InteractiveWorldMapProps {
  locations: Location[];
  onLocationClick: (location: Location) => void;
  selectedLocation: Location | null;
}

export function InteractiveWorldMap({ 
  locations, 
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
  
  // Start at a sane default zoom; avoid pushing the map out of view on mount
  const [mapZoom, setMapZoom] = useState(1.0);
  const [mapCenter, setMapCenter] = useState({ x: 0, y: 0 }); // Will be calculated after mount
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null); // Start with world view
  const [isPanMode, setIsPanMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  const currentTheme = { primary: '#10b981', secondary: '#047857', bg: 'from-emerald-500/20' };

  const handleLocationHover = (location: Location | null) => {
    setHoveredLocation(location);
  };

  const handleRegionClick = (regionId: string) => {
    // Filter out non-region elements like grids, backgrounds, etc.
    if (regionId && (regionId.toLowerCase().includes('grid') || regionId.toLowerCase().includes('_px') || regionId.toLowerCase().includes('background'))) {
      return;
    }
    
    console.log('Region clicked:', regionId);
    
    setSelectedRegion(regionId);
    
    // Set clicked region and get its color
    setClickedRegion(regionId);
    
    // Extract color for clicked region (same logic as hover)
    const regionElement = document.getElementById(regionId);
    if (regionElement) {
      const pathElements = regionElement.querySelectorAll('path, polygon, rect, circle') as NodeListOf<SVGElement>;
      let extractedColor = null;
      
      for (const pathElement of pathElements) {
        const classList = Array.from(pathElement.classList);
        const cssClass = classList.find(cls => cls.startsWith('cls-'));
        
        if (cssClass) {
          const baseColor = getColorFromCSSClass(cssClass);
          extractedColor = baseColor;
          break;
        }
      }
      
      if (!extractedColor && pathElements.length > 0) {
        const firstPath = pathElements[0];
        const computedStyle = window.getComputedStyle(firstPath);
        const fillColor = computedStyle.fill;
        
        if (fillColor && fillColor !== 'none' && !fillColor.includes('url(')) {
          const hexColor = rgbToHex(fillColor);
          extractedColor = hexColor;
        }
      }
      
      setClickedRegionColor(extractedColor || currentTheme.primary);
    }
    
    // Ensure country data exists for this region and set up for editing
    const currentData = getCurrentCountryData(regionId);
    console.log('Country data for region:', currentData);
    
    // Auto-open in edit mode when clicking on a region
    setTimeout(() => {
      setEditingData({ ...currentData });
      setIsEditing(true);
    }, 100); // Small delay to ensure the card appears first
    
    // Find location that matches this region
    const matchedLocation = locations.find(loc => 
      loc.name.toLowerCase().includes(regionId.toLowerCase()) ||
      regionId.toLowerCase().includes(loc.name.toLowerCase())
    );
    if (matchedLocation) {
      onLocationClick(matchedLocation);
    }
  };

  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredRegionColor, setHoveredRegionColor] = useState<string | null>(null);
  const [clickedRegion, setClickedRegion] = useState<string | null>(null);
  const [clickedRegionColor, setClickedRegionColor] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [countryData, setCountryData] = useState<Record<string, CountryData>>({});
  const [editingData, setEditingData] = useState<CountryData | null>(null);
  const [isTargetMode, setIsTargetMode] = useState(false);
  const [cursorCoordinates, setCursorCoordinates] = useState<{x: number, y: number, lat: number, lng: number} | null>(null);
  const [isLegendMinimized, setIsLegendMinimized] = useState(false);

  // Use the regional overlay hook for state management
  const { config: overlayConfig, updateConfig: updateOverlayConfig } = useRegionalOverlay();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('pangea-country-data');
    if (savedData) {
      try {
        setCountryData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to load country data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever countryData changes
  useEffect(() => {
    if (Object.keys(countryData).length > 0) {
      localStorage.setItem('pangea-country-data', JSON.stringify(countryData));
    }
  }, [countryData]);

  // Extract actual color from SVG element
  const extractColorFromRegion = (regionId: string): string => {
    const regionElement = document.getElementById(regionId);
    if (regionElement) {
      const pathElements = regionElement.querySelectorAll('path, polygon, rect, circle') as NodeListOf<SVGElement>;
      
      for (const pathElement of pathElements) {
        // First try to get the computed fill color directly from the browser
        const computedStyle = window.getComputedStyle(pathElement);
        const fillColor = computedStyle.fill;
        
        if (fillColor && fillColor !== 'none' && !fillColor.includes('url(')) {
          if (fillColor.startsWith('rgb')) {
            return rgbToHex(fillColor);
          }
          return fillColor;
        }
        
        // Fallback to CSS class mapping
        const classList = Array.from(pathElement.classList);
        const cssClass = classList.find(cls => cls.startsWith('cls-'));
        if (cssClass) {
          return getColorFromCSSClass(cssClass);
        }
      }
    }
    
    // Ultimate fallback
    return currentTheme.primary;
  };

  // Seed initial country data
  const getDefaultCountryData = (regionId: string): CountryData => {
    const formattedName = formatRegionName(regionId);
    const displayName = formattedName || regionId.replace(/[_-]/g, ' ') || 'Unknown Location';
    
    return {
      id: regionId,
      name: displayName,
      description: 'A mysterious land waiting to be explored and documented.',
      population: 'Unknown',
      ruler: 'To be determined',
      culture: 'Rich cultural heritage',
      economy: 'Developing',
      notes: 'Add your observations and discoveries here.',
      color: extractColorFromRegion(regionId)
    };
  };

  const getCurrentCountryData = (regionId: string): CountryData => {
    if (!countryData[regionId]) {
      const defaultData = getDefaultCountryData(regionId);
      setCountryData(prev => ({ ...prev, [regionId]: defaultData }));
      return defaultData;
    }
    return countryData[regionId];
  };

  const handleCloseCard = () => {
    setClickedRegion(null);
    setClickedRegionColor(null);
    setIsEditing(false);
    setEditingData(null);
  };

  const handleEdit = () => {
    if (clickedRegion) {
      const currentData = getCurrentCountryData(clickedRegion);
      setEditingData({ ...currentData });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (editingData && clickedRegion) {
      setCountryData(prev => ({ ...prev, [clickedRegion]: editingData }));
      setIsEditing(false);
      setEditingData(null);
      console.log('Saved country data:', editingData);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingData(null);
  };

  const handleFieldChange = (field: keyof CountryData, value: string) => {
    if (editingData) {
      setEditingData(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleRegionHover = (regionId: string | null) => {
    // Filter out non-region elements like grids, backgrounds, etc.
    if (regionId && (regionId.toLowerCase().includes('grid') || regionId.toLowerCase().includes('_px') || regionId.toLowerCase().includes('background'))) {
      return;
    }
    
    // Don't process if already hovering the same region
    if (hoveredRegion === regionId) return;
    
    setHoveredRegion(regionId);
    
    // Simplified - just use default theme color to avoid performance issues
    if (regionId) {
      setHoveredRegionColor(currentTheme.primary);
    } else {
      setHoveredRegionColor(null);
    }
  };

  // Helper function to convert RGB color to hex
  const rgbToHex = (rgb: string) => {
    // Handle different RGB formats: rgb(r,g,b), rgba(r,g,b,a), or already hex
    if (rgb.startsWith('#')) return rgb;
    
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]); 
      const b = parseInt(match[3]);
      return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      }).join('');
    }
    return rgb; // Return as-is if we can't parse it
  };

  // Helper function to get base color from CSS class
  const getColorFromCSSClass = (cssClass: string) => {
    // Colors extracted from the actual SVG CSS definitions - comprehensive mapping
    const colorMap: Record<string, string> = {
      'cls-1': '#336',       // Dark blue
      'cls-2': '#684400',    // Brown  
      'cls-3': '#0af279',    // Bright green
      'cls-4': '#9c3',       // Yellow-green
      'cls-5': '#ee82ee',    // Violet (convert 'violet' to hex)
      'cls-6': '#696',       // Green
      'cls-7': '#630',       // Dark red-brown
      'cls-8': '#06c',       // Blue
      'cls-9': '#3e1568',    // Dark purple
      'cls-10': '#963',      // Brown-red
      'cls-11': '#9f9',      // Light green
      'cls-12': '#c0c',      // Magenta
      'cls-14': '#cf3',      // Yellow-green
      'cls-15': '#c6f',      // Light magenta
      'cls-16': '#330',      // Dark brown
      'cls-17': '#c6f',      // Light magenta
      'cls-18': '#7dca97',   // Light green
      'cls-19': '#399',      // Teal
      'cls-20': '#900',      // Dark red
      'cls-21': '#300',      // Dark maroon
      'cls-22': '#03c',      // Dark blue
      'cls-23': '#4282a3',   // Blue-gray
      'cls-24': '#ea97d5',   // Pink
      'cls-25': '#693',      // Green
      'cls-26': '#003',      // Dark blue
      'cls-27': '#d85319',   // Orange-red
      'cls-28': '#f36',      // Pink-red
      'cls-29': '#309',      // Purple
      'cls-30': '#fdfffe',   // White
      'cls-31': '#c90',      // Orange
      'cls-32': '#393939',   // Gray
      'cls-33': '#fff',      // White
      'cls-34': '#cf6',      // Light yellow-green
      'cls-35': '#cf6',      // Light yellow-green
      'cls-36': '#4e1a82',   // Purple
      'cls-37': '#f3c',      // Pink
      'cls-38': '#356882',   // Blue-gray
      'cls-39': '#0c9',      // Cyan
      'cls-40': '#966',      // Brown-red
      'cls-41': '#9c9',      // Light green
      'cls-42': '#39f',      // Light blue
      'cls-43': '#821a1a',   // Dark red
      'cls-44': '#350035',   // Dark purple
      'cls-45': '#3f0',      // Bright green
      'cls-46': '#0c6',      // Green
      'cls-47': '#681515',   // Dark red
      'cls-48': '#33f',      // Blue
      'cls-49': '#390',      // Dark green
      'cls-50': '#9f0',      // Bright green
      'cls-51': '#ffd17d',   // Light orange
      'cls-52': '#c06',      // Purple-red
      'cls-53': '#f6c',      // Pink
      'cls-54': '#c63',      // Orange-red
      // Common duplicates and high-numbered classes
      'cls-105': '#9c9',     // Light green (same as cls-41)
      'cls-106': '#696',     // Green (same as cls-6) 
      'cls-111': '#336',     // Dark blue (same as cls-1)
      'cls-133': '#393939',  // Gray (same as cls-32)
      'cls-210': '#4282a3',  // Blue-gray (same as cls-23)
      'cls-212': '#336',     // Dark blue (same as cls-1)
      'cls-223': '#4282a3',  // Blue-gray (same as cls-23)
      'cls-250': '#4282a3',  // Blue-gray (same as cls-23)
      'cls-292': '#336',     // Dark blue (same as cls-1)
      'cls-298': '#c0c',     // Magenta (same as cls-12)
      'cls-312': '#393939',  // Gray (same as cls-32)
      'cls-327': '#ee82ee',  // Violet (same as cls-5)
      'cls-333': '#4282a3',  // Blue-gray (same as cls-23)
    };
    
    return colorMap[cssClass] || '#336'; // Default blue color
  };


  const formatRegionName = (regionId: string) => {
    if (!regionId) return '';
    
    let formatted = regionId
      .replace(/[_-]/g, ' ')
      .replace(/^\d+\s*-\s*/, '')
      .replace(/^SMT\s*[\d.]+\s*-\s*/, '')
      .replace(/^Part\s*[IVX]+:\s*/, '')
      .replace(/^Book\s*\d+\s*-\s*/, '')
      .trim();
    
    // Capitalize each word for proper country names
    formatted = formatted.replace(/\b\w+/g, word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    
    return formatted || regionId; // Fallback to original if formatting fails
  };

  const extractChapterNumber = (regionId: string) => {
    if (!regionId) return null;
    const patterns = [
      /^(\d+)\s*-\s*/, // "360 - Panama" format
      /^_(\d+)_-_/, // "_304_-_Granada" format
      /^SMT\s*([\d.]+)\s*-\s*/, // "SMT 8.8 - Title" format
    ];
    
    for (const pattern of patterns) {
      const match = regionId.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Disable initial positioning to prevent flashing
  // useEffect(() => {
  //   setMapZoom(1.0);
  // }, []);

  // Avoid auto-centering on mount; use the button to center if desired

  // Simple resize handler - no automatic recalculation to prevent issues
  useEffect(() => {
    const handleResize = () => {
      // Window resized
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    const mapContainer = document.querySelector('.flex-1.relative');
    if (!mapContainer) return;
    
    const rect = mapContainer.getBoundingClientRect();
    const viewport = {
      width: rect.width,
      height: rect.height
    };
    
    // Get the center point of the viewport
    const viewportCenterX = viewport.width / 2;
    const viewportCenterY = viewport.height / 2;
    
    // Calculate the world coordinates at the viewport center
    const worldX = (viewportCenterX - mapCenter.x) / mapZoom;
    const worldY = (viewportCenterY - mapCenter.y) / mapZoom;
    
    // Calculate new zoom level
    const zoomFactor = direction === 'in' ? 1.2 : 1 / 1.2;
    const newZoom = Math.max(0.1, Math.min(50, mapZoom * zoomFactor));
    
    // Calculate new center to keep the same world point at viewport center
    const newCenterX = viewportCenterX - worldX * newZoom;
    const newCenterY = viewportCenterY - worldY * newZoom;
    
    setMapZoom(newZoom);
    setMapCenter({ x: newCenterX, y: newCenterY });
  };

  const resetView = () => {
    // Reset to default view - center map in viewport
    setMapCenter({ x: 0, y: 0 });
    setMapZoom(1.0);
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
      
      const zoom = 14.281; // Same zoom as initial view
      
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

  // Set initial view to focus on The Roman Empire coordinates when map is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      focusOnOrigin(); // Focus on the Roman Empire location
    }, 1500); // Wait for SVG to load and render
    
    return () => clearTimeout(timer);
  }, []);

  // Removed unused focus helper to satisfy no-unused-vars

  const togglePanMode = () => {
    setIsPanMode(!isPanMode);
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const toggleTargetMode = () => {
    setIsTargetMode(!isTargetMode);
    setCursorCoordinates(null);
  };

  // Convert SVG coordinates to approximate lat/lng
  // This is a simplified conversion for Pangea - you may need to adjust based on your map projection
  const svgToLatLng = (svgX: number, svgY: number) => {
    // SVG viewBox is "0 0 3306.216 3200.83"
    // Map these to approximate world coordinates
    const svgWidth = 3306.216;
    const svgHeight = 3200.83;
    
    // Convert to normalized coordinates (0-1)
    const normalizedX = svgX / svgWidth;
    const normalizedY = svgY / svgHeight;
    
    // Convert to lat/lng (approximate for Pangea)
    // Longitude: -180 to 180 degrees
    const lng = (normalizedX * 360) - 180;
    
    // Latitude: 85 to -85 degrees (Mercator projection limits)
    const lat = 85 - (normalizedY * 170);
    
    return { lat: Math.round(lat * 1000) / 1000, lng: Math.round(lng * 1000) / 1000 };
  };

  // Removed inverse lat/lng converter (unused)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPanMode) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - mapCenter.x,
      y: e.clientY - mapCenter.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Handle pan mode dragging
    if (isDragging && isPanMode) {
      setMapCenter({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      return;
    }
    
    // Handle target mode coordinate tracking
    if (isTargetMode) {
      const mapContainer = e.currentTarget as HTMLElement;
      const rect = mapContainer.getBoundingClientRect();
      
      // Get mouse position relative to the map container
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Convert screen coordinates to SVG coordinates
      // Account for map transformations (zoom and pan)
      const svgX = (mouseX - mapCenter.x) / mapZoom;
      const svgY = (mouseY - mapCenter.y) / mapZoom;
      
      // Convert to lat/lng
      const { lat, lng } = svgToLatLng(svgX, svgY);
      
      setCursorCoordinates({
        x: mouseX,
        y: mouseY,
        lat,
        lng
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={`relative w-full h-full overflow-hidden bg-blue-50 dark:bg-slate-700 ${
        isTargetMode ? 'cursor-crosshair' : 
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
          selectedRegion={selectedRegion}
          onRegionClick={handleRegionClick}
          onRegionHover={handleRegionHover}
          zoom={1.0}
          isPanMode={isPanMode}
          showGrid={showGrid}
          onReady={() => {
            // Ensure we only center after SVG is ready to avoid flicker
            // No-op for now; we already center in a delayed effect
          }}
        />
        
        {/* Regional Overlay */}
        <RegionalOverlay
          svgContainer={svgRef.current}
          config={overlayConfig}
          onRegionClick={(regionId, regionType) => {
            console.log(`Clicked ${regionType} region:`, regionId);
            // Handle regional overlay clicks
            if (regionType === 'book' || regionType === 'chapter') {
              setSelectedRegion(regionId);
            }
          }}
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

        {/* Target Mode Toggle */}
        <motion.button
          onClick={toggleTargetMode}
          className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center transition-colors ${
            isTargetMode 
              ? 'bg-orange-600 hover:bg-orange-700 text-white' 
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isTargetMode ? 'Exit coordinate mode' : 'Show coordinates'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            <circle cx="12" cy="12" r="3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
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
          title="Return to initial map view"
        >
          <span className="text-xs font-bold">🏠</span>
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


      {/* Region Hover Tooltip */}
      <AnimatePresence>
        {hoveredRegion && !clickedRegion && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="text-white rounded-xl shadow-2xl backdrop-blur-md border-2 px-6 py-4"
              style={{
                backgroundColor: hoveredRegionColor || currentTheme.primary,
                borderColor: currentTheme.primary,
                maxWidth: '400px'
              }}
            >
              {/* Chapter/Day Number */}
              {extractChapterNumber(hoveredRegion) && (
                <div 
                  className="text-center mb-3 px-3 py-1 rounded-full font-bold text-sm"
                  style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    display: 'inline-block',
                    minWidth: '60px'
                  }}
                >
                  {extractChapterNumber(hoveredRegion)?.includes('.') 
                    ? `Chapter ${extractChapterNumber(hoveredRegion)}` 
                    : `Day ${extractChapterNumber(hoveredRegion)}`}
                </div>
              )}
              
              {/* Location Name */}
              <div 
                className="font-bold text-center text-lg mb-2"
                style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                {formatRegionName(hoveredRegion) || 'Unknown Location'}
              </div>
              
              {/* Instruction */}
              <div 
                className="text-center mt-2 text-xs opacity-75"
                style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                Click to explore this location
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clicked Region Card (Sticky) */}
      <AnimatePresence>
        {clickedRegion && (
          <motion.div
            className="fixed inset-4 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="text-white rounded-xl shadow-2xl backdrop-blur-md border-2 px-6 py-4 relative max-h-full overflow-y-auto pointer-events-auto"
              style={{
                backgroundColor: countryData[clickedRegion]?.color || clickedRegionColor || currentTheme.primary,
                borderColor: currentTheme.primary,
                maxWidth: '500px',
                minWidth: '400px',
                width: '90vw'
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseCard}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center text-sm font-bold transition-colors z-10"
                style={{ lineHeight: 1 }}
              >
                ×
              </button>
              
              {/* Edit Button - Only show when not editing */}
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="absolute top-2 right-10 px-3 py-1 rounded-md bg-black/50 hover:bg-black/70 text-white text-xs font-medium transition-colors"
                >
                  Edit
                </button>
              )}
              
              {/* Chapter/Day Number */}
              {extractChapterNumber(clickedRegion) && (
                <div 
                  className="text-center mb-3 px-3 py-1 rounded-full font-bold text-sm"
                  style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    display: 'inline-block',
                    minWidth: '60px'
                  }}
                >
                  {extractChapterNumber(clickedRegion)?.includes('.') 
                    ? `Chapter ${extractChapterNumber(clickedRegion)}` 
                    : `Day ${extractChapterNumber(clickedRegion)}`}
                </div>
              )}
              
              {(() => {
                const currentData = getCurrentCountryData(clickedRegion);
                const displayData = isEditing && editingData ? editingData : currentData;
                
                if (!displayData) return null;

                return (
                  <div className="space-y-3">
                    {/* Location Name */}
                    {isEditing ? (
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                          Name
                        </label>
                        <input
                          type="text"
                          value={displayData.name || ''}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          className="w-full px-3 py-2 rounded-md bg-black/30 text-white placeholder-white/70 border border-white/20 focus:border-white/50 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div 
                        className="font-bold text-center text-lg mb-2"
                        style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                      >
                        {displayData.name}
                      </div>
                    )}


                    {/* Description */}
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                        Description
                      </label>
                      {isEditing ? (
                        <textarea
                          value={displayData.description || ''}
                          onChange={(e) => handleFieldChange('description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 rounded-md bg-black/30 text-white placeholder-white/70 border border-white/20 focus:border-white/50 focus:outline-none resize-none"
                        />
                      ) : (
                        <div className="text-sm" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                          {displayData.description}
                        </div>
                      )}
                    </div>

                    {/* Population */}
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                        Population
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayData.population || ''}
                          onChange={(e) => handleFieldChange('population', e.target.value)}
                          className="w-full px-3 py-2 rounded-md bg-black/30 text-white placeholder-white/70 border border-white/20 focus:border-white/50 focus:outline-none"
                        />
                      ) : (
                        <div className="text-sm" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                          {displayData.population}
                        </div>
                      )}
                    </div>

                    {/* Ruler */}
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                        Ruler/Leader
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayData.ruler || ''}
                          onChange={(e) => handleFieldChange('ruler', e.target.value)}
                          className="w-full px-3 py-2 rounded-md bg-black/30 text-white placeholder-white/70 border border-white/20 focus:border-white/50 focus:outline-none"
                        />
                      ) : (
                        <div className="text-sm" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                          {displayData.ruler}
                        </div>
                      )}
                    </div>

                    {/* Culture */}
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                        Culture
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayData.culture || ''}
                          onChange={(e) => handleFieldChange('culture', e.target.value)}
                          className="w-full px-3 py-2 rounded-md bg-black/30 text-white placeholder-white/70 border border-white/20 focus:border-white/50 focus:outline-none"
                        />
                      ) : (
                        <div className="text-sm" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                          {displayData.culture}
                        </div>
                      )}
                    </div>

                    {/* Economy */}
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                        Economy
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayData.economy || ''}
                          onChange={(e) => handleFieldChange('economy', e.target.value)}
                          className="w-full px-3 py-2 rounded-md bg-black/30 text-white placeholder-white/70 border border-white/20 focus:border-white/50 focus:outline-none"
                        />
                      ) : (
                        <div className="text-sm" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                          {displayData.economy}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                        Notes
                      </label>
                      {isEditing ? (
                        <textarea
                          value={displayData.notes || ''}
                          onChange={(e) => handleFieldChange('notes', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 rounded-md bg-black/30 text-white placeholder-white/70 border border-white/20 focus:border-white/50 focus:outline-none resize-none"
                        />
                      ) : (
                        <div className="text-sm" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                          {displayData.notes}
                        </div>
                      )}
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                        Country Color
                      </label>
                      {isEditing ? (
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={displayData.color || '#000000'}
                            onChange={(e) => handleFieldChange('color', e.target.value)}
                            className="w-12 h-10 rounded-md border border-white/20 bg-transparent cursor-pointer"
                            title="Choose country color"
                          />
                          <input
                            type="text"
                            value={displayData.color || ''}
                            onChange={(e) => handleFieldChange('color', e.target.value)}
                            className="flex-1 px-3 py-2 rounded-md bg-black/30 text-white placeholder-white/70 border border-white/20 focus:border-white/50 focus:outline-none"
                            placeholder="#000000"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded-md border-2 border-white/30"
                            style={{ backgroundColor: displayData.color }}
                          />
                          <div className="text-sm" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                            {displayData.color}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex space-x-2 pt-3 border-t border-white/30">
                        <button
                          onClick={handleSave}
                          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coordinate Tooltip */}
      <AnimatePresence>
        {isTargetMode && cursorCoordinates && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{
              left: cursorCoordinates.x + 15,
              top: cursorCoordinates.y - 35
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1 }}
          >
            <div className="bg-black/90 text-white px-3 py-2 rounded-lg shadow-lg border border-orange-500/50 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <div>Lat: {cursorCoordinates.lat}°</div>
                  <div>Lng: {cursorCoordinates.lng}°</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Legend & Controls */}
      <motion.div 
        className="absolute bottom-4 left-4 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-xs"
        initial={false}
        animate={{
          height: isLegendMinimized ? 'auto' : 'auto'
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Header with minimize button */}
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="font-medium text-gray-900 dark:text-white">Map Legend</h3>
          <motion.button
            onClick={() => setIsLegendMinimized(!isLegendMinimized)}
            className="w-6 h-6 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isLegendMinimized ? 'Expand legend' : 'Minimize legend'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isLegendMinimized ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              )}
            </svg>
          </motion.button>
        </div>

        <AnimatePresence>
          {!isLegendMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-4 space-y-4"
            >
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                    #
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Chapter count</span>
                </div>
                {showGrid && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-blue-500 opacity-30" style={{ borderStyle: 'dashed' }}></div>
                    <span className="text-gray-600 dark:text-gray-400">Coordinate grid</span>
                  </div>
                )}
                {isTargetMode && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">Coordinate targeting</span>
                  </div>
                )}
              </div>

              {/* Overlay Controls */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <OverlayControls 
                  config={overlayConfig} 
                  onConfigChange={updateOverlayConfig} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
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