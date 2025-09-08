/**
 * Utility functions for mapping personality profiles to chapter icons
 */

import { familyFromChapter, idx40FromChapter } from './canonical'

/**
 * Get the chapter icon path for a given chapter number (1-360)
 * @param chapter Chapter number (1-360)
 * @returns Icon path relative to public folder
 */
export function getChapterIconPath(chapter: number): string {
  if (chapter < 1 || chapter > 360) {
    throw new Error(`Chapter ${chapter} is out of range (1-360)`)
  }
  
  const book = familyFromChapter(chapter)  // 1-9
  const chapterInBook = idx40FromChapter(chapter) + 1  // 1-40
  
  return `/icons/chapters/book${book}/chapter${chapterInBook}.png`
}

/**
 * Get chapter icon path from Epic Arcana ID (e.g. "EA-001")
 * @param eaId Epic Arcana ID string
 * @returns Icon path relative to public folder
 */
export function getChapterIconFromEaId(eaId: string): string {
  const match = eaId.match(/^EA-(\d{3})$/)
  if (!match) {
    throw new Error(`Invalid EA ID format: ${eaId}`)
  }
  
  const chapter = parseInt(match[1], 10)
  return getChapterIconPath(chapter)
}

/**
 * Get all icon paths for a specific book/family
 * @param book Book number (1-9)
 * @returns Array of 40 icon paths for the book
 */
export function getBookIconPaths(book: number): string[] {
  if (book < 1 || book > 9) {
    throw new Error(`Book ${book} is out of range (1-9)`)
  }
  
  const paths: string[] = []
  for (let chapter = 1; chapter <= 40; chapter++) {
    paths.push(`/icons/chapters/book${book}/chapter${chapter}.png`)
  }
  return paths
}

/**
 * Preload chapter icon for better performance
 * @param iconPath Icon path relative to public folder
 */
export function preloadChapterIcon(iconPath: string): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = iconPath
    document.head.appendChild(link)
  }
}