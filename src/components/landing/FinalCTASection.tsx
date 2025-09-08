'use client'

import { SignInButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function FinalCTASection() {
  const { isSignedIn } = useUser()

  return (
    <section className="px-6 py-32 bg-gradient-to-r from-purple-900/20 via-slate-900 to-blue-900/20">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Your Story Has Already Begun
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Take the first step. Start your Player Type & Role Assessment now. 
              Instant results and a clear path through the Human Framework—mapped to your unique strengths.
            </p>
          </div>

          <div className="pt-8">
            {isSignedIn ? (
              <Link href="/assessment">
                <Button 
                  variant="mystical" 
                  size="lg" 
                  className="text-2xl px-16 py-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-2xl"
                >
                  🔮 Begin Assessment
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal" forceRedirectUrl="/assessment">
                <Button 
                  variant="mystical" 
                  size="lg" 
                  className="text-2xl px-16 py-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-2xl"
                >
                  🔮 Begin Assessment
                </Button>
              </SignInButton>
            )}
            <div className="mt-6 space-y-2">
              <p className="text-gray-400">
                Join thousands of players already on their journey
              </p>
              <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
                <span>✓ Free to start</span>
                <span>✓ 5-7 minutes</span>
                <span>✓ Instant results</span>
                <span>✓ 360 unique profiles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}