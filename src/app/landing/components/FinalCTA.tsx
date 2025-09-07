"use client";

import React from 'react';
import Link from 'next/link';

const gradText = "bg-gradient-to-r from-indigo-300 via-indigo-400 to-blue-300 bg-clip-text text-transparent";
const gradCTA = "bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400";

export function FinalCTA() {
  return (
    <section id="start" className="relative py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl" />
      </div>
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-black">
          Your story has already begun. <span className={gradText}>Take the first step.</span>
        </h2>
        <p className="mt-4 text-slate-300/90">
          Start your Player Type & Role Assessment now. Instant results and a clear path through
          the Human Framework—mapped to your unique strengths.
        </p>
        <Link className={`${gradCTA} inline-block mt-8 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg`} href="/assessment">🔮 Begin Assessment</Link>
      </div>
    </section>
  );
}