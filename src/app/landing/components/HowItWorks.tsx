"use client";

import React from 'react';

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Take the assessment",
              desc: "Story-driven questions—fun, fast, and insightful (5–7 minutes).",
            },
            {
              step: "2",
              title: "Unlock your Player Profile",
              desc: "Receive role, color alignment, and your Hero Energy card.",
            },
            {
              step: "3",
              title: "Embark on the adventure",
              desc: "Daily chapters, quests, and reflections tailored to your growth arc.",
            },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm text-slate-400">Step {s.step}</div>
              <h3 className="mt-1 font-semibold text-slate-100">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-300/90">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}