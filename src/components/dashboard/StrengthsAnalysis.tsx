'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AssessmentResult } from '@/lib/assessment/types'

interface StrengthsAnalysisProps {
  result?: AssessmentResult | null
}

interface Strength {
  name: string
  description: string
  score: number
  category: 'core' | 'developed' | 'emerging'
  applications: string[]
}

function getStrengthsFromResult(result: AssessmentResult): Strength[] {
  const strengths: Strength[] = []
  
  // Analyze dimensions to identify strengths
  const dimensions = result.dimensions
  
  // Core strengths (top 3 dimensions)
  const sortedDimensions = Object.entries(dimensions)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
  
  const strengthMappings: Record<string, { name: string, description: string, applications: string[] }> = {
    agency: {
      name: "Personal Agency",
      description: "Strong sense of self-direction and ability to initiate action",
      applications: ["Leadership roles", "Project management", "Strategic planning", "Entrepreneurship"]
    },
    risk_tolerance: {
      name: "Risk Navigation",
      description: "Balanced approach to uncertainty and calculated decision-making",
      applications: ["Innovation projects", "Change management", "Investment decisions", "Exploration"]
    },
    social_dominance: {
      name: "Social Leadership",
      description: "Natural ability to influence and guide group dynamics",
      applications: ["Team leadership", "Public speaking", "Negotiation", "Community building"]
    },
    patience: {
      name: "Strategic Patience",
      description: "Ability to maintain focus and persistence over long timeframes",
      applications: ["Long-term projects", "Skill development", "Relationship building", "Research"]
    },
    order: {
      name: "Systems Thinking",
      description: "Talent for creating structure and organizing complexity",
      applications: ["Process optimization", "Planning", "Quality control", "Documentation"]
    },
    extraversion: {
      name: "Social Energy",
      description: "Thrives in social environments and energizes others",
      applications: ["Networking", "Team collaboration", "Customer relations", "Events"]
    },
    openness: {
      name: "Creative Exploration",
      description: "Embraces new ideas and approaches with curiosity",
      applications: ["Innovation", "Learning", "Creative projects", "Problem-solving"]
    },
    conscientiousness: {
      name: "Reliable Execution",
      description: "Consistent follow-through and attention to detail",
      applications: ["Project delivery", "Quality assurance", "Goal achievement", "Accountability"]
    }
  }

  sortedDimensions.forEach(([key, score], index) => {
    const mapping = strengthMappings[key]
    if (mapping && score > 0.6) {
      let category: 'core' | 'developed' | 'emerging' = 'emerging'
      if (index < 2) category = 'core'
      else if (index < 4) category = 'developed'
      
      strengths.push({
        name: mapping.name,
        description: mapping.description,
        score: Math.round(score * 100),
        category,
        applications: mapping.applications
      })
    }
  })

  return strengths
}

export function StrengthsAnalysis({ result }: StrengthsAnalysisProps) {
  if (!result) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-300">Your Strengths Profile</CardTitle>
          <CardDescription className="text-gray-400">
            Complete an assessment to see your personalized strengths analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔮</div>
            <p className="text-gray-400">Take the Epic Arcana assessment to discover your unique strengths</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const strengths = getStrengthsFromResult(result)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'text-green-400 border-green-500/30'
      case 'developed': return 'text-blue-400 border-blue-500/30'
      case 'emerging': return 'text-purple-400 border-purple-500/30'
      default: return 'text-gray-400 border-gray-500/30'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return '⭐'
      case 'developed': return '💪'  
      case 'emerging': return '🌱'
      default: return '•'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            ✨ Your Strengths Profile
          </CardTitle>
          <CardDescription className="text-gray-400">
            Based on your Epic Arcana assessment - Chapter {result.chapter}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-600/10 rounded-lg border border-green-500/20">
              <div className="text-2xl font-bold text-green-300">{strengths.filter(s => s.category === 'core').length}</div>
              <div className="text-sm text-gray-400">Core Strengths</div>
            </div>
            <div className="text-center p-4 bg-blue-600/10 rounded-lg border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-300">{strengths.filter(s => s.category === 'developed').length}</div>
              <div className="text-sm text-gray-400">Developed Skills</div>
            </div>
            <div className="text-center p-4 bg-purple-600/10 rounded-lg border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-300">{strengths.filter(s => s.category === 'emerging').length}</div>
              <div className="text-sm text-gray-400">Emerging Talents</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Strengths */}
      <div className="grid gap-4">
        {strengths.map((strength, index) => (
          <Card key={index} className={`bg-slate-800/50 border ${getCategoryColor(strength.category).split(' ')[1]}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(strength.category)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">{strength.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{strength.category} strength</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-200">{strength.score}%</div>
                  <Progress value={strength.score} className="w-20 mt-1" />
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{strength.description}</p>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Applications & Opportunities:</h4>
                <div className="flex flex-wrap gap-2">
                  {strength.applications.map((app, i) => (
                    <span 
                      key={i}
                      className="text-xs px-2 py-1 bg-slate-700/50 text-gray-300 rounded-full"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}