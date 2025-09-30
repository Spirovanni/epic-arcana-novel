'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function CycleSection() {
  return (
    <section id="cycle" className="px-6 py-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Color Wheel Visualization */}
          <div className="text-center mb-12">
            <div className="relative w-80 h-80 mx-auto mb-8">
              <div className="w-full h-full rounded-full bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 shadow-2xl"></div>
              <div className="absolute inset-8 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <Badge className="bg-amber-600/20 text-amber-300 border-amber-500/50 mb-2">
                    Your Alignment
                  </Badge>
                  <div className="text-2xl font-bold text-amber-400">Sunglow</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cycle Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-slate-800/50 border-purple-500/30 text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <CardTitle className="text-purple-300">Daily Prompts & Micro-Quests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Receive personalized reflections and small challenges that align with your growth arc.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-500/30 text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔥</span>
                </div>
                <CardTitle className="text-blue-300">Streaks & Chapter Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Build momentum with streak tracking and earn badges for completing chapter themes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-green-500/30 text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📅</span>
                </div>
                <CardTitle className="text-green-300">Sync to Calendar & Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Integrate with your calendar and receive gentle reminders for your daily practice.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Seasonal Journey */}
          <div className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 rounded-2xl p-8 border border-purple-500/30">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Your Seasonal Journey</h3>
              <p className="text-gray-300">
                Each season brings unique themes and challenges aligned with your personal development
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-red-600/10 rounded-lg border border-red-500/20">
                <div className="text-3xl mb-2">🌱</div>
                <h4 className="font-semibold text-red-300 mb-1">Spring</h4>
                <p className="text-gray-400 text-sm">New beginnings & growth</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-600/10 rounded-lg border border-yellow-500/20">
                <div className="text-3xl mb-2">☀️</div>
                <h4 className="font-semibold text-yellow-300 mb-1">Summer</h4>
                <p className="text-gray-400 text-sm">Action & manifestation</p>
              </div>
              
              <div className="text-center p-4 bg-orange-600/10 rounded-lg border border-orange-500/20">
                <div className="text-3xl mb-2">🍂</div>
                <h4 className="font-semibold text-orange-300 mb-1">Autumn</h4>
                <p className="text-gray-400 text-sm">Harvest & integration</p>
              </div>
              
              <div className="text-center p-4 bg-blue-600/10 rounded-lg border border-blue-500/20">
                <div className="text-3xl mb-2">❄️</div>
                <h4 className="font-semibold text-blue-300 mb-1">Winter</h4>
                <p className="text-gray-400 text-sm">Reflection & renewal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}