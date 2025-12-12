export type Career = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  context: string;
  match: number;
  signal: string[];
  shine: string[];
  buildNext: string[];
  outcomes: string[];
  dayToDay: string[];
  artifacts: string[];
};

export const careerCatalog: Career[] = [
  {
    slug: "product-strategist",
    title: "Product Strategist",
    category: "Strategy & Product",
    summary: "Sense-make in ambiguous spaces, align teams on a crisp direction, and land a narrative that moves roadmap and revenue.",
    context: "Hybrid pods · discovery-to-launch · exec exposure",
    match: 92,
    signal: ["Pattern-driven", "Influence-heavy", "0→1 & 1→n"],
    shine: [
      "Shape options when direction is fuzzy",
      "Translate research into narrative and tradeoffs",
      "Protect focus with clear decision frameworks",
    ],
    buildNext: [
      "Finance fluency and pricing levers",
      "Experiment design that scales past MVP",
      "Partner deeply with sales/CS for feedback loops",
    ],
    outcomes: [
      "Roadmap bets tied to a clear business thesis",
      "Decision memos that unblock exec alignment",
      "Experiments with measurable adoption/retention lifts",
    ],
    dayToDay: [
      "Run weekly prioritization beats with PM/Design/Eng",
      "Host synthesis sessions from user calls and data cuts",
      "Draft briefs and artifacts that clarify scope and success",
    ],
    artifacts: [
      "North star and guardrails doc",
      "Quarterly bet slate with ROI estimates",
      "Launch narrative + KPI dashboard",
    ],
  },
  {
    slug: "learning-experience-designer",
    title: "Learning Experience Designer",
    category: "Learning & Enablement",
    summary: "Design experiences that grow capability—sequenced content, practice, and measurement to prove skill lift.",
    context: "Remote-first · education & enablement · cohort or self-serve",
    match: 88,
    signal: ["Creative", "Data-aware", "High empathy"],
    shine: [
      "Story-first journeys that keep learners engaged",
      "Assessment that measures real skill transfer",
      "Visual systems that make complex ideas graspable",
    ],
    buildNext: [
      "Content ops automation",
      "Adaptive assessments with data backpressure",
      "Stakeholder comms for program adoption",
    ],
    outcomes: [
      "Measured uplift in target skills or behaviors",
      "Completion + satisfaction with clear NPS/CSAT",
      "Reusable patterns/templates for future programs",
    ],
    dayToDay: [
      "Storyboarding modules with SMEs and PMs",
      "Piloting sessions, collecting feedback, iterating",
      "Instrumenting quizzes and rubrics for proficiency",
    ],
    artifacts: [
      "Module maps and storyboard decks",
      "Assessment rubric and analytics snapshot",
      "Facilitator guide + learner workbook",
    ],
  },
  {
    slug: "customer-insights-lead",
    title: "Customer Insights Lead",
    category: "Research & Insights",
    summary: "Bridge qualitative signals and quantitative proof to shape roadmap, GTM, and messaging with confidence.",
    context: "Research + strategy bridge · exec-ready briefs · field to boardroom",
    match: 85,
    signal: ["Analytical", "Trusted advisor", "Systems thinker"],
    shine: [
      "Run VOC programs that tie to revenue/retention",
      "Craft executive-ready briefs and POVs",
      "Connect product, sales, and marketing narratives",
    ],
    buildNext: [
      "Causal analytics and instrumentation",
      "Workshop facilitation playbooks",
      "Modeling TAM/SAM/SOM with data partners",
    ],
    outcomes: [
      "Clear POV on where to win and where not to play",
      "Messaging validated with signal on adoption/close",
      "Roadmap shifts tied to quantified opportunity",
    ],
    dayToDay: [
      "Plan and run interviews, surveys, and field shadowing",
      "Synthesize insights into briefs and decision memos",
      "Partner with data to size opportunities and risks",
    ],
    artifacts: [
      "Quarterly insights report with recommendations",
      "Opportunity sizing model",
      "Workshop deck with decisions and owners",
    ],
  },
];
