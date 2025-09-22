'use client';

import React from 'react';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Image
            src="/images/Epic_Arcana_Logo.png"
            alt="Epic Arcana"
            width={80}
            height={27}
            className="opacity-70"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <div className="text-xs text-slate-500">© {currentYear} Epic Arcana • Human Framework</div>
      </div>
    </footer>
  );
}
