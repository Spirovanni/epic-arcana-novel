'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function CommunitySection() {
  const testimonials = [
    {
      quote: "When I found my Player Profile, I realized I wasn't just reading a story—I was living it.",
      type: "Reformer",
      color: "Sunglow",
      avatar: "🌅"
    },
    {
      quote: "The color cycle keeps me consistent—tiny quests, big momentum.",
      type: "Helper",
      color: "Coral",
      avatar: "🌺"
    },
    {
      quote: "I met a mentor with my same role. We level up together each week.",
      type: "Achiever",
      color: "Emerald",
      avatar: "💎"
    },
    {
      quote: "The daily chapters give me clarity and purpose I never had before.",
      type: "Individualist",
      color: "Violet",
      avatar: "🔮"
    },
    {
      quote: "Finding my fellowship changed everything—real connections, not just likes.",
      type: "Investigator",
      color: "Sapphire",
      avatar: "🧭"
    },
    {
      quote: "Epic Arcana helped me understand my strengths and embrace my shadows.",
      type: "Loyalist",
      color: "Amber",
      avatar: "⚡"
    }
  ]

  return (
    <section id="community" className="px-6 py-20 bg-slate-800/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Join a Fellowship of Heroes
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect with players who share your type and role. Exchange insights, form parties 
            for challenges, and celebrate milestones—purposeful connection over swipes.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50">
                        {testimonial.type}
                      </Badge>
                      <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50">
                        {testimonial.color}
                      </Badge>
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-300 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="text-xs text-gray-500 mt-3">Beta Player</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-purple-600/10 rounded-lg border border-purple-500/20">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Find Your Type</h3>
            <p className="text-sm text-gray-400">
              Connect with players who share your personality type and challenges.
            </p>
          </div>

          <div className="text-center p-6 bg-blue-600/10 rounded-lg border border-blue-500/20">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Form Parties</h3>
            <p className="text-sm text-gray-400">
              Team up for group challenges and accountability partnerships.
            </p>
          </div>

          <div className="text-center p-6 bg-green-600/10 rounded-lg border border-green-500/20">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-lg font-semibold text-green-300 mb-2">Share Progress</h3>
            <p className="text-sm text-gray-400">
              Celebrate wins, share insights, and support each other's growth.
            </p>
          </div>

          <div className="text-center p-6 bg-amber-600/10 rounded-lg border border-amber-500/20">
            <div className="text-3xl mb-3">🏅</div>
            <h3 className="text-lg font-semibold text-amber-300 mb-2">Mentor & Be Mentored</h3>
            <p className="text-sm text-gray-400">
              Learn from experienced players and guide newcomers on their journey.
            </p>
          </div>
        </div>

        {/* What Players Are Saying */}
        <div className="mt-16 max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-8">What Players Are Saying</h3>
          <div className="space-y-6">
            <blockquote className="text-xl text-gray-300 italic">
              "When I found my Player Profile, I realized I wasn't just reading a story—I was living it."
            </blockquote>
            <div className="text-gray-500">Beta Player</div>
          </div>
        </div>
      </div>
    </section>
  )
}