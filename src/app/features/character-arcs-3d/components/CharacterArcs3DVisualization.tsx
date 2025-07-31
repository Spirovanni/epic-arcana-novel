'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Html, Environment, PerspectiveCamera } from '@react-three/drei'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

import { StoryCard3D } from './StoryCard3D'
import { CharacterArcTimeline } from './CharacterArcTimeline'
import { RelationshipLines } from './RelationshipLines'
import { useCharacterArcsData } from '../hooks/useCharacterArcsData'

interface Character3DNode {
  id: string
  name: string
  position: [number, number, number]
  color: string
  arcType: string
  image?: string
  storyCards: StoryCard[]
}

interface StoryCard {
  id: string
  title: string
  stage: string
  description: string
  chapterRefs: string[]
  position: [number, number, number]
  color: string
}

// Camera controller component
function CameraController({ selectedCharacter }: { selectedCharacter: string | null }) {
  const { camera } = useThree()
  
  useFrame(() => {
    if (selectedCharacter) {
      // Smoothly move camera to focus on selected character
      const targetPosition = new THREE.Vector3(0, 0, 10)
      camera.position.lerp(targetPosition, 0.05)
      camera.lookAt(0, 0, 0)
    }
  })
  
  return null
}

// Character node component
function CharacterNode({ 
  character, 
  isSelected, 
  onSelect,
  onCardDrop 
}: { 
  character: Character3DNode
  isSelected: boolean
  onSelect: (id: string) => void
  onCardDrop: (cardId: string, position: [number, number, number]) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = character.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
      
      // Rotation based on selection
      if (isSelected) {
        meshRef.current.rotation.y += 0.01
      }
    }
  })

  return (
    <group position={character.position}>
      {/* Main character sphere */}
      <mesh
        ref={meshRef}
        onClick={() => onSelect(character.id)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[isSelected ? 1.2 : hovered ? 1.1 : 1]} />
        <meshStandardMaterial 
          color={character.color}
          emissive={isSelected ? character.color : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Character name label */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.5}
        color={isSelected ? '#ffffff' : '#666666'}
        anchorX="center"
        anchorY="middle"
      >
        {character.name}
      </Text>

      {/* Arc type label */}
      <Text
        position={[0, -2.8, 0]}
        fontSize={0.3}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        {character.arcType}
      </Text>

      {/* Character image (if available) */}
      {character.image && (
        <Html position={[0, 0, 1.5]} center>
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
            <img 
              src={character.image} 
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>
        </Html>
      )}

      {/* Story cards for this character */}
      {character.storyCards.map((card, index) => (
        <StoryCard3D
          key={card.id}
          card={card}
          parentPosition={character.position}
          index={index}
          isCharacterSelected={isSelected}
          onDrop={onCardDrop}
        />
      ))}
    </group>
  )
}

// Main 3D scene component
function Scene3D({ 
  characters, 
  selectedCharacter, 
  onCharacterSelect,
  onCardDrop 
}: {
  characters: Character3DNode[]
  selectedCharacter: string | null
  onCharacterSelect: (id: string) => void
  onCardDrop: (cardId: string, position: [number, number, number]) => void
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4f46e5" />
      
      {/* Environment */}
      <Environment preset="city" />
      
      {/* Camera controller */}
      <CameraController selectedCharacter={selectedCharacter} />
      
      {/* Characters */}
      {characters.map((character) => (
        <CharacterNode
          key={character.id}
          character={character}
          isSelected={selectedCharacter === character.id}
          onSelect={onCharacterSelect}
          onCardDrop={onCardDrop}
        />
      ))}
      
      {/* Relationship lines between characters */}
      <RelationshipLines characters={characters} />
      
      {/* Timeline visualization */}
      <CharacterArcTimeline characters={characters} />
      
      {/* Grid helper */}
      <gridHelper args={[50, 50]} position={[0, -5, 0]} />
    </>
  )
}

export function CharacterArcs3DVisualization() {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Load character arcs data
  const { characters, loading, error } = useCharacterArcsData()

  // Mock data for development
  const mockCharacters: Character3DNode[] = [
    {
      id: 'francisco',
      name: 'Francisco Petrarch',
      position: [0, 0, 0],
      color: '#8B5CF6',
      arcType: "Hero's Journey",
      image: '/images/characters/francisco-petrarch-1752459749919.png',
      storyCards: [
        {
          id: 'card1',
          title: 'Initial State',
          stage: 'Ordinary World',
          description: 'Young law student struggling with expectations',
          chapterRefs: ['Chapter 1: Despair'],
          position: [-3, 2, 0],
          color: '#EF4444'
        },
        {
          id: 'card2',
          title: 'Call to Adventure',
          stage: 'Inciting Incident',
          description: 'Discovery of Trionfi cards power',
          chapterRefs: ['Chapter 1: Despair', 'Chapter 2: Guileless'],
          position: [-1, 3, 0],
          color: '#F59E0B'
        },
        {
          id: 'card3',
          title: 'Mentor Meeting',
          stage: 'Rising Action',
          description: 'Learning from Dante about cosmic significance',
          chapterRefs: ['Chapter 2: Guileless'],
          position: [1, 3, 0],
          color: '#10B981'
        },
        {
          id: 'card4',
          title: 'Final Battle',
          stage: 'Climax',
          description: 'Confrontation with Dagon using wisdom',
          chapterRefs: ['Chapter 38'],
          position: [3, 2, 0],
          color: '#3B82F6'
        }
      ]
    },
    {
      id: 'la-signora',
      name: 'La Signora del Gioco',
      position: [8, 0, 0],
      color: '#EC4899',
      arcType: 'Transformation Arc',
      image: '/images/characters/giovanna-de-sade-1752548654762.png',
      storyCards: [
        {
          id: 'card5',
          title: 'Hidden Identity',
          stage: 'Initial State',
          description: 'Giovanna hiding her true nature',
          chapterRefs: ['Chapters 5-8'],
          position: [5, 2, 0],
          color: '#8B5CF6'
        },
        {
          id: 'card6',
          title: 'Power Discovery',
          stage: 'Transformation',
          description: 'Connection to Trionfi cards revealed',
          chapterRefs: ['Chapters 9-18'],
          position: [7, 3, 0],
          color: '#06B6D4'
        },
        {
          id: 'card7',
          title: 'True Identity',
          stage: 'Resolution',
          description: 'Complete integration of all aspects',
          chapterRefs: ['Chapters 33-40'],
          position: [11, 2, 0],
          color: '#84CC16'
        }
      ]
    },
    {
      id: 'dagon',
      name: 'Dagon Atumari',
      position: [-8, 0, 0],
      color: '#DC2626',
      arcType: 'Antagonist Journey',
      storyCards: [
        {
          id: 'card8',
          title: 'Ancient Control',
          stage: 'Initial State',
          description: 'Divine power seeking order',
          chapterRefs: ['Chapters 8-12'],
          position: [-11, 2, 0],
          color: '#7C2D12'
        },
        {
          id: 'card9',
          title: 'Peak Power',
          stage: 'Confrontation',
          description: 'Maximum control over timeline',
          chapterRefs: ['Chapters 26-38'],
          position: [-5, 3, 0],
          color: '#B91C1C'
        },
        {
          id: 'card10',
          title: 'Transformation',
          stage: 'Resolution',
          description: 'Understanding and acceptance',
          chapterRefs: ['Chapters 38-40'],
          position: [-5, 1, 0],
          color: '#059669'
        }
      ]
    }
  ]

  const handleCharacterSelect = useCallback((characterId: string) => {
    setSelectedCharacter(characterId === selectedCharacter ? null : characterId)
  }, [selectedCharacter])

  const handleCardDrop = useCallback((cardId: string, position: [number, number, number]) => {
    console.log('Card dropped:', cardId, 'at position:', position)
    // TODO: Update card position in database
  }, [])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading 3D Character Arcs...</p>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <Scene3D
            characters={mockCharacters}
            selectedCharacter={selectedCharacter}
            onCharacterSelect={handleCharacterSelect}
            onCardDrop={handleCardDrop}
          />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
          />
        </Canvas>

        {/* Selected Character Info Panel */}
        <AnimatePresence>
          {selectedCharacter && (
            <motion.div
              className="absolute bottom-6 left-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 max-w-md"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {mockCharacters.find(c => c.id === selectedCharacter)?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {mockCharacters.find(c => c.id === selectedCharacter)?.arcType}
              </p>
              <div className="space-y-2">
                {mockCharacters.find(c => c.id === selectedCharacter)?.storyCards.map((card) => (
                  <div key={card.id} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: card.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {card.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  )
}