// src/lib/assessments/pos60_v1.ts
export const POS60_V1 = {
    key: "pos60",
    version: "v1",
    title: "Personal Operating System Assessment",
    scale: {
      type: "likert_1_5",
      labels: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    scoring: {
      reverseScore: "6 - value",
      normalizeTo100: "((avg - 1) / 4) * 100",
      bands: [
        { min: 0, max: 39, label: "Needs Attention" },
        { min: 40, max: 59, label: "Developing" },
        { min: 60, max: 79, label: "Strong" },
        { min: 80, max: 100, label: "Exceptional" }
      ]
    },
    domains: [
      {
        id: "focus",
        label: "Focus",
        facets: [
          { id: "distraction_control", label: "Distraction Control" },
          { id: "deep_work", label: "Deep Work Capacity" },
          { id: "attention_clarity", label: "Clarity of Attention" },
          { id: "task_switching_cost", label: "Task Switching Cost" },
          { id: "info_filtering", label: "Information Filtering" },
          { id: "working_rhythm", label: "Working Rhythm" }
        ]
      },
      {
        id: "planning",
        label: "Planning",
        facets: [
          { id: "prioritization", label: "Prioritization" },
          { id: "time_estimation", label: "Time Estimation" },
          { id: "organization_systems", label: "Organization Systems" },
          { id: "goal_clarity", label: "Goal Clarity" },
          { id: "decision_speed", label: "Decision Speed" },
          { id: "risk_awareness", label: "Risk Awareness" }
        ]
      },
      {
        id: "execution",
        label: "Execution",
        facets: [
          { id: "speed_to_start", label: "Speed to Start" },
          { id: "follow_through", label: "Follow-Through" },
          { id: "consistency", label: "Consistency" },
          { id: "quality_standards", label: "Quality Standards" },
          { id: "accountability", label: "Accountability" },
          { id: "momentum", label: "Momentum" }
        ]
      },
      {
        id: "collaboration",
        label: "Collaboration",
        facets: [
          { id: "communication_clarity", label: "Communication Clarity" },
          { id: "responsiveness", label: "Responsiveness" },
          { id: "feedback_skills", label: "Feedback Skills" },
          { id: "reliability_to_others", label: "Reliability to Others" },
          { id: "conflict_handling", label: "Conflict Handling" },
          { id: "influence_without_friction", label: "Influence Without Friction" }
        ]
      },
      {
        id: "resilience",
        label: "Resilience",
        facets: [
          { id: "stress_tolerance", label: "Stress Tolerance" },
          { id: "emotional_regulation", label: "Emotional Regulation" },
          { id: "recovery_speed", label: "Recovery Speed" },
          { id: "boundary_setting", label: "Boundary Setting" },
          { id: "adaptability", label: "Adaptability" },
          { id: "confidence_under_pressure", label: "Confidence Under Pressure" }
        ]
      }
    ],
    questions: [
      // =========================
      // FOCUS (12)
      // =========================
      {
        id: "pos_focus_distraction_control_01",
        domain: "focus",
        facet: "distraction_control",
        reverse_scored: false,
        text: "I can stay focused even when there are notifications or background distractions."
      },
      {
        id: "pos_focus_distraction_control_02",
        domain: "focus",
        facet: "distraction_control",
        reverse_scored: true,
        text: "Small interruptions usually derail me for a long time."
      },
  
      {
        id: "pos_focus_deep_work_01",
        domain: "focus",
        facet: "deep_work",
        reverse_scored: false,
        text: "I can work on one demanding task for an extended period without losing effectiveness."
      },
      {
        id: "pos_focus_deep_work_02",
        domain: "focus",
        facet: "deep_work",
        reverse_scored: false,
        text: "When I schedule a long focus block, I usually follow through and use it well."
      },
  
      {
        id: "pos_focus_attention_clarity_01",
        domain: "focus",
        facet: "attention_clarity",
        reverse_scored: false,
        text: "I can clearly identify the single most important thing to focus on right now."
      },
      {
        id: "pos_focus_attention_clarity_02",
        domain: "focus",
        facet: "attention_clarity",
        reverse_scored: false,
        text: "I rarely feel unsure about what deserves my attention next."
      },
  
      {
        id: "pos_focus_task_switching_cost_01",
        domain: "focus",
        facet: "task_switching_cost",
        reverse_scored: true,
        text: "I frequently jump between tasks even when it slows me down."
      },
      {
        id: "pos_focus_task_switching_cost_02",
        domain: "focus",
        facet: "task_switching_cost",
        reverse_scored: false,
        text: "I minimize context switching by batching similar tasks together."
      },
  
      {
        id: "pos_focus_info_filtering_01",
        domain: "focus",
        facet: "info_filtering",
        reverse_scored: false,
        text: "I can quickly separate useful information from noise."
      },
      {
        id: "pos_focus_info_filtering_02",
        domain: "focus",
        facet: "info_filtering",
        reverse_scored: false,
        text: "I avoid over-consuming content when it doesn’t help my current goals."
      },
  
      {
        id: "pos_focus_working_rhythm_01",
        domain: "focus",
        facet: "working_rhythm",
        reverse_scored: false,
        text: "I know when during the day I work best and I plan around it."
      },
      {
        id: "pos_focus_working_rhythm_02",
        domain: "focus",
        facet: "working_rhythm",
        reverse_scored: true,
        text: "My productivity is random because I don’t have a consistent working rhythm."
      },
  
      // =========================
      // PLANNING (12)
      // =========================
      {
        id: "pos_planning_prioritization_01",
        domain: "planning",
        facet: "prioritization",
        reverse_scored: false,
        text: "I can rank my tasks by impact, not just urgency."
      },
      {
        id: "pos_planning_prioritization_02",
        domain: "planning",
        facet: "prioritization",
        reverse_scored: false,
        text: "I regularly choose what NOT to do so I can focus on what matters."
      },
  
      {
        id: "pos_planning_time_estimation_01",
        domain: "planning",
        facet: "time_estimation",
        reverse_scored: false,
        text: "I usually estimate how long tasks will take with reasonable accuracy."
      },
      {
        id: "pos_planning_time_estimation_02",
        domain: "planning",
        facet: "time_estimation",
        reverse_scored: true,
        text: "I often underestimate tasks and end up rushing at the end."
      },
  
      {
        id: "pos_planning_organization_systems_01",
        domain: "planning",
        facet: "organization_systems",
        reverse_scored: false,
        text: "I have a system to track tasks that I actually use consistently."
      },
      {
        id: "pos_planning_organization_systems_02",
        domain: "planning",
        facet: "organization_systems",
        reverse_scored: true,
        text: "My tasks are scattered across places and I lose track of them."
      },
  
      {
        id: "pos_planning_goal_clarity_01",
        domain: "planning",
        facet: "goal_clarity",
        reverse_scored: false,
        text: "My short-term tasks clearly connect to my longer-term goals."
      },
      {
        id: "pos_planning_goal_clarity_02",
        domain: "planning",
        facet: "goal_clarity",
        reverse_scored: false,
        text: "I can state my main goals clearly enough that others would understand them."
      },
  
      {
        id: "pos_planning_decision_speed_01",
        domain: "planning",
        facet: "decision_speed",
        reverse_scored: false,
        text: "I make decisions efficiently without getting stuck in overthinking."
      },
      {
        id: "pos_planning_decision_speed_02",
        domain: "planning",
        facet: "decision_speed",
        reverse_scored: false,
        text: "When a choice is “good enough,” I decide and move forward."
      },
  
      {
        id: "pos_planning_risk_awareness_01",
        domain: "planning",
        facet: "risk_awareness",
        reverse_scored: false,
        text: "I consider likely obstacles and prepare simple contingencies."
      },
      {
        id: "pos_planning_risk_awareness_02",
        domain: "planning",
        facet: "risk_awareness",
        reverse_scored: true,
        text: "I usually assume things will work out without planning for what could go wrong."
      },
  
      // =========================
      // EXECUTION (12)
      // =========================
      {
        id: "pos_execution_speed_to_start_01",
        domain: "execution",
        facet: "speed_to_start",
        reverse_scored: false,
        text: "I can start tasks quickly, even when I don’t feel motivated."
      },
      {
        id: "pos_execution_speed_to_start_02",
        domain: "execution",
        facet: "speed_to_start",
        reverse_scored: true,
        text: "I often delay getting started until the pressure is high."
      },
  
      {
        id: "pos_execution_follow_through_01",
        domain: "execution",
        facet: "follow_through",
        reverse_scored: false,
        text: "I reliably complete what I commit to."
      },
      {
        id: "pos_execution_follow_through_02",
        domain: "execution",
        facet: "follow_through",
        reverse_scored: false,
        text: "I finish tasks even when they become tedious or inconvenient."
      },
  
      {
        id: "pos_execution_consistency_01",
        domain: "execution",
        facet: "consistency",
        reverse_scored: false,
        text: "I make steady progress most days, not just in bursts."
      },
      {
        id: "pos_execution_consistency_02",
        domain: "execution",
        facet: "consistency",
        reverse_scored: true,
        text: "My effort is inconsistent: I work hard for a while, then drop off."
      },
  
      {
        id: "pos_execution_quality_standards_01",
        domain: "execution",
        facet: "quality_standards",
        reverse_scored: false,
        text: "I maintain a clear standard of quality for my work."
      },
      {
        id: "pos_execution_quality_standards_02",
        domain: "execution",
        facet: "quality_standards",
        reverse_scored: false,
        text: "I review important work before submitting or sharing it."
      },
  
      {
        id: "pos_execution_accountability_01",
        domain: "execution",
        facet: "accountability",
        reverse_scored: false,
        text: "When something slips, I take ownership and correct it quickly."
      },
      {
        id: "pos_execution_accountability_02",
        domain: "execution",
        facet: "accountability",
        reverse_scored: true,
        text: "If a task doesn’t get done, it’s usually because something external got in the way."
      },
  
      {
        id: "pos_execution_momentum_01",
        domain: "execution",
        facet: "momentum",
        reverse_scored: false,
        text: "Once I get moving, I can keep my momentum throughout the day."
      },
      {
        id: "pos_execution_momentum_02",
        domain: "execution",
        facet: "momentum",
        reverse_scored: false,
        text: "I build progress by breaking large tasks into small next steps."
      },
  
      // =========================
      // COLLABORATION (12)
      // =========================
      {
        id: "pos_collaboration_communication_clarity_01",
        domain: "collaboration",
        facet: "communication_clarity",
        reverse_scored: false,
        text: "I communicate expectations clearly (what, when, and why)."
      },
      {
        id: "pos_collaboration_communication_clarity_02",
        domain: "collaboration",
        facet: "communication_clarity",
        reverse_scored: true,
        text: "People often misunderstand me because I leave details unclear."
      },
  
      {
        id: "pos_collaboration_responsiveness_01",
        domain: "collaboration",
        facet: "responsiveness",
        reverse_scored: false,
        text: "I respond in a timely way when others depend on me."
      },
      {
        id: "pos_collaboration_responsiveness_02",
        domain: "collaboration",
        facet: "responsiveness",
        reverse_scored: false,
        text: "I set expectations if I can’t respond quickly (e.g., “I’ll get back to you by…”)."
      },
  
      {
        id: "pos_collaboration_feedback_skills_01",
        domain: "collaboration",
        facet: "feedback_skills",
        reverse_scored: false,
        text: "I can give feedback that is specific, respectful, and useful."
      },
      {
        id: "pos_collaboration_feedback_skills_02",
        domain: "collaboration",
        facet: "feedback_skills",
        reverse_scored: true,
        text: "I avoid feedback conversations even when they would help."
      },
  
      {
        id: "pos_collaboration_reliability_to_others_01",
        domain: "collaboration",
        facet: "reliability_to_others",
        reverse_scored: false,
        text: "Others can count on me to deliver what I promise."
      },
      {
        id: "pos_collaboration_reliability_to_others_02",
        domain: "collaboration",
        facet: "reliability_to_others",
        reverse_scored: false,
        text: "I keep people updated early when timelines change."
      },
  
      {
        id: "pos_collaboration_conflict_handling_01",
        domain: "collaboration",
        facet: "conflict_handling",
        reverse_scored: false,
        text: "I address tension directly and calmly instead of letting it build."
      },
      {
        id: "pos_collaboration_conflict_handling_02",
        domain: "collaboration",
        facet: "conflict_handling",
        reverse_scored: true,
        text: "When conflict shows up, I usually withdraw or avoid the conversation."
      },
  
      {
        id: "pos_collaboration_influence_without_friction_01",
        domain: "collaboration",
        facet: "influence_without_friction",
        reverse_scored: false,
        text: "I can persuade others using clear reasoning and shared goals."
      },
      {
        id: "pos_collaboration_influence_without_friction_02",
        domain: "collaboration",
        facet: "influence_without_friction",
        reverse_scored: false,
        text: "I can lead discussions toward decisions without dominating them."
      },
  
      // =========================
      // RESILIENCE (12)
      // =========================
      {
        id: "pos_resilience_stress_tolerance_01",
        domain: "resilience",
        facet: "stress_tolerance",
        reverse_scored: false,
        text: "I can stay productive even during stressful periods."
      },
      {
        id: "pos_resilience_stress_tolerance_02",
        domain: "resilience",
        facet: "stress_tolerance",
        reverse_scored: false,
        text: "I can keep perspective when pressure is high."
      },
  
      {
        id: "pos_resilience_emotional_regulation_01",
        domain: "resilience",
        facet: "emotional_regulation",
        reverse_scored: false,
        text: "I can notice my emotions without letting them drive my decisions."
      },
      {
        id: "pos_resilience_emotional_regulation_02",
        domain: "resilience",
        facet: "emotional_regulation",
        reverse_scored: true,
        text: "When I’m frustrated, it usually affects how I treat tasks or people."
      },
  
      {
        id: "pos_resilience_recovery_speed_01",
        domain: "resilience",
        facet: "recovery_speed",
        reverse_scored: false,
        text: "After a setback, I can reset and move forward quickly."
      },
      {
        id: "pos_resilience_recovery_speed_02",
        domain: "resilience",
        facet: "recovery_speed",
        reverse_scored: false,
        text: "I can regain focus after a bad day without losing multiple days."
      },
  
      {
        id: "pos_resilience_boundary_setting_01",
        domain: "resilience",
        facet: "boundary_setting",
        reverse_scored: false,
        text: "I set boundaries to protect my time and energy when needed."
      },
      {
        id: "pos_resilience_boundary_setting_02",
        domain: "resilience",
        facet: "boundary_setting",
        reverse_scored: true,
        text: "I say yes to too many things and it hurts my priorities."
      },
  
      {
        id: "pos_resilience_adaptability_01",
        domain: "resilience",
        facet: "adaptability",
        reverse_scored: false,
        text: "When plans change, I adjust quickly and keep moving."
      },
      {
        id: "pos_resilience_adaptability_02",
        domain: "resilience",
        facet: "adaptability",
        reverse_scored: false,
        text: "I can revise my approach when new information shows a better path."
      },
  
      {
        id: "pos_resilience_confidence_under_pressure_01",
        domain: "resilience",
        facet: "confidence_under_pressure",
        reverse_scored: false,
        text: "I can make decisions confidently even when stakes feel high."
      },
      {
        id: "pos_resilience_confidence_under_pressure_02",
        domain: "resilience",
        facet: "confidence_under_pressure",
        reverse_scored: true,
        text: "Under pressure, I second-guess myself so much that I slow down."
      }
    ]
  } as const;  