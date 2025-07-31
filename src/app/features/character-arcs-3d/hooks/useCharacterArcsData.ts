'use client'

import { useState, useEffect } from 'react'

export interface CharacterArc {
  id: string
  characterId: string
  characterName: string
  arcType: string
  stages: {
    [key: string]: {
      description: string
      chapterReferences?: string[]
      sceneGoals?: Array<{
        chapter: number
        scene: number
        goal: string
        arcDevelopment: string
      }>
    }
  }
  thematicElements: {
    [key: string]: {
      development: string
      storyArcGoals?: Array<{
        chapter: number
        goal: string
        measurement: string
      }>
    }
  }
}

export interface StoryCard {
  id: string
  characterArcId: string
  stageName: string
  title: string
  description: string
  chapterReferences: string[]
  sceneGoals: Array<{
    chapter: number
    scene: number
    goal: string
    arcDevelopment: string
  }>
  position: { x: number; y: number; z: number }
  color: string
  displayOrder: number
  isVisible: boolean
}

export interface CharacterArcsData {
  characters: CharacterArc[]
  storyCards: StoryCard[]
  loading: boolean
  error: string | null
}

export function useCharacterArcsData(): CharacterArcsData {
  const [characters, setCharacters] = useState<CharacterArc[]>([])
  const [storyCards, setStoryCards] = useState<StoryCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCharacterArcs() {
      try {
        setLoading(true)
        
        // Fetch character arcs from API
        const response = await fetch('/api/character-arcs-3d')
        
        if (!response.ok) {
          throw new Error('Failed to fetch character arcs')
        }
        
        const data = await response.json()
        
        setCharacters(data.characters || [])
        setStoryCards(data.storyCards || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching character arcs:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        
        // Fallback to mock data if API fails
        setCharacters(getMockCharacters())
        setStoryCards(getMockStoryCards())
      } finally {
        setLoading(false)
      }
    }

    fetchCharacterArcs()
  }, [])

  return {
    characters,
    storyCards,
    loading,
    error
  }
}

// Mock data for development
function getMockCharacters(): CharacterArc[] {
  return [
    {
      id: 'francisco-arc',
      characterId: 'francisco',
      characterName: 'Francisco Petrarch',
      arcType: "Hero's Journey",
      stages: {
        initial_state: {
          description: 'Young law student at University of Bologna, infatuated with Novella d\'Andrea',
          chapterReferences: ['Chapter 1: Despair'],
          sceneGoals: [
            {
              chapter: 1,
              scene: 1,
              goal: 'Establish Francisco\'s despair and isolation at university',
              arcDevelopment: 'Show his disconnection from peers and family expectations'
            },
            {
              chapter: 1,
              scene: 2,
              goal: 'Introduce Novella encounter and academic setting',
              arcDevelopment: 'Demonstrate his romantic idealization and social naivety'
            }
          ]
        },
        inciting_incident: {
          description: 'Creation of Trionfi cards and encounter with La Signora del Gioco',
          chapterReferences: ['Chapter 1: Despair', 'Chapter 2: Guileless'],
          sceneGoals: [
            {
              chapter: 1,
              scene: 3,
              goal: 'Francisco questions reality behind the screen and introduces Trionfi cards',
              arcDevelopment: 'First hint at his hidden talents and deeper understanding'
            },
            {
              chapter: 2,
              scene: 3,
              goal: 'Meeting with Dante reveals cosmic significance',
              arcDevelopment: 'Understanding that his destiny is greater than law studies'
            }
          ]
        }
      },
      thematicElements: {
        power: {
          development: 'From seeking power to understanding responsibility',
          storyArcGoals: [
            {
              chapter: 1,
              goal: 'Establish Francisco\'s unconscious power through card creation',
              measurement: 'Francisco creates cards without understanding their true nature'
            },
            {
              chapter: 20,
              goal: 'Francisco consciously uses Trionfi power to find Cicero\'s manuscript',
              measurement: 'Successful manipulation of timeline probability to locate lost work'
            }
          ]
        }
      }
    }
  ]
}

function getMockStoryCards(): StoryCard[] {
  return [
    {
      id: 'card-francisco-1',
      characterArcId: 'francisco-arc',
      stageName: 'initial_state',
      title: 'Law Student Despair',
      description: 'Francisco struggles with isolation and family expectations at university',
      chapterReferences: ['Chapter 1: Despair'],
      sceneGoals: [
        {
          chapter: 1,
          scene: 1,
          goal: 'Establish Francisco\'s despair and isolation',
          arcDevelopment: 'Show disconnection from peers and family'
        }
      ],
      position: { x: -3, y: 2, z: 0 },
      color: '#EF4444',
      displayOrder: 1,
      isVisible: true
    },
    {
      id: 'card-francisco-2',
      characterArcId: 'francisco-arc',
      stageName: 'inciting_incident',
      title: 'Trionfi Discovery',
      description: 'Francisco creates the Trionfi cards and discovers their supernatural power',
      chapterReferences: ['Chapter 1: Despair', 'Chapter 2: Guileless'],
      sceneGoals: [
        {
          chapter: 1,
          scene: 3,
          goal: 'Introduce Trionfi cards with mysterious power',
          arcDevelopment: 'First hint at hidden talents'
        }
      ],
      position: { x: -1, y: 3, z: 0 },
      color: '#F59E0B',
      displayOrder: 2,
      isVisible: true
    }
  ]
}