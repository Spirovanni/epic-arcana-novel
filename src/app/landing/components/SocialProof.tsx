"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function SocialProof() {
  return (
    <section className="relative py-20 border-t border-border/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-foreground">What players are saying</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "When I found my Player Profile, I realized I wasn&apos;t just reading a story—I was living it.",
            "The color cycle keeps me consistent—tiny quests, big momentum.",
            "I met a mentor with my same role. We level up together each week.",
          ].map((t, i) => (
            <Card key={i} className="border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
              <CardContent className="p-6">
                <blockquote>
                  <p className="text-sm text-muted-foreground">&quot;{t}&quot;</p>
                  <footer className="mt-3 text-xs text-muted-foreground/70">Beta Player</footer>
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}