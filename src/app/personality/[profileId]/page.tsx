'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { getChapterIconPath } from '@/lib/icons'
import { ArrowLeft, BookOpen, Users, Calendar, Star, Heart, Zap, Target } from 'lucide-react'

interface PersonalityProfile {
  id: string
  chapter: number
  display_name: string
  theme: string
  family: string
  summary: string
  traits: {
    strengths: string[]
    shadow: string[]
    growth_focus: string[]
  }
  color_alignment: {
    rgb_hex: string
    color_name: string
  }
  thematic_essence: {
    tagline: string
    core_theme: string
    focus_area: string
    connection_to_major_theme: string
    archetypal_family: string
  }
  character_development: {
    hero_journey_stage: string
    narrative_arc: {
      pages: string
      focus: string
      scene_description: string
    }
    character_arcs: Record<string, string>
  }
  literary_influences: Array<{
    title: string
    author: string
    focus_section: string
    connection: string
    key_insights: string[]
  }>
  book_association: {
    tarot_connection: {
      family: string
      card: string
      link: string
    }
  }
  scoring_model: {
    dimensions: Record<string, number>
  }
}

export default function PersonalityPage({ params }: { params: Promise<{ profileId: string }> }) {
  const [personality, setPersonality] = useState<PersonalityProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const loadPersonality = async () => {
      try {
        // Await the params promise
        const { profileId } = await params
        
        // Load personality profiles and find the specific one
        const response = await fetch('/api/personalities')
        if (response.ok) {
          const profiles = await response.json()
          const profile = profiles.find((p: PersonalityProfile) => p.id === profileId)
          if (profile) {
            setPersonality(profile)
          }
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

  const topDimensions = Object.entries(personality.scoring_model.dimensions)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Navigation */}
      <div className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <Link href="/personalities" className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors">
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
                  {/* Icon and Color */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div 
                        className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl"
                        style={{ backgroundColor: personality.color_alignment.rgb_hex }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 relative">
                          <Image
                            src={getChapterIconPath(personality.chapter)}
                            alt={`Chapter ${personality.chapter} Icon`}
                            fill
                            className="object-contain filter brightness-0 invert"
                          />
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50">
                      {personality.color_alignment.color_name}
                    </Badge>
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-2">
                        {personality.display_name}
                      </h1>
                      <p className="text-xl text-purple-200">
                        {personality.id} • Chapter {personality.chapter}
                      </p>
                      <p className="text-lg text-gray-300">
                        {personality.family} • {personality.thematic_essence.core_theme}
                      </p>
                    </div>
                    
                    <p className="text-lg text-gray-300 italic leading-relaxed max-w-2xl">
                      "{personality.thematic_essence.tagline}"
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant="outline" className="border-blue-500/50 text-blue-300">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {personality.thematic_essence.focus_area}
                      </Badge>
                      <Badge variant="outline" className="border-green-500/50 text-green-300">
                        <Star className="h-3 w-3 mr-1" />
                        {personality.thematic_essence.archetypal_family}
                      </Badge>
                      <Badge variant="outline" className="border-amber-500/50 text-amber-300">
                        <Zap className="h-3 w-3 mr-1" />
                        {personality.character_development.hero_journey_stage}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-purple-500/30">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traits">Traits</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="influences">Influences</TabsTrigger>
            <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-300 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Personality Essence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Core Theme</h4>
                    <p className="text-gray-300 text-sm">
                      {personality.thematic_essence.core_theme} - {personality.thematic_essence.focus_area}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Summary</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {personality.summary}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Deep Connection</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {personality.thematic_essence.connection_to_major_theme.slice(0, 200)}...
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-300 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Archetypal Connections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Tarot Family</h4>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50">
                        {personality.book_association.tarot_connection.family}
                      </Badge>
                      <span className="text-gray-400 text-sm">
                        {personality.book_association.tarot_connection.card}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Hero's Journey Stage</h4>
                    <p className="text-gray-300 text-sm">
                      {personality.character_development.hero_journey_stage}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Story Context</h4>
                    <p className="text-gray-400 text-sm">
                      {personality.character_development.narrative_arc.pages} - {personality.character_development.narrative_arc.focus}
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link href="/assessment">
                      <Button variant="mystical" className="w-full">
                        Take Assessment to Find Your Type
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Traits Tab */}
          <TabsContent value="traits" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-300 flex items-center gap-2">
                    ✨ Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {personality.traits.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-amber-500/30">
                <CardHeader>
                  <CardTitle className="text-amber-300 flex items-center gap-2">
                    ⚠️ Shadow Aspects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {personality.traits.shadow.map((shadow, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        {shadow}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-300 flex items-center gap-2">
                    🎯 Growth Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {personality.traits.growth_focus.map((focus, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        {focus}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Development Tab */}
          <TabsContent value="development" className="space-y-6">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  📚 Character Development Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Narrative Arc</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {personality.character_development.narrative_arc.scene_description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Character Progression</h3>
                  <div className="grid gap-4">
                    {Object.entries(personality.character_development.character_arcs).map(([character, arc]) => (
                      <div key={character} className="p-4 bg-slate-700/50 rounded-lg border border-purple-500/20">
                        <h4 className="font-semibold text-purple-300 mb-2">{character}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{arc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Influences Tab */}
          <TabsContent value="influences" className="space-y-6">
            <div className="grid gap-6">
              {personality.literary_influences.map((influence, index) => (
                <Card key={index} className="bg-slate-800/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-purple-300">
                      "{influence.title}" by {influence.author}
                    </CardTitle>
                    <p className="text-gray-400 text-sm">{influence.focus_section}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-200 mb-2">Connection to Personality</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {influence.connection}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-200 mb-2">Key Insights</h4>
                      <ul className="space-y-1">
                        {influence.key_insights.map((insight, i) => (
                          <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                <div className="grid gap-4">
                  {topDimensions.map(([dimension, score]) => (
                    <div key={dimension} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-200 capitalize">
                          {dimension.replace('_', ' ')}
                        </span>
                        <span className={`font-semibold ${getDimensionColor(score)}`}>
                          {score.toFixed(1)}/10
                        </span>
                      </div>
                      <Progress value={score * 10} className="h-3" />
                      <div className="text-xs text-gray-500">
                        {score >= 7 ? 'Strong presence in this personality' :
                         score >= 4 ? 'Moderate influence on behavior' :
                         'Area for potential development'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}