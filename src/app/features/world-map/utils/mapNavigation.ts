// Utility functions for map navigation and auto-focus

export interface RegionCoordinates {
  x: number;
  y: number;
  id: string;
}

// Predefined important regions with their SVG coordinates
export const REGION_COORDINATES: Record<string, RegionCoordinates> = {
  'Naples': { x: 1894, y: 1778, id: '_275_-_Naples' }, // Center of Naples region based on path analysis
  'Rome': { x: 1850, y: 1750, id: '_276_-_Rome' }, // Estimated, adjust if found
  'Florence': { x: 1820, y: 1720, id: '_277_-_Florence' }, // Estimated, adjust if found
  'Venice': { x: 1880, y: 1680, id: '_278_-_Venice' }, // Estimated, adjust if found
};

export interface MapViewport {
  width: number;
  height: number;
}

export interface CameraSettings {
  center: { x: number; y: number };
  zoom: number;
}

/**
 * Calculate optimal zoom and center position to focus on a region
 * @param regionCoords - The SVG coordinates of the region
 * @param viewport - The viewport dimensions
 * @param targetPercentage - What percentage of the screen the region should occupy (0.15 = 15%)
 * @returns Camera settings for centering and zooming
 */
export function calculateRegionFocus(
  regionCoords: RegionCoordinates,
  viewport: MapViewport,
  targetPercentage: number = 0.15
): CameraSettings {
  // SVG dimensions from your Map_of_Pangea.svg viewBox: "0 0 3306.22 3200.83"
  const SVG_WIDTH = 3306.22;
  const SVG_HEIGHT = 3200.83;
  
  // Calculate zoom level based on target percentage
  // We want the region to take up targetPercentage of the smaller viewport dimension
  const minViewportDim = Math.min(viewport.width, viewport.height);
  const targetRegionSize = minViewportDim * targetPercentage;
  
  // Naples region size based on actual SVG path analysis (approx 30x25 pixels)
  const estimatedRegionSize = regionCoords.id === '_275_-_Naples' ? 50 : 200;
  
  // Calculate zoom to make the region the target size
  // For Naples, we want it to be clearly visible but not too zoomed in
  const targetZoom = regionCoords.id === '_275_-_Naples' 
    ? Math.max(2.5, targetRegionSize / estimatedRegionSize)
    : targetRegionSize / estimatedRegionSize;
  
  // Calculate center position to center the region in viewport
  // Transform SVG coordinates to screen coordinates
  const svgCenterX = regionCoords.x;
  const svgCenterY = regionCoords.y;
  
  // Convert to normalized coordinates (0-1)
  const normalizedX = svgCenterX / SVG_WIDTH;
  const normalizedY = svgCenterY / SVG_HEIGHT;
  
  // Calculate the offset needed to center this point in the viewport
  // The SVG will be scaled by targetZoom, so we need to account for that
  const scaledSvgWidth = SVG_WIDTH * (viewport.width / SVG_WIDTH) * targetZoom;
  const scaledSvgHeight = SVG_HEIGHT * (viewport.height / SVG_HEIGHT) * targetZoom;
  
  // Position of Naples in the scaled coordinate system
  const scaledNaplesX = normalizedX * scaledSvgWidth;
  const scaledNaplesY = normalizedY * scaledSvgHeight;
  
  // Center Naples in viewport
  const centerX = (viewport.width / 2) - scaledNaplesX;
  const centerY = (viewport.height / 2) - scaledNaplesY;
  
  return {
    center: { x: centerX, y: centerY },
    zoom: Math.min(Math.max(targetZoom, 0.5), 4) // Clamp zoom between 0.5x and 4x
  };
}

/**
 * Get coordinates for a region by name
 */
export function getRegionCoordinates(regionName: string): RegionCoordinates | null {
  const region = REGION_COORDINATES[regionName];
  return region || null;
}

/**
 * Calculate smooth animation steps for camera movement
 */
export function createCameraAnimation(
  fromSettings: CameraSettings,
  toSettings: CameraSettings,
  steps: number = 60
): CameraSettings[] {
  const animations: CameraSettings[] = [];
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Use easeInOutCubic for smooth animation
    const eased = t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    
    animations.push({
      center: {
        x: fromSettings.center.x + (toSettings.center.x - fromSettings.center.x) * eased,
        y: fromSettings.center.y + (toSettings.center.y - fromSettings.center.y) * eased
      },
      zoom: fromSettings.zoom + (toSettings.zoom - fromSettings.zoom) * eased
    });
  }
  
  return animations;
}

/**
 * Auto-focus on Naples region optimized for story content
 */
export function focusOnNaples(viewport: MapViewport): CameraSettings {
  const naplesCoords = getRegionCoordinates('Naples');
  if (!naplesCoords) {
    throw new Error('Naples coordinates not found');
  }
  
  return calculateRegionFocus(naplesCoords, viewport, 0.15);
}