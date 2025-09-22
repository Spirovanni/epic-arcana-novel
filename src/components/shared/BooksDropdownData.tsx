import { Book, User, BarChart3, Library, BookOpen, Bookmark } from 'lucide-react';

// Book data with proper typing
export interface BookDropdownItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  category?: 'overview' | 'personal' | 'book';
  bookNumber?: number;
  colorHex?: string;
}

// Create colored book icon component
const BookIcon = ({ color, number }: { color: string; number: number }) => (
  <div className="relative">
    <div 
      className="w-4 h-4 rounded-sm border border-white/20" 
      style={{ backgroundColor: color }}
    />
    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white drop-shadow-sm">
      {number}
    </span>
  </div>
);

export const getBooksDropdownItems = (): BookDropdownItem[] => [
  // Overview and Personal sections
  {
    href: '/books',
    label: 'All Books',
    icon: <Library className="w-4 h-4" />,
    description: 'Browse the complete Epic Arcana series',
    category: 'overview'
  },
  {
    href: '/dashboard/books',
    label: 'My Reading Dashboard',
    icon: <User className="w-4 h-4" />,
    description: 'Your personal reading progress and insights',
    category: 'personal'
  },
  {
    href: '/dashboard/books/analytics',
    label: 'Reading Analytics',
    icon: <BarChart3 className="w-4 h-4" />,
    description: 'Detailed progress tracking and statistics',
    category: 'personal'
  },
  
  // Individual Books
  {
    href: '/books/3e26f59f-da2d-4f26-acd6-f68ed1a4af8d',
    label: 'Crown of the Ancient Ones',
    icon: <BookIcon color="#FFA500" number={1} />,
    description: 'Foundation of Virtue: Building Purposeful Relationships',
    category: 'book',
    bookNumber: 1,
    colorHex: '#FFA500'
  },
  {
    href: '/books/9355ef7c-2980-44dd-88fe-08d79ad69d6d',
    label: 'Rise of the Triassic Nine',
    icon: <BookIcon color="#E34234" number={2} />,
    description: 'Guardians of Trust: Navigating Protection with Compassion',
    category: 'book',
    bookNumber: 2,
    colorHex: '#E34234'
  },
  {
    href: '/books/0c6cbdaf-6acf-46c1-aed2-ec7c10767a98',
    label: 'Awake Iron!',
    icon: <BookIcon color="#ff00ff" number={3} />,
    description: 'Mastering Motivation: Maneuvering Success with Drive',
    category: 'book',
    bookNumber: 3,
    colorHex: '#ff00ff'
  },
  {
    href: '/books/b08daf62-fddb-4270-b60d-aa4649491bd0',
    label: 'Maiden of Mercy',
    icon: <BookIcon color="#800080" number={4} />,
    description: 'The Power of Anticipation: Strategic Insight Navigation',
    category: 'book',
    bookNumber: 4,
    colorHex: '#800080'
  },
  {
    href: '/books/a5c227c1-5897-413a-991c-497adc992ac4',
    label: 'Holder of the Life Force',
    icon: <BookIcon color="#7F00FF" number={5} />,
    description: 'Mastering Observation: Harnessing Perceptive Intelligence',
    category: 'book',
    bookNumber: 5,
    colorHex: '#7F00FF'
  },
  {
    href: '/books/2fc92a5d-d5ae-487f-91df-714518ed88a4',
    label: 'The City of Shadows',
    icon: <BookIcon color="#008080" number={6} />,
    description: 'Intentional Strategy: Unlocking Resources with Purpose',
    category: 'book',
    bookNumber: 6,
    colorHex: '#008080'
  },
  {
    href: '/books/b0c79253-8dd9-46ad-8d9d-d77ec941b36b',
    label: 'Dark Path to Victory',
    icon: <BookIcon color="#008000" number={7} />,
    description: 'Operational Tactics: Driving Collaborative Success',
    category: 'book',
    bookNumber: 7,
    colorHex: '#008000'
  },
  {
    href: '/books/6bf51372-8e67-44b2-9bef-14944581e9eb',
    label: 'Inferno Garden',
    icon: <BookIcon color="#7fff00" number={8} />,
    description: 'Igniting Inspiration: Unleashing Power through Focus',
    category: 'book',
    bookNumber: 8,
    colorHex: '#7fff00'
  },
  {
    href: '/books/eaefafb3-3e4c-4b6b-8d90-c05f5f7a2e9b',
    label: 'The Blades of Triumph',
    icon: <BookIcon color="#FFBF00" number={9} />,
    description: 'Revitalizing Balance: Harmonized Growth Operations',
    category: 'book',
    bookNumber: 9,
    colorHex: '#FFBF00'
  }
];