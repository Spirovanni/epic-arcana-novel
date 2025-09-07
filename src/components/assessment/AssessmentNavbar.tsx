'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'

export function AssessmentNavbar() {
  const { isSignedIn } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-slate-900/95 border-b border-purple-500/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Left - Back button and Logo */}
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
          >
            <svg className="h-4 w-4 group-hover:translate-x-[-2px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </Link>
          
          <div className="w-px h-6 bg-slate-600" />
          
          <Link href="/" className="flex items-center">
            <Image
              src="/images/Epic_Arcana_Logo.png"
              alt="Epic Arcana"
              width={130}
              height={43}
              className="hover:opacity-90 transition-opacity"
            />
          </Link>
        </div>

        {/* Center - Assessment Title */}
        <div className="hidden md:flex items-center">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Player Type & Role Assessment
          </h1>
        </div>

        {/* Right - Auth */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-slate-300 hover:text-white transition-colors font-medium"
              >
                Dashboard
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full border border-slate-600 hover:border-slate-400 transition-colors"
                  }
                }}
              />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="text-sm text-slate-300 hover:text-white transition-colors font-medium">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}