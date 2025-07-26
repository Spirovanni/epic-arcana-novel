"use client";

import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface PangeaMapProps {
  activeTimeline: 'alpha' | 'beta' | 'gamma';
  selectedRegion: string | null;
  onRegionClick: (regionId: string) => void;
  onRegionHover: (regionId: string | null) => void;
  zoom: number;
  center: { x: number; y: number };
  isPanMode?: boolean;
}

const PangeaMap = forwardRef<HTMLDivElement, PangeaMapProps>(
  ({ activeTimeline, selectedRegion, onRegionClick, onRegionHover, zoom, center, isPanMode = false }, ref) => {
    const [svgContent, setSvgContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      loadSVG();
    }, []);

    const loadSVG = async () => {
      try {
        const response = await fetch('/Map_of_Pangea.svg');
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
          transition: all 0.3s ease;
          pointer-events: ${pointerEvents};
        }
        
        g[id]:hover {
          transform: scale(1.02);
          transform-origin: center;
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

    const showTooltip = useCallback((event: Event, regionId: string) => {
      const mouseEvent = event as MouseEvent;
      const tooltip = document.createElement('div');
      tooltip.className = 'region-tooltip';
      tooltip.textContent = formatRegionName(regionId);
      tooltip.style.left = `${mouseEvent.clientX}px`;
      tooltip.style.top = `${mouseEvent.clientY}px`;
      document.body.appendChild(tooltip);
    }, []);

    const hideTooltip = () => {
      const tooltip = document.querySelector('.region-tooltip');
      if (tooltip) {
        document.body.removeChild(tooltip);
      }
    };

    const handleRegionHoverEvent = useCallback((event: Event) => {
      if (isPanMode) return;
      
      const target = event.currentTarget as SVGGElement;
      const regionId = target.id;
      if (regionId) {
        onRegionHover(regionId);
        showTooltip(event, regionId);
      }
    }, [isPanMode, onRegionHover, showTooltip]);

    const handleRegionLeaveEvent = useCallback(() => {
      if (isPanMode) return;
      
      onRegionHover(null);
      hideTooltip();
    }, [isPanMode, onRegionHover]);

    const addRegionInteractivity = useCallback((svg: SVGSVGElement) => {
      const regions = svg.querySelectorAll('g[id]');
      
      regions.forEach(region => {
        const regionId = region.id;
        if (!regionId) return;

        // Add click handler
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
      
      const container = ref.current;
      if (!container) return;
      
      const svgElement = container.querySelector('svg');
      if (!svgElement) return;

      // Apply timeline-specific styling
      applyTimelineStyles(svgElement, activeTimeline);

      // Add interactivity to regions
      addRegionInteractivity(svgElement);

      return () => {
        // Cleanup event listeners
        const regions = svgElement.querySelectorAll('g[id]');
        regions.forEach(region => {
          region.removeEventListener('click', handleRegionClickEvent);
          region.removeEventListener('mouseenter', handleRegionHoverEvent);
          region.removeEventListener('mouseleave', handleRegionLeaveEvent);
        });
      };
    }, [svgContent, activeTimeline, selectedRegion, isPanMode, applyTimelineStyles, addRegionInteractivity, handleRegionClickEvent, handleRegionHoverEvent, handleRegionLeaveEvent]);

    const formatRegionName = (regionId: string) => {
      return regionId
        .replace(/[_-]/g, ' ')
        .replace(/^\d+\s*-\s*/, '')
        .replace(/^SMT\s*[\d.]+\s*-\s*/, '')
        .replace(/^Part\s*[IVX]+:\s*/, '')
        .replace(/^Book\s*\d+\s*-\s*/, '')
        .trim();
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
      <div 
        ref={ref}
        className="w-full h-full"
        style={{
          transform: `translate(${center.x}px, ${center.y}px) scale(${zoom})`,
          transformOrigin: 'center'
        }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }
);

PangeaMap.displayName = 'PangeaMap';

export default PangeaMap;