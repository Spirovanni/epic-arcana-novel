"use client";

import React from 'react';
import Link from 'next/link';
import { AssessmentMockup } from './AssessmentMockup';

const gradText = "bg-gradient-to-r from-indigo-300 via-indigo-400 to-blue-300 bg-clip-text text-transparent";
const gradCTA = "bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Cosmic Fantasy Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-cosmic-fantasy.jpg')",
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Subtle animated overlay effects */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-cyan-500/10 blur-xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 h-24 w-24 rounded-full bg-purple-500/10 blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 h-16 w-16 rounded-full bg-pink-500/10 blur-xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28 w-full">
        <div className="grid gap-10 lg:grid-cols-2 items-center min-h-[80vh]">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            {/* Epic Arcana Logo/Brand */}
            <div className="mb-8 flex justify-center lg:justify-start">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👑</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Epic Arcana
                </h2>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Discover your <span className={gradText}>Player Type</span>.
              <br />
              Unlock your <span className={gradText}>Role</span>.
              <br />
              Begin your <span className="text-emerald-300">Hero&apos;s Journey</span>.
            </h1>
            <p className="mt-6 max-w-xl text-slate-200/90 text-lg leading-relaxed mx-auto lg:mx-0">
              Step into <em>The Human Framework</em>: a living world where your personality
              becomes destiny. Take the Player Type & Role Assessment and get your
              Player Profile—then travel through <em>Laurasia</em> while leveling up real-life skills.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                href="/assessment" 
                className={`${gradCTA} px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg`}
              >
                🔮 Take the Assessment
              </Link>
              <a 
                href="#how" 
                className="px-8 py-4 rounded-2xl font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105"
              >
                How it works
              </a>
            </div>
            <p className="mt-6 text-sm text-slate-300/80">No spam. 5–7 minutes. Instant results.</p>
          </div>

          {/* Right side - Assessment Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glowing backdrop for the mockup */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl scale-110" />
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 shadow-2xl">
                <AssessmentMockup />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}