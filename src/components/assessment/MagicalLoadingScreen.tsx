'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// Magical particles component
function MagicalParticles() {
  const ref = useRef<THREE.Points>(null)
  const [sphere] = useState(() => {
    const points = new Float32Array(5000)
    for (let i = 0; i < 5000; i++) {
      const radius = 4 + Math.random() * 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      points[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      points[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      points[i * 3 + 2] = radius * Math.cos(phi)
    }
    return points
  })

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.2
      ref.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#fbbf24"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

// Rotating magical ring
function MagicalRing() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 2
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1)
    }
  })

  return (
    <mesh ref={ref}>
      <torusGeometry args={[3, 0.1, 16, 100]} />
      <meshBasicMaterial color="#a855f7" transparent opacity={0.8} />
    </mesh>
  )
}

// Floating orbs
function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      {[...Array(8)].map((_, i) => (
        <Orb key={i} position={[
          Math.cos((i / 8) * Math.PI * 2) * 5,
          Math.sin(i) * 2,
          Math.sin((i / 8) * Math.PI * 2) * 5
        ]} />
      ))}
    </group>
  )
}

function Orb({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.5
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color="#06d6a0" transparent opacity={0.7} />
    </mesh>
  )
}

interface MagicalLoadingScreenProps {
  onComplete: () => void
}

export function MagicalLoadingScreen({ onComplete }: MagicalLoadingScreenProps) {
  const [loadingText, setLoadingText] = useState('Weaving the threads of destiny...')
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  const loadingMessages = [
    'Weaving the threads of destiny...',
    'Consulting the cosmic tapestry...',
    'Analyzing your adventurous spirit...',
    'Deciphering ancient personality runes...',
    'Channeling the wisdom of the arcana...',
    'Forging your unique player profile...',
    'Awakening your true character essence...',
    'Finalizing your epic journey path...'
  ]

  useEffect(() => {
    const startTime = Date.now()
    const duration = 36000 // 36 seconds minimum duration

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const calculatedProgress = Math.min((elapsed / duration) * 100, 100)

      setProgress(calculatedProgress)

      // Update phase and text based on progress
      const newPhase = Math.floor((calculatedProgress / 100) * loadingMessages.length)
      if (newPhase !== phase && newPhase < loadingMessages.length) {
        setPhase(newPhase)
        setLoadingText(loadingMessages[newPhase])
      }

      if (calculatedProgress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          onComplete()
        }, 2000)
      }
    }, 100) // Update frequency

    return () => clearInterval(interval)
  }, [phase, onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-black z-50 flex items-center justify-center">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-black/50 animate-pulse" />

      {/* Three.js Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <MagicalParticles />
          <MagicalRing />
          <FloatingOrbs />
        </Canvas>
      </div>

      {/* Mystical overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating sparkles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}

        {/* Magical circles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-amber-400/30 rounded-full animate-spin"
          style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-purple-400/30 rounded-full animate-spin"
          style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Main title */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent mb-4 animate-pulse">
            ✨ Epic Analysis ✨
          </h1>
          <div className="text-2xl text-amber-200 font-semibold mb-2">
            The Oracle Awakens
          </div>
        </div>

        {/* Mystical loading animation */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Rotating outer ring */}
            <div className="absolute inset-0 border-4 border-amber-400/30 rounded-full animate-spin"
              style={{ animationDuration: '3s' }} />
            {/* Counter-rotating inner ring */}
            <div className="absolute inset-4 border-4 border-purple-400/50 rounded-full animate-spin"
              style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            {/* Pulsing center */}
            <div className="absolute inset-8 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full animate-pulse" />

            {/* Progress indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-black font-bold text-xl">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="mb-8">
          <p className="text-xl text-gray-200 font-medium animate-pulse">
            {loadingText}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-gray-800/50 rounded-full h-4 overflow-hidden border border-amber-400/30">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 transition-all duration-1000 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
          <div className="text-amber-300 text-sm mt-2 text-center">
            Channeling cosmic energies...
          </div>
        </div>

        {/* Mystical runes */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-6xl text-amber-400/20 animate-spin" style={{ animationDuration: '20s' }}>
            ⚡ ✨ 🔮 ⭐ 🌟 ✨ ⚡ 🔥
          </div>
        </div>

        {progress >= 100 && (
          <div className="mt-8 animate-fade-in">
            <div className="text-2xl text-green-400 font-bold animate-pulse">
              ✅ Destiny Revealed!
            </div>
            <div className="text-lg text-gray-300 mt-2">
              Preparing your personalized dashboard...
            </div>
          </div>
        )}
      </div>

      {/* Magical border effect */}
      <div className="absolute inset-0 border-4 border-gradient-to-r from-amber-400/20 via-purple-400/20 to-amber-400/20 pointer-events-none" />
    </div>
  )
}