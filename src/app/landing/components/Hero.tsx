"use client";

import React from 'react';
import Link from 'next/link';
import { AssessmentMockup } from './AssessmentMockup';

const gradText = "bg-gradient-to-r from-indigo-300 via-indigo-400 to-blue-300 bg-clip-text text-transparent";
const gradCTA = "bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient arcane rings */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full bg-indigo-600/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[44rem] w-[44rem] rounded-full border border-indigo-500/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
              Discover your <span className={gradText}>Player Type</span>.
              <br />
              Unlock your <span className={gradText}>Role</span>.
              <br />
              Begin your <span className="text-emerald-300">Hero&apos;s Journey</span>.
            </h1>
            <p className="mt-5 max-w-xl text-slate-300/90">
              Step into <em>The Human Framework</em>: a living world where your personality
              becomes destiny. Take the Player Type & Role Assessment and get your
              Player Profile—then travel through <em>Laurasia</em> while leveling up real-life skills.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="#start" className={`${gradCTA} px-6 py-3 rounded-2xl font-semibold`}>🔮 Take the Assessment</Link>
              <a href="#how" className="px-6 py-3 rounded-2xl font-semibold bg-white/5 hover:bg-white/10 transition">How it works</a>
            </div>
            <p className="mt-4 text-xs text-slate-400">No spam. 5–7 minutes. Instant results.</p>
          </div>

          <div className="relative">
            <AssessmentMockup />
          </div>
        </div>
      </div>
    </section>
  );
}