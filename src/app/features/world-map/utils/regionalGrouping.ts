// Regional grouping system for Pangea map based on book and chapter patterns

export interface BookRegion {
  id: string;
  name: string;
  description: string;
  color: string;
  subRegions: ChapterRegion[];
}

export interface ChapterRegion {
  id: string;
  name: string;
  description: string;
  color: string;
  locations: LocationRegion[];
}

export interface LocationRegion {
  id: string;
  name: string;
  dayNumber?: number;
  coordinates?: { x: number; y: number };
  svgPath?: string;
}

export interface OverlayConfig {
  showBookBoundaries: boolean;
  showChapterBoundaries: boolean;
  showLocationLabels: boolean;
  opacity: number;
  bookBoundaryColor: string;
  chapterBoundaryColor: string;
  labelColor: string;
}

// Define regional groupings based on SVG analysis
export const REGIONAL_GROUPINGS: BookRegion[] = [
  {
    id: "book_9_kingdom_come",
    name: "Book 9 - Kingdom Come",
    description: "Central American and Caribbean regions",
    color: "#FFD700", // Gold
    subRegions: [
      {
        id: "smt_9_13_life_of_virtue",
        name: "Chapter 9.13 - Life of Virtue", 
        description: "Panama and Costa Rica region",
        color: "#FFA500", // Orange
        locations: [
          { id: "360_panama", name: "Panama", dayNumber: 360 },
          { id: "359_costa_rica", name: "Costa Rica", dayNumber: 359 }
        ]
      },
      {
        id: "smt_9_12_exploration",
        name: "Chapter 9.12 - Exploration",
        description: "Central American civilizations",
        color: "#FF6347", // Tomato
        locations: [
          { id: "358_olmec", name: "Olmec", dayNumber: 358 },
          { id: "357_hondoras", name: "Honduras", dayNumber: 357 },
          { id: "356_belize", name: "Belize", dayNumber: 356 }
        ]
      },
      {
        id: "smt_9_11_attack_through_defence",
        name: "Chapter 9.11 - Attack Through Defence", 
        description: "El Salvador and Mesoamerican regions",
        color: "#DC143C", // Crimson
        locations: [
          { id: "355_el_salvador", name: "El Salvador", dayNumber: 355 },
          { id: "354_clovis", name: "Clovis", dayNumber: 354 },
          { id: "353_toltec", name: "Toltec", dayNumber: 353 }
        ]
      },
      {
        id: "smt_9_10_cycle_of_life",
        name: "Chapter 9.10 - Cycle of Life",
        description: "Texas, Caribbean, and Maya regions",
        color: "#8B008B", // DarkMagenta
        locations: [
          { id: "352_texas", name: "Texas", dayNumber: 352 },
          { id: "351_mayan", name: "Mayan", dayNumber: 351 },
          { id: "350_cuba", name: "Cuba", dayNumber: 350 }
        ]
      },
      {
        id: "smt_9_9_be_mighty_with_valor",
        name: "Chapter 9.9 - Be Mighty with Valor",
        description: "Aztec and Sinaloa regions", 
        color: "#4B0082", // Indigo
        locations: [
          { id: "349_aztec", name: "Aztec", dayNumber: 349 },
          { id: "348_sinaloa", name: "Sinaloa", dayNumber: 348 }
        ]
      }
    ]
  },
  {
    id: "book_mat_major_arcana",
    name: "Major Arcana Territories",
    description: "Mediterranean, European, and Middle Eastern regions",
    color: "#4169E1", // RoyalBlue
    subRegions: [
      {
        id: "mat_20_judgment",
        name: "MAT 20 - Judgment",
        description: "Final judgment territories",
        color: "#9370DB", // MediumPurple
        locations: []
      },
      {
        id: "mat_19_sun",
        name: "MAT 19 - The Sun", 
        description: "Solar empire regions",
        color: "#FF4500", // OrangeRed
        locations: []
      },
      {
        id: "mat_18_moon",
        name: "MAT 18 - The Moon",
        description: "Lunar territories",
        color: "#C0C0C0", // Silver
        locations: []
      },
      {
        id: "mat_16_tower",
        name: "MAT 16 - The Tower",
        description: "Constantinople and Byzantine regions",
        color: "#8B4513", // SaddleBrown
        locations: [
          { id: "mat_16_constantinople", name: "Constantinople" }
        ]
      },
      {
        id: "mat_15_devil", 
        name: "MAT 15 - The Devil",
        description: "Thrace and Balkan regions",
        color: "#B22222", // FireBrick
        locations: [
          { id: "mat_15_thrace", name: "Thrace" }
        ]
      }
    ]
  },
  {
    id: "story_chapters_smt_8",
    name: "Book 8 Story Chapters",
    description: "Earlier story arc regions",
    color: "#2E8B57", // SeaGreen
    subRegions: [
      {
        id: "smt_8_13_mind_power",
        name: "SMT 8.13 - Mind Power",
        description: "Mental mastery regions",
        color: "#20B2AA", // LightSeaGreen
        locations: []
      },
      {
        id: "smt_8_12_conscious_mind",
        name: "SMT 8.12 - Conscious Mind",
        description: "Consciousness territories", 
        color: "#48D1CC", // MediumTurquoise
        locations: []
      }
    ]
  }
];

// Helper functions for region management
export const getBookRegionById = (id: string): BookRegion | undefined => {
  return REGIONAL_GROUPINGS.find(book => book.id === id);
};

export const getChapterRegionById = (bookId: string, chapterId: string): ChapterRegion | undefined => {
  const book = getBookRegionById(bookId);
  return book?.subRegions.find(chapter => chapter.id === chapterId);
};

export const getAllLocations = (): LocationRegion[] => {
  const locations: LocationRegion[] = [];
  REGIONAL_GROUPINGS.forEach(book => {
    book.subRegions.forEach(chapter => {
      locations.push(...chapter.locations);
    });
  });
  return locations;
};

export const getLocationsByBook = (bookId: string): LocationRegion[] => {
  const book = getBookRegionById(bookId);
  if (!book) return [];
  
  const locations: LocationRegion[] = [];
  book.subRegions.forEach(chapter => {
    locations.push(...chapter.locations);
  });
  return locations;
};

// SVG region pattern recognition
export const identifyRegionType = (svgId: string): 'book' | 'chapter' | 'location' | 'unknown' => {
  const id = svgId.toLowerCase();
  
  if (id.includes('book_') || id.match(/^book\s*\d+/)) return 'book';
  if (id.includes('smt_') || id.includes('mat_')) return 'chapter'; 
  if (id.match(/^\d+\s*[-_]\s*[a-z]/)) return 'location';
  
  return 'unknown';
};

export const extractDayNumber = (svgId: string): number | undefined => {
  const match = svgId.match(/^(\d+)\s*[-_]/);
  return match ? parseInt(match[1]) : undefined;
};

export const extractChapterNumber = (svgId: string): string | undefined => {
  const patterns = [
    /SMT\s*([\d.]+)/, // "SMT 9.13" format
    /MAT\s*(\d+)/,    // "MAT 16" format  
  ];
  
  for (const pattern of patterns) {
    const match = svgId.match(pattern);
    if (match) return match[1];
  }
  return undefined;
};

export const formatRegionName = (svgId: string): string => {
  return svgId
    .replace(/[_-]/g, ' ')
    .replace(/^\d+\s*-\s*/, '') // Remove day numbers
    .replace(/^SMT\s*[\d.]+\s*-\s*/, '') // Remove SMT prefixes
    .replace(/^MAT\s*\d+\s*-\s*/, '') // Remove MAT prefixes  
    .replace(/^Part\s*[IVX]+:\s*/, '') // Remove Part prefixes
    .replace(/^Book\s*\d+\s*-\s*/, '') // Remove Book prefixes
    .replace(/^The\s+/, '') // Remove "The" prefix
    .trim();
};

// Default overlay configuration
export const DEFAULT_OVERLAY_CONFIG: OverlayConfig = {
  showBookBoundaries: true,
  showChapterBoundaries: false,
  showLocationLabels: true,
  opacity: 0.3,
  bookBoundaryColor: '#FF6B35',
  chapterBoundaryColor: '#4ECDC4', 
  labelColor: '#2C3E50'
};