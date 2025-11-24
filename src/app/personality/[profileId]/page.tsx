'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AssessmentButton } from '@/components/ui/AssessmentButton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar'
import { ArrowLeft, BookOpen, Star, Heart, Zap, Target } from 'lucide-react'

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
  enneagram_link: Record<string, any> | null
  book_association: Record<string, any> | null
  scoring_model: Record<string, any> | null
  specific_task_group_books_influenced_by: Record<string, any> | null
}

interface ChapterImage {
  id: string
  uniqueIdentifier: string
  title: string
  iconPath: string | null
  colorName: string | null
  hexCode: string | null
  red: number | null
  green: number | null
  blue: number | null
}

export default function PersonalityPage({ params }: { params: Promise<{ profileId: string }> }) {
  const [personality, setPersonality] = useState<PersonalityProfile | null>(null)
  const [chapterImage, setChapterImage] = useState<ChapterImage | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const loadPersonality = async () => {
      try {
        const { profileId } = await params

        if (!profileId) {
          console.error('No profile ID provided')
          setLoading(false)
          return
        }

        // Fetch from database via API
        const response = await fetch(`/api/personalities?profileId=${profileId}`)
        if (response.ok) {
          const profile = await response.json()
          if (profile && profile.canonical_id) {
            setPersonality(profile)

            // Fetch chapter image if unique_identifier exists
            if (profile.unique_identifier) {
              try {
                const chapterResponse = await fetch(
                  `/api/chapters/by-identifier?uniqueIdentifier=${encodeURIComponent(profile.unique_identifier)}`
                )
                if (chapterResponse.ok) {
                  const chapterData = await chapterResponse.json()
                  setChapterImage(chapterData)
                }
              } catch (error) {
                console.warn('Failed to load chapter image:', error)
                // Continue without chapter image - not a critical error
              }
            }
          } else {
            console.error('Profile missing essential data:', profile)
          }
        } else {
          console.error('Failed to load personality:', response.status)
        }
      } catch (error) {
        console.error('Error loading personality:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPersonality()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading personality profile...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!personality) {
    notFound()
  }

  const getDimensionColor = (value: number) => {
    if (value >= 7) return 'text-green-400'
    if (value >= 4) return 'text-yellow-400'
    return 'text-red-400'
  }

  const topDimensions = Object.entries(personality.scoring_model?.dimensions || {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 6)

  const colorHex = personality.color_alignment?.rgb_hex || '#6B7280'
  const colorName = personality.color_alignment?.name || personality.color_alignment?.color_name || 'Color Alignment'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <DashboardNavbar />

      {/* Navigation */}
      <div className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/personalities"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Personalities
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl p-6 space-y-8">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 backdrop-blur-md border-purple-500/30 text-white overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-600/10 to-transparent"></div>

              <div className="relative p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Chapter Image or Fallback Circle */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      {chapterImage && chapterImage.iconPath ? (
                        // Display chapter image
                        <div className="w-32 h-32 rounded-lg border-4 border-white/20 shadow-2xl overflow-hidden bg-slate-700/50 flex items-center justify-center">
                          <img
                            src={chapterImage.iconPath}
                            alt={chapterImage.title || personality.display_name || 'Chapter Image'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        // Fallback to color circle with canonical ID
                        <>
                          <div
                            className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl"
                            style={{ backgroundColor: colorHex }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/80">
                            {personality.canonical_id}
                          </div>
                        </>
                      )}
                    </div>
                    <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50">
                      {chapterImage ? chapterImage.title : colorName}
                    </Badge>
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-2">
                        {personality.display_name || 'Unknown Personality'}
                      </h1>
                      <p className="text-xl text-purple-200">
                        {personality.canonical_id} • {personality.unique_identifier}
                      </p>
                      <p className="text-lg text-gray-300 mt-2">
                        {personality.family || 'Family not specified'}
                      </p>
                    </div>

                    {personality.theme && (
                      <p className="text-lg text-gray-300 italic leading-relaxed max-w-2xl">
                        "{personality.theme}"
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                      <Badge variant="outline" className="border-blue-500/50 text-blue-300">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {personality.unique_identifier}
                      </Badge>
                      {personality.enneagram_link?.family_number && (
                        <Badge variant="outline" className="border-green-500/50 text-green-300">
                          <Star className="h-3 w-3 mr-1" />
                          Enneagram Type {personality.enneagram_link.family_number}
                        </Badge>
                      )}
                    </div>

                    <div className="pt-4">
                      <AssessmentButton variant="mystical" className="w-full">
                        Take Assessment to Find Your Type
                      </AssessmentButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-purple-500/30">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-300 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Canonical ID</h4>
                    <p className="text-gray-300 text-sm font-mono">{personality.canonical_id}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Unique Identifier</h4>
                    <p className="text-gray-300 text-sm font-mono">{personality.unique_identifier}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Family</h4>
                    <p className="text-gray-300 text-sm">{personality.family || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Display Name</h4>
                    <p className="text-gray-300 text-sm">{personality.display_name || 'Not specified'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-300 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Theme & Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {personality.theme && (
                    <div>
                      <h4 className="font-semibold text-gray-200 mb-2">Central Theme</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{personality.theme}</p>
                    </div>
                  )}

                  {personality.enneagram_link && Object.keys(personality.enneagram_link).length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-200 mb-2">Enneagram Connection</h4>
                      <div className="text-gray-400 text-sm space-y-1">
                        {personality.enneagram_link.family_number && (
                          <p>Type: {personality.enneagram_link.family_number}</p>
                        )}
                        {personality.enneagram_link.note && (
                          <p className="italic">{personality.enneagram_link.note}</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            {/* Traits Section */}
            {personality.traits && ((personality.traits.strengths?.length ?? 0) + (personality.traits.shadow?.length ?? 0) + (personality.traits.growth_focus?.length ?? 0)) > 0 && (
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-300 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Personality Traits & Development
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Strengths */}
                  {personality.traits.strengths && personality.traits.strengths.length > 0 && (
                    <div className="p-4 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                      <h4 className="font-semibold text-emerald-400 mb-3 uppercase tracking-wider text-sm">
                        ✨ Strengths
                      </h4>
                      <ul className="space-y-2">
                        {personality.traits.strengths.map((strength, idx) => (
                          <li key={idx} className="text-gray-300 text-sm leading-relaxed flex gap-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Shadow Side */}
                  {personality.traits.shadow && personality.traits.shadow.length > 0 && (
                    <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-500/30">
                      <h4 className="font-semibold text-amber-400 mb-3 uppercase tracking-wider text-sm">
                        🌙 Shadow Side
                      </h4>
                      <ul className="space-y-2">
                        {personality.traits.shadow.map((shadow, idx) => (
                          <li key={idx} className="text-gray-300 text-sm leading-relaxed flex gap-2">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{shadow}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Growth Focus */}
                  {personality.traits.growth_focus && personality.traits.growth_focus.length > 0 && (
                    <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                      <h4 className="font-semibold text-blue-400 mb-3 uppercase tracking-wider text-sm">
                        🚀 Growth Focus
                      </h4>
                      <ul className="space-y-2">
                        {personality.traits.growth_focus.map((growth, idx) => (
                          <li key={idx} className="text-gray-300 text-sm leading-relaxed flex gap-2">
                            <span className="text-blue-400 font-bold">•</span>
                            <span>{growth}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  📖 Book Association & Influences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {personality.book_association && Object.keys(personality.book_association).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(personality.book_association).map(([key, value]: [string, any]) => (
                      <div key={key} className="p-4 bg-slate-700/50 rounded-lg border border-purple-500/20">
                        <h4 className="font-semibold text-purple-300 mb-2 capitalize">
                          {key.replace(/_/g, ' ')}
                        </h4>
                        {typeof value === 'object' ? (
                          <div className="text-gray-400 text-sm space-y-1">
                            {Object.entries(value).map(([k, v]: [string, any]) => (
                              <p key={k}>
                                <span className="text-gray-300 capitalize">{k.replace(/_/g, ' ')}:</span> {v}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">{value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No book association data available</p>
                )}
              </CardContent>
            </Card>

            {personality.specific_task_group_books_influenced_by &&
              Object.keys(personality.specific_task_group_books_influenced_by).length > 0 && (
                <Card className="bg-slate-800/50 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-blue-300 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Influenced Books & Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {Object.entries(personality.specific_task_group_books_influenced_by).map(
                        ([key, value]: [string, any]) => (
                          <div
                            key={key}
                            className="p-3 bg-slate-700/50 rounded border border-blue-500/20"
                          >
                            <p className="text-blue-300 font-semibold">{key}</p>
                            {typeof value === 'object' && value !== null ? (
                              <div className="text-gray-400 text-sm mt-1 space-y-1">
                                {Object.entries(value).map(([k, v]: [string, any]) => (
                                  <p key={k}>
                                    <span className="text-gray-300 capitalize">{k.replace(/_/g, ' ')}:</span> {String(v)}
                                  </p>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm mt-1">{String(value)}</p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </TabsContent>

          {/* Dimensions Tab */}
          <TabsContent value="dimensions" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  📊 Personality Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topDimensions.length > 0 ? (
                  <div className="grid gap-4">
                    {topDimensions.map(([dimension, score]: [string, any]) => (
                      <div key={dimension} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-200 capitalize">
                            {dimension.replace(/_/g, ' ')}
                          </span>
                          <span className={`font-semibold ${getDimensionColor(score)}`}>
                            {score?.toFixed(2)}/10
                          </span>
                        </div>
                        <Progress value={(score as number) * 10} className="h-3" />
                        <div className="text-xs text-gray-500">
                          {score >= 7
                            ? 'Strong presence in this personality'
                            : score >= 4
                              ? 'Moderate influence on behavior'
                              : 'Area for potential development'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No dimension data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
