"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Your Player Profile</h1>
        <p className="text-muted-foreground">Discover your role in the Epic Arcana universe</p>
      </div>

      {/* Primary Player Type */}
      <Card className="border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
              style={{ backgroundColor: primaryPlayerType.colorTheme.primary }}
            >
              {primaryPlayerType.title.split(' ')[1]?.charAt(0) || 'A'}
            </div>
            <div>
              <CardTitle className="text-2xl">{primaryPlayerType.title}</CardTitle>
              <CardDescription className="text-base">{primaryPlayerType.heroJourneyStage}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Quest Focus</h3>
                <p className="text-muted-foreground">{primaryPlayerType.questFocus}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Shadow Work</h3>
                <p className="text-muted-foreground">{primaryPlayerType.shadowWork}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Trionfi Card</h3>
                <Badge variant="secondary" className="text-base px-4 py-2">{results.trionfiCard}</Badge>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Color Cycle Position</h3>
                <Badge variant="outline" className="text-base px-4 py-2">Day {results.colorCyclePosition} of 360</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Player Type */}
      {secondaryPlayerType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                {secondaryPlayerType.title.split(' ')[1]?.charAt(0) || 'S'}
              </div>
              <div>
                <span>Secondary Influence</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div>
                <h4 className="text-lg font-semibold text-foreground">{secondaryPlayerType.title}</h4>
                <p className="text-muted-foreground">{secondaryPlayerType.heroJourneyStage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Big Five Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Personality Dimensions</CardTitle>
          <CardDescription>Your Big Five personality trait scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.entries(bigFiveScores).map(([trait, score]) => (
              <div key={trait} className="text-center space-y-2">
                <Badge variant="outline" className="capitalize">{trait}</Badge>
                <div className="text-2xl font-bold text-foreground">{Math.round(score)}%</div>
                <Progress value={score} className="h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enneagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Badge variant="secondary" className="text-lg px-3 py-1">Type {enneagram.type}</Badge>
            <span>Enneagram Profile</span>
          </CardTitle>
          <CardDescription>{enneagram.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-primary mb-2">Core Motivation</h4>
                <p className="text-muted-foreground">{enneagram.coreDesire}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-destructive mb-2">Core Fear</h4>
                <p className="text-muted-foreground">{enneagram.coreFear}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">Growth Path</h4>
                <p className="text-muted-foreground">{enneagram.growthPath}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">Stress Path</h4>
                <p className="text-muted-foreground">{enneagram.stressPath}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Challenges */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Strengths
            </CardTitle>
            <CardDescription>Your core strengths and talents</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {primaryPlayerType.strengths.map((strength, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="capitalize text-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-orange-600 dark:text-orange-400 flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              Growth Areas
            </CardTitle>
            <CardDescription>Areas for development and improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {primaryPlayerType.challenges.map((challenge, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <span className="capitalize text-foreground">{challenge}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Daily Prompts */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Reflection Prompts</CardTitle>
          <CardDescription>Personalized prompts to guide your daily reflection and growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {primaryPlayerType.dailyPrompts.map((prompt, index) => (
              <Card key={index} className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-foreground italic">"{prompt}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button className="bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400 px-6 py-3">
          Start Your Journey
        </Button>
        <Button variant="outline" className="px-6 py-3">
          Share Results
        </Button>
      </div>
    </div>
  );
}
