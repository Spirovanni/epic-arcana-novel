"use client";

import React from 'react';
import Image from 'next/image';

interface AssessmentResultsProps {
  results: {
    primaryPlayerType: {
      id: string;
      title: string;
      heroJourneyStage: string;
      questFocus: string;
      shadowWork: string;
      strengths: string[];
      challenges: string[];
      dailyPrompts: string[];
      enneagram: {
        type: number;
        name: string;
        coreDesire: string;
        coreFear: string;
        growthPath: string;
        stressPath: string;
      };
      colorTheme: {
        primary: string;
        secondary: string;
        accent: string;
      };
    };
    secondaryPlayerType?: {
      id: string;
      title: string;
      heroJourneyStage: string;
    } | null;
    bigFiveScores: {
      openness: number;
      conscientiousness: number;
      extraversion: number;
      agreeableness: number;
      neuroticism: number;
    };
    enneagram: {
      type: number;
      name: string;
      coreDesire: string;
      coreFear: string;
      growthPath: string;
      stressPath: string;
    };
    colorCyclePosition: number;
    trionfiCard: string;
    heroJourneyStage: string;
  };
}

export function AssessmentResults({ results }: AssessmentResultsProps) {
  const { primaryPlayerType, secondaryPlayerType, bigFiveScores, enneagram } = results;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Your Player Profile</h1>
        <p className="text-slate-300">Discover your role in the Epic Arcana universe</p>
      </div>

      {/* Primary Player Type */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: primaryPlayerType.colorTheme.primary }}
          >
            {primaryPlayerType.title.split(' ')[1]?.charAt(0) || 'A'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{primaryPlayerType.title}</h2>
            <p className="text-slate-300">{primaryPlayerType.heroJourneyStage}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Quest Focus</h3>
            <p className="text-slate-300 mb-4">{primaryPlayerType.questFocus}</p>
            
            <h3 className="text-lg font-semibold text-white mb-3">Shadow Work</h3>
            <p className="text-slate-300">{primaryPlayerType.shadowWork}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Trionfi Card</h3>
            <p className="text-slate-300 mb-4">{results.trionfiCard}</p>
            
            <h3 className="text-lg font-semibold text-white mb-3">Color Cycle Position</h3>
            <p className="text-slate-300">Day {results.colorCyclePosition} of 360</p>
          </div>
        </div>
      </div>

      {/* Secondary Player Type */}
      {secondaryPlayerType && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold text-white mb-3">Secondary Influence</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">
              {secondaryPlayerType.title.split(' ')[1]?.charAt(0) || 'S'}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">{secondaryPlayerType.title}</h4>
              <p className="text-slate-300">{secondaryPlayerType.heroJourneyStage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Big Five Scores */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Personality Dimensions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(bigFiveScores).map(([trait, score]) => (
            <div key={trait} className="text-center">
              <div className="text-sm text-slate-400 mb-1 capitalize">{trait}</div>
              <div className="text-2xl font-bold text-white mb-2">{Math.round(score)}%</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enneagram */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Enneagram Type {enneagram.type}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-violet-300 mb-2">{enneagram.name}</h4>
            <p className="text-slate-300 mb-3">{enneagram.coreDesire}</p>
            <p className="text-slate-300">{enneagram.coreFear}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-green-300 mb-2">Growth Path</h4>
            <p className="text-slate-300 mb-3">{enneagram.growthPath}</p>
            <h4 className="text-lg font-semibold text-red-300 mb-2">Stress Path</h4>
            <p className="text-slate-300">{enneagram.stressPath}</p>
          </div>
        </div>
      </div>

      {/* Strengths & Challenges */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold text-green-300 mb-4">Strengths</h3>
          <ul className="space-y-2">
            {primaryPlayerType.strengths.map((strength, index) => (
              <li key={index} className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="capitalize">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold text-orange-300 mb-4">Growth Areas</h3>
          <ul className="space-y-2">
            {primaryPlayerType.challenges.map((challenge, index) => (
              <li key={index} className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="capitalize">{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Daily Prompts */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Daily Reflection Prompts</h3>
        <div className="space-y-3">
          {primaryPlayerType.dailyPrompts.map((prompt, index) => (
            <div key={index} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <p className="text-slate-300 italic">"{prompt}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button className="px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 rounded-xl font-semibold text-white transition-all">
          Start Your Journey
        </button>
        <button className="px-6 py-3 border border-white/20 hover:border-white/40 rounded-xl font-semibold text-white transition-all">
          Share Results
        </button>
      </div>
    </div>
  );
}
