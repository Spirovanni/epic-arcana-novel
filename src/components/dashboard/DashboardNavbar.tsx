'use client'

import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { AssessmentButton } from '@/components/ui/AssessmentButton'

const gradCTA = "bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400"

export function DashboardNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isSignedIn } = useUser()

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

        {/* Center nav - Dashboard specific */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-semibold">
          <Link href="/dashboard" className="hover:text-white/90 transition-colors tracking-wide">
            Overview
          </Link>
          <Link href="/dashboard/assessment" className="hover:text-white/90 transition-colors tracking-wide">
            Assessment
          </Link>
          <Link href="/personalities" className="hover:text-white/90 transition-colors tracking-wide">
            Personalities
          </Link>
          <Link href="/dashboard/strengths" className="hover:text-white/90 transition-colors tracking-wide">
            Strengths
          </Link>
          <Link href="/dashboard/growth" className="hover:text-white/90 transition-colors tracking-wide">
            Growth
          </Link>
          <Link href="/dashboard/goals" className="hover:text-white/90 transition-colors tracking-wide">
            Goals
          </Link>
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
              <AssessmentButton 
                className={`${gradCTA} text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 tracking-wide transition-all duration-300 hover:scale-105`}
              />
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
              <Link href="/dashboard" className="block text-slate-300 hover:text-white/90 transition-colors">
                Overview
              </Link>
              <Link href="/dashboard/assessment" className="block text-slate-300 hover:text-white/90 transition-colors">
                Assessment
              </Link>
              <Link href="/personalities" className="block text-slate-300 hover:text-white/90 transition-colors">
                Personalities
              </Link>
              <Link href="/dashboard/strengths" className="block text-slate-300 hover:text-white/90 transition-colors">
                Strengths
              </Link>
              <Link href="/dashboard/growth" className="block text-slate-300 hover:text-white/90 transition-colors">
                Growth
              </Link>
              <Link href="/dashboard/goals" className="block text-slate-300 hover:text-white/90 transition-colors">
                Goals
              </Link>
            </nav>
            <div className="pt-2 border-t border-white/5">
              <AssessmentButton 
                className={`${gradCTA} block w-full text-center text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105`}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}