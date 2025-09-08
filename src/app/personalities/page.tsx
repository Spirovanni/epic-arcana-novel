'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar'
import { getChapterIconPath } from '@/lib/icons'
import { familyFromChapter } from '@/lib/canonical'
import { Search, ArrowLeft, Users, BookOpen, ChevronRight, Home } from 'lucide-react'

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
  thematic_essence?: {
    core_theme: string
    focus_area: string
    archetypal_family: string
  }
  position: {
    family_number: number
    wing_bin: number
    development_bin: number
  }
}

interface FamilyInfo {
  number: number
  name: string
  description: string
  color: string
  personalityCount: number
  wingCount: number
  representativePersonality?: PersonalityProfile
}

type ViewMode = 'families' | 'family' | 'wing' | 'search'

export default function PersonalitiesPage() {
  const [personalities, setPersonalities] = useState<PersonalityProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('families')
  const [selectedFamily, setSelectedFamily] = useState<number | null>(null)
  const [selectedWing, setSelectedWing] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<PersonalityProfile[]>([])

  useEffect(() => {
    const loadPersonalities = async () => {
      try {
        const response = await fetch('/api/personalities')
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data)) {
            const validPersonalities = data.filter(p => 
              p && p.id && p.display_name && p.chapter
            )
            setPersonalities(validPersonalities)
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

  // Process personalities into families
  const familyInfo: FamilyInfo[] = [
    { number: 1, name: "Order / Systems", description: "The Perfectionists - Striving for integrity and improvement", color: "#FF9900", personalityCount: 0, wingCount: 8 },
    { number: 2, name: "Care / Support", description: "The Helpers - Caring and interpersonally focused", color: "#FF6B9D", personalityCount: 0, wingCount: 8 },
    { number: 3, name: "Achievement / Success", description: "The Achievers - Success-oriented and driven", color: "#4ECDC4", personalityCount: 0, wingCount: 8 },
    { number: 4, name: "Identity / Authenticity", description: "The Individualists - Creative and emotionally honest", color: "#A8E6CF", personalityCount: 0, wingCount: 8 },
    { number: 5, name: "Knowledge / Wisdom", description: "The Investigators - Intense and cerebral", color: "#B4A7D6", personalityCount: 0, wingCount: 8 },
    { number: 6, name: "Security / Trust", description: "The Loyalists - Committed and responsible", color: "#FFEAA7", personalityCount: 0, wingCount: 8 },
    { number: 7, name: "Adventure / Experience", description: "The Enthusiasts - Spontaneous and versatile", color: "#FD79A8", personalityCount: 0, wingCount: 8 },
    { number: 8, name: "Power / Control", description: "The Challengers - Powerful and dominating", color: "#FDCB6E", personalityCount: 0, wingCount: 8 },
    { number: 9, name: "Harmony / Peace", description: "The Peacemakers - Easygoing and reassuring", color: "#6C5CE7", personalityCount: 0, wingCount: 8 }
  ]

  // Update family info with actual personality counts and representative personalities
  personalities.forEach(p => {
    const familyNum = familyFromChapter(p.chapter)
    const family = familyInfo.find(f => f.number === familyNum)
    if (family) {
      family.personalityCount++
      if (!family.representativePersonality) {
        family.representativePersonality = p
      }
    }
  })

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = personalities.filter(p => 
        p.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.thematic_essence?.core_theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.thematic_essence?.focus_area?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchResults(filtered)
      setViewMode('search')
    } else if (viewMode === 'search') {
      setViewMode('families')
      setSearchResults([])
    }
  }, [searchTerm, personalities, viewMode])

  const getPersonalitiesByFamily = (familyNumber: number) => {
    return personalities.filter(p => familyFromChapter(p.chapter) === familyNumber)
  }

  const getPersonalitiesByWing = (familyNumber: number, wingBin: number) => {
    return personalities.filter(p => 
      familyFromChapter(p.chapter) === familyNumber && 
      p.position?.wing_bin === wingBin
    )
  }

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'All Families', onClick: () => { setViewMode('families'); setSelectedFamily(null); setSelectedWing(null) } }
    ]
    
    if (selectedFamily) {
      const family = familyInfo.find(f => f.number === selectedFamily)
      breadcrumbs.push({
        label: family?.name || `Family ${selectedFamily}`,
        onClick: () => { setViewMode('family'); setSelectedWing(null) }
      })
    }
    
    if (selectedWing !== null) {
      breadcrumbs.push({
        label: `Wing ${selectedWing + 1}`,
        onClick: () => setViewMode('wing')
      })
    }
    
    return breadcrumbs
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading personality families...</p>
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

  const renderPersonalityCard = (personality: PersonalityProfile) => (
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
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <DashboardNavbar />
      
      {/* Header */}
      <div className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Epic Arcana Personalities
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore the 360 unique personality archetypes organized into 9 core families. 
              Each family represents a fundamental approach to life and growth.
            </p>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50">
                <Users className="h-3 w-3 mr-1" />
                360 Unique Profiles
              </Badge>
              <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50">
                <BookOpen className="h-3 w-3 mr-1" />
                9 Core Families
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl p-6">
        {/* Search Bar */}
        <Card className="bg-slate-800/50 border-purple-500/30 mb-8">
          <CardContent className="p-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search personalities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-gray-600 text-white"
              />
            </div>
            {searchTerm && (
              <p className="text-center text-gray-400 mt-2">
                {searchResults.length} personalities found
              </p>
            )}
          </CardContent>
        </Card>

        {/* Breadcrumbs */}
        {(viewMode !== 'families' && viewMode !== 'search') && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm">
              <Home className="h-4 w-4 text-gray-400" />
              {getBreadcrumbs().map((breadcrumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
                  <button
                    onClick={breadcrumb.onClick}
                    className="text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    {breadcrumb.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content based on view mode */}
        {viewMode === 'families' && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                The 9 Personality Families
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Each family represents a core motivational pattern and contains 40 unique personality types 
                across 8 wings and 5 development levels.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyInfo.map((family) => (
                <Card 
                  key={family.number} 
                  className="bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 hover:scale-105 cursor-pointer"
                  onClick={() => {
                    setSelectedFamily(family.number)
                    setViewMode('family')
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      {/* Family Representative Icon */}
                      <div className="relative">
                        <div 
                          className="w-20 h-20 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: family.color }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          {family.representativePersonality ? (
                            <div className="w-10 h-10 relative">
                              <Image
                                src={getChapterIconPath(family.representativePersonality.chapter)}
                                alt={`Family ${family.number} Icon`}
                                fill
                                className="object-contain filter brightness-0 invert"
                              />
                            </div>
                          ) : (
                            <span className="text-white font-bold text-2xl">{family.number}</span>
                          )}
                        </div>
                      </div>

                      {/* Family Info */}
                      <div className="text-center space-y-2">
                        <h3 className="font-bold text-white text-lg">
                          {family.name}
                        </h3>
                        <p className="text-sm text-gray-300">
                          Family {family.number} • {family.personalityCount} Personalities
                        </p>
                        <p className="text-gray-400 text-sm text-center leading-relaxed">
                          {family.description}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-300">
                          {family.wingCount} Wings
                        </Badge>
                        <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                          40 Types
                        </Badge>
                      </div>

                      {/* Explore Button */}
                      <Button variant="mystical" size="sm" className="w-full group">
                        Explore Family
                        <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {viewMode === 'family' && selectedFamily && (
          <>
            {(() => {
              const family = familyInfo.find(f => f.number === selectedFamily)
              const familyPersonalities = getPersonalitiesByFamily(selectedFamily)
              const wings = Array.from({length: 8}, (_, i) => i)
              
              return (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {family?.name}
                    </h2>
                    <p className="text-gray-300 mb-4">
                      {family?.description}
                    </p>
                    <p className="text-gray-400">
                      {familyPersonalities.length} personalities across 8 wings
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {wings.map(wingBin => {
                      const wingPersonalities = getPersonalitiesByWing(selectedFamily, wingBin)
                      const representative = wingPersonalities[0]
                      
                      return (
                        <Card 
                          key={wingBin}
                          className="bg-slate-800/50 border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 hover:scale-105 cursor-pointer"
                          onClick={() => {
                            setSelectedWing(wingBin)
                            setViewMode('wing')
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col items-center space-y-4">
                              {/* Wing Representative */}
                              {representative && (
                                <div className="relative">
                                  <div 
                                    className="w-16 h-16 rounded-full border-2 border-white/20"
                                    style={{ backgroundColor: representative.color_alignment?.rgb_hex || '#6B7280' }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 relative">
                                      <Image
                                        src={getChapterIconPath(representative.chapter)}
                                        alt={`Wing ${wingBin + 1} Icon`}
                                        fill
                                        className="object-contain filter brightness-0 invert"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <div className="text-center">
                                <h3 className="font-bold text-white">
                                  Wing {wingBin + 1}
                                </h3>
                                <p className="text-sm text-blue-300">
                                  {wingPersonalities.length} personalities
                                </p>
                                {representative && (
                                  <p className="text-xs text-gray-400 mt-2">
                                    {representative.theme}
                                  </p>
                                )}
                              </div>

                              <Button variant="outline" size="sm" className="w-full border-blue-500/50 hover:bg-blue-500/10">
                                View Wing
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </>
              )
            })()}
          </>
        )}

        {viewMode === 'wing' && selectedFamily && selectedWing !== null && (
          <>
            {(() => {
              const family = familyInfo.find(f => f.number === selectedFamily)
              const wingPersonalities = getPersonalitiesByWing(selectedFamily, selectedWing)
              
              return (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {family?.name} - Wing {selectedWing + 1}
                    </h2>
                    <p className="text-gray-300">
                      {wingPersonalities.length} personality types in this wing
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wingPersonalities.map(renderPersonalityCard)}
                  </div>
                </>
              )
            })()}
          </>
        )}

        {viewMode === 'search' && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Search Results
              </h2>
              <p className="text-gray-300">
                Found {searchResults.length} personalities matching "{searchTerm}"
              </p>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map(renderPersonalityCard)}
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-yellow-500/30">
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-yellow-300 mb-2">No Personalities Found</h3>
                  <p className="text-gray-400 mb-4">
                    Try adjusting your search terms to find personalities that match your criteria.
                  </p>
                  <Button 
                    onClick={() => setSearchTerm('')}
                    variant="outline"
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
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