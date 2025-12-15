"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { AssessmentResults } from '@/components/AssessmentResults';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface AssessmentResult {
  id: string;
  primaryPlayerType: string;
  secondaryPlayerType: string | null;
  bigFiveScores: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  enneagramType: number;
  heroJourneyStage: string;
  colorCyclePosition: number;
  trionfiCard: string;
  personalityProfile: any;
  completedAt: string;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchAssessmentResults();
    }
  }, [isLoaded, user]);

  const fetchAssessmentResults = async () => {
    try {
      const response = await fetch('/api/assessment/results');

      if (!response.ok) {
        if (response.status === 404) {
          setError('No assessment results found. Please complete the assessment first.');
        } else {
          throw new Error('Failed to fetch assessment results');
        }
        return;
      }

      const data = await response.json();
      setAssessmentResult(data.result);
    } catch (error) {
      console.error('Error fetching assessment results:', error);
      setError('Failed to load assessment results');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Authentication Required</CardTitle>
              <CardDescription className="text-center">
                Please sign in to view your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                You need to be authenticated to access your assessment results.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">No Assessment Results</CardTitle>
              <CardDescription className="text-center">
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400">
                <Link href="/assessment">
                  Take Assessment
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!assessmentResult) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">No Assessment Results Found</CardTitle>
              <CardDescription className="text-center">
                Please complete the assessment to view your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400">
                <Link href="/assessment">
                  Take Assessment
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome, {user.firstName}!
          </h1>
          <p className="text-muted-foreground text-lg">Your Epic Arcana Player Profile</p>
        </div>

        {/* Profile Overview Card */}
        <Card className="mb-8 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              Profile Overview
            </CardTitle>
            <CardDescription>
              Your assessment results and player type information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">Primary Type</Badge>
                <p className="font-semibold text-foreground">{assessmentResult.primaryPlayerType}</p>
              </div>
              {assessmentResult.secondaryPlayerType && (
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">Secondary Type</Badge>
                  <p className="font-semibold text-foreground">{assessmentResult.secondaryPlayerType}</p>
                </div>
              )}
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">Enneagram</Badge>
                <p className="font-semibold text-foreground">Type {assessmentResult.enneagramType}</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">Journey Stage</Badge>
                <p className="font-semibold text-foreground">{assessmentResult.heroJourneyStage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Results */}
        <AssessmentResults results={assessmentResult.personalityProfile} />

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 mb-4">
          <Button
            className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all duration-300 flex items-center gap-2"
            onClick={() => {
              // Create a downloadable text file
              const element = document.createElement("a");
              const report = `EPIC ARCANA PERSONALITY EVALUATION
              
Primary Type: ${assessmentResult.primaryPlayerType}
Secondary Type: ${assessmentResult.secondaryPlayerType || 'None'}
Journey Stage: ${assessmentResult.heroJourneyStage}
Enneagram Type: ${assessmentResult.enneagramType}
Completed: ${new Date(assessmentResult.completedAt).toLocaleDateString()}

---
Detailed Analysis
(Full report content would be generated here based on your unique profile data.)
`;
              const file = new Blob([report], { type: 'text/plain' });
              element.href = URL.createObjectURL(file);
              element.download = "EpicArcana_Evaluation.txt";
              document.body.appendChild(element); // Required for this to work in FireFox
              element.click();
              document.body.removeChild(element);
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download In-Depth Evaluation
          </Button>
        </div>

        {/* Additional Profile Info */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <Badge variant="outline" className="mb-2">Assessment Completed</Badge>
              <p className="text-muted-foreground text-sm">
                {new Date(assessmentResult.completedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
