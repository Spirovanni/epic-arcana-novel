import { NextRequest, NextResponse } from 'next/server';

// Mock data structure - replace with actual database queries
const mockStats = {
  totalBooks: 9,
  totalChapters: 108,
  totalPages: 432,
  totalWords: 186420,
  totalScenes: 324,
  totalTaskGroups: 216,
  completionRate: 73,
  recentActivity: [
    {
      id: '1',
      type: 'page_updated',
      title: 'Page 3 updated',
      timestamp: '2024-01-15T14:30:00Z',
      bookTitle: 'The Temporal Awakening',
      chapterTitle: 'Chapter 1: The Discovery'
    },
    {
      id: '2',
      type: 'page_created',
      title: 'New page created',
      timestamp: '2024-01-15T10:15:00Z',
      bookTitle: 'The Temporal Awakening',
      chapterTitle: 'Chapter 2: First Steps'
    },
    {
      id: '3',
      type: 'chapter_created',
      title: 'Chapter 3: The Revelation',
      timestamp: '2024-01-14T16:45:00Z',
      bookTitle: 'The Temporal Awakening'
    },
    {
      id: '4',
      type: 'page_updated',
      title: 'Page 1 updated',
      timestamp: '2024-01-14T09:20:00Z',
      bookTitle: 'Consciousness Shifts',
      chapterTitle: 'Chapter 1: Awareness'
    }
  ]
};

const mockBookProgress = [
  {
    id: '1',
    title: 'The Temporal Awakening',
    bookNumber: 1,
    chapters: 12,
    totalPages: 48,
    totalWords: 24500,
    completionPercentage: 85,
    lastUpdated: '2024-01-15T14:30:00Z',
    colorTheme: {
      name: 'Crimson',
      hex: '#DC2626'
    }
  },
  {
    id: '2', 
    title: 'Consciousness Shifts',
    bookNumber: 2,
    chapters: 12,
    totalPages: 52,
    totalWords: 26800,
    completionPercentage: 78,
    lastUpdated: '2024-01-14T09:20:00Z',
    colorTheme: {
      name: 'Orange',
      hex: '#EA580C'
    }
  },
  {
    id: '3',
    title: 'Reality Manipulation',
    bookNumber: 3,
    chapters: 12,
    totalPages: 45,
    totalWords: 22100,
    completionPercentage: 72,
    lastUpdated: '2024-01-12T18:15:00Z',
    colorTheme: {
      name: 'Amber',
      hex: '#D97706'
    }
  },
  {
    id: '4',
    title: 'Dimensional Mastery',
    bookNumber: 4,
    chapters: 12,
    totalPages: 38,
    totalWords: 19200,
    completionPercentage: 65,
    lastUpdated: '2024-01-11T12:30:00Z',
    colorTheme: {
      name: 'Yellow',
      hex: '#CA8A04'
    }
  },
  {
    id: '5',
    title: 'Temporal Integration',
    bookNumber: 5,
    chapters: 12,
    totalPages: 41,
    totalWords: 20800,
    completionPercentage: 68,
    lastUpdated: '2024-01-10T15:45:00Z',
    colorTheme: {
      name: 'Lime',
      hex: '#65A30D'
    }
  },
  {
    id: '6',
    title: 'Universal Understanding',
    bookNumber: 6,
    chapters: 12,
    totalPages: 44,
    totalWords: 22500,
    completionPercentage: 75,
    lastUpdated: '2024-01-09T11:20:00Z',
    colorTheme: {
      name: 'Green',
      hex: '#16A34A'
    }
  },
  {
    id: '7',
    title: 'Cosmic Awareness',
    bookNumber: 7,
    chapters: 12,
    totalPages: 50,
    totalWords: 25300,
    completionPercentage: 82,
    lastUpdated: '2024-01-08T14:10:00Z',
    colorTheme: {
      name: 'Emerald',
      hex: '#059669'
    }
  },
  {
    id: '8',
    title: 'Multiversal Mastery',
    bookNumber: 8,
    chapters: 12,
    totalPages: 47,
    totalWords: 23800,
    completionPercentage: 79,
    lastUpdated: '2024-01-07T16:55:00Z',
    colorTheme: {
      name: 'Teal',
      hex: '#0D9488'
    }
  },
  {
    id: '9',
    title: 'The Epic Conclusion',
    bookNumber: 9,
    chapters: 12,
    totalPages: 67,
    totalWords: 34420,
    completionPercentage: 90,
    lastUpdated: '2024-01-06T13:40:00Z',
    colorTheme: {
      name: 'Cyan',
      hex: '#0891B2'
    }
  }
];

const mockTopChapters = [
  {
    id: 'ch1',
    title: 'The Discovery',
    chapterNumber: 1,
    bookTitle: 'The Temporal Awakening',
    pages: 4,
    words: 2150,
    scenes: 3,
    taskGroups: 2,
    completionRate: 95,
    lastUpdated: '2024-01-15T14:30:00Z'
  },
  {
    id: 'ch2',
    title: 'First Steps',
    chapterNumber: 2,
    bookTitle: 'The Temporal Awakening',
    pages: 4,
    words: 2080,
    scenes: 3,
    taskGroups: 2,
    completionRate: 90,
    lastUpdated: '2024-01-15T10:15:00Z'
  },
  {
    id: 'ch3',
    title: 'The Revelation',
    chapterNumber: 3,
    bookTitle: 'The Temporal Awakening',
    pages: 4,
    words: 1950,
    scenes: 3,
    taskGroups: 2,
    completionRate: 88,
    lastUpdated: '2024-01-14T16:45:00Z'
  },
  {
    id: 'ch4',
    title: 'Awareness',
    chapterNumber: 1,
    bookTitle: 'Consciousness Shifts',
    pages: 4,
    words: 2200,
    scenes: 3,
    taskGroups: 2,
    completionRate: 92,
    lastUpdated: '2024-01-14T09:20:00Z'
  },
  {
    id: 'ch5',
    title: 'The Shift Begins',
    chapterNumber: 2,
    bookTitle: 'Consciousness Shifts',
    pages: 4,
    words: 2100,
    scenes: 3,
    taskGroups: 2,
    completionRate: 85,
    lastUpdated: '2024-01-13T17:30:00Z'
  },
  {
    id: 'ch6',
    title: 'New Perspectives',
    chapterNumber: 3,
    bookTitle: 'Consciousness Shifts',
    pages: 4,
    words: 1980,
    scenes: 3,
    taskGroups: 2,
    completionRate: 82,
    lastUpdated: '2024-01-12T14:20:00Z'
  },
  {
    id: 'ch7',
    title: 'Breaking Barriers',
    chapterNumber: 1,
    bookTitle: 'Reality Manipulation',
    pages: 4,
    words: 1850,
    scenes: 3,
    taskGroups: 2,
    completionRate: 78,
    lastUpdated: '2024-01-12T11:45:00Z'
  },
  {
    id: 'ch8',
    title: 'The Power Within',
    chapterNumber: 2,
    bookTitle: 'Reality Manipulation',
    pages: 3,
    words: 1650,
    scenes: 3,
    taskGroups: 2,
    completionRate: 75,
    lastUpdated: '2024-01-11T16:10:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch this data from your database
    // Example database queries:
    
    // const stats = await db.query(`
    //   SELECT 
    //     COUNT(DISTINCT books.id) as totalBooks,
    //     COUNT(DISTINCT chapters.id) as totalChapters,
    //     COUNT(DISTINCT pages.id) as totalPages,
    //     SUM(LENGTH(REGEXP_REPLACE(pages.content, '<[^>]*>', ''))) as totalWords,
    //     COUNT(DISTINCT scenes.id) as totalScenes,
    //     COUNT(DISTINCT taskGroups.id) as totalTaskGroups
    //   FROM books 
    //   LEFT JOIN chapters ON books.id = chapters.bookId
    //   LEFT JOIN pages ON chapters.id = pages.chapterId  
    //   LEFT JOIN scenes ON chapters.id = scenes.chapterId
    //   LEFT JOIN taskGroups ON chapters.id = taskGroups.chapterId
    // `);

    // const bookProgress = await db.query(`
    //   SELECT 
    //     books.id,
    //     books.title,
    //     books.bookNumber,
    //     COUNT(DISTINCT chapters.id) as chapters,
    //     COUNT(DISTINCT pages.id) as totalPages,
    //     SUM(LENGTH(REGEXP_REPLACE(pages.content, '<[^>]*>', ''))) as totalWords,
    //     books.updatedAt as lastUpdated,
    //     books.colorTheme
    //   FROM books
    //   LEFT JOIN chapters ON books.id = chapters.bookId
    //   LEFT JOIN pages ON chapters.id = pages.chapterId
    //   GROUP BY books.id
    //   ORDER BY books.bookNumber
    // `);

    // For now, return mock data
    const dashboardData = {
      stats: mockStats,
      bookProgress: mockBookProgress,
      topChapters: mockTopChapters
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}