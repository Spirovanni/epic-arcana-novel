"use client";

import React from 'react';
import Image from 'next/image';

export function CardStack() {
  return (
    <div className="relative h-80">
      {["#5b6ef5", "#7c3aed", "#22c55e"].map((c, i) => (
        <div
          key={i}
          className="absolute inset-0 m-auto h-72 w-52 rounded-3xl border border-white/20 shadow-2xl"
          style={{
            background: `linear-gradient(180deg, ${c} 0%, #0b1220 120%)`,
            transform: `rotate(${(-4 + i * 4)}deg) translate(${i * 16 - 16}px, ${i * -6}px)`,
          }}
        >
          <div className="h-full w-full rounded-3xl p-5 flex flex-col justify-between">
            <Image
              src="/images/Epic_Arcana_Logo.png"
              alt="Epic Arcana"
              width={40}
              height={13}
              className="opacity-80"
            />
            <div className="text-xs text-slate-200/90">Hero Energy Card</div>
          </div>
        </div>
      ))}
    </div>
  );
}