'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { AssessmentResult } from '@/lib/assessment/types'
import Link from 'next/link'

interface GrowthAnalysisProps {
  result?: AssessmentResult | null
}

interface GrowthArea {
  name: string
  description: string
  currentLevel: number
  priority: 'high' | 'medium' | 'low'
  developmentStrategies: string[]
  potentialImpact: string
  timeframe: string
}

function getGrowthAreasFromResult(result: AssessmentResult): GrowthArea[] {
  const dimensions = result.dimensions
  const growthAreas: GrowthArea[] = []

  // Identify areas with lower scores as growth opportunities
  const sortedDimensions = Object.entries(dimensions)
    .sort(([,a], [,b]) => a - b)
    .slice(0, 6)

  const growthMappings: Record<string, { name: string, description: string, strategies: string[], impact: string, timeframe: string }> = {
    agency: {
      name: "Self-Direction & Initiative",
      description: "Developing stronger sense of personal agency and proactive behavior",
      strategies: [
        "Set daily micro-goals and track completion",
        "Practice decision-making in low-stakes situations", 
        "Take on leadership roles in small projects",
        "Develop a personal mission statement"
      ],
      impact: "Increased confidence and ability to drive personal and professional outcomes",
      timeframe: "3-6 months"
    },
    risk_tolerance: {
      name: "Comfort with Uncertainty",
      description: "Building resilience and adaptability in uncertain situations",
      strategies: [
        "Gradually expose yourself to new experiences",
        "Practice scenario planning and contingency thinking",
        "Learn from failure stories and case studies",
        "Start small experiments with calculated risks"
      ],
      impact: "Greater ability to navigate change and seize opportunities",
      timeframe: "6-12 months"
    },
    social_dominance: {
      name: "Social Influence & Leadership",
      description: "Developing ability to lead and influence others effectively",
      strategies: [
        "Practice active listening and empathy",
        "Join speaking or leadership groups",
        "Seek mentorship opportunities",
        "Volunteer for team coordination roles"
      ],
      impact: "Enhanced leadership presence and team effectiveness",
      timeframe: "6-18 months"
    },
    patience: {
      name: "Long-term Focus & Persistence",
      description: "Building capacity for sustained effort and delayed gratification",
      strategies: [
        "Practice mindfulness and meditation",
        "Break large goals into smaller milestones",
        "Develop systems for progress tracking",
        "Study examples of long-term success"
      ],
      impact: "Improved ability to achieve significant long-term goals",
      timeframe: "3-12 months"
    },
    order: {
      name: "Organization & Structure",
      description: "Creating better systems and processes for efficiency",
      strategies: [
        "Implement productivity systems (GTD, etc.)",
        "Create standardized workflows",
        "Practice regular planning and review cycles",
        "Study organizational best practices"
      ],
      impact: "Increased productivity and reduced stress from chaos",
      timeframe: "1-6 months"
    },
    extraversion: {
      name: "Social Energy & Networking",
      description: "Building comfort and energy in social situations",
      strategies: [
        "Practice small talk and conversation skills",
        "Attend networking events gradually",
        "Join communities aligned with interests",
        "Work on presenting and public speaking"
      ],
      impact: "Expanded network and improved collaborative relationships",
      timeframe: "6-18 months"
    },
    openness: {
      name: "Curiosity & Innovation",
      description: "Developing greater openness to new ideas and creative thinking",
      strategies: [
        "Expose yourself to diverse perspectives",
        "Practice creative exercises and brainstorming",
        "Learn new skills outside your comfort zone",
        "Question assumptions regularly"
      ],
      impact: "Enhanced creativity and adaptability to change",
      timeframe: "3-12 months"
    },
    conscientiousness: {
      name: "Discipline & Follow-through",
      description: "Improving consistency and attention to detail",
      strategies: [
        "Develop consistent daily routines",
        "Use accountability systems and partners",
        "Practice breaking tasks into smaller steps",
        "Create checklists and quality standards"
      ],
      impact: "Better goal achievement and professional reputation",
      timeframe: "2-8 months"
    }
  }

  sortedDimensions.forEach(([key, score], index) => {
    const mapping = growthMappings[key]
    if (mapping && score < 0.7) {
      let priority: 'high' | 'medium' | 'low' = 'low'
      if (index < 2) priority = 'high'
      else if (index < 4) priority = 'medium'
      
      growthAreas.push({
        name: mapping.name,
        description: mapping.description,
        currentLevel: Math.round(score * 100),
        priority,
        developmentStrategies: mapping.strategies,
        potentialImpact: mapping.impact,
        timeframe: mapping.timeframe
      })
    }
  })

  return growthAreas
}

export function GrowthAnalysis({ result }: GrowthAnalysisProps) {
  if (!result) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-300">Growth Opportunities</CardTitle>
          <CardDescription className="text-gray-400">
            Complete an assessment to see your personalized development areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-gray-400">Discover your growth opportunities with the Epic Arcana assessment</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const growthAreas = getGrowthAreasFromResult(result)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-500/30 bg-red-600/10'
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-600/10'
      case 'low': return 'text-green-400 border-green-500/30 bg-green-600/10'
      default: return 'text-gray-400 border-gray-500/30 bg-gray-600/10'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥'
      case 'medium': return '📈'
      case 'low': return '🎯'
      default: return '•'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            🌱 Growth & Development Areas
          </CardTitle>
          <CardDescription className="text-gray-400">
            Personalized development opportunities based on your assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-red-600/10 rounded-lg border border-red-500/20">
              <div className="text-2xl font-bold text-red-300">{growthAreas.filter(g => g.priority === 'high').length}</div>
              <div className="text-sm text-gray-400">High Priority</div>
            </div>
            <div className="text-center p-4 bg-yellow-600/10 rounded-lg border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-300">{growthAreas.filter(g => g.priority === 'medium').length}</div>
              <div className="text-sm text-gray-400">Medium Priority</div>
            </div>
            <div className="text-center p-4 bg-green-600/10 rounded-lg border border-green-500/20">
              <div className="text-2xl font-bold text-green-300">{growthAreas.filter(g => g.priority === 'low').length}</div>
              <div className="text-sm text-gray-400">Future Focus</div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/dashboard/goals">
              <Button variant="mystical">
                Create Development Plan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Growth Areas */}
      <div className="grid gap-4">
        {growthAreas.map((area, index) => (
          <Card key={index} className={`bg-slate-800/50 border ${getPriorityColor(area.priority).split(' ')[1]}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getPriorityIcon(area.priority)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">{area.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{area.priority} priority • {area.timeframe}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-200">{area.currentLevel}%</div>
                  <Progress value={area.currentLevel} className="w-20 mt-1" />
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{area.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-purple-300 mb-2">Development Strategies:</h4>
                <ul className="space-y-1">
                  {area.developmentStrategies.slice(0, 3).map((strategy, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      {strategy}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-3 bg-slate-700/30 rounded-lg border border-purple-500/20">
                <h4 className="text-sm font-medium text-purple-300 mb-1">Potential Impact:</h4>
                <p className="text-sm text-gray-300">{area.potentialImpact}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}