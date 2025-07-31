'use client'

import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Text, Line } from '@react-three/drei'
// import { useDrag, useDrop } from 'react-dnd' // Commented out for build simplicity
import * as THREE from 'three'
import { motion } from 'framer-motion'

interface StoryCard {
  id: string
  title: string
  stage: string
  description: string
  chapterRefs: string[]
  position: [number, number, number]
  color: string
}

interface StoryCard3DProps {
  card: StoryCard
  parentPosition: [number, number, number]
  index: number
  isCharacterSelected: boolean
  // onDrop: (cardId: string, position: [number, number, number]) => void // Commented for build simplicity
}

// Draggable story card component
export function StoryCard3D({ 
  card, 
  parentPosition, 
  index, 
  isCharacterSelected
  // onDrop  // Commented for build simplicity
}: StoryCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  // const [isDragging, setIsDragging] = useState(false) // Commented for build simplicity
  const [showDetails, setShowDetails] = useState(false)

  // Calculate orbital position around parent character
  const angle = (index * Math.PI * 2) / 4 // Assuming max 4 cards per character
  const radius = 4
  const basePosition: [number, number, number] = [
    parentPosition[0] + Math.cos(angle) * radius,
    parentPosition[1] + Math.sin(angle * 0.5) * 2 + 1,
    parentPosition[2] + Math.sin(angle) * radius * 0.5
  ]

  // Simplified drag state (drag and drop functionality can be enhanced later)
  const isDraggingCard = false

  // Animation
  useFrame((state) => {
    if (meshRef.current) { // Removed isDragging check for build simplicity
      // Gentle floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 3 + index) * 0.1
      meshRef.current.position.lerp(
        new THREE.Vector3(basePosition[0], basePosition[1] + floatY, basePosition[2]),
        0.05
      )

      // Gentle rotation
      meshRef.current.rotation.y += 0.005

      // Scale based on character selection
      const targetScale = isCharacterSelected ? (hovered ? 1.3 : 1.1) : (hovered ? 1.1 : 0.8)
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <group>
      {/* Main card mesh */}
      <mesh
        ref={(node) => {
          meshRef.current = node
        }}
        position={basePosition}
        onClick={() => setShowDetails(!showDetails)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial 
          color={card.color}
          emissive={hovered ? card.color : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
          metalness={0.1}
          roughness={0.8}
          transparent
          opacity={isDraggingCard ? 0.7 : 1}
        />
      </mesh>

      {/* Card title */}
      <Text
        position={[basePosition[0], basePosition[1] + 0.5, basePosition[2] + 0.1]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
      >
        {card.title}
      </Text>

      {/* Card stage */}
      <Text
        position={[basePosition[0], basePosition[1], basePosition[2] + 0.1]}
        fontSize={0.15}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
      >
        {card.stage}
      </Text>

      {/* Chapter references */}
      <Text
        position={[basePosition[0], basePosition[1] - 0.7, basePosition[2] + 0.1]}
        fontSize={0.1}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
      >
        {card.chapterRefs.join(', ')}
      </Text>

      {/* Detailed view when clicked */}
      {showDetails && (
        <Html
          position={[basePosition[0] + 2, basePosition[1], basePosition[2]]}
          center
        >
          <motion.div
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-xs"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {card.title}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDetails(false)
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                  Stage: {card.stage}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {card.description}
              </p>
              
              <div>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Chapters:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {card.chapterRefs.map((ref, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  className="flex-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    // TODO: Open edit dialog
                  }}
                >
                  Edit
                </button>
                <button
                  className="flex-1 px-3 py-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    // TODO: Duplicate card
                  }}
                >
                  Duplicate
                </button>
              </div>
            </div>
          </motion.div>
        </Html>
      )}

      {/* Connection line to parent character */}
      {isCharacterSelected && (
        <Line
          points={[
            new THREE.Vector3(parentPosition[0], parentPosition[1], parentPosition[2]),
            new THREE.Vector3(basePosition[0], basePosition[1], basePosition[2])
          ]}
          color={card.color}
          lineWidth={1}
          transparent
          opacity={0.5}
        />
      )}

      {/* Floating particles for visual effect */}
      {hovered && (
        <>
          {[...Array(5)].map((_, i) => (
            <mesh
              key={i}
              position={[
                basePosition[0] + (Math.random() - 0.5) * 3,
                basePosition[1] + (Math.random() - 0.5) * 3,
                basePosition[2] + (Math.random() - 0.5) * 3
              ]}
            >
              <sphereGeometry args={[0.02]} />
              <meshStandardMaterial 
                color={card.color} 
                emissive={card.color}
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}