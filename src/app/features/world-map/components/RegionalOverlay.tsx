"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import { 
  REGIONAL_GROUPINGS, 
  BookRegion, 
  ChapterRegion, 
  OverlayConfig,
  identifyRegionType,
  formatRegionName 
} from '../utils/regionalGrouping';

interface RegionalOverlayProps {
  svgContainer: HTMLDivElement | null;
  config: OverlayConfig;
  onRegionClick?: (regionId: string, regionType: 'book' | 'chapter' | 'location') => void;
}

export function RegionalOverlay({ svgContainer, config, onRegionClick }: RegionalOverlayProps) {
  const overlayRef = useRef<SVGGElement | null>(null);

  // Generate overlay paths for grouped regions
  

  // Create book-level overlay boundary
  const createBookOverlay = useCallback((svg: SVGSVGElement, book: BookRegion, config: OverlayConfig): SVGElement | null => {
    const bookRegions = findRelatedSVGRegions(svg, book);
    if (bookRegions.length === 0) return null;

    const boundaryPath = calculateRegionBoundary(bookRegions);
    if (!boundaryPath) return null;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', boundaryPath);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', config.bookBoundaryColor);
    path.setAttribute('stroke-width', '3');
    path.setAttribute('stroke-dasharray', '10,5');
    path.setAttribute('data-region-type', 'book');
    path.setAttribute('data-region-id', book.id);
    path.style.cursor = 'pointer';

    // Add click handler
    path.addEventListener('click', (e) => {
      e.stopPropagation();
      onRegionClick?.(book.id, 'book');
    });

    // Add hover effects
    path.addEventListener('mouseenter', () => {
      path.setAttribute('stroke-width', '4');
      path.setAttribute('stroke-opacity', '0.8');
    });

    path.addEventListener('mouseleave', () => {
      path.setAttribute('stroke-width', '3');
      path.setAttribute('stroke-opacity', '1');
    });

    return path;
  }, [onRegionClick]);

  // Create chapter-level overlay boundary
  const createChapterOverlay = useCallback((svg: SVGSVGElement, book: BookRegion, chapter: ChapterRegion, config: OverlayConfig): SVGElement | null => {
    const chapterRegions = findRelatedSVGRegions(svg, chapter);
    if (chapterRegions.length === 0) return null;

    const boundaryPath = calculateRegionBoundary(chapterRegions);
    if (!boundaryPath) return null;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', boundaryPath);
    path.setAttribute('fill', chapter.color);
    path.setAttribute('fill-opacity', '0.1');
    path.setAttribute('stroke', config.chapterBoundaryColor);
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-dasharray', '5,3');
    path.setAttribute('data-region-type', 'chapter');
    path.setAttribute('data-region-id', chapter.id);
    path.style.cursor = 'pointer';

    // Add click handler
    path.addEventListener('click', (e) => {
      e.stopPropagation();
      onRegionClick?.(chapter.id, 'chapter');
    });

    return path;
  }, [onRegionClick]);

  // Create location labels
  const createLocationLabels = useCallback((svg: SVGSVGElement, config: OverlayConfig): SVGElement | null => {
    const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    labelGroup.setAttribute('id', 'location-labels');

    // Find all numbered location regions in SVG
    const allGroups = svg.querySelectorAll('g[id]') as NodeListOf<SVGGElement>;
    
    allGroups.forEach(group => {
      const regionId = group.id;
      const regionType = identifyRegionType(regionId);
      
      if (regionType === 'location') {
        const center = calculateElementCenter(group);
        const name = formatRegionName(regionId);
        
        if (center && name) {
          const label = createLocationLabel(center, name, config);
          if (label) {
            labelGroup.appendChild(label);
          }
        }
      }
    });

    return labelGroup.children.length > 0 ? labelGroup : null;
  }, []);

  // Create individual location label
  const createLocationLabel = (center: {x: number, y: number}, name: string, config: OverlayConfig): SVGElement | null => {
    const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Background rectangle
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('fill', config.labelBackgroundColor || 'rgba(255, 255, 255, 0.9)');
    background.setAttribute('stroke', config.labelBackgroundColor || '#2C3E50');
    background.setAttribute('stroke-width', '1');
    background.setAttribute('rx', '3');
    
    // Text element
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', center.x.toString());
    text.setAttribute('y', center.y.toString());
    text.setAttribute('fill', '#2C3E50');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', '600');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.textContent = name;

    // Calculate background size after text is created
    const bbox = text.getBBox();
    const padding = 4;
    background.setAttribute('x', (bbox.x - padding).toString());
    background.setAttribute('y', (bbox.y - padding).toString());
    background.setAttribute('width', (bbox.width + padding * 2).toString());
    background.setAttribute('height', (bbox.height + padding * 2).toString());

    labelGroup.appendChild(background);
    labelGroup.appendChild(text);

    return labelGroup;
  };

  // Generate overlay paths for grouped regions (declared after helper creators)
  const generateOverlayPaths = useCallback((svg: SVGSVGElement) => {
    const overlayGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    overlayGroup.setAttribute('id', 'regional-overlay');
    overlayGroup.setAttribute('opacity', config.opacity.toString());
    overlayGroup.style.pointerEvents = 'auto';

    // Clear existing overlay
    const existingOverlay = svg.querySelector('#regional-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    // Generate book region overlays
    if (config.showBookBoundaries) {
      REGIONAL_GROUPINGS.forEach(book => {
        const bookOverlay = createBookOverlay(svg, book, config);
        if (bookOverlay) {
          overlayGroup.appendChild(bookOverlay);
        }
      });
    }

    // Generate chapter region overlays  
    if (config.showChapterBoundaries) {
      REGIONAL_GROUPINGS.forEach(book => {
        book.subRegions.forEach(chapter => {
          const chapterOverlay = createChapterOverlay(svg, book, chapter, config);
          if (chapterOverlay) {
            overlayGroup.appendChild(chapterOverlay);
          }
        });
      });
    }

    // Add location labels
    if (config.showLocationLabels) {
      const labelGroup = createLocationLabels(svg, config);
      if (labelGroup) {
        overlayGroup.appendChild(labelGroup);
      }
    }

    // Insert overlay as the last child so it appears on top
    svg.appendChild(overlayGroup);
    overlayRef.current = overlayGroup;

    return overlayGroup;
  }, [config, createBookOverlay, createChapterOverlay, createLocationLabels]);

  // Find SVG regions related to a book or chapter
  const findRelatedSVGRegions = (svg: SVGSVGElement, region: BookRegion | ChapterRegion): SVGGElement[] => {
    const allGroups = svg.querySelectorAll('g[id]') as NodeListOf<SVGGElement>;
    const relatedRegions: SVGGElement[] = [];

    allGroups.forEach(group => {
      const regionId = group.id.toLowerCase();
      const searchTerms = [
        region.id.toLowerCase(),
        region.name.toLowerCase(),
        ...region.name.toLowerCase().split(/[\s\-_]+/)
      ];

      const isRelated = searchTerms.some(term => 
        regionId.includes(term) || 
        formatRegionName(regionId).toLowerCase().includes(term)
      );

      if (isRelated) {
        relatedRegions.push(group);
      }
    });

    return relatedRegions;
  };

  // Calculate bounding boundary for a group of regions
  const calculateRegionBoundary = (regions: SVGGElement[]): string | null => {
    if (regions.length === 0) return null;

    try {
      // Get all bounding boxes
      const boxes = regions.map(region => {
        try {
          return region.getBBox();
        } catch {
          return null;
        }
      }).filter(box => box !== null);

      if (boxes.length === 0) return null;

      // Calculate combined bounding box
      const minX = Math.min(...boxes.map(box => box!.x));
      const minY = Math.min(...boxes.map(box => box!.y));  
      const maxX = Math.max(...boxes.map(box => box!.x + box!.width));
      const maxY = Math.max(...boxes.map(box => box!.y + box!.height));

      // Create rounded rectangle path with some padding
      const padding = 20;
      const x = minX - padding;
      const y = minY - padding;
      const width = maxX - minX + padding * 2;
      const height = maxY - minY + padding * 2;
      const radius = 15;

      return `M${x + radius},${y} 
              L${x + width - radius},${y} 
              Q${x + width},${y} ${x + width},${y + radius}
              L${x + width},${y + height - radius}
              Q${x + width},${y + height} ${x + width - radius},${y + height}
              L${x + radius},${y + height}
              Q${x},${y + height} ${x},${y + height - radius}
              L${x},${y + radius}
              Q${x},${y} ${x + radius},${y}
              Z`;
    } catch {
      return null;
    }
  };

  // Calculate center point of an SVG element
  const calculateElementCenter = (element: SVGGElement): {x: number, y: number} | null => {
    try {
      const bbox = element.getBBox();
      return {
        x: bbox.x + bbox.width / 2,
        y: bbox.y + bbox.height / 2
      };
    } catch {
      return null;
    }
  };

  // Initialize overlay when SVG container changes
  useEffect(() => {
    if (!svgContainer) return;

    const svg = svgContainer.querySelector('svg');
    if (!svg) return;

    generateOverlayPaths(svg);

    return () => {
      // Cleanup overlay when component unmounts
      if (overlayRef.current) {
        overlayRef.current.remove();
      }
    };
  }, [svgContainer, generateOverlayPaths]);

  // Update overlay when config changes
  useEffect(() => {
    if (!svgContainer) return;

    const svg = svgContainer.querySelector('svg');
    if (!svg) return;

    generateOverlayPaths(svg);
  }, [config, svgContainer, generateOverlayPaths]);

  return null; // This component doesn't render anything directly
}

// Helper hook for managing overlay configuration
export function useRegionalOverlay() {
  const [config, setConfig] = React.useState<OverlayConfig>({
    showBookBoundaries: true,
    showChapterBoundaries: false,
    showLocationLabels: true,
    opacity: 0.3,
    bookBoundaryColor: '#FF6B35',
    chapterBoundaryColor: '#4ECDC4',
    labelBackgroundColor: '#ffffff'
  });

  const updateConfig = (updates: Partial<OverlayConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const toggleBookBoundaries = () => {
    setConfig(prev => ({ ...prev, showBookBoundaries: !prev.showBookBoundaries }));
  };

  const toggleChapterBoundaries = () => {
    setConfig(prev => ({ ...prev, showChapterBoundaries: !prev.showChapterBoundaries }));
  };

  const toggleLocationLabels = () => {
    setConfig(prev => ({ ...prev, showLocationLabels: !prev.showLocationLabels }));
  };

  return {
    config,
    updateConfig,
    toggleBookBoundaries,
    toggleChapterBoundaries,
    toggleLocationLabels
  };
}