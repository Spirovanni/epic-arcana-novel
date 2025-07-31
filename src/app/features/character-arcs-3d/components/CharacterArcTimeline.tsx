'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface Character3DNode {
  id: string
  name: string
  position: [number, number, number]
  color: string
  arcType: string
  storyCards?: any[]
}

interface CharacterArcTimelineProps {
  characters: Character3DNode[]
}

export function CharacterArcTimeline({ characters }: CharacterArcTimelineProps) {
  const timelineRef = useRef<THREE.Group>(null)

  // Timeline chapters (40 chapters total)
  const chapters = Array.from({ length: 40 }, (_, i) => i + 1)
  const timelineLength = 30 // Total length of timeline in 3D space
  const chapterSpacing = timelineLength / chapters.length

  useFrame((state) => {
    if (timelineRef.current) {
      // Gentle floating animation for the timeline
      timelineRef.current.position.y = -8 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={timelineRef} position={[0, -8, 0]}>
      {/* Main timeline axis */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, timelineLength]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Chapter markers */}
      {chapters.map((chapter) => {
        const position = (chapter - 20.5) * chapterSpacing // Center around 0
        
        // Determine if this chapter has significant events for any character
        const hasSignificantEvent = characters.some(character => 
          character.storyCards?.some(card => 
            card.chapterRefs.some((ref: string) => ref.includes(`Chapter ${chapter}`))
          )
        )

        return (
          <group key={chapter} position={[position, 0, 0]}>
            {/* Chapter marker */}
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={hasSignificantEvent ? [0.15] : [0.08]} />
              <meshStandardMaterial 
                color={hasSignificantEvent ? '#8B5CF6' : '#999999'}
                emissive={hasSignificantEvent ? '#8B5CF6' : '#000000'}
                emissiveIntensity={hasSignificantEvent ? 0.3 : 0}
              />
            </mesh>

            {/* Chapter number */}
            <Text
              position={[0, -0.8, 0]}
              fontSize={0.3}
              color={hasSignificantEvent ? '#8B5CF6' : '#666666'}
              anchorX="center"
              anchorY="middle"
            >
              {chapter}
            </Text>

            {/* Vertical lines for major story beats */}
            {hasSignificantEvent && (
              <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 3]} />
                <meshStandardMaterial color="#8B5CF6" transparent opacity={0.4} />
              </mesh>
            )}

            {/* Character event indicators */}
            {characters.map((character, charIndex) => {
              const hasEvent = character.storyCards?.some(card => 
                card.chapterRefs.some((ref: string) => ref.includes(`Chapter ${chapter}`))
              )

              if (!hasEvent) return null

              return (
                <mesh 
                  key={`${character.id}-${chapter}`}
                  position={[0, 1 + (charIndex * 0.5), charIndex * 0.3]}
                >
                  <boxGeometry args={[0.2, 0.1, 0.1]} />
                  <meshStandardMaterial 
                    color={character.color}
                    emissive={character.color}
                    emissiveIntensity={0.2}
                  />
                </mesh>
              )
            })}
          </group>
        )
      })}

      {/* Timeline labels */}
      <Text
        position={[-timelineLength/2 - 2, 2, 0]}
        fontSize={0.5}
        color="#8B5CF6"
        anchorX="center"
        anchorY="middle"
      >
        Beginning
      </Text>

      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#8B5CF6"
        anchorX="center"
        anchorY="middle"
      >
        Midpoint
      </Text>

      <Text
        position={[timelineLength/2 + 2, 2, 0]}
        fontSize={0.5}
        color="#8B5CF6"
        anchorX="center"
        anchorY="middle"
      >
        Resolution
      </Text>

      {/* Arc structure indicators */}
      <group position={[0, 3, 0]}>
        {/* Act I */}
        <mesh position={[-timelineLength/3, 0, 0]}>
          <boxGeometry args={[timelineLength/3, 0.2, 1]} />
          <meshStandardMaterial color="#10B981" transparent opacity={0.3} />
        </mesh>
        <Text
          position={[-timelineLength/3, 0.5, 0]}
          fontSize={0.4}
          color="#10B981"
          anchorX="center"
          anchorY="middle"
        >
          Act I - Setup
        </Text>

        {/* Act II */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[timelineLength/3, 0.2, 1]} />
          <meshStandardMaterial color="#F59E0B" transparent opacity={0.3} />
        </mesh>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.4}
          color="#F59E0B"
          anchorX="center"
          anchorY="middle"
        >
          Act II - Confrontation
        </Text>

        {/* Act III */}
        <mesh position={[timelineLength/3, 0, 0]}>
          <boxGeometry args={[timelineLength/3, 0.2, 1]} />
          <meshStandardMaterial color="#EF4444" transparent opacity={0.3} />
        </mesh>
        <Text
          position={[timelineLength/3, 0.5, 0]}
          fontSize={0.4}
          color="#EF4444"
          anchorX="center"
          anchorY="middle"
        >
          Act III - Resolution
        </Text>
      </group>

      {/* Character arc progression lines */}
      {characters.map((character, index) => {
        const yOffset = 4 + (index * 0.8)
        const points = chapters.map((chapter) => {
          const x = (chapter - 20.5) * chapterSpacing
          const hasEvent = character.storyCards?.some(card => 
            card.chapterRefs.some((ref: string) => ref.includes(`Chapter ${chapter}`))
          )
          const y = yOffset + (hasEvent ? 0.3 : 0)
          return new THREE.Vector3(x, y, 0)
        })

        const curve = new THREE.CatmullRomCurve3(points)
        const curvePoints = curve.getPoints(100)
        const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints)

        return (
          <line key={`arc-${character.id}`} geometry={geometry}>
            <lineBasicMaterial
              color={character.color}
              transparent
              opacity={0.6}
              linewidth={2}
            />
          </line>
        )
      })}
    </group>
  )
}