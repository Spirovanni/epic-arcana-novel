'use client'

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

export function WorldSection() {
  return (
    <section id="world" className="px-6 py-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            A Fantasy World Where You Are the Hero
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The saga of Laurasia mirrors your personal development. As characters navigate 
            paradox, honor, and destiny—you'll practice the same virtues and choices in real life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-slate-800/50 border-purple-500/30 overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
              <div className="text-6xl">🏰</div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">
                Epic Arcana Hero Energy Card
              </h3>
              <p className="text-gray-400 text-sm">
                Tarot-style Trionfi roles map to your Player Profile with unique abilities and growth paths.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/30 overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-600/20 to-green-600/20 flex items-center justify-center">
              <div className="text-6xl">📖</div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-blue-300 mb-3">
                Chapter Prompts & Quests
              </h3>
              <p className="text-gray-400 text-sm">
                Daily reflections and micro-quests fuel habit formation and personal growth.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/30 overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-green-600/20 to-amber-600/20 flex items-center justify-center">
              <div className="text-6xl">🌈</div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-green-300 mb-3">
                Seasonal Color Arcs
              </h3>
              <p className="text-gray-400 text-sm">
                Seasonal arcs align with the 360-day color cycle, guiding your year-long journey.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Laurasia World Features */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 rounded-2xl p-8 border border-purple-500/30">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">The World of Laurasia</h3>
              <p className="text-gray-300">
                An immersive fantasy realm where your personality journey unfolds
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🗺️</div>
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-1">Rich Narrative World</h4>
                    <p className="text-gray-400 text-sm">
                      Explore mystical locations from the Winter Citadels to the Ethereal Gardens
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">⚔️</div>
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-1">Character Development</h4>
                    <p className="text-gray-400 text-sm">
                      Follow heroes who mirror your growth journey and challenges
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🎭</div>
                  <div>
                    <h4 className="font-semibold text-green-300 mb-1">Archetypal Roles</h4>
                    <p className="text-gray-400 text-sm">
                      Embody one of 360 unique character archetypes with distinct abilities
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">✨</div>
                  <div>
                    <h4 className="font-semibold text-amber-300 mb-1">Magical Realism</h4>
                    <p className="text-gray-400 text-sm">
                      Bridge fantasy adventures with real-world personal development
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}