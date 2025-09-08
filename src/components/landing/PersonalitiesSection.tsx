'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getChapterIconPath } from '@/lib/icons'
import { Users, ArrowRight, BookOpen, Star } from 'lucide-react'

const featuredPersonalities = [
  {
    id: 'EA-001',
    chapter: 1,
    display_name: 'The Wounded Reformer',
    theme: 'Despair',
    focus_area: 'Mental Health',
    color: '#FF9900',
    description: 'A personality that embodies resilience through suffering, transforming pain into wisdom and purpose.'
  },
  {
    id: 'EA-072',
    chapter: 72,
    display_name: 'The Flourishing Helper',
    theme: 'Compassion',
    focus_area: 'Relationships',
    color: '#FF6B9D', 
    description: 'A nurturing soul who finds meaning through supporting others and building meaningful connections.'
  },
  {
    id: 'EA-135',
    chapter: 135,
    display_name: 'The Growing Achiever',
    theme: 'Success',
    focus_area: 'Leadership',
    color: '#4ECDC4',
    description: 'An ambitious visionary who channels drive and determination into meaningful accomplishments.'
  },
  {
    id: 'EA-203',
    chapter: 203,
    display_name: 'The Emerging Individualist',
    theme: 'Authenticity',
    focus_area: 'Creativity',
    color: '#A8E6CF',
    description: 'A unique creative spirit who expresses deep truth through art, beauty, and authentic self-expression.'
  },
  {
    id: 'EA-267',
    chapter: 267,
    display_name: 'The Mastering Investigator',
    theme: 'Knowledge',
    focus_area: 'Wisdom',
    color: '#B4A7D6',
    description: 'A thoughtful analyst who seeks understanding through deep research and contemplative insight.'
  },
  {
    id: 'EA-324',
    chapter: 324,
    display_name: 'The Flowering Loyalist',
    theme: 'Security',
    focus_area: 'Trust',
    color: '#FFEAA7',
    description: 'A faithful guardian who creates stability and safety for themselves and their communities.'
  }
]

export function PersonalitiesSection() {
  return (
    <section className="px-6 py-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            360 Unique Personality Archetypes
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover the vast landscape of human personality through our comprehensive system. 
            Each archetype represents a distinct path of growth, challenge, and transformation 
            within the Epic Arcana universe.
          </p>
          <div className="flex flex-wrap gap-4 justify-center items-center mt-6">
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50 px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              360 Unique Profiles
            </Badge>
            <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50 px-4 py-2">
              <BookOpen className="h-4 w-4 mr-2" />
              9 Personality Families
            </Badge>
            <Badge className="bg-green-600/20 text-green-300 border-green-500/50 px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              Literary & Mythological Depth
            </Badge>
          </div>
        </div>

        {/* Featured Personalities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredPersonalities.map((personality) => (
            <Card key={personality.id} className="bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  {/* Icon with Color */}
                  <div className="relative">
                    <div 
                      className="w-20 h-20 rounded-full border-2 border-white/20 shadow-lg"
                      style={{ backgroundColor: personality.color }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 relative">
                        <Image
                          src={getChapterIconPath(personality.chapter)}
                          alt={`Chapter ${personality.chapter} Icon`}
                          fill
                          className="object-contain filter brightness-0 invert"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center space-y-2">
                    <h3 className="font-bold text-white text-lg leading-tight">
                      {personality.display_name}
                    </h3>
                    <p className="text-sm text-purple-300">
                      {personality.id} • Chapter {personality.chapter}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-300">
                        {personality.focus_area}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                        {personality.theme}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm text-center leading-relaxed">
                    {personality.description}
                  </p>

                  {/* Action Button */}
                  <Link href={`/personality/${personality.id}`} className="w-full">
                    <Button variant="mystical" size="sm" className="w-full">
                      Explore This Personality
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 rounded-2xl p-8 border border-purple-500/30 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Explore All 360 Personality Archetypes
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Dive deeper into the complete collection of Epic Arcana personalities. 
              Discover the rich themes, character developments, and growth paths that 
              make each archetype unique within our comprehensive framework.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/personalities">
                <Button variant="mystical" size="lg" className="group">
                  Browse All Personalities
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/assessment">
                <Button variant="outline" size="lg" className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20">
                  Find Your Personality Type
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}