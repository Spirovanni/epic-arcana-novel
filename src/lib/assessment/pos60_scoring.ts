import { POS60_V1, PosDomainKey, PosQuestion } from './pos60_v1'

export type PosDomainScores = Record<PosDomainKey, number>
export type PosFacetScores = Record<PosDomainKey, Record<string, number>>

export type PosInsights = {
  strengths: string[]
  leverage_points: string[]
  seven_day_plan: Array<{ day: number; focus: string; action: string }>
}

export type PosComputedResults = {
  domain_scores: PosDomainScores
  facet_scores: PosFacetScores
  insights: PosInsights
}

const DOMAIN_KEYS: PosDomainKey[] = ['focus', 'planning', 'execution', 'collaboration', 'resilience']

function normalizeScore(avg: number) {
  return ((avg - 1) / 4) * 100
}

type FacetAccumulator = Record<string, { domain: PosDomainKey; values: number[] }>

function buildFacetMap(questions: PosQuestion[]) {
  return questions.reduce<FacetAccumulator>((acc, q) => {
    const key = `${q.domain}|${q.facet}`
    if (!acc[key]) acc[key] = { domain: q.domain, values: [] }
    return acc
  }, {})
}

function collectFacetScores(answers: Record<string, number>, questions: PosQuestion[]) {
  const facetMap = buildFacetMap(questions)
  const missing: string[] = []

  for (const question of questions) {
    const value = answers[question.id]
    if (value === undefined || value === null) {
      missing.push(question.id)
      continue
    }
    const normalizedValue = question.reverse_scored ? 6 - value : value
    const key = `${question.domain}|${question.facet}`
    facetMap[key]?.values.push(normalizedValue)
  }

  if (missing.length) {
    throw new Error(`Missing answers for ${missing.length} question(s): ${missing.join(', ')}`)
  }

  return facetMap
}

export function formatFacetLabel(domain: PosDomainKey, facetKey: string) {
  const domainDef = POS60_V1.domains[domain]
  const facetDef = domainDef?.facets.find((f) => f.key === facetKey)
  if (facetDef?.label) return facetDef.label
  return facetKey
}

function buildSevenDayPlan(leverage: Array<{ domain: PosDomainKey; facet: string; label: string }>) {
  if (!leverage.length) return []
  const templates = [
    (label: string) => `Set one clear win for the day tied to ${label}, then block 25 minutes to start it.`,
    (label: string) => `Write a two-sentence plan for ${label} and share it with a teammate for accountability.`,
    (label: string) => `Identify the smallest next action for ${label} and do it before noon.`,
    (label: string) => `Create a checklist for ${label} and complete the top three items.`,
    (label: string) => `Schedule a 15-minute reflection: what slowed ${label} yesterday? Remove one friction.`,
    (label: string) => `Pair with someone or ask for feedback on ${label} to spot blind spots quickly.`,
    (label: string) => `Review progress on ${label}, keep what worked, and set a fresh target for tomorrow.`,
  ]

  return templates.map((fn, idx) => {
    const target = leverage[idx % leverage.length]
    return {
      day: idx + 1,
      focus: target.label,
      action: fn(target.label),
    }
  })
}

export function scorePosAssessment(answers: Record<string, number>): PosComputedResults {
  const facetMap = collectFacetScores(answers, POS60_V1.questions)

  const facetScores: PosFacetScores = {
    focus: {},
    planning: {},
    execution: {},
    collaboration: {},
    resilience: {},
  }

  for (const [key, entry] of Object.entries(facetMap)) {
    const [domain, facet] = key.split('|') as [PosDomainKey, string]
    if (!entry.values.length) {
      throw new Error(`Facet ${facet} is missing responses`)
    }
    const avg = entry.values.reduce((sum, v) => sum + v, 0) / entry.values.length
    facetScores[domain][facet] = Number(normalizeScore(avg).toFixed(2))
  }

  const domainScores: PosDomainScores = {
    focus: 0,
    planning: 0,
    execution: 0,
    collaboration: 0,
    resilience: 0,
  }

  for (const domain of DOMAIN_KEYS) {
    const facets = Object.values(facetScores[domain])
    if (!facets.length) {
      throw new Error(`Domain ${domain} is missing facet scores`)
    }
    const avg = facets.reduce((sum, v) => sum + v, 0) / facets.length
    domainScores[domain] = Number(avg.toFixed(2))
  }

  const facetEntries = Object.entries(facetScores).flatMap(([domain, facets]) =>
    Object.entries(facets).map(([facet, score]) => ({
      domain: domain as PosDomainKey,
      facet,
      label: formatFacetLabel(domain as PosDomainKey, facet),
      score,
    }))
  )

  const strengths = [...facetEntries].sort((a, b) => b.score - a.score).slice(0, 3)
  const leveragePoints = [...facetEntries].sort((a, b) => a.score - b.score).slice(0, 3)

  const insights: PosInsights = {
    strengths: strengths.map((f) => f.label),
    leverage_points: leveragePoints.map((f) => f.label),
    seven_day_plan: buildSevenDayPlan(leveragePoints),
  }

  return {
    domain_scores: domainScores,
    facet_scores: facetScores,
    insights,
  }
}
