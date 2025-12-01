'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, X, ArrowUp } from 'lucide-react'

const placeholderImg = '/icons/fallback/default-chapter.svg'

type Character = {
  id?: string;
  slug: string;
  name: string;
  aka?: string | null;
  pronouns?: string | null;
  relation?: string | null;
  role?: string | null;
  description?: string | null;
  lastSeenChapter?: number | null;
  personality?: string | null;
  background?: string | null;
  physicalDescription?: string | null;
  dialogueStyle?: string | null;
  groups?: string[] | null;
  birthYear?: string | null;
  died?: string | null;
  birthPlace?: string | null;
  deathPlace?: string | null;
  imageUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

function CharacterCard({ character, isHighlighted = false }: { character: Character; isHighlighted?: boolean }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const initials = character.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Link href={`/characters/${character.slug}`} className="group block h-full">
      <Card
        className={`h-full transition-all duration-300 cursor-pointer overflow-hidden flex flex-col border hover:border-primary/50 ${
          isHighlighted
            ? 'shadow-xl hover:shadow-2xl border-primary/50 ring-1 ring-primary/20'
            : 'shadow-md hover:shadow-xl hover:-translate-y-1'
        }`}
      >
        {/* Image Section - Prominent Display */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-slate-800/50 to-slate-900/50 dark:from-slate-700/50 dark:to-slate-800/50 overflow-hidden group">
          {character.imageUrl && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 dark:from-slate-700/50 dark:to-slate-800/50 animate-pulse" />
              )}
              <img
                src={character.imageUrl}
                alt={character.name}
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true)
                  setImageLoading(false)
                }}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-purple-600/30 dark:from-primary/20 dark:to-purple-600/20">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary/60 dark:text-primary/40 mb-2">
                  {initials}
                </div>
                <p className="text-xs text-muted-foreground">{character.name}</p>
              </div>
            </div>
          )}

          {/* Chapter Badge - Top Right */}
          {character.lastSeenChapter && (
            <Badge className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 text-amber-950 dark:text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center shadow-lg">
              Ch{character.lastSeenChapter}
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <CardHeader className="pb-2 pt-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {character.name}
            </CardTitle>
            {character.aka && (
              <p className="text-xs text-muted-foreground italic line-clamp-1">
                aka. {character.aka}
              </p>
            )}
            {character.role && (
              <p className="text-sm font-semibold text-primary/80 dark:text-primary/70">
                {character.role}
              </p>
            )}
            {character.pronouns && (
              <p className="text-xs text-muted-foreground">
                {character.pronouns}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col py-2 space-y-3">
          {/* Description Section */}
          {character.description && (
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {character.description}
            </p>
          )}

          {/* Groups/Affiliations Section */}
          {character.groups && character.groups.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {character.groups.slice(0, 3).map((group, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {group}
                </Badge>
              ))}
              {character.groups.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{character.groups.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Info Row */}
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1 border-t border-border/50 dark:border-border/30">
            {character.birthYear && <span>b. {character.birthYear}</span>}
            {character.died && <span>d. {character.died}</span>}
            {character.birthPlace && <span>{character.birthPlace}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string | null>(null)
  const [availableRoles, setAvailableRoles] = useState<string[]>([])
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    fetch('/api/characters')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          setCharacters([])
        } else if (Array.isArray(data)) {
          // Sort characters: those with profile pictures first (by oldest upload date), then those without
          const sortedCharacters = data.sort((a, b) => {
            const aHasImage = Boolean(a.imageUrl)
            const bHasImage = Boolean(b.imageUrl)

            if (aHasImage && !bHasImage) return -1
            if (!aHasImage && bHasImage) return 1

            const aDate = new Date(a.updatedAt || a.createdAt || '0')
            const bDate = new Date(b.updatedAt || b.createdAt || '0')

            return aDate.getTime() - bDate.getTime()
          })

          setCharacters(sortedCharacters)
          setFilteredCharacters(sortedCharacters)

          // Extract unique roles for filter
          const roles = Array.from(
            new Set(sortedCharacters.map((c) => c.role).filter(Boolean))
          ).sort() as string[]
          setAvailableRoles(roles)
          setError(null)
        } else {
          setCharacters([])
          setError('Invalid response format')
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch characters:', err)
        setError('Failed to fetch characters')
        setCharacters([])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 240)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Filter characters based on search and role filter
  useEffect(() => {
    let filtered = characters

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((char) => {
        return (
          char.name.toLowerCase().includes(term) ||
          char.aka?.toLowerCase().includes(term) ||
          char.role?.toLowerCase().includes(term) ||
          char.description?.toLowerCase().includes(term) ||
          char.groups?.some((g) => g.toLowerCase().includes(term))
        )
      })
    }

    // Apply role filter
    if (filterRole) {
      filtered = filtered.filter((char) => char.role === filterRole)
    }

    setFilteredCharacters(filtered)
  }, [searchTerm, filterRole, characters])

  return (
    <>
      <Navbar />
      <Breadcrumbs
        items={[
          { label: 'Characters', current: true }
        ]}
        variant="dark"
        sticky={false}
      />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/5 border-b border-border/50 dark:border-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 dark:bg-primary/10 rounded-xl">
                  <Users className="w-8 h-8 text-primary dark:text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    Novel Characters
                  </h1>
                  <p className="text-lg text-muted-foreground mt-2">
                    Discover the rich cast of characters that bring the Epic Arcana universe to life
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Bar */}
          {!loading && characters.length > 0 && (
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search characters by name, role, group..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-2 h-10"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Role Filter */}
                {availableRoles.length > 0 && (
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">Filter:</span>
                    <Button
                      variant={filterRole === null ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterRole(null)}
                      className="h-10"
                    >
                      All
                    </Button>
                    {availableRoles.map((role) => (
                      <Button
                        key={role}
                        variant={filterRole === role ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterRole(role)}
                        className="h-10 whitespace-nowrap"
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Results Counter */}
              {searchTerm || filterRole ? (
                <p className="text-sm text-muted-foreground">
                  Found <span className="font-semibold text-foreground">{filteredCharacters.length}</span> character{filteredCharacters.length !== 1 ? 's' : ''}
                  {searchTerm && ` matching "${searchTerm}"`}
                  {filterRole && ` with role "${filterRole}"`}
                </p>
              ) : null}
            </div>
          )}

          {/* Content States */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="w-full aspect-square bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16">
              <Card className="w-full max-w-md border-destructive/50 bg-destructive/5 dark:bg-destructive/10">
                <CardHeader>
                  <CardTitle className="text-destructive dark:text-destructive">Failed to Load Characters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="default"
                    className="w-full"
                  >
                    Retry Loading
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : filteredCharacters.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="p-4 bg-muted rounded-lg inline-block">
                  <Users className="w-12 h-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {searchTerm || filterRole ? 'No Characters Found' : 'No Characters Yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterRole
                      ? 'Try adjusting your search or filter criteria'
                      : 'No characters have been created yet'}
                  </p>
                  {(searchTerm || filterRole) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm('')
                        setFilterRole(null)
                      }}
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {filteredCharacters.map((character) => (
                <CharacterCard
                  key={character.id || character.name}
                  character={character}
                  isHighlighted={character.imageUrl !== null && character.imageUrl !== undefined}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      {showScrollTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  )
}
