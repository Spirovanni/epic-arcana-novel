'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 py-20 bg-slate-800/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How it Works</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Not just a personality test—an epic journey into who you are.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="bg-slate-800/50 border-purple-500/30 text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <CardTitle className="text-purple-300">Step 1: Take the Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Story-driven questions—fun, fast, and insightful (5–7 minutes).
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/30 text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎭</span>
              </div>
              <CardTitle className="text-blue-300">Step 2: Unlock Your Player Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Receive role, color alignment, and your Hero Energy card.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/30 text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <CardTitle className="text-green-300">Step 3: Embark on the Adventure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Daily chapters, quests, and reflections tailored to your growth arc.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-purple-600/10 rounded-lg border border-purple-500/20">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Unlock Player Profile</h3>
            <p className="text-sm text-gray-400">
              Get your Hero Energy card with strengths, blind spots, and quest hooks.
            </p>
          </div>

          <div className="text-center p-6 bg-blue-600/10 rounded-lg border border-blue-500/20">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Daily Chapter Path</h3>
            <p className="text-sm text-gray-400">
              Your color aligns to a 360-day cycle—each day unlocks a focused theme.
            </p>
          </div>

          <div className="text-center p-6 bg-green-600/10 rounded-lg border border-green-500/20">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold text-green-300 mb-2">Live the Saga</h3>
            <p className="text-sm text-gray-400">
              Walk the Laurasia storyline while building real-world habits and skills.
            </p>
          </div>

          <div className="text-center p-6 bg-amber-600/10 rounded-lg border border-amber-500/20">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-amber-300 mb-2">Grow Together</h3>
            <p className="text-sm text-gray-400">
              Join a fellowship of players—learn, mentor, and celebrate wins.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}