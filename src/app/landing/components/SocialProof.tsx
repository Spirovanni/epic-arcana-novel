"use client";

import React from 'react';

export function SocialProof() {
  return (
    <section className="relative py-20 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold">What players are saying</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "When I found my Player Profile, I realized I wasn't just reading a story—I was living it.",
            "The color cycle keeps me consistent—tiny quests, big momentum.",
            "I met a mentor with my same role. We level up together each week.",
          ].map((t, i) => (
            <blockquote key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-slate-300/90">"{t}"</p>
              <footer className="mt-3 text-xs text-slate-500">Beta Player</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}