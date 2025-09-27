"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 border-t border-border/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-foreground">How it works</h2>
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
            <Card key={s.step} className="border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-primary border-primary/50">
                    Step {s.step}
                  </Badge>
                </div>
                <CardTitle className="text-foreground">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {s.desc}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}