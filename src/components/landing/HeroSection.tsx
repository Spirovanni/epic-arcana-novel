'use client'

import { SignInButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function HeroSection() {
  const { isSignedIn } = useUser()

  return (
    <section className="relative px-6 py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-blue-900/20"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="relative container mx-auto text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Epic Arcana
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-medium">
              Discover your Player Type. Unlock your Role. Begin your Hero's Journey.
            </p>
          </div>

          {/* Subheading */}
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-400 leading-relaxed">
              Step into The Human Framework: a living world where your personality becomes destiny. 
              Take the Player Type & Role Assessment and get your Player Profile—then travel through 
              Laurasia while leveling up real-life skills.
            </p>
          </div>

          {/* Call to Action */}
          <div className="pt-8">
            {isSignedIn ? (
              <Link href="/assessment">
                <Button 
                  variant="mystical" 
                  size="lg" 
                  className="text-xl px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
                >
                  🔮 Take the Assessment
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal" forceRedirectUrl="/assessment">
                <Button 
                  variant="mystical" 
                  size="lg" 
                  className="text-xl px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
                >
                  🔮 Take the Assessment
                </Button>
              </SignInButton>
            )}
            <p className="text-sm text-gray-500 mt-4">
              No spam. 5–7 minutes. Instant results.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}