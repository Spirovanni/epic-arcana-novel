"use client";

import React from 'react';

export function Community() {
  return (
    <section id="community" className="relative py-20 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold">Join a fellowship of heroes</h2>
        <p className="mt-3 max-w-2xl text-slate-300/90">
          Connect with players who share your type and role. Exchange insights, form
          parties for challenges, and celebrate milestones—purposeful connection over swipes.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                <div>
                  <div className="text-sm font-semibold">Player {i + 1}</div>
                  <div className="text-xs text-slate-400">Reformer • Sunglow</div>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-300/90">
                "I realized I wasn't just reading the story—I was living it."
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}