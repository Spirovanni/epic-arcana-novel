"use client";

import React from 'react';
import { Wheel } from './Wheel';

export function ColorCycle() {
  return (
    <section id="cycle" className="relative py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl font-extrabold">Your color in the 360‑day cycle</h2>
          <p className="mt-3 text-slate-300/90">
            Your personality score lights up a unique hue in the Human Framework's living wheel.
            Each day reveals a theme—your personal chapter to explore, reflect, and grow.
          </p>
          <ul className="mt-5 text-sm text-slate-300/90 list-disc list-inside">
            <li>Daily prompts and micro-quests</li>
            <li>Streaks and chapter badges</li>
            <li>Sync to calendar & reminders</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <Wheel />
        </div>
      </div>
    </section>
  );
}