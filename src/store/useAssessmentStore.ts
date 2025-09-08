'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AssessmentAnswers, ForcedChoiceAnswer, LikertAnswer, AssessmentResult } from '@/lib/assessment/types'

export interface AssessmentState {
  // Current step and progress
  currentStep: number
  totalSteps: number
  isComplete: boolean
  
  // Answers
  forcedChoiceAnswers: ForcedChoiceAnswer[]
  likertAnswers: LikertAnswer[]
  
  // Timing
  startTime: string | null
  endTime: string | null
  
  // Results
  result: AssessmentResult | null
  
  // Actions
  setStep: (step: number) => void
  addForcedChoiceAnswer: (answer: ForcedChoiceAnswer) => void
  addLikertAnswer: (answer: LikertAnswer) => void
  updateForcedChoiceAnswer: (itemId: string, answer: Partial<ForcedChoiceAnswer>) => void
  updateLikertAnswer: (itemId: string, rating: number) => void
  startAssessment: () => void
  completeAssessment: () => void
  setResult: (result: AssessmentResult) => void
  resetAssessment: () => void
  
  // Utility
  getAnswersForApi: () => AssessmentAnswers
  getProgress: () => number
  canProceedToStep: (step: number) => boolean
}

const TOTAL_STEPS = 6 // 6 steps as specified

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 0,
      totalSteps: TOTAL_STEPS,
      isComplete: false,
      forcedChoiceAnswers: [],
      likertAnswers: [],
      startTime: null,
      endTime: null,
      result: null,
      
      // Actions
      setStep: (step: number) => {
        // Allow setting step directly - validation is done in the UI
        set({ currentStep: step })
      },
      
      addForcedChoiceAnswer: (answer: ForcedChoiceAnswer) => {
        set(state => ({
          forcedChoiceAnswers: [...state.forcedChoiceAnswers.filter(a => a.itemId !== answer.itemId), answer]
        }))
      },
      
      addLikertAnswer: (answer: LikertAnswer) => {
        set(state => ({
          likertAnswers: [...state.likertAnswers.filter(a => a.itemId !== answer.itemId), answer]
        }))
      },
      
      updateForcedChoiceAnswer: (itemId: string, updates: Partial<ForcedChoiceAnswer>) => {
        set(state => ({
          forcedChoiceAnswers: state.forcedChoiceAnswers.map(answer => 
            answer.itemId === itemId ? { ...answer, ...updates } : answer
          )
        }))
      },
      
      updateLikertAnswer: (itemId: string, rating: number) => {
        set(state => ({
          likertAnswers: state.likertAnswers.map(answer => 
            answer.itemId === itemId ? { ...answer, rating } : answer
          ).concat(
            state.likertAnswers.find(a => a.itemId === itemId) 
              ? [] 
              : [{ itemId, rating }]
          )
        }))
      },
      
      startAssessment: () => {
        set({
          startTime: new Date().toISOString(),
          currentStep: 1,
          isComplete: false,
          result: null
        })
      },
      
      completeAssessment: () => {
        set({
          endTime: new Date().toISOString(),
          isComplete: true
        })
      },
      
      setResult: (result: AssessmentResult) => {
        set({ result })
      },
      
      resetAssessment: () => {
        set({
          currentStep: 0,
          isComplete: false,
          forcedChoiceAnswers: [],
          likertAnswers: [],
          startTime: null,
          endTime: null,
          result: null
        })
      },
      
      getAnswersForApi: (): AssessmentAnswers => {
        const state = get()
        return {
          forced: state.forcedChoiceAnswers,
          likert: state.likertAnswers,
          meta: {
            startTime: state.startTime || new Date().toISOString(),
            endTime: state.endTime || undefined,
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server'
          }
        }
      },
      
      getProgress: (): number => {
        const state = get()
        if (state.isComplete) return 100
        
        // Calculate progress based on completed steps
        const stepProgress = (state.currentStep / state.totalSteps) * 100
        return Math.min(100, Math.max(0, stepProgress))
      },
      
      canProceedToStep: (step: number): boolean => {
        const state = get()
        
        // Can always go backwards or to current step
        if (step <= state.currentStep) return true
        
        // Can't go beyond total steps
        if (step > state.totalSteps) return false
        
        // Can only proceed one step at a time
        return step === state.currentStep + 1
      }
    }),
    {
      name: 'lsa-assessment-storage',
      partialize: (state) => ({
        forcedChoiceAnswers: state.forcedChoiceAnswers,
        likertAnswers: state.likertAnswers,
        startTime: state.startTime,
        currentStep: state.currentStep,
        isComplete: state.isComplete
      })
    }
  )
)