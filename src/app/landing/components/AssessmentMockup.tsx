"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

const gradCTA = "bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400";

interface Question {
  questionId: string;
  questionText: string;
  options: Array<{
    index: number;
    text: string;
    scoring: any;
  }>;
  questionIndex: number;
  totalQuestions: number;
  category: string;
}

interface AssessmentState {
  assessmentId: string | null;
  currentQuestion: Question | null;
  isLoading: boolean;
  error: string | null;
  isComplete: boolean;
  results: any | null;
}

export function AssessmentMockup() {
  const { user, isLoaded } = useUser();
  const [state, setState] = useState<AssessmentState>({
    assessmentId: null,
    currentQuestion: null,
    isLoading: false,
    error: null,
    isComplete: false,
    results: null
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Start assessment when component mounts and user is loaded
  useEffect(() => {
    if (isLoaded && user && !state.assessmentId) {
      startAssessment();
    }
  }, [isLoaded, user, state.assessmentId]);

  const startAssessment = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/assessment/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start assessment');
      }

      const data = await response.json();
      setState(prev => ({ 
        ...prev, 
        assessmentId: data.assessmentId,
        isLoading: false 
      }));

      // Load the current question
      await loadQuestion(data.assessmentId, data.currentQuestionIndex);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to start assessment',
        isLoading: false 
      }));
    }
  };

  const loadQuestion = async (assessmentId: string, questionIndex: number) => {
    try {
      const response = await fetch(`/api/assessment/question?assessmentId=${assessmentId}&questionIndex=${questionIndex}`);
      
      if (!response.ok) {
        throw new Error('Failed to load question');
      }

      const question = await response.json();
      setState(prev => ({ 
        ...prev, 
        currentQuestion: question,
        isLoading: false 
      }));
      setSelectedOption(null);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load question',
        isLoading: false 
      }));
    }
  };

  const submitAnswer = async () => {
    if (!state.assessmentId || !state.currentQuestion || selectedOption === null) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/assessment/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId: state.assessmentId,
          questionId: state.currentQuestion.questionId,
          selectedOptionIndex: selectedOption,
          selectedOptionText: state.currentQuestion.options[selectedOption].text
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const data = await response.json();
      
      if (data.isComplete) {
        // Calculate results when assessment is complete
        try {
          const resultsResponse = await fetch('/api/assessment/calculate-results', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              assessmentId: state.assessmentId
            }),
          });

          if (resultsResponse.ok) {
            const resultsData = await resultsResponse.json();
            setState(prev => ({ 
              ...prev, 
              isComplete: true,
              isLoading: false,
              results: resultsData.personalityProfile
            }));
          } else {
            throw new Error('Failed to calculate results');
          }
        } catch (error) {
          console.error('Error calculating results:', error);
          setState(prev => ({ 
            ...prev, 
            isComplete: true,
            isLoading: false,
            error: 'Assessment completed but results calculation failed'
          }));
        }
      } else {
        // Load next question
        await loadQuestion(state.assessmentId, data.nextQuestionIndex);
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to submit answer',
        isLoading: false 
      }));
    }
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  // Show loading state
  if (!isLoaded || state.isLoading) {
    return (
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <Image
            src="/images/Epic_Arcana_Logo.png"
            alt="Epic Arcana"
            width={60}
            height={20}
            className="opacity-80"
          />
          <span className="text-sm text-slate-300 font-semibold tracking-wide">Player Type & Role Assessment</span>
        </div>
        <div className="mt-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
        <p className="mt-3 text-center text-xs text-slate-400 font-medium">Loading assessment...</p>
      </div>
    );
  }

  // Show error state
  if (state.error) {
    return (
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <Image
            src="/images/Epic_Arcana_Logo.png"
            alt="Epic Arcana"
            width={60}
            height={20}
            className="opacity-80"
          />
          <span className="text-sm text-slate-300 font-semibold tracking-wide">Player Type & Role Assessment</span>
        </div>
        <div className="mt-6 text-center">
          <p className="text-red-400 text-sm">{state.error}</p>
          <button 
            onClick={startAssessment}
            className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show completion state
  if (state.isComplete) {
    return (
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <Image
            src="/images/Epic_Arcana_Logo.png"
            alt="Epic Arcana"
            width={60}
            height={20}
            className="opacity-80"
          />
          <span className="text-sm text-slate-300 font-semibold tracking-wide">Player Type & Role Assessment</span>
        </div>
        <div className="mt-6 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Assessment Complete!</h3>
          
          {state.results ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/30">
                <h4 className="text-lg font-bold text-violet-300 mb-2">
                  {state.results.primaryPlayerType.title}
                </h4>
                <p className="text-sm text-slate-300 mb-2">
                  {state.results.primaryPlayerType.heroJourneyStage}
                </p>
                <p className="text-xs text-slate-400">
                  Trionfi Card: {state.results.trionfiCard}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-800/50">
                  <div className="text-slate-400">Openness</div>
                  <div className="text-white font-semibold">{Math.round(state.results.bigFiveScores.openness)}%</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/50">
                  <div className="text-slate-400">Conscientiousness</div>
                  <div className="text-white font-semibold">{Math.round(state.results.bigFiveScores.conscientiousness)}%</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/50">
                  <div className="text-slate-400">Extraversion</div>
                  <div className="text-white font-semibold">{Math.round(state.results.bigFiveScores.extraversion)}%</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/50">
                  <div className="text-slate-400">Agreeableness</div>
                  <div className="text-white font-semibold">{Math.round(state.results.bigFiveScores.agreeableness)}%</div>
                </div>
              </div>
              
              <a 
                href="/profile"
                className={`${gradCTA} w-full rounded-xl py-3 font-bold tracking-wide inline-block text-center`}
              >
                View Full Profile
              </a>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-300 mb-4">Your Player Profile is being calculated...</p>
              <button className={`${gradCTA} w-full rounded-xl py-3 font-bold tracking-wide`}>
                View Your Results
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <Image
            src="/images/Epic_Arcana_Logo.png"
            alt="Epic Arcana"
            width={60}
            height={20}
            className="opacity-80"
          />
          <span className="text-sm text-slate-300 font-semibold tracking-wide">Player Type & Role Assessment</span>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-300 mb-4">Sign in to take the assessment and discover your Player Type!</p>
          <button className={`${gradCTA} w-full rounded-xl py-3 font-bold tracking-wide`}>
            Sign In to Start
          </button>
        </div>
      </div>
    );
  }

  // Show current question
  if (!state.currentQuestion) {
    return (
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <Image
            src="/images/Epic_Arcana_Logo.png"
            alt="Epic Arcana"
            width={60}
            height={20}
            className="opacity-80"
          />
          <span className="text-sm text-slate-300 font-semibold tracking-wide">Player Type & Role Assessment</span>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-300">Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="flex items-center gap-3">
        <Image
          src="/images/Epic_Arcana_Logo.png"
          alt="Epic Arcana"
          width={60}
          height={20}
          className="opacity-80"
        />
        <span className="text-sm text-slate-300 font-semibold tracking-wide">Player Type & Role Assessment</span>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-bold text-white mb-2">The Crossroads of Destiny</h3>
        <p className="text-sm text-slate-300 italic mb-4">"Three paths diverge before you, each leading to a different realm of possibility."</p>
        <p className="text-sm text-slate-300 mb-6">Choose the path that calls to your soul.</p>
        
        <div className="space-y-3">
          {state.currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                selectedOption === index
                  ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                  : 'border-white/10 bg-[#0d172a] hover:border-white/20 text-slate-300'
              }`}
            >
              <span className="text-sm font-medium">{option.text}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Question {state.currentQuestion.questionIndex + 1} of {state.currentQuestion.totalQuestions}
          </span>
          <span className="text-xs text-slate-400">Interactive Storytelling</span>
        </div>
        
        {selectedOption !== null && (
          <button
            onClick={submitAnswer}
            disabled={state.isLoading}
            className={`${gradCTA} mt-4 w-full rounded-xl py-3 font-bold tracking-wide disabled:opacity-50`}
          >
            {state.isLoading ? 'Processing...' : 'Continue Journey'}
          </button>
        )}
      </div>
      
      <p className="mt-4 text-center text-xs text-slate-400 font-medium">
        Experience immersive storytelling • Auto-scrolling questions • Instant results
      </p>
    </div>
  );
}