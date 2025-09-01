"use client";

import React from 'react';
import { CardStack } from './CardStack';

const gradText = "bg-gradient-to-r from-indigo-300 via-indigo-400 to-blue-300 bg-clip-text text-transparent";

export function WorldLaurasia() {
  return (
    <section id="world" className="relative py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2 items-center">
        <div className="order-2 lg:order-1">
          <h2 className="text-3xl font-extrabold">A fantasy world where <span className={gradText}>you</span> are the hero</h2>
          <p className="mt-4 text-slate-300/90">
            The saga of <em>Laurasia</em> mirrors your personal development. As characters navigate
            paradox, honor, and destiny—you'll practice the same virtues and choices in real life.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate-300/90 list-disc list-inside">
            <li>Tarot-style Trionfi roles map to your Player Profile</li>
            <li>Chapter prompts fuel reflection and habit formation</li>
            <li>Seasonal arcs align with the 360-day color cycle</li>
          </ul>
        </div>
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-md">
            <CardStack />
          </div>
        </div>
      </div>
    </section>
  );
}