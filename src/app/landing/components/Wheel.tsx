"use client";

import React from 'react';

const gradText = "bg-gradient-to-r from-indigo-300 via-indigo-400 to-blue-300 bg-clip-text text-transparent";

export function Wheel() {
  return (
    <div className="relative h-64 w-64">
      <div className="absolute inset-0 rounded-full animate-spin"
        style={{
          background:
            "conic-gradient(#7c3aed, #6366f1, #22d3ee, #22c55e, #f59e0b, #ef4444, #7c3aed)",
          mask: "radial-gradient(closest-side, transparent 72%, black 74%)",
          WebkitMask: "radial-gradient(closest-side, transparent 72%, black 74%)",
          animationDuration: "14s"
        }}
      />
      <div className="absolute inset-6 rounded-full border border-white/10 bg-[#0b1220] flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs text-slate-400">Your Alignment</div>
          <div className={`${gradText} text-2xl font-black`}>Sunglow</div>
        </div>
      </div>
    </div>
  );
}