'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroCTA() {
  const { isSignedIn, isLoaded } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isLoaded) {
    return (
      <div className="text-center">
        <div className="inline-flex h-12 w-48 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-8">
      {/* Main Headline */}
      <div className="space-y-4">
        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
          Epic Arcana
        </h1>
        <div className="text-2xl md:text-3xl text-gray-300 font-medium">
          Discover Your True Self Through the{' '}
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-bold">
            Human Framework
          </span>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Journey through the mystical realm of Laurasia and unlock one of 360 unique personality archetypes. 
        Experience the future of personality assessment through immersive storytelling.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {isSignedIn ? (
          <Link href="/assessment">
            <Button 
              variant="mystical" 
              size="lg" 
              className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
            >
              Take the Assessment
            </Button>
          </Link>
        ) : (
          <SignInButton mode="modal" forceRedirectUrl="/assessment">
            <Button 
              variant="mystical" 
              size="lg" 
              className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
            >
              Take the Assessment
            </Button>
          </SignInButton>
        )}
        
        <Button 
          variant="outline" 
          size="lg" 
          className="text-lg px-8 py-4 border-purple-500/50 hover:bg-purple-500/10 text-gray-300"
          onClick={() => {
            const element = document.getElementById('how-it-works')
            element?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          How It Works
        </Button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-purple-500/20">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">360</div>
          <div className="text-gray-400">Unique Archetypes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">54</div>
          <div className="text-gray-400">Story Questions</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2">∞</div>
          <div className="text-gray-400">Growth Potential</div>
        </div>
      </div>
    </div>
  )
}