// SVG optimization utilities for the Pangea map

export interface SVGOptimizationConfig {
  simplifyPaths: boolean;
  mergeRegions: boolean;
  removeInvalidElements: boolean;
  optimizeCoastlines: boolean;
  tolerance: number; // For path simplification
}

export interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  reductionPercentage: number;
  elementsRemoved: number;
  pathsSimplified: number;
}

// Default optimization configuration
export const DEFAULT_OPTIMIZATION_CONFIG: SVGOptimizationConfig = {
  simplifyPaths: true,
  mergeRegions: false,
  removeInvalidElements: true,
  optimizeCoastlines: true,
  tolerance: 1.0
};

/**
 * Main SVG optimization function
 */
export async function optimizeSVG(
  svgContent: string, 
  config: SVGOptimizationConfig = DEFAULT_OPTIMIZATION_CONFIG
): Promise<{ optimizedSVG: string; result: OptimizationResult }> {
  
  const originalSize = svgContent.length;
  let optimizedSVG = svgContent;
  let elementsRemoved = 0;
  let pathsSimplified = 0;

  // Parse SVG
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(optimizedSVG, 'image/svg+xml');
  
  if (svgDoc.documentElement.tagName === 'parsererror') {
    throw new Error('Invalid SVG content');
  }

  // Remove invalid/problematic elements
  if (config.removeInvalidElements) {
    const result = removeInvalidElements(svgDoc);
    elementsRemoved += result.elementsRemoved;
  }

  // Optimize coastline paths
  if (config.optimizeCoastlines) {
    const result = optimizeCoastlines(svgDoc, config.tolerance);
    pathsSimplified += result.pathsOptimized;
  }

  // Simplify complex paths
  if (config.simplifyPaths) {
    const result = simplifyPaths(svgDoc, config.tolerance);
    pathsSimplified += result.pathsSimplified;
  }

  // Serialize optimized SVG
  const serializer = new XMLSerializer();
  optimizedSVG = serializer.serializeToString(svgDoc);

  const optimizedSize = optimizedSVG.length;
  const reductionPercentage = ((originalSize - optimizedSize) / originalSize) * 100;

  return {
    optimizedSVG,
    result: {
      originalSize,
      optimizedSize,
      reductionPercentage,
      elementsRemoved,
      pathsSimplified
    }
  };
}

/**
 * Remove invalid or problematic elements from the SVG
 */
function removeInvalidElements(svgDoc: Document): { elementsRemoved: number } {
  let elementsRemoved = 0;

  // Remove elements with problematic classes (already handled in PangeaMap.tsx but good to double-check)
  const problematicElements = svgDoc.querySelectorAll('.cls-161, .cls-162, .cls-163');
  problematicElements.forEach(element => {
    element.remove();
    elementsRemoved++;
  });

  // Remove empty groups
  const emptyGroups = svgDoc.querySelectorAll('g:not([id]):empty, g[id=""]:empty');
  emptyGroups.forEach(group => {
    group.remove();
    elementsRemoved++;
  });

  // Remove elements with no visible content
  const invisibleElements = svgDoc.querySelectorAll('[opacity="0"], [display="none"], [visibility="hidden"]');
  invisibleElements.forEach(element => {
    element.remove();
    elementsRemoved++;
  });

  // Remove duplicate IDs (keep first occurrence)
  const seenIds = new Set<string>();
  const elementsWithIds = svgDoc.querySelectorAll('[id]');
  elementsWithIds.forEach(element => {
    const id = element.getAttribute('id');
    if (id) {
      if (seenIds.has(id)) {
        // Remove ID from duplicate element, don't remove the element entirely
        element.removeAttribute('id');
      } else {
        seenIds.add(id);
      }
    }
  });

  return { elementsRemoved };
}

/**
 * Optimize coastline paths for better accuracy
 */
function optimizeCoastlines(svgDoc: Document, tolerance: number): { pathsOptimized: number } {
  let pathsOptimized = 0;

  // Find all path elements that likely represent coastlines
  const pathElements = svgDoc.querySelectorAll('path');
  
  pathElements.forEach(path => {
    const pathData = path.getAttribute('d');
    if (!pathData) return;

    // Check if this path represents a coastline (heuristic: long, complex paths)
    if (pathData.length > 500 && pathData.includes('C')) {
      const optimizedPath = optimizePathData(pathData, tolerance);
      if (optimizedPath !== pathData) {
        path.setAttribute('d', optimizedPath);
        pathsOptimized++;
      }
    }
  });

  return { pathsOptimized };
}

/**
 * Simplify complex paths by reducing unnecessary points
 */
function simplifyPaths(svgDoc: Document, tolerance: number): { pathsSimplified: number } {
  let pathsSimplified = 0;

  const pathElements = svgDoc.querySelectorAll('path');
  
  pathElements.forEach(path => {
    const pathData = path.getAttribute('d');
    if (!pathData) return;

    // Only simplify very complex paths to avoid breaking important details
    if (pathData.length > 1000) {
      const simplifiedPath = simplifyPathData(pathData, tolerance);
      if (simplifiedPath !== pathData && simplifiedPath.length < pathData.length * 0.8) {
        path.setAttribute('d', simplifiedPath);
        pathsSimplified++;
      }
    }
  });

  return { pathsSimplified };
}

/**
 * Optimize individual path data string
 */
function optimizePathData(pathData: string, tolerance: number): string {
  // Remove redundant whitespace and formatting
  let optimized = pathData
    .replace(/\s+/g, ' ')
    .replace(/,\s*/g, ',')
    .replace(/\s*([MLHVCSQTAZmlhvcsqtaz])\s*/g, '$1')
    .trim();

  // Round coordinates to reduce precision (within tolerance)
  optimized = optimized.replace(/-?\d+\.?\d*/g, (match) => {
    const num = parseFloat(match);
    return (Math.round(num * (1/tolerance)) / (1/tolerance)).toString();
  });

  // Remove consecutive duplicate points
  optimized = removeDuplicatePoints(optimized);

  return optimized;
}

/**
 * Simplify path data by reducing points
 */
function simplifyPathData(pathData: string, tolerance: number): string {
  // This is a basic implementation - for production use, consider a proper 
  // path simplification algorithm like Douglas-Peucker
  
  // Remove very short line segments
  const threshold = Math.max(5, Math.min(50, Math.round(tolerance * 10)));
  const simplified = pathData.replace(/L-?\d+\.?\d*,-?\d+\.?\d*(?=L)/g, (match, offset, string) => {
    // Simple heuristic: if the next L command is very close, skip this one
    const nextL = string.indexOf('L', offset + match.length);
    if (nextL !== -1 && nextL - offset < threshold) {
      return '';
    }
    return match;
  });

  return simplified;
}

/**
 * Remove duplicate consecutive points in path data
 */
function removeDuplicatePoints(pathData: string): string {
  const commands = pathData.split(/(?=[MLHVCSQTAZmlhvcsqtaz])/);
  const uniqueCommands: string[] = [];
  let lastPoint = '';

  commands.forEach(command => {
    if (command.trim()) {
      // Extract coordinates for comparison
      const coords = command.match(/-?\d+\.?\d*,-?\d+\.?\d*/);
      const currentPoint = coords ? coords[0] : '';
      
      if (currentPoint !== lastPoint || !coords) {
        uniqueCommands.push(command);
        lastPoint = currentPoint;
      }
    }
  });

  return uniqueCommands.join('');
}

/**
 * Create optimized SVG processing pipeline
 */
export class SVGOptimizationPipeline {
  private config: SVGOptimizationConfig;
  
  constructor(config: SVGOptimizationConfig = DEFAULT_OPTIMIZATION_CONFIG) {
    this.config = config;
  }

  async processFile(svgContent: string): Promise<{ optimizedSVG: string; result: OptimizationResult }> {
    console.log('Starting SVG optimization pipeline...');
    
    try {
      const result = await optimizeSVG(svgContent, this.config);
      
      console.log('SVG optimization completed:', {
        originalSize: `${(result.result.originalSize / 1024).toFixed(2)} KB`,
        optimizedSize: `${(result.result.optimizedSize / 1024).toFixed(2)} KB`,
        reduction: `${result.result.reductionPercentage.toFixed(1)}%`,
        elementsRemoved: result.result.elementsRemoved,
        pathsSimplified: result.result.pathsSimplified
      });

      return result;
    } catch (error) {
      console.error('SVG optimization failed:', error);
      throw error;
    }
  }

  updateConfig(updates: Partial<SVGOptimizationConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

/**
 * Utility to analyze SVG structure and provide optimization recommendations
 */
export function analyzeSVGStructure(svgContent: string): {
  totalElements: number;
  pathElements: number;
  groupElements: number;
  duplicateIds: string[];
  largestPaths: { id: string; size: number }[];
  recommendations: string[];
} {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
  
  const totalElements = svgDoc.querySelectorAll('*').length;
  const pathElements = svgDoc.querySelectorAll('path').length;
  const groupElements = svgDoc.querySelectorAll('g').length;
  
  // Find duplicate IDs
  const duplicateIds: string[] = [];
  const seenIds = new Map<string, number>();
  
  svgDoc.querySelectorAll('[id]').forEach(element => {
    const id = element.getAttribute('id');
    if (id) {
      seenIds.set(id, (seenIds.get(id) || 0) + 1);
    }
  });
  
  seenIds.forEach((count, id) => {
    if (count > 1) {
      duplicateIds.push(id);
    }
  });

  // Find largest path elements
  const largestPaths: { id: string; size: number }[] = [];
  svgDoc.querySelectorAll('path[id]').forEach(path => {
    const id = path.getAttribute('id') || 'unnamed';
    const pathData = path.getAttribute('d') || '';
    largestPaths.push({ id, size: pathData.length });
  });
  
  largestPaths.sort((a, b) => b.size - a.size);
  largestPaths.splice(10); // Keep only top 10

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (duplicateIds.length > 0) {
    recommendations.push(`Remove ${duplicateIds.length} duplicate IDs`);
  }
  
  if (pathElements > 1000) {
    recommendations.push('Consider simplifying complex paths for better performance');
  }
  
  if (totalElements > 5000) {
    recommendations.push('SVG has many elements, consider grouping optimization');
  }
  
  const avgPathSize = largestPaths.reduce((sum, p) => sum + p.size, 0) / largestPaths.length;
  if (avgPathSize > 500) {
    recommendations.push('Large path elements detected, coastline optimization recommended');
  }

  return {
    totalElements,
    pathElements,
    groupElements,
    duplicateIds,
    largestPaths,
    recommendations
  };
}