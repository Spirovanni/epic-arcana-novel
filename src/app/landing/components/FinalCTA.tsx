"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const gradText = "bg-gradient-to-r from-primary via-primary/80 to-blue-600 bg-clip-text text-transparent";

export function FinalCTA() {
  return (
    <section id="start" className="relative py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
      </div>
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-foreground">
          Your story has already begun. <span className={gradText}>Take the first step.</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Start your Player Type & Role Assessment now. Instant results and a clear path through
          the Human Framework—mapped to your unique strengths.
        </p>
        <Button asChild size="lg" className="mt-8 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400 text-lg px-8 py-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg">
          <Link href="/assessment">
            🔮 Begin Assessment
          </Link>
        </Button>
      </div>
    </section>
  );
}