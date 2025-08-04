'use client'

import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

interface Character {
  id: string
  name: string
  position: [number, number, number]
  color: string
  arcType: string
}

function CharacterSphere({ character, isSelected, onSelect }: {
  character: Character
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Simple floating animation
      meshRef.current.position.y = character.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
      
      // Rotation when selected
      if (isSelected) {
        meshRef.current.rotation.y += 0.01
      }
    }
  })

  return (
    <group position={character.position}>
      <mesh
        ref={meshRef}
        onClick={() => onSelect(character.id)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[isSelected ? 1.2 : hovered ? 1.1 : 1, 32, 32]} />
        <meshStandardMaterial 
          color={character.color}
          emissive={isSelected ? character.color : hovered ? character.color : '#000000'}
          emissiveIntensity={isSelected ? 0.4 : hovered ? 0.2 : 0}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Glowing ring effect when selected */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <ringGeometry args={[1.5, 1.8, 32]} />
          <meshBasicMaterial 
            color={character.color} 
            transparent 
            opacity={0.6}
          />
        </mesh>
      )}
      
      {/* Character name label - using HTML instead of Text */}
      <Html position={[0, -2.5, 0]} center>
        <div className="text-center">
          <div className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
            {character.name}
          </div>
          <div className="text-xs" style={{ color: isSelected ? character.color : '#888888' }}>
            {character.arcType}
          </div>
        </div>
      </Html>

      {/* Floating detail panel when selected */}
      {isSelected && (
        <Html position={[0, 2, 0]} center>
          <div className="bg-black/90 text-white p-3 rounded-lg shadow-xl border border-gray-600 min-w-[200px]">
            <h3 className="font-bold text-lg mb-2" style={{ color: character.color }}>
              {character.name}
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Arc Type:</strong> {character.arcType}
            </p>
            <div className="text-xs text-gray-400">
              <p>• Click and drag to orbit around</p>
              <p>• Scroll to zoom in/out</p>
              <p>• Click another character to switch</p>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

interface Simple3DSceneProps {
  selectedCharacter: string | null
  onCharacterSelect: (characterId: string | null) => void
}

export function Simple3DScene({ selectedCharacter, onCharacterSelect }: Simple3DSceneProps) {

  const characters: Character[] = [
    {
      id: 'francisco',
      name: 'Francisco Petrarch', 
      position: [0, 0, 0],
      color: '#8B5CF6',
      arcType: "Hero's Journey"
    },
    {
      id: 'la-signora',
      name: 'La Signora del Gioco',
      position: [4, 0, 0], 
      color: '#EC4899',
      arcType: 'Transformation'
    },
    {
      id: 'dagon',
      name: 'Dagon',
      position: [-4, 0, 0],
      color: '#DC2626', 
      arcType: "Antagonist's Journey"
    }
  ]

  console.log('Simple3DScene rendering with characters:', characters.length)

  const handleCharacterSelect = (characterId: string) => {
    onCharacterSelect(characterId === selectedCharacter ? null : characterId)
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 75 }}
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a8a 100%)' }}
      >
        {/* Basic lighting */}
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.0} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
        
        {/* Characters */}
        {characters.map((character) => (
          <CharacterSphere
            key={character.id}
            character={character}
            isSelected={selectedCharacter === character.id}
            onSelect={handleCharacterSelect}
          />
        ))}
        
        {/* Grid for reference */}
        <gridHelper args={[10, 10]} position={[0, -2, 0]} />
        
        {/* Test cube to ensure rendering works */}
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#00ff00" />
        </mesh>
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          target={[0, 0, 0]}
        />
      </Canvas>
      
      {/* Character info overlay */}
      {selectedCharacter && (
        <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg text-gray-900 dark:text-white p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 min-w-[300px]">
          <div className="flex items-center mb-4">
            <div 
              className="w-4 h-4 rounded-full mr-3" 
              style={{ backgroundColor: characters.find(c => c.id === selectedCharacter)?.color }}
            />
            <h3 className="font-bold text-lg">
              {characters.find(c => c.id === selectedCharacter)?.name}
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Arc Type</p>
              <p className="text-lg font-semibold" style={{ color: characters.find(c => c.id === selectedCharacter)?.color }}>
                {characters.find(c => c.id === selectedCharacter)?.arcType}
              </p>
            </div>
            
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Story Cards</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Story cards will appear here when implemented</p>
            </div>
            
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <strong>💡 Controls:</strong><br/>
                • Click & drag to orbit<br/>
                • Scroll to zoom<br/>
                • Click sphere to select
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}