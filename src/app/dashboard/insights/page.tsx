'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function InsightsPage() {
  return (
    <DashboardLayout title="Deep Insights" subtitle="Advanced personality analysis and patterns">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-purple-300 text-2xl mb-4">
              🧠 Deep Insights Coming Soon
            </CardTitle>
            <CardDescription className="text-gray-400">
              We're developing advanced analytics and deeper personality insights based on the Human Framework
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700/30 rounded-lg border border-blue-500/20">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-semibold text-blue-300 mb-2">Behavioral Patterns</h3>
                <p className="text-sm text-gray-400">
                  Identify recurring patterns in your responses and behavior across different contexts
                </p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg border border-green-500/20">
                <div className="text-3xl mb-2">🔬</div>
                <h3 className="font-semibold text-green-300 mb-2">Comparative Analysis</h3>
                <p className="text-sm text-gray-400">
                  See how your profile compares to others with similar Epic Arcana types
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/10" disabled>
                Coming in Future Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}