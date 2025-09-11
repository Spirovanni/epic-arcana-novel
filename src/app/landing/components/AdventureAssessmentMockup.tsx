"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function AdventureAssessmentMockup() {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sample adventure scenario
  const adventureScenario = {
    location: "The Crossroads of Destiny",
    vignette: "Three paths diverge before you, each leading to a different realm of possibility.",
    choices: [
      "Take the golden path of leadership and glory",
      "Follow the silver path of knowledge and wisdom", 
      "Choose the emerald path of harmony and connection"
    ]
  };

  const handleChoiceClick = (index: number) => {
    if (isAnimating) return;
    
    setSelectedChoice(index);
    setIsAnimating(true);
    
    // Simulate the adventure progression
    setTimeout(() => {
      setIsAnimating(false);
      setSelectedChoice(null);
    }, 2000);
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Adventure Card */}
      <div 
        className="relative rounded-2xl p-6 shadow-2xl border border-amber-500/30 overflow-hidden transition-all duration-500"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-amber-300 text-xs font-semibold">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              PLAYER TYPE & ROLE ASSESSMENT
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-amber-300">
              {adventureScenario.location}
            </h3>
            <p className="text-sm text-gray-200 italic leading-relaxed">
              "{adventureScenario.vignette}"
            </p>
          </div>

          {/* Instructions */}
          <div className="text-center text-xs text-amber-200/80 border-t border-amber-500/20 pt-4">
            Choose the path that calls to your soul
          </div>

          {/* Adventure Choices */}
          <div className="space-y-3">
            {adventureScenario.choices.map((choice, index) => (
              <button
                key={index}
                className={cn(
                  "w-full text-left p-4 rounded-xl transition-all duration-300 border-2 text-sm",
                  "hover:scale-[1.02] transform",
                  selectedChoice === index 
                    ? "border-amber-400 bg-amber-400/20 shadow-amber-400/25 shadow-lg"
                    : "border-amber-500/30 bg-amber-500/10 hover:border-amber-400 hover:bg-amber-500/20",
                  isAnimating && selectedChoice === index && "animate-pulse"
                )}
                onClick={() => handleChoiceClick(index)}
                disabled={isAnimating}
              >
                <div className="text-gray-100 leading-relaxed">
                  {choice}
                </div>
              </button>
            ))}
          </div>

          {/* Progress/Result */}
          <div className="text-center pt-4 border-t border-amber-500/20">
            {isAnimating ? (
              <div className="flex items-center justify-center space-x-2 text-amber-300">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-xs ml-2">Revealing your path...</span>
              </div>
            ) : (
              <div className="text-amber-300/60 text-xs">
                Question 1 of 54 • Interactive Storytelling
              </div>
            )}
          </div>
        </div>

        {/* Magical particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 w-1 h-1 rounded-full bg-amber-400/60 animate-pulse"></div>
          <div className="absolute top-8 right-6 w-1 h-1 rounded-full bg-amber-400/40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-6 left-8 w-1 h-1 rounded-full bg-amber-400/50 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-4 right-4 w-1 h-1 rounded-full bg-amber-400/30 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="text-center mt-4">
        <p className="text-xs text-slate-400 font-medium">
          Experience immersive storytelling • Auto-scrolling questions • Instant results
        </p>
      </div>
    </div>
  );
}