"use client";

import React from 'react';

const gradText = "bg-gradient-to-r from-indigo-300 via-indigo-400 to-blue-300 bg-clip-text text-transparent";

export function Hook() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold">Not just a personality test—<span className={gradText}>an epic journey into who you are</span>.</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Unlock Player Profile",
              desc: "Get your Hero Energy card with strengths, blind spots, and quest hooks.",
            },
            {
              title: "Daily Chapter Path",
              desc: "Your color aligns to a 360-day cycle—each day unlocks a focused theme.",
            },
            {
              title: "Live the Saga",
              desc: "Walk the Laurasia storyline while building real-world habits and skills.",
            },
            {
              title: "Grow Together",
              desc: "Join a fellowship of players—learn, mentor, and celebrate wins.",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-semibold text-slate-100">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-300/90">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}