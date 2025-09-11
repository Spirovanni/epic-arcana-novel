"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { AssessmentResults } from '@/components/AssessmentResults';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in to view your profile</h1>
          <p className="text-slate-300">You need to be authenticated to access your assessment results.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-white mb-4">No Assessment Results</h1>
          <p className="text-slate-300 mb-6">{error}</p>
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 rounded-xl font-semibold text-white transition-all"
          >
            Take Assessment
          </a>
        </div>
      </div>
    );
  }

  if (!assessmentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Assessment Results Found</h1>
          <p className="text-slate-300 mb-6">Please complete the assessment to view your profile.</p>
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 rounded-xl font-semibold text-white transition-all"
          >
            Take Assessment
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.firstName}!</h1>
          <p className="text-slate-300">Your Epic Arcana Player Profile</p>
        </div>

        {/* Assessment Results */}
        <AssessmentResults results={assessmentResult.personalityProfile} />

        {/* Additional Profile Info */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Assessment completed on {new Date(assessmentResult.completedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
