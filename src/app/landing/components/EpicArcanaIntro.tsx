"use client";

import React from 'react';
import { CardStack } from './CardStack';
import { Card, CardContent } from '@/components/ui/card';

const gradText = "bg-gradient-to-r from-primary via-primary/80 to-blue-600 bg-clip-text text-transparent";

export function EpicArcanaIntro() {
  return (
    <section className="relative py-20 border-t border-border/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight text-foreground">
              <span className={gradText}>Epic Arcana</span>
              <br />
              Not just a personality test—an epic journey into who you are.
            </h2>
            <div className="mt-8 space-y-4">
              {[
                {
                  icon: "🏹",
                  title: "Unlock Player Profile",
                  description: "Get your Hero Energy card with strengths, blind spots, and quest hooks.",
                  gradient: "from-violet-500 to-indigo-500"
                },
                {
                  icon: "🗓️",
                  title: "Daily Chapter Path", 
                  description: "Your color aligns to a 360-day cycle—each day unlocks a focused theme.",
                  gradient: "from-indigo-500 to-blue-500"
                },
                {
                  icon: "⚔️",
                  title: "Live the Saga",
                  description: "Walk the Laurasia storyline while building real-world habits and skills.",
                  gradient: "from-blue-500 to-emerald-500"
                },
                {
                  icon: "🤝",
                  title: "Grow Together",
                  description: "Join a fellowship of players—learn, mentor, and celebrate wins.",
                  gradient: "from-emerald-500 to-green-500"
                }
              ].map((feature, index) => (
                <Card key={index} className="border-border/30 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}>
                        <span className="text-lg">{feature.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                        <p className="mt-1 text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="relative">
            <CardStack />
          </div>
        </div>
      </div>
    </section>
  );
}