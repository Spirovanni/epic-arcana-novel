'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

interface Character3DNode {
  id: string
  name: string
  position: [number, number, number]
  color: string
  arcType: string
}

interface Relationship {
  source: string
  target: string
  type: 'alliance' | 'conflict' | 'romance' | 'mentorship'
  strength: number
  color: string
}

interface RelationshipLinesProps {
  characters: Character3DNode[]
}

export function RelationshipLines({ characters }: RelationshipLinesProps) {
  const linesRef = useRef<THREE.Group>(null)

  // Define relationships between characters
  const relationships: Relationship[] = [
    {
      source: 'francisco',
      target: 'la-signora',
      type: 'romance',
      strength: 8,
      color: '#EC4899'
    },
    {
      source: 'francisco',
      target: 'dagon',
      type: 'conflict',
      strength: 9,
      color: '#DC2626'
    },
    {
      source: 'la-signora',
      target: 'dagon',
      type: 'conflict',
      strength: 7,
      color: '#F59E0B'
    }
  ]

  useFrame((state) => {
    if (linesRef.current) {
      // Animate the relationship lines
      linesRef.current.children.forEach((line, index) => {
        const relationship = relationships[index]
        if (line instanceof THREE.Line && relationship) {
          // Pulse effect based on relationship strength
          const intensity = (Math.sin(state.clock.elapsedTime * 2) + 1) * 0.5
          const material = line.material as THREE.LineBasicMaterial
          material.opacity = 0.3 + (intensity * relationship.strength * 0.1)
        }
      })
    }
  })

  const getCharacterPosition = (characterId: string): [number, number, number] => {
    const character = characters.find(c => c.id === characterId)
    return character ? character.position : [0, 0, 0]
  }

  return (
    <group ref={linesRef}>
      {relationships.map((relationship, relationshipIndex) => {
        const sourcePos = getCharacterPosition(relationship.source)
        const targetPos = getCharacterPosition(relationship.target)

        // Create curved line between characters
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(...sourcePos),
          new THREE.Vector3(
            (sourcePos[0] + targetPos[0]) / 2,
            Math.max(sourcePos[1], targetPos[1]) + 2, // Arc upward
            (sourcePos[2] + targetPos[2]) / 2
          ),
          new THREE.Vector3(...targetPos)
        )

        const points = curve.getPoints(50)

        return (
          <Line
            key={`${relationship.source}-${relationship.target}-${relationshipIndex}`}
            points={points}
            color={relationship.color}
            lineWidth={relationship.strength / 2}
            transparent
            opacity={0.6}
          />
        )
      })}

      {/* Relationship type indicators */}
      {relationships.map((relationship, relationshipIndex) => {
        const sourcePos = getCharacterPosition(relationship.source)
        const targetPos = getCharacterPosition(relationship.target)
        const midpoint: [number, number, number] = [
          (sourcePos[0] + targetPos[0]) / 2,
          Math.max(sourcePos[1], targetPos[1]) + 2.5,
          (sourcePos[2] + targetPos[2]) / 2
        ]

        // Use relationshipIndex for unique keys

        // Different shapes for different relationship types
        const getRelationshipIcon = (type: string) => {
          switch (type) {
            case 'romance':
              return <sphereGeometry args={[0.2]} />
            case 'conflict':
              return <octahedronGeometry args={[0.3]} />
            case 'alliance':
              return <boxGeometry args={[0.3, 0.3, 0.3]} />
            case 'mentorship':
              return <coneGeometry args={[0.2, 0.4]} />
            default:
              return <sphereGeometry args={[0.1]} />
          }
        }

        return (
          <mesh key={`icon-${relationshipIndex}`} position={midpoint}>
            {getRelationshipIcon(relationship.type)}
            <meshStandardMaterial
              color={relationship.color}
              emissive={relationship.color}
              emissiveIntensity={0.3}
              transparent
              opacity={0.8}
            />
          </mesh>
        )
      })}
    </group>
  )
}