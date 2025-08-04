'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCharacterArcsData } from '../hooks/useCharacterArcsData'

interface TimelineEvent {
  id: string
  characterId: string
  characterName: string
  arcStage: string
  title: string
  description: string
  book: number
  chapter: number
  chapterTitle?: string
  scene?: string
  color: string
  position: number // 0-1 representing position on timeline
  arcType: string
  connections?: string[] // IDs of related events to connect with arcs
}

interface Character {
  id: string
  name: string
  color: string
  arcType: string
}

interface CharacterArcsTimelineProps {
  selectedCharacter?: string | null
  onEventSelect?: (eventId: string) => void
}

// Helper function for character colors (moved outside component to avoid recreation)
const getCharacterColor = (characterId: string): string => {
  const colorMap: { [key: string]: string } = {
    'francisco-petrarch': '#8B5CF6',
    'la-signora-del-gioco': '#EC4899',
    'dante-alighieri': '#10B981',
    'dagon-atumari': '#DC2626',
    'novella-dandrea': '#F59E0B',
    'hannibal-barca': '#6366F1',
    'madonna-oriente': '#7C3AED',
    'man-from-taured': '#059669',
    'umbra': '#374151'
  }
  return colorMap[characterId] || '#6B7280'
}

export function CharacterArcsTimeline({ selectedCharacter, onEventSelect }: CharacterArcsTimelineProps) {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
  const [stickyEvent, setStickyEvent] = useState<string | null>(null)
  const [timelineZoom, setTimelineZoom] = useState(1)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Load real character arcs data
  const { characters: characterArcsData, storyCards, loading, error } = useCharacterArcsData()

  // Transform character arcs data to timeline format - ALWAYS call this hook
  const characters: Character[] = useMemo(() => {
    if (!characterArcsData || characterArcsData.length === 0) return []
    return characterArcsData.map(arc => ({
      id: arc.characterId,
      name: arc.characterName,
      color: getCharacterColor(arc.characterId),
      arcType: arc.arcType
    }))
  }, [characterArcsData])

  // Transform story cards into timeline events - ALWAYS call this hook
  const timelineEvents: TimelineEvent[] = useMemo(() => {
    if (!storyCards || storyCards.length === 0) return []
    return storyCards.map((card) => {
      const character = characterArcsData.find(arc => arc.id === card.characterArcId)
      const totalStages = storyCards.filter(sc => sc.characterArcId === card.characterArcId).length
      const stageIndex = storyCards.filter(sc => sc.characterArcId === card.characterArcId && sc.displayOrder <= card.displayOrder).length - 1
      
      return {
        id: card.id,
        characterId: character?.characterId || card.characterArcId,
        characterName: character?.characterName || 'Unknown',
        arcStage: card.stageName,
        title: card.title,
        description: card.description,
        book: 1, // Default to book 1, can be enhanced later with scene goals data
        chapter: 1,
        chapterTitle: card.stageName,
        scene: card.description,
        color: card.color,
        position: stageIndex / Math.max(totalStages - 1, 1), // Distribute evenly across timeline
        arcType: character?.arcType || 'Character Arc',
        connections: [] // Can be enhanced with relationship data
      }
    })
  }, [storyCards, characterArcsData])

  // Filter events based on selected character - ALWAYS call this hook
  const filteredEvents = useMemo(() => {
    if (!selectedCharacter) return timelineEvents
    return timelineEvents.filter(event => event.characterId === selectedCharacter)
  }, [selectedCharacter, timelineEvents])

  // Visible characters - ALWAYS call this hook
  const visibleCharacters = useMemo(() => {
    if (!selectedCharacter) return characters
    return characters.filter(char => char.id === selectedCharacter)
  }, [selectedCharacter, characters])

  // Show loading state
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading character arcs...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error loading character arcs: {error}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Using fallback data...</p>
        </div>
      </div>
    )
  }

  // Hook calls already moved to top of component - no duplicates needed

  const handleEventClick = (eventId: string) => {
    setStickyEvent(eventId)
    onEventSelect?.(eventId)
  }

  const handleCloseStickyCard = () => {
    setStickyEvent(null)
  }

  // Component for rendering curved arcs between connected events (currently disabled)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ConnectionArc = ({ fromEvent, toEvent, color }: { 
    fromEvent: TimelineEvent, 
    toEvent: TimelineEvent, 
    color: string 
  }) => {
    const fromX = fromEvent.position * 96 + 2
    const toX = toEvent.position * 96 + 2
    const controlPointY = -25 // Height of the arc curve
    
    const pathData = `M ${fromX}% 50% Q ${(fromX + toX) / 2}% ${50 + controlPointY}% ${toX}% 50%`
    
    // Determine if this is a cross-character connection
    const isCrossCharacter = fromEvent.characterId !== toEvent.characterId
    
    return (
      <svg 
        className="absolute inset-0 pointer-events-none" 
        style={{ zIndex: 1 }}
        width="100%" 
        height="100%"
      >
        {/* Glow effect for the arc */}
        <path
          d={pathData}
          stroke={color + '20'}
          strokeWidth="4"
          fill="none"
          filter="blur(1px)"
        />
        {/* Main arc line */}
        <path
          d={pathData}
          stroke={color + (isCrossCharacter ? '70' : '50')}
          strokeWidth={isCrossCharacter ? "2" : "1.5"}
          fill="none"
          strokeDasharray={isCrossCharacter ? "6,3" : "3,3"}
        />
      </svg>
    )
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden flex">
      {/* Character Selection Sidebar */}
      <div className="w-64 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col">
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Characters</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {selectedCharacter ? 'Showing selected character' : `${characters.length} characters loaded`}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <motion.button
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                !selectedCharacter 
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => onEventSelect?.('all')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                <span className="font-medium">All Characters</span>
              </div>
            </motion.button>
            
            {characters.map((character, index) => (
              <motion.button
                key={character.id}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedCharacter === character.id 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => onEventSelect?.(character.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: character.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{character.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{character.arcType}</div>
                  </div>
                  {selectedCharacter === character.id && (
                    <div className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Timeline Area */}
      <div className="flex-1 p-6 overflow-hidden">
      {/* Timeline Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Character Story Arcs Timeline
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Visual progression of character development across the Epic Arcana series ({characters.length} characters loaded)
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Zoom:</span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={timelineZoom}
                onChange={(e) => setTimelineZoom(parseFloat(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
        </div>

        {/* Book markers */}
        <div className="relative mb-6">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="font-medium">Book {i + 1}</span>
            ))}
          </div>
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full relative">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 w-px h-4 bg-gray-400 dark:bg-gray-500 -mt-1.5"
                style={{ left: `${((i + 1) / 9) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Character Lanes */}
      <div className="relative overflow-auto" style={{ height: 'calc(100% - 200px)' }}>
        <div className="relative space-y-6" style={{ transform: `scale(${timelineZoom})`, transformOrigin: 'top left' }}>
          {/* Book Separation Banners - Vertical lines that extend through all character lanes */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={`book-separator-${i}`}
                className="absolute top-0 bottom-0 flex flex-col items-center"
                style={{ left: `${((i + 1) / 9) * 96 + 2}%` }}
              >
                {/* Vertical line */}
                <div className="w-px bg-gradient-to-b from-blue-400/30 via-purple-400/40 to-blue-400/30 h-full" />
                
                {/* Book label */}
                <div className="absolute -top-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Book {i + 2}
                  </span>
                </div>
                
                {/* Bottom label for reference */}
                <div className="absolute -bottom-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Book {i + 2}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {visibleCharacters.map((character, charIndex) => {
            const characterEvents = filteredEvents.filter(e => e.characterId === character.id)
            
            return (
              <motion.div
                key={character.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: charIndex * 0.1 }}
                style={{ zIndex: 2 }}
              >
                {/* Character Header */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: character.color }}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {character.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {character.arcType} • {characterEvents.length} stages
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline Track */}
                <div className="relative h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4 overflow-visible">
                  {/* Timeline base line */}
                  <div 
                    className="absolute top-10 h-0.5 rounded-full"
                    style={{ 
                      backgroundColor: character.color + '40',
                      left: '2%',
                      right: '2%',
                      zIndex: 3
                    }}
                  />

                  {/* Character Events */}
                  {characterEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      className="absolute cursor-pointer group"
                      style={{ 
                        left: `${event.position * 96 + 2}%`,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10
                      }}
                      whileHover={{ scale: 1.1 }}
                      onMouseEnter={(e) => {
                        setHoveredEvent(event.id)
                        const rect = e.currentTarget.getBoundingClientRect()
                        setMousePosition({ 
                          x: rect.left + rect.width / 2, 
                          y: rect.top - 10 
                        })
                      }}
                      onMouseLeave={() => setHoveredEvent(null)}
                      onClick={() => handleEventClick(event.id)}
                    >
                      {/* Event dot */}
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-md relative"
                        style={{ backgroundColor: event.color }}
                      />

                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span>Positive Change Arc</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            <span>Negative Change Arc</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Flat Arc</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span>Revelation Arc</span>
          </div>
        </div>
      </div>
      </div>

      {/* Global Tooltip - Rendered at top level to avoid clipping */}
      <AnimatePresence>
        {(hoveredEvent || stickyEvent) && (() => {
          const eventId = stickyEvent || hoveredEvent
          const event = filteredEvents.find(e => e.id === eventId)
          if (!event) return null
          
          const isSticky = stickyEvent === eventId
          
          return (
            <motion.div
              className={`fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-80 ${
                isSticky ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
              style={{ 
                zIndex: 9999,
                left: isSticky ? '50%' : mousePosition.x,
                top: isSticky ? '50%' : mousePosition.y,
                transform: isSticky ? 'translate(-50%, -50%)' : 'translate(-50%, -100%)'
              }}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {/* Close button for sticky tooltip */}
              {isSticky && (
                <button
                  onClick={handleCloseStickyCard}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              <div className="space-y-3">
                <div className="flex items-start justify-between pr-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                    {event.title}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 shrink-0">
                    {event.arcType}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Stage:</strong> {event.arcStage.replace(/_/g, ' ')}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {event.description}
                </p>
                <div className="text-sm text-blue-600 dark:text-blue-400 border-t border-gray-200 dark:border-gray-600 pt-3">
                  <strong>Character:</strong> {event.characterName}
                </div>
                {isSticky && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-2">
                    💡 Click the timeline dot to pin this card, or click the X to close
                  </div>
                )}
              </div>
              
              {/* Tooltip arrow - only show for hover tooltips */}
              {!isSticky && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800" />
              )}
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}