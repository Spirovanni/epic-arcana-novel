'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar'
import { Search, ArrowLeft, ChevronRight, Home, Sparkles } from 'lucide-react'

interface PersonalityProfile {
  id: string
  canonical_id: string
  unique_identifier: string
  display_name: string | null
  theme: string | null
  family: string | null
  traits?: {
    strengths?: string[]
    shadow?: string[]
    growth_focus?: string[]
  } | null
  color_alignment: Record<string, any> | null
}

type ViewMode = 'families' | 'family-detail' | 'search'

export default function PersonalitiesPage() {
  const [personalities, setPersonalities] = useState<PersonalityProfile[]>([])
  const [distinctFamilies, setDistinctFamilies] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('families')
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<PersonalityProfile[]>([])

  // Load all personalities with retry logic
  useEffect(() => {
    const loadPersonalities = async (retryCount = 0) => {
      const maxRetries = 3;
      try {
        const response = await fetch('/api/personalities', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data)) {
            setPersonalities(data)
            // Extract distinct families
            const families = Array.from(
              new Set(data.map((p: PersonalityProfile) => p.family).filter(Boolean))
            ).sort() as string[]
            setDistinctFamilies(families)
            setError(null)
          } else {
            throw new Error('Invalid data format received from API')
          }
        } else {
          if (response.status === 500 && retryCount < maxRetries) {
            // Retry on server error
            console.warn(`API returned 500, retrying... (attempt ${retryCount + 1}/${maxRetries})`)
            setTimeout(() => loadPersonalities(retryCount + 1), 1000 * (retryCount + 1))
            return
          }
          throw new Error(`API Error ${response.status}: ${response.statusText}`)
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

  // Handle search
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = personalities.filter(p =>
        p.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.canonical_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.unique_identifier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.family?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchResults(filtered)
      setViewMode('search')
    } else if (viewMode === 'search') {
      setViewMode('families')
      setSearchResults([])
    }
  }, [searchTerm, personalities])

  const getPersonalitiesByFamily = (family: string) => {
    return personalities.filter(p => p.family === family).sort((a, b) => {
      return (a.canonical_id || '').localeCompare(b.canonical_id || '')
    })
  }

  const getSortedPersonalities = () => {
    return [...personalities].sort((a, b) => {
      return (a.canonical_id || '').localeCompare(b.canonical_id || '')
    })
  }

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
        <DashboardNavbar />
        <div className="container mx-auto max-w-7xl pt-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Card className="bg-slate-800/50 border-red-500/30 w-full max-w-md">
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-6xl mb-4">⚠️</div>
                <div>
                  <h3 className="text-xl font-semibold text-red-300 mb-2">Unable to Load Personalities</h3>
                  <p className="text-gray-400 text-sm mb-4 break-words">
                    {error}
                  </p>
                  <p className="text-gray-500 text-xs mb-6">
                    This may be a temporary issue. Please try again.
                  </p>
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={() => window.location.reload()}
                    className="w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/landing'}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Landing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <DashboardNavbar />

      {/* Header */}
      <div className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md sticky top-16 z-40">
        <div className="container mx-auto max-w-7xl px-6 py-4 space-y-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Link href="/" className="hover:text-purple-300 transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-purple-300">Personalities</span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by name, theme, ID, or family..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-purple-500/30 text-white placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl p-6">
        {/* Breadcrumb Navigation */}
        {(viewMode === 'family-detail' || selectedFamily) && (
          <div className="mb-6 flex items-center gap-2 text-sm">
            <button
              onClick={() => {
                setViewMode('families')
                setSelectedFamily(null)
              }}
              className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              All Families
            </button>
            {selectedFamily && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-600" />
                <span className="text-gray-300">{selectedFamily}</span>
              </>
            )}
          </div>
        )}

        {/* Search Results View */}
        {viewMode === 'search' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Search Results ({searchResults.length} found)
              </h2>
              <p className="text-gray-400">
                Showing profiles matching "{searchTerm}"
              </p>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map(personality => {
                  const traits = personality.traits;
                  const hasTraits = traits && (
                    (traits.strengths && traits.strengths.length > 0) ||
                    (traits.shadow && traits.shadow.length > 0) ||
                    (traits.growth_focus && traits.growth_focus.length > 0)
                  );

                  return (
                    <Link
                      key={personality.id}
                      href={`/personality/${personality.canonical_id}`}
                    >
                      <Card className="h-full bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 hover:bg-slate-800/70 transition-all cursor-pointer group flex flex-col">
                        <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                                ID
                              </div>
                              <div
                                className="w-full h-10 rounded flex items-center justify-center border border-white/10 text-sm font-bold text-white/90"
                                style={{
                                  backgroundColor: personality.color_alignment?.rgb_hex || '#6B7280',
                                }}
                              >
                                {personality.canonical_id}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors flex-shrink-0 mt-6" />
                          </div>

                          <div>
                            <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2 text-sm">
                              {personality.display_name || 'Unknown'}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {personality.unique_identifier}
                            </p>
                          </div>

                          {personality.theme && (
                            <p className="text-xs text-gray-400 line-clamp-2">
                              {personality.theme}
                            </p>
                          )}

                          {personality.family && (
                            <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                              {personality.family}
                            </Badge>
                          )}

                          {hasTraits && (
                            <div className="mt-auto pt-3 border-t border-purple-500/20 space-y-2">
                              {traits.strengths && traits.strengths.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Strengths</p>
                                  <p className="text-xs text-gray-300 line-clamp-1">
                                    {traits.strengths[0]}
                                  </p>
                                </div>
                              )}
                              {traits.shadow && traits.shadow.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Shadow</p>
                                  <p className="text-xs text-gray-300 line-clamp-1">
                                    {traits.shadow[0]}
                                  </p>
                                </div>
                              )}
                              {traits.growth_focus && traits.growth_focus.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Growth</p>
                                  <p className="text-xs text-gray-300 line-clamp-1">
                                    {traits.growth_focus[0]}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-8 text-center">
                  <Sparkles className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No personalities match your search.</p>
                  <Button
                    onClick={() => setSearchTerm('')}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* All Personalities View (sorted by canonical_id) */}
        {viewMode === 'families' && !selectedFamily && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">All Personalities</h1>
              <p className="text-gray-400">
                Browse all {personalities.length} personality profiles sorted by canonical ID
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getSortedPersonalities().map(personality => {
                const traits = personality.traits;
                const hasTraits = traits && (
                  (traits.strengths && traits.strengths.length > 0) ||
                  (traits.shadow && traits.shadow.length > 0) ||
                  (traits.growth_focus && traits.growth_focus.length > 0)
                );

                return (
                  <Link
                    key={personality.id}
                    href={`/personality/${personality.canonical_id}`}
                  >
                    <Card className="h-full bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 hover:bg-slate-800/70 transition-all cursor-pointer group flex flex-col">
                      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                              ID
                            </div>
                            <div
                              className="w-full h-10 rounded flex items-center justify-center border border-white/10 text-sm font-bold text-white/90"
                              style={{
                                backgroundColor: personality.color_alignment?.rgb_hex || '#6B7280',
                              }}
                            >
                              {personality.canonical_id}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors flex-shrink-0 mt-6" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2 text-sm">
                            {personality.display_name || 'Unknown'}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {personality.unique_identifier}
                          </p>
                        </div>

                        {personality.theme && (
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {personality.theme}
                          </p>
                        )}

                        {personality.family && (
                          <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                            {personality.family}
                          </Badge>
                        )}

                        {hasTraits && (
                          <div className="mt-auto pt-3 border-t border-purple-500/20 space-y-2">
                            {traits.strengths && traits.strengths.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Strengths</p>
                                <p className="text-xs text-gray-300 line-clamp-1">
                                  {traits.strengths[0]}
                                </p>
                              </div>
                            )}
                            {traits.shadow && traits.shadow.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Shadow</p>
                                <p className="text-xs text-gray-300 line-clamp-1">
                                  {traits.shadow[0]}
                                </p>
                              </div>
                            )}
                            {traits.growth_focus && traits.growth_focus.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Growth</p>
                                <p className="text-xs text-gray-300 line-clamp-1">
                                  {traits.growth_focus[0]}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Family Detail View */}
        {viewMode === 'family-detail' && selectedFamily && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedFamily}</h2>
              <p className="text-gray-400">
                {getPersonalitiesByFamily(selectedFamily).length} personality profiles in this family
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getPersonalitiesByFamily(selectedFamily).map(personality => {
                const traits = personality.traits;
                const hasTraits = traits && (
                  (traits.strengths && traits.strengths.length > 0) ||
                  (traits.shadow && traits.shadow.length > 0) ||
                  (traits.growth_focus && traits.growth_focus.length > 0)
                );

                return (
                  <Link
                    key={personality.id}
                    href={`/personality/${personality.canonical_id}`}
                  >
                    <Card className="h-full bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 hover:bg-slate-800/70 transition-all cursor-pointer group flex flex-col">
                      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                              ID
                            </div>
                            <div
                              className="w-full h-10 rounded flex items-center justify-center border border-white/10 text-sm font-bold text-white/90"
                              style={{
                                backgroundColor: personality.color_alignment?.rgb_hex || '#6B7280',
                              }}
                            >
                              {personality.canonical_id}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors flex-shrink-0 mt-6" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2 text-sm">
                            {personality.display_name || 'Unknown'}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {personality.unique_identifier}
                          </p>
                        </div>

                        {personality.theme && (
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {personality.theme}
                          </p>
                        )}

                        {personality.family && (
                          <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                            {personality.family}
                          </Badge>
                        )}

                        {hasTraits && (
                          <div className="mt-auto pt-3 border-t border-purple-500/20 space-y-2">
                            {traits.strengths && traits.strengths.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Strengths</p>
                                <p className="text-xs text-gray-300 line-clamp-1">
                                  {traits.strengths[0]}
                                </p>
                              </div>
                            )}
                            {traits.shadow && traits.shadow.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Shadow</p>
                                <p className="text-xs text-gray-300 line-clamp-1">
                                  {traits.shadow[0]}
                                </p>
                              </div>
                            )}
                            {traits.growth_focus && traits.growth_focus.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Growth</p>
                                <p className="text-xs text-gray-300 line-clamp-1">
                                  {traits.growth_focus[0]}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
