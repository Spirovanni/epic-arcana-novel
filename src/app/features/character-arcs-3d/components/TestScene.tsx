'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'

function TestCube() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#ff0000" />
    </mesh>
  )
}

export function TestScene() {
  console.log('TestScene rendering')
  
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: '#000033' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <TestCube />
      </Canvas>
    </div>
  )
}