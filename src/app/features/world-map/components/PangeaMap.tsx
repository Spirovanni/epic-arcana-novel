"use client";

import React, { forwardRef, useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface PangeaMapProps {
  activeTimeline: 'alpha' | 'beta' | 'gamma';
  selectedRegion: string | null;
  onRegionClick: (regionId: string) => void;
  onRegionHover: (regionId: string | null) => void;
  zoom: number;
  center: { x: number; y: number };
  isPanMode?: boolean;
  showGrid?: boolean;
}

const PangeaMap = forwardRef<HTMLDivElement, PangeaMapProps>(
  ({ activeTimeline, selectedRegion, onRegionClick, onRegionHover, zoom, center, isPanMode = false, showGrid = false }, ref) => {
    const [svgContent, setSvgContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      loadSVG();
    }, []);

    const loadSVG = async () => {
      try {
        const response = await fetch('/Map_of_Pangea.svg');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const svgText = await response.text();
        setSvgContent(svgText);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading SVG:', error);
        setIsLoading(false);
      }
    };

    const applyTimelineStyles = useCallback((svg: SVGSVGElement, timeline: 'alpha' | 'beta' | 'gamma') => {
      const styleElement = svg.querySelector('style') || document.createElement('style');
      
      const timelineStyles = {
        alpha: `
          .timeline-alpha { filter: sepia(20%) saturate(0.8) hue-rotate(30deg); }
          .timeline-alpha g:hover { filter: brightness(1.2) saturate(1.2); }
          .timeline-alpha .selected { filter: brightness(1.4) saturate(1.4) drop-shadow(0 0 10px #10b981); }
        `,
        beta: `
          .timeline-beta { filter: sepia(30%) saturate(1.2) hue-rotate(200deg); }
          .timeline-beta g:hover { filter: brightness(1.2) saturate(1.4) hue-rotate(210deg); }
          .timeline-beta .selected { filter: brightness(1.4) saturate(1.6) hue-rotate(210deg) drop-shadow(0 0 10px #f59e0b); }
        `,
        gamma: `
          .timeline-gamma { filter: sepia(40%) saturate(1.5) hue-rotate(270deg); }
          .timeline-gamma g:hover { filter: brightness(1.3) saturate(1.6) hue-rotate(280deg); }
          .timeline-gamma .selected { filter: brightness(1.5) saturate(1.8) hue-rotate(280deg) drop-shadow(0 0 15px #8b5cf6); }
        `
      };

      const cursorStyle = isPanMode ? 'inherit' : 'pointer';
      const pointerEvents = isPanMode ? 'none' : 'auto';
      
      styleElement.textContent = [
        styleElement.textContent,
        timelineStyles[timeline],
        `
        g[id] {
          cursor: ${cursorStyle};
          pointer-events: ${pointerEvents};
          transition: none;
        }
        
        g[id]:hover {
          /* Disable all hover transformations to prevent jitter */
        }
        
        g[id].region-hovered {
          filter: brightness(1.15) saturate(1.2);
        }
        
        .region-tooltip {
          position: absolute;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          pointer-events: none;
          z-index: 1000;
          transform: translate(-50%, -100%);
          margin-top: -8px;
        }
        `
      ].join('\n');

      if (!svg.querySelector('style')) {
        svg.appendChild(styleElement);
      }

      // Apply timeline class to SVG
      svg.setAttribute('class', `timeline-${timeline}`);
    }, [isPanMode]);

    const handleRegionClickEvent = useCallback((event: Event) => {
      if (isPanMode) return;
      
      const target = event.currentTarget as SVGGElement;
      const regionId = target.id;
      if (regionId) {
        onRegionClick(regionId);
      }
    }, [isPanMode, onRegionClick]);

    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{x: number, y: number, viewportWidth: number, viewportHeight: number} | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastHoverTimeRef = useRef<number>(0);
    const HOVER_THROTTLE_MS = 150; // Minimum time between hover changes

    const showTooltip = useCallback((event: Event, regionId: string) => {
      // Prevent multiple simultaneous hovers
      if (hoveredRegion === regionId) return;
      
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      
      // Set with slight delay to prevent jittery behavior
      hoverTimeoutRef.current = setTimeout(() => {
        // Get viewport dimensions for centering
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight
        };
        
        console.log('Setting hover tooltip for region:', regionId);
        console.log('Viewport dimensions:', viewport);
        
        setHoveredRegion(regionId);
        setTooltipPosition({
          x: viewport.width / 2,  // Center horizontally
          y: viewport.height / 2, // Center vertically
          viewportWidth: viewport.width,
          viewportHeight: viewport.height
        });
      }, 50);
    }, [hoveredRegion]);

    const hideTooltip = useCallback(() => {
      // Clear timeout on leave
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      
      // Delay hiding to prevent flicker
      setTimeout(() => {
        setHoveredRegion(null);
        setTooltipPosition(null);
      }, 100);
    }, []);

    const handleRegionHoverEvent = useCallback((event: Event) => {
      console.log('Hover event triggered on region:', (event.currentTarget as SVGGElement)?.id);
      
      if (isPanMode) {
        console.log('Pan mode is enabled, ignoring hover');
        return;
      }
      
      // Stop event propagation to prevent multiple triggers
      event.stopPropagation();
      event.preventDefault();
      
      const target = event.currentTarget as SVGGElement;
      const regionId = target.id;
      
      // Throttle hover events
      const now = Date.now();
      if (now - lastHoverTimeRef.current < HOVER_THROTTLE_MS) {
        console.log('Hover throttled');
        return;
      }
      
      // Only process if it's a different region
      if (regionId && regionId !== hoveredRegion) {
        console.log('Processing hover for new region:', regionId);
        lastHoverTimeRef.current = now;
        
        // Clear any existing hover timeout
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        
        onRegionHover(regionId);
        showTooltip(event, regionId);
      }
    }, [isPanMode, onRegionHover, showTooltip, hoveredRegion, HOVER_THROTTLE_MS]);

    const handleRegionLeaveEvent = useCallback((event: Event) => {
      if (isPanMode) return;
      
      // Stop event propagation
      event.stopPropagation();
      event.preventDefault();
      
      const target = event.currentTarget as SVGGElement;
      const regionId = target.id;
      
      // Only hide if we're actually leaving the current hovered region
      if (regionId === hoveredRegion) {
        onRegionHover(null);
        hideTooltip();
      }
    }, [isPanMode, onRegionHover, hideTooltip, hoveredRegion]);

    const addGridToSVG = useCallback((svgElement: SVGSVGElement) => {
      if (!showGrid) return;

      try {
        // Remove existing grid if it exists
        const existingGrid = svgElement.querySelector('#coordinate-grid');
        if (existingGrid) {
          existingGrid.remove();
        }
      } catch (error) {
        console.error('Error removing existing grid:', error);
        return;
      }

      // SVG viewBox is "0 0 3306.216 3200.83"
      // Updated coordinates to center on Mediterranean/Europe/North Africa region
      const mapOriginX = 1500; // Move WEST to Europe/Mediterranean
      const mapOriginY = 1600; // Move SOUTH to Mediterranean from Northern Asia
      
      // Timeline colors
      const timelineColors = {
        alpha: '#10b981',
        beta: '#f59e0b', 
        gamma: '#8b5cf6'
      };
      
      const gridColor = timelineColors[activeTimeline];
      
      // Calculate grid spacing based on coordinate density analysis
      // 1 small box = 75 units, 4 small boxes = 300 units
      // Base spacing represents 4 smallest map boxes combined
      let gridSize = 300;
      if (zoom > 2) gridSize = 150;  // 2 small boxes
      if (zoom > 4) gridSize = 75;   // 1 small box
      if (zoom < 0.5) gridSize = 600; // 8 small boxes

      // Create grid group
      const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gridGroup.setAttribute('id', 'coordinate-grid');
      gridGroup.setAttribute('opacity', '0.6');

      // Generate grid lines covering the entire SVG viewBox
      const svgWidth = 3306.216;
      const svgHeight = 3200.83;
      
      // Vertical lines
      for (let x = -gridSize * 10; x <= gridSize * 10; x += gridSize) {
        const lineX = mapOriginX + x;
        if (lineX >= 0 && lineX <= svgWidth) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', lineX.toString());
          line.setAttribute('y1', '0');
          line.setAttribute('x2', lineX.toString());
          line.setAttribute('y2', svgHeight.toString());
          line.setAttribute('stroke', gridColor);
          line.setAttribute('stroke-width', '1');
          line.setAttribute('stroke-dasharray', '3,3');
          line.setAttribute('opacity', '0.4');
          gridGroup.appendChild(line);

          // Add coordinate label
          if (x % gridSize === 0) {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', lineX.toString());
            text.setAttribute('y', '20');
            text.setAttribute('fill', gridColor);
            text.setAttribute('font-size', '14');
            text.setAttribute('font-weight', '500');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = x.toString();
            gridGroup.appendChild(text);
          }
        }
      }
      
      // Horizontal lines
      for (let y = -gridSize * 10; y <= gridSize * 10; y += gridSize) {
        const lineY = mapOriginY + y;
        if (lineY >= 0 && lineY <= svgHeight) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', '0');
          line.setAttribute('y1', lineY.toString());
          line.setAttribute('x2', svgWidth.toString());
          line.setAttribute('y2', lineY.toString());
          line.setAttribute('stroke', gridColor);
          line.setAttribute('stroke-width', '1');
          line.setAttribute('stroke-dasharray', '3,3');
          line.setAttribute('opacity', '0.4');
          gridGroup.appendChild(line);

          // Add coordinate label
          if (y % gridSize === 0) {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '20');
            text.setAttribute('y', lineY.toString());
            text.setAttribute('fill', gridColor);
            text.setAttribute('font-size', '14');
            text.setAttribute('font-weight', '500');
            text.setAttribute('text-anchor', 'start');
            text.setAttribute('dominant-baseline', 'middle');
            text.textContent = (-y).toString(); // Invert Y for standard coordinates
            gridGroup.appendChild(text);
          }
        }
      }

      // Add origin marker
      const originCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      originCircle.setAttribute('cx', mapOriginX.toString());
      originCircle.setAttribute('cy', mapOriginY.toString());
      originCircle.setAttribute('r', '6');
      originCircle.setAttribute('fill', gridColor);
      originCircle.setAttribute('stroke', 'white');
      originCircle.setAttribute('stroke-width', '2');
      gridGroup.appendChild(originCircle);

      const originLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      originLabel.setAttribute('x', (mapOriginX + 10).toString());
      originLabel.setAttribute('y', (mapOriginY - 10).toString());
      originLabel.setAttribute('fill', gridColor);
      originLabel.setAttribute('font-size', '16');
      originLabel.setAttribute('font-weight', '600');
      originLabel.textContent = '(0,0)';
      gridGroup.appendChild(originLabel);

      // Insert grid as first child so it appears behind map content
      svgElement.insertBefore(gridGroup, svgElement.firstChild);
    }, [showGrid, activeTimeline, zoom]);

    const addRegionInteractivity = useCallback((svg: SVGSVGElement) => {
      const regions = svg.querySelectorAll('g[id]');
      
      regions.forEach(region => {
        const regionId = region.id;
        if (!regionId) return;

        // Remove existing event listeners first
        region.removeEventListener('click', handleRegionClickEvent);
        region.removeEventListener('mouseenter', handleRegionHoverEvent);
        region.removeEventListener('mouseleave', handleRegionLeaveEvent);

        // Add event handlers with passive option disabled for better control
        region.addEventListener('click', handleRegionClickEvent, { passive: false });
        region.addEventListener('mouseenter', handleRegionHoverEvent, { passive: false });
        region.addEventListener('mouseleave', handleRegionLeaveEvent, { passive: false });

        // Reset all hover classes first
        region.classList.remove('region-hovered');
        
        // Add hover class only for the currently hovered region
        if (hoveredRegion === regionId) {
          region.classList.add('region-hovered');
        }

        // Highlight selected region
        if (selectedRegion === regionId) {
          region.classList.add('selected');
        } else {
          region.classList.remove('selected');
        }
      });
    }, [handleRegionClickEvent, handleRegionHoverEvent, handleRegionLeaveEvent, selectedRegion, hoveredRegion]);

    useEffect(() => {
      if (!svgContent || !ref || typeof ref === 'function') return;
      
      try {
        const container = ref.current;
        if (!container) return;
        
        const svgElement = container.querySelector('svg');
        if (!svgElement) return;

        // Apply timeline-specific styling
        applyTimelineStyles(svgElement, activeTimeline);

        // Add grid if enabled
        addGridToSVG(svgElement);

        // Add interactivity to regions
        addRegionInteractivity(svgElement);

        return () => {
          try {
            // Cleanup event listeners
            const regions = svgElement.querySelectorAll('g[id]');
            regions.forEach(region => {
              region.removeEventListener('click', handleRegionClickEvent);
              region.removeEventListener('mouseenter', handleRegionHoverEvent);
              region.removeEventListener('mouseleave', handleRegionLeaveEvent);
            });
          } catch (cleanupError) {
            console.error('Error during cleanup:', cleanupError);
          }
        };
      } catch (error) {
        console.error('Error in PangeaMap useEffect:', error);
      }
    }, [svgContent, activeTimeline, selectedRegion, isPanMode, showGrid, applyTimelineStyles, addGridToSVG, addRegionInteractivity, handleRegionClickEvent, handleRegionHoverEvent, handleRegionLeaveEvent, ref]);

    const formatRegionName = (regionId: string) => {
      return regionId
        .replace(/[_-]/g, ' ')
        .replace(/^\d+\s*-\s*/, '')
        .replace(/^SMT\s*[\d.]+\s*-\s*/, '')
        .replace(/^Part\s*[IVX]+:\s*/, '')
        .replace(/^Book\s*\d+\s*-\s*/, '')
        .trim();
    };

    const extractChapterNumber = (regionId: string) => {
      // Extract chapter/day numbers from different formats
      const patterns = [
        /^_(\d+)_-_/, // _304_-_Granada format
        /^SMT\s*([\d.]+)\s*-\s*/, // SMT 8.8 - Pabulum format
        /^Book\s*(\d+)\s*-\s*/, // Book 8 - Title format
        /^Part\s*([IVX]+):\s*/, // Part III: Title format
        /^(\d+)\s*-\s*/ // Simple number format
      ];
      
      for (const pattern of patterns) {
        const match = regionId.match(pattern);
        if (match) {
          return match[1];
        }
      }
      return null;
    };

    const getRegionColor = (regionId: string, activeTimeline: string) => {
      // Timeline base colors
      const timelineColors = {
        alpha: { primary: '#10b981', secondary: '#047857', accent: '#6ee7b7' },
        beta: { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' },
        gamma: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' }
      };
      
      const colors = timelineColors[activeTimeline as keyof typeof timelineColors];
      
      // Vary color based on region type or chapter number
      const chapterNum = extractChapterNumber(regionId);
      if (chapterNum) {
        const num = parseInt(chapterNum) || 1;
        // Create color variations based on chapter number
        const hueShift = (num * 15) % 60; // Shift hue slightly
        return {
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
          background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}40)`,
          border: colors.accent
        };
      }
      
      return {
        primary: colors.primary,
        secondary: colors.secondary, 
        accent: colors.accent,
        background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}40)`,
        border: colors.accent
      };
    };

    if (isLoading) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <motion.div
            className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      );
    }

    return (
      <div className="w-full h-full relative">
        <div 
          ref={ref}
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
        
        {/* Enhanced Centered Tooltip - Rendered via Portal */}
        {hoveredRegion && tooltipPosition && (() => {
          console.log('Rendering tooltip for:', hoveredRegion, tooltipPosition);
          const regionColors = getRegionColor(hoveredRegion, activeTimeline);
          const chapterNumber = extractChapterNumber(hoveredRegion);
          const locationName = formatRegionName(hoveredRegion);
          
          return { regionColors, chapterNumber, locationName };
        })() && typeof document !== 'undefined' && createPortal(
          (() => {
            const regionColors = getRegionColor(hoveredRegion, activeTimeline);
            const chapterNumber = extractChapterNumber(hoveredRegion);
            const locationName = formatRegionName(hoveredRegion);
            
            return (
              <div
                className="fixed text-white rounded-xl shadow-2xl pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: regionColors.background,
                  backdropFilter: 'blur(8px)',
                  border: `3px solid ${regionColors.border}`,
                  boxShadow: `0 25px 50px rgba(0, 0, 0, 0.8), 0 0 0 1px ${regionColors.accent}40`,
                  maxWidth: `${Math.min(tooltipPosition.viewportWidth * 0.35, 450)}px`,
                  maxHeight: `${Math.min(tooltipPosition.viewportHeight * 0.35, 350)}px`,
                  padding: `${Math.max(tooltipPosition.viewportWidth * 0.015, 20)}px ${Math.max(tooltipPosition.viewportWidth * 0.02, 24)}px`,
                  fontSize: `${Math.max(tooltipPosition.viewportWidth * 0.012, 14)}px`,
                  zIndex: 999999,
                  position: 'fixed'
                }}
              >
                {/* Header with Chapter/Day Number */}
                {chapterNumber && (
                  <div 
                    className="text-center mb-3 px-3 py-1 rounded-full font-bold"
                    style={{ 
                      backgroundColor: regionColors.primary,
                      color: 'white',
                      fontSize: `${Math.max(tooltipPosition.viewportWidth * 0.01, 12)}px`,
                      display: 'inline-block',
                      minWidth: '60px'
                    }}
                  >
                    {chapterNumber.includes('.') ? `Chapter ${chapterNumber}` : `Day ${chapterNumber}`}
                  </div>
                )}
                
                {/* Location Name */}
                <div 
                  className="font-bold mb-3 text-center"
                  style={{ 
                    fontSize: `${Math.max(tooltipPosition.viewportWidth * 0.018, 20)}px`,
                    color: regionColors.accent,
                    textShadow: `0 2px 4px rgba(0,0,0,0.8)`
                  }}
                >
                  {locationName || 'Unknown Location'}
                </div>
                
                {/* Timeline Badge */}
                <div 
                  className="text-center text-sm font-medium"
                  style={{ 
                    color: regionColors.secondary,
                    fontSize: `${Math.max(tooltipPosition.viewportWidth * 0.01, 12)}px`
                  }}
                >
                  {activeTimeline.charAt(0).toUpperCase() + activeTimeline.slice(1)} Timeline
                </div>
                
                {/* Instruction */}
                <div 
                  className="text-center mt-2 opacity-75"
                  style={{ 
                    fontSize: `${Math.max(tooltipPosition.viewportWidth * 0.008, 10)}px`,
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  Click to explore this location
                </div>
              </div>
            );
          })(),
          document.body
        )}
      </div>
    );
  }
);

PangeaMap.displayName = 'PangeaMap';

export default PangeaMap;