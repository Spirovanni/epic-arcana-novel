// Personal Operating System (POS-60) assessment configuration.
// Types are exported for reuse across API/UI/scoring while preserving the provided question bank verbatim.

export type PosDomainKey = 'focus' | 'planning' | 'execution' | 'collaboration' | 'resilience';

export type PosFacet = { key: string; label: string };

export type PosQuestion = {
  id: string;
  domain: PosDomainKey;
  facet: string;
  reverse_scored?: boolean;
  text: string;
  prompt?: string;
  statement?: string;
};

export type PosAssessmentConfig = {
  key: 'pos60';
  version: 'v1';
  title: string;
  scale: {
    type: string;
    labels: string[];
  };
  scoring: {
    reverseScore: string;
    normalizeTo100: string;
    bands: Array<{ min: number; max: number; label: string }>;
  };
  domains: Record<PosDomainKey, { label: string; facets: PosFacet[] }>;
  questions: PosQuestion[];
};

export const POS60_V1: PosAssessmentConfig = {
  key: 'pos60',
  version: 'v1',
  title: 'Personal Operating System Assessment',
  scale: {
    type: 'likert_1_5',
    labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  },
  scoring: {
    reverseScore: '6 - value',
    normalizeTo100: '((avg - 1) / 4) * 100',
    bands: [
      { min: 0, max: 39, label: 'Needs Attention' },
      { min: 40, max: 59, label: 'Developing' },
      { min: 60, max: 79, label: 'Strong' },
      { min: 80, max: 100, label: 'Exceptional' },
    ],
  },
  domains: {
    focus: {
      label: 'Focus',
      facets: [
        { key: 'distraction_control', label: 'Distraction Control' },
        { key: 'deep_work', label: 'Deep Work Capacity' },
        { key: 'attention_clarity', label: 'Clarity of Attention' },
        { key: 'task_switching_cost', label: 'Task Switching Cost' },
        { key: 'info_filtering', label: 'Information Filtering' },
        { key: 'working_rhythm', label: 'Working Rhythm' },
      ],
    },
    planning: {
      label: 'Planning',
      facets: [
        { key: 'prioritization', label: 'Prioritization' },
        { key: 'time_estimation', label: 'Time Estimation' },
        { key: 'organization_systems', label: 'Organization Systems' },
        { key: 'goal_clarity', label: 'Goal Clarity' },
        { key: 'decision_speed', label: 'Decision Speed' },
        { key: 'risk_awareness', label: 'Risk Awareness' },
      ],
    },
    execution: {
      label: 'Execution',
      facets: [
        { key: 'speed_to_start', label: 'Speed to Start' },
        { key: 'follow_through', label: 'Follow-Through' },
        { key: 'consistency', label: 'Consistency' },
        { key: 'quality_standards', label: 'Quality Standards' },
        { key: 'accountability', label: 'Accountability' },
        { key: 'momentum', label: 'Momentum' },
      ],
    },
    collaboration: {
      label: 'Collaboration',
      facets: [
        { key: 'communication_clarity', label: 'Communication Clarity' },
        { key: 'responsiveness', label: 'Responsiveness' },
        { key: 'feedback_skills', label: 'Feedback Skills' },
        { key: 'reliability_to_others', label: 'Reliability to Others' },
        { key: 'conflict_handling', label: 'Conflict Handling' },
        { key: 'influence_without_friction', label: 'Influence Without Friction' },
      ],
    },
    resilience: {
      label: 'Resilience',
      facets: [
        { key: 'stress_tolerance', label: 'Stress Tolerance' },
        { key: 'emotional_regulation', label: 'Emotional Regulation' },
        { key: 'recovery_speed', label: 'Recovery Speed' },
        { key: 'boundary_setting', label: 'Boundary Setting' },
        { key: 'adaptability', label: 'Adaptability' },
        { key: 'confidence_under_pressure', label: 'Confidence Under Pressure' },
      ],
    },
  },
  questions: [
    // =========================
    // FOCUS (12)
    // =========================
    {
      id: 'pos_focus_distraction_control_01',
      domain: 'focus',
      facet: 'distraction_control',
      reverse_scored: false,
      text: 'I can stay focused even when there are notifications or background distractions.',
    },
    {
      id: 'pos_focus_distraction_control_02',
      domain: 'focus',
      facet: 'distraction_control',
      reverse_scored: true,
      text: 'Small interruptions usually derail me for a long time.',
    },

    {
      id: 'pos_focus_deep_work_01',
      domain: 'focus',
      facet: 'deep_work',
      reverse_scored: false,
      text: 'I can work on one demanding task for an extended period without losing effectiveness.',
    },
    {
      id: 'pos_focus_deep_work_02',
      domain: 'focus',
      facet: 'deep_work',
      reverse_scored: false,
      text: 'When I schedule a long focus block, I usually follow through and use it well.',
    },

    {
      id: 'pos_focus_attention_clarity_01',
      domain: 'focus',
      facet: 'attention_clarity',
      reverse_scored: false,
      text: 'I can clearly identify the single most important thing to focus on right now.',
    },
    {
      id: 'pos_focus_attention_clarity_02',
      domain: 'focus',
      facet: 'attention_clarity',
      reverse_scored: false,
      text: 'I rarely feel unsure about what deserves my attention next.',
    },

    {
      id: 'pos_focus_task_switching_cost_01',
      domain: 'focus',
      facet: 'task_switching_cost',
      reverse_scored: true,
      text: 'I frequently jump between tasks even when it slows me down.',
    },
    {
      id: 'pos_focus_task_switching_cost_02',
      domain: 'focus',
      facet: 'task_switching_cost',
      reverse_scored: false,
      text: 'I minimize context switching by batching similar tasks together.',
    },

    {
      id: 'pos_focus_info_filtering_01',
      domain: 'focus',
      facet: 'info_filtering',
      reverse_scored: false,
      text: 'I can quickly separate useful information from noise.',
    },
    {
      id: 'pos_focus_info_filtering_02',
      domain: 'focus',
      facet: 'info_filtering',
      reverse_scored: false,
      text: "I avoid over-consuming content when it doesn't help my current goals.",
    },

    {
      id: 'pos_focus_working_rhythm_01',
      domain: 'focus',
      facet: 'working_rhythm',
      reverse_scored: false,
      text: 'I know when during the day I work best and I plan around it.',
    },
    {
      id: 'pos_focus_working_rhythm_02',
      domain: 'focus',
      facet: 'working_rhythm',
      reverse_scored: true,
      text: "My productivity is random because I don't have a consistent working rhythm.",
    },

    // =========================
    // PLANNING (12)
    // =========================
    {
      id: 'pos_planning_prioritization_01',
      domain: 'planning',
      facet: 'prioritization',
      reverse_scored: false,
      text: 'I can rank my tasks by impact, not just urgency.',
    },
    {
      id: 'pos_planning_prioritization_02',
      domain: 'planning',
      facet: 'prioritization',
      reverse_scored: false,
      text: 'I regularly choose what NOT to do so I can focus on what matters.',
    },

    {
      id: 'pos_planning_time_estimation_01',
      domain: 'planning',
      facet: 'time_estimation',
      reverse_scored: false,
      text: 'I usually estimate how long tasks will take with reasonable accuracy.',
    },
    {
      id: 'pos_planning_time_estimation_02',
      domain: 'planning',
      facet: 'time_estimation',
      reverse_scored: true,
      text: 'I frequently underestimate how long tasks will take.',
    },

    {
      id: 'pos_planning_organization_systems_01',
      domain: 'planning',
      facet: 'organization_systems',
      reverse_scored: false,
      text: 'I have a clear system to capture and organize tasks, ideas, and commitments.',
    },
    {
      id: 'pos_planning_organization_systems_02',
      domain: 'planning',
      facet: 'organization_systems',
      reverse_scored: false,
      text: 'I regularly clean up and review my task/project lists to keep them actionable.',
    },

    {
      id: 'pos_planning_goal_clarity_01',
      domain: 'planning',
      facet: 'goal_clarity',
      reverse_scored: false,
      text: 'I can define clear outcomes for the week that align to my larger goals.',
    },
    {
      id: 'pos_planning_goal_clarity_02',
      domain: 'planning',
      facet: 'goal_clarity',
      reverse_scored: false,
      text: 'Before starting a task, I know what success looks like.',
    },

    {
      id: 'pos_planning_decision_speed_01',
      domain: 'planning',
      facet: 'decision_speed',
      reverse_scored: false,
      text: 'I make decisions quickly enough that work keeps moving forward.',
    },
    {
      id: 'pos_planning_decision_speed_02',
      domain: 'planning',
      facet: 'decision_speed',
      reverse_scored: true,
      text: 'I often get stuck deciding between options and delay action.',
    },

    {
      id: 'pos_planning_risk_awareness_01',
      domain: 'planning',
      facet: 'risk_awareness',
      reverse_scored: false,
      text: 'I can spot potential blockers or risks early and plan around them.',
    },
    {
      id: 'pos_planning_risk_awareness_02',
      domain: 'planning',
      facet: 'risk_awareness',
      reverse_scored: false,
      text: 'I regularly assess if a plan is realistic given constraints.',
    },

    // =========================
    // EXECUTION (12)
    // =========================
    {
      id: 'pos_execution_speed_to_start_01',
      domain: 'execution',
      facet: 'speed_to_start',
      reverse_scored: false,
      text: 'I usually begin important tasks promptly without overthinking.',
    },
    {
      id: 'pos_execution_speed_to_start_02',
      domain: 'execution',
      facet: 'speed_to_start',
      reverse_scored: true,
      text: "I delay starting tasks even when I know they're important.",
    },

    {
      id: 'pos_execution_follow_through_01',
      domain: 'execution',
      facet: 'follow_through',
      reverse_scored: false,
      text: 'Once I start a task, I finish it on time.',
    },
    {
      id: 'pos_execution_follow_through_02',
      domain: 'execution',
      facet: 'follow_through',
      reverse_scored: false,
      text: 'I rarely abandon tasks midway.',
    },

    {
      id: 'pos_execution_consistency_01',
      domain: 'execution',
      facet: 'consistency',
      reverse_scored: false,
      text: 'My productivity is steady across most days, not just on good days.',
    },
    {
      id: 'pos_execution_consistency_02',
      domain: 'execution',
      facet: 'consistency',
      reverse_scored: true,
      text: 'My output fluctuates wildly depending on how I feel.',
    },

    {
      id: 'pos_execution_quality_standards_01',
      domain: 'execution',
      facet: 'quality_standards',
      reverse_scored: false,
      text: 'I deliver work that meets or exceeds the quality bar without needing multiple revisions.',
    },
    {
      id: 'pos_execution_quality_standards_02',
      domain: 'execution',
      facet: 'quality_standards',
      reverse_scored: false,
      text: 'I check my work for errors and polish before sharing.',
    },

    {
      id: 'pos_execution_accountability_01',
      domain: 'execution',
      facet: 'accountability',
      reverse_scored: false,
      text: "I consistently do what I say I'll do.",
    },
    {
      id: 'pos_execution_accountability_02',
      domain: 'execution',
      facet: 'accountability',
      reverse_scored: true,
      text: 'Deadlines slip because I underestimate my responsibility to others.',
    },

    {
      id: 'pos_execution_momentum_01',
      domain: 'execution',
      facet: 'momentum',
      reverse_scored: false,
      text: 'When I get stuck, I can quickly regain momentum.',
    },
    {
      id: 'pos_execution_momentum_02',
      domain: 'execution',
      facet: 'momentum',
      reverse_scored: true,
      text: "If I miss a day or two of work, it's hard to get moving again.",
    },

    // =========================
    // COLLABORATION (12)
    // =========================
    {
      id: 'pos_collaboration_communication_clarity_01',
      domain: 'collaboration',
      facet: 'communication_clarity',
      reverse_scored: false,
      text: "I communicate updates clearly so others aren't left guessing.",
    },
    {
      id: 'pos_collaboration_communication_clarity_02',
      domain: 'collaboration',
      facet: 'communication_clarity',
      reverse_scored: true,
      text: 'People often misunderstand my updates or requests.',
    },

    {
      id: 'pos_collaboration_responsiveness_01',
      domain: 'collaboration',
      facet: 'responsiveness',
      reverse_scored: false,
      text: 'I respond to messages and requests in a timely manner.',
    },
    {
      id: 'pos_collaboration_responsiveness_02',
      domain: 'collaboration',
      facet: 'responsiveness',
      reverse_scored: false,
      text: 'I negotiate response times so others know when to expect replies.',
    },

    {
      id: 'pos_collaboration_feedback_skills_01',
      domain: 'collaboration',
      facet: 'feedback_skills',
      reverse_scored: false,
      text: 'I can give constructive feedback without damaging relationships.',
    },
    {
      id: 'pos_collaboration_feedback_skills_02',
      domain: 'collaboration',
      facet: 'feedback_skills',
      reverse_scored: false,
      text: 'I actively ask for feedback and use it.',
    },

    {
      id: 'pos_collaboration_reliability_to_others_01',
      domain: 'collaboration',
      facet: 'reliability_to_others',
      reverse_scored: false,
      text: 'Others can rely on me to deliver what they need on time.',
    },
    {
      id: 'pos_collaboration_reliability_to_others_02',
      domain: 'collaboration',
      facet: 'reliability_to_others',
      reverse_scored: true,
      text: "I sometimes miss commitments to others because I'm overloaded or disorganized.",
    },

    {
      id: 'pos_collaboration_conflict_handling_01',
      domain: 'collaboration',
      facet: 'conflict_handling',
      reverse_scored: false,
      text: 'I address conflicts directly and respectfully.',
    },
    {
      id: 'pos_collaboration_conflict_handling_02',
      domain: 'collaboration',
      facet: 'conflict_handling',
      reverse_scored: true,
      text: "I avoid difficult conversations even when they're needed.",
    },

    {
      id: 'pos_collaboration_influence_without_friction_01',
      domain: 'collaboration',
      facet: 'influence_without_friction',
      reverse_scored: false,
      text: 'I can influence decisions without creating friction or resistance.',
    },
    {
      id: 'pos_collaboration_influence_without_friction_02',
      domain: 'collaboration',
      facet: 'influence_without_friction',
      reverse_scored: false,
      text: 'People tend to support my proposals or ideas.',
    },

    // =========================
    // RESILIENCE (12)
    // =========================
    {
      id: 'pos_resilience_stress_tolerance_01',
      domain: 'resilience',
      facet: 'stress_tolerance',
      reverse_scored: false,
      text: 'I stay effective under pressure or tight deadlines.',
    },
    {
      id: 'pos_resilience_stress_tolerance_02',
      domain: 'resilience',
      facet: 'stress_tolerance',
      reverse_scored: true,
      text: 'Stress often reduces the quality of my work.',
    },

    {
      id: 'pos_resilience_emotional_regulation_01',
      domain: 'resilience',
      facet: 'emotional_regulation',
      reverse_scored: false,
      text: 'I can calm myself quickly when something frustrating happens.',
    },
    {
      id: 'pos_resilience_emotional_regulation_02',
      domain: 'resilience',
      facet: 'emotional_regulation',
      reverse_scored: true,
      text: 'My emotions frequently affect my decisions or interactions at work.',
    },

    {
      id: 'pos_resilience_recovery_speed_01',
      domain: 'resilience',
      facet: 'recovery_speed',
      reverse_scored: false,
      text: 'I bounce back quickly after setbacks or mistakes.',
    },
    {
      id: 'pos_resilience_recovery_speed_02',
      domain: 'resilience',
      facet: 'recovery_speed',
      reverse_scored: false,
      text: 'I can reset and refocus quickly after context switches or disruptions.',
    },

    {
      id: 'pos_resilience_boundary_setting_01',
      domain: 'resilience',
      facet: 'boundary_setting',
      reverse_scored: false,
      text: 'I set boundaries to protect my focus and energy.',
    },
    {
      id: 'pos_resilience_boundary_setting_02',
      domain: 'resilience',
      facet: 'boundary_setting',
      reverse_scored: true,
      text: 'I often say yes to requests that crowd out my priorities.',
    },

    {
      id: 'pos_resilience_adaptability_01',
      domain: 'resilience',
      facet: 'adaptability',
      reverse_scored: false,
      text: 'I adjust quickly when priorities or plans change.',
    },
    {
      id: 'pos_resilience_adaptability_02',
      domain: 'resilience',
      facet: 'adaptability',
      reverse_scored: false,
      text: "I can switch strategies when something isn't working.",
    },

    {
      id: 'pos_resilience_confidence_under_pressure_01',
      domain: 'resilience',
      facet: 'confidence_under_pressure',
      reverse_scored: false,
      text: 'I trust my judgment and skills even in stressful situations.',
    },
    {
      id: 'pos_resilience_confidence_under_pressure_02',
      domain: 'resilience',
      facet: 'confidence_under_pressure',
      reverse_scored: false,
      text: 'I stay composed and decisive when things go wrong.',
    },
  ],
};
