'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser, SignInButton } from '@clerk/nextjs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAssessmentStore } from '@/store/useAssessmentStore'

interface AuthGateProps {
  onSuccess: (resultId: string) => void
}

export function AuthGate({ onSuccess }: AuthGateProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { isSignedIn, isLoaded } = useUser()
  const { result } = useAssessmentStore()
  
  // Save result and redirect
  const handleSaveResult = useCallback(async () => {
    if (!result) return
    
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/assessment/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      })
      
      if (response.status === 409) {
        // User already has an assessment
        const { resultId } = await response.json()
        onSuccess(resultId)
      } else if (!response.ok) {
        throw new Error('Failed to save result')
      } else {
        const { resultId } = await response.json()
        onSuccess(resultId)
      }
      
    } catch (error) {
      console.error('Error saving result:', error)
      // Handle error state
    } finally {
      setIsSaving(false)
    }
  }, [result, onSuccess])
  
  // Effect to handle successful sign-in
  useEffect(() => {
    if (isLoaded && isSignedIn && result && !isSaving) {
      handleSaveResult()
    }
  }, [isLoaded, isSignedIn, result, isSaving, handleSaveResult])
  
  if (!isLoaded) {
    return (
      <Dialog open={isOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  if (isSaving) {
    return (
      <Dialog open={isOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Saving Your Results...</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Processing your Epic Arcana profile...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl bg-slate-800/80 backdrop-blur-md border-purple-500/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            ✨ Assessment Complete!
          </CardTitle>
          <CardDescription className="text-gray-300">
            Your Epic Arcana profile is ready. Sign in to save your results and unlock your full personality report.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Preview of Results */}
          {result && (
            <div className="text-center space-y-4 p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">
              <div className="text-4xl mb-2">{result.ea_id}</div>
              <div 
                className="w-16 h-16 mx-auto rounded-full shadow-lg"
                style={{ backgroundColor: result.color.rgb_hex }}
              ></div>
              <div className="text-lg font-semibold text-gray-200">
                {result.profile.display_name}
              </div>
              <div className="text-sm text-gray-400">
                Chapter {result.chapter} • {result.profile.family}
              </div>
            </div>
          )}
          
          {/* Sign In Options */}
          <div className="space-y-4">
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <Button variant="mystical" size="lg" className="w-full">
                Sign In to Save Results
              </Button>
            </SignInButton>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full border-purple-500/50 hover:bg-purple-500/10"
              onClick={() => {
                // Download results as JSON for guests
                if (result) {
                  const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `epic-arcana-${result.ea_id}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }
              }}
            >
              Download Results (Guest)
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p>
              By signing in, you'll gain access to your personal dashboard,
              detailed insights, and the ability to retake the assessment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}