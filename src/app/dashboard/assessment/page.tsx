'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function DashboardAssessmentPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main assessment page
    router.push('/assessment')
  }, [router])

  return (
    <DashboardLayout title="Assessment" subtitle="Redirecting to assessment...">
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecting to assessment...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}