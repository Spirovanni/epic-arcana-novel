// Coordinate system for the Pangea world map
// Based on SVG coordinates with "Center of Map" as origin (0,0)

export interface SVGCoordinates {
  x: number;
  y: number;
}

export interface WorldCoordinates {
  latitude: number;  // North-South: positive = north, negative = south
  longitude: number; // East-West: positive = east, negative = west
}

export interface GridReference {
  zone: string;      // Grid zone (e.g., "A1", "B3", etc.)
  coordinates: WorldCoordinates;
  svgCoordinates: SVGCoordinates;
}

// Constants for the coordinate system
export const COORDINATE_SYSTEM = {
  // SVG map dimensions and center point
  SVG_WIDTH: 3306.22,
  SVG_HEIGHT: 3200.83,
  SVG_CENTER: { x: 2046.275, y: 1844.585 }, // "Center of Map" layer position
  
  // World coordinate bounds (degrees)
  // Since this is Pangea, we can use a global coordinate system
  MAX_LATITUDE: 90,   // North pole
  MIN_LATITUDE: -90,  // South pole  
  MAX_LONGITUDE: 180, // East
  MIN_LONGITUDE: -180, // West
  
  // Grid system settings
  GRID_SIZE_DEGREES: 10, // Each grid cell is 10x10 degrees
  GRID_LABELS: {
    LATITUDE: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'], // 18 zones (180° / 10°)
    LONGITUDE: Array.from({length: 36}, (_, i) => String(i + 1)) // 36 zones (360° / 10°)
  }
};

/**
 * Convert SVG coordinates to world latitude/longitude
 * @param svgCoords - SVG pixel coordinates
 * @returns World coordinates in lat/lng
 */
export function svgToWorldCoordinates(svgCoords: SVGCoordinates): WorldCoordinates {
  // Calculate offset from center of map
  const offsetX = svgCoords.x - COORDINATE_SYSTEM.SVG_CENTER.x;
  const offsetY = svgCoords.y - COORDINATE_SYSTEM.SVG_CENTER.y;
  
  // Calculate the scale factors (pixels per degree)
  const pixelsPerLongitudeDegree = COORDINATE_SYSTEM.SVG_WIDTH / 360;  // 360° longitude span
  const pixelsPerLatitudeDegree = COORDINATE_SYSTEM.SVG_HEIGHT / 180;  // 180° latitude span
  
  // Convert to world coordinates
  // X offset = longitude (positive = east)
  // Y offset = latitude (negative because SVG Y increases downward, but latitude increases upward)
  const longitude = offsetX / pixelsPerLongitudeDegree;
  const latitude = -offsetY / pixelsPerLatitudeDegree; // Negative because Y increases downward in SVG
  
  // Clamp to valid ranges
  return {
    latitude: Math.max(COORDINATE_SYSTEM.MIN_LATITUDE, Math.min(COORDINATE_SYSTEM.MAX_LATITUDE, latitude)),
    longitude: Math.max(COORDINATE_SYSTEM.MIN_LONGITUDE, Math.min(COORDINATE_SYSTEM.MAX_LONGITUDE, longitude))
  };
}

/**
 * Convert world latitude/longitude to SVG coordinates
 * @param worldCoords - World coordinates in lat/lng
 * @returns SVG pixel coordinates
 */
export function worldToSvgCoordinates(worldCoords: WorldCoordinates): SVGCoordinates {
  // Calculate the scale factors (pixels per degree)
  const pixelsPerLongitudeDegree = COORDINATE_SYSTEM.SVG_WIDTH / 360;
  const pixelsPerLatitudeDegree = COORDINATE_SYSTEM.SVG_HEIGHT / 180;
  
  // Convert to SVG offset from center
  const offsetX = worldCoords.longitude * pixelsPerLongitudeDegree;
  const offsetY = -worldCoords.latitude * pixelsPerLatitudeDegree; // Negative because Y increases downward
  
  // Add to center coordinates
  return {
    x: COORDINATE_SYSTEM.SVG_CENTER.x + offsetX,
    y: COORDINATE_SYSTEM.SVG_CENTER.y + offsetY
  };
}

/**
 * Get grid zone reference for given coordinates
 * @param worldCoords - World coordinates in lat/lng
 * @returns Grid zone string (e.g., "H18")
 */
export function getGridZone(worldCoords: WorldCoordinates): string {
  // Calculate grid indices
  const latIndex = Math.floor((worldCoords.latitude + 90) / COORDINATE_SYSTEM.GRID_SIZE_DEGREES);
  const lngIndex = Math.floor((worldCoords.longitude + 180) / COORDINATE_SYSTEM.GRID_SIZE_DEGREES);
  
  // Clamp to valid ranges
  const clampedLatIndex = Math.max(0, Math.min(COORDINATE_SYSTEM.GRID_LABELS.LATITUDE.length - 1, latIndex));
  const clampedLngIndex = Math.max(0, Math.min(COORDINATE_SYSTEM.GRID_LABELS.LONGITUDE.length - 1, lngIndex));
  
  const latLabel = COORDINATE_SYSTEM.GRID_LABELS.LATITUDE[clampedLatIndex];
  const lngLabel = COORDINATE_SYSTEM.GRID_LABELS.LONGITUDE[clampedLngIndex];
  
  return `${latLabel}${lngLabel}`;
}

/**
 * Get grid reference for any SVG coordinates
 * @param svgCoords - SVG pixel coordinates
 * @returns Complete grid reference with zone and coordinates
 */
export function getSvgGridReference(svgCoords: SVGCoordinates): GridReference {
  const worldCoords = svgToWorldCoordinates(svgCoords);
  const zone = getGridZone(worldCoords);
  
  return {
    zone,
    coordinates: worldCoords,
    svgCoordinates: svgCoords
  };
}

/**
 * Get formatted coordinate string for display
 * @param worldCoords - World coordinates
 * @param precision - Decimal places for coordinates (default: 2)
 * @returns Formatted string like "45.23°N, 12.45°E"
 */
export function formatCoordinates(worldCoords: WorldCoordinates, precision: number = 2): string {
  const latDirection = worldCoords.latitude >= 0 ? 'N' : 'S';
  const lngDirection = worldCoords.longitude >= 0 ? 'E' : 'W';
  
  const latValue = Math.abs(worldCoords.latitude).toFixed(precision);
  const lngValue = Math.abs(worldCoords.longitude).toFixed(precision);
  
  return `${latValue}°${latDirection}, ${lngValue}°${lngDirection}`;
}

/**
 * Calculate distance between two world coordinates (in kilometers)
 * Using spherical law of cosines (simplified for Pangea world)
 * @param coord1 - First coordinate
 * @param coord2 - Second coordinate
 * @returns Distance in kilometers
 */
export function calculateDistance(coord1: WorldCoordinates, coord2: WorldCoordinates): number {
  const EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers
  
  // Convert degrees to radians
  const lat1Rad = coord1.latitude * Math.PI / 180;
  const lat2Rad = coord2.latitude * Math.PI / 180;
  const deltaLngRad = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  
  // Spherical law of cosines
  const distance = Math.acos(
    Math.sin(lat1Rad) * Math.sin(lat2Rad) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLngRad)
  ) * EARTH_RADIUS_KM;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Get all locations with their grid references
 * @param locations - Array of locations with SVG coordinates
 * @returns Locations enhanced with world coordinates and grid references
 */
export function enhanceLocationsWithCoordinates<T extends { coordinates?: SVGCoordinates }>(
  locations: T[]
): (T & { gridReference?: GridReference })[] {
  return locations.map(location => {
    if (!location.coordinates) {
      return location;
    }
    
    const gridReference = getSvgGridReference(location.coordinates);
    return {
      ...location,
      gridReference
    };
  });
}

/**
 * Generate grid lines for display on the map
 * @param bounds - SVG bounds to generate grid within
 * @returns Array of grid lines with SVG coordinates
 */
export function generateGridLines(bounds?: { 
  minX: number; 
  maxX: number; 
  minY: number; 
  maxY: number; 
}): Array<{ start: SVGCoordinates; end: SVGCoordinates; type: 'latitude' | 'longitude'; value: number }> {
  const gridLines: Array<{ start: SVGCoordinates; end: SVGCoordinates; type: 'latitude' | 'longitude'; value: number }> = [];
  const useBounds = bounds || { minX: 0, maxX: COORDINATE_SYSTEM.SVG_WIDTH, minY: 0, maxY: COORDINATE_SYSTEM.SVG_HEIGHT };
  
  // Generate latitude lines (horizontal)
  for (let lat = -90; lat <= 90; lat += COORDINATE_SYSTEM.GRID_SIZE_DEGREES) {
    const startSvg = worldToSvgCoordinates({ latitude: lat, longitude: -180 });
    const endSvg = worldToSvgCoordinates({ latitude: lat, longitude: 180 });
    
    // Only include lines within bounds
    if (startSvg.y >= useBounds.minY && startSvg.y <= useBounds.maxY) {
      gridLines.push({
        start: { x: Math.max(useBounds.minX, startSvg.x), y: startSvg.y },
        end: { x: Math.min(useBounds.maxX, endSvg.x), y: endSvg.y },
        type: 'latitude',
        value: lat
      });
    }
  }
  
  // Generate longitude lines (vertical)
  for (let lng = -180; lng <= 180; lng += COORDINATE_SYSTEM.GRID_SIZE_DEGREES) {
    const startSvg = worldToSvgCoordinates({ latitude: 90, longitude: lng });
    const endSvg = worldToSvgCoordinates({ latitude: -90, longitude: lng });
    
    // Only include lines within bounds
    if (startSvg.x >= useBounds.minX && startSvg.x <= useBounds.maxX) {
      gridLines.push({
        start: { x: startSvg.x, y: Math.max(useBounds.minY, startSvg.y) },
        end: { x: endSvg.x, y: Math.min(useBounds.maxY, endSvg.y) },
        type: 'longitude',
        value: lng
      });
    }
  }
  
  return gridLines;
}

// Predefined coordinates for known locations
export const KNOWN_LOCATION_COORDINATES = {
  'Naples': {
    svg: { x: 1894, y: 1778 },
    world: svgToWorldCoordinates({ x: 1894, y: 1778 }),
    get grid() { return getSvgGridReference(this.svg); }
  },
  'Rome': {
    svg: { x: 1850, y: 1750 },
    world: svgToWorldCoordinates({ x: 1850, y: 1750 }),
    get grid() { return getSvgGridReference(this.svg); }
  },
  'Center of Map': {
    svg: COORDINATE_SYSTEM.SVG_CENTER,
    world: { latitude: 0, longitude: 0 }, // By definition
    get grid() { return getSvgGridReference(this.svg); }
  }
};