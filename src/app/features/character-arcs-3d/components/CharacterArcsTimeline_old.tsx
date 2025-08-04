'use client'
/* eslint-disable */

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

export function CharacterArcsTimeline({ selectedCharacter, onEventSelect }: CharacterArcsTimelineProps) {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
  const [timelineZoom, setTimelineZoom] = useState(1)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Load real character arcs data
  const { characters: characterArcsData, storyCards, loading, error } = useCharacterArcsData()

  // Transform character arcs data to timeline format
  const characters: Character[] = useMemo(() => {
    return characterArcsData.map(arc => ({
      id: arc.characterId,
      name: arc.characterName,
      color: getCharacterColor(arc.characterId),
      arcType: arc.arcType
    }))
  }, [characterArcsData])

  // Helper function for character colors
  function getCharacterColor(characterId: string): string {
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

  // Transform story cards into timeline events
  const timelineEvents: TimelineEvent[] = useMemo(() => {
    return storyCards.map((card, index) => {
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
          <p className="text-gray-600 dark:text-gray-400">Falling back to mock data...</p>
        </div>
      </div>
    )
  }

  // Filter events based on selected character
  const filteredEvents = useMemo(() => {
    if (!selectedCharacter) return timelineEvents
    return timelineEvents.filter(event => event.characterId === selectedCharacter)
  }, [selectedCharacter, timelineEvents]);

  // Event data has been moved to the hook - using timelineEvents from there

  const filteredEvents = useMemo(() => {
    if (!selectedCharacter) return timelineEvents
    return timelineEvents.filter(event => event.characterId === selectedCharacter)
  }, [selectedCharacter, timelineEvents]);

  const visibleCharacters = useMemo(() => {
    if (!selectedCharacter) return characters
    return characters.filter(char => char.id === selectedCharacter)
  }, [selectedCharacter])

  const handleEventClick = (eventId: string) => {
    onEventSelect?.(eventId)
  }

  // Component for rendering curved arcs between connected events  
  const ConnectionArc = ({ fromEvent, toEvent, color }: { 
    fromEvent: TimelineEvent, 
    toEvent: TimelineEvent, 
    color: string 
  }) => {
    // Temporarily disabled - needs proper implementation
    const _ = { fromEvent, toEvent, color }; // Mark variables as used
    return null;
  };

  // TODO: Clean up this data - it appears to be duplicated
  const legacyData = {
      characterName: 'Francisco Petrarch',
      arcStage: 'Call to Adventure',
      title: 'Explosive - Quick Decisive Creativity',
      description: "Francisco's burst of creative energy leading to the Trionfi cards' creation",
      book: 1,
      chapter: 4,
      scene: 'Bologna gardens - Card creation',
      color: '#8B5CF6',
      position: 0.08,
      arcType: "Hero's Journey",
      connections: ['francisco-4', 'signora-2']
    },
    {
      id: 'francisco-4',
      characterId: 'francisco',
      characterName: 'Francisco Petrarch',
      arcStage: 'Call to Adventure',
      title: 'Meeting La Signora',
      description: 'First meeting with La Signora and understanding of card power',
      book: 1,
      chapter: 6,
      scene: 'Mystical encounter - Power revelation',
      color: '#8B5CF6',
      position: 0.12,
      arcType: "Hero's Journey",
      connections: ['francisco-5', 'signora-3']
    },
    {
      id: 'francisco-5',
      characterId: 'francisco',
      characterName: 'Francisco Petrarch',
      arcStage: 'Trials and Growth',
      title: 'Dominion - Self-Mastery',
      description: 'Francisco begins to master his new abilities and understand his role',
      book: 1,
      chapter: 7,
      scene: 'Training with Dante - Self-discipline',
      color: '#8B5CF6',
      position: 0.14,
      arcType: "Hero's Journey",
      connections: ['francisco-6', 'dante-1']
    },
    {
      id: 'francisco-6',
      characterId: 'francisco',
      characterName: 'Francisco Petrarch',
      arcStage: 'Midpoint Revelation',
      title: 'Transcendent Understanding',
      description: 'Francisco discovers Cicero\'s manuscript and understands the cosmic stakes',
      book: 5,
      chapter: 20,
      scene: 'Ancient library - Manuscript discovery',
      color: '#8B5CF6',
      position: 0.55,
      arcType: "Hero's Journey",
      connections: ['francisco-7']
    },
    {
      id: 'francisco-7',
      characterId: 'francisco',
      characterName: 'Francisco Petrarch',
      arcStage: 'Final Confrontation',
      title: 'Ambition Fulfilled',
      description: "Francisco's ultimate confrontation with Dagon and resolution of destiny",
      book: 9,
      chapter: 35,
      scene: 'Final battle - Timeline restoration',
      color: '#8B5CF6',
      position: 0.97,
      arcType: "Hero's Journey",
      connections: ['signora-6', 'dagon-4']
    },

    // La Signora's arc
    {
      id: 'signora-1',
      characterId: 'la-signora',
      characterName: 'La Signora del Gioco',
      arcStage: 'Hidden Identity',
      title: 'Social Masking',
      description: 'Giovanna hiding her true nature and cursed heritage',
      book: 1,
      chapter: 1,
      scene: 'Social gathering - False persona',
      color: '#EC4899',
      position: 0.02,
      arcType: 'Transformation Arc'
    },
    {
      id: 'signora-2',
      characterId: 'la-signora',
      characterName: 'La Signora del Gioco',
      arcStage: 'Awakening',
      title: 'Power Recognition',
      description: 'Giovanna senses the cards\' power and begins to awaken',
      book: 1,
      chapter: 5,
      scene: 'Supernatural awareness moment',
      color: '#EC4899',
      position: 0.10,
      arcType: 'Transformation Arc'
    },
    {
      id: 'signora-3',
      characterId: 'la-signora',
      characterName: 'La Signora del Gioco',
      arcStage: 'Awakening',
      title: 'True Identity Revealed',
      description: 'Giovanna reveals herself to Francisco and accepts her role',
      book: 1,
      chapter: 6,
      scene: 'Transformation scene - Power manifestation',
      color: '#EC4899',
      position: 0.12,
      arcType: 'Transformation Arc'
    },
    {
      id: 'signora-4',
      characterId: 'la-signora',
      characterName: 'La Signora del Gioco',
      arcStage: 'Power Development',
      title: 'Strategic Planning',
      description: 'Giovanna develops her strategic and leadership abilities',
      book: 3,
      chapter: 10,
      scene: 'War council - Leadership emergence',
      color: '#EC4899',
      position: 0.33,
      arcType: 'Transformation Arc'
    },
    {
      id: 'signora-5',
      characterId: 'la-signora',
      characterName: 'La Signora del Gioco',
      arcStage: 'Integration',
      title: 'Identity Mastery',
      description: 'Giovanna learns to use her dual nature as a strength',
      book: 6,
      chapter: 15,
      scene: 'Strategic deception - Dual identity use',
      color: '#EC4899',
      position: 0.67,
      arcType: 'Transformation Arc'
    },
    {
      id: 'signora-6',
      characterId: 'la-signora',
      characterName: 'La Signora del Gioco',
      arcStage: 'Transcendence',
      title: 'Final Transformation',
      description: 'Giovanna\'s transformation complete, ready for final battle',
      book: 9,
      chapter: 39,
      scene: 'Final form - Transcendent power',
      color: '#EC4899',
      position: 0.98,
      arcType: 'Transformation Arc'
    },

    // Dante's arc
    {
      id: 'dante-1',
      characterId: 'dante',
      characterName: 'Dante Alighieri',
      arcStage: 'Introduction',
      title: 'Mentor Appears',
      description: 'Dante appears as Francisco\'s guide and mentor',
      book: 1,
      chapter: 7,
      scene: 'First appearance - Teaching begins',
      color: '#10B981',
      position: 0.14,
      arcType: 'Mentor Arc'
    },
    {
      id: 'dante-2',
      characterId: 'dante',
      characterName: 'Dante Alighieri',
      arcStage: 'Guidance',
      title: 'Philosophical Wisdom',
      description: 'Dante shares deeper philosophical insights about power and responsibility',
      book: 2,
      chapter: 10,
      scene: 'Philosophical discussion - Deep wisdom',
      color: '#10B981',
      position: 0.24,
      arcType: 'Mentor Arc'
    },
    {
      id: 'dante-3',
      characterId: 'dante',
      characterName: 'Dante Alighieri',
      arcStage: 'Transformation',
      title: 'Renewed Purpose',
      description: 'Dante gains new understanding through his teaching role',
      book: 7,
      chapter: 15,
      scene: 'Personal revelation - Growth through teaching',
      color: '#10B981',
      position: 0.78,
      arcType: 'Mentor Arc'
    },
    {
      id: 'dante-4',
      characterId: 'dante',
      characterName: 'Dante Alighieri',
      arcStage: 'Sacrifice',
      title: 'Final Wisdom',
      description: 'Dante provides final wisdom before his departure',
      book: 8,
      chapter: 35,
      scene: 'Emotional farewell - Responsibility passed',
      color: '#10B981',
      position: 0.93,
      arcType: 'Mentor Arc'
    },

    // Dagon's arc
    {
      id: 'dagon-1',
      characterId: 'dagon',
      characterName: 'Dagon Atumari',
      arcStage: 'Hidden Influence',
      title: 'Subtle Manipulation',
      description: 'Dagon\'s first subtle influence on Francisco\'s awakening',
      book: 1,
      chapter: 3,
      scene: 'Environmental influence - Hidden presence',
      color: '#DC2626',
      position: 0.06,
      arcType: 'Antagonist Arc',
      connections: ['dagon-2']
    },
    {
      id: 'dagon-2',
      characterId: 'dagon',
      characterName: 'Dagon Atumari',
      arcStage: 'Revelation',
      title: 'True Agenda Revealed',
      description: 'Dagon reveals his vision of the future and his plans',
      book: 4,
      chapter: 1,
      scene: 'First direct contact - Power demonstration',
      color: '#DC2626',
      position: 0.40,
      arcType: 'Antagonist Arc'
    },
    {
      id: 'dagon-3',
      characterId: 'dagon',
      characterName: 'Dagon Atumari',
      arcStage: 'Escalation',
      title: 'Decisive Action',
      description: 'Dagon takes decisive action to advance his agenda',
      book: 6,
      chapter: 25,
      scene: 'Timeline manipulation - Direct threat',
      color: '#DC2626',
      position: 0.69,
      arcType: 'Antagonist Arc'
    },
    {
      id: 'dagon-4',
      characterId: 'dagon',
      characterName: 'Dagon Atumari',
      arcStage: 'Confrontation',
      title: 'Final Battle',
      description: 'Dagon\'s final confrontation and ultimate transformation',
      book: 9,
      chapter: 35,
      scene: 'Climactic battle - Power clash',
      color: '#DC2626',
      position: 0.97,
      arcType: 'Antagonist Arc'
    }
  ]

  const filteredEvents = useMemo(() => {
    if (!selectedCharacter) return timelineEvents
    return timelineEvents.filter(event => event.characterId === selectedCharacter)
  }, [selectedCharacter])

  const visibleCharacters = useMemo(() => {
    if (!selectedCharacter) return characters
    return characters.filter(char => char.id === selectedCharacter)
  }, [selectedCharacter])

  const handleEventClick = (eventId: string) => {
    onEventSelect?.(eventId)
  }

  // Component for rendering curved arcs between connected events
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
      <div className="w-64 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Characters</h3>
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
          
          {characters.map((character) => (
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
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: character.color }}
                />
                <div>
                  <div className="font-medium">{character.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{character.arcType}</div>
                </div>
              </div>
            </motion.button>
          ))}
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
              Visual progression of character development across the Epic Arcana series
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
        <div className="space-y-6" style={{ transform: `scale(${timelineZoom})`, transformOrigin: 'top left' }}>
          {visibleCharacters.map((character, charIndex) => {
            const characterEvents = filteredEvents.filter(e => e.characterId === character.id)
            
            return (
              <motion.div
                key={character.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: charIndex * 0.1 }}
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
                        {character.arcType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline Track */}
                <div className="relative h-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4 overflow-visible">
                  {/* Timeline base line */}
                  <div 
                    className="absolute top-10 h-0.5 rounded-full"
                    style={{ 
                      backgroundColor: character.color + '40',
                      left: '2%',
                      right: '2%',
                      zIndex: 0
                    }}
                  />

                  {/* Connection Arcs - Both within character and cross-character */}
                  {characterEvents.map((event) => 
                    event.connections?.map((connectionId) => {
                      // First check within same character
                      let connectedEvent = characterEvents.find(e => e.id === connectionId)
                      
                      // If not found, check all events for cross-character connections
                      if (!connectedEvent) {
                        connectedEvent = filteredEvents.find(e => e.id === connectionId)
                      }
                      
                      if (!connectedEvent) return null
                      
                      return (
                        <ConnectionArc
                          key={`${event.id}-${connectionId}`}
                          fromEvent={event}
                          toEvent={connectedEvent}
                          color={event.characterId === connectedEvent.characterId ? character.color : '#6B7280'}
                        />
                      )
                    })
                  ).flat().filter(Boolean)}

                  {/* Character Events */}
                  {characterEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      className="absolute cursor-pointer group"
                      style={{ 
                        left: `${event.position * 96 + 2}%`,
                        top: '50%',
                        transform: 'translateY(-50%)'
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
                        style={{ backgroundColor: event.color, zIndex: 10 }}
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
            <span>Hero's Journey</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded-full bg-pink-500" />
            <span>Transformation Arc</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Mentor Arc</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            <span>Antagonist Arc</span>
          </div>
        </div>
      </div>
      </div>

      {/* Global Tooltip - Rendered at top level to avoid clipping */}
      <AnimatePresence>
        {hoveredEvent && (
          <motion.div
            className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3 w-72 pointer-events-none"
            style={{ 
              zIndex: 9999,
              left: mousePosition.x,
              top: mousePosition.y,
              transform: 'translate(-50%, -100%)'
            }}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {(() => {
              const event = filteredEvents.find(e => e.id === hoveredEvent)
              if (!event) return null
              
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {event.title}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Book {event.book}, Ch. {event.chapter}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Stage:</strong> {event.arcStage}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {event.description}
                  </p>
                  {event.scene && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-2">
                      <strong>Scene:</strong> {event.scene}
                    </div>
                  )}
                  {event.connections && event.connections.length > 0 && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 border-t border-gray-200 dark:border-gray-600 pt-2">
                      <strong>Connected to:</strong> {event.connections.length} story {event.connections.length === 1 ? 'point' : 'points'}
                    </div>
                  )}
                </div>
              )
            })()}
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}