'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getChapterIconPath } from '@/lib/icons'
import { Search, Filter, BookOpen, Users } from 'lucide-react'

interface PersonalityProfile {
  id: string
  chapter: number
  display_name: string
  theme: string
  family: string
  summary: string
  color_alignment: {
    rgb_hex: string
    color_name: string
  }
  thematic_essence: {
    core_theme: string
    focus_area: string
    archetypal_family: string
  }
  position: {
    family_number: number
  }
}

export default function PersonalitiesPage() {
  const [personalities, setPersonalities] = useState<PersonalityProfile[]>([])
  const [filteredPersonalities, setFilteredPersonalities] = useState<PersonalityProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [familyFilter, setFamilyFilter] = useState('all')
  const [tarotFilter, setTarotFilter] = useState('all')

  useEffect(() => {
    const loadPersonalities = async () => {
      try {
        const response = await fetch('/api/personalities')
        if (response.ok) {
          const data = await response.json()
          // Ensure data is an array and filter out invalid entries
          if (Array.isArray(data)) {
            const validPersonalities = data.filter(p => 
              p && p.id && p.display_name && p.chapter
            )
            setPersonalities(validPersonalities)
            setFilteredPersonalities(validPersonalities)
          } else {
            throw new Error('Invalid data format received')
          }
        } else {
          throw new Error(`Failed to load personalities: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        console.error('Error loading personalities:', error)
        setError(error instanceof Error ? error.message : 'Failed to load personalities')
      } finally {
        setLoading(false)
      }
    }

    loadPersonalities()
  }, [])

  useEffect(() => {
    let filtered = personalities

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.thematic_essence?.core_theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.thematic_essence?.focus_area?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply family filter
    if (familyFilter !== 'all') {
      filtered = filtered.filter(p => p.family === familyFilter)
    }

    // Apply tarot filter
    if (tarotFilter !== 'all') {
      filtered = filtered.filter(p => p.thematic_essence?.archetypal_family === tarotFilter)
    }

    setFilteredPersonalities(filtered)
  }, [personalities, searchTerm, familyFilter, tarotFilter])

  const uniqueFamilies = [...new Set(personalities.map(p => p.family).filter(Boolean))]
  const uniqueTarotFamilies = [...new Set(personalities.map(p => p.thematic_essence?.archetypal_family).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading personality profiles...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Card className="bg-slate-800/50 border-red-500/30">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-red-300 mb-2">Error Loading Personalities</h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Epic Arcana Personalities
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the 360 unique personality archetypes from the Epic Arcana universe. 
              Each one represents a distinct path of growth and self-discovery.
            </p>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50">
                <Users className="h-3 w-3 mr-1" />
                360 Unique Profiles
              </Badge>
              <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50">
                <BookOpen className="h-3 w-3 mr-1" />
                9 Personality Families
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl p-6">
        {/* Filters */}
        <Card className="bg-slate-800/50 border-purple-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Explore & Filter Personalities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search personalities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-gray-600 text-white"
                />
              </div>
              
              <Select value={familyFilter} onValueChange={setFamilyFilter}>
                <SelectTrigger className="bg-slate-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by Family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Families</SelectItem>
                  {uniqueFamilies.map(family => (
                    <SelectItem key={family} value={family}>{family}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={tarotFilter} onValueChange={setTarotFilter}>
                <SelectTrigger className="bg-slate-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by Tarot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tarot Families</SelectItem>
                  {uniqueTarotFamilies.map(tarot => (
                    <SelectItem key={tarot} value={tarot}>{tarot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-400">
                Showing {filteredPersonalities.length} of {personalities.length} personalities
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personalities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPersonalities.map((personality) => (
            <Card key={personality.id} className="bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  {/* Icon with Color */}
                  <div className="relative">
                    <div 
                      className="w-16 h-16 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: personality.color_alignment?.rgb_hex || '#6B7280' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 relative">
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
                    <h3 className="font-bold text-white leading-tight">
                      {personality.display_name}
                    </h3>
                    <p className="text-sm text-purple-300">
                      {personality.id} • Chapter {personality.chapter}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {personality.thematic_essence?.focus_area && (
                        <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-300">
                          {personality.thematic_essence.focus_area}
                        </Badge>
                      )}
                      {personality.thematic_essence?.archetypal_family && (
                        <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                          {personality.thematic_essence.archetypal_family}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-gray-400 text-sm text-center line-clamp-3">
                    {personality.summary ? `${personality.summary.slice(0, 120)}...` : 'No description available.'}
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

        {/* Empty State */}
        {filteredPersonalities.length === 0 && (
          <Card className="bg-slate-800/50 border-yellow-500/30">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-yellow-300 mb-2">No Personalities Found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search terms or filters to find personalities that match your criteria.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('')
                  setFamilyFilter('all')
                  setTarotFilter('all')
                }}
                variant="outline"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Discover Your Epic Arcana Personality
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Take our comprehensive personality assessment to discover which of these 360 archetypes 
              represents your unique path of growth and self-discovery.
            </p>
            <Link href="/assessment">
              <Button variant="mystical" size="lg">
                Take the Epic Arcana Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}