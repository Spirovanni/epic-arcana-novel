/**
 * Color mapping for Epic Arcana chapters to maintain consistency
 * across calendar views and chapter pages
 */

// Cache for chapter color data
let chapterColorCache: Record<string, string> | null = null;
const isDev = process.env.NODE_ENV === 'development';

export function getBookNumberForDay(dayOfYear: number): number {
  return Math.min(Math.ceil(dayOfYear / 40.5), 9);
}

export function getChapterNumberForDay(dayOfYear: number): number {
  const bookNumber = getBookNumberForDay(dayOfYear);
  const dayInBook = dayOfYear - ((bookNumber - 1) * 40.5);
  return Math.ceil(dayInBook);
}

// Fallback colors for when API is not available
function getFallbackColorForDay(dayOfYear: number): string {
  const bookNumber = getBookNumberForDay(dayOfYear);
  const chapterInBook = getChapterNumberForDay(dayOfYear);
  
  // Different color gradients for each book
  const bookBaseColors = {
    1: { base: [245, 158, 11], name: 'amber' },    // Amber base
    2: { base: [234, 88, 12], name: 'orange' },    // Orange base  
    3: { base: [219, 39, 119], name: 'pink' },     // Pink base
    4: { base: [147, 51, 234], name: 'purple' },   // Purple base
    5: { base: [79, 70, 229], name: 'indigo' },    // Indigo base
    6: { base: [59, 130, 246], name: 'blue' },     // Blue base
    7: { base: [34, 197, 94], name: 'green' },     // Green base
    8: { base: [132, 204, 22], name: 'lime' },     // Lime base
    9: { base: [245, 158, 11], name: 'amber' },    // Back to amber
  };
  
  const bookColor = bookBaseColors[bookNumber as keyof typeof bookBaseColors] || bookBaseColors[1];
  
  // Create variation for each chapter (40 chapters per book)
  const variation = (chapterInBook - 1) / 39; // 0 to 1
  const lighten = 0.3 * variation; // Lighten by up to 30%
  
  const r = Math.min(255, Math.round(bookColor.base[0] + (255 - bookColor.base[0]) * lighten));
  const g = Math.min(255, Math.round(bookColor.base[1] + (255 - bookColor.base[1]) * lighten));
  const b = Math.min(255, Math.round(bookColor.base[2] + (255 - bookColor.base[2]) * lighten));
  
  return `rgb(${r}, ${g}, ${b})`;
}

export async function getChapterColorForDay(dayOfYear: number): Promise<string> {
  const bookNumber = getBookNumberForDay(dayOfYear);
  const chapterNumber = getChapterNumberForDay(dayOfYear);
  const cacheKey = `book${bookNumber}chapter${chapterNumber}`;
  
  // Return cached color if available
  if (chapterColorCache && chapterColorCache[cacheKey]) {
    return chapterColorCache[cacheKey];
  }
  
  // Try to fetch from API
  try {
    const response = await fetch(`/api/books`);
    if (response.ok) {
      const data = await response.json();
      if (data.books && Array.isArray(data.books)) {
        const book = data.books.find((b: any) => b.bookNumber === bookNumber);
        if (book && book.id) {
          // Fetch chapters for this book
          const chaptersResponse = await fetch(`/api/books/${book.id}/chapters`);
          if (chaptersResponse.ok) {
            const chaptersData = await chaptersResponse.json();
            if (chaptersData.chapters && Array.isArray(chaptersData.chapters)) {
              const chapter = chaptersData.chapters.find((c: any) => c.chapterNumber === chapterNumber);
              if (chapter && chapter.hexCode) {
                // Initialize cache if needed
                if (!chapterColorCache) chapterColorCache = {};
                
                // Store in cache and return
                const color = chapter.hexCode;
                chapterColorCache[cacheKey] = color;
                return color;
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('Failed to fetch chapter color, using fallback:', error);
  }
  
  // Use fallback color
  const fallbackColor = getFallbackColorForDay(dayOfYear);
  
  // Cache the fallback too
  if (!chapterColorCache) chapterColorCache = {};
  chapterColorCache[cacheKey] = fallbackColor;
  
  return fallbackColor;
}

// Synchronous version that returns fallback immediately, then tries to upgrade
export function getBookColorForDay(dayOfYear: number): string {
  const bookNumber = getBookNumberForDay(dayOfYear);
  const chapterNumber = getChapterNumberForDay(dayOfYear);
  const cacheKey = `book${bookNumber}chapter${chapterNumber}`;
  
  // Return cached color if available
  if (chapterColorCache && chapterColorCache[cacheKey]) {
    return chapterColorCache[cacheKey];
  }
  
  // Return fallback color immediately
  return getFallbackColorForDay(dayOfYear);
}

// Clear the cache (useful for development)
export function clearChapterColorCache() {
  chapterColorCache = null;
  if (isDev) {
    console.log('Chapter color cache cleared');
  }
}

// Debug function to see color mappings
export function debugDayColors(startDay: number = 1, endDay: number = 10) {
  if (!isDev) return;

  console.log('Day-to-Chapter Color Mapping:');
  for (let day = startDay; day <= endDay; day++) {
    const bookNum = getBookNumberForDay(day);
    const chapterNum = getChapterNumberForDay(day);
    const color = getBookColorForDay(day);
    console.log(`Day ${day}: Book ${bookNum}, Chapter ${chapterNum} -> ${color}`);
  }
}
