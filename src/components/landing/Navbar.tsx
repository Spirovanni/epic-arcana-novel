'use client'

import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { AssessmentButton } from '@/components/ui/AssessmentButton'
import { useAssessmentButtonText } from '@/hooks/useAssessmentButtonText'

const gradCTA = "bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isSignedIn } = useUser()
  const { buttonText } = useAssessmentButtonText()

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-[#0b1220]/70 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
        {/* Left brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/Epic_Arcana_Logo.png"
              alt="Epic Arcana"
              width={174}
              height={58}
              className="hover:opacity-90 transition-all duration-300"
            />
          </Link>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-semibold">
          <Link href="#how-it-works" className="hover:text-white/90 transition-colors tracking-wide">How it Works</Link>
          <Link href="#world" className="hover:text-white/90 transition-colors tracking-wide">World</Link>
          <Link href="#community" className="hover:text-white/90 transition-colors tracking-wide">Community</Link>
          <Link href="#cycle" className="hover:text-white/90 transition-colors tracking-wide">Cycle</Link>
          {isSignedIn && <Link href="/dashboard" className="hover:text-white/90 transition-colors tracking-wide">Dashboard</Link>}
        </nav>

        {/* Right auth section */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <AssessmentButton 
                className={`${gradCTA} text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              />
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full border border-white/20 hover:border-white/40 transition-colors"
                  }
                }}
              />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-sm text-slate-300 hover:text-white/90 transition-colors font-semibold tracking-wide">
                  Sign In
                </button>
              </SignInButton>
              <SignInButton mode="modal" forceRedirectUrl="/assessment">
                <button className={`${gradCTA} text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 tracking-wide transition-all duration-300 hover:scale-105`}>
                  {buttonText}
                </button>
              </SignInButton>
            </>
          )}
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white/90 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0b1220]/95 backdrop-blur">
          <div className="px-4 py-4 space-y-4">
            <nav className="space-y-2">
              <Link href="#how-it-works" className="block text-slate-300 hover:text-white/90 transition-colors">How it Works</Link>
              <Link href="#world" className="block text-slate-300 hover:text-white/90 transition-colors">World</Link>
              <Link href="#community" className="block text-slate-300 hover:text-white/90 transition-colors">Community</Link>
              <Link href="#cycle" className="block text-slate-300 hover:text-white/90 transition-colors">Cycle</Link>
              {isSignedIn && <Link href="/dashboard" className="block text-slate-300 hover:text-white/90 transition-colors">Dashboard</Link>}
            </nav>
            <div className="pt-2 border-t border-white/5">
              {isSignedIn ? (
                <AssessmentButton 
                  className={`${gradCTA} block text-center text-sm font-semibold px-4 py-2 rounded-xl`}
                />
              ) : (
                <div className="space-y-2">
                  <SignInButton mode="modal">
                    <button className="block w-full text-slate-300 hover:text-white/90 transition-colors py-2">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignInButton mode="modal" forceRedirectUrl="/assessment">
                    <button className={`${gradCTA} block w-full text-center text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105`}>
                      {buttonText}
                    </button>
                  </SignInButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}