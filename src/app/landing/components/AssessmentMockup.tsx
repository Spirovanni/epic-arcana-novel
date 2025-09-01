"use client";

import React from 'react';
import Image from 'next/image';

const gradCTA = "bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400";

export function AssessmentMockup() {
  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="flex items-center gap-3">
        <Image
          src="/images/Epic_Arcana_Logo.png"
          alt="Epic Arcana"
          width={60}
          height={20}
          className="opacity-80"
        />
        <span className="text-sm text-slate-300">Player Type & Role Assessment</span>
      </div>
      <div className="mt-6 space-y-4">
        {["I'm energized by solving complex problems.", "I lead with empathy.", "Adventure motivates me.", "I prefer structure and clear goals."].map((q, i) => (
          <label key={i} className="block rounded-xl bg-[#0d172a] p-4 border border-white/10 hover:border-white/20 cursor-pointer">
            <span className="text-sm text-slate-300">{q}</span>
            <div className="mt-3 flex items-center gap-3">
              {["No", "Sometimes", "Often", "Always"].map((opt) => (
                <span key={opt} className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-lg">{opt}</span>
              ))}
            </div>
          </label>
        ))}
      </div>
      <button className={`${gradCTA} mt-6 w-full rounded-xl py-3 font-semibold`}>Calculate Player Profile</button>
      <p className="mt-3 text-center text-xs text-slate-400">Generates color, role, and Hero Energy card</p>
    </div>
  );
}