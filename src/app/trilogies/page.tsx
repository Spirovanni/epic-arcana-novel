'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Book {
  id: string;
  title: string;
  bookNumber: number;
  fictionNovelTitle: string;
  originalTitle?: string;
  summary: string;
  colorTheme?: {
    name: string;
    hex: string;
    rgb: {
      red: number;
      green: number;
      blue: number;
    };
  } | null;
}

interface Trilogy {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  purpose: string;
  keyThemes: string[];
  tagline: string;
  consequence: string;
  tone: string[];
  bookRange: string;
  books: Book[];
  gradientColors: string[];
}

const TRILOGY_DATA: Trilogy[] = [
  {
    id: 1,
    title: "The Trionfi Genesis",
    subtitle: "Books 1-3",
    description: "This opening trilogy charts the awakening of Francisco Petrarch, a young scholar whose Trionfi card game—a mirror of human experience—becomes the key to unraveling divine authority and reshaping reality. As he is drawn into a war across timelines by Dante, La Signora, and the enigmatic Zanetti Train, Francisco must confront illusions of fate, identity, and authorship. What begins as a poetic experiment becomes a metaphysical revolution, as the past, future, and mythic merge into a new battleground for the soul of humanity.",
    purpose: "To introduce the core metaphysical rules of the Trionfi system, establish the mytho-temporal arena of Pangaea, and define the central conflict: divine determinism versus mortal authorship. It introduces key characters like Francisco, La Signora, and Dante—not as archetypes, but as unstable agents of transformation.",
    keyThemes: [
      "Free Will vs. Determinism: Can humanity reclaim agency in a world governed by divine timelines?",
      "Transformation Through Love and Betrayal: Romantic and spiritual bonds serve both as catalysts and crucibles",
      "Temporal Mythmaking: Time is both battlefield and canvas, where stories rewrite the structure of the cosmos",
      "The Birth of Human Divinity: What begins as a game becomes a revolution—the Trionfi evolve from tools of prophecy into weapons of liberation"
    ],
    tagline: "The cards were never just for divination—they were for revolution.",
    consequence: "Humanity gains the tools to challenge divine authority—but fractures begin to form in space-time itself, and the story of reality becomes open to interpretation.",
    tone: ["Mystical", "Philosophical", "Epic", "Romantic", "Tragic"],
    bookRange: "1-3",
    books: [],
    gradientColors: ["#FFA500", "#E34234", "#ff00ff"]
  },
  {
    id: 2,
    title: "The Wheel of Realms",
    subtitle: "Books 4-6",
    description: "This middle trilogy escalates the cosmic chess match ignited in The Trionfi Genesis. As Francisco, La Signora, and their fractured allies pursue control over the Trionfi and the fates they represent, the very structure of time becomes unstable. Alternate versions of key characters emerge, each with competing agendas. The Wheel of Realms begins to spin—pulling realities into orbit around warring philosophies of fate, memory, and authorship. What began as rebellion becomes recursion. Victory may lie not in seizing power, but in surviving the infinite variations of the self.",
    purpose: "To explore the consequences of disrupting divine order. With the Trionfi scattered and unstable, each realm now exerts its own gravitational pull on the multiverse. The purpose is to deepen character arcs by confronting them with alternate selves, moral ambiguity, and existential echoes. Themes of recursion, sovereignty, and divergence are introduced.",
    keyThemes: [
      "The Corruption of Power: What happens when liberators become architects of their own systems?",
      "Identity Collapse Across Timelines: Who are you when your alternate selves make opposing choices?",
      "The Cost of Enlightenment: Seeing too much may burn away what it means to be human",
      "Rebellion as Evolution: Recursion becomes necessary—until the wheel is broken",
      "Temporal Sovereignty: Realms fight not for dominance, but for the right to define what is real"
    ],
    tagline: "Rebellion isn't just against the gods—it's against the very story they wrote you into.",
    consequence: "The structure of time collapses into a spinning wheel of coexisting realms. Characters fracture, merge, or vanish into versions of themselves. What survives this cycle will inherit not just power—but the responsibility to define what remains real.",
    tone: ["Philosophical", "Psychological", "Mythic", "Chaotic", "Haunting"],
    bookRange: "4-6",
    books: [],
    gradientColors: ["#800080", "#7F00FF", "#008080"]
  },
  {
    id: 3,
    title: "The Arcana Ascended",
    subtitle: "Books 7-9",
    description: "In the final trilogy, the remnants of fractured timelines converge toward a final singularity. The Trionfi have evolved beyond symbols into sentient archetypes, choosing their bearers and rewriting their own meaning. Francisco, La Signora, and their remaining allies must face not only divine wrath but the shadow of their own past decisions—echoing across realms. This is not a war for control, but for authorship of reality itself. At the end of the wheel, where time collapses and myth becomes law, the final question is asked: who gets to finish the story?",
    purpose: "To complete the saga by unifying its narrative, thematic, and metaphysical threads. It resolves the divine-human conflict through transformation rather than conquest. Characters ascend, descend, or dissolve as their archetypes fulfill—or reject—their roles. The purpose is to provide mythic closure while honoring narrative ambiguity, giving readers the sense that not all is explained, but all is felt.",
    keyThemes: [
      "Integration of Shadow and Light: True transcendence is not purity—but wholeness",
      "Transcendence Through Sacrifice: Becoming more often means becoming less",
      "The Apotheosis of Humanity: Mortals no longer seek permission—they become the myth",
      "Endings as Evolutions: Every finale is the seed of a new cosmos",
      "The Arcana Embodied: The cards are no longer tools—they are beings, and they choose their future bearers"
    ],
    tagline: "To reshape reality, you must first transcend the story that bound you.",
    consequence: "The Trionfi are no longer cards—they are cosmic laws embodied. Time has collapsed into a mythic framework authored by those who dared to rewrite fate. The story ends not in silence, but in echo—forever inviting the next teller to begin anew.",
    tone: ["Transcendent", "Mythic", "Lyrical", "Melancholic", "Awe-Inspiring"],
    bookRange: "7-9",
    books: [],
    gradientColors: ["#008000", "#7fff00", "#FFBF00"]
  }
];

// Helper functions for enhanced color styling
const getTextColor = (bgColor: string): 'text-white' | 'text-black' => {
  if (!bgColor) return 'text-black';
  const color = bgColor.startsWith('#') ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'text-black' : 'text-white';
};

const createTrilogyGradient = (colors: string[]) => {
  return `linear-gradient(135deg, ${colors[0]}E6 0%, ${colors[1]}CC 50%, ${colors[2]}E6 100%)`;
};

export default function TrilogiesPage() {
  // Removed unused books state
  const [trilogies, setTrilogies] = useState<Trilogy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('/api/books');
        if (response.ok) {
          const data = await response.json();
          
          // Extract books array from the response object
          const booksArray = data.books || [];
          
          // Organize books into trilogies
          const updatedTrilogies = TRILOGY_DATA.map(trilogy => ({
            ...trilogy,
            books: booksArray.filter((book: Book) => {
              const bookNumber = book.bookNumber;
              if (trilogy.id === 1) return bookNumber >= 1 && bookNumber <= 3;
              if (trilogy.id === 2) return bookNumber >= 4 && bookNumber <= 6;
              if (trilogy.id === 3) return bookNumber >= 7 && bookNumber <= 9;
              return false;
            })
          }));
          
          setTrilogies(updatedTrilogies);
        }
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <Breadcrumbs items={[{ label: 'Trilogies', current: true }]} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading trilogies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Breadcrumbs items={[{ label: 'Trilogies', current: true }]} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-600 bg-clip-text text-transparent">
              Epic Arcana
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-200">Trilogies</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
            Three transformative trilogies that chronicle the evolution of reality itself—from divine rebellion to mythic transcendence.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Trilogy Progression */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">The Journey Through Time</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Each trilogy builds upon the consequences of the previous one, creating a cohesive narrative arc that explores the fundamental nature of reality itself.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Genesis</span>
            </div>
            <div className="text-gray-400 dark:text-gray-600">→</div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Wheel</span>
            </div>
            <div className="text-gray-400 dark:text-gray-600">→</div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ascension</span>
            </div>
          </div>
        </div>

        {/* Trilogies */}
        <div className="space-y-16">
          {trilogies.map((trilogy) => {
            const gradientBg = createTrilogyGradient(trilogy.gradientColors);
            const primaryColor = trilogy.gradientColors[0];
            const textColorClass = getTextColor(primaryColor);
            
            return (
              <div key={trilogy.id} className="relative">
                {/* Trilogy Card */}
                <div 
                  className="relative overflow-hidden rounded-3xl p-8 md:p-12 mb-8 shadow-2xl"
                  style={{
                    background: gradientBg,
                    boxShadow: `0 25px 50px -12px ${primaryColor}40, 0 0 0 1px ${primaryColor}20`
                  }}
                >
                  {/* Mystical overlay pattern */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 80%, ${primaryColor}60 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${primaryColor}60 0%, transparent 50%)`
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-start justify-between mb-8">
                      <div className="flex-1 mb-6 md:mb-0">
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold mb-4 ${textColorClass} backdrop-blur-md border`}
                          style={{ 
                            background: `linear-gradient(135deg, ${primaryColor}40, ${primaryColor}60)`,
                            borderColor: `${primaryColor}60`
                          }}>
                          <span className="tracking-wider">TRILOGY {trilogy.id}</span>
                        </div>
                        <h2 className={`text-4xl md:text-5xl font-black ${textColorClass} mb-2 tracking-tight`}
                          style={{ textShadow: `0 2px 8px ${primaryColor}80` }}>
                          {trilogy.title}
                        </h2>
                        <p className={`text-xl ${textColorClass} opacity-90 mb-4 font-medium`}
                          style={{ textShadow: `0 1px 3px ${primaryColor}60` }}>
                          {trilogy.subtitle}
                        </p>
                        <p className={`text-base ${textColorClass} opacity-95 leading-relaxed italic`}
                          style={{ textShadow: `0 1px 3px ${primaryColor}60` }}>
                          &quot;{trilogy.tagline}&quot;
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {trilogy.tone.map((tone, i) => (
                          <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${textColorClass} backdrop-blur-md border`}
                            style={{
                              background: `linear-gradient(135deg, ${primaryColor}30, ${primaryColor}50)`,
                              borderColor: `${primaryColor}50`
                            }}>
                            {tone}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className={`text-xl font-bold ${textColorClass} mb-4`}>Description</h3>
                        <p className={`text-sm ${textColorClass} opacity-90 leading-relaxed mb-6`}
                          style={{ textShadow: `0 1px 3px ${primaryColor}60` }}>
                          {trilogy.description}
                        </p>
                        
                        <h3 className={`text-xl font-bold ${textColorClass} mb-4`}>Purpose</h3>
                        <p className={`text-sm ${textColorClass} opacity-90 leading-relaxed`}
                          style={{ textShadow: `0 1px 3px ${primaryColor}60` }}>
                          {trilogy.purpose}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className={`text-xl font-bold ${textColorClass} mb-4`}>Key Themes</h3>
                        <ul className="space-y-2 mb-6">
                          {trilogy.keyThemes.map((theme, i) => (
                            <li key={i} className={`text-sm ${textColorClass} opacity-90 leading-relaxed`}
                              style={{ textShadow: `0 1px 3px ${primaryColor}60` }}>
                              • {theme}
                            </li>
                          ))}
                        </ul>
                        
                        <h3 className={`text-xl font-bold ${textColorClass} mb-4`}>Consequence</h3>
                        <p className={`text-sm ${textColorClass} opacity-90 leading-relaxed`}
                          style={{ textShadow: `0 1px 3px ${primaryColor}60` }}>
                          {trilogy.consequence}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Books Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trilogy.books.map((book) => {
                    const bookColor = book.colorTheme?.hex || primaryColor;
                    const bookTextColor = getTextColor(bookColor);
                    
                    return (
                      <Link 
                        href={`/books/${book.id}`} 
                        key={book.id} 
                        className="group block"
                      >
                        <div 
                          className="relative overflow-hidden rounded-xl p-6 h-64 transition-all duration-300 transform hover:scale-105 group-hover:shadow-xl"
                          style={{
                            background: `linear-gradient(135deg, ${bookColor}E6 0%, ${bookColor}CC 50%, ${bookColor}B3 100%)`,
                            boxShadow: `0 10px 25px -5px ${bookColor}40`
                          }}
                        >
                          <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-4 ${bookTextColor} backdrop-blur-md border`}
                                style={{ 
                                  background: `linear-gradient(135deg, ${bookColor}40, ${bookColor}60)`,
                                  borderColor: `${bookColor}60`
                                }}>
                                <span className="tracking-wider">BOOK {book.bookNumber}</span>
                              </div>
                              <h3 className={`text-xl font-bold ${bookTextColor} mb-2 leading-tight`}
                                style={{ textShadow: `0 2px 8px ${bookColor}80` }}>
                                {book.title}
                              </h3>
                              {book.originalTitle && (
                                <p className={`text-sm ${bookTextColor} opacity-80 mb-4`}
                                  style={{ textShadow: `0 1px 3px ${bookColor}60` }}>
                                  {book.originalTitle}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              {book.colorTheme && (
                                <div className={`flex items-center px-2 py-1 rounded-lg text-xs font-medium ${bookTextColor} backdrop-blur-md border`}
                                  style={{
                                    background: `linear-gradient(135deg, ${bookColor}30, ${bookColor}50)`,
                                    borderColor: `${bookColor}50`
                                  }}>
                                  <div 
                                    className="w-2 h-2 rounded-full mr-2" 
                                    style={{ backgroundColor: book.colorTheme.hex }}
                                  ></div>
                                  <span className="uppercase tracking-wider">{book.colorTheme.name}</span>
                                </div>
                              )}
                              
                              <div className={`w-6 h-6 ${bookTextColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                                <svg fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}