"use client";

import React, { forwardRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface PangeaMapProps {
  selectedRegion: string | null;
  onRegionClick: (regionId: string) => void;
  onRegionHover: (regionId: string | null) => void;
  zoom: number;
  isPanMode?: boolean;
  showGrid?: boolean;
}

const PangeaMap = forwardRef<HTMLDivElement, PangeaMapProps>(
  ({ selectedRegion, onRegionClick, onRegionHover, zoom, isPanMode = false, showGrid = false }, ref) => {
    const [svgContent, setSvgContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      loadSVG();
    }, []);

    const loadSVG = async () => {
      try {
        console.log('Fetching SVG from /Map_of_Pangea.svg');
        const response = await fetch('/Map_of_Pangea.svg');
        console.log('SVG fetch response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let svgText = await response.text();
        console.log('SVG loaded successfully, length:', svgText.length, 'first 100 chars:', svgText.substring(0, 100));
        
        // Make the problematic black rectangles transparent instead of removing them
        svgText = svgText.replace(/class="cls-161"/g, 'class="cls-161" fill="none" stroke="none" opacity="0"');
        
        console.log('SVG processed, removed cls-161 rectangles');
        console.log('Final SVG length:', svgText.length);
        console.log('SVG starts with:', svgText.substring(0, 200));
        setSvgContent(svgText);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading SVG:', error);
        setIsLoading(false);
      }
    };

    const applyMapStyles = useCallback((svg: SVGSVGElement) => {
      const styleElement = svg.querySelector('style') || document.createElement('style');
      
      const cursorStyle = isPanMode ? 'inherit' : 'pointer';
      const pointerEvents = isPanMode ? 'none' : 'auto';
      
      styleElement.textContent = `
        svg {
          display: block;
          width: 100%;
          height: 100%;
          background: transparent;
        }
        
        
        g[id] {
          cursor: ${cursorStyle};
          pointer-events: ${pointerEvents};
          transition: none;
        }
        
        g[id]:hover {
          stroke: #10b981;
          stroke-width: 1px;
        }
        
        g[id].selected {
          stroke: #10b981;
          stroke-width: 2px;
        }
      `;

      if (!svg.querySelector('style')) {
        svg.appendChild(styleElement);
      }
    }, [isPanMode]);

    const handleRegionClickEvent = useCallback((event: Event) => {
      if (isPanMode) return;
      
      const target = event.currentTarget as SVGGElement;
      const regionId = target.id;
      if (regionId) {
        onRegionClick(regionId);
      }
    }, [isPanMode, onRegionClick]);


    const handleRegionHoverEvent = useCallback((event: Event) => {
      if (isPanMode) return;
      
      const target = event.currentTarget as SVGGElement;
      const regionId = target.id;
      
      if (regionId) {
        onRegionHover(regionId);
      }
    }, [isPanMode, onRegionHover]);

    const handleRegionLeaveEvent = useCallback(() => {
      if (isPanMode) return;
      
      onRegionHover(null);
    }, [isPanMode, onRegionHover]);

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
      
      const gridColor = '#10b981';
      
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
    }, [showGrid, zoom]);

    const addRegionInteractivity = useCallback((svg: SVGSVGElement) => {
      const regions = svg.querySelectorAll('g[id]');
      
      regions.forEach(region => {
        const regionId = region.id;
        if (!regionId) return;

        // Remove existing event listeners first
        region.removeEventListener('click', handleRegionClickEvent);
        region.removeEventListener('mouseenter', handleRegionHoverEvent);
        region.removeEventListener('mouseleave', handleRegionLeaveEvent);

        // Add event handlers
        region.addEventListener('click', handleRegionClickEvent);
        region.addEventListener('mouseenter', handleRegionHoverEvent);
        region.addEventListener('mouseleave', handleRegionLeaveEvent);

        // Highlight selected region
        if (selectedRegion === regionId) {
          region.classList.add('selected');
        } else {
          region.classList.remove('selected');
        }
      });
    }, [handleRegionClickEvent, handleRegionHoverEvent, handleRegionLeaveEvent, selectedRegion]);

    useEffect(() => {
      if (!svgContent || !ref || typeof ref === 'function') return;
      
      try {
        const container = ref.current;
        if (!container) {
          console.log('Container ref not found');
          return;
        }
        
        const svgElement = container.querySelector('svg');
        if (!svgElement) {
          console.log('SVG element not found in container');
          console.log('Container innerHTML length:', container.innerHTML.length);
          return;
        }

        console.log('SVG element found:', svgElement.tagName, 'viewBox:', svgElement.getAttribute('viewBox'));
        console.log('SVG dimensions:', svgElement.getAttribute('width'), 'x', svgElement.getAttribute('height'));

        // Apply map styling
        applyMapStyles(svgElement);

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
    }, [svgContent, selectedRegion, isPanMode, showGrid]);


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
        {svgContent ? (
          <div 
            ref={ref}
            className="w-full h-full"
            style={{ backgroundColor: 'transparent' }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="text-red-500 mb-2">SVG Content Not Loaded</div>
              <div className="text-sm text-gray-600">Check console for errors</div>
            </div>
          </div>
        )}
        
      </div>
    );
  }
);

PangeaMap.displayName = 'PangeaMap';

export default PangeaMap;