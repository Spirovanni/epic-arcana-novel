'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HistoryPage() {
  return (
    <DashboardLayout title="Assessment History" subtitle="Track your personality assessment journey">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-purple-300 text-2xl mb-4">
              📊 Assessment History
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your assessment history and progress tracking will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl mb-4">📈</div>
            
            <div className="space-y-4">
              <p className="text-gray-300">
                As you take assessments over time, you'll be able to see:
              </p>
              <ul className="text-left text-gray-400 space-y-2 max-w-md mx-auto">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Changes in your personality scores
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Progress on your development goals
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Insights about your growth journey
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Comparison of results over time
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <Button variant="mystical">
                Take Another Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}