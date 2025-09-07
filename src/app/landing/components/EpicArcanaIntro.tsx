"use client";

import React from 'react';
import { CardStack } from './CardStack';

const gradText = "bg-gradient-to-r from-indigo-300 via-indigo-400 to-blue-300 bg-clip-text text-transparent";

export function EpicArcanaIntro() {
  return (
    <section className="relative py-20 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              <span className={gradText}>Epic Arcana</span>
              <br />
              Not just a personality test—an epic journey into who you are.
            </h2>
            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-lg">🏹</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Unlock Player Profile</h3>
                  <p className="mt-1 text-slate-300/90 text-sm">Get your Hero Energy card with strengths, blind spots, and quest hooks.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center">
                  <span className="text-lg">🗓️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Daily Chapter Path</h3>
                  <p className="mt-1 text-slate-300/90 text-sm">Your color aligns to a 360-day cycle—each day unlocks a focused theme.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-lg">⚔️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Live the Saga</h3>
                  <p className="mt-1 text-slate-300/90 text-sm">Walk the Laurasia storyline while building real-world habits and skills.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                  <span className="text-lg">🤝</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Grow Together</h3>
                  <p className="mt-1 text-slate-300/90 text-sm">Join a fellowship of players—learn, mentor, and celebrate wins.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <CardStack />
          </div>
        </div>
      </div>
    </section>
  );
}