// Utility to extract and catalog SVG regions from the Pangea map

export interface SVGRegion {
  id: string;
  name: string;
  type: 'country' | 'region' | 'chapter' | 'book' | 'unknown';
  coordinates?: { x: number; y: number };
  bbox?: { x: number; y: number; width: number; height: number };
}

export const extractSVGRegions = async (): Promise<SVGRegion[]> => {
  try {
    const response = await fetch('/Map_of_Pangea.svg');
    const svgText = await response.text();
    
    // Parse SVG to extract regions
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    
    const regions: SVGRegion[] = [];
    const groups = svgDoc.querySelectorAll('g[id]');
    
    groups.forEach(group => {
      const id = group.id;
      if (!id) return;
      
      const region: SVGRegion = {
        id,
        name: formatRegionName(id),
        type: categorizeRegion(id),
        coordinates: calculateRegionCenter(group as SVGGElement),
        bbox: calculateBoundingBox(group as SVGGElement)
      };
      
      regions.push(region);
    });
    
    return regions.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error extracting SVG regions:', error);
    return [];
  }
};

const formatRegionName = (regionId: string): string => {
  return regionId
    .replace(/[_-]/g, ' ')
    .replace(/^\d+\s*-\s*/, '')
    .replace(/^SMT\s*[\d.]+\s*-\s*/, '')
    .replace(/^Part\s*[IVX]+:\s*/, '')
    .replace(/^Book\s*\d+\s*-\s*/, '')
    .trim();
};

const categorizeRegion = (regionId: string): SVGRegion['type'] => {
  const id = regionId.toLowerCase();
  
  if (id.includes('book_') || id.includes('book ')) return 'book';
  if (id.includes('smt_') || id.includes('part_') || id.includes('part ')) return 'chapter';
  if (id.match(/^\d+\s*-\s*[a-zA-Z]/)) return 'country';
  if (id.includes('layer_')) return 'unknown';
  
  return 'region';
};

const calculateRegionCenter = (group: SVGGElement): { x: number; y: number } => {
  try {
    const bbox = group.getBBox();
    return {
      x: bbox.x + bbox.width / 2,
      y: bbox.y + bbox.height / 2
    };
  } catch {
    // Fallback if getBBox fails
    return { x: 0, y: 0 };
  }
};

const calculateBoundingBox = (group: SVGGElement): { x: number; y: number; width: number; height: number } => {
  try {
    const bbox = group.getBBox();
    return {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height
    };
  } catch {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
};

// Predefined mapping of your story locations to SVG regions
export const locationToRegionMapping: Record<string, string[]> = {
  'Hyperborea Library': ['Hyperborea', 'Library', 'Arctic', 'North'],
  'Citadel of Borealis': ['Borealis', 'Citadel', 'Fortress', 'North'],
  'Ironroot Mountains': ['Mountain', 'Iron', 'Orichalcum', 'Metal'],
  'Selene Gate': ['Selene', 'Gate', 'Moon', 'Portal'],
  'Hollow Spire': ['Spire', 'Hollow', 'Tower', 'Monolith']
};

// Function to find best matching SVG region for a story location
export const findMatchingRegion = (locationName: string, regions: SVGRegion[]): SVGRegion | null => {
  const keywords = locationToRegionMapping[locationName] || [locationName];
  
  // First, try exact name match
  let bestMatch = regions.find(region => 
    region.name.toLowerCase() === locationName.toLowerCase()
  );
  
  if (bestMatch) return bestMatch;
  
  // Then try keyword matching
  for (const keyword of keywords) {
    bestMatch = regions.find(region => 
      region.name.toLowerCase().includes(keyword.toLowerCase()) ||
      region.id.toLowerCase().includes(keyword.toLowerCase())
    );
    if (bestMatch) return bestMatch;
  }
  
  return null;
};

// Function to get regions by type
export const getRegionsByType = (regions: SVGRegion[], type: SVGRegion['type']): SVGRegion[] => {
  return regions.filter(region => region.type === type);
};

// Function to search regions by name
export const searchRegions = (regions: SVGRegion[], searchTerm: string): SVGRegion[] => {
  const term = searchTerm.toLowerCase();
  return regions.filter(region => 
    region.name.toLowerCase().includes(term) ||
    region.id.toLowerCase().includes(term)
  );
};