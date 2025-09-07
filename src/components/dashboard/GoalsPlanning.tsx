'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AssessmentResult } from '@/lib/assessment/types'

interface GoalsPlanningProps {
  result?: AssessmentResult | null
}

interface Goal {
  id: string
  title: string
  description: string
  category: 'personal' | 'professional' | 'relationships' | 'growth'
  priority: 'high' | 'medium' | 'low'
  timeframe: '1-month' | '3-months' | '6-months' | '1-year'
  progress: number
  actions: Action[]
  basedOnStrengths: string[]
  addressesGrowthAreas: string[]
}

interface Action {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate?: string
}

function generateGoalsFromResult(result: AssessmentResult): Goal[] {
  const goals: Goal[] = []
  const dimensions = result.dimensions
  
  // Analyze strengths and weaknesses to generate personalized goals
  const sortedDimensions = Object.entries(dimensions).sort(([,a], [,b]) => b - a)
  const strengths = sortedDimensions.slice(0, 3).map(([key]) => key)
  const growthAreas = sortedDimensions.slice(-3).map(([key]) => key)

  // Goal templates based on personality patterns
  const goalTemplates = {
    high_agency: {
      title: "Launch Personal Leadership Initiative",
      description: "Leverage your natural leadership abilities to start a meaningful project or initiative",
      category: 'professional' as const,
      actions: [
        "Identify a problem you're passionate about solving",
        "Create a project proposal or business plan",
        "Recruit 2-3 collaborators or team members",
        "Set measurable milestones for the first 90 days"
      ],
      timeframe: '6-months' as const
    },
    high_social_dominance: {
      title: "Build Strategic Network",
      description: "Expand your professional and personal network using your social influence",
      category: 'relationships' as const,
      actions: [
        "Attend 2 networking events per month",
        "Schedule 1 coffee chat with new connection weekly",
        "Join a professional association or community group",
        "Offer to mentor someone in your field"
      ],
      timeframe: '3-months' as const
    },
    low_risk_tolerance: {
      title: "Gradual Risk-Taking Challenge",
      description: "Build comfort with uncertainty through calculated, small risks",
      category: 'growth' as const,
      actions: [
        "Try one new activity outside comfort zone monthly",
        "Make one small financial investment or bet",
        "Volunteer for a challenging project at work",
        "Start a creative side project with uncertain outcome"
      ],
      timeframe: '6-months' as const
    },
    high_conscientiousness: {
      title: "Create Comprehensive Life System",
      description: "Design and implement systems for maximum productivity and goal achievement",
      category: 'personal' as const,
      actions: [
        "Design morning and evening routines",
        "Implement a comprehensive task management system",
        "Create templates for recurring activities",
        "Set up automated tracking for key life metrics"
      ],
      timeframe: '1-month' as const
    },
    low_patience: {
      title: "Develop Long-term Focus Skills",
      description: "Build capacity for sustained effort on important long-term goals",
      category: 'growth' as const,
      actions: [
        "Choose one significant 1-year goal to focus on",
        "Break the goal into monthly and weekly milestones",
        "Establish weekly progress review sessions",
        "Practice meditation or mindfulness for 10 min daily"
      ],
      timeframe: '1-year' as const
    },
    high_openness: {
      title: "Launch Creative Innovation Project",
      description: "Channel your creativity and openness into a meaningful creative endeavor",
      category: 'personal' as const,
      actions: [
        "Brainstorm 10 creative project ideas",
        "Choose one project and create development timeline",
        "Set aside dedicated creative time each week",
        "Share your work with others for feedback"
      ],
      timeframe: '3-months' as const
    }
  }

  // Generate goals based on personality profile
  let goalId = 1

  // High dimension goals (leverage strengths)
  strengths.forEach(strength => {
    const templateKey = `high_${strength}` as keyof typeof goalTemplates
    const template = goalTemplates[templateKey]
    
    if (template) {
      goals.push({
        id: `goal-${goalId++}`,
        title: template.title,
        description: template.description,
        category: template.category,
        priority: 'high',
        timeframe: template.timeframe,
        progress: Math.floor(Math.random() * 30), // Simulate some progress
        actions: template.actions.map((action, index) => ({
          id: `action-${goalId}-${index}`,
          title: action,
          description: `Complete: ${action}`,
          completed: Math.random() > 0.7 // Some actions randomly completed
        })),
        basedOnStrengths: [strength],
        addressesGrowthAreas: []
      })
    }
  })

  // Low dimension goals (address growth areas)
  growthAreas.forEach(growthArea => {
    const templateKey = `low_${growthArea}` as keyof typeof goalTemplates
    const template = goalTemplates[templateKey]
    
    if (template) {
      goals.push({
        id: `goal-${goalId++}`,
        title: template.title,
        description: template.description,
        category: template.category,
        priority: 'medium',
        timeframe: template.timeframe,
        progress: Math.floor(Math.random() * 20), // Less progress on growth goals
        actions: template.actions.map((action, index) => ({
          id: `action-${goalId}-${index}`,
          title: action,
          description: `Complete: ${action}`,
          completed: Math.random() > 0.8 // Fewer actions completed for growth goals
        })),
        basedOnStrengths: [],
        addressesGrowthAreas: [growthArea]
      })
    }
  })

  // Add a universal goal based on personality type
  goals.push({
    id: `goal-${goalId}`,
    title: `Deepen ${result.profile.family} Understanding`,
    description: `Explore and develop the unique aspects of being a ${result.profile.family} personality type`,
    category: 'personal',
    priority: 'medium',
    timeframe: '3-months',
    progress: 10,
    actions: [
      {
        id: `action-${goalId}-1`,
        title: `Study ${result.profile.family} characteristics and strengths`,
        description: `Research and understand your personality type`,
        completed: false
      },
      {
        id: `action-${goalId}-2`,
        title: `Connect with other ${result.profile.family} types`,
        description: `Find community with similar personality patterns`,
        completed: false
      },
      {
        id: `action-${goalId}-3`,
        title: `Apply ${result.profile.family} insights to daily life`,
        description: `Consciously use personality insights in decisions`,
        completed: false
      }
    ],
    basedOnStrengths: [result.profile.family.toLowerCase()],
    addressesGrowthAreas: []
  })

  return goals.slice(0, 5) // Limit to 5 goals for manageability
}

export function GoalsPlanning({ result }: GoalsPlanningProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  useEffect(() => {
    if (result) {
      const generatedGoals = generateGoalsFromResult(result)
      setGoals(generatedGoals)
    }
  }, [result])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'border-purple-500/30 bg-purple-600/10'
      case 'professional': return 'border-blue-500/30 bg-blue-600/10'
      case 'relationships': return 'border-green-500/30 bg-green-600/10'
      case 'growth': return 'border-yellow-500/30 bg-yellow-600/10'
      default: return 'border-gray-500/30 bg-gray-600/10'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal': return '🧘'
      case 'professional': return '💼'
      case 'relationships': return '🤝'
      case 'growth': return '🌱'
      default: return '🎯'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const toggleActionComplete = (goalId: string, actionId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? {
            ...goal,
            actions: goal.actions.map(action =>
              action.id === actionId
                ? { ...action, completed: !action.completed }
                : action
            )
          }
        : goal
    ))
  }

  if (!result) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-300">Personality-Driven Goals</CardTitle>
            <CardDescription className="text-gray-400">
              Complete an assessment to generate personalized goals based on your Epic Arcana profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-400">Discover goals tailored to your unique personality</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            🎯 Your Personalized Action Plan
          </CardTitle>
          <CardDescription className="text-gray-400">
            Goals generated from your Epic Arcana Chapter {result.chapter} profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {['personal', 'professional', 'relationships', 'growth'].map(category => (
              <div key={category} className={`text-center p-4 rounded-lg border ${getCategoryColor(category)}`}>
                <div className="text-2xl mb-1">{getCategoryIcon(category)}</div>
                <div className="text-lg font-bold text-gray-200">
                  {goals.filter(g => g.category === category).length}
                </div>
                <div className="text-sm text-gray-400 capitalize">{category}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="grid gap-6">
        {goals.map(goal => {
          const completedActions = goal.actions.filter(a => a.completed).length
          const totalActions = goal.actions.length
          const progressPercentage = totalActions > 0 ? (completedActions / totalActions) * 100 : 0

          return (
            <Card key={goal.id} className={`bg-slate-800/50 border ${getCategoryColor(goal.category).split(' ')[0]}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-200">{goal.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="capitalize">{goal.category}</span>
                        <span className={`${getPriorityColor(goal.priority)} capitalize font-medium`}>
                          {goal.priority} priority
                        </span>
                        <span>{goal.timeframe}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-200">{Math.round(progressPercentage)}%</div>
                    <Progress value={progressPercentage} className="w-20 mt-1" />
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{goal.description}</p>

                {/* Actions Checklist */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-purple-300">Action Steps:</h4>
                  {goal.actions.map(action => (
                    <div key={action.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={action.completed}
                        onChange={() => toggleActionComplete(goal.id, action.id)}
                        className="rounded border-gray-600 bg-slate-700 text-purple-600 focus:ring-purple-500"
                      />
                      <span className={`text-sm ${action.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                        {action.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Insights */}
                <div className="flex gap-4 text-xs">
                  {goal.basedOnStrengths.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-green-400">💪</span>
                      <span className="text-gray-400">Leverages: {goal.basedOnStrengths.join(', ')}</span>
                    </div>
                  )}
                  {goal.addressesGrowthAreas.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">🌱</span>
                      <span className="text-gray-400">Develops: {goal.addressesGrowthAreas.join(', ')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Human Framework Insights */}
      <Card className="bg-slate-800/50 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-300">Human Framework Integration</CardTitle>
          <CardDescription className="text-gray-400">
            How these goals align with your personality development
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-blue-300">Strength-Based Goals</h4>
              <p className="text-sm text-gray-400">
                Goals that leverage your natural talents and high-scoring personality dimensions.
                These represent areas where you can achieve excellence with focused effort.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-yellow-300">Growth-Oriented Goals</h4>
              <p className="text-sm text-gray-400">
                Goals that address lower-scoring dimensions and growth opportunities.
                These represent areas for development and increased capability.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg border border-purple-500/20">
            <h4 className="font-medium text-purple-300 mb-2">Your Development Journey</h4>
            <p className="text-sm text-gray-300">
              As a <strong>{result.profile.family}</strong> type, your development follows a unique path. 
              These goals are designed to honor your natural patterns while expanding your capabilities 
              in areas that will have the greatest impact on your personal and professional life.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}