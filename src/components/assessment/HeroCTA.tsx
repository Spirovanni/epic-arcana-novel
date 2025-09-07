'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export function HeroCTA() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  
  const handleTakeAssessment = () => {
    if (isSignedIn) {
      router.push('/assessment')
    } else {
      // Show sign-in modal or redirect to assessment (which will handle auth)
      router.push('/assessment')
    }
  }
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Button 
        size="lg" 
        variant="mystical"
        onClick={handleTakeAssessment}
        className="text-lg px-8 py-4 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
      >
        ✨ Take the Assessment
      </Button>
      
      <Button 
        size="lg" 
        variant="outline"
        onClick={() => {
          document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="text-lg px-8 py-4 border-purple-500/50 hover:bg-purple-500/10"
      >
        How it Works
      </Button>
    </div>
  )
}